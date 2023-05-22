/* eslint-disable */
 
/*!
 * @pixi-spine/base - v3.0.1
 * Compiled Fri, 19 May 2023 01:56:04 UTC
 *
 * @pixi-spine/base is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */
import { SCALE_MODES, MIPMAP_MODES, ALPHA_MODES, DRAW_MODES } from '@pixi/constants';
import { Texture } from '@pixi/core';
import { Rectangle, Transform, Polygon } from '@pixi/math';
import { Container } from '@pixi/display';
import { Sprite } from '@pixi/sprite';
import { SimpleMesh } from '@pixi/mesh-extras';
import { Graphics } from '@pixi/graphics';
import { rgb2hex, hex2rgb } from '@pixi/utils';

/**
 * @public
 */
var AttachmentType; (function (AttachmentType) {
    const Region = 0; AttachmentType[AttachmentType["Region"] = Region] = "Region"; const BoundingBox = Region + 1; AttachmentType[AttachmentType["BoundingBox"] = BoundingBox] = "BoundingBox"; const Mesh = BoundingBox + 1; AttachmentType[AttachmentType["Mesh"] = Mesh] = "Mesh"; const LinkedMesh = Mesh + 1; AttachmentType[AttachmentType["LinkedMesh"] = LinkedMesh] = "LinkedMesh"; const Path = LinkedMesh + 1; AttachmentType[AttachmentType["Path"] = Path] = "Path"; const Point = Path + 1; AttachmentType[AttachmentType["Point"] = Point] = "Point"; const Clipping = Point + 1; AttachmentType[AttachmentType["Clipping"] = Clipping] = "Clipping";
})(AttachmentType || (AttachmentType = {}));

/**
 * @public
 */
class BinaryInput {
    constructor(data,  strings = new Array(),  index = 0,  buffer = new DataView(data.buffer)) {this.strings = strings;this.index = index;this.buffer = buffer;

    }

    readByte() {
        return this.buffer.getInt8(this.index++);
    }

    readUnsignedByte() {
        return this.buffer.getUint8(this.index++);
    }

    readShort() {
        let value = this.buffer.getInt16(this.index);
        this.index += 2;
        return value;
    }

    readInt32() {
        let value = this.buffer.getInt32(this.index);
        this.index += 4;
        return value;
    }

    readInt(optimizePositive) {
        let b = this.readByte();
        let result = b & 0x7F;
        if ((b & 0x80) != 0) {
            b = this.readByte();
            result |= (b & 0x7F) << 7;
            if ((b & 0x80) != 0) {
                b = this.readByte();
                result |= (b & 0x7F) << 14;
                if ((b & 0x80) != 0) {
                    b = this.readByte();
                    result |= (b & 0x7F) << 21;
                    if ((b & 0x80) != 0) {
                        b = this.readByte();
                        result |= (b & 0x7F) << 28;
                    }
                }
            }
        }
        return optimizePositive ? result : ((result >>> 1) ^ -(result & 1));
    }

    readStringRef () {
        let index = this.readInt(true);
        return index == 0 ? null : this.strings[index - 1];
    }

    readString () {
        let byteCount = this.readInt(true);
        switch (byteCount) {
            case 0:
                return null;
            case 1:
                return "";
        }
        byteCount--;
        let chars = "";
        for (let i = 0; i < byteCount;) {
            let b = this.readByte();
            switch (b >> 4) {
                case 12:
                case 13:
                    chars += String.fromCharCode(((b & 0x1F) << 6 | this.readByte() & 0x3F));
                    i += 2;
                    break;
                case 14:
                    chars += String.fromCharCode(((b & 0x0F) << 12 | (this.readByte() & 0x3F) << 6 | this.readByte() & 0x3F));
                    i += 3;
                    break;
                default:
                    chars += String.fromCharCode(b);
                    i++;
            }
        }
        return chars;
    }

    readFloat () {
        let value = this.buffer.getFloat32(this.index);
        this.index += 4;
        return value;
    }

    readBoolean () {
        return this.readByte() != 0;
    }
}

/**
 * @public
 */
function filterFromString (text) {
    switch (text.toLowerCase()) {
        case "nearest": return TextureFilter.Nearest;
        case "linear": return TextureFilter.Linear;
        case "mipmap": return TextureFilter.MipMap;
        case "mipmapnearestnearest": return TextureFilter.MipMapNearestNearest;
        case "mipmaplinearnearest": return TextureFilter.MipMapLinearNearest;
        case "mipmapnearestlinear": return TextureFilter.MipMapNearestLinear;
        case "mipmaplinearlinear": return TextureFilter.MipMapLinearLinear;
        default: throw new Error(`Unknown texture filter ${text}`);
    }
}

/**
 * @public
 */
function wrapFromString (text) {
    switch (text.toLowerCase()) {
        case "mirroredtepeat": return TextureWrap.MirroredRepeat;
        case "clamptoedge": return TextureWrap.ClampToEdge;
        case "repeat": return TextureWrap.Repeat;
        default: throw new Error(`Unknown texture wrap ${text}`);
    }
}

/**
 * @public
 */
var TextureFilter; (function (TextureFilter) {
    const Nearest = 9728; TextureFilter[TextureFilter["Nearest"] = Nearest] = "Nearest"; // WebGLRenderingContext.NEAREST
    const Linear = 9729; TextureFilter[TextureFilter["Linear"] = Linear] = "Linear"; // WebGLRenderingContext.LINEAR
    const MipMap = 9987; TextureFilter[TextureFilter["MipMap"] = MipMap] = "MipMap"; // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
    const MipMapNearestNearest = 9984; TextureFilter[TextureFilter["MipMapNearestNearest"] = MipMapNearestNearest] = "MipMapNearestNearest"; // WebGLRenderingContext.NEAREST_MIPMAP_NEAREST
    const MipMapLinearNearest = 9985; TextureFilter[TextureFilter["MipMapLinearNearest"] = MipMapLinearNearest] = "MipMapLinearNearest"; // WebGLRenderingContext.LINEAR_MIPMAP_NEAREST
    const MipMapNearestLinear = 9986; TextureFilter[TextureFilter["MipMapNearestLinear"] = MipMapNearestLinear] = "MipMapNearestLinear"; // WebGLRenderingContext.NEAREST_MIPMAP_LINEAR
    const MipMapLinearLinear = 9987; TextureFilter[TextureFilter["MipMapLinearLinear"] = MipMapLinearLinear] = "MipMapLinearLinear"; // WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
})(TextureFilter || (TextureFilter = {}));

/**
 * @public
 */
var TextureWrap; (function (TextureWrap) {
    const MirroredRepeat = 33648; TextureWrap[TextureWrap["MirroredRepeat"] = MirroredRepeat] = "MirroredRepeat"; // WebGLRenderingContext.MIRRORED_REPEAT
    const ClampToEdge = 33071; TextureWrap[TextureWrap["ClampToEdge"] = ClampToEdge] = "ClampToEdge"; // WebGLRenderingContext.CLAMP_TO_EDGE
    const Repeat = 10497; TextureWrap[TextureWrap["Repeat"] = Repeat] = "Repeat"; // WebGLRenderingContext.REPEAT
})(TextureWrap || (TextureWrap = {}));

