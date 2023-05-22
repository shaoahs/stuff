/* eslint-disable */
 
/*!
 * @pixi-spine/loader-uni - v3.0.1
 * Compiled Fri, 19 May 2023 01:56:08 UTC
 *
 * @pixi-spine/loader-uni is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Mat Groves, All Rights Reserved
 */
import { AbstractSpineParser } from '@pixi-spine/loader-base';
import { BinaryInput, SpineBase } from '@pixi-spine/base';
import { Loader } from '@pixi/loaders';
import * as spine38 from '@pixi-spine/runtime-3.8';
import { SkeletonBinary, AtlasAttachmentLoader, SkeletonJson as SkeletonJson$1 } from '@pixi-spine/runtime-3.8';
import * as spine37 from '@pixi-spine/runtime-3.7';
import { SkeletonJson, AtlasAttachmentLoader as AtlasAttachmentLoader$2 } from '@pixi-spine/runtime-3.7';
import * as spine40 from '@pixi-spine/runtime-4.0';
import { SkeletonBinary as SkeletonBinary$1, AtlasAttachmentLoader as AtlasAttachmentLoader$1, SkeletonJson as SkeletonJson$2 } from '@pixi-spine/runtime-4.0';

/**
 * @public
 */
var SPINE_VERSION; (function (SPINE_VERSION) {
    const UNKNOWN = 0; SPINE_VERSION[SPINE_VERSION["UNKNOWN"] = UNKNOWN] = "UNKNOWN";
    const VER37 = 37; SPINE_VERSION[SPINE_VERSION["VER37"] = VER37] = "VER37";
    const VER38 = 38; SPINE_VERSION[SPINE_VERSION["VER38"] = VER38] = "VER38";
    const VER40 = 40; SPINE_VERSION[SPINE_VERSION["VER40"] = VER40] = "VER40";
})(SPINE_VERSION || (SPINE_VERSION = {}));

/**
 * @public
 */
function detectSpineVersion(version) {
    const ver3 = version.substr(0, 3);
    const verNum = Math.floor(+ver3 * 10 + 1e-3);

    if (ver3 === '3.7') {
        return SPINE_VERSION.VER37;
    }
    if (ver3 === '3.8') {
        return SPINE_VERSION.VER38;
    }
    if (ver3 === '4.0') {
        return SPINE_VERSION.VER40;
    }
    // try parse old versions with 3.7
    if (verNum < SPINE_VERSION.VER37) {
        return SPINE_VERSION.VER37;
    }
    return SPINE_VERSION.UNKNOWN;
}

class UniBinaryParser  {constructor() { UniBinaryParser.prototype.__init.call(this); }
    __init() {this.scale = 1;}

    readSkeletonData(atlas, dataToParse) {
        let input = new BinaryInput(dataToParse);
        input.readString();
        let version = input.readString();
        let ver = detectSpineVersion(version);
        let parser = null;

        if (ver === SPINE_VERSION.VER38) {
            parser = new SkeletonBinary(new AtlasAttachmentLoader(atlas));
        }

        input = new BinaryInput(dataToParse);
        input.readInt32();
        input.readInt32();
        version = input.readString();
        ver = detectSpineVersion(version);
        if (ver === SPINE_VERSION.VER40) {
            parser = new SkeletonBinary$1(new AtlasAttachmentLoader$1(atlas));
        }
        if (!parser) {
            let error = `Unsupported version of spine model ${version}, please update pixi-spine`;
            console.error(error);
        }

        parser.scale = this.scale;
        return parser.readSkeletonData(dataToParse);
    }
}

class UniJsonParser  {constructor() { UniJsonParser.prototype.__init2.call(this); }
    __init2() {this.scale = 1;}

    readSkeletonData(atlas, dataToParse) {
        const version = dataToParse.skeleton.spine;
        const ver = detectSpineVersion(version);
        let parser = null;

        if (ver === SPINE_VERSION.VER37) {
            parser = new SkeletonJson(new AtlasAttachmentLoader$2(atlas));
        }
        if (ver === SPINE_VERSION.VER38) {
            parser = new SkeletonJson$1(new AtlasAttachmentLoader(atlas));
        }
        if (ver === SPINE_VERSION.VER40) {
            parser = new SkeletonJson$2(new AtlasAttachmentLoader$1(atlas));
        }
        if (!parser) {
            let error = `Unsupported version of spine model ${version}, please update pixi-spine`;
            console.error(error);
        }

        parser.scale = this.scale;
        return parser.readSkeletonData(dataToParse);
    }
}

/**
 * @public
 */
class SpineParser extends AbstractSpineParser {
    createBinaryParser() {
        return new UniBinaryParser();
    }

    createJsonParser() {
        return new UniJsonParser();
    }

    parseData(resource, parser, atlas, dataToParse) {
        const parserCast = parser ;
        resource.spineData = parserCast.readSkeletonData(atlas, dataToParse);
        resource.spineAtlas = atlas;
    }

    static __initStatic() {this.use = new SpineParser().genMiddleware().use;}

    static registerLoaderPlugin() {
        Loader.registerPlugin(SpineParser);
    }
} SpineParser.__initStatic();

/**
 * @public
 */
class Spine extends SpineBase


 {

    createSkeleton(spineData) {
        const ver = detectSpineVersion(spineData.version);
        let spine = null;

        if (ver === SPINE_VERSION.VER37) {
            spine = spine37;
        }
        if (ver === SPINE_VERSION.VER38) {
            spine = spine38;
        }
        if (ver === SPINE_VERSION.VER40) {
            spine = spine40;
        }
        if (!spine) {
            let error = `Cant detect version of spine model ${spineData.version}`;
            console.error(error);
        }
        this.skeleton = new spine.Skeleton(spineData);
        this.skeleton.updateWorldTransform();
        this.stateData = new spine.AnimationStateData(spineData);
        this.state = new spine.AnimationState(this.stateData);
    }
}

export { SPINE_VERSION, Spine, SpineParser, detectSpineVersion };
//# sourceMappingURL=loader-uni.es.js.map
