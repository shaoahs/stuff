/*! jsmpeg v1.0 | (c) Dominic Szablewski | MIT license */


// This sets up the JSMpeg "Namespace". The object is empty apart from the Now()
// utility function and the automatic CreateVideoElements() after DOMReady.
var JSMpeg = {

	// The Player sets up the connections between source, demuxer, decoders,
	// renderer and audio output. It ties everything together, is responsible
	// of scheduling decoding and provides some convenience methods for
	// external users.
	Player: null,

	// A Video Element wraps the Player, shows HTML controls to start/pause
	// the video and handles Audio unlocking on iOS. VideoElements can be
	// created directly in HTML using the <div class="jsmpeg"/> tag.
	VideoElement: null,
	
	// The BitBuffer wraps a Uint8Array and allows reading an arbitrary number
	// of bits at a time. On writing, the BitBuffer either expands its
	// internal buffer (for static files) or deletes old data (for streaming).
	BitBuffer: null,

	// A Source provides raw data from HTTP, a WebSocket connection or any
	// other mean. Sources must support the following API:
	//   .connect(destinationNode)
	//   .write(buffer)
	//   .start() - start reading
	//   .resume(headroom) - continue reading; headroom to play pos in seconds
	//   .established - boolean, true after connection is established
	//   .completed - boolean, true if the source is completely loaded
	//   .progress - float 0-1
	Source: {}, 

	// A Demuxer may sit between a Source and a Decoder. It separates the
	// incoming raw data into Video, Audio and other Streams. API:
	//   .connect(streamId, destinationNode)
	//   .write(buffer)
	//   .currentTime – float, in seconds
	//   .startTime - float, in seconds
	Demuxer: {},

	// A Decoder accepts an incoming Stream of raw Audio or Video data, buffers
	// it and upon `.decode()` decodes a single frame of data. Video decoders
	// call `destinationNode.render(Y, Cr, CB)` with the decoded pixel data;
	// Audio decoders call `destinationNode.play(left, right)` with the decoded
	// PCM data. API:
	//   .connect(destinationNode)
	//   .write(pts, buffer)
	//   .decode()
	//   .seek(time)
	//   .currentTime - float, in seconds
	//   .startTime - float, in seconds
	Decoder: {},

	// A Renderer accepts raw YCrCb data in 3 separate buffers via the render()
	// method. Renderers typically convert the data into the RGBA color space
	// and draw it on a Canvas, but other output - such as writing PNGs - would
	// be conceivable. API:
	//   .render(y, cr, cb) - pixel data as Uint8Arrays
	//   .enabled - wether the renderer does anything upon receiving data
	Renderer: {},

	// Audio Outputs accept raw Stero PCM data in 2 separate buffers via the
	// play() method. Outputs typically play the audio on the user's device.
	// API:
	//   .play(sampleRate, left, right) - rate in herz; PCM data as Uint8Arrays
	//   .stop()
	//   .enqueuedTime - float, in seconds
	//   .enabled - wether the output does anything upon receiving data
	AudioOutput: {}, 

	Now: function() {
		return performance 
			? performance.now() / 1000
			: Date.now() / 1000;
	},

	Fill: function(array, value) {
		if (array.fill) {
			array.fill(value);
		}
		else {
			for (var i = 0; i < array.length; i++) {
				array[i] = value;
			}
		}
	},

	Base64ToArrayBuffer: function(base64) {
		var binary =  atob(base64);
		var length = binary.length;
		var bytes = new Uint8Array(length);
		for (var i = 0; i < length; i++)        {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes.buffer;
	},

	// The build process may append `JSMpeg.WASM_BINARY_INLINED = base64data;` 
	// to the minified source.
	// If this property is present, jsmpeg will use the inlined binary data
	// instead of trying to load a jsmpeg.wasm file via Ajax.
	WASM_BINARY_INLINED: null
};



JSMpeg.Player = (function(){ "use strict";

var Player = function(url, options) {
	this.options = options || {};

	if (options.source) {
		this.source = new options.source(url, options);
		options.streaming = !!this.source.streaming;
	}
	else if (url.match(/^wss?:\/\//)) {
		this.source = new JSMpeg.Source.WebSocket(url, options);
		options.streaming = true;
	}

	this.animationId = 0;

	this.maxAudioLag = options.maxAudioLag || 0.25;
	this.loop = options.loop !== false;
	this.autoplay = !!options.autoplay || options.streaming;
	this.fps = options.fps || 30;

	this.demuxer = new JSMpeg.Demuxer.TS(options);
	this.source.connect(this.demuxer);

	if (!options.disableWebAssembly && JSMpeg.WASMModule.IsSupported()) {
		this.wasmModule = JSMpeg.WASMModule.GetModule();
		options.wasmModule = this.wasmModule;
	}

	if (options.video !== false) {
		this.video = options.wasmModule
			? new JSMpeg.Decoder.MPEG1VideoWASM(options)
			: new JSMpeg.Decoder.MPEG1Video(options);

		this.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.VIDEO_1, this.video);
		this.video.connect(null);
	}

	if (options.audio !== false) {
		this.audio = options.wasmModule
			? new JSMpeg.Decoder.MP2AudioWASM(options)
			: new JSMpeg.Decoder.MP2Audio(options);

		this.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.AUDIO_1, this.audio);
		this.audio.connect(null);
	}

	Object.defineProperty(this, 'currentTime', {
		get: this.getCurrentTime,
		set: this.setCurrentTime
	});
	Object.defineProperty(this, 'volume', {
		get: this.getVolume,
		set: this.setVolume
	});

	this.paused = true;
	this.unpauseOnShow = false;


	// If we have WebAssembly support, wait until the module is compiled before
	// loading the source. Otherwise the decoders won't know what to do with 
	// the source data.
	if (this.wasmModule) {
		if (this.wasmModule.ready) {
			this.startLoading();
		}
		else if (JSMpeg.WASM_BINARY_INLINED) {
			var wasm = JSMpeg.Base64ToArrayBuffer(JSMpeg.WASM_BINARY_INLINED);
			this.wasmModule.loadFromBuffer(wasm, this.startLoading.bind(this));
		}
		else {
			this.wasmModule.loadFromFile('jsmpeg.wasm',  this.startLoading.bind(this));
		}
	}
	else {
		this.startLoading();
		
	}
};

Player.prototype.startLoading = function() {
	this.source.start();
	if (this.autoplay) {
		this.play();
	}
};



Player.prototype.play = function(ev) {
	if (this.animationId > 0) {
		return;
	}

	this.animationId = setTimeout(this.update.bind(this), 1000/this.fps);
	this.wantsToPlay = true;
	this.paused = false;
};

Player.prototype.pause = function(ev) {
	if (this.paused) {
		return;
	}

	clearTimeout(this.animationId);
	this.animationId = 0;
	this.wantsToPlay = false;
	this.isPlaying = false;
	this.paused = true;

	if (this.audio && this.audio.canPlay) {
		// Seek to the currentTime again - audio may already be enqueued a bit
		// further, so we have to rewind it.
		this.seek(this.currentTime);
	}

	if (this.options.onPause) {
		this.options.onPause(this);
	}
};


Player.prototype.stop = function(ev) {
	this.pause();
	this.seek(0);
	if (this.video && this.options.decodeFirstFrame !== false) {
		this.video.decode();
	}
};

Player.prototype.destroy = function() {
	this.pause();
	this.source && this.source.destroy();
	this.video && this.video.destroy();
	this.audio && this.audio.destroy();
};

Player.prototype.seek = function(time) {
	var startOffset = this.audio && this.audio.canPlay
		? this.audio.startTime
		: this.video.startTime;

	if (this.video) {
		this.video.seek(time + startOffset);
	}
	if (this.audio) {
		this.audio.seek(time + startOffset);
	}

	this.startTime = JSMpeg.Now() - time;
};

Player.prototype.getCurrentTime = function() {
	return this.audio && this.audio.canPlay
		? this.audio.currentTime - this.audio.startTime
		: this.video.currentTime - this.video.startTime;
};

Player.prototype.setCurrentTime = function(time) {
	this.seek(time);
};

Player.prototype.update = function() {
	this.animationId = setTimeout(this.update.bind(this), 1000/this.fps);

	if (!this.source.established) {
		return;
	}

	if (!this.isPlaying) {
		this.isPlaying = true;
		this.startTime = JSMpeg.Now() - this.currentTime;

		if (this.options.onPlay) {
			this.options.onPlay(this);
		}
	}

	if (this.options.streaming) {
		this.updateForStreaming();
	}
	else {
		this.updateForStaticFile();
	}
};

Player.prototype.updateForStreaming = function() {
	// When streaming, immediately decode everything we have buffered up until
	// now to minimize playback latency.

	if (this.video) {
		this.video.decode();
	}

	if (this.audio) {
		var decoded = false;
		do {
			// If there's a lot of audio enqueued already, disable output and
			// catch up with the encoding.

			decoded = this.audio.decode();		
		} while (decoded);
	}
};

Player.prototype.nextFrame = function() {
	if (this.source.established && this.video) {
		return this.video.decode();
	}
	return false;
};

Player.prototype.updateForStaticFile = function() {
	var notEnoughData = false,
		headroom = 0;

	// If we have an audio track, we always try to sync the video to the audio.
	// Gaps and discontinuities are far more percetable in audio than in video.

	if (this.audio && this.audio.canPlay) {
		// Do we have to decode and enqueue some more audio data?
		while (
			!notEnoughData && 
			this.audio.decodedTime - this.audio.currentTime < 0.25
		) {
			notEnoughData = !this.audio.decode();
		}

		// Sync video to audio
		if (this.video && this.video.currentTime < this.audio.currentTime) {
			notEnoughData = !this.video.decode();
		}

		headroom = this.demuxer.currentTime - this.audio.currentTime;
	}


	else if (this.video) {
		// Video only - sync it to player's wallclock
		var targetTime = (JSMpeg.Now() - this.startTime) + this.video.startTime,
			lateTime = targetTime - this.video.currentTime,
			frameTime = 1/this.video.frameRate;

		if (this.video && lateTime > 0) {
			// If the video is too far behind (>2 frames), simply reset the
			// target time to the next frame instead of trying to catch up.
			if (lateTime > frameTime * 2) {
				this.startTime += lateTime;
			}

			notEnoughData = !this.video.decode();
		}

		headroom = this.demuxer.currentTime - targetTime;
	}

	// Notify the source of the playhead headroom, so it can decide whether to
	// continue loading further data.
	this.source.resume(headroom);

	// If we failed to decode and the source is complete, it means we reached
	// the end of our data. We may want to loop.
	if (notEnoughData && this.source.completed) {
		if (this.loop) {
			this.seek(0);
		}
		else {
			this.pause();
			if (this.options.onEnded) {
				this.options.onEnded(this);
			}
		}
	}

	// If there's not enough data and the source is not completed, we have
	// just stalled.
	else if (notEnoughData && this.options.onStalled) {
		this.options.onStalled(this);
	}
};

return Player;

})();

JSMpeg.BitBuffer = (function(){ "use strict";

var BitBuffer = function(bufferOrLength, mode) {
	if (typeof(bufferOrLength) === 'object') {
		this.bytes = (bufferOrLength instanceof Uint8Array)
			? bufferOrLength 
			: new Uint8Array(bufferOrLength);

		this.byteLength = this.bytes.length;
	}
	else {
		this.bytes = new Uint8Array(bufferOrLength || 1024*1024);	
		this.byteLength = 0;
	}

	this.mode = mode || BitBuffer.MODE.EXPAND;
	this.index = 0;
};

BitBuffer.prototype.resize = function(size) {
	var newBytes = new Uint8Array(size);
	if (this.byteLength !== 0) {
		this.byteLength = Math.min(this.byteLength, size);
		newBytes.set(this.bytes, 0, this.byteLength);
	}
	this.bytes = newBytes;
	this.index = Math.min(this.index, this.byteLength << 3);
};

BitBuffer.prototype.evict = function(sizeNeeded) {
	var bytePos = this.index >> 3,
		available = this.bytes.length - this.byteLength;
	
	// If the current index is the write position, we can simply reset both
	// to 0. Also reset (and throw away yet unread data) if we won't be able
	// to fit the new data in even after a normal eviction.
	if (
		this.index === this.byteLength << 3 ||
		sizeNeeded > available + bytePos // emergency evac
	) {
		this.byteLength = 0;
		this.index = 0;
		return;
	}
	else if (bytePos === 0) {
		// Nothing read yet - we can't evict anything
		return;
	}
	
	// Some browsers don't support copyWithin() yet - we may have to do 
	// it manually using set and a subarray
	if (this.bytes.copyWithin) {
		this.bytes.copyWithin(0, bytePos, this.byteLength);
	}
	else {
		this.bytes.set(this.bytes.subarray(bytePos, this.byteLength));
	}

	this.byteLength = this.byteLength - bytePos;
	this.index -= bytePos << 3;
	return;
};

BitBuffer.prototype.write = function(buffers) {
	var isArrayOfBuffers = (typeof(buffers[0]) === 'object'),
		totalLength = 0,
		available = this.bytes.length - this.byteLength;

	// Calculate total byte length
	if (isArrayOfBuffers) {
		var totalLength = 0;
		for (var i = 0; i < buffers.length; i++) {
			totalLength += buffers[i].byteLength;
		}
	}
	else {
		totalLength = buffers.byteLength;
	}

	// Do we need to resize or evict?
	if (totalLength > available) {
		if (this.mode === BitBuffer.MODE.EXPAND) {
			var newSize = Math.max(
				this.bytes.length * 2,
				totalLength - available
			);
			this.resize(newSize)
		}
		else {
			this.evict(totalLength);
		}
	}

	if (isArrayOfBuffers) {
		for (var i = 0; i < buffers.length; i++) {
			this.appendSingleBuffer(buffers[i]);
		}
	}
	else {
		this.appendSingleBuffer(buffers);
	}

	return totalLength;
};

BitBuffer.prototype.appendSingleBuffer = function(buffer) {
	buffer = buffer instanceof Uint8Array
		? buffer 
		: new Uint8Array(buffer);
	
	this.bytes.set(buffer, this.byteLength);
	this.byteLength += buffer.length;
};

BitBuffer.prototype.findNextStartCode = function() {	
	for (var i = (this.index+7 >> 3); i < this.byteLength; i++) {
		if(
			this.bytes[i] == 0x00 &&
			this.bytes[i+1] == 0x00 &&
			this.bytes[i+2] == 0x01
		) {
			this.index = (i+4) << 3;
			return this.bytes[i+3];
		}
	}
	this.index = (this.byteLength << 3);
	return -1;
};

BitBuffer.prototype.findStartCode = function(code) {
	var current = 0;
	while (true) {
		current = this.findNextStartCode();
		if (current === code || current === -1) {
			return current;
		}
	}
	return -1;
};

BitBuffer.prototype.nextBytesAreStartCode = function() {
	var i = (this.index+7 >> 3);
	return (
		i >= this.byteLength || (
			this.bytes[i] == 0x00 && 
			this.bytes[i+1] == 0x00 &&
			this.bytes[i+2] == 0x01
		)
	);
};

BitBuffer.prototype.peek = function(count) {
	var offset = this.index;
	var value = 0;
	while (count) {
		var currentByte = this.bytes[offset >> 3],
			remaining = 8 - (offset & 7), // remaining bits in byte
			read = remaining < count ? remaining : count, // bits in this run
			shift = remaining - read,
			mask = (0xff >> (8-read));

		value = (value << read) | ((currentByte & (mask << shift)) >> shift);

		offset += read;
		count -= read;
	}

	return value;
}

BitBuffer.prototype.read = function(count) {
	var value = this.peek(count);
	this.index += count;
	return value;
};

BitBuffer.prototype.skip = function(count) {
	return (this.index += count);
};

BitBuffer.prototype.rewind = function(count) {
	this.index = Math.max(this.index - count, 0);
};

BitBuffer.prototype.has = function(count) {
	return ((this.byteLength << 3) - this.index) >= count;
};

BitBuffer.MODE = {
	EVICT: 1,
	EXPAND: 2
};

return BitBuffer;

})();


JSMpeg.Source.Fetch = (function(){ "use strict";

var FetchSource = function(url, options) {
	this.url = url;
	this.destination = null;
	this.request = null;
	this.streaming = true;

	this.completed = false;
	this.established = false;
	this.progress = 0;
	this.aborted = false;

	this.onEstablishedCallback = options.onSourceEstablished;
	this.onCompletedCallback = options.onSourceCompleted;
};

FetchSource.prototype.connect = function(destination) {
	this.destination = destination;
};

FetchSource.prototype.start = function() {
	var params = {
		method: 'GET',
		headers: new Headers(),
		cache: 'default'
	};
	
	self.fetch(this.url, params).then(function(res) {
		if (res.ok && (res.status >= 200 && res.status <= 299)) {
			this.progress = 1;
			this.established = true;
			return this.pump(res.body.getReader());
		}
		else {
			//error
		}
	}.bind(this)).catch(function(err) {
		throw(err);
	});
};

FetchSource.prototype.pump = function(reader) {
	return reader.read().then(function(result) {
		if (result.done) {
			this.completed = true;
		}
		else {
			if (this.aborted) {
				return reader.cancel();
			}
			
			if (this.destination) {
				this.destination.write(result.value.buffer);
			}

			return this.pump(reader);
		}
	}.bind(this)).catch(function(err) {
		throw(err);
	});
};

FetchSource.prototype.resume = function(secondsHeadroom) {
	// Nothing to do here
};

FetchSource.prototype.abort = function() {
	this.aborted = true;
};

return FetchSource;

})();JSMpeg.Source.WebSocket = (function(){ "use strict";

var WSSource = function(url, options) {
	this.url = url;
	this.options = options || {};
	this.socket = null;
	this.streaming = true;

	this.callbacks = {connect: [], data: []};
	this.destination = null;

	this.reconnectInterval = options.reconnectInterval !== undefined
		? options.reconnectInterval
		: 5;
	this.shouldAttemptReconnect = !!this.reconnectInterval;

	this.completed = false;
	this.established = false;
	this.progress = 0;

	this.reconnectTimeoutId = 0;

	this.onEstablishedCallback = options.onSourceEstablished;
	this.onCompletedCallback = options.onSourceCompleted; // Never used
};

WSSource.prototype.connect = function(destination) {
	this.destination = destination;
};

WSSource.prototype.destroy = function() {
	clearTimeout(this.reconnectTimeoutId);
	this.shouldAttemptReconnect = false;
	this.socket.close();
};

WSSource.prototype.start = function() {
	this.shouldAttemptReconnect = !!this.reconnectInterval;
	this.progress = 0;
	this.established = false;
	
	this.socket = new WebSocket(this.url, this.options.protocols || null);
	this.socket.binaryType = 'arraybuffer';
	this.socket.onmessage = this.onMessage.bind(this);
	this.socket.onopen = this.onOpen.bind(this);
	this.socket.onerror = this.onClose.bind(this);
	this.socket.onclose = this.onClose.bind(this);
};

WSSource.prototype.resume = function(secondsHeadroom) {
	// Nothing to do here
};

WSSource.prototype.onOpen = function() {
	this.progress = 1;
};

WSSource.prototype.onClose = function() {
	if (this.shouldAttemptReconnect) {
		clearTimeout(this.reconnectTimeoutId);
		this.reconnectTimeoutId = setTimeout(function(){
			this.start();	
		}.bind(this), this.reconnectInterval*1000);
	}
};

WSSource.prototype.onMessage = function(ev) {
	var isFirstChunk = !this.established;
	this.established = true;

	if (isFirstChunk && this.onEstablishedCallback) {
		this.onEstablishedCallback(this);
	}

	if (this.destination) {
		this.destination.write(ev.data);
	}
};

return WSSource;

})();

JSMpeg.Demuxer.TS = (function(){ "use strict";

var TS = function(options) {
	this.bits = null;
	this.leftoverBytes = null;

	this.guessVideoFrameEnd = true;
	this.pidsToStreamIds = {};

	this.pesPacketInfo = {};
	this.startTime = 0;
	this.currentTime = 0;
};

TS.prototype.connect = function(streamId, destination) {
	this.pesPacketInfo[streamId] = {
		destination: destination,
		currentLength: 0,
		totalLength: 0,
		pts: 0,
		buffers: []
	};
};

TS.prototype.write = function(buffer) {
	if (this.leftoverBytes) {
		var totalLength = buffer.byteLength + this.leftoverBytes.byteLength;
		this.bits = new JSMpeg.BitBuffer(totalLength);
		this.bits.write([this.leftoverBytes, buffer]);
	}
	else {
		this.bits = new JSMpeg.BitBuffer(buffer);
	}

	while (this.bits.has(188 << 3) && this.parsePacket()) {}

	var leftoverCount = this.bits.byteLength - (this.bits.index >> 3);
	this.leftoverBytes = leftoverCount > 0
		? this.bits.bytes.subarray(this.bits.index >> 3)
		: null;
};

TS.prototype.parsePacket = function() {
	// Check if we're in sync with packet boundaries; attempt to resync if not.
	if (this.bits.read(8) !== 0x47) {
		if (!this.resync()) {
			// Couldn't resync; maybe next time...
			return false;
		}
	}

	var end = (this.bits.index >> 3) + 187;
	var transportError = this.bits.read(1),
		payloadStart = this.bits.read(1),
		transportPriority = this.bits.read(1),
		pid = this.bits.read(13),
		transportScrambling = this.bits.read(2),
		adaptationField = this.bits.read(2),
		continuityCounter = this.bits.read(4);


	// If this is the start of a new payload; signal the end of the previous
	// frame, if we didn't do so already.
	var streamId = this.pidsToStreamIds[pid];
	if (payloadStart && streamId) {
		var pi = this.pesPacketInfo[streamId];
		if (pi && pi.currentLength) {
			this.packetComplete(pi);
		}
	}

	// Extract current payload
	if (adaptationField & 0x1) {
		if ((adaptationField & 0x2)) {
			var adaptationFieldLength = this.bits.read(8);
			this.bits.skip(adaptationFieldLength << 3);
		}

		if (payloadStart && this.bits.nextBytesAreStartCode()) {
			this.bits.skip(24);
			streamId = this.bits.read(8);
			this.pidsToStreamIds[pid] = streamId;

			var packetLength = this.bits.read(16)
			this.bits.skip(8);
			var ptsDtsFlag = this.bits.read(2);
			this.bits.skip(6);
			var headerLength = this.bits.read(8);
			var payloadBeginIndex = this.bits.index + (headerLength << 3);
			
			var pi = this.pesPacketInfo[streamId];
			if (pi) {
				var pts = 0;
				if (ptsDtsFlag & 0x2) {
					// The Presentation Timestamp is encoded as 33(!) bit
					// integer, but has a "marker bit" inserted at weird places
					// in between, making the whole thing 5 bytes in size.
					// You can't make this shit up...
					this.bits.skip(4);
					var p32_30 = this.bits.read(3);
					this.bits.skip(1);
					var p29_15 = this.bits.read(15);
					this.bits.skip(1);
					var p14_0 = this.bits.read(15);
					this.bits.skip(1);

					// Can't use bit shifts here; we need 33 bits of precision,
					// so we're using JavaScript's double number type. Also
					// divide by the 90khz clock to get the pts in seconds.
					pts = (p32_30 * 1073741824 + p29_15 * 32768 + p14_0)/90000;
					
					this.currentTime = pts;
					if (this.startTime === -1) {
						this.startTime = pts;
					}
				}

				var payloadLength = packetLength 
					? packetLength - headerLength - 3
					: 0;
				this.packetStart(pi, pts, payloadLength);
			}

			// Skip the rest of the header without parsing it
			this.bits.index = payloadBeginIndex;
		}

		if (streamId) {
			// Attempt to detect if the PES packet is complete. For Audio (and
			// other) packets, we received a total packet length with the PES 
			// header, so we can check the current length.

			// For Video packets, we have to guess the end by detecting if this
			// TS packet was padded - there's no good reason to pad a TS packet 
			// in between, but it might just fit exactly. If this fails, we can
			// only wait for the next PES header for that stream.

			var pi = this.pesPacketInfo[streamId];
			if (pi) {
				var start = this.bits.index >> 3;
				var complete = this.packetAddData(pi, start, end);

				var hasPadding = !payloadStart && (adaptationField & 0x2);
				if (complete || (this.guessVideoFrameEnd && hasPadding)) {
					this.packetComplete(pi);	
				}
			}
		}
	}

	this.bits.index = end << 3;
	return true;
};

TS.prototype.resync = function() {
	// Check if we have enough data to attempt a resync. We need 5 full packets.
	if (!this.bits.has((188 * 6) << 3)) {
		return false;
	}

	var byteIndex = this.bits.index >> 3;

	// Look for the first sync token in the first 187 bytes
	for (var i = 0; i < 187; i++) {
		if (this.bits.bytes[byteIndex + i] === 0x47) {

			// Look for 4 more sync tokens, each 188 bytes appart
			var foundSync = true;
			for (var j = 1; j < 5; j++) {
				if (this.bits.bytes[byteIndex + i + 188 * j] !== 0x47) {
					foundSync = false;
					break;
				}
			}

			if (foundSync) {
				this.bits.index = (byteIndex + i + 1) << 3;
				return true;
			}
		}
	}

	// In theory, we shouldn't arrive here. If we do, we had enough data but
	// still didn't find sync - this can only happen if we were fed garbage
	// data. Check your source!
	console.warn('JSMpeg: Possible garbage data. Skipping.');
	this.bits.skip(187 << 3);
	return false;
};

TS.prototype.packetStart = function(pi, pts, payloadLength) {
	pi.totalLength = payloadLength;
	pi.currentLength = 0;
	pi.pts = pts;
};

TS.prototype.packetAddData = function(pi, start, end) {
	pi.buffers.push(this.bits.bytes.subarray(start, end));
	pi.currentLength += end - start;

	var complete = (pi.totalLength !== 0 && pi.currentLength >= pi.totalLength);
	return complete;
};

TS.prototype.packetComplete = function(pi) {
	pi.destination.write(pi.pts, pi.buffers);
	pi.totalLength = 0;
	pi.currentLength = 0;
	pi.buffers = [];
};

TS.STREAM = {
	PACK_HEADER: 0xBA,
	SYSTEM_HEADER: 0xBB,
	PROGRAM_MAP: 0xBC,
	PRIVATE_1: 0xBD,
	PADDING: 0xBE,
	PRIVATE_2: 0xBF,
	AUDIO_1: 0xC0,
	VIDEO_1: 0xE0,
	DIRECTORY: 0xFF
};

return TS;

})();