/**
 * @public
 */
class TextureRegion {constructor() { TextureRegion.prototype.__init.call(this);TextureRegion.prototype.__init2.call(this);TextureRegion.prototype.__init3.call(this); }
    

    //thats for overrides
    __init() {this.size = null;}

    __init2() {this.names = null;}
    __init3() {this.values = null;}

    get width() {
        const tex = this.texture;
        if (tex.trim) {
            return tex.trim.width;
        }
        return tex.orig.width;
    }

    get height() {
        const tex = this.texture;
        if (tex.trim) {
            return tex.trim.height;
        }
        return tex.orig.height;
    }

    get u() {
        return (this.texture )._uvs.x0;
    }

    get v() {
        return (this.texture )._uvs.y0;
    }

    get u2() {
        return (this.texture )._uvs.x2;
    }

    get v2() {
        return (this.texture )._uvs.y2;
    }

    get offsetX() {
        const tex = this.texture;
        return tex.trim ? tex.trim.x : 0;
    }

    get offsetY() {
        console.warn("Deprecation Warning: @Hackerham: I guess, if you are using PIXI-SPINE ATLAS region.offsetY, you want a texture, right? Use region.texture from now on.");
        return this.spineOffsetY;
    }

    get pixiOffsetY() {
        const tex = this.texture;
        return tex.trim ? tex.trim.y : 0;
    }

    get spineOffsetY() {
        let tex = this.texture;
        return this.originalHeight - this.height - (tex.trim ? tex.trim.y : 0);
    }

    get originalWidth() {
        return this.texture.orig.width;
    }

    get originalHeight() {
        return this.texture.orig.height;
    }

    get x() {
        return this.texture.frame.x;
    }

    get y() {
        return this.texture.frame.y;
    }

    get rotate() {
        return this.texture.rotate !== 0;
    }

    get degrees() {
        return (360 - this.texture.rotate * 45) % 360;
    }
}

class RegionFields {constructor() { RegionFields.prototype.__init.call(this);RegionFields.prototype.__init2.call(this);RegionFields.prototype.__init3.call(this);RegionFields.prototype.__init4.call(this);RegionFields.prototype.__init5.call(this);RegionFields.prototype.__init6.call(this);RegionFields.prototype.__init7.call(this);RegionFields.prototype.__init8.call(this);RegionFields.prototype.__init9.call(this);RegionFields.prototype.__init10.call(this); }
    __init() {this.x = 0;}
    __init2() {this.y = 0;}
    __init3() {this.width = 0;}
    __init4() {this.height = 0;}
    __init5() {this.offsetX = 0;}
    __init6() {this.offsetY = 0;}
    __init7() {this.originalWidth = 0;}
    __init8() {this.originalHeight = 0;}
    __init9() {this.rotate = 0;}
    __init10() {this.index = 0;}
}
/**
 * @public
 */
class TextureAtlas  {
    __init11() {this.pages = new Array();}
    __init12() {this.regions = new Array();}

    constructor(atlasText, textureLoader, callback) {TextureAtlas.prototype.__init11.call(this);TextureAtlas.prototype.__init12.call(this);
        if (atlasText) {
            this.addSpineAtlas(atlasText, textureLoader, callback);
        }
    }

    addTexture(name, texture) {
        let pages = this.pages;
        let page = null;
        for (let i = 0; i < pages.length; i++) {
            if (pages[i].baseTexture === texture.baseTexture) {
                page = pages[i];
                break;
            }
        }
        if (page === null) {
            page = new TextureAtlasPage();
            page.name = 'texturePage';
            let baseTexture = texture.baseTexture;
            page.width = baseTexture.realWidth;
            page.height = baseTexture.realHeight;
            page.baseTexture = baseTexture;
            //those fields are not relevant in Pixi
            page.minFilter = page.magFilter = TextureFilter.Nearest;
            page.uWrap = TextureWrap.ClampToEdge;
            page.vWrap = TextureWrap.ClampToEdge;
            pages.push(page);
        }
        let region = new TextureAtlasRegion();
        region.name = name;
        region.page = page;
        region.texture = texture;
        region.index = -1;
        this.regions.push(region);
        return region;
    }

    addTextureHash(textures, stripExtension) {
        for (let key in textures) {
            if (textures.hasOwnProperty(key)) {
                this.addTexture(stripExtension && key.indexOf('.') !== -1 ? key.substr(0, key.lastIndexOf('.')) : key, textures[key]);
            }
        }
    }

     addSpineAtlas(atlasText, textureLoader, callback) {
        return this.load(atlasText, textureLoader, callback);
    }

