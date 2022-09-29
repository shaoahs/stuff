(function() {

    var getTimestamp;
    if (window.performance === undefined || window.performance.now === undefined) {
        console.log("window.performance.now is not available; using Date.now() for benchmarking");
        getTimestamp = Date.now;
    } else {
        console.log("window.performance.now is available; using window.performance.now() for benchmarking");
        getTimestamp = window.performance.now.bind(window.performance);
    }

    var devicePixelRatio = window.devicePixelRatio || 1;

	var auto = OGVLoader.wasmSupported() ? 'wasm' : 'js';
	document.getElementById('auto-select').text += ' (' + auto + ')';

    if (window.crossOriginIsolated) {
        OGVLoader.base = 'threaded.php';
    }

    var player;

    /**
     * dictionary -> URL query string params
     */
    function arrayToCgi(params) {
        var components = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var pair = encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                components[components.length] = pair;
            }
        }
        return components.join('&');
    }

    /**
     * Make a call to Commons API over JSONP
     *
     * @param object params
     * @param function(jsonData) callback
     */
    function commonsApi(params, callback) {
        var baseUrl = 'https://commons.wikimedia.org/w/api.php';
        var url = baseUrl + '?&origin=*'; // anonymous CORS
        var payload = arrayToCgi(params) + '&format=json';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 400) {
                    throw new Error('Unexpected error ' + xhr.status + 'from Commons API');
                }
                var data = JSON.parse(xhr.responseText);
                callback(data);
            }
        };
        xhr.send(payload);
    }


    function getExtension(filename) {
        var matches = filename.match(/\.([^\.]+)$/);
        if (matches) {
            return matches[1].toLowerCase();
        } else {
            throw new Error("uhhhh no extension on " + filename);
        }
    }

    function firstPageInApiResult(data) {
        var pages = data.query.pages;
        for (var id in pages) {
            if (pages.hasOwnProperty(id)) {
                return pages[id];
            }
        }
        throw new Error("waaaah no pages in pages");
    }

    /**
     * @param String media
     * @param function({duration}, [{format, title, width, height, url}]) callback
     */
    function findSourcesForMedia(media, callback) {
        media = media.replace(/_/g, ' ');
        commonsApi({
            action: 'query',
            prop: 'videoinfo',
            titles: media,
            viprop: 'url|size|mediatype|metadata|derivatives',
            viurlwidth: 1280,
            viurlheight: 720,
            redirects: 1
        }, function(data, err) {

            var sources = [],
                page = firstPageInApiResult(data);
            if (page && ('videoinfo' in page)) {
                // yay
            } else {
                console.log("Skipping missing image data");
                console.log(page);
                return;
            }

            var imageinfo = page.videoinfo[0],
                derivatives = imageinfo.derivatives;

            function findMetadata(name) {
                var meta = imageinfo.metadata;
                for (var i = 0; i < meta.length; i++) {
                    var pair = meta[i];
                    if (pair.name === name) {
                        return pair.value;
                    }
                }
                return undefined;
            }
            var mediaInfo = {
                mediatype: imageinfo.mediatype,
                duration: findMetadata('length') || findMetadata('playtime_seconds'),
                thumburl: imageinfo.thumburl,
                thumbwidth: imageinfo.thumbwidth,
                thumbheight: imageinfo.thumbheight
            };

            // Build entries for the transcodes
            // Build an entry for the original media
            var ext = getExtension(imageinfo.url),
                format,
                useOriginal = true;
            if (ext == 'ogg') {
                format = 'ogv'; // todo: check video/audioness
            } else if (ext == 'ogv') {
                format = 'ogv';
            } else if (ext == 'oga') {
                // uhhhh.
                format = 'oga';
            } else if (ext == 'opus') {
                format = 'opus';
            } else if (ext == 'webm') {
                format = 'webm';
            } else {
                console.log("Unexpected file extension " + ext);
                format = ext;
                useOriginal = false;
            }
            if (useOriginal) {
                sources.push({
                    key: 'original',
                    format: format,
                    width: imageinfo.width,
                    height: imageinfo.height,
                    url: imageinfo.url,
                    size: imageinfo.size,
                    bitrate: imageinfo.size * 8 / mediaInfo.duration
                });
            }
            if (derivatives) {
                for (var i = 0; i < derivatives.length; i++) {
                    var transcode = derivatives[i];
                    if ('transcodekey' in transcode) {
                        var key = transcode.transcodekey;
                        var format, height, matches;
                        matches = key.match(/^(\d+)p\.(.*?)$/);
                        if (matches) {
                            format = matches[2];
                        } else {
                            format = key;
                        }
                        sources.push({
                            key: key,
                            format: format,
                            width: transcode.height,
                            height: transcode.width,
                            url: transcode.src,
                            size: Math.round(transcode.bandwidth * mediaInfo.duration / 8),
                            bitrate: transcode.bandwidth
                        });
                    }
                }
            }

            callback(mediaInfo, sources);
        });
    }

    var container = document.getElementById('player'),
        selectedTitle = null,
        selectedUrl = null,
        skipAudio = false,
        playerBackend = 'auto',
        muted = false,
        startTime = 0,
        autoplay = false;

    var mediaList = document.getElementById('media-list'),
        filter = document.getElementById('filter');

    function getDefault() {
        if (document.location.hash.length > 1) {
            var title;
            playerBackend = 'auto';
            document.location.hash.slice(1).split('&').forEach(function(pair) {
                var parts = pair.split('='),
                    name = decodeURIComponent(parts[0]),
                    value = decodeURIComponent(parts[1]);
                skipAudio = false;
                if (name === 'file') {
                    title = value;
                } else if (name === 'search') {
                    filter.value = value;
                } else if (name === 'mute') {
                    muted = (value == '1');
                } else if (name === 'size') {
                    var selector = document.getElementById('video-preferred-size');
                    selector.value = value;
                    preferredKey = value;
                } else if (name == 'audio') {
                    if (value == '0') {
                        skipAudio = true;
                    }
                } else if (name == 'player') {
                    document.getElementById('player-backend').value = value;
                    playerBackend = value;
                } else if (name == 'source') {
                    document.querySelector('#media-source').value = value;
                }
            });
            if (title) {
                return 'File:' + title;
            }
        }

        // classics! soothing noises, no lipsync to worry about
        //return 'File:Jarry_-_Métro_de_Montréal_(640×360).ogv';

        // clean CG imagery, 1080p source, sound effects but no speech
        //return 'File:Caminandes_-_Gran_Dillama_-_Blender_Foundation\'s_new_Open_Movie.webm';

        // video mostly talking heads, 1080p source, speech needs lipsync
        //return 'File:How_Open_Access_Empowered_a_16-Year-Old_to_Make_Cancer_Breakthrough.ogv';

        // video mostly talking heads, 720p source, speech needs lipsync
        //return 'File:¿Qué es Wikipedia?.ogv';

        // long live-action, mix of various types. 720p+ source, speech needs lipsync
        //return 'File:Knowledge_for_Everyone_(no_subtitles).webm';

        // classics! 720p source, mix of gfx and talking heads. speech needs libsync
        return 'File:Curiosity\'s_Seven_Minutes_of_Terror.ogv';
    }

    var chooserState = 0,
        typingSearchTimeout = null,
        lastSearchValue = null;
    function dismissChooser() {
        document.getElementById('media-chooser-stub').className = '';
        document.getElementById('media-chooser').className = '';
    }
    document.getElementById('media-chooser-stub').addEventListener('click', function() {
        dismissChooser();
    });
    document.querySelector('#media-source').addEventListener('change', function() {
        lastSearchValue = null;
        dismissChooser();
        stopVideo();
        setHash();
        showVideo();
        showChooser();
    });
    function showChooser() {
        var sourceMode = document.querySelector('#media-source').value;

        if (typingSearchTimeout) {
            clearTimeout(typingSearchTimeout);
            typingSearchTimeout = null;
        }
        setHash();

        document.getElementById('media-chooser-stub').className = 'active';
        document.getElementById('media-chooser').className = 'active';

        if (lastSearchValue == filter.value) {
            return;
        }
        lastSearchValue = filter.value;
        var filterString = filter.value.toLowerCase().replace(/^\s+/, '').replace(/\s+$/, '');

        function passFilter(title) {
            return filterString == '' || title.toLowerCase().indexOf(filterString) != -1;
        }

        var selection = [],
            searchQuery = null,
            frameRates = {},
            descriptions = {};
        
        function processList(shortlist) {
            shortlist.forEach(function(item) {
                var title = item[0],
                    format = item[1],
                    desc = item[2];
                if (passFilter(title) || passFilter(format) || passFilter(desc)) {
                    selection.push(title);
                    var bits = format.split(/p/);
                    frameRates[title] = parseFloat(bits[1]);
                    descriptions[title] = desc;
                }
            });
        }
        if (sourceMode == 'motd') {
            searchQuery = 'filetype:video incategory:"Media of the Day" ' + filterString;
        } else if (sourceMode == 'commons') {
            searchQuery = 'filetype:video ' + filterString;
        } else if (sourceMode == 'commons-audio') {
          searchQuery = 'filetype:audio ' + filterString;
        } else {
            throw new Error('unexpected sourceMode');
        }

        mediaList.innerHTML = '';

        if (selection.length == 0 && searchQuery == null) {
            mediaList.appendChild(document.createTextNode('No matches'));
            return;
        }

        chooserState++;
        var state = chooserState;
        var apiCall = {
            action: 'query',
            prop: 'imageinfo',
            iiprop: 'url|size',
            iiurlwidth: 128 * devicePixelRatio,
            iiurlheight: 128 * devicePixelRatio,
        };
        if (searchQuery == null) {
          apiCall.titles = selection.join('|');
        } else {
          apiCall.generator = 'search';
          apiCall.gsrsearch = searchQuery;
          apiCall.gsrnamespace = 6;
          apiCall.gsrlimit = 50;
        }
        
        commonsApi(apiCall, function(data) {
            if (state == chooserState) {
                var pages,
                    mediaItems = {},
                    foundPages = [];

                if ('query' in data && 'pages' in data.query) {
                  pages = data.query.pages;
                } else {
                  pages = [];
                }
                for (var pageId in pages) {
                    if (pages.hasOwnProperty(pageId)) {
                        var page = pages[pageId];
                        if (page.imageinfo) {
                            var imageinfo = page.imageinfo[0];
                            mediaItems[page.title] = imageinfo;
                            foundPages.push(page.title);
                        }
                    }
                }
                if (searchQuery !== null) {
                  selection = foundPages;
                }
                if (selection.length == 0) {
                    mediaList.appendChild(document.createTextNode('No matches'));
                }
                selection.forEach(function(title) {
                    var imageinfo = mediaItems[title];
                    if (imageinfo) {
                        var fmt = imageinfo.width + 'x' + imageinfo.height;
                        if (fmt == '0x0') {
                            fmt = 'audio';
                        }
                        if (frameRates[title]) {
                            fmt += ' ';
                            fmt += frameRates[title];
                            fmt += 'fps';
                        }
                        addMediaSelector(title, imageinfo, fmt, descriptions[title]);
                    }
                });
            }
        });
    }
    filter.addEventListener('change', showChooser);
    document.querySelector('#searchform').addEventListener('submit', function(event) {
        event.preventDefault();
        showChooser();
        filter.blur();
    });
    filter.addEventListener('delete', showChooser);
    filter.addEventListener('cut', showChooser);
    filter.addEventListener('paste', showChooser);
    filter.addEventListener('focus', showChooser);
    filter.addEventListener('keydown', function() {
        if (typingSearchTimeout) {
            clearTimeout(typingSearchTimeout);
        }
        typingSearchTimeout = setTimeout(showChooser, 250);
    });

    document.querySelector('#chooser-button').addEventListener('click', showChooser);

    window.addEventListener('hashchange', function() {
        // Warning: sometimes this triggers when we change it programatically
        // it seems to be normalizing our unicode or something. Fun!
        var oldTitle = selectedTitle,
            oldFilter = filter.value,
            oldSize = preferredKey,
            oldPlayer = playerBackend;
        selectedTitle = getDefault();
        if (oldTitle != selectedTitle || oldSize != preferredKey || oldPlayer != playerBackend) {
            stopVideo();
            startTime = 0;
            autoplay = false;
            showVideo();
        }
        if (oldFilter != filter.value && document.getElementById('media-chooser').className == 'active') {
            showChooser();
        }
    });

    function addMediaSelector(title, imageinfo, format, desc) {
        var item = document.createElement('div'),
            img = document.createElement('img');

        item.className = 'media-item';

        img.className = 'thumb';
        img.crossOrigin = 'anonymous';
        img.src = imageinfo.thumburl;
        img.title = "Play video"
        img.width = imageinfo.thumbwidth / devicePixelRatio;
        img.height = imageinfo.thumbheight / devicePixelRatio;

        var titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.appendChild(document.createTextNode(' ' + title.replace('File:', '').replace(/_/g, ' ')));

        var descDiv = document.createElement('div');
        descDiv.className = 'desc';
        if (format) {
            var formatSpan = document.createElement('span');
            formatSpan.className = 'format';
            formatSpan.appendChild(document.createTextNode(format));
            descDiv.appendChild(formatSpan);
        }
        if (desc) {
            var descSpan = document.createElement('span');
            descSpan.appendChild(document.createTextNode(desc));
            descDiv.appendChild(descSpan);
        }

        item.appendChild(img);
        item.appendChild(titleDiv);
        item.appendChild(descDiv);
        item.addEventListener('click', function() {
            stopVideo();
            startTime = 0;
            autoplay = false;
            selectedTitle = title;
            setHash();
            showVideo();
            dismissChooser();
        });

        mediaList.appendChild(item);
    }

    function setHash() {
        var hash = "#file=" + encodeURIComponent(selectedTitle.replace("File:", "").replace(/ /g, '_'));

        if (filter.value != '') {
            hash += '&search=' + encodeURIComponent(filter.value);
        }

        if (muted) {
            hash += '&mute=1';
        }

        if (playerBackend != 'auto') {
            hash += '&player=' + encodeURIComponent(playerBackend);
        }

        var sizeKey = document.getElementById('video-preferred-size').value;
        hash += '&size=' + sizeKey;

        var mode = document.getElementById('media-source').value;
        if (mode == 'motd') {
            // nothin
        } else {
            hash += '&source=' + mode;
        }

        document.location.hash = hash;
    }

    var preferredKey = '360p.vp9.webm';
    if (OGVCompat.isSlow()) {
        preferredKey = '240p.vp9.webm';
    }
    var selector = document.getElementById('video-preferred-size');
    selector.value = preferredKey;
    selector.addEventListener('change', function() {
        stopVideo();
        preferredKey = selector.value;
        console.log('changed to ' + preferredKey);
        setHash();
        showVideo();
    });

    document.querySelector('#player-backend').addEventListener('change', function() {
        stopVideo();
        playerBackend = this.value;
        setHash();
        showVideo();
    });


    function showVideo() {
        window.scrollTo(0, 0);
        stopVideo();

        var prettyName = selectedTitle.replace(/_/g, ' ').replace(/^File:/, '');
        document.title = prettyName + ' - ogv.js demo/test';

        var pagelink = document.getElementById('pagelink');
        pagelink.textContent = prettyName;
        pagelink.href = 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(selectedTitle);
        findSourcesForMedia(selectedTitle, function(mediaInfo, sources) {
            console.log('type of file: ' + mediaInfo.mediatype);
            console.log('duration of file: ' + mediaInfo.duration);

            var selector = document.getElementById('video-preferred-size');
            selector.innerHTML = '';

            function descriptionForKey(key) {
                var matches = key.match(/^(\d+p)\.(.+)$/);
                if (matches) {
                    var res = matches[1], format = matches[2];
                    if (format == 'ogv') {
                        return res + ' Ogg Theora';
                    } else if (format == 'webm') {
                        return res + ' WebM VP8';
                    } else if (format == 'lowcpu.webm') {
                        return res + ' WebM VP8 low-CPU';
                    } else if (format == 'vp9.webm') {
                        return res + ' WebM VP9';
                    } else if (format == 'av1.webm') {
                        return res + ' WebM AV1';
                    } else {
                        return res + ' ' + format;
                    }
                } else if (key == 'original') {
                    return 'Original';
                } else if (key == 'ogg') {
                    return 'Ogg Vorbis';
                } else if (key == 'opus') {
                    return 'Ogg Opus';
                } else {
                    return key;
                }
            }

            // Find the transcoded or original ogv stream for now
            var optionsMap = {};
            var minHeight;
            var selected = null,
                original = null,
                oga = null;
            sources.forEach(function(source) {
                if (source.key == 'original' && source.format == 'ogv') {
                    original = source;
                }
                if (source.key == preferredKey) {
                    selected = source;
                }
                if (source.format == 'oga' || source.format == 'ogg' || source.format == 'opus') {
                    oga = source;
                }

                var option = document.createElement('option');
                option.textContent = descriptionForKey(source.key);
                option.value = source.key;
                selector.appendChild(option);

                optionsMap[source.key] = option;
            });
            if (selected == null) {
                console.log("Try original file");
                selected = original;
            }
            if (selected == null) {
                console.log("Try audio-only .oga transcode");
                selected = oga;
            }
            if (selected == null) {
                if (sources.length) {
                    selected = sources[0];
                } else {
                    throw new Error("No source found.");
                }
            } else {
                optionsMap[selected.key].selected = true;
            }

            selectedUrl = selected.url;
            console.log("Going to try streaming data from " + selectedUrl);

            if (player) {
                // this should not happen
                stopVideo();
            }
            var debugFilter;
            //debugFilter = /setting a timer|ready to draw frame|decode frame|decoded frame|drew frame/;
            //debugFilter = /drew frame/;
            //debugFilter = /drew frame.*mux: [^0]/;
            //debugFilter = /drew frame.*mux: [^0]|ahead|dropped|delayed/;
            //debugFilter = /drew frame.*mux: [^0]|audio checkin/;
            //debugFilter = /drew frame|dropped|delayed/;
            //debugFilter = /demuxer|stream is at end/;
            //debugFilter = /waiting/;
            //debugFilter = /late frame/;
            //debugFilter = /setting a timer/;
            //debugFilter = /ended|ending|end |demuxer/i;
            //debugFilter = /play loop.*(draw|frame)/;
            if (playerBackend == 'auto') {
                player = new OGVPlayer({
                    debug: !!debugFilter,
                    debugFilter: debugFilter,
                });
            } else if (playerBackend == 'wasm') {
                player = new OGVPlayer({
                    debug: !!debugFilter,
                    debugFilter: debugFilter,
                    wasm: true // force
                });
            } else if (playerBackend == 'wasm-noworker') {
                player = new OGVPlayer({
                    debug: !!debugFilter,
                    debugFilter: debugFilter,
                    worker: false,
                    wasm: true // force
                });
            } else if (playerBackend == 'wasm-cpu') {
                player = new OGVPlayer({
                    debug: !!debugFilter,
                    debugFilter: debugFilter,
                    webGL: false, // force 2d canvas
                    wasm: true // force
                });
            } else if (playerBackend == 'wasm-simd') {
                player = new OGVPlayer({
                    debug: !!debugFilter,
                    debugFilter: debugFilter,
                    wasm: true,
                    simd: true // experimental
                });
            } else if (playerBackend == 'wasm-mt') {
                player = new OGVPlayer({
                    debug: !!debugFilter,
                    debugFilter: debugFilter,
                    wasm: true,
                    threading: true // experimental
                });
            } else if (playerBackend == 'wasm-simd-mt') {
                player = new OGVPlayer({
                    debug: !!debugFilter,
                    debugFilter: debugFilter,
                    wasm: true,
                    threading: true, // experimental
                    simd: true // experimental
                });
            } else if (playerBackend == 'native') {
                player = document.createElement('video');
            } else {
                throw new Error('unknown player backend');
            }
            // for convenience
            window.o = player;


            document.getElementById('video-fps').textContent = '';
            document.getElementById('video-pic-width').textContent = '';
            document.getElementById('video-pic-height').textContent = '';
            document.getElementById('video-jitter').textContent = '';
            document.getElementById('audio-channels').textContent = '';
            document.getElementById('audio-rate').textContent = '';
            document.getElementById('audio-drops').textContent = '';
            document.getElementById('video-bitrate').textContent = '0';
            document.getElementById('audio-bitrate').textContent = '0';

            player.addEventListener('loadedmetadata', function() {
                // Standard metadata ain't much.
                document.getElementById('video-pic-width').textContent = player.videoWidth;
                document.getElementById('video-pic-height').textContent = player.videoHeight;

                // And grab our custom metadata...
                var fps;
                if (typeof (player.ogvjsVideoFrameRate) === 'number' && player.ogvjsVideoFrameRate > 0) {
                    benchmark.setTargetFPS(player.ogvjsVideoFrameRate);
                    fps = Math.round(player.ogvjsVideoFrameRate * 100) / 100;
                } else {
                    // Native video element doesn't seem to expose frame rate?!
                    benchmark.setTargetFPS(60);
                    fps = '?';
                }
                document.getElementById('video-fps').textContent = fps;

                if (typeof player.ogvjsAudioChannels === 'number') {
                    document.getElementById('audio-channels').textContent = player.ogvjsAudioChannels;
                    document.getElementById('audio-rate').textContent = player.ogvjsAudioSampleRate;
                }
            });

            // There is a 'timeupdate' event on HTMLMediaElement, but it only
            // seems to fire every quarter second. No per-frame callback for
            // native video, sorry!
            player.addEventListener('framecallback', function(info) {
                benchmark.recordPoint(info);
            });

            if (window.crossOriginIsolated) {
                player.crossOrigin = 'anonymous';
            }
            if (startTime == 0) {
                player.poster = mediaInfo.thumburl;
            }
            player.src = selectedUrl;
            player.muted = muted;
            player.playbackRate = document.querySelector('#pbr-slider').value/100.0;
            player.addEventListener('loadedmetadata', function() {
                if (startTime) {
                    player.currentTime = startTime;
                    if (autoplay) {
                        player.play();
                    }
                }
            });
            player.addEventListener('volumechange', function() {
                if (muted != player.muted) {
                    muted = player.muted;
                    setHash();
                }
            });

            var container = document.getElementById('player');
            container.insertBefore(player, container.firstChild);

            if (selected.height == 0) {
                player.width = 256; // hack for audio
                player.height = 256;
            }

            controls.init(player);
            benchmark.init(player);
        });
    }

    var selectedTitle = getDefault();
    //showChooser();
    showVideo();

    function stopVideo() {
        if (player) {
            if (player.currentTime) {
                startTime = player.currentTime;
            }
            autoplay = (player.paused === false);
            player.parentElement.removeChild(player);
            player = null;
        }
    }

    container.addEventListener('dragover', function(event) {
        // seem to need this :P
        event.preventDefault();
    });
    container.addEventListener('drop', function(event) {
        event.preventDefault();
        if (event.dataTransfer.items) {
            var item = event.dataTransfer.items[0];
            if (item.kind === 'file') {
                var file = item.getAsFile();
                var url = URL.createObjectURL(file);
                player.src = url;
                player.load();
            }
        }
    });

    // Control for Playback Rate (pbr) slider and reset button
    var pbrSlider = document.querySelector('#pbr-slider');
    pbrSlider.addEventListener('change', function(evt) {
        if (player) player.playbackRate = pbrSlider.value/100.0;
    });
    document.querySelector('#pbr-reset').addEventListener('click', function(evt) {
        pbrSlider.value = 100; if (player) player.playbackRate = 1.0;
    });

    window.setInterval(function() {
        if (player) {
            benchmark.update();
        }
    }, 1000);

})();
(function() {
    
    // benchmark display for demo
    var player;

    var averagePlayTime = 0, // ms
        averageDemuxingTime = 0, // ms
        averageVideoDecodingTime = 0, // ms
        averageAudioDecodingTime = 0, // ms
        averageBufferTime = 0, // ms
        averageDrawingTime = 0, // ms
        averageProxyTime = 0; // ms

    var benchmarkData = [],
        benchmarkClockData = [],
        benchmarkVideoData = [],
        benchmarkAudioData = [],
        benchmarkLateData = [],
        benchmarkDirty = false,
        benchmarkTargetFps = -1;
    function clearBenchmark() {
        benchmarkData = [];
        benchmarkClockData = [];
        benchmarkVideoData = [];
        benchmarkAudioData = [];
        benchmarkDirty = true;
    }
    function recordBenchmarkPoint(info) {
        benchmarkData.push(info.cpuTime);
        benchmarkVideoData.push(info.videoTime);
        benchmarkAudioData.push(info.audioTime);
        benchmarkClockData.push(info.clockTime);
        benchmarkLateData.push(info.late);

        benchmarkDirty = true;
    }
    function showBenchmark() {
        if (!benchmarkDirty) {
            return;
        }
        benchmarkDirty = false;

        var canvas = document.getElementById('benchmark'),
            width = canvas.width,
            height = canvas.height,
            ctx = canvas.getContext('2d'),
            i,
            fps60 = 1000.0 / 60.0,
            fpsTarget = (benchmarkTargetFps ? (1000.0 / benchmarkTargetFps) : fps60),
            maxTime = fpsTarget * 3,
            chunkSize = benchmarkTargetFps * 5, // show last 5 seconds
            maxItems = Math.min(chunkSize, benchmarkData.length);

        var clockData = benchmarkClockData.slice(-chunkSize),
            cpuData = benchmarkData.slice(-chunkSize),
            videoData = benchmarkVideoData.slice(-chunkSize),
            audioData = benchmarkAudioData.slice(-chunkSize),
            lateData = benchmarkLateData.slice(-chunkSize);

        // Draw!

        ctx.clearRect(0, 0, width, height);

        function x(i) {
            return Math.round(i * (width - 1) / maxItems);
        }
        function y(ms) {
            return Math.round((height - 1) - ms * (height - 1) / maxTime);
        }

        var barX = [],
            barWidth = [];
        for (i = 0; i < maxItems; i++) {
            barX[i] = x(i);
            barWidth[i] = Math.max(x(i + 1) - barX[i], 1);
        }

        // Time bar graph
        ctx.globalAlpha = 0.33;

        // Wall clock time
        ctx.fillStyle = 'darkviolet';
        for (i = 0; i < maxItems; i++) {
            if (lateData[i]) {
                var py = y(clockData[i]),
                    pheight = y(fpsTarget) - py;
                ctx.fillRect(barX[i], py, barWidth[i], pheight);
            }
        }
        ctx.fillStyle = 'blue';
        for (i = 0; i < maxItems; i++) {
            if (!lateData[i]) {
                var py = y(clockData[i]),
                    pheight = y(fpsTarget) - py;
                ctx.fillRect(barX[i], py, barWidth[i], pheight);
            }
        }

        // Video decode thread
        ctx.fillStyle = 'darkcyan';
        for (i = 0; i < maxItems; i++) {
            var py = y(videoData[i]);
            ctx.fillRect(barX[i], py, barWidth[i], height - py);
        }

        // Audio decode thread
        ctx.fillStyle = 'green';
        for (i = 0; i < maxItems; i++) {
            var py = y(audioData[i]);
            ctx.fillRect(barX[i], py, barWidth[i], height - py);
        }

        // Main thread CPU time
        ctx.fillStyle = 'black';
        for (i = 0; i < maxItems; i++) {
            var py = y(cpuData[i]);
            ctx.fillRect(barX[i], py, barWidth[i], height - py);
        }

        ctx.globalAlpha = 1;

        if (benchmarkTargetFps) {
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'none';
            ctx.moveTo(x(0), y(fpsTarget));
            ctx.lineTo(x(maxItems - 1), y(fpsTarget));
            ctx.stroke();
        }

    }

    function round2(n) {
        return Math.round(n * 100) / 100;
    }
    function round1_0(n) {
        var n = Math.round(n * 10) / 10,
            s = n + '';
        if (s.indexOf('.') === -1) {
            s += '.0';
        }
        return s;
    }
    function showAverageRate() {
        if (!player || !player.getPlaybackStats) {
            return;
        }

        var info = player.getPlaybackStats();
        if (info.framesProcessed) {
            averagePlayTime = info.playTime / info.framesProcessed;
            averageDemuxingTime = info.demuxingTime / info.framesProcessed;
            averageVideoDecodingTime = info.videoDecodingTime / info.framesProcessed;
            averageAudioDecodingTime = info.audioDecodingTime / info.framesProcessed;
            averageBufferTime = info.bufferTime / info.framesProcessed;
            averageDrawingTime = info.drawingTime / info.framesProcessed;
            averageProxyTime = info.proxyTime / info.framesProcessed;
            averageVideoBitrate = info.videoBytes * 8 / info.playTime; // kbits/s
            averageAudioBitrate = info.audioBytes * 8 / info.playTime; // kbits/s

            var targetPerFrameTime = info.targetPerFrameTime;
            benchmarkTargetFps = 1000 / targetPerFrameTime;
            document.getElementById('bench-target').textContent = round1_0(targetPerFrameTime);
            document.getElementById('bench-clock').textContent = round1_0(averagePlayTime);
            document.getElementById('bench-total').textContent = round1_0(averageDemuxingTime + averageBufferTime + averageDrawingTime + averageProxyTime);
            document.getElementById('bench-demux').textContent = round1_0(averageDemuxingTime);
            document.getElementById('bench-video').textContent = round1_0(averageVideoDecodingTime);
            document.getElementById('bench-audio').textContent = round1_0(averageAudioDecodingTime);
            document.getElementById('bench-buffer').textContent = round1_0(averageBufferTime);
            document.getElementById('bench-draw').textContent = round1_0(averageDrawingTime);
            document.getElementById('bench-proxy').textContent = round1_0(averageProxyTime);

            document.getElementById('video-fps').textContent = round2(player.ogvjsVideoFrameRate);
            document.getElementById('video-jitter').textContent = round2(info.jitter);
            document.getElementById('video-late').textContent = info.lateFrames;
            document.getElementById('audio-drops').textContent = info.droppedAudio;
            document.getElementById('audio-delayed').textContent = round1_0(info.delayedAudio);

            document.getElementById('video-bitrate').textContent = Math.round(averageVideoBitrate);
            document.getElementById('audio-bitrate').textContent = Math.round(averageAudioBitrate);

            // keep it a rolling average
            player.resetPlaybackStats();
        }
    }

    var benchmark = window.benchmark = {
        init: function(aPlayer) {
            player = aPlayer;
            clearBenchmark();
        },
        setTargetFPS: function(fps) {
            benchmarkTargetFps = fps;
        },
        recordPoint: function(info) {
            recordBenchmarkPoint(info);
        },
        update: function() {
            if (benchmarkData.length > 0) {
                showBenchmark();
                showAverageRate();
            }
        }
    }

})();
(function() {

    var player,
        container = document.getElementById('player'),
        controls = document.getElementById('controls'),
        spinner = document.getElementById('spinner-panel'),
        thumbSeeking = false,
        initialThumbX = 0,
        seekTarget = 0;

    function clamp(val) {
        if (val < 0) {
            return 0;
        } else if (val > 1) {
            return 1;
        } else {
            return val;
        }
    }

    function updateProgress() {
        if (player) {
            var total = player.duration,
                processed = player.currentTime,
                thumb = (thumbSeeking ? seekTarget : processed),
                buffered = 0,
                ranges = player.buffered;
            if (ranges.length) {
                // hack -- find the range that contains current, if any
                // would be better to show the actual multi ranges :D
                for (var i = 0; i < ranges.length; i++) {
                    if (processed >= ranges.start(i) && processed <= ranges.end(i)) {
                        buffered = ranges.end(i);
                        break;
                    }
                }
            }

            function percent(val) {
                var ratio = val / total,
                    percentage = ratio * 100.0;
                return percentage + '%';
            }

            document.getElementById('progress-total').title = total;
            document.getElementById('progress-buffered').style.width = percent(buffered);
            document.getElementById('progress-processed').style.width = percent(processed);
            document.getElementById('progress-thumb').style.left = percent(thumb);

            function simtrunc(val) {
                if (val >= 0) {
                    return Math.floor(val);
                } else {
                    return Math.ceil(val);
                }
            }
            var trunc = Math.trunc || simtrunc;

            function formatTime(time) {
                var rtime = Math.round(time),
                    minutes = trunc(rtime / 60),
                    seconds = Math.abs(rtime % 60),
                    padding = (seconds < 10) ? '0' : '';
                return minutes + ':' + padding + seconds;
            }

            controls.querySelector('.time-elapsed').textContent = formatTime(thumb);
            if (player.duration < Infinity) {
                controls.querySelector('.time-remaining').textContent = formatTime(thumb - total);
            } else {
                controls.querySelector('.time-remaining').textContent = '';
            }
        }
    }

    function onclick(selector, listener) {
        var el = controls.querySelector(selector);

        el.addEventListener('click', listener);

        el.addEventListener('touchstart', function(event) {
            // :active doesn't work on iOS \o/
            el.classList.add('active');
            event.preventDefault();
        });
        el.addEventListener('touchcancel', function(event) {
            el.classList.remove('active');
            event.preventDefault();
        });
        el.addEventListener('touchend', function(event) {
            el.classList.remove('active');
            event.preventDefault();
            listener();
        });
    }

    onclick('.play', function() {
        if (player) {
            player.play();
        }
    });
    onclick('.pause', function() {
        if (player) {
            player.pause();
        }
    });
    onclick('.mute', function() {
        if (player) {
            player.muted = true;
        }
        controls.querySelector('.mute').style.display = 'none';
        controls.querySelector('.unmute').style.display = 'inline';
    });
    onclick('.unmute', function() {
        if (player) {
            player.muted = false;
        }
        controls.querySelector('.mute').style.display = 'inline';
        controls.querySelector('.unmute').style.display = 'none';
    });
    function doFastSeek(seekTarget) {
        if (typeof player.fastSeek == 'function') {
            player.fastSeek(seekTarget);
        } else {
            player.currentTime = seekTarget;
        }
    }
    var onNextSeek;
    function setNextSeek() {
        updateProgress();

        if (onNextSeek) {
            // delay!
        } else {
            var onseeked = function() {
                player.removeEventListener('seeked', onseeked);
                onNextSeek = null;
                if (thumbSeeking) {
                    setNextSeek();
                }
            };
            onNextSeek = onseeked;
            player.addEventListener('seeked', onseeked);
            doFastSeek(seekTarget);
        }
    }
    function clearNextSeek() {
        if (onNextSeek) {
            player.removeEventListener('seeked', onNextSeek);
            onNextSeek = null;
        }
    }
    document.querySelector('#progress-total').addEventListener('click', function(event) {
        if (player && player.seekable.length) {
            var x = event.offsetX,
                fraction = x / this.offsetWidth,
                seekTime = fraction * player.duration;
            doFastSeek(seekTime);
        }
    });
    if (window.PointerEvent) {
        document.querySelector('#progress-thumb').addEventListener('pointerdown', function(event) {
            console.log('touch start');
            if (player && player.seekable.length) {
                var thumbPointer = event.pointerId;
                event.target.setPointerCapture(thumbPointer);

                thumbSeeking = true;
                seekTarget = player.currentTime;
                initialThumbFraction = seekTarget / player.duration;
                initialThumbX = event.clientX;

                var ontouchmove = function(event) {
                    console.log('touch move');
                    var bar = document.querySelector('#progress-total'),
                        dx = event.clientX - initialThumbX,
                        fraction = clamp(initialThumbFraction + dx / bar.offsetWidth);
                    seekTarget = fraction * player.duration;
                    setNextSeek();
                    event.preventDefault();
                };
                var ontouchup = function(event) {
                    console.log('touch up');
                    thumbSeeking = false;
                    clearNextSeek();
                    player.currentTime = seekTarget;
                    updateProgress();

                    this.removeEventListener('pointermove', ontouchmove);
                    this.removeEventListener('pointerup', ontouchup);
                    this.removeEventListener('pointercancel', ontouchup);
                    event.preventDefault();
                    event.target.releasePointerCapture(thumbPointer);
                };
                this.addEventListener('pointermove', ontouchmove);
                this.addEventListener('pointerup', ontouchup);
                this.addEventListener('pointercancel', ontouchup);
            }
            event.preventDefault();
        });
    } else {
        document.querySelector('#progress-thumb').addEventListener('touchstart', function(event) {
            console.log('touch start');
            if (player && player.seekable.length) {
                thumbSeeking = true;
                seekTarget = player.currentTime;
                initialThumbFraction = seekTarget / player.duration;
                initialThumbX = event.touches[0].pageX;

                var ontouchmove = function(event) {
                    console.log('touch move');
                    var bar = document.querySelector('#progress-total'),
                        dx = event.touches[0].pageX - initialThumbX,
                        fraction = clamp(initialThumbFraction + dx / bar.offsetWidth);
                    seekTarget = fraction * player.duration;
                    setNextSeek();
                    event.preventDefault();
                };
                var ontouchup = function(event) {
                    console.log('touch up');
                    thumbSeeking = false;
                    clearNextSeek();
                    player.currentTime = seekTarget;
                    updateProgress();

                    this.removeEventListener('touchmove', ontouchmove);
                    this.removeEventListener('touchend', ontouchup);
                    this.removeEventListener('touchcancel', ontouchup);
                    event.preventDefault();
                };
                this.addEventListener('touchmove', ontouchmove);
                this.addEventListener('touchend', ontouchup);
                this.addEventListener('touchcancel', ontouchup);
            }
            event.preventDefault();
        });
        document.querySelector('#progress-thumb').addEventListener('mousedown', function(event) {
            if (player && player.seekable.length) {
                thumbSeeking = true;
                seekTarget = player.currentTime;
                initialThumbFraction = seekTarget / player.duration;
                initialThumbX = event.clientX;

                var onmove = function(event) {
                    var bar = document.querySelector('#progress-total'),
                        dx = event.clientX - initialThumbX,
                        fraction = clamp(initialThumbFraction + dx / bar.offsetWidth);
                    seekTarget = fraction * player.duration;
                    setNextSeek();
                    event.preventDefault();
                };
                var onmouseup = function(event) {
                    var bar = document.querySelector('#progress-total'),
                        dx = event.clientX - initialThumbX,
                        fraction = clamp(initialThumbFraction + dx / bar.offsetWidth);
                    seekTarget = fraction * player.duration;
                    thumbSeeking = false;
                    clearNextSeek();
                    player.currentTime = seekTarget;
                    updateProgress();

                    document.removeEventListener('mousemove', onmove);
                    document.removeEventListener('mouseup', onmouseup);
                    event.preventDefault();
                };
                document.addEventListener('mousemove', onmove);
                document.addEventListener('mouseup', onmouseup);
            }
            event.preventDefault();
        });
    }

    onclick('.fullscreen', function() {
        var requestFullscreen = (container.requestFullscreen || container.mozRequestFullScreen || container.webkitRequestFullscreen || container.msRequestFullscreen).bind(container);
        requestFullscreen();
    });
    onclick('.unzoom', function() {
        var cancelFullscreen = (document.cancelFullscreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen).bind(document);
        cancelFullscreen();
    });
    function fullResizeVideo() {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (fullscreenElement == container) {
            controls.querySelector('.fullscreen').style.display = 'none';
            controls.querySelector('.unzoom').style.display = 'inline';
        } else {
            controls.querySelector('.fullscreen').style.display = 'inline';
            controls.querySelector('.unzoom').style.display = 'none';
        }
    }
    document.addEventListener('fullscreenchange', fullResizeVideo);
    document.addEventListener('mozfullscreenchange', fullResizeVideo);
    document.addEventListener('webkitfullscreenchange', fullResizeVideo);
    document.addEventListener('MSFullscreenChange', fullResizeVideo);

    var controlPanel = document.getElementById('control-panel');
    var playerTimeout;
    function hideControlPanel() {
        // don't hide if we're paused
        // @todo or are audio-only
        if (player && !player.paused) {
            if (controlPanel.style.opacity == 1.0) {
                controlPanel.style.opacity = 0.0;
            }
        }
        if (playerTimeout) {
            clearTimeout(playerTimeout);
            playerTimeout = null;
        }
    }
    function delayHideControlPanel() {
        playerTimeout = setTimeout(function() {
            playerTimeout = null;
            if (player && !player.paused) {
                controlPanel.style.opacity = 0.0;
            }
        }, 5000);
    }
    function showControlPanel() {
        if (controlPanel.style.opacity == 0.0) {
            controlPanel.style.opacity = 1.0;
        }
        if (playerTimeout) {
            clearTimeout(playerTimeout);
            playerTimeout = null;
        }
    }
    function onmousemove() {
        showControlPanel();
        delayHideControlPanel();
    }
    container.addEventListener('mousemove', onmousemove);
    container.addEventListener('touchstart', function() {
        // mousemove triggers on taps in iOS, which undoes our attempts to hide
        container.removeEventListener('mousemove', onmousemove);
    });

    var seekSpinnerTimeout;
    window.controls = {
        init: function(aPlayer) {
            player = aPlayer;
            
            spinner.classList.add('loading');
            player.addEventListener('loadedmetadata', function() {
                spinner.classList.remove('loading');
                updateProgress();
            });

            spinner.classList.remove('seeking');
            player.addEventListener('seeking', function() {
                // use a timeout so very short seeks don't throw up a spinner
                if (seekSpinnerTimeout) {
                    clearTimeout(seekSpinnerTimeout);
                }
                seekSpinnerTimeout = setTimeout(function() {
                    spinner.classList.add('seeking');
                }, 250);
            });
            player.addEventListener('seeked', function() {
                if (seekSpinnerTimeout) {
                    clearTimeout(seekSpinnerTimeout);
                    seekSpinnerTimeout = null;
                }
                spinner.classList.remove('seeking');
            });

            spinner.classList.remove('error');
            spinner.textContent = '';
            player.addEventListener('error', function() {
              spinner.classList.add('error');
              var err = player.error;
              var msg;
              if (err) {
                if (err.code === err.MEDIA_ERR_ABORTED) {
                  msg = 'aborted by user';
                } else if (err.code === err.MEDIA_ERR_NETWORK) {
                  msg = 'network error';
                } else if (err.code === err.MEDIA_ERR_DECODE) {
                  msg = 'decode error';
                } else if (err.code === err.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                  msg = 'source not supported';
                } else {
                  msg = 'unknown error';
                }
                if (err.message) {
                  msg += ': ' + err.message;
                }
              } else {
                msg = 'invalid error state';
              }
              spinner.textContent = 'Error: ' + msg;
            });

            player.addEventListener('timeupdate', function() {
                updateProgress();
            });


            player.addEventListener('ended', function() {
                updateProgress();
                showControlPanel();
            });

            player.addEventListener('pause', function() {
                updateProgress();
                showControlPanel();
            });

            player.addEventListener('play', function() {
                delayHideControlPanel();
            });

            showControlPanel();

            function showHideControls(event) {
                if (controlPanel.style.opacity == 1.0) {
                    hideControlPanel();
                } else {
                    showControlPanel();
                }
            }
            player.addEventListener('touchstart', showHideControls);
            // If the spinner is up, it'll block touches to the player.
            spinner.addEventListener('touchstart', showHideControls);

            document.querySelector('.play').style.display = 'inline';
            document.querySelector('.pause').style.display = 'none';
            player.addEventListener('play', function() {
                document.querySelector('.play').style.display = 'none';
                document.querySelector('.pause').style.display = 'inline';
            });
            player.addEventListener('pause', function() {
                document.querySelector('.play').style.display = 'inline';
                document.querySelector('.pause').style.display = 'none';
            });
            player.addEventListener('ended', function() {
                document.querySelector('.play').style.display = 'inline';
                document.querySelector('.pause').style.display = 'none';
            });
            if (player.muted) {
                controls.querySelector('.mute').style.display = 'none';
                controls.querySelector('.unmute').style.display = 'inline';
            } else {
                controls.querySelector('.mute').style.display = 'inline';
                controls.querySelector('.unmute').style.display = 'none';
            }

            updateProgress();
        }
    }
})();