JSMpeg.Decoder.Base = (function(){ "use strict";

var BaseDecoder = function(options) {
	this.destination = null;
	this.canPlay = false;

	this.collectTimestamps = !options.streaming;
	this.bytesWritten = 0;
	this.timestamps = [];
	this.timestampIndex = 0;

	this.startTime = 0;
	this.decodedTime = 0;

	Object.defineProperty(this, 'currentTime', {get: this.getCurrentTime});
};

BaseDecoder.prototype.destroy = function() {};

BaseDecoder.prototype.connect = function(destination) {
	this.destination = destination;
};

BaseDecoder.prototype.bufferGetIndex = function() {
	return this.bits.index;
};

BaseDecoder.prototype.bufferSetIndex = function(index) {
	this.bits.index = index;
};

BaseDecoder.prototype.bufferWrite = function(buffers) {
	return this.bits.write(buffers);
};

BaseDecoder.prototype.write = function(pts, buffers) {
	if (this.collectTimestamps) {
		if (this.timestamps.length === 0) {
			this.startTime = pts;
			this.decodedTime = pts;
		}
		this.timestamps.push({index: this.bytesWritten << 3, time: pts});
	}

	this.bytesWritten += this.bufferWrite(buffers);
	this.canPlay = true;
};

BaseDecoder.prototype.seek = function(time) {
	if (!this.collectTimestamps) {
		return;
	}

	this.timestampIndex = 0;
	for (var i = 0; i < this.timestamps.length; i++) {
		if (this.timestamps[i].time > time) {
			break;
		}
		this.timestampIndex = i;
	}

	var ts = this.timestamps[this.timestampIndex];
	if (ts) {
		this.bufferSetIndex(ts.index);
		this.decodedTime = ts.time;
	}
	else {
		this.bufferSetIndex(0);
		this.decodedTime = this.startTime;
	}
};

BaseDecoder.prototype.decode = function() {
	this.advanceDecodedTime(0);
};

BaseDecoder.prototype.advanceDecodedTime = function(seconds) {
	if (this.collectTimestamps) {
		var newTimestampIndex = -1;
		var currentIndex = this.bufferGetIndex();
		for (var i = this.timestampIndex; i < this.timestamps.length; i++) {
			if (this.timestamps[i].index > currentIndex) {
				break;
			}
			newTimestampIndex = i;
		}

		// Did we find a new PTS, different from the last? If so, we don't have
		// to advance the decoded time manually and can instead sync it exactly
		// to the PTS.
		if (
			newTimestampIndex !== -1 && 
			newTimestampIndex !== this.timestampIndex
		) {
			this.timestampIndex = newTimestampIndex;
			this.decodedTime = this.timestamps[this.timestampIndex].time;
			return;
		}
	}

	this.decodedTime += seconds;
};

BaseDecoder.prototype.getCurrentTime = function() {
	return this.decodedTime;
};

return BaseDecoder;

})();


JSMpeg.Decoder.MPEG1Video = (function(){ "use strict";

// Inspired by Java MPEG-1 Video Decoder and Player by Zoltan Korandi 
// https://sourceforge.net/projects/javampeg1video/

var MPEG1 = function(options) {
	JSMpeg.Decoder.Base.call(this, options);

	this.onDecodeCallback = options.onVideoDecode;

	var bufferSize = options.videoBufferSize || 512*1024;
	var bufferMode = options.streaming
		? JSMpeg.BitBuffer.MODE.EVICT
		: JSMpeg.BitBuffer.MODE.EXPAND;

	this.bits = new JSMpeg.BitBuffer(bufferSize, bufferMode);

	this.customIntraQuantMatrix = new Uint8Array(64);
	this.customNonIntraQuantMatrix = new Uint8Array(64);
	this.blockData = new Int32Array(64);

	this.currentFrame = 0;
	this.decodeFirstFrame = options.decodeFirstFrame !== false;
};

MPEG1.prototype = Object.create(JSMpeg.Decoder.Base.prototype);
MPEG1.prototype.constructor = MPEG1;

MPEG1.prototype.write = function(pts, buffers) {
	JSMpeg.Decoder.Base.prototype.write.call(this, pts, buffers);

	if (!this.hasSequenceHeader) {
		if (this.bits.findStartCode(MPEG1.START.SEQUENCE) === -1) {
			return false;
		}
		this.decodeSequenceHeader();

		if (this.decodeFirstFrame) {
			this.decode();
		}
	}
};

MPEG1.prototype.decode = function() {
	var startTime = JSMpeg.Now();
	
	if (!this.hasSequenceHeader) {
		return false;
	}

	if (this.bits.findStartCode(MPEG1.START.PICTURE) === -1) {
		var bufferedBytes = this.bits.byteLength - (this.bits.index >> 3);
		return false;
	}

	this.decodePicture();
	this.advanceDecodedTime(1/this.frameRate);

	var elapsedTime = JSMpeg.Now() - startTime;
	if (this.onDecodeCallback) {
		this.onDecodeCallback(this, elapsedTime);
	}
	return true;
};

MPEG1.prototype.readHuffman = function(codeTable) {
	var state = 0;
	do {
		state = codeTable[state + this.bits.read(1)];
	} while (state >= 0 && codeTable[state] !== 0);
	return codeTable[state+2];
};


// Sequence Layer

MPEG1.prototype.frameRate = 30;
MPEG1.prototype.decodeSequenceHeader = function() {
	var newWidth = this.bits.read(12),
		newHeight = this.bits.read(12);

	// skip pixel aspect ratio
	this.bits.skip(4);

	this.frameRate = MPEG1.PICTURE_RATE[this.bits.read(4)];

	// skip bitRate, marker, bufferSize and constrained bit
	this.bits.skip(18 + 1 + 10 + 1);

	if (newWidth !== this.width || newHeight !== this.height) {
		this.width = newWidth;
		this.height = newHeight;

		this.initBuffers();

		if (this.destination) {
			this.destination.resize(newWidth, newHeight);
		}
	}

	if (this.bits.read(1)) { // load custom intra quant matrix?
		for (var i = 0; i < 64; i++) {
			this.customIntraQuantMatrix[MPEG1.ZIG_ZAG[i]] = this.bits.read(8);
		}
		this.intraQuantMatrix = this.customIntraQuantMatrix;
	}

	if (this.bits.read(1)) { // load custom non intra quant matrix?
		for (var i = 0; i < 64; i++) {
			var idx = MPEG1.ZIG_ZAG[i];
			this.customNonIntraQuantMatrix[idx] = this.bits.read(8);
		}
		this.nonIntraQuantMatrix = this.customNonIntraQuantMatrix;
	}

	this.hasSequenceHeader = true;
};

MPEG1.prototype.initBuffers = function() {
	this.intraQuantMatrix = MPEG1.DEFAULT_INTRA_QUANT_MATRIX;
	this.nonIntraQuantMatrix = MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX;

	this.mbWidth = (this.width + 15) >> 4;
	this.mbHeight = (this.height + 15) >> 4;
	this.mbSize = this.mbWidth * this.mbHeight;

	this.codedWidth = this.mbWidth << 4;
	this.codedHeight = this.mbHeight << 4;
	this.codedSize = this.codedWidth * this.codedHeight;

	this.halfWidth = this.mbWidth << 3;
	this.halfHeight = this.mbHeight << 3;

	// Allocated buffers and resize the canvas
	this.currentY = new Uint8ClampedArray(this.codedSize);
	this.currentY32 = new Uint32Array(this.currentY.buffer);

	this.currentCr = new Uint8ClampedArray(this.codedSize >> 2);
	this.currentCr32 = new Uint32Array(this.currentCr.buffer);

	this.currentCb = new Uint8ClampedArray(this.codedSize >> 2);
	this.currentCb32 = new Uint32Array(this.currentCb.buffer);


	this.forwardY = new Uint8ClampedArray(this.codedSize);
	this.forwardY32 = new Uint32Array(this.forwardY.buffer);

	this.forwardCr = new Uint8ClampedArray(this.codedSize >> 2);
	this.forwardCr32 = new Uint32Array(this.forwardCr.buffer);

	this.forwardCb = new Uint8ClampedArray(this.codedSize >> 2);
	this.forwardCb32 = new Uint32Array(this.forwardCb.buffer);
};


// Picture Layer

MPEG1.prototype.currentY = null;
MPEG1.prototype.currentCr = null;
MPEG1.prototype.currentCb = null;

MPEG1.prototype.pictureType = 0;

// Buffers for motion compensation
MPEG1.prototype.forwardY = null;
MPEG1.prototype.forwardCr = null;
MPEG1.prototype.forwardCb = null;

MPEG1.prototype.fullPelForward = false;
MPEG1.prototype.forwardFCode = 0;
MPEG1.prototype.forwardRSize = 0;
MPEG1.prototype.forwardF = 0;

MPEG1.prototype.decodePicture = function(skipOutput) {
	this.currentFrame++;

	this.bits.skip(10); // skip temporalReference
	this.pictureType = this.bits.read(3);
	this.bits.skip(16); // skip vbv_delay

	// Skip B and D frames or unknown coding type
	if (this.pictureType <= 0 || this.pictureType >= MPEG1.PICTURE_TYPE.B) {
		return;
	}

	// full_pel_forward, forward_f_code
	if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
		this.fullPelForward = this.bits.read(1);
		this.forwardFCode = this.bits.read(3);
		if (this.forwardFCode === 0) {
			// Ignore picture with zero forward_f_code
			return;
		}
		this.forwardRSize = this.forwardFCode - 1;
		this.forwardF = 1 << this.forwardRSize;
	}

	var code = 0;
	do {
		code = this.bits.findNextStartCode();
	} while (code === MPEG1.START.EXTENSION || code === MPEG1.START.USER_DATA );


	while (code >= MPEG1.START.SLICE_FIRST && code <= MPEG1.START.SLICE_LAST) {
		this.decodeSlice(code & 0x000000FF);
		code = this.bits.findNextStartCode();
	}

	if (code !== -1) {
		// We found the next start code; rewind 32bits and let the main loop
		// handle it.
		this.bits.rewind(32);
	}

	// Invoke decode callbacks
	if (this.destination) {
		this.destination.render(this.currentY, this.currentCr, this.currentCb, true);
	}

	// If this is a reference picutre then rotate the prediction pointers
	if (
		this.pictureType === MPEG1.PICTURE_TYPE.INTRA ||
		this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE
	) {
		var
			tmpY = this.forwardY,
			tmpY32 = this.forwardY32,
			tmpCr = this.forwardCr,
			tmpCr32 = this.forwardCr32,
			tmpCb = this.forwardCb,
			tmpCb32 = this.forwardCb32;

		this.forwardY = this.currentY;
		this.forwardY32 = this.currentY32;
		this.forwardCr = this.currentCr;
		this.forwardCr32 = this.currentCr32;
		this.forwardCb = this.currentCb;
		this.forwardCb32 = this.currentCb32;

		this.currentY = tmpY;
		this.currentY32 = tmpY32;
		this.currentCr = tmpCr;
		this.currentCr32 = tmpCr32;
		this.currentCb = tmpCb;
		this.currentCb32 = tmpCb32;
	}
};


// Slice Layer

MPEG1.prototype.quantizerScale = 0;
MPEG1.prototype.sliceBegin = false;

MPEG1.prototype.decodeSlice = function(slice) {
	this.sliceBegin = true;
	this.macroblockAddress = (slice - 1) * this.mbWidth - 1;

	// Reset motion vectors and DC predictors
	this.motionFwH = this.motionFwHPrev = 0;
	this.motionFwV = this.motionFwVPrev = 0;
	this.dcPredictorY  = 128;
	this.dcPredictorCr = 128;
	this.dcPredictorCb = 128;

	this.quantizerScale = this.bits.read(5);

	// skip extra bits
	while (this.bits.read(1)) {
		this.bits.skip(8);
	}

	do {
		this.decodeMacroblock();
	} while (!this.bits.nextBytesAreStartCode());
};


// Macroblock Layer

MPEG1.prototype.macroblockAddress = 0;
MPEG1.prototype.mbRow = 0;
MPEG1.prototype.mbCol = 0;

MPEG1.prototype.macroblockType = 0;
MPEG1.prototype.macroblockIntra = false;
MPEG1.prototype.macroblockMotFw = false;

MPEG1.prototype.motionFwH = 0;
MPEG1.prototype.motionFwV = 0;
MPEG1.prototype.motionFwHPrev = 0;
MPEG1.prototype.motionFwVPrev = 0;

MPEG1.prototype.decodeMacroblock = function() {
	// Decode macroblock_address_increment
	var
		increment = 0,
		t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);

	while (t === 34) {
		// macroblock_stuffing
		t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
	}
	while (t === 35) {
		// macroblock_escape
		increment += 33;
		t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
	}
	increment += t;

	// Process any skipped macroblocks
	if (this.sliceBegin) {
		// The first macroblock_address_increment of each slice is relative
		// to beginning of the preverious row, not the preverious macroblock
		this.sliceBegin = false;
		this.macroblockAddress += increment;
	}
	else {
		if (this.macroblockAddress + increment >= this.mbSize) {
			// Illegal (too large) macroblock_address_increment
			return;
		}
		if (increment > 1) {
			// Skipped macroblocks reset DC predictors
			this.dcPredictorY  = 128;
			this.dcPredictorCr = 128;
			this.dcPredictorCb = 128;

			// Skipped macroblocks in P-pictures reset motion vectors
			if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
				this.motionFwH = this.motionFwHPrev = 0;
				this.motionFwV = this.motionFwVPrev = 0;
			}
		}

		// Predict skipped macroblocks
		while (increment > 1) {
			this.macroblockAddress++;
			this.mbRow = (this.macroblockAddress / this.mbWidth)|0;
			this.mbCol = this.macroblockAddress % this.mbWidth;
			this.copyMacroblock(
				this.motionFwH, this.motionFwV,
				this.forwardY, this.forwardCr, this.forwardCb
			);
			increment--;
		}
		this.macroblockAddress++;
	}
	this.mbRow = (this.macroblockAddress / this.mbWidth)|0;
	this.mbCol = this.macroblockAddress % this.mbWidth;

	// Process the current macroblock
	var mbTable = MPEG1.MACROBLOCK_TYPE[this.pictureType];
	this.macroblockType = this.readHuffman(mbTable);
	this.macroblockIntra = (this.macroblockType & 0x01);
	this.macroblockMotFw = (this.macroblockType & 0x08);

	// Quantizer scale
	if ((this.macroblockType & 0x10) !== 0) {
		this.quantizerScale = this.bits.read(5);
	}

	if (this.macroblockIntra) {
		// Intra-coded macroblocks reset motion vectors
		this.motionFwH = this.motionFwHPrev = 0;
		this.motionFwV = this.motionFwVPrev = 0;
	}
	else {
		// Non-intra macroblocks reset DC predictors
		this.dcPredictorY = 128;
		this.dcPredictorCr = 128;
		this.dcPredictorCb = 128;

		this.decodeMotionVectors();
		this.copyMacroblock(
			this.motionFwH, this.motionFwV,
			this.forwardY, this.forwardCr, this.forwardCb
		);
	}

	// Decode blocks
	var cbp = ((this.macroblockType & 0x02) !== 0)
		? this.readHuffman(MPEG1.CODE_BLOCK_PATTERN)
		: (this.macroblockIntra ? 0x3f : 0);

	for (var block = 0, mask = 0x20; block < 6; block++) {
		if ((cbp & mask) !== 0) {
			this.decodeBlock(block);
		}
		mask >>= 1;
	}
};


MPEG1.prototype.decodeMotionVectors = function() {
	var code, d, r = 0;

	// Forward
	if (this.macroblockMotFw) {
		// Horizontal forward
		code = this.readHuffman(MPEG1.MOTION);
		if ((code !== 0) && (this.forwardF !== 1)) {
			r = this.bits.read(this.forwardRSize);
			d = ((Math.abs(code) - 1) << this.forwardRSize) + r + 1;
			if (code < 0) {
				d = -d;
			}
		}
		else {
			d = code;
		}

		this.motionFwHPrev += d;
		if (this.motionFwHPrev > (this.forwardF << 4) - 1) {
			this.motionFwHPrev -= this.forwardF << 5;
		}
		else if (this.motionFwHPrev < ((-this.forwardF) << 4)) {
			this.motionFwHPrev += this.forwardF << 5;
		}

		this.motionFwH = this.motionFwHPrev;
		if (this.fullPelForward) {
			this.motionFwH <<= 1;
		}

		// Vertical forward
		code = this.readHuffman(MPEG1.MOTION);
		if ((code !== 0) && (this.forwardF !== 1)) {
			r = this.bits.read(this.forwardRSize);
			d = ((Math.abs(code) - 1) << this.forwardRSize) + r + 1;
			if (code < 0) {
				d = -d;
			}
		}
		else {
			d = code;
		}

		this.motionFwVPrev += d;
		if (this.motionFwVPrev > (this.forwardF << 4) - 1) {
			this.motionFwVPrev -= this.forwardF << 5;
		}
		else if (this.motionFwVPrev < ((-this.forwardF) << 4)) {
			this.motionFwVPrev += this.forwardF << 5;
		}

		this.motionFwV = this.motionFwVPrev;
		if (this.fullPelForward) {
			this.motionFwV <<= 1;
		}
	}
	else if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
		// No motion information in P-picture, reset vectors
		this.motionFwH = this.motionFwHPrev = 0;
		this.motionFwV = this.motionFwVPrev = 0;
	}
};