     load(atlasText, textureLoader, callback) {
        if (textureLoader == null)
            throw new Error("textureLoader cannot be null.");

        let reader = new TextureAtlasReader(atlasText);
        let entry = new Array(4);
        let page = null;
        let pageFields = {};
        let region = null;
        pageFields["size"] = () => {
            page.width = parseInt(entry[1]);
            page.height = parseInt(entry[2]);
        };
        pageFields["format"] = () => {
            // page.format = Format[tuple[0]]; we don't need format in WebGL
        };
        pageFields["filter"] = () => {
            page.minFilter = filterFromString(entry[1]);
            page.magFilter = filterFromString(entry[2]);
        };
        pageFields["repeat"] = () => {
            if (entry[1].indexOf('x') != -1) page.uWrap = TextureWrap.Repeat;
            if (entry[1].indexOf('y') != -1) page.vWrap = TextureWrap.Repeat;
        };
        pageFields["pma"] = () => {
            page.pma = entry[1] == "true";
        };

        let regionFields = {};
        regionFields["xy"] = () => { // Deprecated, use bounds.
            region.x = parseInt(entry[1]);
            region.y = parseInt(entry[2]);
        };
        regionFields["size"] = () => { // Deprecated, use bounds.
            region.width = parseInt(entry[1]);
            region.height = parseInt(entry[2]);
        };
        regionFields["bounds"] = () => {
            region.x = parseInt(entry[1]);
            region.y = parseInt(entry[2]);
            region.width = parseInt(entry[3]);
            region.height = parseInt(entry[4]);
        };
        regionFields["offset"] = () => { // Deprecated, use offsets.
            region.offsetX = parseInt(entry[1]);
            region.offsetY = parseInt(entry[2]);
        };
        regionFields["orig"] = () => { // Deprecated, use offsets.
            region.originalWidth = parseInt(entry[1]);
            region.originalHeight = parseInt(entry[2]);
        };
        regionFields["offsets"] = () => {
            region.offsetX = parseInt(entry[1]);
            region.offsetY = parseInt(entry[2]);
            region.originalWidth = parseInt(entry[3]);
            region.originalHeight = parseInt(entry[4]);
        };
        regionFields["rotate"] = () => {
            let rotateValue = entry[1];
            let rotate = 0;
            if (rotateValue.toLocaleLowerCase() == "true") {
                rotate = 6;
            } else if (rotateValue.toLocaleLowerCase() == "false") {
                rotate = 0;
            } else {
                rotate = ((720 - parseFloat(rotateValue)) % 360) / 45;
            }
            region.rotate = rotate;
        };
        regionFields["index"] = () => {
            region.index = parseInt(entry[1]);
        };

        let line = reader.readLine();
        // Ignore empty lines before first entry.
        while (line != null && line.trim().length == 0)
            line = reader.readLine();
        // Header entries.
        while (true) {
            if (line == null || line.trim().length == 0) break;
            if (reader.readEntry(entry, line) == 0) break; // Silently ignore all header fields.
            line = reader.readLine();
        }

        let iterateParser = () => {
            while (true) {
                if (line == null) {
                    return callback && callback(this);
                }
                if (line.trim().length == 0) {
                    page = null;
                    line = reader.readLine();
                } else if (page === null) {
                    page = new TextureAtlasPage();
                    page.name = line.trim();

                    while (true) {
                        if (reader.readEntry(entry, line = reader.readLine()) == 0) break;
                        let field = pageFields[entry[0]];
                        if (field) field();
                    }
                    this.pages.push(page);

                    textureLoader(page.name, (texture) => {
                        if (texture === null) {
                            this.pages.splice(this.pages.indexOf(page), 1);
                            return callback && callback(null);
                        }
                        page.baseTexture = texture;
                        //TODO: set scaleMode and mipmapMode from spine
                        if (page.pma) {
                            texture.alphaMode = ALPHA_MODES.PMA;
                        }
                        if (!texture.valid) {
                            texture.setSize(page.width, page.height);
                        }
                        this.pages.push(page);
                        page.setFilters();

                        if (!page.width || !page.height) {
                            page.width = texture.realWidth;
                            page.height = texture.realHeight;
                            if (!page.width || !page.height) {
                                console.log("ERROR spine atlas page " + page.name + ": meshes wont work if you dont specify size in atlas (http://www.html5gamedevs.com/topic/18888-pixi-spines-and-meshes/?p=107121)");
                            }
                        }
                        iterateParser();
                    });
                    this.pages.push(page);
                    break;
                } else {
                    region = new RegionFields();
                    let atlasRegion = new TextureAtlasRegion();
                    atlasRegion.name = line;
                    atlasRegion.page = page;
                    let names = null;
                    let values = null;
                    while (true) {
                        let count = reader.readEntry(entry, line = reader.readLine());
                        if (count == 0) break;
                        let field = regionFields[entry[0]];
                        if (field)
                            field();
                        else {
                            if (names == null) {
                                names = [];
                                values = [];
                            }
                            names.push(entry[0]);
                            let entryValues = [];
                            for (let i = 0; i < count; i++)
                                entryValues.push(parseInt(entry[i + 1]));
                            values.push(entryValues);
                        }
                    }
                    if (region.originalWidth == 0 && region.originalHeight == 0) {
                        region.originalWidth = region.width;
                        region.originalHeight = region.height;
                    }

                    let resolution = page.baseTexture.resolution;
                    region.x /= resolution;
                    region.y /= resolution;
                    region.width /= resolution;
                    region.height /= resolution;
                    region.originalWidth /= resolution;
                    region.originalHeight /= resolution;
                    region.offsetX /= resolution;
                    region.offsetY /= resolution;

                    const swapWH = region.rotate % 4 !== 0;
                    let frame = new Rectangle(region.x, region.y, swapWH ? region.height : region.width, swapWH ? region.width : region.height);

                    let orig = new Rectangle(0, 0, region.originalWidth, region.originalHeight);
                    let trim = new Rectangle(region.offsetX, region.originalHeight - region.height - region.offsetY, region.width, region.height);

                    atlasRegion.texture = new Texture(atlasRegion.page.baseTexture, frame, orig, trim, region.rotate);
                    atlasRegion.index = region.index;
                    atlasRegion.texture.updateUvs();

                    this.regions.push(atlasRegion);
                }
            }
        };

        iterateParser();
    }

    findRegion(name) {
        for (let i = 0; i < this.regions.length; i++) {
            if (this.regions[i].name == name) {
                return this.regions[i];
            }
        }
        return null;
    }

    dispose() {
        for (let i = 0; i < this.pages.length; i++) {
            this.pages[i].baseTexture.dispose();
        }
    }
}

/**
 * @public
 */
class TextureAtlasReader {
    
    __init13() {this.index = 0;}

    constructor(text) {TextureAtlasReader.prototype.__init13.call(this);
        this.lines = text.split(/\r\n|\r|\n/);
    }

    readLine() {
        if (this.index >= this.lines.length)
            return null;
        return this.lines[this.index++];
    }

    readEntry (entry, line) {
        if (line == null) return 0;
        line = line.trim();
        if (line.length == 0) return 0;

        let colon = line.indexOf(':');
        if (colon == -1) return 0;
        entry[0] = line.substr(0, colon).trim();
        for (let i = 1, lastMatch = colon + 1;; i++) {
            let comma = line.indexOf(',', lastMatch);
            if (comma == -1) {
                entry[i] = line.substr(lastMatch).trim();
                return i;
            }
            entry[i] = line.substr(lastMatch, comma - lastMatch).trim();
            lastMatch = comma + 1;
            if (i == 4) return 4;
        }
    }
}

/**
 * @public
 */
class TextureAtlasPage {constructor() { TextureAtlasPage.prototype.__init14.call(this);TextureAtlasPage.prototype.__init15.call(this);TextureAtlasPage.prototype.__init16.call(this);TextureAtlasPage.prototype.__init17.call(this); }
    
    __init14() {this.minFilter = TextureFilter.Nearest;}
    __init15() {this.magFilter = TextureFilter.Nearest;}
    __init16() {this.uWrap = TextureWrap.ClampToEdge;}
    __init17() {this.vWrap = TextureWrap.ClampToEdge;}
    
    
    
    

     setFilters() {
        let tex = this.baseTexture;
        let filter = this.minFilter;
        if (filter == TextureFilter.Linear) {
            tex.scaleMode = SCALE_MODES.LINEAR;
        } else if (this.minFilter == TextureFilter.Nearest) {
            tex.scaleMode = SCALE_MODES.NEAREST;
        } else {
            tex.mipmap = MIPMAP_MODES.POW2;
            if (filter == TextureFilter.MipMapNearestNearest) {
                tex.scaleMode = SCALE_MODES.NEAREST;
            } else {
                tex.scaleMode = SCALE_MODES.LINEAR;
            }
        }
    }
}

/**
 * @public
 */
class TextureAtlasRegion extends TextureRegion {
    
    
    
}

let fround_polyfill = (function(array) {
    return function(x) {
        return array[0] = x, array[0];
    };
})(new Float32Array(1));

let fround =
    (Math ).fround || fround_polyfill;
/**
 * @public
 */




/**
 * @public
 */
class IntSet {constructor() { IntSet.prototype.__init.call(this); }
    __init() {this.array = new Array();}

    add (value) {
        let contains = this.contains(value);
        this.array[value | 0] = value | 0;
        return !contains;
    }

    contains (value) {
        return this.array[value | 0] != undefined;
    }

    remove (value) {
        this.array[value | 0] = undefined;
    }

    clear () {
        this.array.length = 0;
    }
}

/**
 * @public
 */
class StringSet {constructor() { StringSet.prototype.__init2.call(this);StringSet.prototype.__init3.call(this); }
    __init2() {this.entries = {};}
    __init3() {this.size = 0;}

    add (value) {
        let contains = this.entries[value];
        this.entries[value] = true;
        if (!contains) this.size++;
        return contains != true;
    }

    addAll (values) {
        let oldSize = this.size;
        for (var i = 0, n = values.length; i < n; i++) {
            this.add(values[i]);
        }
        return oldSize != this.size;
    }

    contains (value) {
        let contains = this.entries[value];
        return contains == true;
    }

    clear () {
        this.entries = {};
        this.size = 0;
    }
}

/**
 * @public
 */











/**
 * @public
 */
class Color {
     static __initStatic() {this.WHITE = new Color(1, 1, 1, 1);}
     static __initStatic2() {this.RED = new Color(1, 0, 0, 1);}
     static __initStatic3() {this.GREEN = new Color(0, 1, 0, 1);}
     static __initStatic4() {this.BLUE = new Color(0, 0, 1, 1);}
     static __initStatic5() {this.MAGENTA = new Color(1, 0, 1, 1);}

    constructor ( r = 0,  g = 0,  b = 0,  a = 0) {this.r = r;this.g = g;this.b = b;this.a = a;
    }

    set (r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.clamp();
        return this;
    }

    setFromColor (c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
        return this;
    }

    setFromString (hex) {
        hex = hex.charAt(0) == '#' ? hex.substr(1) : hex;
        this.r = parseInt(hex.substr(0, 2), 16) / 255.0;
        this.g = parseInt(hex.substr(2, 2), 16) / 255.0;
        this.b = parseInt(hex.substr(4, 2), 16) / 255.0;
        this.a = (hex.length != 8 ? 255 : parseInt(hex.substr(6, 2), 16)) / 255.0;
        return this;
    }

    add (r, g, b, a) {
        this.r += r;
        this.g += g;
        this.b += b;
        this.a += a;
        this.clamp();
        return this;
    }

    clamp () {
        if (this.r < 0) this.r = 0;
        else if (this.r > 1) this.r = 1;

        if (this.g < 0) this.g = 0;
        else if (this.g > 1) this.g = 1;

        if (this.b < 0) this.b = 0;
        else if (this.b > 1) this.b = 1;

        if (this.a < 0) this.a = 0;
        else if (this.a > 1) this.a = 1;
        return this;
    }

    static rgba8888ToColor(color, value) {
        color.r = ((value & 0xff000000) >>> 24) / 255;
        color.g = ((value & 0x00ff0000) >>> 16) / 255;
        color.b = ((value & 0x0000ff00) >>> 8) / 255;
        color.a = ((value & 0x000000ff)) / 255;
    }

    static rgb888ToColor (color, value) {
        color.r = ((value & 0x00ff0000) >>> 16) / 255;
        color.g = ((value & 0x0000ff00) >>> 8) / 255;
        color.b = ((value & 0x000000ff)) / 255;
    }
} Color.__initStatic(); Color.__initStatic2(); Color.__initStatic3(); Color.__initStatic4(); Color.__initStatic5();

/**
 * @public
 */
class MathUtils {
    static __initStatic6() {this.PI = 3.1415927;}
    static __initStatic7() {this.PI2 = MathUtils.PI * 2;}
    static __initStatic8() {this.radiansToDegrees = 180 / MathUtils.PI;}
    static __initStatic9() {this.radDeg = MathUtils.radiansToDegrees;}
    static __initStatic10() {this.degreesToRadians = MathUtils.PI / 180;}
    static __initStatic11() {this.degRad = MathUtils.degreesToRadians;}

    static clamp (value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    static cosDeg (degrees) {
        return Math.cos(degrees * MathUtils.degRad);
    }

    static sinDeg (degrees) {
        return Math.sin(degrees * MathUtils.degRad);
    }

    static signum (value) {
        return value > 0 ? 1 : value < 0 ? -1 : 0;
    }

    static toInt (x) {
        return x > 0 ? Math.floor(x) : Math.ceil(x);
    }

    static cbrt (x) {
        let y = Math.pow(Math.abs(x), 1/3);
        return x < 0 ? -y : y;
    }

    static randomTriangular (min, max) {
        return MathUtils.randomTriangularWith(min, max, (min + max) * 0.5);
    }

    static randomTriangularWith (min, max, mode) {
        let u = Math.random();
        let d = max - min;
        if (u <= (mode - min) / d) return min + Math.sqrt(u * d * (mode - min));
        return max - Math.sqrt((1 - u) * d * (max - mode));
    }
} MathUtils.__initStatic6(); MathUtils.__initStatic7(); MathUtils.__initStatic8(); MathUtils.__initStatic9(); MathUtils.__initStatic10(); MathUtils.__initStatic11();

/**
 * @public
 */
class Interpolation {
    
    apply(start, end, a) {
        return start + (end - start) * this.applyInternal(a);
    }
}

/**
 * @public
 */
class Pow extends Interpolation {
     __init4() {this.power = 2;}

    constructor (power) {
        super();Pow.prototype.__init4.call(this);        this.power = power;
    }

    applyInternal (a) {
        if (a <= 0.5) return Math.pow(a * 2, this.power) / 2;
        return Math.pow((a - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
    }
}

/**
 * @public
 */
class PowOut extends Pow {
    constructor (power) {
        super(power);
    }

    applyInternal (a)  {
        return Math.pow(a - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
    }
}

/**
 * @public
 */
class Utils {
    static __initStatic12() {this.SUPPORTS_TYPED_ARRAYS = typeof(Float32Array) !== "undefined";}

    static arrayCopy (source, sourceStart, dest, destStart, numElements) {
        for (let i = sourceStart, j = destStart; i < sourceStart + numElements; i++, j++) {
            dest[j] = source[i];
        }
    }

    static arrayFill (array, fromIndex, toIndex, value) {
        for (let i = fromIndex; i < toIndex; i++)
            array[i] = value;
    }

    static setArraySize (array, size, value = 0) {
        let oldSize = array.length;
        if (oldSize == size) return array;
        array.length = size;
        if (oldSize < size) {
            for (let i = oldSize; i < size; i++) array[i] = value;
        }
        return array;
    }

    static ensureArrayCapacity (array, size, value = 0) {
        if (array.length >= size) return array;
        return Utils.setArraySize(array, size, value);
    }

    static newArray (size, defaultValue) {
        let array = new Array(size);
        for (let i = 0; i < size; i++) array[i] = defaultValue;
        return array;
    }

    static newFloatArray (size) {
        if (Utils.SUPPORTS_TYPED_ARRAYS) {
            return new Float32Array(size)
        } else {
            let array = new Array(size);
            for (let i = 0; i < array.length; i++) array[i] = 0;
            return array;
        }
    }

    static newShortArray (size) {
        if (Utils.SUPPORTS_TYPED_ARRAYS) {
            return new Int16Array(size)
        } else {
            let array = new Array(size);
            for (let i = 0; i < array.length; i++) array[i] = 0;
            return array;
        }
    }

    static toFloatArray (array) {
        return Utils.SUPPORTS_TYPED_ARRAYS ? new Float32Array(array) : array;
    }

    static toSinglePrecision (value) {
        return Utils.SUPPORTS_TYPED_ARRAYS ? fround(value) : value;
    }

    // This function is used to fix WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
    static webkit602BugfixHelper (alpha, blend) {

    }

    static contains (array, element, identity = true) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == element) return true;
        }
        return false;
    }

    
} Utils.__initStatic12();

/**
 * @public
 */
class DebugUtils {
    static logBones(skeleton) {
        for (let i = 0; i < skeleton.bones.length; i++) {
            let bone = skeleton.bones[i];
            let mat = bone.matrix;
            console.log(bone.data.name + ", " + mat.a + ", " + mat.b + ", " + mat.c + ", " + mat.d + ", " + mat.tx + ", " + mat.ty);
        }
    }
}

/**
 * @public
 */
class Pool {
     __init5() {this.items = new Array();}
    