MPEG1.prototype.copyMacroblock = function(motionH, motionV, sY, sCr, sCb) {
	var
		width, scan,
		H, V, oddH, oddV,
		src, dest, last;

	// We use 32bit writes here
	var dY = this.currentY32,
		dCb = this.currentCb32,
		dCr = this.currentCr32;

	// Luminance
	width = this.codedWidth;
	scan = width - 16;

	H = motionH >> 1;
	V = motionV >> 1;
	oddH = (motionH & 1) === 1;
	oddV = (motionV & 1) === 1;

	src = ((this.mbRow << 4) + V) * width + (this.mbCol << 4) + H;
	dest = (this.mbRow * width + this.mbCol) << 2;
	last = dest + (width << 2);

	var x, y1, y2, y;
	if (oddH) {
		if (oddV) {
			while (dest < last) {
				y1 = sY[src] + sY[src+width]; src++;
				for (x = 0; x < 4; x++) {
					y2 = sY[src] + sY[src+width]; src++;
					y = (((y1 + y2 + 2) >> 2) & 0xff);

					y1 = sY[src] + sY[src+width]; src++;
					y |= (((y1 + y2 + 2) << 6) & 0xff00);

					y2 = sY[src] + sY[src+width]; src++;
					y |= (((y1 + y2 + 2) << 14) & 0xff0000);

					y1 = sY[src] + sY[src+width]; src++;
					y |= (((y1 + y2 + 2) << 22) & 0xff000000);

					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
		else {
			while (dest < last) {
				y1 = sY[src++];
				for (x = 0; x < 4; x++) {
					y2 = sY[src++];
					y = (((y1 + y2 + 1) >> 1) & 0xff);

					y1 = sY[src++];
					y |= (((y1 + y2 + 1) << 7) & 0xff00);

					y2 = sY[src++];
					y |= (((y1 + y2 + 1) << 15) & 0xff0000);

					y1 = sY[src++];
					y |= (((y1 + y2 + 1) << 23) & 0xff000000);

					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
	}
	else {
		if (oddV) {
			while (dest < last) {
				for (x = 0; x < 4; x++) {
					y = (((sY[src] + sY[src+width] + 1) >> 1) & 0xff); src++;
					y |= (((sY[src] + sY[src+width] + 1) << 7) & 0xff00); src++;
					y |= (((sY[src] + sY[src+width] + 1) << 15) & 0xff0000); src++;
					y |= (((sY[src] + sY[src+width] + 1) << 23) & 0xff000000); src++;

					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan;
			}
		}
		else {
			while (dest < last) {
				for (x = 0; x < 4; x++) {
					y = sY[src]; src++;
					y |= sY[src] << 8; src++;
					y |= sY[src] << 16; src++;
					y |= sY[src] << 24; src++;

					dY[dest++] = y;
				}
				dest += scan >> 2; src += scan;
			}
		}
	}

	// Chrominance

	width = this.halfWidth;
	scan = width - 8;

	H = (motionH/2) >> 1;
	V = (motionV/2) >> 1;
	oddH = ((motionH/2) & 1) === 1;
	oddV = ((motionV/2) & 1) === 1;

	src = ((this.mbRow << 3) + V) * width + (this.mbCol << 3) + H;
	dest = (this.mbRow * width + this.mbCol) << 1;
	last = dest + (width << 1);

	var cr1, cr2, cr,
		cb1, cb2, cb;
	if (oddH) {
		if (oddV) {
			while (dest < last) {
				cr1 = sCr[src] + sCr[src+width];
				cb1 = sCb[src] + sCb[src+width];
				src++;
				for (x = 0; x < 2; x++) {
					cr2 = sCr[src] + sCr[src+width];
					cb2 = sCb[src] + sCb[src+width]; src++;
					cr = (((cr1 + cr2 + 2) >> 2) & 0xff);
					cb = (((cb1 + cb2 + 2) >> 2) & 0xff);

					cr1 = sCr[src] + sCr[src+width];
					cb1 = sCb[src] + sCb[src+width]; src++;
					cr |= (((cr1 + cr2 + 2) << 6) & 0xff00);
					cb |= (((cb1 + cb2 + 2) << 6) & 0xff00);

					cr2 = sCr[src] + sCr[src+width];
					cb2 = sCb[src] + sCb[src+width]; src++;
					cr |= (((cr1 + cr2 + 2) << 14) & 0xff0000);
					cb |= (((cb1 + cb2 + 2) << 14) & 0xff0000);

					cr1 = sCr[src] + sCr[src+width];
					cb1 = sCb[src] + sCb[src+width]; src++;
					cr |= (((cr1 + cr2 + 2) << 22) & 0xff000000);
					cb |= (((cb1 + cb2 + 2) << 22) & 0xff000000);

					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
		else {
			while (dest < last) {
				cr1 = sCr[src];
				cb1 = sCb[src];
				src++;
				for (x = 0; x < 2; x++) {
					cr2 = sCr[src];
					cb2 = sCb[src++];
					cr = (((cr1 + cr2 + 1) >> 1) & 0xff);
					cb = (((cb1 + cb2 + 1) >> 1) & 0xff);

					cr1 = sCr[src];
					cb1 = sCb[src++];
					cr |= (((cr1 + cr2 + 1) << 7) & 0xff00);
					cb |= (((cb1 + cb2 + 1) << 7) & 0xff00);

					cr2 = sCr[src];
					cb2 = sCb[src++];
					cr |= (((cr1 + cr2 + 1) << 15) & 0xff0000);
					cb |= (((cb1 + cb2 + 1) << 15) & 0xff0000);

					cr1 = sCr[src];
					cb1 = sCb[src++];
					cr |= (((cr1 + cr2 + 1) << 23) & 0xff000000);
					cb |= (((cb1 + cb2 + 1) << 23) & 0xff000000);

					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan-1;
			}
		}
	}
	else {
		if (oddV) {
			while (dest < last) {
				for (x = 0; x < 2; x++) {
					cr = (((sCr[src] + sCr[src+width] + 1) >> 1) & 0xff);
					cb = (((sCb[src] + sCb[src+width] + 1) >> 1) & 0xff); src++;

					cr |= (((sCr[src] + sCr[src+width] + 1) << 7) & 0xff00);
					cb |= (((sCb[src] + sCb[src+width] + 1) << 7) & 0xff00); src++;

					cr |= (((sCr[src] + sCr[src+width] + 1) << 15) & 0xff0000);
					cb |= (((sCb[src] + sCb[src+width] + 1) << 15) & 0xff0000); src++;

					cr |= (((sCr[src] + sCr[src+width] + 1) << 23) & 0xff000000);
					cb |= (((sCb[src] + sCb[src+width] + 1) << 23) & 0xff000000); src++;

					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan;
			}
		}
		else {
			while (dest < last) {
				for (x = 0; x < 2; x++) {
					cr = sCr[src];
					cb = sCb[src]; src++;

					cr |= sCr[src] << 8;
					cb |= sCb[src] << 8; src++;

					cr |= sCr[src] << 16;
					cb |= sCb[src] << 16; src++;

					cr |= sCr[src] << 24;
					cb |= sCb[src] << 24; src++;

					dCr[dest] = cr;
					dCb[dest] = cb;
					dest++;
				}
				dest += scan >> 2; src += scan;
			}
		}
	}
};


// Block layer

MPEG1.prototype.dcPredictorY = 0;
MPEG1.prototype.dcPredictorCr = 0;
MPEG1.prototype.dcPredictorCb = 0;

MPEG1.prototype.blockData = null;

MPEG1.prototype.decodeBlock = function(block) {

	var
		n = 0,
		quantMatrix;

	// Decode DC coefficient of intra-coded blocks
	if (this.macroblockIntra) {
		var
			predictor,
			dctSize;

		// DC prediction

		if (block < 4) {
			predictor = this.dcPredictorY;
			dctSize = this.readHuffman(MPEG1.DCT_DC_SIZE_LUMINANCE);
		}
		else {
			predictor = (block === 4 ? this.dcPredictorCr : this.dcPredictorCb);
			dctSize = this.readHuffman(MPEG1.DCT_DC_SIZE_CHROMINANCE);
		}

		// Read DC coeff
		if (dctSize > 0) {
			var differential = this.bits.read(dctSize);
			if ((differential & (1 << (dctSize - 1))) !== 0) {
				this.blockData[0] = predictor + differential;
			}
			else {
				this.blockData[0] = predictor + ((-1 << dctSize)|(differential+1));
			}
		}
		else {
			this.blockData[0] = predictor;
		}

		// Save predictor value
		if (block < 4) {
			this.dcPredictorY = this.blockData[0];
		}
		else if (block === 4) {
			this.dcPredictorCr = this.blockData[0];
		}
		else {
			this.dcPredictorCb = this.blockData[0];
		}

		// Dequantize + premultiply
		this.blockData[0] <<= (3 + 5);

		quantMatrix = this.intraQuantMatrix;
		n = 1;
	}
	else {
		quantMatrix = this.nonIntraQuantMatrix;
	}

	// Decode AC coefficients (+DC for non-intra)
	var level = 0;
	while (true) {
		var
			run = 0,
			coeff = this.readHuffman(MPEG1.DCT_COEFF);

		if ((coeff === 0x0001) && (n > 0) && (this.bits.read(1) === 0)) {
			// end_of_block
			break;
		}
		if (coeff === 0xffff) {
			// escape
			run = this.bits.read(6);
			level = this.bits.read(8);
			if (level === 0) {
				level = this.bits.read(8);
			}
			else if (level === 128) {
				level = this.bits.read(8) - 256;
			}
			else if (level > 128) {
				level = level - 256;
			}
		}
		else {
			run = coeff >> 8;
			level = coeff & 0xff;
			if (this.bits.read(1)) {
				level = -level;
			}
		}

		n += run;
		var dezigZagged = MPEG1.ZIG_ZAG[n];
		n++;

		// Dequantize, oddify, clip
		level <<= 1;
		if (!this.macroblockIntra) {
			level += (level < 0 ? -1 : 1);
		}
		level = (level * this.quantizerScale * quantMatrix[dezigZagged]) >> 4;
		if ((level & 1) === 0) {
			level -= level > 0 ? 1 : -1;
		}
		if (level > 2047) {
			level = 2047;
		}
		else if (level < -2048) {
			level = -2048;
		}

		// Save premultiplied coefficient
		this.blockData[dezigZagged] = level * MPEG1.PREMULTIPLIER_MATRIX[dezigZagged];
	}

	// Move block to its place
	var
		destArray,
		destIndex,
		scan;

	if (block < 4) {
		destArray = this.currentY;
		scan = this.codedWidth - 8;
		destIndex = (this.mbRow * this.codedWidth + this.mbCol) << 4;
		if ((block & 1) !== 0) {
			destIndex += 8;
		}
		if ((block & 2) !== 0) {
			destIndex += this.codedWidth << 3;
		}
	}
	else {
		destArray = (block === 4) ? this.currentCb : this.currentCr;
		scan = (this.codedWidth >> 1) - 8;
		destIndex = ((this.mbRow * this.codedWidth) << 2) + (this.mbCol << 3);
	}

	if (this.macroblockIntra) {
		// Overwrite (no prediction)
		if (n === 1) {
			MPEG1.CopyValueToDestination((this.blockData[0] + 128) >> 8, destArray, destIndex, scan);
			this.blockData[0] = 0;
		}
		else {
			MPEG1.IDCT(this.blockData);
			MPEG1.CopyBlockToDestination(this.blockData, destArray, destIndex, scan);
			JSMpeg.Fill(this.blockData, 0);
		}
	}
	else {
		// Add data to the predicted macroblock
		if (n === 1) {
			MPEG1.AddValueToDestination((this.blockData[0] + 128) >> 8, destArray, destIndex, scan);
			this.blockData[0] = 0;
		}
		else {
			MPEG1.IDCT(this.blockData);
			MPEG1.AddBlockToDestination(this.blockData, destArray, destIndex, scan);
			JSMpeg.Fill(this.blockData, 0);
		}
	}

	n = 0;
};

MPEG1.CopyBlockToDestination = function(block, dest, index, scan) {
	for (var n = 0; n < 64; n += 8, index += scan+8) {
		dest[index+0] = block[n+0];
		dest[index+1] = block[n+1];
		dest[index+2] = block[n+2];
		dest[index+3] = block[n+3];
		dest[index+4] = block[n+4];
		dest[index+5] = block[n+5];
		dest[index+6] = block[n+6];
		dest[index+7] = block[n+7];
	}
};

MPEG1.AddBlockToDestination = function(block, dest, index, scan) {
	for (var n = 0; n < 64; n += 8, index += scan+8) {
		dest[index+0] += block[n+0];
		dest[index+1] += block[n+1];
		dest[index+2] += block[n+2];
		dest[index+3] += block[n+3];
		dest[index+4] += block[n+4];
		dest[index+5] += block[n+5];
		dest[index+6] += block[n+6];
		dest[index+7] += block[n+7];
	}
};

MPEG1.CopyValueToDestination = function(value, dest, index, scan) {
	for (var n = 0; n < 64; n += 8, index += scan+8) {
		dest[index+0] = value;
		dest[index+1] = value;
		dest[index+2] = value;
		dest[index+3] = value;
		dest[index+4] = value;
		dest[index+5] = value;
		dest[index+6] = value;
		dest[index+7] = value;
	}
};

MPEG1.AddValueToDestination = function(value, dest, index, scan) {
	for (var n = 0; n < 64; n += 8, index += scan+8) {
		dest[index+0] += value;
		dest[index+1] += value;
		dest[index+2] += value;
		dest[index+3] += value;
		dest[index+4] += value;
		dest[index+5] += value;
		dest[index+6] += value;
		dest[index+7] += value;
	}
};

MPEG1.IDCT = function(block) {
	// See http://vsr.informatik.tu-chemnitz.de/~jan/MPEG/HTML/IDCT.html
	// for more info.

	var
		b1, b3, b4, b6, b7, tmp1, tmp2, m0,
		x0, x1, x2, x3, x4, y3, y4, y5, y6, y7;

	// Transform columns
	for (var i = 0; i < 8; ++i) {
		b1 = block[4*8+i];
		b3 = block[2*8+i] + block[6*8+i];
		b4 = block[5*8+i] - block[3*8+i];
		tmp1 = block[1*8+i] + block[7*8+i];
		tmp2 = block[3*8+i] + block[5*8+i];
		b6 = block[1*8+i] - block[7*8+i];
		b7 = tmp1 + tmp2;
		m0 = block[0*8+i];
		x4 = ((b6*473 - b4*196 + 128) >> 8) - b7;
		x0 = x4 - (((tmp1 - tmp2)*362 + 128) >> 8);
		x1 = m0 - b1;
		x2 = (((block[2*8+i] - block[6*8+i])*362 + 128) >> 8) - b3;
		x3 = m0 + b1;
		y3 = x1 + x2;
		y4 = x3 + b3;
		y5 = x1 - x2;
		y6 = x3 - b3;
		y7 = -x0 - ((b4*473 + b6*196 + 128) >> 8);
		block[0*8+i] = b7 + y4;
		block[1*8+i] = x4 + y3;
		block[2*8+i] = y5 - x0;
		block[3*8+i] = y6 - y7;
		block[4*8+i] = y6 + y7;
		block[5*8+i] = x0 + y5;
		block[6*8+i] = y3 - x4;
		block[7*8+i] = y4 - b7;
	}

	// Transform rows
	for (var i = 0; i < 64; i += 8) {
		b1 = block[4+i];
		b3 = block[2+i] + block[6+i];
		b4 = block[5+i] - block[3+i];
		tmp1 = block[1+i] + block[7+i];
		tmp2 = block[3+i] + block[5+i];
		b6 = block[1+i] - block[7+i];
		b7 = tmp1 + tmp2;
		m0 = block[0+i];
		x4 = ((b6*473 - b4*196 + 128) >> 8) - b7;
		x0 = x4 - (((tmp1 - tmp2)*362 + 128) >> 8);
		x1 = m0 - b1;
		x2 = (((block[2+i] - block[6+i])*362 + 128) >> 8) - b3;
		x3 = m0 + b1;
		y3 = x1 + x2;
		y4 = x3 + b3;
		y5 = x1 - x2;
		y6 = x3 - b3;
		y7 = -x0 - ((b4*473 + b6*196 + 128) >> 8);
		block[0+i] = (b7 + y4 + 128) >> 8;
		block[1+i] = (x4 + y3 + 128) >> 8;
		block[2+i] = (y5 - x0 + 128) >> 8;
		block[3+i] = (y6 - y7 + 128) >> 8;
		block[4+i] = (y6 + y7 + 128) >> 8;
		block[5+i] = (x0 + y5 + 128) >> 8;
		block[6+i] = (y3 - x4 + 128) >> 8;
		block[7+i] = (y4 - b7 + 128) >> 8;
	}
};


// VLC Tables and Constants

MPEG1.PICTURE_RATE = [
	0.000, 23.976, 24.000, 25.000, 29.970, 30.000, 50.000, 59.940,
	60.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000
];

MPEG1.ZIG_ZAG = new Uint8Array([
	 0,  1,  8, 16,  9,  2,  3, 10,
	17, 24, 32, 25, 18, 11,  4,  5,
	12, 19, 26, 33, 40, 48, 41, 34,
	27, 20, 13,  6,  7, 14, 21, 28,
	35, 42, 49, 56, 57, 50, 43, 36,
	29, 22, 15, 23, 30, 37, 44, 51,
	58, 59, 52, 45, 38, 31, 39, 46,
	53, 60, 61, 54, 47, 55, 62, 63
]);

MPEG1.DEFAULT_INTRA_QUANT_MATRIX = new Uint8Array([
	 8, 16, 19, 22, 26, 27, 29, 34,
	16, 16, 22, 24, 27, 29, 34, 37,
	19, 22, 26, 27, 29, 34, 34, 38,
	22, 22, 26, 27, 29, 34, 37, 40,
	22, 26, 27, 29, 32, 35, 40, 48,
	26, 27, 29, 32, 35, 40, 48, 58,
	26, 27, 29, 34, 38, 46, 56, 69,
	27, 29, 35, 38, 46, 56, 69, 83
]);

MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX = new Uint8Array([
	16, 16, 16, 16, 16, 16, 16, 16,
	16, 16, 16, 16, 16, 16, 16, 16,
	16, 16, 16, 16, 16, 16, 16, 16,
	16, 16, 16, 16, 16, 16, 16, 16,
	16, 16, 16, 16, 16, 16, 16, 16,
	16, 16, 16, 16, 16, 16, 16, 16,
	16, 16, 16, 16, 16, 16, 16, 16,
	16, 16, 16, 16, 16, 16, 16, 16
]);

MPEG1.PREMULTIPLIER_MATRIX = new Uint8Array([
	32, 44, 42, 38, 32, 25, 17,  9,
	44, 62, 58, 52, 44, 35, 24, 12,
	42, 58, 55, 49, 42, 33, 23, 12,
	38, 52, 49, 44, 38, 30, 20, 10,
	32, 44, 42, 38, 32, 25, 17,  9,
	25, 35, 33, 30, 25, 20, 14,  7,
	17, 24, 23, 20, 17, 14,  9,  5,
	 9, 12, 12, 10,  9,  7,  5,  2
]);

// MPEG-1 VLC

//  macroblock_stuffing decodes as 34.
//  macroblock_escape decodes as 35.

MPEG1.MACROBLOCK_ADDRESS_INCREMENT = new Int16Array([
	 1*3,  2*3,  0, //   0
	 3*3,  4*3,  0, //   1  0
	   0,    0,  1, //   2  1.
	 5*3,  6*3,  0, //   3  00
	 7*3,  8*3,  0, //   4  01
	 9*3, 10*3,  0, //   5  000
	11*3, 12*3,  0, //   6  001
	   0,    0,  3, //   7  010.
	   0,    0,  2, //   8  011.
	13*3, 14*3,  0, //   9  0000
	15*3, 16*3,  0, //  10  0001
	   0,    0,  5, //  11  0010.
	   0,    0,  4, //  12  0011.
	17*3, 18*3,  0, //  13  0000 0
	19*3, 20*3,  0, //  14  0000 1
	   0,    0,  7, //  15  0001 0.
	   0,    0,  6, //  16  0001 1.
	21*3, 22*3,  0, //  17  0000 00
	23*3, 24*3,  0, //  18  0000 01
	25*3, 26*3,  0, //  19  0000 10
	27*3, 28*3,  0, //  20  0000 11
	  -1, 29*3,  0, //  21  0000 000
	  -1, 30*3,  0, //  22  0000 001
	31*3, 32*3,  0, //  23  0000 010
	33*3, 34*3,  0, //  24  0000 011
	35*3, 36*3,  0, //  25  0000 100
	37*3, 38*3,  0, //  26  0000 101
	   0,    0,  9, //  27  0000 110.
	   0,    0,  8, //  28  0000 111.
	39*3, 40*3,  0, //  29  0000 0001
	41*3, 42*3,  0, //  30  0000 0011
	43*3, 44*3,  0, //  31  0000 0100
	45*3, 46*3,  0, //  32  0000 0101
	   0,    0, 15, //  33  0000 0110.
	   0,    0, 14, //  34  0000 0111.
	   0,    0, 13, //  35  0000 1000.
	   0,    0, 12, //  36  0000 1001.
	   0,    0, 11, //  37  0000 1010.
	   0,    0, 10, //  38  0000 1011.
	47*3,   -1,  0, //  39  0000 0001 0
	  -1, 48*3,  0, //  40  0000 0001 1
	49*3, 50*3,  0, //  41  0000 0011 0
	51*3, 52*3,  0, //  42  0000 0011 1
	53*3, 54*3,  0, //  43  0000 0100 0
	55*3, 56*3,  0, //  44  0000 0100 1
	57*3, 58*3,  0, //  45  0000 0101 0
	59*3, 60*3,  0, //  46  0000 0101 1
	61*3,   -1,  0, //  47  0000 0001 00
	  -1, 62*3,  0, //  48  0000 0001 11
	63*3, 64*3,  0, //  49  0000 0011 00
	65*3, 66*3,  0, //  50  0000 0011 01
	67*3, 68*3,  0, //  51  0000 0011 10
	69*3, 70*3,  0, //  52  0000 0011 11
	71*3, 72*3,  0, //  53  0000 0100 00
	73*3, 74*3,  0, //  54  0000 0100 01
	   0,    0, 21, //  55  0000 0100 10.
	   0,    0, 20, //  56  0000 0100 11.
	   0,    0, 19, //  57  0000 0101 00.
	   0,    0, 18, //  58  0000 0101 01.
	   0,    0, 17, //  59  0000 0101 10.
	   0,    0, 16, //  60  0000 0101 11.
	   0,    0, 35, //  61  0000 0001 000. -- macroblock_escape
	   0,    0, 34, //  62  0000 0001 111. -- macroblock_stuffing
	   0,    0, 33, //  63  0000 0011 000.
	   0,    0, 32, //  64  0000 0011 001.
	   0,    0, 31, //  65  0000 0011 010.
	   0,    0, 30, //  66  0000 0011 011.
	   0,    0, 29, //  67  0000 0011 100.
	   0,    0, 28, //  68  0000 0011 101.
	   0,    0, 27, //  69  0000 0011 110.
	   0,    0, 26, //  70  0000 0011 111.
	   0,    0, 25, //  71  0000 0100 000.
	   0,    0, 24, //  72  0000 0100 001.
	   0,    0, 23, //  73  0000 0100 010.
	   0,    0, 22  //  74  0000 0100 011.
]);

//  macroblock_type bitmap:
//    0x10  macroblock_quant
//    0x08  macroblock_motion_forward
//    0x04  macroblock_motion_backward
//    0x02  macrobkock_pattern
//    0x01  macroblock_intra
//

MPEG1.MACROBLOCK_TYPE_INTRA = new Int8Array([
	 1*3,  2*3,     0, //   0
	  -1,  3*3,     0, //   1  0
	   0,    0,  0x01, //   2  1.
	   0,    0,  0x11  //   3  01.
]);

MPEG1.MACROBLOCK_TYPE_PREDICTIVE = new Int8Array([
	 1*3,  2*3,     0, //  0
	 3*3,  4*3,     0, //  1  0
	   0,    0,  0x0a, //  2  1.
	 5*3,  6*3,     0, //  3  00
	   0,    0,  0x02, //  4  01.
	 7*3,  8*3,     0, //  5  000
	   0,    0,  0x08, //  6  001.
	 9*3, 10*3,     0, //  7  0000
	11*3, 12*3,     0, //  8  0001
	  -1, 13*3,     0, //  9  00000
	   0,    0,  0x12, // 10  00001.
	   0,    0,  0x1a, // 11  00010.
	   0,    0,  0x01, // 12  00011.
	   0,    0,  0x11  // 13  000001.
]);

MPEG1.MACROBLOCK_TYPE_B = new Int8Array([
	 1*3,  2*3,     0,  //  0
	 3*3,  5*3,     0,  //  1  0
	 4*3,  6*3,     0,  //  2  1
	 8*3,  7*3,     0,  //  3  00
	   0,    0,  0x0c,  //  4  10.
	 9*3, 10*3,     0,  //  5  01
	   0,    0,  0x0e,  //  6  11.
	13*3, 14*3,     0,  //  7  001
	12*3, 11*3,     0,  //  8  000
	   0,    0,  0x04,  //  9  010.
	   0,    0,  0x06,  // 10  011.
	18*3, 16*3,     0,  // 11  0001
	15*3, 17*3,     0,  // 12  0000
	   0,    0,  0x08,  // 13  0010.
	   0,    0,  0x0a,  // 14  0011.
	  -1, 19*3,     0,  // 15  00000
	   0,    0,  0x01,  // 16  00011.
	20*3, 21*3,     0,  // 17  00001
	   0,    0,  0x1e,  // 18  00010.
	   0,    0,  0x11,  // 19  000001.
	   0,    0,  0x16,  // 20  000010.
	   0,    0,  0x1a   // 21  000011.
]);

MPEG1.MACROBLOCK_TYPE = [
	null,
	MPEG1.MACROBLOCK_TYPE_INTRA,
	MPEG1.MACROBLOCK_TYPE_PREDICTIVE,
	MPEG1.MACROBLOCK_TYPE_B
];

MPEG1.CODE_BLOCK_PATTERN = new Int16Array([
	  2*3,   1*3,   0,  //   0
	  3*3,   6*3,   0,  //   1  1
	  4*3,   5*3,   0,  //   2  0
	  8*3,  11*3,   0,  //   3  10
	 12*3,  13*3,   0,  //   4  00
	  9*3,   7*3,   0,  //   5  01
	 10*3,  14*3,   0,  //   6  11
	 20*3,  19*3,   0,  //   7  011
	 18*3,  16*3,   0,  //   8  100
	 23*3,  17*3,   0,  //   9  010
	 27*3,  25*3,   0,  //  10  110
	 21*3,  28*3,   0,  //  11  101
	 15*3,  22*3,   0,  //  12  000
	 24*3,  26*3,   0,  //  13  001
	    0,     0,  60,  //  14  111.
	 35*3,  40*3,   0,  //  15  0000
	 44*3,  48*3,   0,  //  16  1001
	 38*3,  36*3,   0,  //  17  0101
	 42*3,  47*3,   0,  //  18  1000
	 29*3,  31*3,   0,  //  19  0111
	 39*3,  32*3,   0,  //  20  0110
	    0,     0,  32,  //  21  1010.
	 45*3,  46*3,   0,  //  22  0001
	 33*3,  41*3,   0,  //  23  0100
	 43*3,  34*3,   0,  //  24  0010
	    0,     0,   4,  //  25  1101.
	 30*3,  37*3,   0,  //  26  0011
	    0,     0,   8,  //  27  1100.
	    0,     0,  16,  //  28  1011.
	    0,     0,  44,  //  29  0111 0.
	 50*3,  56*3,   0,  //  30  0011 0
	    0,     0,  28,  //  31  0111 1.
	    0,     0,  52,  //  32  0110 1.
	    0,     0,  62,  //  33  0100 0.
	 61*3,  59*3,   0,  //  34  0010 1
	 52*3,  60*3,   0,  //  35  0000 0
	    0,     0,   1,  //  36  0101 1.
	 55*3,  54*3,   0,  //  37  0011 1
	    0,     0,  61,  //  38  0101 0.
	    0,     0,  56,  //  39  0110 0.
	 57*3,  58*3,   0,  //  40  0000 1
	    0,     0,   2,  //  41  0100 1.
	    0,     0,  40,  //  42  1000 0.
	 51*3,  62*3,   0,  //  43  0010 0
	    0,     0,  48,  //  44  1001 0.
	 64*3,  63*3,   0,  //  45  0001 0
	 49*3,  53*3,   0,  //  46  0001 1
	    0,     0,  20,  //  47  1000 1.
	    0,     0,  12,  //  48  1001 1.
	 80*3,  83*3,   0,  //  49  0001 10
	    0,     0,  63,  //  50  0011 00.
	 77*3,  75*3,   0,  //  51  0010 00
	 65*3,  73*3,   0,  //  52  0000 00
	 84*3,  66*3,   0,  //  53  0001 11
	    0,     0,  24,  //  54  0011 11.
	    0,     0,  36,  //  55  0011 10.
	    0,     0,   3,  //  56  0011 01.
	 69*3,  87*3,   0,  //  57  0000 10
	 81*3,  79*3,   0,  //  58  0000 11
	 68*3,  71*3,   0,  //  59  0010 11
	 70*3,  78*3,   0,  //  60  0000 01
	 67*3,  76*3,   0,  //  61  0010 10
	 72*3,  74*3,   0,  //  62  0010 01
	 86*3,  85*3,   0,  //  63  0001 01
	 88*3,  82*3,   0,  //  64  0001 00
	   -1,  94*3,   0,  //  65  0000 000
	 95*3,  97*3,   0,  //  66  0001 111
	    0,     0,  33,  //  67  0010 100.
	    0,     0,   9,  //  68  0010 110.
	106*3, 110*3,   0,  //  69  0000 100
	102*3, 116*3,   0,  //  70  0000 010
	    0,     0,   5,  //  71  0010 111.
	    0,     0,  10,  //  72  0010 010.
	 93*3,  89*3,   0,  //  73  0000 001
	    0,     0,   6,  //  74  0010 011.
	    0,     0,  18,  //  75  0010 001.
	    0,     0,  17,  //  76  0010 101.
	    0,     0,  34,  //  77  0010 000.
	113*3, 119*3,   0,  //  78  0000 011
	103*3, 104*3,   0,  //  79  0000 111
	 90*3,  92*3,   0,  //  80  0001 100
	109*3, 107*3,   0,  //  81  0000 110
	117*3, 118*3,   0,  //  82  0001 001
	101*3,  99*3,   0,  //  83  0001 101
	 98*3,  96*3,   0,  //  84  0001 110
	100*3,  91*3,   0,  //  85  0001 011
	114*3, 115*3,   0,  //  86  0001 010
	105*3, 108*3,   0,  //  87  0000 101
	112*3, 111*3,   0,  //  88  0001 000
	121*3, 125*3,   0,  //  89  0000 0011
	    0,     0,  41,  //  90  0001 1000.
	    0,     0,  14,  //  91  0001 0111.
	    0,     0,  21,  //  92  0001 1001.
	124*3, 122*3,   0,  //  93  0000 0010
	120*3, 123*3,   0,  //  94  0000 0001
	    0,     0,  11,  //  95  0001 1110.
	    0,     0,  19,  //  96  0001 1101.
	    0,     0,   7,  //  97  0001 1111.
	    0,     0,  35,  //  98  0001 1100.
	    0,     0,  13,  //  99  0001 1011.
	    0,     0,  50,  // 100  0001 0110.
	    0,     0,  49,  // 101  0001 1010.
	    0,     0,  58,  // 102  0000 0100.
	    0,     0,  37,  // 103  0000 1110.
	    0,     0,  25,  // 104  0000 1111.
	    0,     0,  45,  // 105  0000 1010.
	    0,     0,  57,  // 106  0000 1000.
	    0,     0,  26,  // 107  0000 1101.
	    0,     0,  29,  // 108  0000 1011.
	    0,     0,  38,  // 109  0000 1100.
	    0,     0,  53,  // 110  0000 1001.
	    0,     0,  23,  // 111  0001 0001.
	    0,     0,  43,  // 112  0001 0000.
	    0,     0,  46,  // 113  0000 0110.
	    0,     0,  42,  // 114  0001 0100.
	    0,     0,  22,  // 115  0001 0101.
	    0,     0,  54,  // 116  0000 0101.
	    0,     0,  51,  // 117  0001 0010.
	    0,     0,  15,  // 118  0001 0011.
	    0,     0,  30,  // 119  0000 0111.
	    0,     0,  39,  // 120  0000 0001 0.
	    0,     0,  47,  // 121  0000 0011 0.
	    0,     0,  55,  // 122  0000 0010 1.
	    0,     0,  27,  // 123  0000 0001 1.
	    0,     0,  59,  // 124  0000 0010 0.
	    0,     0,  31   // 125  0000 0011 1.
]);

MPEG1.MOTION = new Int16Array([
	  1*3,   2*3,   0,  //   0
	  4*3,   3*3,   0,  //   1  0
	    0,     0,   0,  //   2  1.
	  6*3,   5*3,   0,  //   3  01
	  8*3,   7*3,   0,  //   4  00
	    0,     0,  -1,  //   5  011.
	    0,     0,   1,  //   6  010.
	  9*3,  10*3,   0,  //   7  001
	 12*3,  11*3,   0,  //   8  000
	    0,     0,   2,  //   9  0010.
	    0,     0,  -2,  //  10  0011.
	 14*3,  15*3,   0,  //  11  0001
	 16*3,  13*3,   0,  //  12  0000
	 20*3,  18*3,   0,  //  13  0000 1
	    0,     0,   3,  //  14  0001 0.
	    0,     0,  -3,  //  15  0001 1.
	 17*3,  19*3,   0,  //  16  0000 0
	   -1,  23*3,   0,  //  17  0000 00
	 27*3,  25*3,   0,  //  18  0000 11
	 26*3,  21*3,   0,  //  19  0000 01
	 24*3,  22*3,   0,  //  20  0000 10
	 32*3,  28*3,   0,  //  21  0000 011
	 29*3,  31*3,   0,  //  22  0000 101
	   -1,  33*3,   0,  //  23  0000 001
	 36*3,  35*3,   0,  //  24  0000 100
	    0,     0,  -4,  //  25  0000 111.
	 30*3,  34*3,   0,  //  26  0000 010
	    0,     0,   4,  //  27  0000 110.
	    0,     0,  -7,  //  28  0000 0111.
	    0,     0,   5,  //  29  0000 1010.
	 37*3,  41*3,   0,  //  30  0000 0100
	    0,     0,  -5,  //  31  0000 1011.
	    0,     0,   7,  //  32  0000 0110.
	 38*3,  40*3,   0,  //  33  0000 0011
	 42*3,  39*3,   0,  //  34  0000 0101
	    0,     0,  -6,  //  35  0000 1001.
	    0,     0,   6,  //  36  0000 1000.
	 51*3,  54*3,   0,  //  37  0000 0100 0
	 50*3,  49*3,   0,  //  38  0000 0011 0
	 45*3,  46*3,   0,  //  39  0000 0101 1
	 52*3,  47*3,   0,  //  40  0000 0011 1
	 43*3,  53*3,   0,  //  41  0000 0100 1
	 44*3,  48*3,   0,  //  42  0000 0101 0
	    0,     0,  10,  //  43  0000 0100 10.
	    0,     0,   9,  //  44  0000 0101 00.
	    0,     0,   8,  //  45  0000 0101 10.
	    0,     0,  -8,  //  46  0000 0101 11.
	 57*3,  66*3,   0,  //  47  0000 0011 11
	    0,     0,  -9,  //  48  0000 0101 01.
	 60*3,  64*3,   0,  //  49  0000 0011 01
	 56*3,  61*3,   0,  //  50  0000 0011 00
	 55*3,  62*3,   0,  //  51  0000 0100 00
	 58*3,  63*3,   0,  //  52  0000 0011 10
	    0,     0, -10,  //  53  0000 0100 11.
	 59*3,  65*3,   0,  //  54  0000 0100 01
	    0,     0,  12,  //  55  0000 0100 000.
	    0,     0,  16,  //  56  0000 0011 000.
	    0,     0,  13,  //  57  0000 0011 110.
	    0,     0,  14,  //  58  0000 0011 100.
	    0,     0,  11,  //  59  0000 0100 010.
	    0,     0,  15,  //  60  0000 0011 010.
	    0,     0, -16,  //  61  0000 0011 001.
	    0,     0, -12,  //  62  0000 0100 001.
	    0,     0, -14,  //  63  0000 0011 101.
	    0,     0, -15,  //  64  0000 0011 011.
	    0,     0, -11,  //  65  0000 0100 011.
	    0,     0, -13   //  66  0000 0011 111.
]);

MPEG1.DCT_DC_SIZE_LUMINANCE = new Int8Array([
	  2*3,   1*3, 0,  //   0
	  6*3,   5*3, 0,  //   1  1
	  3*3,   4*3, 0,  //   2  0
	    0,     0, 1,  //   3  00.
	    0,     0, 2,  //   4  01.
	  9*3,   8*3, 0,  //   5  11
	  7*3,  10*3, 0,  //   6  10
	    0,     0, 0,  //   7  100.
	 12*3,  11*3, 0,  //   8  111
	    0,     0, 4,  //   9  110.
	    0,     0, 3,  //  10  101.
	 13*3,  14*3, 0,  //  11  1111
	    0,     0, 5,  //  12  1110.
	    0,     0, 6,  //  13  1111 0.
	 16*3,  15*3, 0,  //  14  1111 1
	 17*3,    -1, 0,  //  15  1111 11
	    0,     0, 7,  //  16  1111 10.
	    0,     0, 8   //  17  1111 110.
]);

MPEG1.DCT_DC_SIZE_CHROMINANCE = new Int8Array([
	  2*3,   1*3, 0,  //   0
	  4*3,   3*3, 0,  //   1  1
	  6*3,   5*3, 0,  //   2  0
	  8*3,   7*3, 0,  //   3  11
	    0,     0, 2,  //   4  10.
	    0,     0, 1,  //   5  01.
	    0,     0, 0,  //   6  00.
	 10*3,   9*3, 0,  //   7  111
	    0,     0, 3,  //   8  110.
	 12*3,  11*3, 0,  //   9  1111
	    0,     0, 4,  //  10  1110.
	 14*3,  13*3, 0,  //  11  1111 1
	    0,     0, 5,  //  12  1111 0.
	 16*3,  15*3, 0,  //  13  1111 11
	    0,     0, 6,  //  14  1111 10.
	 17*3,    -1, 0,  //  15  1111 111
	    0,     0, 7,  //  16  1111 110.
	    0,     0, 8   //  17  1111 1110.
]);

//  dct_coeff bitmap:
//    0xff00  run
//    0x00ff  level

//  Decoded values are unsigned. Sign bit follows in the stream.

//  Interpretation of the value 0x0001
//    for dc_coeff_first:  run=0, level=1
//    for dc_coeff_next:   If the next bit is 1: run=0, level=1
//                         If the next bit is 0: end_of_block

//  escape decodes as 0xffff.

MPEG1.DCT_COEFF = new Int32Array([
	  1*3,   2*3,      0,  //   0
	  4*3,   3*3,      0,  //   1  0
	    0,     0, 0x0001,  //   2  1.
	  7*3,   8*3,      0,  //   3  01
	  6*3,   5*3,      0,  //   4  00
	 13*3,   9*3,      0,  //   5  001
	 11*3,  10*3,      0,  //   6  000
	 14*3,  12*3,      0,  //   7  010
	    0,     0, 0x0101,  //   8  011.
	 20*3,  22*3,      0,  //   9  0011
	 18*3,  21*3,      0,  //  10  0001
	 16*3,  19*3,      0,  //  11  0000
	    0,     0, 0x0201,  //  12  0101.
	 17*3,  15*3,      0,  //  13  0010
	    0,     0, 0x0002,  //  14  0100.
	    0,     0, 0x0003,  //  15  0010 1.
	 27*3,  25*3,      0,  //  16  0000 0
	 29*3,  31*3,      0,  //  17  0010 0
	 24*3,  26*3,      0,  //  18  0001 0
	 32*3,  30*3,      0,  //  19  0000 1
	    0,     0, 0x0401,  //  20  0011 0.
	 23*3,  28*3,      0,  //  21  0001 1
	    0,     0, 0x0301,  //  22  0011 1.
	    0,     0, 0x0102,  //  23  0001 10.
	    0,     0, 0x0701,  //  24  0001 00.
	    0,     0, 0xffff,  //  25  0000 01. -- escape
	    0,     0, 0x0601,  //  26  0001 01.
	 37*3,  36*3,      0,  //  27  0000 00
	    0,     0, 0x0501,  //  28  0001 11.
	 35*3,  34*3,      0,  //  29  0010 00
	 39*3,  38*3,      0,  //  30  0000 11
	 33*3,  42*3,      0,  //  31  0010 01
	 40*3,  41*3,      0,  //  32  0000 10
	 52*3,  50*3,      0,  //  33  0010 010
	 54*3,  53*3,      0,  //  34  0010 001
	 48*3,  49*3,      0,  //  35  0010 000
	 43*3,  45*3,      0,  //  36  0000 001
	 46*3,  44*3,      0,  //  37  0000 000
	    0,     0, 0x0801,  //  38  0000 111.
	    0,     0, 0x0004,  //  39  0000 110.
	    0,     0, 0x0202,  //  40  0000 100.
	    0,     0, 0x0901,  //  41  0000 101.
	 51*3,  47*3,      0,  //  42  0010 011
	 55*3,  57*3,      0,  //  43  0000 0010
	 60*3,  56*3,      0,  //  44  0000 0001
	 59*3,  58*3,      0,  //  45  0000 0011
	 61*3,  62*3,      0,  //  46  0000 0000
	    0,     0, 0x0a01,  //  47  0010 0111.
	    0,     0, 0x0d01,  //  48  0010 0000.
	    0,     0, 0x0006,  //  49  0010 0001.
	    0,     0, 0x0103,  //  50  0010 0101.
	    0,     0, 0x0005,  //  51  0010 0110.
	    0,     0, 0x0302,  //  52  0010 0100.
	    0,     0, 0x0b01,  //  53  0010 0011.
	    0,     0, 0x0c01,  //  54  0010 0010.
	 76*3,  75*3,      0,  //  55  0000 0010 0
	 67*3,  70*3,      0,  //  56  0000 0001 1
	 73*3,  71*3,      0,  //  57  0000 0010 1
	 78*3,  74*3,      0,  //  58  0000 0011 1
	 72*3,  77*3,      0,  //  59  0000 0011 0
	 69*3,  64*3,      0,  //  60  0000 0001 0
	 68*3,  63*3,      0,  //  61  0000 0000 0
	 66*3,  65*3,      0,  //  62  0000 0000 1
	 81*3,  87*3,      0,  //  63  0000 0000 01
	 91*3,  80*3,      0,  //  64  0000 0001 01
	 82*3,  79*3,      0,  //  65  0000 0000 11
	 83*3,  86*3,      0,  //  66  0000 0000 10
	 93*3,  92*3,      0,  //  67  0000 0001 10
	 84*3,  85*3,      0,  //  68  0000 0000 00
	 90*3,  94*3,      0,  //  69  0000 0001 00
	 88*3,  89*3,      0,  //  70  0000 0001 11
	    0,     0, 0x0203,  //  71  0000 0010 11.
	    0,     0, 0x0104,  //  72  0000 0011 00.
	    0,     0, 0x0007,  //  73  0000 0010 10.
	    0,     0, 0x0402,  //  74  0000 0011 11.
	    0,     0, 0x0502,  //  75  0000 0010 01.
	    0,     0, 0x1001,  //  76  0000 0010 00.
	    0,     0, 0x0f01,  //  77  0000 0011 01.
	    0,     0, 0x0e01,  //  78  0000 0011 10.
	105*3, 107*3,      0,  //  79  0000 0000 111
	111*3, 114*3,      0,  //  80  0000 0001 011
	104*3,  97*3,      0,  //  81  0000 0000 010
	125*3, 119*3,      0,  //  82  0000 0000 110
	 96*3,  98*3,      0,  //  83  0000 0000 100
	   -1, 123*3,      0,  //  84  0000 0000 000
	 95*3, 101*3,      0,  //  85  0000 0000 001
	106*3, 121*3,      0,  //  86  0000 0000 101
	 99*3, 102*3,      0,  //  87  0000 0000 011
	113*3, 103*3,      0,  //  88  0000 0001 110
	112*3, 116*3,      0,  //  89  0000 0001 111
	110*3, 100*3,      0,  //  90  0000 0001 000
	124*3, 115*3,      0,  //  91  0000 0001 010
	117*3, 122*3,      0,  //  92  0000 0001 101
	109*3, 118*3,      0,  //  93  0000 0001 100
	120*3, 108*3,      0,  //  94  0000 0001 001
	127*3, 136*3,      0,  //  95  0000 0000 0010
	139*3, 140*3,      0,  //  96  0000 0000 1000
	130*3, 126*3,      0,  //  97  0000 0000 0101
	145*3, 146*3,      0,  //  98  0000 0000 1001
	128*3, 129*3,      0,  //  99  0000 0000 0110
	    0,     0, 0x0802,  // 100  0000 0001 0001.
	132*3, 134*3,      0,  // 101  0000 0000 0011
	155*3, 154*3,      0,  // 102  0000 0000 0111
	    0,     0, 0x0008,  // 103  0000 0001 1101.
	137*3, 133*3,      0,  // 104  0000 0000 0100
	143*3, 144*3,      0,  // 105  0000 0000 1110
	151*3, 138*3,      0,  // 106  0000 0000 1010
	142*3, 141*3,      0,  // 107  0000 0000 1111
	    0,     0, 0x000a,  // 108  0000 0001 0011.
	    0,     0, 0x0009,  // 109  0000 0001 1000.
	    0,     0, 0x000b,  // 110  0000 0001 0000.
	    0,     0, 0x1501,  // 111  0000 0001 0110.
	    0,     0, 0x0602,  // 112  0000 0001 1110.
	    0,     0, 0x0303,  // 113  0000 0001 1100.
	    0,     0, 0x1401,  // 114  0000 0001 0111.
	    0,     0, 0x0702,  // 115  0000 0001 0101.
	    0,     0, 0x1101,  // 116  0000 0001 1111.
	    0,     0, 0x1201,  // 117  0000 0001 1010.
	    0,     0, 0x1301,  // 118  0000 0001 1001.
	148*3, 152*3,      0,  // 119  0000 0000 1101
	    0,     0, 0x0403,  // 120  0000 0001 0010.
	153*3, 150*3,      0,  // 121  0000 0000 1011
	    0,     0, 0x0105,  // 122  0000 0001 1011.
	131*3, 135*3,      0,  // 123  0000 0000 0001
	    0,     0, 0x0204,  // 124  0000 0001 0100.
	149*3, 147*3,      0,  // 125  0000 0000 1100
	172*3, 173*3,      0,  // 126  0000 0000 0101 1
	162*3, 158*3,      0,  // 127  0000 0000 0010 0
	170*3, 161*3,      0,  // 128  0000 0000 0110 0
	168*3, 166*3,      0,  // 129  0000 0000 0110 1
	157*3, 179*3,      0,  // 130  0000 0000 0101 0
	169*3, 167*3,      0,  // 131  0000 0000 0001 0
	174*3, 171*3,      0,  // 132  0000 0000 0011 0
	178*3, 177*3,      0,  // 133  0000 0000 0100 1
	156*3, 159*3,      0,  // 134  0000 0000 0011 1
	164*3, 165*3,      0,  // 135  0000 0000 0001 1
	183*3, 182*3,      0,  // 136  0000 0000 0010 1
	175*3, 176*3,      0,  // 137  0000 0000 0100 0
	    0,     0, 0x0107,  // 138  0000 0000 1010 1.
	    0,     0, 0x0a02,  // 139  0000 0000 1000 0.
	    0,     0, 0x0902,  // 140  0000 0000 1000 1.
	    0,     0, 0x1601,  // 141  0000 0000 1111 1.
	    0,     0, 0x1701,  // 142  0000 0000 1111 0.
	    0,     0, 0x1901,  // 143  0000 0000 1110 0.
	    0,     0, 0x1801,  // 144  0000 0000 1110 1.
	    0,     0, 0x0503,  // 145  0000 0000 1001 0.
	    0,     0, 0x0304,  // 146  0000 0000 1001 1.
	    0,     0, 0x000d,  // 147  0000 0000 1100 1.
	    0,     0, 0x000c,  // 148  0000 0000 1101 0.
	    0,     0, 0x000e,  // 149  0000 0000 1100 0.
	    0,     0, 0x000f,  // 150  0000 0000 1011 1.
	    0,     0, 0x0205,  // 151  0000 0000 1010 0.
	    0,     0, 0x1a01,  // 152  0000 0000 1101 1.
	    0,     0, 0x0106,  // 153  0000 0000 1011 0.
	180*3, 181*3,      0,  // 154  0000 0000 0111 1
	160*3, 163*3,      0,  // 155  0000 0000 0111 0
	196*3, 199*3,      0,  // 156  0000 0000 0011 10
	    0,     0, 0x001b,  // 157  0000 0000 0101 00.
	203*3, 185*3,      0,  // 158  0000 0000 0010 01
	202*3, 201*3,      0,  // 159  0000 0000 0011 11
	    0,     0, 0x0013,  // 160  0000 0000 0111 00.
	    0,     0, 0x0016,  // 161  0000 0000 0110 01.
	197*3, 207*3,      0,  // 162  0000 0000 0010 00
	    0,     0, 0x0012,  // 163  0000 0000 0111 01.
	191*3, 192*3,      0,  // 164  0000 0000 0001 10
	188*3, 190*3,      0,  // 165  0000 0000 0001 11
	    0,     0, 0x0014,  // 166  0000 0000 0110 11.
	184*3, 194*3,      0,  // 167  0000 0000 0001 01
	    0,     0, 0x0015,  // 168  0000 0000 0110 10.
	186*3, 193*3,      0,  // 169  0000 0000 0001 00
	    0,     0, 0x0017,  // 170  0000 0000 0110 00.
	204*3, 198*3,      0,  // 171  0000 0000 0011 01
	    0,     0, 0x0019,  // 172  0000 0000 0101 10.
	    0,     0, 0x0018,  // 173  0000 0000 0101 11.
	200*3, 205*3,      0,  // 174  0000 0000 0011 00
	    0,     0, 0x001f,  // 175  0000 0000 0100 00.
	    0,     0, 0x001e,  // 176  0000 0000 0100 01.
	    0,     0, 0x001c,  // 177  0000 0000 0100 11.
	    0,     0, 0x001d,  // 178  0000 0000 0100 10.
	    0,     0, 0x001a,  // 179  0000 0000 0101 01.
	    0,     0, 0x0011,  // 180  0000 0000 0111 10.
	    0,     0, 0x0010,  // 181  0000 0000 0111 11.
	189*3, 206*3,      0,  // 182  0000 0000 0010 11
	187*3, 195*3,      0,  // 183  0000 0000 0010 10
	218*3, 211*3,      0,  // 184  0000 0000 0001 010
	    0,     0, 0x0025,  // 185  0000 0000 0010 011.
	215*3, 216*3,      0,  // 186  0000 0000 0001 000
	    0,     0, 0x0024,  // 187  0000 0000 0010 100.
	210*3, 212*3,      0,  // 188  0000 0000 0001 110
	    0,     0, 0x0022,  // 189  0000 0000 0010 110.
	213*3, 209*3,      0,  // 190  0000 0000 0001 111
	221*3, 222*3,      0,  // 191  0000 0000 0001 100
	219*3, 208*3,      0,  // 192  0000 0000 0001 101
	217*3, 214*3,      0,  // 193  0000 0000 0001 001
	223*3, 220*3,      0,  // 194  0000 0000 0001 011
	    0,     0, 0x0023,  // 195  0000 0000 0010 101.
	    0,     0, 0x010b,  // 196  0000 0000 0011 100.
	    0,     0, 0x0028,  // 197  0000 0000 0010 000.
	    0,     0, 0x010c,  // 198  0000 0000 0011 011.
	    0,     0, 0x010a,  // 199  0000 0000 0011 101.
	    0,     0, 0x0020,  // 200  0000 0000 0011 000.
	    0,     0, 0x0108,  // 201  0000 0000 0011 111.
	    0,     0, 0x0109,  // 202  0000 0000 0011 110.
	    0,     0, 0x0026,  // 203  0000 0000 0010 010.
	    0,     0, 0x010d,  // 204  0000 0000 0011 010.
	    0,     0, 0x010e,  // 205  0000 0000 0011 001.
	    0,     0, 0x0021,  // 206  0000 0000 0010 111.
	    0,     0, 0x0027,  // 207  0000 0000 0010 001.
	    0,     0, 0x1f01,  // 208  0000 0000 0001 1011.
	    0,     0, 0x1b01,  // 209  0000 0000 0001 1111.
	    0,     0, 0x1e01,  // 210  0000 0000 0001 1100.
	    0,     0, 0x1002,  // 211  0000 0000 0001 0101.
	    0,     0, 0x1d01,  // 212  0000 0000 0001 1101.
	    0,     0, 0x1c01,  // 213  0000 0000 0001 1110.
	    0,     0, 0x010f,  // 214  0000 0000 0001 0011.
	    0,     0, 0x0112,  // 215  0000 0000 0001 0000.
	    0,     0, 0x0111,  // 216  0000 0000 0001 0001.
	    0,     0, 0x0110,  // 217  0000 0000 0001 0010.
	    0,     0, 0x0603,  // 218  0000 0000 0001 0100.
	    0,     0, 0x0b02,  // 219  0000 0000 0001 1010.
	    0,     0, 0x0e02,  // 220  0000 0000 0001 0111.
	    0,     0, 0x0d02,  // 221  0000 0000 0001 1000.
	    0,     0, 0x0c02,  // 222  0000 0000 0001 1001.
	    0,     0, 0x0f02   // 223  0000 0000 0001 0110.
]);

MPEG1.PICTURE_TYPE = {
	INTRA: 1,
	PREDICTIVE: 2,
	B: 3
};

MPEG1.START = {
	SEQUENCE: 0xB3,
	SLICE_FIRST: 0x01,
	SLICE_LAST: 0xAF,
	PICTURE: 0x00,
	EXTENSION: 0xB5,
	USER_DATA: 0xB2
};

return MPEG1;

})();

JSMpeg.Decoder.MPEG1VideoWASM = (function(){ "use strict";

var MPEG1WASM = function(options) {
	JSMpeg.Decoder.Base.call(this, options);

	this.onDecodeCallback = options.onVideoDecode;      
	this.module = options.wasmModule;

	this.bufferSize = options.videoBufferSize || 512*1024;
	this.bufferMode = options.streaming
		? JSMpeg.BitBuffer.MODE.EVICT
		: JSMpeg.BitBuffer.MODE.EXPAND;

	this.decodeFirstFrame = options.decodeFirstFrame !== false;
	this.hasSequenceHeader = false;
};

MPEG1WASM.prototype = Object.create(JSMpeg.Decoder.Base.prototype);
MPEG1WASM.prototype.constructor = MPEG1WASM;

MPEG1WASM.prototype.initializeWasmDecoder = function() {
	if (!this.module.instance) {
		console.warn('JSMpeg: WASM module not compiled yet');
		return;
	}
	this.instance = this.module.instance;
	this.functions = this.module.instance.exports;
	this.decoder = this.functions._mpeg1_decoder_create(this.bufferSize, this.bufferMode);
};

MPEG1WASM.prototype.destroy = function() {
	if (!this.decoder) {
		return;
	}
	this.functions._mpeg1_decoder_destroy(this.decoder);
};

MPEG1WASM.prototype.bufferGetIndex = function() {
	if (!this.decoder) {
		return;
	}
	return this.functions._mpeg1_decoder_get_index(this.decoder);
};

MPEG1WASM.prototype.bufferSetIndex = function(index) {
	if (!this.decoder) {
		return;
	}
	this.functions._mpeg1_decoder_set_index(this.decoder, index);
};

MPEG1WASM.prototype.bufferWrite = function(buffers) {
	if (!this.decoder) {
		this.initializeWasmDecoder();
	}

	var totalLength = 0;
	for (var i = 0; i < buffers.length; i++) {
		totalLength += buffers[i].length;
	}

	var ptr = this.functions._mpeg1_decoder_get_write_ptr(this.decoder, totalLength);
	for (var i = 0; i < buffers.length; i++) {
		this.instance.heapU8.set(buffers[i], ptr);
		ptr += buffers[i].length;
	}
	
	this.functions._mpeg1_decoder_did_write(this.decoder, totalLength);
	return totalLength;
};

MPEG1WASM.prototype.write = function(pts, buffers) {
	JSMpeg.Decoder.Base.prototype.write.call(this, pts, buffers);

	if (!this.hasSequenceHeader && this.functions._mpeg1_decoder_has_sequence_header(this.decoder)) {
		this.loadSequnceHeader();
	}
};

MPEG1WASM.prototype.loadSequnceHeader = function() {
	this.hasSequenceHeader = true;
	this.frameRate = this.functions._mpeg1_decoder_get_frame_rate(this.decoder);
	this.codedSize = this.functions._mpeg1_decoder_get_coded_size(this.decoder);

	if (this.destination) {
		var w = this.functions._mpeg1_decoder_get_width(this.decoder);
		var h = this.functions._mpeg1_decoder_get_height(this.decoder);
		this.destination.resize(w, h);
	}

	if (this.decodeFirstFrame) {
		this.decode();
	}
};

MPEG1WASM.prototype.decode = function() {
	var startTime = JSMpeg.Now();

	if (!this.decoder) {
		return false;
	}

	var didDecode = this.functions._mpeg1_decoder_decode(this.decoder);
	if (!didDecode) {
		return false;
	}

	// Invoke decode callbacks
	if (this.destination) {
		var ptrY = this.functions._mpeg1_decoder_get_y_ptr(this.decoder),
			ptrCr = this.functions._mpeg1_decoder_get_cr_ptr(this.decoder),
			ptrCb = this.functions._mpeg1_decoder_get_cb_ptr(this.decoder);

		var dy = this.instance.heapU8.subarray(ptrY, ptrY + this.codedSize);
		var dcr = this.instance.heapU8.subarray(ptrCr, ptrCr + (this.codedSize >> 2));
		var dcb = this.instance.heapU8.subarray(ptrCb, ptrCb + (this.codedSize >> 2));

		this.destination.render(dy, dcr, dcb, false);
	}

	this.advanceDecodedTime(1/this.frameRate);

	var elapsedTime = JSMpeg.Now() - startTime;
	if (this.onDecodeCallback) {
		this.onDecodeCallback(this, elapsedTime);
	}
	return true;
};

return MPEG1WASM;

})();

JSMpeg.Decoder.MP2Audio = (function(){ "use strict";

// Based on kjmp2 by Martin J. Fiedler
// http://keyj.emphy.de/kjmp2/

var MP2 = function(options) {
	JSMpeg.Decoder.Base.call(this, options);

	this.onDecodeCallback = options.onAudioDecode;

	var bufferSize = options.audioBufferSize || 128*1024;
	var bufferMode = options.streaming
		? JSMpeg.BitBuffer.MODE.EVICT
		: JSMpeg.BitBuffer.MODE.EXPAND;

	this.bits = new JSMpeg.BitBuffer(bufferSize, bufferMode);

	this.left = new Float32Array(1152);
	this.right = new Float32Array(1152);
	this.sampleRate = 44100;
	
	this.D = new Float32Array(1024);
	this.D.set(MP2.SYNTHESIS_WINDOW, 0);
	this.D.set(MP2.SYNTHESIS_WINDOW, 512);
	this.V = [new Float32Array(1024), new Float32Array(1024)];
	this.U = new Int32Array(32);
	this.VPos = 0;

	this.allocation = [new Array(32), new Array(32)];
	this.scaleFactorInfo = [new Uint8Array(32), new Uint8Array(32)];
	this.scaleFactor = [new Array(32), new Array(32)];
	this.sample = [new Array(32), new Array(32)];
	
	for (var j = 0; j < 2; j++) {
		for (var i = 0; i < 32; i++) {
			this.scaleFactor[j][i] = [0, 0, 0];
			this.sample[j][i] = [0, 0, 0];
		}
	}
};

MP2.prototype = Object.create(JSMpeg.Decoder.Base.prototype);
MP2.prototype.constructor = MP2;

MP2.prototype.decode = function() {
	var startTime = JSMpeg.Now();

	var pos = this.bits.index >> 3;
	if (pos >= this.bits.byteLength) {
		return false;
	}

	var decoded = this.decodeFrame(this.left, this.right);
	this.bits.index = (pos + decoded) << 3;
	if (!decoded) {
		return false;
	}

	if (this.destination) {
		this.destination.play(this.sampleRate, this.left, this.right);
	}

	this.advanceDecodedTime(this.left.length / this.sampleRate);

	var elapsedTime = JSMpeg.Now() - startTime;
	if (this.onDecodeCallback) {
		this.onDecodeCallback(this, elapsedTime);
	}
	return true;
};

MP2.prototype.getCurrentTime = function() {
	var enqueuedTime = this.destination ? this.destination.enqueuedTime : 0;
	return this.decodedTime - enqueuedTime;
};

MP2.prototype.decodeFrame = function(left, right) {
	// Check for valid header: syncword OK, MPEG-Audio Layer 2
	var sync = this.bits.read(11),
		version = this.bits.read(2),
		layer = this.bits.read(2),
		hasCRC = !this.bits.read(1);

	if (
		sync !== MP2.FRAME_SYNC ||
		version !== MP2.VERSION.MPEG_1 ||
		layer !== MP2.LAYER.II
	) {
		return 0; // Invalid header or unsupported version
	}

	var bitrateIndex = this.bits.read(4) - 1;
	if (bitrateIndex > 13) {
		return 0;  // Invalid bit rate or 'free format'
	}

	var sampleRateIndex = this.bits.read(2);
	var sampleRate = MP2.SAMPLE_RATE[sampleRateIndex];
	if (sampleRateIndex === 3) {
		return 0; // Invalid sample rate
	}
	if (version === MP2.VERSION.MPEG_2) {
		sampleRateIndex += 4;
		bitrateIndex += 14;
	}
	var padding = this.bits.read(1),
		privat = this.bits.read(1),
		mode = this.bits.read(2);

	// Parse the mode_extension, set up the stereo bound
	var bound = 0;
	if (mode === MP2.MODE.JOINT_STEREO) {
		bound = (this.bits.read(2) + 1) << 2;
	}
	else {
		this.bits.skip(2);
		bound = (mode === MP2.MODE.MONO) ? 0 : 32;
	}

	// Discard the last 4 bits of the header and the CRC value, if present
	this.bits.skip(4);
	if (hasCRC) {
		this.bits.skip(16);
	}

	// Compute the frame size
	var bitrate = MP2.BIT_RATE[bitrateIndex],
		sampleRate = MP2.SAMPLE_RATE[sampleRateIndex],
		frameSize = ((144000 * bitrate / sampleRate) + padding)|0;
	

	// Prepare the quantizer table lookups
	var tab3 = 0;
	var sblimit = 0;
	if (version === MP2.VERSION.MPEG_2) {
		// MPEG-2 (LSR)
		tab3 = 2;
		sblimit = 30;
	}
	else {
		// MPEG-1
		var tab1 = (mode === MP2.MODE.MONO) ? 0 : 1;
		var tab2 = MP2.QUANT_LUT_STEP_1[tab1][bitrateIndex];
		tab3 = MP2.QUANT_LUT_STEP_2[tab2][sampleRateIndex];
		sblimit = tab3 & 63;
		tab3 >>= 6;
	}

	if (bound > sblimit) {
		bound = sblimit;
	}

	// Read the allocation information
	for (var sb = 0; sb < bound; sb++) {
		this.allocation[0][sb] = this.readAllocation(sb, tab3);
		this.allocation[1][sb] = this.readAllocation(sb, tab3);
	}

	for (var sb = bound; sb < sblimit; sb++) {
		this.allocation[0][sb] = 
			this.allocation[1][sb] =
			this.readAllocation(sb, tab3);
	}

	// Read scale factor selector information
	var channels = (mode === MP2.MODE.MONO) ? 1 : 2;
	for (var sb = 0;  sb < sblimit; sb++) {
		for (ch = 0;  ch < channels; ch++) {
			if (this.allocation[ch][sb]) {
				this.scaleFactorInfo[ch][sb] = this.bits.read(2);
			}
		}
		if (mode === MP2.MODE.MONO) {
			this.scaleFactorInfo[1][sb] = this.scaleFactorInfo[0][sb];
		}
	}

	// Read scale factors
	for (var sb = 0;  sb < sblimit; sb++) {
		for (var ch = 0;  ch < channels; ch++) {
			if (this.allocation[ch][sb]) {
				var sf = this.scaleFactor[ch][sb];
				switch (this.scaleFactorInfo[ch][sb]) {
					case 0:
						sf[0] = this.bits.read(6);
						sf[1] = this.bits.read(6);
						sf[2] = this.bits.read(6);
						break;
					case 1:
						sf[0] =
						sf[1] = this.bits.read(6);
						sf[2] = this.bits.read(6);
						break;
					case 2:
						sf[0] =
						sf[1] =
						sf[2] = this.bits.read(6);
						break;
					case 3:
						sf[0] = this.bits.read(6);
						sf[1] =
						sf[2] = this.bits.read(6);
						break;
				}
			}
		}
		if (mode === MP2.MODE.MONO) {
			this.scaleFactor[1][sb][0] = this.scaleFactor[0][sb][0];
			this.scaleFactor[1][sb][1] = this.scaleFactor[0][sb][1];
			this.scaleFactor[1][sb][2] = this.scaleFactor[0][sb][2];
		}
	}

	// Coefficient input and reconstruction
	var outPos = 0;
	for (var part = 0; part < 3; part++) {
		for (var granule = 0; granule < 4; granule++) {

			// Read the samples
			for (var sb = 0; sb < bound; sb++) {
				this.readSamples(0, sb, part);
				this.readSamples(1, sb, part);
			}
			for (var sb = bound; sb < sblimit; sb++) {
				this.readSamples(0, sb, part);
				this.sample[1][sb][0] = this.sample[0][sb][0];
				this.sample[1][sb][1] = this.sample[0][sb][1];
				this.sample[1][sb][2] = this.sample[0][sb][2];
			}
			for (var sb = sblimit; sb < 32; sb++) {
				this.sample[0][sb][0] = 0;
				this.sample[0][sb][1] = 0;
				this.sample[0][sb][2] = 0;
				this.sample[1][sb][0] = 0;
				this.sample[1][sb][1] = 0;
				this.sample[1][sb][2] = 0;
			}

			// Synthesis loop
			for (var p = 0; p < 3; p++) {
				// Shifting step
				this.VPos = (this.VPos - 64) & 1023;

				for (var ch = 0;  ch < 2; ch++) {
					MP2.MatrixTransform(this.sample[ch], p, this.V[ch], this.VPos);

					// Build U, windowing, calculate output
					JSMpeg.Fill(this.U, 0);

					var dIndex = 512 - (this.VPos >> 1);
					var vIndex = (this.VPos % 128) >> 1;
					while (vIndex < 1024) {
						for (var i = 0; i < 32; ++i) {
							this.U[i] += this.D[dIndex++] * this.V[ch][vIndex++];
						}

						vIndex += 128-32;
						dIndex += 64-32;
					}

					vIndex = (128-32 + 1024) - vIndex;
					dIndex -= (512 - 32);
					while (vIndex < 1024) {
						for (var i = 0; i < 32; ++i) {
							this.U[i] += this.D[dIndex++] * this.V[ch][vIndex++];
						}

						vIndex += 128-32;
						dIndex += 64-32;
					}

					// Output samples
					var outChannel = ch === 0 ? left : right;
					for (var j = 0; j < 32; j++) {
						outChannel[outPos + j] = this.U[j] / 2147418112;
					}
				} // End of synthesis channel loop
				outPos += 32;
			} // End of synthesis sub-block loop

		} // Decoding of the granule finished
	}

	this.sampleRate = sampleRate;
	return frameSize;
};

MP2.prototype.readAllocation = function(sb, tab3) {
	var tab4 = MP2.QUANT_LUT_STEP_3[tab3][sb];
	var qtab = MP2.QUANT_LUT_STEP4[tab4 & 15][this.bits.read(tab4 >> 4)];
	return qtab ? (MP2.QUANT_TAB[qtab - 1]) : 0;
};

MP2.prototype.readSamples = function(ch, sb, part) {
	var q = this.allocation[ch][sb],
		sf = this.scaleFactor[ch][sb][part],
		sample = this.sample[ch][sb],
		val = 0;

	if (!q) {
		// No bits allocated for this subband
		sample[0] = sample[1] = sample[2] = 0;
		return;
	}

	// Resolve scalefactor
	if (sf === 63) {
		sf = 0;
	}
	else {
		var shift = (sf / 3)|0;
		sf = (MP2.SCALEFACTOR_BASE[sf % 3] + ((1 << shift) >> 1)) >> shift;
	}

	// Decode samples
	var adj = q.levels;
	if (q.group) {
		// Decode grouped samples
		val = this.bits.read(q.bits);
		sample[0] = val % adj;
		val = (val / adj)|0;
		sample[1] = val % adj;
		sample[2] = (val / adj)|0;
	}
	else {
		// Decode direct samples
		sample[0] = this.bits.read(q.bits);
		sample[1] = this.bits.read(q.bits);
		sample[2] = this.bits.read(q.bits);
	}

	// Postmultiply samples
	var scale = (65536 / (adj + 1))|0;
	adj = ((adj + 1) >> 1) - 1;

	val = (adj - sample[0]) * scale;
	sample[0] = (val * (sf >> 12) + ((val * (sf & 4095) + 2048) >> 12)) >> 12;

	val = (adj - sample[1]) * scale;
	sample[1] = (val * (sf >> 12) + ((val * (sf & 4095) + 2048) >> 12)) >> 12;

	val = (adj - sample[2]) * scale;
	sample[2] = (val * (sf >> 12) + ((val * (sf & 4095) + 2048) >> 12)) >> 12;
};

MP2.MatrixTransform = function(s, ss, d, dp) {
	var t01, t02, t03, t04, t05, t06, t07, t08, t09, t10, t11, t12,
		t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24,
		t25, t26, t27, t28, t29, t30, t31, t32, t33;

	t01 = s[ 0][ss] + s[31][ss]; t02 = (s[ 0][ss] - s[31][ss]) * 0.500602998235;
	t03 = s[ 1][ss] + s[30][ss]; t04 = (s[ 1][ss] - s[30][ss]) * 0.505470959898;
	t05 = s[ 2][ss] + s[29][ss]; t06 = (s[ 2][ss] - s[29][ss]) * 0.515447309923;
	t07 = s[ 3][ss] + s[28][ss]; t08 = (s[ 3][ss] - s[28][ss]) * 0.53104259109;
	t09 = s[ 4][ss] + s[27][ss]; t10 = (s[ 4][ss] - s[27][ss]) * 0.553103896034;
	t11 = s[ 5][ss] + s[26][ss]; t12 = (s[ 5][ss] - s[26][ss]) * 0.582934968206;
	t13 = s[ 6][ss] + s[25][ss]; t14 = (s[ 6][ss] - s[25][ss]) * 0.622504123036;
	t15 = s[ 7][ss] + s[24][ss]; t16 = (s[ 7][ss] - s[24][ss]) * 0.674808341455;
	t17 = s[ 8][ss] + s[23][ss]; t18 = (s[ 8][ss] - s[23][ss]) * 0.744536271002;
	t19 = s[ 9][ss] + s[22][ss]; t20 = (s[ 9][ss] - s[22][ss]) * 0.839349645416;
	t21 = s[10][ss] + s[21][ss]; t22 = (s[10][ss] - s[21][ss]) * 0.972568237862;
	t23 = s[11][ss] + s[20][ss]; t24 = (s[11][ss] - s[20][ss]) * 1.16943993343;
	t25 = s[12][ss] + s[19][ss]; t26 = (s[12][ss] - s[19][ss]) * 1.48416461631;
	t27 = s[13][ss] + s[18][ss]; t28 = (s[13][ss] - s[18][ss]) * 2.05778100995;
	t29 = s[14][ss] + s[17][ss]; t30 = (s[14][ss] - s[17][ss]) * 3.40760841847;
	t31 = s[15][ss] + s[16][ss]; t32 = (s[15][ss] - s[16][ss]) * 10.1900081235;

	t33 = t01 + t31; t31 = (t01 - t31) * 0.502419286188;
	t01 = t03 + t29; t29 = (t03 - t29) * 0.52249861494;
	t03 = t05 + t27; t27 = (t05 - t27) * 0.566944034816;
	t05 = t07 + t25; t25 = (t07 - t25) * 0.64682178336;
	t07 = t09 + t23; t23 = (t09 - t23) * 0.788154623451;
	t09 = t11 + t21; t21 = (t11 - t21) * 1.06067768599;
	t11 = t13 + t19; t19 = (t13 - t19) * 1.72244709824;
	t13 = t15 + t17; t17 = (t15 - t17) * 5.10114861869;
	t15 = t33 + t13; t13 = (t33 - t13) * 0.509795579104;
	t33 = t01 + t11; t01 = (t01 - t11) * 0.601344886935;
	t11 = t03 + t09; t09 = (t03 - t09) * 0.899976223136;
	t03 = t05 + t07; t07 = (t05 - t07) * 2.56291544774;
	t05 = t15 + t03; t15 = (t15 - t03) * 0.541196100146;
	t03 = t33 + t11; t11 = (t33 - t11) * 1.30656296488;
	t33 = t05 + t03; t05 = (t05 - t03) * 0.707106781187;
	t03 = t15 + t11; t15 = (t15 - t11) * 0.707106781187;
	t03 += t15;
	t11 = t13 + t07; t13 = (t13 - t07) * 0.541196100146;
	t07 = t01 + t09; t09 = (t01 - t09) * 1.30656296488;
	t01 = t11 + t07; t07 = (t11 - t07) * 0.707106781187;
	t11 = t13 + t09; t13 = (t13 - t09) * 0.707106781187;
	t11 += t13; t01 += t11; 
	t11 += t07; t07 += t13;
	t09 = t31 + t17; t31 = (t31 - t17) * 0.509795579104;
	t17 = t29 + t19; t29 = (t29 - t19) * 0.601344886935;
	t19 = t27 + t21; t21 = (t27 - t21) * 0.899976223136;
	t27 = t25 + t23; t23 = (t25 - t23) * 2.56291544774;
	t25 = t09 + t27; t09 = (t09 - t27) * 0.541196100146;
	t27 = t17 + t19; t19 = (t17 - t19) * 1.30656296488;
	t17 = t25 + t27; t27 = (t25 - t27) * 0.707106781187;
	t25 = t09 + t19; t19 = (t09 - t19) * 0.707106781187;
	t25 += t19;
	t09 = t31 + t23; t31 = (t31 - t23) * 0.541196100146;
	t23 = t29 + t21; t21 = (t29 - t21) * 1.30656296488;
	t29 = t09 + t23; t23 = (t09 - t23) * 0.707106781187;
	t09 = t31 + t21; t31 = (t31 - t21) * 0.707106781187;
	t09 += t31;	t29 += t09;	t09 += t23;	t23 += t31;
	t17 += t29;	t29 += t25;	t25 += t09;	t09 += t27;
	t27 += t23;	t23 += t19; t19 += t31;	
	t21 = t02 + t32; t02 = (t02 - t32) * 0.502419286188;
	t32 = t04 + t30; t04 = (t04 - t30) * 0.52249861494;
	t30 = t06 + t28; t28 = (t06 - t28) * 0.566944034816;
	t06 = t08 + t26; t08 = (t08 - t26) * 0.64682178336;
	t26 = t10 + t24; t10 = (t10 - t24) * 0.788154623451;
	t24 = t12 + t22; t22 = (t12 - t22) * 1.06067768599;
	t12 = t14 + t20; t20 = (t14 - t20) * 1.72244709824;
	t14 = t16 + t18; t16 = (t16 - t18) * 5.10114861869;
	t18 = t21 + t14; t14 = (t21 - t14) * 0.509795579104;
	t21 = t32 + t12; t32 = (t32 - t12) * 0.601344886935;
	t12 = t30 + t24; t24 = (t30 - t24) * 0.899976223136;
	t30 = t06 + t26; t26 = (t06 - t26) * 2.56291544774;
	t06 = t18 + t30; t18 = (t18 - t30) * 0.541196100146;
	t30 = t21 + t12; t12 = (t21 - t12) * 1.30656296488;
	t21 = t06 + t30; t30 = (t06 - t30) * 0.707106781187;
	t06 = t18 + t12; t12 = (t18 - t12) * 0.707106781187;
	t06 += t12;
	t18 = t14 + t26; t26 = (t14 - t26) * 0.541196100146;
	t14 = t32 + t24; t24 = (t32 - t24) * 1.30656296488;
	t32 = t18 + t14; t14 = (t18 - t14) * 0.707106781187;
	t18 = t26 + t24; t24 = (t26 - t24) * 0.707106781187;
	t18 += t24; t32 += t18; 
	t18 += t14; t26 = t14 + t24;
	t14 = t02 + t16; t02 = (t02 - t16) * 0.509795579104;
	t16 = t04 + t20; t04 = (t04 - t20) * 0.601344886935;
	t20 = t28 + t22; t22 = (t28 - t22) * 0.899976223136;
	t28 = t08 + t10; t10 = (t08 - t10) * 2.56291544774;
	t08 = t14 + t28; t14 = (t14 - t28) * 0.541196100146;
	t28 = t16 + t20; t20 = (t16 - t20) * 1.30656296488;
	t16 = t08 + t28; t28 = (t08 - t28) * 0.707106781187;
	t08 = t14 + t20; t20 = (t14 - t20) * 0.707106781187;
	t08 += t20;
	t14 = t02 + t10; t02 = (t02 - t10) * 0.541196100146;
	t10 = t04 + t22; t22 = (t04 - t22) * 1.30656296488;
	t04 = t14 + t10; t10 = (t14 - t10) * 0.707106781187;
	t14 = t02 + t22; t02 = (t02 - t22) * 0.707106781187;
	t14 += t02;	t04 += t14;	t14 += t10;	t10 += t02;
	t16 += t04;	t04 += t08;	t08 += t14;	t14 += t28;
	t28 += t10;	t10 += t20;	t20 += t02;	t21 += t16;
	t16 += t32;	t32 += t04;	t04 += t06;	t06 += t08;
	t08 += t18;	t18 += t14;	t14 += t30;	t30 += t28;
	t28 += t26;	t26 += t10;	t10 += t12;	t12 += t20;
	t20 += t24;	t24 += t02;

	d[dp + 48] = -t33;
	d[dp + 49] = d[dp + 47] = -t21;
	d[dp + 50] = d[dp + 46] = -t17;
	d[dp + 51] = d[dp + 45] = -t16;
	d[dp + 52] = d[dp + 44] = -t01;
	d[dp + 53] = d[dp + 43] = -t32;
	d[dp + 54] = d[dp + 42] = -t29;
	d[dp + 55] = d[dp + 41] = -t04;
	d[dp + 56] = d[dp + 40] = -t03;
	d[dp + 57] = d[dp + 39] = -t06;
	d[dp + 58] = d[dp + 38] = -t25;
	d[dp + 59] = d[dp + 37] = -t08;
	d[dp + 60] = d[dp + 36] = -t11;
	d[dp + 61] = d[dp + 35] = -t18;
	d[dp + 62] = d[dp + 34] = -t09;
	d[dp + 63] = d[dp + 33] = -t14;
	d[dp + 32] = -t05;
	d[dp +  0] = t05; d[dp + 31] = -t30;
	d[dp +  1] = t30; d[dp + 30] = -t27;
	d[dp +  2] = t27; d[dp + 29] = -t28;
	d[dp +  3] = t28; d[dp + 28] = -t07;
	d[dp +  4] = t07; d[dp + 27] = -t26;
	d[dp +  5] = t26; d[dp + 26] = -t23;
	d[dp +  6] = t23; d[dp + 25] = -t10;
	d[dp +  7] = t10; d[dp + 24] = -t15;
	d[dp +  8] = t15; d[dp + 23] = -t12;
	d[dp +  9] = t12; d[dp + 22] = -t19;
	d[dp + 10] = t19; d[dp + 21] = -t20;
	d[dp + 11] = t20; d[dp + 20] = -t13;
	d[dp + 12] = t13; d[dp + 19] = -t24;
	d[dp + 13] = t24; d[dp + 18] = -t31;
	d[dp + 14] = t31; d[dp + 17] = -t02;
	d[dp + 15] = t02; d[dp + 16] =  0.0;
};

MP2.FRAME_SYNC = 0x7ff;

MP2.VERSION = {
	MPEG_2_5: 0x0,
	MPEG_2: 0x2,
	MPEG_1: 0x3
};

MP2.LAYER = {
	III: 0x1,
	II: 0x2,
	I: 0x3
};

MP2.MODE = {
	STEREO: 0x0,
	JOINT_STEREO: 0x1,
	DUAL_CHANNEL: 0x2,
	MONO: 0x3
};

MP2.SAMPLE_RATE = new Uint16Array([
	44100, 48000, 32000, 0, // MPEG-1
	22050, 24000, 16000, 0  // MPEG-2
]);

MP2.BIT_RATE = new Uint16Array([
	32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, // MPEG-1
	 8, 16, 24, 32, 40, 48,  56,  64,  80,  96, 112, 128, 144, 160  // MPEG-2
]);

MP2.SCALEFACTOR_BASE = new Uint32Array([
	0x02000000, 0x01965FEA, 0x01428A30
]);

MP2.SYNTHESIS_WINDOW = new Float32Array([
	     0.0,     -0.5,     -0.5,     -0.5,     -0.5,     -0.5,
	    -0.5,     -1.0,     -1.0,     -1.0,     -1.0,     -1.5,
	    -1.5,     -2.0,     -2.0,     -2.5,     -2.5,     -3.0,
	    -3.5,     -3.5,     -4.0,     -4.5,     -5.0,     -5.5,
	    -6.5,     -7.0,     -8.0,     -8.5,     -9.5,    -10.5,
	   -12.0,    -13.0,    -14.5,    -15.5,    -17.5,    -19.0,
	   -20.5,    -22.5,    -24.5,    -26.5,    -29.0,    -31.5,
	   -34.0,    -36.5,    -39.5,    -42.5,    -45.5,    -48.5,
	   -52.0,    -55.5,    -58.5,    -62.5,    -66.0,    -69.5,
	   -73.5,    -77.0,    -80.5,    -84.5,    -88.0,    -91.5,
	   -95.0,    -98.0,   -101.0,   -104.0,    106.5,    109.0,
	   111.0,    112.5,    113.5,    114.0,    114.0,    113.5,
	   112.0,    110.5,    107.5,    104.0,    100.0,     94.5,
	    88.5,     81.5,     73.0,     63.5,     53.0,     41.5,
	    28.5,     14.5,     -1.0,    -18.0,    -36.0,    -55.5,
	   -76.5,    -98.5,   -122.0,   -147.0,   -173.5,   -200.5,
	  -229.5,   -259.5,   -290.5,   -322.5,   -355.5,   -389.5,
	  -424.0,   -459.5,   -495.5,   -532.0,   -568.5,   -605.0,
	  -641.5,   -678.0,   -714.0,   -749.0,   -783.5,   -817.0,
	  -849.0,   -879.5,   -908.5,   -935.0,   -959.5,   -981.0,
	 -1000.5,  -1016.0,  -1028.5,  -1037.5,  -1042.5,  -1043.5,
	 -1040.0,  -1031.5,   1018.5,   1000.0,    976.0,    946.5,
	   911.0,    869.5,    822.0,    767.5,    707.0,    640.0,
	   565.5,    485.0,    397.0,    302.5,    201.0,     92.5,
	   -22.5,   -144.0,   -272.5,   -407.0,   -547.5,   -694.0,
	  -846.0,  -1003.0,  -1165.0,  -1331.5,  -1502.0,  -1675.5,
	 -1852.5,  -2031.5,  -2212.5,  -2394.0,  -2576.5,  -2758.5,
	 -2939.5,  -3118.5,  -3294.5,  -3467.5,  -3635.5,  -3798.5,
	 -3955.0,  -4104.5,  -4245.5,  -4377.5,  -4499.0,  -4609.5,
	 -4708.0,  -4792.5,  -4863.5,  -4919.0,  -4958.0,  -4979.5,
	 -4983.0,  -4967.5,  -4931.5,  -4875.0,  -4796.0,  -4694.5,
	 -4569.5,  -4420.0,  -4246.0,  -4046.0,  -3820.0,  -3567.0,
	  3287.0,   2979.5,   2644.0,   2280.5,   1888.0,   1467.5,
	  1018.5,    541.0,     35.0,   -499.0,  -1061.0,  -1650.0,
	 -2266.5,  -2909.0,  -3577.0,  -4270.0,  -4987.5,  -5727.5,
	 -6490.0,  -7274.0,  -8077.5,  -8899.5,  -9739.0, -10594.5,
	-11464.5, -12347.0, -13241.0, -14144.5, -15056.0, -15973.5,
	-16895.5, -17820.0, -18744.5, -19668.0, -20588.0, -21503.0,
	-22410.5, -23308.5, -24195.0, -25068.5, -25926.5, -26767.0,
	-27589.0, -28389.0, -29166.5, -29919.0, -30644.5, -31342.0,
	-32009.5, -32645.0, -33247.0, -33814.5, -34346.0, -34839.5,
	-35295.0, -35710.0, -36084.5, -36417.5, -36707.5, -36954.0,
	-37156.5, -37315.0, -37428.0, -37496.0,  37519.0,  37496.0,
	 37428.0,  37315.0,  37156.5,  36954.0,  36707.5,  36417.5,
	 36084.5,  35710.0,  35295.0,  34839.5,  34346.0,  33814.5,
	 33247.0,  32645.0,  32009.5,  31342.0,  30644.5,  29919.0,
	 29166.5,  28389.0,  27589.0,  26767.0,  25926.5,  25068.5,
	 24195.0,  23308.5,  22410.5,  21503.0,  20588.0,  19668.0,
	 18744.5,  17820.0,  16895.5,  15973.5,  15056.0,  14144.5,
	 13241.0,  12347.0,  11464.5,  10594.5,   9739.0,   8899.5,
	  8077.5,   7274.0,   6490.0,   5727.5,   4987.5,   4270.0,
	  3577.0,   2909.0,   2266.5,   1650.0,   1061.0,    499.0,
	   -35.0,   -541.0,  -1018.5,  -1467.5,  -1888.0,  -2280.5,
	 -2644.0,  -2979.5,   3287.0,   3567.0,   3820.0,   4046.0,
	  4246.0,   4420.0,   4569.5,   4694.5,   4796.0,   4875.0,
	  4931.5,   4967.5,   4983.0,   4979.5,   4958.0,   4919.0,
	  4863.5,   4792.5,   4708.0,   4609.5,   4499.0,   4377.5,
	  4245.5,   4104.5,   3955.0,   3798.5,   3635.5,   3467.5,
	  3294.5,   3118.5,   2939.5,   2758.5,   2576.5,   2394.0,
	  2212.5,   2031.5,   1852.5,   1675.5,   1502.0,   1331.5,
	  1165.0,   1003.0,    846.0,    694.0,    547.5,    407.0,
	   272.5,    144.0,     22.5,    -92.5,   -201.0,   -302.5,
	  -397.0,   -485.0,   -565.5,   -640.0,   -707.0,   -767.5,
	  -822.0,   -869.5,   -911.0,   -946.5,   -976.0,  -1000.0,
	  1018.5,   1031.5,   1040.0,   1043.5,   1042.5,   1037.5,
	  1028.5,   1016.0,   1000.5,    981.0,    959.5,    935.0,
	   908.5,    879.5,    849.0,    817.0,    783.5,    749.0,
	   714.0,    678.0,    641.5,    605.0,    568.5,    532.0,
	   495.5,    459.5,    424.0,    389.5,    355.5,    322.5,
	   290.5,    259.5,    229.5,    200.5,    173.5,    147.0,
	   122.0,     98.5,     76.5,     55.5,     36.0,     18.0,
		1.0,    -14.5,    -28.5,    -41.5,    -53.0,    -63.5,
	   -73.0,    -81.5,    -88.5,    -94.5,   -100.0,   -104.0,
	  -107.5,   -110.5,   -112.0,   -113.5,   -114.0,   -114.0,
	  -113.5,   -112.5,   -111.0,   -109.0,    106.5,    104.0,
	   101.0,     98.0,     95.0,     91.5,     88.0,     84.5,
	    80.5,     77.0,     73.5,     69.5,     66.0,     62.5,
	    58.5,     55.5,     52.0,     48.5,     45.5,     42.5,
	    39.5,     36.5,     34.0,     31.5,     29.0,     26.5,
	    24.5,     22.5,     20.5,     19.0,     17.5,     15.5,
	    14.5,     13.0,     12.0,     10.5,      9.5,      8.5,
	     8.0,      7.0,      6.5,      5.5,      5.0,      4.5,
	     4.0,      3.5,      3.5,      3.0,      2.5,      2.5,
	     2.0,      2.0,      1.5,      1.5,      1.0,      1.0,
	     1.0,      1.0,      0.5,      0.5,      0.5,      0.5,
	     0.5,      0.5
]);

// Quantizer lookup, step 1: bitrate classes
MP2.QUANT_LUT_STEP_1 = [
 	// 32, 48, 56, 64, 80, 96,112,128,160,192,224,256,320,384 <- bitrate
	[   0,  0,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2], // mono
	// 16, 24, 28, 32, 40, 48, 56, 64, 80, 96,112,128,160,192 <- bitrate / chan
	[   0,  0,  0,  0,  0,  0,  1,  1,  1,  2,  2,  2,  2,  2] // stereo
];

// Quantizer lookup, step 2: bitrate class, sample rate -> B2 table idx, sblimit
MP2.QUANT_TAB = {
	A: (27 | 64), // Table 3-B.2a: high-rate, sblimit = 27
	B: (30 | 64), // Table 3-B.2b: high-rate, sblimit = 30
	C:   8,       // Table 3-B.2c:  low-rate, sblimit =  8
	D:  12        // Table 3-B.2d:  low-rate, sblimit = 12
};

MP2.QUANT_LUT_STEP_2 = [
	//   44.1 kHz,        48 kHz,          32 kHz
	[MP2.QUANT_TAB.C, MP2.QUANT_TAB.C, MP2.QUANT_TAB.D], // 32 - 48 kbit/sec/ch
	[MP2.QUANT_TAB.A, MP2.QUANT_TAB.A, MP2.QUANT_TAB.A], // 56 - 80 kbit/sec/ch
	[MP2.QUANT_TAB.B, MP2.QUANT_TAB.A, MP2.QUANT_TAB.B]  // 96+	 kbit/sec/ch
];

// Quantizer lookup, step 3: B2 table, subband -> nbal, row index
// (upper 4 bits: nbal, lower 4 bits: row index)
MP2.QUANT_LUT_STEP_3 = [
	// Low-rate table (3-B.2c and 3-B.2d)
	[
		0x44,0x44,
	  	0x34,0x34,0x34,0x34,0x34,0x34,0x34,0x34,0x34,0x34
	],
	// High-rate table (3-B.2a and 3-B.2b)
	[
		0x43,0x43,0x43,
		0x42,0x42,0x42,0x42,0x42,0x42,0x42,0x42,
		0x31,0x31,0x31,0x31,0x31,0x31,0x31,0x31,0x31,0x31,0x31,0x31,
		0x20,0x20,0x20,0x20,0x20,0x20,0x20
	],
	// MPEG-2 LSR table (B.2 in ISO 13818-3)
	[
		0x45,0x45,0x45,0x45,
		0x34,0x34,0x34,0x34,0x34,0x34,0x34,
		0x24,0x24,0x24,0x24,0x24,0x24,0x24,0x24,0x24,0x24,
					   0x24,0x24,0x24,0x24,0x24,0x24,0x24,0x24,0x24	
	]
];

// Quantizer lookup, step 4: table row, allocation[] value -> quant table index
MP2.QUANT_LUT_STEP4 = [
	[0, 1, 2, 17],
	[0, 1, 2, 3, 4, 5, 6, 17],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17],
	[0, 1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
	[0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
];

MP2.QUANT_TAB = [
	{levels:     3, group: 1, bits:  5},  //  1
	{levels:     5, group: 1, bits:  7},  //  2
	{levels:     7, group: 0, bits:  3},  //  3
	{levels:     9, group: 1, bits: 10},  //  4
	{levels:    15, group: 0, bits:  4},  //  5
	{levels:    31, group: 0, bits:  5},  //  6
	{levels:    63, group: 0, bits:  6},  //  7
	{levels:   127, group: 0, bits:  7},  //  8
	{levels:   255, group: 0, bits:  8},  //  9
	{levels:   511, group: 0, bits:  9},  // 10
	{levels:  1023, group: 0, bits: 10},  // 11
	{levels:  2047, group: 0, bits: 11},  // 12
	{levels:  4095, group: 0, bits: 12},  // 13
	{levels:  8191, group: 0, bits: 13},  // 14
	{levels: 16383, group: 0, bits: 14},  // 15
	{levels: 32767, group: 0, bits: 15},  // 16
	{levels: 65535, group: 0, bits: 16}   // 17
];

return MP2;

})();

JSMpeg.Decoder.MP2AudioWASM = (function(){ "use strict";

// Based on kjmp2 by Martin J. Fiedler
// http://keyj.emphy.de/kjmp2/

var MP2WASM = function(options) {
	JSMpeg.Decoder.Base.call(this, options);

	this.onDecodeCallback = options.onAudioDecode;
	this.module = options.wasmModule;

	this.bufferSize = options.audioBufferSize || 128*1024;
	this.bufferMode = options.streaming
		? JSMpeg.BitBuffer.MODE.EVICT
		: JSMpeg.BitBuffer.MODE.EXPAND;

	this.sampleRate = 0;
};

MP2WASM.prototype = Object.create(JSMpeg.Decoder.Base.prototype);
MP2WASM.prototype.constructor = MP2WASM;

MP2WASM.prototype.initializeWasmDecoder = function() {
	if (!this.module.instance) {
		console.warn('JSMpeg: WASM module not compiled yet');
		return;
	}
	this.instance = this.module.instance;
	this.functions = this.module.instance.exports;
	this.decoder = this.functions._mp2_decoder_create(this.bufferSize, this.bufferMode);
};

MP2WASM.prototype.destroy = function() {
	if (!this.decoder) {
		return;
	}
	this.functions._mp2_decoder_destroy(this.decoder);
};

MP2WASM.prototype.bufferGetIndex = function() {
	if (!this.decoder) {
		return;
	}
	return this.functions._mp2_decoder_get_index(this.decoder);
};

MP2WASM.prototype.bufferSetIndex = function(index) {
	if (!this.decoder) {
		return;
	}
	this.functions._mp2_decoder_set_index(this.decoder, index);
};

MP2WASM.prototype.bufferWrite = function(buffers) {
	if (!this.decoder) {
		this.initializeWasmDecoder();
	}

	var totalLength = 0;
	for (var i = 0; i < buffers.length; i++) {
		totalLength += buffers[i].length;
	}

	var ptr = this.functions._mp2_decoder_get_write_ptr(this.decoder, totalLength);
	for (var i = 0; i < buffers.length; i++) {
		this.instance.heapU8.set(buffers[i], ptr);
		ptr += buffers[i].length;
	}
	
	this.functions._mp2_decoder_did_write(this.decoder, totalLength);
	return totalLength;
};

MP2WASM.prototype.decode = function() {
	var startTime = JSMpeg.Now();

	if (!this.decoder) {
		return false;
	}	

	var decodedBytes = this.functions._mp2_decoder_decode(this.decoder);
	if (decodedBytes === 0) {
		return false;
	}

	if (!this.sampleRate) {
		this.sampleRate = this.functions._mp2_decoder_get_sample_rate(this.decoder);
	}

	if (this.destination) {
		// Create a Float32 View into the modules output channel data
		var leftPtr = this.functions._mp2_decoder_get_left_channel_ptr(this.decoder),
			rightPtr = this.functions._mp2_decoder_get_right_channel_ptr(this.decoder);

		var leftOffset = leftPtr / Float32Array.BYTES_PER_ELEMENT,
			rightOffset = rightPtr / Float32Array.BYTES_PER_ELEMENT;

		var left = this.instance.heapF32.subarray(leftOffset, leftOffset + MP2WASM.SAMPLES_PER_FRAME),
			right = this.instance.heapF32.subarray(rightOffset, rightOffset + MP2WASM.SAMPLES_PER_FRAME);

		this.destination.play(this.sampleRate, left, right);
	}

	this.advanceDecodedTime(MP2WASM.SAMPLES_PER_FRAME / this.sampleRate);

	var elapsedTime = JSMpeg.Now() - startTime;
	if (this.onDecodeCallback) {
		this.onDecodeCallback(this, elapsedTime);
	}
	return true;
};


MP2WASM.prototype.getCurrentTime = function() {
	var enqueuedTime = this.destination ? this.destination.enqueuedTime : 0;
	return this.decodedTime - enqueuedTime;
};

MP2WASM.SAMPLES_PER_FRAME = 1152;

return MP2WASM;

})();

JSMpeg.WASMModule = (function(){ "use strict";

var WASM = function() {
	this.stackSize = 5 * 1024 * 1024; // emscripten default
	this.pageSize = 64 * 1024; // wasm page size
	this.onInitCallback = null;
	this.ready = false;
};

WASM.prototype.write = function(buffer) {
	this.loadFromBuffer(buffer, this.onInitCallback);
};

WASM.prototype.loadFromFile = function(url, callback) {
	this.onInitCallback = callback;
	var ajax = new JSMpeg.Source.Ajax(url, {});
	ajax.connect(this);
	ajax.start();
};

WASM.prototype.loadFromBuffer = function(buffer, callback) {
	this.moduleInfo = this.readDylinkSection(buffer);
	if (!this.moduleInfo) {
		this.callback && this.callback(null);
		return;
	}

	this.memory = new WebAssembly.Memory({initial: 256});
	var importObject = {
		env: {
			memory: this.memory,
			memoryBase: 0,
			__memory_base: 0,
			table: new WebAssembly.Table({initial: this.moduleInfo.tableSize, element: 'anyfunc'}),
			tableBase: 0,
			__table_base: 0,
			abort: this.c_abort.bind(this),
			___assert_fail: this.c_assertFail.bind(this),
			_sbrk: this.c_sbrk.bind(this)
		}
	};
	console.log(this.moduleInfo);
	

	this.brk = this.align(this.moduleInfo.memorySize + this.stackSize);
	// console.log(buffer);
	// console.log(importObject);
	WebAssembly.instantiate(buffer, importObject).then(function(results){
		// console.log('results');
		// console.log(results);
		this.instance = results.instance;
		if (this.instance.exports.__post_instantiate) {
			this.instance.exports.__post_instantiate();
		}
		this.createHeapViews();
		this.ready = true;
		callback && callback(this);
	}.bind(this))
};

WASM.prototype.createHeapViews = function() {
	this.instance.heapU8 = new Uint8Array(this.memory.buffer);
	this.instance.heapU32 = new Uint32Array(this.memory.buffer);
	this.instance.heapF32 = new Float32Array(this.memory.buffer);
};

WASM.prototype.align = function(addr) {
	var a = Math.pow(2, this.moduleInfo.memoryAlignment);
	return Math.ceil(addr / a) * a;
};

WASM.prototype.c_sbrk = function(size) {
	var previousBrk = this.brk;
	this.brk += size;

	if (this.brk > this.memory.buffer.byteLength) {
		var bytesNeeded = this.brk - this.memory.buffer.byteLength;
		var pagesNeeded = Math.ceil(bytesNeeded / this.pageSize);
		this.memory.grow(pagesNeeded);
		this.createHeapViews();
	}
	return previousBrk;
};

WASM.prototype.c_abort = function(size) {
	console.warn('JSMPeg: WASM abort', arguments);
};

WASM.prototype.c_assertFail = function(size) {
	console.warn('JSMPeg: WASM ___assert_fail', arguments);
};


WASM.prototype.readDylinkSection = function(buffer) {
	// Read the WASM header and dylink section of the .wasm binary data
	// to get the needed table size and static data size.

	// https://github.com/WebAssembly/tool-conventions/blob/master/DynamicLinking.md
	// https://github.com/kripken/emscripten/blob/20602efb955a7c6c20865a495932427e205651d2/src/support.js

	var bytes = new Uint8Array(buffer);
	var next = 0;

	var readVarUint = function () {
		var ret = 0;
		var mul = 1;
		while (1) {
			var byte = bytes[next++];
			ret += ((byte & 0x7f) * mul);
			mul *= 0x80;
			if (!(byte & 0x80)) {
				return ret
			}
		}
	}

	var matchNextBytes = function(expected) {
		for (var i = 0; i < expected.length; i++) {
			var b = typeof(expected[i]) === 'string' 
				? expected[i].charCodeAt(0)
				: expected[i];
			if (bytes[next++] !== b) {
				return false;
			}
		}
		return true;
	};

	

	// Make sure we have a wasm header
	if (!matchNextBytes([0, 'a', 's', 'm'])) {
		console.warn('JSMpeg: WASM header not found');
		return null;
	}

	// Make sure we have a dylink section
	var next = 9;
	var sectionSize = readVarUint();
	if (!matchNextBytes([6, 'd', 'y', 'l', 'i', 'n', 'k'])) {
		console.warn('JSMpeg: No dylink section found in WASM');
		return null;
	}

	return {
		memorySize: readVarUint(),
		memoryAlignment: readVarUint(),
		tableSize: readVarUint(),
		tableAlignment: readVarUint()
	};
};

WASM.IsSupported = function() {
	return (!!WebAssembly);
};

WASM.GetModule = function() {
	WASM.CACHED_MODULE = WASM.CACHED_MODULE || new WASM();
	return WASM.CACHED_MODULE;
};

return WASM;

})();

JSMpeg.WASM_BINARY_INLINED='AGFzbQEAAAAADwZkeWxpbmvwz8ACBAAAAAE0CWAEf39/fwBgAX8Bf2ACf38Bf2ABfwBgAn9/AGABfwF9YAZ/f39/f38AYAN/f38Bf2AAAAJGBANlbnYOX19fYXNzZXJ0X2ZhaWwAAANlbnYFX3NicmsAAQNlbnYNX19tZW1vcnlfYmFzZQN/AANlbnYGbWVtb3J5AgCAAgNAPwIDAgEEBAMBBQEBAQEBAQEDBAMGAwQAAwAAAAIDAgEEBAEBAQEBAAACAwQCBAECAQIEAQEBAQMEAwMCBwcHCAYLAn8BQQALfwFBAAsHggYfEl9fcG9zdF9pbnN0YW50aWF0ZQBABV9mcmVlADsHX21hbGxvYwA0B19tZW1jcHkAPQhfbWVtbW92ZQA+B19tZW1zZXQAPxNfbXAyX2RlY29kZXJfY3JlYXRlAB0TX21wMl9kZWNvZGVyX2RlY29kZQAmFF9tcDJfZGVjb2Rlcl9kZXN0cm95AB4WX21wMl9kZWNvZGVyX2RpZF93cml0ZQAiFl9tcDJfZGVjb2Rlcl9nZXRfaW5kZXgAICFfbXAyX2RlY29kZXJfZ2V0X2xlZnRfY2hhbm5lbF9wdHIAJCJfbXAyX2RlY29kZXJfZ2V0X3JpZ2h0X2NoYW5uZWxfcHRyACUcX21wMl9kZWNvZGVyX2dldF9zYW1wbGVfcmF0ZQAjGl9tcDJfZGVjb2Rlcl9nZXRfd3JpdGVfcHRyAB8WX21wMl9kZWNvZGVyX3NldF9pbmRleAAhFV9tcGVnMV9kZWNvZGVyX2NyZWF0ZQACFV9tcGVnMV9kZWNvZGVyX2RlY29kZQARFl9tcGVnMV9kZWNvZGVyX2Rlc3Ryb3kAAxhfbXBlZzFfZGVjb2Rlcl9kaWRfd3JpdGUABxlfbXBlZzFfZGVjb2Rlcl9nZXRfY2JfcHRyABAdX21wZWcxX2RlY29kZXJfZ2V0X2NvZGVkX3NpemUACxlfbXBlZzFfZGVjb2Rlcl9nZXRfY3JfcHRyAA8dX21wZWcxX2RlY29kZXJfZ2V0X2ZyYW1lX3JhdGUAChlfbXBlZzFfZGVjb2Rlcl9nZXRfaGVpZ2h0AA0YX21wZWcxX2RlY29kZXJfZ2V0X2luZGV4AAUYX21wZWcxX2RlY29kZXJfZ2V0X3dpZHRoAAwcX21wZWcxX2RlY29kZXJfZ2V0X3dyaXRlX3B0cgAEGF9tcGVnMV9kZWNvZGVyX2dldF95X3B0cgAOIl9tcGVnMV9kZWNvZGVyX2hhc19zZXF1ZW5jZV9oZWFkZXIACRhfbXBlZzFfZGVjb2Rlcl9zZXRfaW5kZXgABgqY4QE/JAEBf0GcBBA0IgJBAEGcBBA/GiACQYABaiAAIAEQKjYCACACC2QAIABBgAFqKAIAECsgAEFAaygCAEUEQCAAEDsPCyAAQYQBaigCABA7IABBiAFqKAIAEDsgAEGMAWooAgAQOyAAQZABaigCABA7IABBlAFqKAIAEDsgAEGYAWooAgAQOyAAEDsLDwAgAEGAAWooAgAgARAtCw0AIABBgAFqKAIAEAwLDwAgAEGAAWooAgAgARAsCzQBAX8gAEGAAWoiAigCACABEC4gAEFAaygCAARADwsgAigCAEGzARAwQX9GBEAPCyAAEAgLtAYBC38gAEEEaiICKAIAIQUgAEEIaiIEKAIAIQYgAiAAQYABaiIDKAIAQQwQMjYCACAEIAMoAgBBDBAyNgIAIAMoAgBBBBAzIAMoAgBBBBAyIQEgACMAIAFBAnRqKAIANgIAIAMoAgBBHhAzIAMoAgBBARAyBEBBACEBA0AgAygCAEEIEDJB/wFxIQcgASMAQUBrai0AACAAQZwDamogBzoAACABQQFqIgFBwABHDQALBSAAQZwDaiIBIwApAoABNwIAIAEjACkCiAE3AgggASMAKQKQATcCECABIwApApgBNwIYIAEjACkCoAE3AiAgASMAKQKoATcCKCABIwApArABNwIwIAEjACkCuAE3AjgLIAMoAgBBARAyBEBBACEBA0AgASMAQUBrai0AACAAQdwDamogAygCAEEIEDI6AAAgAUEBaiIBQcAARw0ACwUgAEHcA2oiAUKQoMCAgYKEiBA3AgAgAUKQoMCAgYKEiBA3AgggAUKQoMCAgYKEiBA3AhAgAUKQoMCAgYKEiBA3AhggAUKQoMCAgYKEiBA3AiAgAUKQoMCAgYKEiBA3AiggAUKQoMCAgYKEiBA3AjAgAUKQoMCAgYKEiBA3AjgLIABBQGsiCygCAARAIAUgAigCAEYEQCAGIAQoAgBGBEAPCwsgAEGEAWoiBygCABA7IABBiAFqIgUoAgAQOyAAQYwBaiIDKAIAEDsgAEGQAWoiCSgCABA7IABBlAFqIgYoAgAQOyAAQZgBaiIBKAIAEDsFIABBmAFqIQEgAEGMAWohAyAAQYgBaiEFIABBlAFqIQYgAEGEAWohByAAQZABaiEJCyAAQQxqIAIoAgBBD2oiAkEEdSIKNgIAIABBEGogBCgCAEEPaiIIQQR1IgQ2AgAgAEEUaiAEIApsNgIAIABBGGogAkFwcSICNgIAIABBHGogCEFwcSIINgIAIABBIGogAiAIbCICNgIAIABBJGogCkEDdDYCACAAQShqIARBA3Q2AgAgByACEDQ2AgAgBSACQQJ1IgAQNDYCACADIAAQNDYCACAJIAIQNDYCACAGIAAQNDYCACABIAAQNDYCACALQQE2AgALCgAgAEFAaygCAAsHACAAKgIACwoAIABBIGooAgALCgAgAEEEaigCAAsKACAAQQhqKAIACwsAIABBkAFqKAIACwsAIABBlAFqKAIACwsAIABBmAFqKAIACy0AIABBQGsoAgBFBEBBAA8LIABBgAFqKAIAQQAQMEF/RgRAQQAPCyAAEBJBAQvXAgEEfyMBIQIjAUEQaiQBIABBgAFqIgMoAgBBChAzIABBLGoiBCADKAIAQQMQMjYCACADKAIAQRAQMyAEKAIAIgFBf2pBAUsEQCACJAEPCyABQQJGBEAgACADKAIAQQEQMjYCMCAAIAMoAgBBAxAyIgE2AjQgAQRAIAAgAUF/aiIBNgI4IABBASABdDYCPAUgAiQBDwsLA0ACQCADKAIAEC8iAUGyAWsOBAEAAAEACwsgAUF/akGvAUkEQANAIAAgAUH/AXEQEyADKAIAEC8iAUF/akGvAUkNAAsLIAFBf0cEQCADKAIAQQRqIgEgASgCAEEgazYCAAsgBCgCAEF/akECTwRAIAIkAQ8LIAIgAEGQAWoiASkCADcCACACIAEoAgg2AgggASAAQYQBaiIAKQIANwIAIAEgACgCCDYCCCAAIAIpAgA3AgAgACACKAIINgIIIAIkAQurAQAgAEHIAGpBATYCACAAQcwAaiAAQQxqKAIAIAFBf2psQX9qNgIAIABB5ABqIgFCADcCACABQgA3AgggAEH0AGpBgAE2AgAgAEH4AGpBgAE2AgAgAEH8AGpBgAE2AgAgAEHEAGogAEGAAWoiASgCAEEFEDI2AgAgASgCAEEBEDIEQANAIAEoAgBBCBAzIAEoAgBBARAyDQALCwNAIAAQFCABKAIAEDFFDQALC8QKAQ5/IABBgAFqIgQoAgAhAgJAAkADQAJAIAJBARAyIAFqIQEjAEHAAWogAUECdGooAgAiAUF/TA0AIwBBwAFqIAFBAnRqKAIADQEMAgsLIAFBAmohAkEAIQEMAQsgAUECaiIBQbwBRgRAAkADQAJAIAQoAgAhAkEAIQEDQCACQQEQMiABaiEBIwBBwAFqIAFBAnRqKAIAIgFBf0wNASMAQcABaiABQQJ0aigCAA0ACyABQQJqIgFBvAFGDQEMAgsLIAFBAmohAkEAIQEMAgsLIAFBuQFGBEBBACEBA0ACQCABQSFqIQEgBCgCACEDQQAhAgNAIANBARAyIAJqIQIjAEHAAWogAkECdGooAgAiAkF/TA0BIwBBwAFqIAJBAnRqKAIADQALIAJBAmoiAkG5AUYNAQwDCwsgAkECaiECBSABIQJBACEBCwsgASMAQcABaiACQQJ0aigCAGohAiAAQcgAaiIBKAIABEAgAUEANgIAIABBzABqIgMoAgAgAmohASADIAE2AgAFAkAgAEHMAGoiBSgCACIDIAJqIABBFGooAgBOBEAPCyACQQFMBEAgBSADQQFqIgE2AgAMAQsgAEH0AGpBgAE2AgAgAEH4AGpBgAE2AgAgAEH8AGpBgAE2AgAgAEEsaigCAEECRgRAIABB5ABqIgFCADcCACABQgA3AggLIAUgA0EBaiIBNgIAIABBDGohByAAQdAAaiEIIABB1ABqIQkgAEHkAGohCiAAQegAaiELIABBkAFqIQwgAEGUAWohDSAAQZgBaiEOA0AgCCABIAcoAgAiBm0iAzYCACAJIAEgAyAGbGs2AgAgACAKKAIAIAsoAgAgDCgCACANKAIAIA4oAgAQFSACQX9qIQMgBSAFKAIAQQFqIgE2AgAgAkECSgRAIAMhAgwBCwsLCyAAQdAAaiABIABBDGooAgAiA20iAjYCACAAQdQAaiABIAIgA2xrNgIAAkACQAJAAkAgAEEsaigCAEEBaw4CAAECCyAEKAIAIQJBACEBA0ACQCACQQEQMiABaiEDIwBB0AhqIANBAnRqKAIAIQEgA0EDRg0AQeQNIAF2QQFxRQ0BCwsgAEHYAGoiAyMAIAFBAnRqQdgIaigCACICNgIAIAMhAQwCCyAEKAIAIQJBACEBA0ACQCACQQEQMiABaiEDIwBBgAlqIANBAnRqKAIAIQEgA0EbRg0AIwBBgAlqIAFBAnRqKAIADQELCyAAQdgAaiIDIwAgAUECdGpBiAlqKAIAIgI2AgAgAyEBDAELIABB2ABqIgEoAgAhAgsgAEHcAGoiBiACQQFxIgM2AgAgAEHgAGogAkEIcTYCACACQRBxBEAgAEHEAGogBCgCAEEFEDI2AgAgBigCACEDCyADBEAgAEHkAGoiAkIANwIAIAJCADcCCAUgAEH0AGpBgAE2AgAgAEH4AGpBgAE2AgAgAEH8AGpBgAE2AgAgABAWIAAgAEHkAGooAgAgAEHoAGooAgAgAEGQAWooAgAgAEGUAWooAgAgAEGYAWooAgAQFQsgASgCAEECcQR/IAQoAgAhAkEAIQEDQAJAIAJBARAyIAFqIQMjAEGwCmogA0ECdGooAgAhASADQcMBRg0AIwBBsApqIAFBAnRqKAIADQELCyMAIAFBAnRqQbgKaigCAAVBP0EAIAYoAgAbCyIBQSBxBEAgAEEAEBcLIAFBEHEEQCAAQQEQFwsgAUEIcQRAIABBAhAXCyABQQRxBEAgAEEDEBcLIAFBAnEEQCAAQQQQFwsgAUEBcUUEQA8LIABBBRAXC58nAQ9/IABBhAFqKAIAIQogAEGMAWooAgAhEiAAQYgBaigCACETIABBGGooAgAiCEFwaiELIAJBAXFBAEchDCAAQdQAaiIRKAIAIglBBHQgAUEBdWogCCAAQdAAaiIPKAIAIg1BBHQgAkEBdWpsaiEHIAkgCCANbGpBAnQiCSAIQQJ0IgZqIQ0gBkEASiEGAkAgAUEBcQRAIAwEQCAGRQ0CIAtBAnUhCwNAIAlBAnQgCmogAyAHQQNqIgZqLQAAIAMgBiAIamotAABqIgYgAyAHQQRqIgxqLQAAIAMgCCAMamotAABqIgxqQRZ0QYCAgARqQYCAgHhxIAMgB0ECaiIOai0AACADIAggDmpqLQAAaiIOIAZqQQ50QYCAAmpBgID8B3EgAyAHQQFqIgZqLQAAIAMgBiAIamotAABqIgYgAyAHai0AACADIAcgCGpqLQAAakECampBAnZB/wFxIAYgDmpBBnRBgAFqQYD+A3FycnI2AgAgCUEBakECdCAKaiADIAdBB2oiBmotAAAgAyAGIAhqai0AAGoiBiADIAdBCGoiDmotAAAgAyAIIA5qai0AAGoiDmpBFnRBgICABGpBgICAeHEgAyAHQQZqIhBqLQAAIAMgCCAQamotAABqIhAgBmpBDnRBgIACakGAgPwHcSADIAdBBWoiBmotAAAgAyAGIAhqai0AAGoiBiAMQQJqakECdkH/AXEgBiAQakEGdEGAAWpBgP4DcXJycjYCACAJQQJqQQJ0IApqIAMgB0ELaiIGai0AACADIAYgCGpqLQAAaiIGIAMgB0EMaiIMai0AACADIAggDGpqLQAAaiIMakEWdEGAgIAEakGAgIB4cSADIAdBCmoiEGotAAAgAyAIIBBqai0AAGoiECAGakEOdEGAgAJqQYCA/AdxIAMgB0EJaiIGai0AACADIAYgCGpqLQAAaiIGIA5BAmpqQQJ2Qf8BcSAGIBBqQQZ0QYABakGA/gNxcnJyNgIAIAlBA2pBAnQgCmogAyAHQQ9qIgZqLQAAIAMgBiAIamotAABqIgYgAyAHQRBqIg5qLQAAIAMgCCAOamotAABqakEWdEGAgIAEakGAgIB4cSADIAdBDmoiDmotAAAgAyAIIA5qai0AAGoiDiAGakEOdEGAgAJqQYCA/AdxIAMgB0ENaiIGai0AACADIAYgCGpqLQAAaiIGIAxBAmpqQQJ2Qf8BcSAGIA5qQQZ0QYABakGA/gNxcnJyNgIAIAcgCGohByAJQQRqIAtqIgkgDUgNAAsFIAZFDQIgC0ECdSELA0AgCUECdCAKaiADIAdBA2pqLQAAIgYgAyAHQQRqai0AACIMakEXdEGAgIAEakGAgIB4cSADIAdBAmpqLQAAIg4gBmpBD3RBgIACakGAgPwHcSAOIAMgB0EBamotAAAiBmpBB3RBgAFqQYD+A3EgAyAHai0AAEEBaiAGakEBdkH/AXFycnI2AgAgCUEBakECdCAKaiADIAdBB2pqLQAAIgYgAyAHQQhqai0AACIOakEXdEGAgIAEakGAgIB4cSADIAdBBmpqLQAAIhAgBmpBD3RBgIACakGAgPwHcSAQIAMgB0EFamotAAAiBmpBB3RBgAFqQYD+A3EgDEEBaiAGakEBdkH/AXFycnI2AgAgCUECakECdCAKaiADIAdBC2pqLQAAIgYgAyAHQQxqai0AACIMakEXdEGAgIAEakGAgIB4cSADIAdBCmpqLQAAIhAgBmpBD3RBgIACakGAgPwHcSAQIAMgB0EJamotAAAiBmpBB3RBgAFqQYD+A3EgDkEBaiAGakEBdkH/AXFycnI2AgAgCUEDakECdCAKaiADIAdBD2pqLQAAIgYgAyAHQRBqai0AAGpBF3RBgICABGpBgICAeHEgAyAHQQ5qai0AACIOIAZqQQ90QYCAAmpBgID8B3EgDiADIAdBDWpqLQAAIgZqQQd0QYABakGA/gNxIAxBAWogBmpBAXZB/wFxcnJyNgIAIAcgCGohByAJQQRqIAtqIgkgDUgNAAsLBSAMBEAgBkUNAiALQQJ1IQsDQCAJQQJ0IApqIAMgB0EDaiIGai0AACADIAYgCGpqLQAAakEXdEGAgIAEakGAgIB4cSADIAdBAmoiBmotAAAgAyAGIAhqai0AAGpBD3RBgIACakGAgPwHcSADIAcgCGpqLQAAIAMgB2otAABBAWpqQQF2Qf8BcSADIAdBAWoiBmotAAAgAyAGIAhqai0AAGpBB3RBgAFqQYD+A3FycnI2AgAgCUEBakECdCAKaiADIAdBB2oiBmotAAAgAyAGIAhqai0AAGpBF3RBgICABGpBgICAeHEgAyAHQQZqIgZqLQAAIAMgBiAIamotAABqQQ90QYCAAmpBgID8B3EgAyAHQQRqIgZqLQAAQQFqIAMgBiAIamotAABqQQF2Qf8BcSADIAdBBWoiBmotAAAgAyAGIAhqai0AAGpBB3RBgAFqQYD+A3FycnI2AgAgCUECakECdCAKaiADIAdBC2oiBmotAAAgAyAGIAhqai0AAGpBF3RBgICABGpBgICAeHEgAyAHQQpqIgZqLQAAIAMgBiAIamotAABqQQ90QYCAAmpBgID8B3EgAyAHQQhqIgZqLQAAQQFqIAMgBiAIamotAABqQQF2Qf8BcSADIAdBCWoiBmotAAAgAyAGIAhqai0AAGpBB3RBgAFqQYD+A3FycnI2AgAgCUEDakECdCAKaiADIAdBD2oiBmotAAAgAyAGIAhqai0AAGpBF3RBgICABGpBgICAeHEgAyAHQQ5qIgZqLQAAIAMgBiAIamotAABqQQ90QYCAAmpBgID8B3EgAyAHQQxqIgZqLQAAQQFqIAMgBiAIamotAABqQQF2Qf8BcSADIAdBDWoiBmotAAAgAyAGIAhqai0AAGpBB3RBgAFqQYD+A3FycnI2AgAgByAIaiEHIAlBBGogC2oiCSANSA0ACwUgBkUNAiALQQJ1IQsDQCAJQQJ0IApqIAMgB2otAAAgAyAHQQFqai0AAEEIdHIgAyAHQQJqai0AAEEQdHIgAyAHQQNqai0AAEEYdHI2AgAgCUEBakECdCAKaiADIAdBBGpqLQAAIAMgB0EFamotAABBCHRyIAMgB0EGamotAABBEHRyIAMgB0EHamotAABBGHRyNgIAIAlBAmpBAnQgCmogAyAHQQhqai0AACADIAdBCWpqLQAAQQh0ciADIAdBCmpqLQAAQRB0ciADIAdBC2pqLQAAQRh0cjYCACAJQQNqQQJ0IApqIAMgB0EMamotAAAgAyAHQQ1qai0AAEEIdHIgAyAHQQ5qai0AAEEQdHIgAyAHQQ9qai0AAEEYdHI2AgAgByAIaiEHIAlBBGogC2oiCSANSA0ACwsLCyAAQSRqKAIAIgNBeGohByACQQJtIgBBAXFBAEchCCARKAIAIgJBA3QgAUECbSIKQQF1aiADIA8oAgAiAUEDdCAAQQF1amxqIQAgAiABIANsakEBdCIBIANBAXQiCWohAiAJQQBKIQkgCkEBcQRAIAgEQCAJRQRADwsgB0ECdSERA0AgAyAAQQFqIgdqIQkgAyAAQQJqIghqIQogAyAAQQNqIgtqIQ0gAyAAQQRqIgZqIQwgBSALai0AACAFIA1qLQAAaiIPIAUgBmotAAAgBSAMai0AAGoiDmpBFnRBgICABGpBgICAeHEgBSAIai0AACAFIApqLQAAaiIQIA9qQQ50QYCAAmpBgID8B3EgBSAHai0AACAFIAlqLQAAaiIPIAAgBWotAAAgBSAAIANqIhRqLQAAakECampBAnZB/wFxIA8gEGpBBnRBgAFqQYD+A3FycnIhDyABQQJ0IBNqIAQgC2otAAAgBCANai0AAGoiCyAEIAZqLQAAIAQgDGotAABqIhBqQRZ0QYCAgARqQYCAgHhxIAQgCGotAAAgBCAKai0AAGoiCCALakEOdEGAgAJqQYCA/AdxIAQgB2otAAAgBCAJai0AAGoiByAAIARqLQAAIAQgFGotAABqQQJqakECdkH/AXEgByAIakEGdEGAAWpBgP4DcXJycjYCACABQQJ0IBJqIA82AgAgAyAAQQVqIgdqIQkgAyAAQQZqIghqIQogAyAAQQdqIgtqIQ0gAyAAQQhqIgZqIQwgBSALai0AACAFIA1qLQAAaiIPIAUgBmotAAAgBSAMai0AAGpqQRZ0QYCAgARqQYCAgHhxIAUgCGotAAAgBSAKai0AAGoiFCAPakEOdEGAgAJqQYCA/AdxIAUgB2otAAAgBSAJai0AAGoiDyAOQQJqakECdkH/AXEgDyAUakEGdEGAAWpBgP4DcXJyciEPIAFBAWoiDkECdCATaiAEIAtqLQAAIAQgDWotAABqIgsgBCAGai0AACAEIAxqLQAAampBFnRBgICABGpBgICAeHEgBCAIai0AACAEIApqLQAAaiIIIAtqQQ50QYCAAmpBgID8B3EgBCAHai0AACAEIAlqLQAAaiIHIBBBAmpqQQJ2Qf8BcSAHIAhqQQZ0QYABakGA/gNxcnJyNgIAIA5BAnQgEmogDzYCACAAIANqIQAgAUECaiARaiIBIAJIDQALBSAJRQRADwsgB0ECdSELA0AgBCAAQQFqIg1qLQAAIQcgBCAAQQJqIgZqLQAAIQkgBCAAQQNqIgxqLQAAIQggBCAAQQRqIhFqLQAAIQogBSAMai0AACIMIAUgEWotAAAiEWpBF3RBgICABGpBgICAeHEgBSAGai0AACIGIAxqQQ90QYCAAmpBgID8B3EgBSANai0AACINIAAgBWotAABBAWpqQQF2Qf8BcSAGIA1qQQd0QYABakGA/gNxcnJyIQ0gAUECdCATaiAIIApqQRd0QYCAgARqQYCAgHhxIAggCWpBD3RBgIACakGAgPwHcSAAIARqLQAAQQFqIAdqQQF2Qf8BcSAHIAlqQQd0QYABakGA/gNxcnJyNgIAIAFBAnQgEmogDTYCACAEIABBBWoiDWotAAAhByAEIABBBmoiBmotAAAhCSAEIABBB2oiDGotAAAhCCAFIAxqLQAAIgwgBSAAQQhqIg9qLQAAakEXdEGAgIAEakGAgIB4cSAFIAZqLQAAIgYgDGpBD3RBgIACakGAgPwHcSAFIA1qLQAAIg0gEUEBampBAXZB/wFxIAYgDWpBB3RBgAFqQYD+A3FycnIhDSABQQFqIgZBAnQgE2ogCCAEIA9qLQAAakEXdEGAgIAEakGAgIB4cSAIIAlqQQ90QYCAAmpBgID8B3EgCkEBaiAHakEBdkH/AXEgByAJakEHdEGAAWpBgP4DcXJycjYCACAGQQJ0IBJqIA02AgAgACADaiEAIAFBAmogC2oiASACSA0ACwsFIAgEQCAJRQRADwsgB0ECdSERA0AgAyAAQQFqIgdqIQkgAyAAQQJqIghqIQogAyAAQQNqIgtqIQ0gBSALai0AACAFIA1qLQAAakEXdEGAgIAEakGAgIB4cSAFIAhqLQAAIAUgCmotAABqQQ90QYCAAmpBgID8B3EgBSAAIANqIgZqLQAAIAAgBWotAABBAWpqQQF2Qf8BcSAFIAdqLQAAIAUgCWotAABqQQd0QYABakGA/gNxcnJyIQwgAUECdCATaiAEIAtqLQAAIAQgDWotAABqQRd0QYCAgARqQYCAgHhxIAQgCGotAAAgBCAKai0AAGpBD3RBgIACakGAgPwHcSAEIAZqLQAAIAAgBGotAABBAWpqQQF2Qf8BcSAEIAdqLQAAIAQgCWotAABqQQd0QYABakGA/gNxcnJyNgIAIAFBAnQgEmogDDYCACADIABBBGoiB2ohCSADIABBBWoiCGohCiADIABBBmoiC2ohDSADIABBB2oiBmohDCAFIAZqLQAAIAUgDGotAABqQRd0QYCAgARqQYCAgHhxIAUgC2otAAAgBSANai0AAGpBD3RBgIACakGAgPwHcSAFIAlqLQAAIAUgB2otAABBAWpqQQF2Qf8BcSAFIAhqLQAAIAUgCmotAABqQQd0QYABakGA/gNxcnJyIQ8gAUEBaiIOQQJ0IBNqIAQgBmotAAAgBCAMai0AAGpBF3RBgICABGpBgICAeHEgBCALai0AACAEIA1qLQAAakEPdEGAgAJqQYCA/AdxIAQgCWotAAAgBCAHai0AAEEBampBAXZB/wFxIAQgCGotAAAgBCAKai0AAGpBB3RBgAFqQYD+A3FycnI2AgAgDkECdCASaiAPNgIAIAAgA2ohACABQQJqIBFqIgEgAkgNAAsFIAlFBEAPCyAHQQJ1IQcDQCAAIAVqLQAAIAUgAEEBaiIJai0AAEEIdHIgBSAAQQJqIghqLQAAQRB0ciAFIABBA2oiCmotAABBGHRyIQsgAUECdCATaiAAIARqLQAAIAQgCWotAABBCHRyIAQgCGotAABBEHRyIAQgCmotAABBGHRyNgIAIAFBAnQgEmogCzYCACAFIABBBGoiCWotAAAgBSAAQQVqIghqLQAAQQh0ciAFIABBBmoiCmotAABBEHRyIAUgAEEHaiILai0AAEEYdHIhDSABQQFqIgZBAnQgE2ogBCAJai0AACAEIAhqLQAAQQh0ciAEIApqLQAAQRB0ciAEIAtqLQAAQRh0cjYCACAGQQJ0IBJqIA02AgAgACADaiEAIAFBAmogB2oiASACSA0ACwsLC/0EAQZ/IABB4ABqKAIARQRAIABBLGooAgBBAkcEQA8LIABB5ABqIgBCADcCACAAQgA3AggPCyAAQYABaiIDKAIAIQQDQAJAIARBARAyIAFqIQEjAEGgFmogAUECdGooAgAiAUF/TA0AIwBBoBZqIAFBAnRqKAIADQELCyAAQTxqIQQjACABQQJ0akGoFmooAgAiAQRAIAQoAgBBAUcEQCADKAIAIABBOGoiAigCABAyIAFBACABayABQX9KG0F/aiACKAIAdGoiAkF/cyACQQFqIAFBAEgbIQELBUEAIQELIABB7ABqIgIoAgAgAWohASACIAE2AgACQAJAIAEgBCgCACIFQQR0IgZIBEAgAUEAIAZrSARAIAEgBUEFdGohAQwCCwUgASAFQQV0ayEBDAELDAELIAIgATYCAAsgAEHkAGoiAiABNgIAIABBMGoiBSgCAARAIAIgAUEBdDYCAAsgAygCACECQQAhAQNAAkAgAkEBEDIgAWohASMAQaAWaiABQQJ0aigCACIBQX9MDQAjAEGgFmogAUECdGooAgANAQsLIwAgAUECdGpBqBZqKAIAIgEEQCAEKAIAQQFHBEAgAygCACAAQThqIgMoAgAQMiABQQAgAWsgAUF/ShtBf2ogAygCAHRqIgNBf3MgA0EBaiABQQBIGyEBCwVBACEBCyAAQfAAaiIDKAIAIAFqIQEgAyABNgIAAkACQCABIAQoAgAiBEEEdCICSARAIAFBACACa0gEQCABIARBBXRqIQEMAgsFIAEgBEEFdGshAQwBCwwBCyADIAE2AgALIABB6ABqIgAgATYCACAFKAIARQRADwsgACABQQF0NgIAC9kIAQh/IABB3ABqIggoAgAEfwJ/IAFBBEgiBQR/IABB9ABqKAIAIQIgAEGAAWooAgAhBwN/IAdBARAyIANqIQQjAEHQHGogBEECdGooAgAhAyMAQdAcaiAEQS5GDQIaIwBB0BxqIANBAnRqKAIADQAjAEHQHGoLBSAAQfgAaiAAQfwAaiABQQRGGygCACECIABBgAFqKAIAIQcDfyAHQQEQMiADaiEEIwBBsB5qIARBAnRqKAIAIQMjAEGwHmogBEEuRg0CGiMAQbAeaiADQQJ0aigCAA0AIwBBsB5qCwsLIQQgAEGcAWogA0ECakECdCAEaigCACIDQQBKBH8gAEGAAWooAgAgAxAyIgRBASADQX9qdHEEfyACIARqBSAEQQFqQX8gA3RyIAJqCwUgAgsiAzYCACAFBH8gAEGcAWohAiAAQfQAagUgAEGcAWohAiAAQfgAaiAAQfwAaiABQQRGGwsgAzYCACACIANBCHQ2AgAgAEGcA2ohB0EBBSAAQdwDaiEHQQALIQMgAEGAAWohBCAAQcQAaiEJA0ACQCAEKAIAIQZBACECA0ACQCAGQQEQMiACaiEFIwBBkCBqIAVBAnRqKAIAIQIgBUH8AUYNACMAQZAgaiACQQJ0aigCAA0BCwsjAEGQIGogAkECaiICQQJ0aigCACEGAkACQCACQQhGIANBAEpxBH8gBCgCAEEBEDJFDQMMAQUCfyACQc0ARw0CIAQoAgBBBhAyIQICQAJAIAQoAgBBCBAyIgUiBgRAIAZBgAFGBEAMAgUMAwsACyAEKAIAQQgQMgwCCyAEKAIAQQgQMkGAfmoMAQsgBUGAfmogBSAFQYABShsLCyEFDAELIAZB/wFxIgJBACACayAEKAIAQQEQMkUbIQUgBkEIdSECCyACIANqIgYjAEFAa2otAAAiAiAHai0AACAJKAIAQQAgBUEBdCIDQR91QQFyIAgoAgAbIANqbGwiA0EEdUEAQQFBfyADQQ9KGyADQRBxG2siA0GAcCADQYBwShshAyAAQZwBaiACQQJ0aiACIwBBkDVqai0AACADQf8PIANB/w9IG2w2AgAgBkEBaiEDDAELCyABQQRIBEAgAEGEAWohBCABQQN0QQhxIABB1ABqKAIAIABBGGooAgAiAiAAQdAAaigCAGxqQQR0ciACQQN0QQAgAUECcRtqIQEFIABBjAFqIABBiAFqIAFBBEYbIQQgAEHQAGooAgAgAEEYaigCACICQQJ0bCAAQdQAaigCAEEDdGohASACQQF1IQILIAJBeGohAiAEKAIAIQQgA0EBRiEDIABBnAFqIQAgCCgCAARAIAMEQCAAKAIAQYABakEIdSAEIAEgAhAYIABBADYCAAUgABAZIAAgBCABIAIQGiAAQQBBgAIQPxoLBSADBEAgACgCAEGAAWpBCHUgBCABIAIQGyAAQQA2AgAFIAAQGSAAIAQgASACEBwgAEEAQYACED8aCwsL7AYAIAEgAmogAEEAIABBAEobIgBB/wEgAEH/AUgbQf8BcSIAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA0EIaiIDaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA2oiAmogADoAACABIAJBAWpqIAA6AAAgASACQQJqaiAAOgAAIAEgAkEDamogADoAACABIAJBBGpqIAA6AAAgASACQQVqaiAAOgAAIAEgAkEGamogADoAACABIAJBB2pqIAA6AAAgASACIANqIgJqIAA6AAAgASACQQFqaiAAOgAAIAEgAkECamogADoAACABIAJBA2pqIAA6AAAgASACQQRqaiAAOgAAIAEgAkEFamogADoAACABIAJBBmpqIAA6AAAgASACQQdqaiAAOgAAIAEgAiADaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAgASACQQZqaiAAOgAAIAEgAkEHamogADoAACABIAIgA2oiAmogADoAACABIAJBAWpqIAA6AAAgASACQQJqaiAAOgAAIAEgAkEDamogADoAACABIAJBBGpqIAA6AAAgASACQQVqaiAAOgAAIAEgAkEGamogADoAACABIAJBB2pqIAA6AAAgASACIANqIgJqIAA6AAAgASACQQFqaiAAOgAAIAEgAkECamogADoAACABIAJBA2pqIAA6AAAgASACQQRqaiAAOgAAIAEgAkEFamogADoAACABIAJBBmpqIAA6AAAgASACQQdqaiAAOgAAIAEgAiADaiICaiAAOgAAIAEgAkEBamogADoAACABIAJBAmpqIAA6AAAgASACQQNqaiAAOgAAIAEgAkEEamogADoAACABIAJBBWpqIAA6AAAg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SCBOkiAxkowiJDgCACADQThqQQJ0IAJqICQ4AgAgA0EnakECdCACaiAjIDwgK5IiI5KMIiQ4AgAgA0E5akECdCACaiAkOAIAIANBJmpBAnQgAmogPSAnkowiJDgCACADQTpqQQJ0IAJqICQ4AgAgA0ElakECdCACaiApIC0gMJO7RLhLf2aeoOY/orYiKZIiLSAjkowiIzgCACADQTtqQQJ0IAJqICM4AgAgA0EkakECdCACaiAoIEeSjCIjOAIAIANBPGpBAnQgAmogIzgCACADQSNqQQJ0IAJqIC0gKyAykiIjkowiKDgCACADQT1qQQJ0IAJqICg4AgAgA0EiakECdCACaiAnIFOSjCInOAIAIANBPmpBAnQgAmogJzgCACADQSFqQQJ0IAJqICMgQpKMIiM4AgAgA0E/akECdCACaiAjOAIAIANBIGpBAnQgAmogNIw4AgAgA0ECdCACaiA0OAIAIANBH2pBAnQgAmogLIw4AgAgA0EBakECdCACaiAsOAIAIANBHmpBAnQgAmogOYw4AgAgA0ECakECdCACaiA5OAIAIANBHWpBAnQgAmogKSAmkiI0IEGSIiOMOAIAIANBA2pBAnQgAmogIzgCACADQRxqQQJ0IAJqIC+MOAIAIANBBGpBAnQgAmogLzgCACADQRtqQQJ0IAJqIDQgNyAzkiI0kiIvjDgCACADQQVqQQJ0IAJqIC84AgAgA0EaakECdCACaiBEIDuSIi+MOAIAIANBBmpBAnQgAmogLzgCACADQRlqQQJ0IAJqIDQgOpIiNIw4AgAgA0EHakECdCACaiA0OAIAIANBGGpBAnQgAmogMYw4AgAgA0EIakECdCACaiAxOAIAIANBF2pBAnQgAmogKow4AgAgA0EJakECdCACaiAqOAIAIANBFmpBAnQgAmogOyAukiIxjDgCACADQQpqQQJ0IAJqIDE4AgAgA0EVakECdCACaiBDICaSIjGMOAIAIANBC2pBAnQgAmogMTgCACADQRRqQQJ0IAJqIDWMOAIAIANBDGpBAnQgAmogNTgCACADQRNqQQJ0IAJqICYgJZIiJow4AgAgA0ENakECdCACaiAmOAIAIANBEmpBAnQgAmogLow4AgAgA0EOakECdCACaiAuOAIAIANBEWpBAnQgAmogJYw4AgAgA0EPakECdCACaiAlOAIAIANB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zsACaigCACECIAMEQCACIAIoAgBBfnE2AgBBAA8LDAELIAEQNyECCyACRQRAQQAPCwsgAigCAEEBcUUEQCMAQabKAGojAEHuyABqQc4BIwBBuMoAahAACyAEKAIAIgNBAXFFBEAjAEGmygBqIwBB7sgAakHOASMAQbjKAGoQAAsgAkEIaiIFIAAgASADQQF2QXhqIgAgACABSxsQPRogBBA6IAIoAgBBAXEEQCAFDwUjAEGmygBqIwBB7sgAakHOASMAQbjKAGoQAAtBAAukDQEIfyACQQBHIAFBA3FBAEdxBH8gACEDA38gA0EBaiEEIAMgASwAADoAACABQQFqIgFBA3FBAEcgAkF/aiICQQBHcQR/IAQhAwwBBSAECwsFIAALIgMiBEEDcUUEQCACQQ9LBH8gAkFwaiIFQXBxIgdBEGoiCCADaiEGIAIhBCABIQIDQCADIAIoAgA2AgAgA0EEaiACQQRqKAIANgIAIANBCGogAkEIaigCADYCACADQQxqIAJBDGooAgA2AgAgAkEQaiECIANBEGohAyAEQXBqIgRBD0sNAAsgBiEDIAEgCGohASAFIAdrBSACCyIEQQhxBH8gAyABKAIANgIAIANBBGogAUEEaigCADYCACADQQhqIQMgAUEIagUgAQshAiAEQQRxBH8gAyACKAIANgIAIAJBBGohAiADQQRqBSADCyEBIARBAnEEQCABIAIsAAA6AAAgAUEBaiACQQFqLAAAOgAAIAFBAmohASACQQJqIQILIARBAXFFBEAgAA8LIAEgAiwAADoAACAADwsgAkEfSwRAAkACQAJAAkAgBEEDcUEBaw4DAAECAwsgAyABKAIAIgU6AAAgA0EBaiABQQFqLAAAOgAAIANBAmogAUECaiwAADoAACACQWxqQXBxIghBE2oiCSABaiEHIAJBbWohCiADQQNqIQQgAkF9aiEGIAFBA2ohAiAFIQEDQCAEIAJBAWooAgAiBUEIdCABQRh2cjYCACAEQQRqIAJBBWooAgAiAUEIdCAFQRh2cjYCACAEQQhqIAJBCWooAgAiBUEIdCABQRh2cjYCACAEQQxqIAJBDWooAgAiAUEIdCAFQRh2cjYCACACQRBqIQIgBEEQaiEEIAZBcGoiBkEQSw0ACyADIAlqIQMgCiAIayECIAchAQwCCyADIAEoAgAiBToAACAD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';
export default JSMpeg;