    constructor (instantiator) {Pool.prototype.__init5.call(this);
        this.instantiator = instantiator;
    }

    obtain () {
        return this.items.length > 0 ? this.items.pop() : this.instantiator();
    }

    free (item) {
        if ((item ).reset) (item ).reset();
        this.items.push(item);
    }

    freeAll (items) {
        for (let i = 0; i < items.length; i++) {
            this.free(items[i]);
        }
    }

    clear () {
        this.items.length = 0;
    }
}

/**
 * @public
 */
class Vector2 {
    constructor ( x = 0,  y = 0) {this.x = x;this.y = y;
    }

    set (x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    length () {
        let x = this.x;
        let y = this.y;
        return Math.sqrt(x * x + y * y);
    }

    normalize () {
        let len = this.length();
        if (len != 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }
}

/**
 * @public
 */
class TimeKeeper {constructor() { TimeKeeper.prototype.__init6.call(this);TimeKeeper.prototype.__init7.call(this);TimeKeeper.prototype.__init8.call(this);TimeKeeper.prototype.__init9.call(this);TimeKeeper.prototype.__init10.call(this);TimeKeeper.prototype.__init11.call(this);TimeKeeper.prototype.__init12.call(this); }
    __init6() {this.maxDelta = 0.064;}
    __init7() {this.framesPerSecond = 0;}
    __init8() {this.delta = 0;}
    __init9() {this.totalTime = 0;}

     __init10() {this.lastTime = Date.now() / 1000;}
     __init11() {this.frameCount = 0;}
     __init12() {this.frameTime = 0;}

    update () {
        let now = Date.now() / 1000;
        this.delta = now - this.lastTime;
        this.frameTime += this.delta;
        this.totalTime += this.delta;
        if (this.delta > this.maxDelta) this.delta = this.maxDelta;
        this.lastTime = now;

        this.frameCount++;
        if (this.frameTime > 1) {
            this.framesPerSecond = this.frameCount / this.frameTime;
            this.frameTime = 0;
            this.frameCount = 0;
        }
    }
}

/**
 * @public
 */





/**
 * @public
 */
class WindowedMean {
    
    __init13() {this.addedValues = 0;}
    __init14() {this.lastValue = 0;}
    __init15() {this.mean = 0;}
    __init16() {this.dirty = true;}

    constructor (windowSize = 32) {WindowedMean.prototype.__init13.call(this);WindowedMean.prototype.__init14.call(this);WindowedMean.prototype.__init15.call(this);WindowedMean.prototype.__init16.call(this);
        this.values = new Array(windowSize);
    }

    hasEnoughData () {
        return this.addedValues >= this.values.length;
    }

    addValue (value) {
        if (this.addedValues < this.values.length)
            this.addedValues++;
        this.values[this.lastValue++] = value;
        if (this.lastValue > this.values.length - 1) this.lastValue = 0;
        this.dirty = true;
    }

    getMean () {
        if (this.hasEnoughData()) {
            if (this.dirty) {
                let mean = 0;
                for (let i = 0; i < this.values.length; i++) {
                    mean += this.values[i];
                }
                this.mean = mean / this.values.length;
                this.dirty = false;
            }
            return this.mean;
        } else {
            return 0;
        }
    }
}

/**
 * @public
 */
let settings = {
    yDown: true,
    /**
     * pixi-spine gives option to not fail at certain parsing errors
     * spine-ts fails here
     */
    FAIL_ON_NON_EXISTING_SKIN: false,

    /**
     * past Spine.globalAutoUpdate
     */
    GLOBAL_AUTO_UPDATE: true,

    /**
     * past Spine.globalDelayLimit
     */
    GLOBAL_DELAY_LIMIT: 0,
};

let tempRgb = [0, 0, 0];

/**
 * @public
 */





/**
 * @public
 */
class SpineSprite extends Sprite  {constructor(...args) { super(...args); SpineSprite.prototype.__init.call(this);SpineSprite.prototype.__init2.call(this); }
    __init() {this.region = null;}
    __init2() {this.attachment = null;}
}

/**
 * @public
 */
class SpineMesh extends SimpleMesh  {
    __init3() {this.region = null;}
    __init4() {this.attachment = null;}

    constructor(texture, vertices, uvs, indices, drawMode) {
        super(texture, vertices, uvs, indices, drawMode);SpineMesh.prototype.__init3.call(this);SpineMesh.prototype.__init4.call(this);    }
}

/**
 * A class that enables the you to import and run your spine animations in pixi.
 * The Spine animation data needs to be loaded using either the Loader or a SpineLoader before it can be used by this class
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 *
 * ```js
 * let spineAnimation = new spine(spineData);
 * ```
 *
 * @public
 * @class
 * @extends Container
 * @memberof spine
 * @param spineData {object} The spine data loaded from a spine atlas.
 */
class SpineBase



    extends Container  {

    
    
    
    
    
    
    
    
    
    

    

    constructor(spineData) {
        super();

        if (!spineData) {
            throw new Error('The spineData param is required.');
        }

        if ((typeof spineData) === "string") {
            throw new Error('spineData param cant be string. Please use spine.Spine.fromAtlas("YOUR_RESOURCE_NAME") from now on.');
        }

        /**
         * The spineData object
         *
         * @member {object}
         */
        this.spineData = spineData;

        /**
         * A spine Skeleton object
         *
         * @member {object}
         */
        this.createSkeleton(spineData);

        /**
         * An array of containers
         *
         * @member {Container[]}
         */
        this.slotContainers = [];

        this.tempClipContainers = [];

        for (let i = 0, n = this.skeleton.slots.length; i < n; i++) {
            let slot = this.skeleton.slots[i];
            let attachment = slot.getAttachment();
            let slotContainer = this.newContainer();
            this.slotContainers.push(slotContainer);
            this.addChild(slotContainer);
            this.tempClipContainers.push(null);

            if (!attachment) {
                continue;
            }
            if (attachment.type === AttachmentType.Region) {
                let spriteName = (attachment.region ).name;
                let sprite = this.createSprite(slot, attachment , spriteName);
                slot.currentSprite = sprite;
                slot.currentSpriteName = spriteName;
                slotContainer.addChild(sprite);
            } else if (attachment.type === AttachmentType.Mesh) {
                let mesh = this.createMesh(slot, attachment);
                slot.currentMesh = mesh;
                slot.currentMeshId = attachment.id;
                slot.currentMeshName = attachment.name;
                slotContainer.addChild(mesh);
            } else if (attachment.type === AttachmentType.Clipping) {
                this.createGraphics(slot, attachment);
                slotContainer.addChild(slot.clippingContainer);
                slotContainer.addChild(slot.currentGraphics);
            }
        }

        /**
         * The tint applied to all spine slots. This is a [r,g,b] value. A value of [1,1,1] will remove any tint effect.
         *
         * @member {number}
         * @memberof spine.Spine#
         */
        this.tintRgb = new Float32Array([1, 1, 1]);

        this.autoUpdate = true;
        this.visible = true;
    }

    /**
     * If this flag is set to true, the spine animation will be automatically updated every
     * time the object id drawn. The down side of this approach is that the delta time is
     * automatically calculated and you could miss out on cool effects like slow motion,
     * pause, skip ahead and the sorts. Most of these effects can be achieved even with
     * autoUpdate enabled but are harder to achieve.
     *
     * @member {boolean}
     * @memberof spine.Spine#
     * @default true
     */
    get autoUpdate() {
        return this._autoUpdate;
    }

    set autoUpdate(value) {
        if (value !== this._autoUpdate) {
            this._autoUpdate = value;
            this.updateTransform = value ? SpineBase.prototype.autoUpdateTransform : Container.prototype.updateTransform;
        }
    }

    /**
     * The tint applied to the spine object. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @member {number}
     * @memberof spine.Spine#
     * @default 0xFFFFFF
     */
    get tint() {
        return rgb2hex(this.tintRgb );
    }

    set tint(value) {
        this.tintRgb = hex2rgb(value, this.tintRgb );
    }

    /**
     * Limit value for the update dt with Spine.globalDelayLimit
     * that can be overridden with localDelayLimit
     * @return {number} - Maximum processed dt value for the update
     */
    get delayLimit() {
        let limit = typeof this.localDelayLimit !== "undefined" ?
            this.localDelayLimit : settings.GLOBAL_DELAY_LIMIT;

        // If limit is 0, this means there is no limit for the delay
        return limit || Number.MAX_VALUE
    }

    /**
     * Update the spine skeleton and its animations by delta time (dt)
     *
     * @param dt {number} Delta time. Time by which the animation should be updated
     */
    update(dt) {
        // Limit delta value to avoid animation jumps
        let delayLimit = this.delayLimit;
        if (dt > delayLimit) dt = delayLimit;

        this.state.update(dt);
        this.state.apply(this.skeleton);

        //check we haven't been destroyed via a spine event callback in state update
        if (!this.skeleton)
            return;

        this.skeleton.updateWorldTransform();

        let slots = this.skeleton.slots;

        // in case pixi has double tint
        let globalClr = (this ).color;
        let light = null, dark = null;

        if (globalClr) {
            light = globalClr.light;
            dark = globalClr.dark;
        } else {
            light = this.tintRgb;
        }

        // let thack = false;

        for (let i = 0, n = slots.length; i < n; i++) {
            let slot = slots[i];
            let attachment = slot.getAttachment();
            let slotContainer = this.slotContainers[i];

            if (!attachment) {
                slotContainer.visible = false;
                continue;
            }

            let spriteColor = null;

            let attColor = (attachment ).color;
            switch (attachment.type) {
                case AttachmentType.Region:
                    let region = (attachment ).region;
                    if (region) {
                        if (slot.currentMesh) {
                            slot.currentMesh.visible = false;
                            slot.currentMesh = null;
                            slot.currentMeshId = undefined;
                            slot.currentMeshName = undefined;
                        }
                        let ar = region ;
                        if (!slot.currentSpriteName || slot.currentSpriteName !== ar.name) {
                            let spriteName = ar.name;
                            if (slot.currentSprite) {
                                slot.currentSprite.visible = false;
                            }
                            slot.sprites = slot.sprites || {};
                            if (slot.sprites[spriteName] !== undefined) {
                                slot.sprites[spriteName].visible = true;
                            } else {
                                let sprite = this.createSprite(slot, attachment , spriteName);
                                slotContainer.addChild(sprite);
                            }
                            slot.currentSprite = slot.sprites[spriteName];
                            slot.currentSpriteName = spriteName;

                            // force sprite update when attachment name is same.
                            // issues https://github.com/pixijs/pixi-spine/issues/318
                        } else if (slot.currentSpriteName === ar.name && !slot.hackRegion) {
                            this.setSpriteRegion(attachment , slot.currentSprite, region);
                        }
                    }

                    let transform = slotContainer.transform;
                    transform.setFromMatrix(slot.bone.matrix);

                    if (slot.currentSprite.color) {
                        //YAY! double - tint!
                        spriteColor = slot.currentSprite.color;
                    } else {
                        tempRgb[0] = light[0] * slot.color.r * attColor.r;
                        tempRgb[1] = light[1] * slot.color.g * attColor.g;
                        tempRgb[2] = light[2] * slot.color.b * attColor.b;
                        slot.currentSprite.tint = rgb2hex(tempRgb);
                    }
                    slot.currentSprite.blendMode = slot.blendMode;
                    break;

                case AttachmentType.Mesh:
                    if (slot.currentSprite) {
                        //TODO: refactor this thing, switch it on and off for container
                        slot.currentSprite.visible = false;
                        slot.currentSprite = null;
                        slot.currentSpriteName = undefined;

                        //TODO: refactor this shit
                        const transform = new Transform();
                        (transform )._parentID = -1;
                        (transform )._worldID = (slotContainer.transform )._worldID;
                        slotContainer.transform = transform;
                    }
                    const id = (attachment ).id;
                    if (!slot.currentMeshId || slot.currentMeshId !== id) {
                        let meshId = id;
                        if (slot.currentMesh) {
                            slot.currentMesh.visible = false;
                        }

                        slot.meshes = slot.meshes || {};

                        if (slot.meshes[meshId] !== undefined) {
                            slot.meshes[meshId].visible = true;
                        } else {
                            let mesh = this.createMesh(slot, attachment );
                            slotContainer.addChild(mesh);
                        }

                        slot.currentMesh = slot.meshes[meshId];
                        slot.currentMeshName = attachment.name;
                        slot.currentMeshId = meshId;
                    }
                    (attachment ).computeWorldVerticesOld(slot, slot.currentMesh.vertices);
                    if (slot.currentMesh.color) {
                        // pixi-heaven
                        spriteColor = slot.currentMesh.color;
                    } else {
                        tempRgb[0] = light[0] * slot.color.r * attColor.r;
                        tempRgb[1] = light[1] * slot.color.g * attColor.g;
                        tempRgb[2] = light[2] * slot.color.b * attColor.b;
                        slot.currentMesh.tint = rgb2hex(tempRgb);
                    }
                    slot.currentMesh.blendMode = slot.blendMode;
                    break;
                case AttachmentType.Clipping:
                    if (!slot.currentGraphics) {
                        this.createGraphics(slot, attachment );
                        slotContainer.addChild(slot.clippingContainer);
                        slotContainer.addChild(slot.currentGraphics);
                    }
                    this.updateGraphics(slot, attachment );
                    slotContainer.alpha = 1.0;
                    slotContainer.visible = true;
                    continue;
                default:
                    slotContainer.visible = false;
                    continue;
            }
            slotContainer.visible = true;

            // pixi has double tint
            if (spriteColor) {
                let r0 = slot.color.r * attColor.r;
                let g0 = slot.color.g * attColor.g;
                let b0 = slot.color.b * attColor.b;

                //YAY! double-tint!
                spriteColor.setLight(
                    light[0] * r0 + dark[0] * (1.0 - r0),
                    light[1] * g0 + dark[1] * (1.0 - g0),
                    light[2] * b0 + dark[2] * (1.0 - b0),
                );
                if (slot.darkColor) {
                    r0 = slot.darkColor.r;
                    g0 = slot.darkColor.g;
                    b0 = slot.darkColor.b;
                } else {
                    r0 = 0.0;
                    g0 = 0.0;
                    b0 = 0.0;
                }
                spriteColor.setDark(
                    light[0] * r0 + dark[0] * (1 - r0),
                    light[1] * g0 + dark[1] * (1 - g0),
                    light[2] * b0 + dark[2] * (1 - b0),
                );
            }

            slotContainer.alpha = slot.color.a;
        }

        //== this is clipping implementation ===
        //TODO: remove parent hacks when pixi masks allow it
        let drawOrder = this.skeleton.drawOrder;
        let clippingAttachment = null;
        let clippingContainer = null;

        for (let i = 0, n = drawOrder.length; i < n; i++) {
            let slot = slots[drawOrder[i].data.index];
            let slotContainer = this.slotContainers[drawOrder[i].data.index];

            if (!clippingContainer) {
                //Adding null check as it is possible for slotContainer.parent to be null in the event of a spine being disposed off in its loop callback
                if (slotContainer.parent !== null && slotContainer.parent !== this) {
                    slotContainer.parent.removeChild(slotContainer);
                    //silend add hack
                    (slotContainer ).parent = this;
                }
            }
            if (slot.currentGraphics && slot.getAttachment()) {
                clippingContainer = slot.clippingContainer;
                clippingAttachment = slot.getAttachment() ;
                clippingContainer.children.length = 0;
                this.children[i] = slotContainer;

                if (clippingAttachment.endSlot === slot.data) {
                    clippingAttachment.endSlot = null;
                }

            } else {
                if (clippingContainer) {
                    let c = this.tempClipContainers[i];
                    if (!c) {
                        c = this.tempClipContainers[i] = this.newContainer();
                        c.visible = false;
                    }
                    this.children[i] = c;

                    //silent remove hack
                    (slotContainer ).parent = null;
                    clippingContainer.addChild(slotContainer);
                    if (clippingAttachment.endSlot == slot.data) {
                        clippingContainer.renderable = true;
                        clippingContainer = null;
                        clippingAttachment = null;
                    }
                } else {
                    this.children[i] = slotContainer;
                }
            }
        }
    };

     setSpriteRegion(attachment, sprite, region) {
        // prevent setters calling when attachment and region is same
        if (sprite.attachment === attachment && sprite.region === region) {
            return;
        }

        sprite.region = region;
        sprite.attachment = attachment;

        sprite.texture = region.texture;
        sprite.rotation = attachment.rotation * MathUtils.degRad;
        sprite.position.x = attachment.x;
        sprite.position.y = attachment.y;
        sprite.alpha = attachment.color.a;

        if (!region.size) {
            sprite.scale.x = attachment.scaleX * attachment.width / region.originalWidth;
            sprite.scale.y = -attachment.scaleY * attachment.height / region.originalHeight;
        } else {
            //hacked!
            sprite.scale.x = region.size.width / region.originalWidth;
            sprite.scale.y = -region.size.height / region.originalHeight;
        }
    }

     setMeshRegion(attachment, mesh, region) {

        if (mesh.attachment === attachment && mesh.region === region) {
            return;
        }

        mesh.region = region;
        mesh.attachment = attachment;
        mesh.texture = region.texture;
        region.texture.updateUvs();
        mesh.uvBuffer.update(attachment.regionUVs);
    }

    

    /**
     * When autoupdate is set to yes this function is used as pixi's updateTransform function
     *
     * @private
     */
    autoUpdateTransform() {
        if (settings.GLOBAL_AUTO_UPDATE) {
            this.lastTime = this.lastTime || Date.now();
            let timeDelta = (Date.now() - this.lastTime) * 0.001;
            this.lastTime = Date.now();
            this.update(timeDelta);
        } else {
            this.lastTime = 0;
        }

        Container.prototype.updateTransform.call(this);
    };

    /**
     * Create a new sprite to be used with core.RegionAttachment
     *
     * @param slot {spine.Slot} The slot to which the attachment is parented
     * @param attachment {spine.RegionAttachment} The attachment that the sprite will represent
     * @private
     */
    createSprite(slot, attachment, defName) {
        let region = attachment.region;
        if (slot.hackAttachment === attachment) {
            region = slot.hackRegion;
        }
        let texture = region.texture;
        let sprite = this.newSprite(texture);

        sprite.anchor.set(0.5);
        this.setSpriteRegion(attachment, sprite, attachment.region);

        slot.sprites = slot.sprites || {};
        slot.sprites[defName] = sprite;
        return sprite;
    };

    /**
     * Creates a Strip from the spine data
     * @param slot {spine.Slot} The slot to which the attachment is parented
     * @param attachment {spine.RegionAttachment} The attachment that the sprite will represent
     * @private
     */
    createMesh(slot, attachment) {
        let region = attachment.region;
        if (slot.hackAttachment === attachment) {
            region = slot.hackRegion;
            slot.hackAttachment = null;
            slot.hackRegion = null;
        }
        let strip = this.newMesh(
            region.texture,
            new Float32Array(attachment.regionUVs.length),
            attachment.regionUVs,
            new Uint16Array(attachment.triangles),
            DRAW_MODES.TRIANGLES);

        if (typeof (strip )._canvasPadding !== "undefined") {
            (strip )._canvasPadding = 1.5;
        }

        strip.alpha = attachment.color.a;

        strip.region = attachment.region;
        this.setMeshRegion(attachment, strip, region);

        slot.meshes = slot.meshes || {};
        slot.meshes[attachment.id] = strip;
        return strip;
    };

    static __initStatic() {this.clippingPolygon = [];}

    //@ts-ignore
    createGraphics(slot, clip) {
        let graphics = this.newGraphics();
        let poly = new Polygon([]);
        graphics.clear();
        graphics.beginFill(0xffffff, 1);
        graphics.drawPolygon(poly );
        graphics.renderable = false;
        slot.currentGraphics = graphics;
        slot.clippingContainer = this.newContainer();
        slot.clippingContainer.mask = slot.currentGraphics;

        return graphics;
    }

    updateGraphics(slot, clip) {
        let geom = slot.currentGraphics.geometry;
        let vertices = (geom.graphicsData[0].shape ).points;
        let n = clip.worldVerticesLength;
        vertices.length = n;
        clip.computeWorldVertices(slot, 0, n, vertices, 0, 2);
        geom.invalidate();
    }

    /**
     * Changes texture in attachment in specific slot.
     *
     * PIXI runtime feature, it was made to satisfy our users.
     *
     * @param slotIndex {number}
     * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
     * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
     * @returns {boolean} Success flag
     */
    hackTextureBySlotIndex(slotIndex, texture = null, size = null) {
        let slot = this.skeleton.slots[slotIndex];
        if (!slot) {
            return false;
        }
        let attachment = slot.getAttachment();
        let region = attachment.region;
        if (texture) {
            region = new TextureRegion();
            region.texture = texture;
            region.size = size;
            slot.hackRegion = region;
            slot.hackAttachment = attachment;
        } else {
            slot.hackRegion = null;
            slot.hackAttachment = null;
        }
        if (slot.currentSprite && slot.currentSprite.region != region) {
            this.setSpriteRegion(attachment, slot.currentSprite, region);
            slot.currentSprite.region = region;
        } else if (slot.currentMesh && slot.currentMesh.region != region) {
            this.setMeshRegion(attachment, slot.currentMesh, region);
        }
        return true;
    }

    /**
     * Changes texture in attachment in specific slot.
     *
     * PIXI runtime feature, it was made to satisfy our users.
     *
     * @param slotName {string}
     * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
     * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
     * @returns {boolean} Success flag
     */
    hackTextureBySlotName(slotName, texture = null, size = null) {
        let index = this.skeleton.findSlotIndex(slotName);
        if (index == -1) {
            return false;
        }
        return this.hackTextureBySlotIndex(index, texture, size);
    }

    /**
     * Changes texture of an attachment
     *
     * PIXI runtime feature, it was made to satisfy our users.
     *
     * @param slotName {string}
     * @param attachmentName {string}
     * @param [texture = null] {PIXI.Texture} If null, take default (original) texture
     * @param [size = null] {PIXI.Point} sometimes we need new size for region attachment, you can pass 'texture.orig' there
     * @returns {boolean} Success flag
     */
    hackTextureAttachment(slotName, attachmentName, texture, size = null) {
        // changes the texture of an attachment at the skeleton level
        const slotIndex = this.skeleton.findSlotIndex(slotName);
        const attachment = this.skeleton.getAttachmentByName(slotName, attachmentName);
        attachment.region.texture = texture;

        const slot = this.skeleton.slots[slotIndex];
        if (!slot) {
            return false
        }

        // gets the currently active attachment in this slot
        const currentAttachment = slot.getAttachment();
        if (attachmentName === currentAttachment.name) {
            // if the attachment we are changing is currently active, change the the live texture
            let region = attachment.region;
            if (texture) {
                region = new TextureRegion();
                region.texture = texture;
                region.size = size;
                slot.hackRegion = region;
                slot.hackAttachment = currentAttachment;
            } else {
                slot.hackRegion = null;
                slot.hackAttachment = null;
            }
            if (slot.currentSprite && slot.currentSprite.region != region) {
                this.setSpriteRegion(currentAttachment, slot.currentSprite, region);
                slot.currentSprite.region = region;
            } else if (slot.currentMesh && slot.currentMesh.region != region) {
                this.setMeshRegion(currentAttachment, slot.currentMesh, region);
            }
            return true
        }
        return false
    }

    //those methods can be overriden to spawn different classes
    newContainer() {
        return new Container();
    }

    newSprite(tex) {
        return new SpineSprite(tex);
    }

    newGraphics() {
        return new Graphics();
    }

    newMesh(texture, vertices, uvs, indices, drawMode) {
        return new SpineMesh(texture, vertices, uvs, indices, drawMode);
    }

    transformHack() {
        return 1;
    }

    /**
     * Hack for pixi-display and pixi-lights. Every attachment name ending with a suffix will be added to different layer
     * @param nameSuffix
     * @param group
     * @param outGroup
     */
    hackAttachmentGroups(nameSuffix, group, outGroup) {
        if (!nameSuffix) {
            return undefined;
        }
        const list_d = [], list_n = [];
        for (let i = 0, len = this.skeleton.slots.length; i < len; i++) {
            const slot = this.skeleton.slots[i];
            const name = slot.currentSpriteName || slot.currentMeshName || "";
            const target = slot.currentSprite || slot.currentMesh;
            if (name.endsWith(nameSuffix)) {
                target.parentGroup = group;
                list_n.push(target);
            } else if (outGroup && target) {
                target.parentGroup = outGroup;
                list_d.push(target);
            }
        }
        return [list_d, list_n];
    };

    destroy(options) {
        for (let i = 0, n = this.skeleton.slots.length; i < n; i++) {
            let slot = this.skeleton.slots[i];
            for (let name in slot.meshes) {
                slot.meshes[name].destroy(options);
            }
            slot.meshes = null;

            for (let name in slot.sprites) {
                slot.sprites[name].destroy(options);
            }
            slot.sprites = null;
        }

        for (let i = 0, n = this.slotContainers.length; i < n; i++) {
            this.slotContainers[i].destroy(options);
        }
        this.spineData = null;
        this.skeleton = null;
        this.slotContainers = null;
        this.stateData = null;
        this.state = null;
        this.tempClipContainers = null;

        super.destroy(options);
    }
} SpineBase.__initStatic();


/**
 * The visibility of the spine object. If false the object will not be drawn,
 * the updateTransform function will not be called, and the spine will not be automatically updated.
 *
 * @member {boolean}
 * @memberof spine.Spine#
 * @default true
 */
Object.defineProperty(SpineBase.prototype, 'visible', {
    get: function () {
        return this._visible;
    },
    set: function (value) {
        if (value !== this._visible) {
            this._visible = value;
            if (value) {
                this.lastTime = 0;
            }
        }
    }
});

export { AttachmentType, BinaryInput, Color, DebugUtils, IntSet, Interpolation, MathUtils, Pool, Pow, PowOut, SpineBase, SpineMesh, SpineSprite, StringSet, TextureAtlas, TextureAtlasPage, TextureAtlasRegion, TextureFilter, TextureRegion, TextureWrap, TimeKeeper, Utils, Vector2, WindowedMean, filterFromString, settings, wrapFromString };
//# sourceMappingURL=base.es.js.map
