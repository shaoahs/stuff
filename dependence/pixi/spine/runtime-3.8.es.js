/* eslint-disable */
 
/*!
 * @pixi-spine/runtime-3.8 - v3.0.1
 * Compiled Fri, 19 May 2023 01:56:05 UTC
 *
 * @pixi-spine/runtime-3.8 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */
import { Utils, AttachmentType, Color, MathUtils, PowOut, IntSet, Pool, settings, Vector2, BinaryInput, SpineBase } from '@pixi-spine/base';
import { Matrix } from '@pixi/math';
import { BLEND_MODES } from '@pixi/constants';

/**
 * @public
 */
class Attachment  {
    
    

    constructor(name) {
        if (name == null) throw new Error("name cannot be null.");
        this.name = name;
    }

    
}

/**
 * @public
 */
class VertexAttachment extends Attachment {
     static __initStatic() {this.nextID = 0;}

    __init() {this.id = (VertexAttachment.nextID++ & 65535) << 11;}
    
    
    __init2() {this.worldVerticesLength = 0;}
    __init3() {this.deformAttachment = this;}

    constructor(name) {
        super(name);VertexAttachment.prototype.__init.call(this);VertexAttachment.prototype.__init2.call(this);VertexAttachment.prototype.__init3.call(this);    }

    computeWorldVerticesOld(slot, worldVertices) {
        this.computeWorldVertices(slot, 0, this.worldVerticesLength, worldVertices, 0, 2);
    }

    /** Transforms local vertices to world coordinates.
     * @param start The index of the first local vertex value to transform. Each vertex has 2 values, x and y.
     * @param count The number of world vertex values to output. Must be <= {@link #getWorldVerticesLength()} - start.
     * @param worldVertices The output world vertices. Must have a length >= offset + count.
     * @param offset The worldVertices index to begin writing values. */
    computeWorldVertices (slot, start, count, worldVertices, offset, stride) {
        count = offset + (count >> 1) * stride;
        let skeleton = slot.bone.skeleton;
        let deformArray = slot.deform;
        let vertices = this.vertices;
        let bones = this.bones;
        if (bones == null) {
            if (deformArray.length > 0) vertices = deformArray;
            let mat = slot.bone.matrix;
            let x = mat.tx;
            let y = mat.ty;
            let a = mat.a, b = mat.c, c = mat.b, d = mat.d;
            for (let v = start, w = offset; w < count; v += 2, w += stride) {
                let vx = vertices[v], vy = vertices[v + 1];
                worldVertices[w] = vx * a + vy * b + x;
                worldVertices[w + 1] = vx * c + vy * d + y;
            }
            return;
        }
        let v = 0, skip = 0;
        for (let i = 0; i < start; i += 2) {
            let n = bones[v];
            v += n + 1;
            skip += n;
        }
        let skeletonBones = skeleton.bones;
        if (deformArray.length == 0) {
            for (let w = offset, b = skip * 3; w < count; w += stride) {
                let wx = 0, wy = 0;
                let n = bones[v++];
                n += v;
                for (; v < n; v++, b += 3) {
                    let mat = skeletonBones[bones[v]].matrix;
                    let vx = vertices[b], vy = vertices[b + 1], weight = vertices[b + 2];
                    wx += (vx * mat.a + vy * mat.c + mat.tx) * weight;
                    wy += (vx * mat.b + vy * mat.d + mat.ty) * weight;
                }
                worldVertices[w] = wx;
                worldVertices[w + 1] = wy;
            }
        } else {
            let deform = deformArray;
            for (let w = offset, b = skip * 3, f = skip << 1; w < count; w += stride) {
                let wx = 0, wy = 0;
                let n = bones[v++];
                n += v;
                for (; v < n; v++, b += 3, f += 2) {
                    let mat = skeletonBones[bones[v]].matrix;
                    let vx = vertices[b] + deform[f], vy = vertices[b + 1] + deform[f + 1], weight = vertices[b + 2];
                    wx += (vx * mat.a + vy * mat.c + mat.tx) * weight;
                    wy += (vx * mat.b + vy * mat.d + mat.ty) * weight;
                }
                worldVertices[w] = wx;
                worldVertices[w + 1] = wy;
            }
        }
    }

    copyTo (attachment) {
        if (this.bones != null) {
            attachment.bones = new Array(this.bones.length);
            Utils.arrayCopy(this.bones, 0, attachment.bones, 0, this.bones.length);
        } else
            attachment.bones = null;

        if (this.vertices != null) {
            attachment.vertices = Utils.newFloatArray(this.vertices.length);
            Utils.arrayCopy(this.vertices, 0, attachment.vertices, 0, this.vertices.length);
        } else
            attachment.vertices = null;

        attachment.worldVerticesLength = this.worldVerticesLength;
        attachment.deformAttachment = this.deformAttachment;
    }
} VertexAttachment.__initStatic();

/**
 * @public
 */
class BoundingBoxAttachment extends VertexAttachment {
    __init() {this.type = AttachmentType.BoundingBox;}
    __init2() {this.color = new Color(1, 1, 1, 1);}

    constructor (name) {
        super(name);BoundingBoxAttachment.prototype.__init.call(this);BoundingBoxAttachment.prototype.__init2.call(this);    }

    copy () {
        let copy = new BoundingBoxAttachment(this.name);
        this.copyTo(copy);
        copy.color.setFromColor(this.color);
        return copy;
    }
}

/**
 * @public
 */
class ClippingAttachment extends VertexAttachment  {
    __init() {this.type = AttachmentType.Clipping;}
    

    // Nonessential.
    __init2() {this.color = new Color(0.2275, 0.2275, 0.8078, 1);} // ce3a3aff

    constructor (name) {
        super(name);ClippingAttachment.prototype.__init.call(this);ClippingAttachment.prototype.__init2.call(this);    }

    copy () {
        let copy = new ClippingAttachment(this.name);
        this.copyTo(copy);
        copy.endSlot = this.endSlot;
        copy.color.setFromColor(this.color);
        return copy;
    }
}

/**
 * @public
 */
class MeshAttachment extends VertexAttachment  {
    __init() {this.type = AttachmentType.Mesh;}

    
    
    
    
    __init2() {this.color = new Color(1, 1, 1, 1);}
    
    
    
    
    
    __init3() {this.tempColor = new Color(0, 0, 0, 0);}

    constructor (name) {
        super(name);MeshAttachment.prototype.__init.call(this);MeshAttachment.prototype.__init2.call(this);MeshAttachment.prototype.__init3.call(this);    }

    getParentMesh () {
        return this.parentMesh;
    }

    /** @param parentMesh May be null. */
    setParentMesh (parentMesh) {
        this.parentMesh = parentMesh;
        if (parentMesh != null) {
            this.bones = parentMesh.bones;
            this.vertices = parentMesh.vertices;
            this.worldVerticesLength = parentMesh.worldVerticesLength;
            this.regionUVs = parentMesh.regionUVs;
            this.triangles = parentMesh.triangles;
            this.hullLength = parentMesh.hullLength;
            this.worldVerticesLength = parentMesh.worldVerticesLength;
        }
    }

    copy () {
        if (this.parentMesh != null) return this.newLinkedMesh();

        let copy = new MeshAttachment(this.name);
        copy.region = this.region;
        copy.path = this.path;
        copy.color.setFromColor(this.color);

        this.copyTo(copy);
        copy.regionUVs = new Float32Array(this.regionUVs.length);
        Utils.arrayCopy(this.regionUVs, 0, copy.regionUVs, 0, this.regionUVs.length);
        copy.triangles = new Array(this.triangles.length);
        Utils.arrayCopy(this.triangles, 0, copy.triangles, 0, this.triangles.length);
        copy.hullLength = this.hullLength;

        // Nonessential.
        if (this.edges != null) {
            copy.edges = new Array(this.edges.length);
            Utils.arrayCopy(this.edges, 0, copy.edges, 0, this.edges.length);
        }
        copy.width = this.width;
        copy.height = this.height;

        return copy;
    }

    newLinkedMesh () {
        let copy = new MeshAttachment(this.name);
        copy.region = this.region;
        copy.path = this.path;
        copy.color.setFromColor(this.color);
        copy.deformAttachment = this.deformAttachment;
        copy.setParentMesh(this.parentMesh != null ? this.parentMesh : this);
        // copy.updateUVs();
        return copy;
    }
}

/**
 * @public
 */
class PathAttachment extends VertexAttachment {
    __init() {this.type = AttachmentType.Path;}
    
    __init2() {this.closed = false;} __init3() {this.constantSpeed = false;}
    __init4() {this.color = new Color(1, 1, 1, 1);}

    constructor (name) {
        super(name);PathAttachment.prototype.__init.call(this);PathAttachment.prototype.__init2.call(this);PathAttachment.prototype.__init3.call(this);PathAttachment.prototype.__init4.call(this);    }

    copy () {
        let copy = new PathAttachment(this.name);
        this.copyTo(copy);
        copy.lengths = new Array(this.lengths.length);
        Utils.arrayCopy(this.lengths, 0, copy.lengths, 0, this.lengths.length);
        copy.closed = closed;
        copy.constantSpeed = this.constantSpeed;
        copy.color.setFromColor(this.color);
        return copy;
    }
}

/**
 * @public
 */
class PointAttachment extends VertexAttachment {
    __init() {this.type = AttachmentType.Point;}
      
    __init2() {this.color = new Color(0.38, 0.94, 0, 1);}

    constructor (name) {
        super(name);PointAttachment.prototype.__init.call(this);PointAttachment.prototype.__init2.call(this);    }

    computeWorldPosition(bone, point) {
        const mat = bone.matrix;
        point.x = this.x * mat.a + this.y * mat.c + bone.worldX;
        point.y = this.x * mat.b + this.y * mat.d + bone.worldY;
        return point;
    }

    computeWorldRotation(bone) {
        const mat = bone.matrix;
        let cos = MathUtils.cosDeg(this.rotation), sin = MathUtils.sinDeg(this.rotation);
        let x = cos * mat.a + sin * mat.c;
        let y = cos * mat.b + sin * mat.d;
        return Math.atan2(y, x) * MathUtils.radDeg;
    }

    copy () {
        let copy = new PointAttachment(this.name);
        copy.x = this.x;
        copy.y = this.y;
        copy.rotation = this.rotation;
        copy.color.setFromColor(this.color);
        return copy;
    }
}

/**
 * @public
 */
class RegionAttachment extends Attachment  {
    __init() {this.type = AttachmentType.Region;}

    static __initStatic() {this.OX1 = 0;}
    static __initStatic2() {this.OY1 = 1;}
    static __initStatic3() {this.OX2 = 2;}
    static __initStatic4() {this.OY2 = 3;}
    static __initStatic5() {this.OX3 = 4;}
    static __initStatic6() {this.OY3 = 5;}
    static __initStatic7() {this.OX4 = 6;}
    static __initStatic8() {this.OY4 = 7;}

    static __initStatic9() {this.X1 = 0;}
    static __initStatic10() {this.Y1 = 1;}
    static __initStatic11() {this.C1R = 2;}
    static __initStatic12() {this.C1G = 3;}
    static __initStatic13() {this.C1B = 4;}
    static __initStatic14() {this.C1A = 5;}
    static __initStatic15() {this.U1 = 6;}
    static __initStatic16() {this.V1 = 7;}

    static __initStatic17() {this.X2 = 8;}
    static __initStatic18() {this.Y2 = 9;}
    static __initStatic19() {this.C2R = 10;}
    static __initStatic20() {this.C2G = 11;}
    static __initStatic21() {this.C2B = 12;}
    static __initStatic22() {this.C2A = 13;}
    static __initStatic23() {this.U2 = 14;}
    static __initStatic24() {this.V2 = 15;}

    static __initStatic25() {this.X3 = 16;}
    static __initStatic26() {this.Y3 = 17;}
    static __initStatic27() {this.C3R = 18;}
    static __initStatic28() {this.C3G = 19;}
    static __initStatic29() {this.C3B = 20;}
    static __initStatic30() {this.C3A = 21;}
    static __initStatic31() {this.U3 = 22;}
    static __initStatic32() {this.V3 = 23;}

    static __initStatic33() {this.X4 = 24;}
    static __initStatic34() {this.Y4 = 25;}
    static __initStatic35() {this.C4R = 26;}
    static __initStatic36() {this.C4G = 27;}
    static __initStatic37() {this.C4B = 28;}
    static __initStatic38() {this.C4A = 29;}
    static __initStatic39() {this.U4 = 30;}
    static __initStatic40() {this.V4 = 31;}

    __init2() {this.x = 0;}
    __init3() {this.y = 0;}
    __init4() {this.scaleX = 1;}
    __init5() {this.scaleY = 1;}
    __init6() {this.rotation = 0;}
    __init7() {this.width = 0;}
    __init8() {this.height = 0;}
    __init9() {this.color = new Color(1, 1, 1, 1);}

    
    
    

    __init10() {this.offset = Utils.newFloatArray(8);}
    __init11() {this.uvs = Utils.newFloatArray(8);}

    __init12() {this.tempColor = new Color(1, 1, 1, 1);}

    constructor(name) {
        super(name);RegionAttachment.prototype.__init.call(this);RegionAttachment.prototype.__init2.call(this);RegionAttachment.prototype.__init3.call(this);RegionAttachment.prototype.__init4.call(this);RegionAttachment.prototype.__init5.call(this);RegionAttachment.prototype.__init6.call(this);RegionAttachment.prototype.__init7.call(this);RegionAttachment.prototype.__init8.call(this);RegionAttachment.prototype.__init9.call(this);RegionAttachment.prototype.__init10.call(this);RegionAttachment.prototype.__init11.call(this);RegionAttachment.prototype.__init12.call(this);    }

    updateOffset() {
        let regionScaleX = this.width / this.region.originalWidth * this.scaleX;
        let regionScaleY = this.height / this.region.originalHeight * this.scaleY;
        let localX = -this.width / 2 * this.scaleX + this.region.offsetX * regionScaleX;
        let localY = -this.height / 2 * this.scaleY + this.region.offsetY * regionScaleY;
        let localX2 = localX + this.region.width * regionScaleX;
        let localY2 = localY + this.region.height * regionScaleY;
        let radians = this.rotation * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let localXCos = localX * cos + this.x;
        let localXSin = localX * sin;
        let localYCos = localY * cos + this.y;
        let localYSin = localY * sin;
        let localX2Cos = localX2 * cos + this.x;
        let localX2Sin = localX2 * sin;
        let localY2Cos = localY2 * cos + this.y;
        let localY2Sin = localY2 * sin;
        let offset = this.offset;
        offset[RegionAttachment.OX1] = localXCos - localYSin;
        offset[RegionAttachment.OY1] = localYCos + localXSin;
        offset[RegionAttachment.OX2] = localXCos - localY2Sin;
        offset[RegionAttachment.OY2] = localY2Cos + localXSin;
        offset[RegionAttachment.OX3] = localX2Cos - localY2Sin;
        offset[RegionAttachment.OY3] = localY2Cos + localX2Sin;
        offset[RegionAttachment.OX4] = localX2Cos - localYSin;
        offset[RegionAttachment.OY4] = localYCos + localX2Sin;
    }

    setRegion(region) {
        this.region = region;
        let uvs = this.uvs;
        if (region.rotate) {
            uvs[2] = region.u;
            uvs[3] = region.v2;
            uvs[4] = region.u;
            uvs[5] = region.v;
            uvs[6] = region.u2;
            uvs[7] = region.v;
            uvs[0] = region.u2;
            uvs[1] = region.v2;
        } else {
            uvs[0] = region.u;
            uvs[1] = region.v2;
            uvs[2] = region.u;
            uvs[3] = region.v;
            uvs[4] = region.u2;
            uvs[5] = region.v;
            uvs[6] = region.u2;
            uvs[7] = region.v2;
        }
    }

    computeWorldVertices(bone, worldVertices, offset, stride) {
        let vertexOffset = this.offset;
        let mat = bone.matrix;
        let x = mat.tx, y = mat.ty;
        let a = mat.a, b = mat.c, c = mat.b, d = mat.d;
        let offsetX = 0, offsetY = 0;

        offsetX = vertexOffset[RegionAttachment.OX1];
        offsetY = vertexOffset[RegionAttachment.OY1];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // br
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[RegionAttachment.OX2];
        offsetY = vertexOffset[RegionAttachment.OY2];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // bl
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[RegionAttachment.OX3];
        offsetY = vertexOffset[RegionAttachment.OY3];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // ul
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
        offset += stride;

        offsetX = vertexOffset[RegionAttachment.OX4];
        offsetY = vertexOffset[RegionAttachment.OY4];
        worldVertices[offset] = offsetX * a + offsetY * b + x; // ur
        worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    }

    copy () {
        let copy = new RegionAttachment(this.name);
        copy.region = this.region;
        copy.rendererObject = this.rendererObject;
        copy.path = this.path;
        copy.x = this.x;
        copy.y = this.y;
        copy.scaleX = this.scaleX;
        copy.scaleY = this.scaleY;
        copy.rotation = this.rotation;
        copy.width = this.width;
        copy.height = this.height;
        Utils.arrayCopy(this.uvs, 0, copy.uvs, 0, 8);
        Utils.arrayCopy(this.offset, 0, copy.offset, 0, 8);
        copy.color.setFromColor(this.color);
        return copy;
    }
} RegionAttachment.__initStatic(); RegionAttachment.__initStatic2(); RegionAttachment.__initStatic3(); RegionAttachment.__initStatic4(); RegionAttachment.__initStatic5(); RegionAttachment.__initStatic6(); RegionAttachment.__initStatic7(); RegionAttachment.__initStatic8(); RegionAttachment.__initStatic9(); RegionAttachment.__initStatic10(); RegionAttachment.__initStatic11(); RegionAttachment.__initStatic12(); RegionAttachment.__initStatic13(); RegionAttachment.__initStatic14(); RegionAttachment.__initStatic15(); RegionAttachment.__initStatic16(); RegionAttachment.__initStatic17(); RegionAttachment.__initStatic18(); RegionAttachment.__initStatic19(); RegionAttachment.__initStatic20(); RegionAttachment.__initStatic21(); RegionAttachment.__initStatic22(); RegionAttachment.__initStatic23(); RegionAttachment.__initStatic24(); RegionAttachment.__initStatic25(); RegionAttachment.__initStatic26(); RegionAttachment.__initStatic27(); RegionAttachment.__initStatic28(); RegionAttachment.__initStatic29(); RegionAttachment.__initStatic30(); RegionAttachment.__initStatic31(); RegionAttachment.__initStatic32(); RegionAttachment.__initStatic33(); RegionAttachment.__initStatic34(); RegionAttachment.__initStatic35(); RegionAttachment.__initStatic36(); RegionAttachment.__initStatic37(); RegionAttachment.__initStatic38(); RegionAttachment.__initStatic39(); RegionAttachment.__initStatic40();

/**
 * @public
 */
class JitterEffect  {
    __init() {this.jitterX = 0;}
    __init2() {this.jitterY = 0;}

    constructor (jitterX, jitterY) {JitterEffect.prototype.__init.call(this);JitterEffect.prototype.__init2.call(this);
        this.jitterX = jitterX;
        this.jitterY = jitterY;
    }

    begin(skeleton) {
    }

    transform(position, uv, light, dark) {
        position.x += MathUtils.randomTriangular(-this.jitterX, this.jitterY);
        position.y += MathUtils.randomTriangular(-this.jitterX, this.jitterY);
    }

    end() {
    }
}

/**
 * @public
 */
class SwirlEffect  {
    static __initStatic() {this.interpolation = new PowOut(2);}
    __init() {this.centerX = 0;}
    __init2() {this.centerY = 0;}
    __init3() {this.radius = 0;}
    __init4() {this.angle = 0;}
     __init5() {this.worldX = 0;}
     __init6() {this.worldY = 0;}

    constructor (radius) {SwirlEffect.prototype.__init.call(this);SwirlEffect.prototype.__init2.call(this);SwirlEffect.prototype.__init3.call(this);SwirlEffect.prototype.__init4.call(this);SwirlEffect.prototype.__init5.call(this);SwirlEffect.prototype.__init6.call(this);
        this.radius = radius;
    }

    begin(skeleton) {
        this.worldX = skeleton.x + this.centerX;
        this.worldY = skeleton.y + this.centerY;
    }

    transform(position, uv, light, dark) {
        let radAngle = this.angle * MathUtils.degreesToRadians;
        let x = position.x - this.worldX;
        let y = position.y - this.worldY;
        let dist = Math.sqrt(x * x + y * y);
        if (dist < this.radius) {
            let theta = SwirlEffect.interpolation.apply(0, radAngle, (this.radius - dist) / this.radius);
            let cos = Math.cos(theta);
            let sin = Math.sin(theta);
            position.x = cos * x - sin * y + this.worldX;
            position.y = sin * x + cos * y + this.worldY;
        }
    }

    end() {
    }
} SwirlEffect.__initStatic();

/** A simple container for a list of timelines and a name. */
/**
 * @public
 */
class Animation {
    /** The animation's name, which is unique across all animations in the skeleton. */
    
    
    

    /** The duration of the animation in seconds, which is the highest time of all keys in the timeline. */
    

    constructor (name, timelines, duration) {
        if (name == null) throw new Error("name cannot be null.");
        if (timelines == null) throw new Error("timelines cannot be null.");
        this.name = name;
        this.timelines = timelines;
        this.timelineIds = [];
        for (var i = 0; i < timelines.length; i++)
            this.timelineIds[timelines[i].getPropertyId()] = true;
        this.duration = duration;
    }

    hasTimeline (id) {
        return this.timelineIds[id] == true;
    }

    /** Applies all the animation's timelines to the specified skeleton.
     *
     * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
     * @param loop If true, the animation repeats after {@link #getDuration()}.
     * @param events May be null to ignore fired events. */
    apply (skeleton, lastTime, time, loop, events, alpha, blend, direction) {
        if (skeleton == null) throw new Error("skeleton cannot be null.");

        if (loop && this.duration != 0) {
            time %= this.duration;
            if (lastTime > 0) lastTime %= this.duration;
        }

        let timelines = this.timelines;
        for (let i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, lastTime, time, events, alpha, blend, direction);
    }

    /** @param target After the first and before the last value.
     * @returns index of first value greater than the target. */
    static binarySearch (values, target, step = 1) {
        let low = 0;
        let high = values.length / step - 2;
        if (high == 0) return step;
        let current = high >>> 1;
        while (true) {
            if (values[(current + 1) * step] <= target)
                low = current + 1;
            else
                high = current;
            if (low == high) return (low + 1) * step;
            current = (low + high) >>> 1;
        }
    }

    static linearSearch (values, target, step) {
        for (let i = 0, last = values.length - step; i <= last; i += step)
            if (values[i] > target) return i;
        return -1;
    }
}

/** The interface for all timelines. */
/**
 * @public
 */
























/** Controls how a timeline value is mixed with the setup pose value or current pose value when a timeline's `alpha`
 * < 1.
 *
 * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}. */
/**
 * @public
 */
var MixBlend; (function (MixBlend) {
    /** Transitions from the setup value to the timeline value (the current value is not used). Before the first key, the setup
     * value is set. */
    const setup = 0; MixBlend[MixBlend["setup"] = setup] = "setup";
    /** Transitions from the current value to the timeline value. Before the first key, transitions from the current value to
     * the setup value. Timelines which perform instant transitions, such as {@link DrawOrderTimeline} or
     * {@link AttachmentTimeline}, use the setup value before the first key.
     *
     * `first` is intended for the first animations applied, not for animations layered on top of those. */
    const first = setup + 1; MixBlend[MixBlend["first"] = first] = "first";
    /** Transitions from the current value to the timeline value. No change is made before the first key (the current value is
     * kept until the first key).
     *
     * `replace` is intended for animations layered on top of others, not for the first animations applied. */
    const replace = first + 1; MixBlend[MixBlend["replace"] = replace] = "replace";
    /** Transitions from the current value to the current value plus the timeline value. No change is made before the first key
     * (the current value is kept until the first key).
     *
     * `add` is intended for animations layered on top of others, not for the first animations applied. Properties
     * keyed by additive animations must be set manually or by another animation before applying the additive animations, else
     * the property values will increase continually. */
    const add = replace + 1; MixBlend[MixBlend["add"] = add] = "add";
})(MixBlend || (MixBlend = {}));

/** Indicates whether a timeline's `alpha` is mixing out over time toward 0 (the setup or current pose value) or
 * mixing in toward 1 (the timeline's value).
 *
 * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}. */
/**
 * @public
 */
var MixDirection; (function (MixDirection) {
    const mixIn = 0; MixDirection[MixDirection["mixIn"] = mixIn] = "mixIn"; const mixOut = mixIn + 1; MixDirection[MixDirection["mixOut"] = mixOut] = "mixOut";
})(MixDirection || (MixDirection = {}));

/**
 * @public
 */
var TimelineType; (function (TimelineType) {
    const rotate = 0; TimelineType[TimelineType["rotate"] = rotate] = "rotate"; const translate = rotate + 1; TimelineType[TimelineType["translate"] = translate] = "translate"; const scale = translate + 1; TimelineType[TimelineType["scale"] = scale] = "scale"; const shear = scale + 1; TimelineType[TimelineType["shear"] = shear] = "shear";
    const attachment = shear + 1; TimelineType[TimelineType["attachment"] = attachment] = "attachment"; const color = attachment + 1; TimelineType[TimelineType["color"] = color] = "color"; const deform = color + 1; TimelineType[TimelineType["deform"] = deform] = "deform";
    const event = deform + 1; TimelineType[TimelineType["event"] = event] = "event"; const drawOrder = event + 1; TimelineType[TimelineType["drawOrder"] = drawOrder] = "drawOrder";
    const ikConstraint = drawOrder + 1; TimelineType[TimelineType["ikConstraint"] = ikConstraint] = "ikConstraint"; const transformConstraint = ikConstraint + 1; TimelineType[TimelineType["transformConstraint"] = transformConstraint] = "transformConstraint";
    const pathConstraintPosition = transformConstraint + 1; TimelineType[TimelineType["pathConstraintPosition"] = pathConstraintPosition] = "pathConstraintPosition"; const pathConstraintSpacing = pathConstraintPosition + 1; TimelineType[TimelineType["pathConstraintSpacing"] = pathConstraintSpacing] = "pathConstraintSpacing"; const pathConstraintMix = pathConstraintSpacing + 1; TimelineType[TimelineType["pathConstraintMix"] = pathConstraintMix] = "pathConstraintMix";
    const twoColor = pathConstraintMix + 1; TimelineType[TimelineType["twoColor"] = twoColor] = "twoColor";
})(TimelineType || (TimelineType = {}));

/** The base class for timelines that use interpolation between key frame values. */
/**
 * @public
 */
class CurveTimeline  {
    static __initStatic() {this.LINEAR = 0;} static __initStatic2() {this.STEPPED = 1;} static __initStatic3() {this.BEZIER = 2;}
    static __initStatic4() {this.BEZIER_SIZE = 10 * 2 - 1;}

     // type, x, y, ...

    

    constructor (frameCount) {
        if (frameCount <= 0) throw new Error("frameCount must be > 0: " + frameCount);
        this.curves = Utils.newFloatArray((frameCount - 1) * CurveTimeline.BEZIER_SIZE);
    }

    /** The number of key frames for this timeline. */
    getFrameCount () {
        return this.curves.length / CurveTimeline.BEZIER_SIZE + 1;
    }

    /** Sets the specified key frame to linear interpolation. */
    setLinear (frameIndex) {
        this.curves[frameIndex * CurveTimeline.BEZIER_SIZE] = CurveTimeline.LINEAR;
    }

    /** Sets the specified key frame to stepped interpolation. */
    setStepped (frameIndex) {
        this.curves[frameIndex * CurveTimeline.BEZIER_SIZE] = CurveTimeline.STEPPED;
    }

    /** Returns the interpolation type for the specified key frame.
     * @returns Linear is 0, stepped is 1, Bezier is 2. */
    getCurveType (frameIndex) {
        let index = frameIndex * CurveTimeline.BEZIER_SIZE;
        if (index == this.curves.length) return CurveTimeline.LINEAR;
        let type = this.curves[index];
        if (type == CurveTimeline.LINEAR) return CurveTimeline.LINEAR;
        if (type == CurveTimeline.STEPPED) return CurveTimeline.STEPPED;
        return CurveTimeline.BEZIER;
    }

    /** Sets the specified key frame to Bezier interpolation. `cx1` and `cx2` are from 0 to 1,
     * representing the percent of time between the two key frames. `cy1` and `cy2` are the percent of the
     * difference between the key frame's values. */
    setCurve (frameIndex, cx1, cy1, cx2, cy2) {
        let tmpx = (-cx1 * 2 + cx2) * 0.03, tmpy = (-cy1 * 2 + cy2) * 0.03;
        let dddfx = ((cx1 - cx2) * 3 + 1) * 0.006, dddfy = ((cy1 - cy2) * 3 + 1) * 0.006;
        let ddfx = tmpx * 2 + dddfx, ddfy = tmpy * 2 + dddfy;
        let dfx = cx1 * 0.3 + tmpx + dddfx * 0.16666667, dfy = cy1 * 0.3 + tmpy + dddfy * 0.16666667;

        let i = frameIndex * CurveTimeline.BEZIER_SIZE;
        let curves = this.curves;
        curves[i++] = CurveTimeline.BEZIER;

        let x = dfx, y = dfy;
        for (let n = i + CurveTimeline.BEZIER_SIZE - 1; i < n; i += 2) {
            curves[i] = x;
            curves[i + 1] = y;
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            x += dfx;
            y += dfy;
        }
    }

    /** Returns the interpolated percentage for the specified key frame and linear percentage. */
    getCurvePercent (frameIndex, percent) {
        percent = MathUtils.clamp(percent, 0, 1);
        let curves = this.curves;
        let i = frameIndex * CurveTimeline.BEZIER_SIZE;
        let type = curves[i];
        if (type == CurveTimeline.LINEAR) return percent;
        if (type == CurveTimeline.STEPPED) return 0;
        i++;
        let x = 0;
        for (let start = i, n = i + CurveTimeline.BEZIER_SIZE - 1; i < n; i += 2) {
            x = curves[i];
            if (x >= percent) {
                let prevX, prevY;
                if (i == start) {
                    prevX = 0;
                    prevY = 0;
                } else {
                    prevX = curves[i - 2];
                    prevY = curves[i - 1];
                }
                return prevY + (curves[i + 1] - prevY) * (percent - prevX) / (x - prevX);
            }
        }
        let y = curves[i - 1];
        return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
    }

    
} CurveTimeline.__initStatic(); CurveTimeline.__initStatic2(); CurveTimeline.__initStatic3(); CurveTimeline.__initStatic4();

/** Changes a bone's local {@link Bone#rotation}. */
/**
 * @public
 */
class RotateTimeline extends CurveTimeline {
    static __initStatic5() {this.ENTRIES = 2;}
    static __initStatic6() {this.PREV_TIME = -2;} static __initStatic7() {this.PREV_ROTATION = -1;}
    static __initStatic8() {this.ROTATION = 1;}

    /** The index of the bone in {@link Skeleton#bones} that will be changed. */
    

    /** The time in seconds and rotation in degrees for each key frame. */
     // time, degrees, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount << 1);
    }

    getPropertyId () {
        return (TimelineType.rotate << 24) + this.boneIndex;
    }

    /** Sets the time and angle of the specified keyframe. */
    setFrame (frameIndex, time, degrees) {
        frameIndex <<= 1;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + RotateTimeline.ROTATION] = degrees;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.rotation = bone.data.rotation;
                    return;
                case MixBlend.first:
                    let r = bone.data.rotation - bone.rotation;
                    bone.rotation += (r - (16384 - ((16384.499999999996 - r / 360) | 0)) * 360) * alpha;
            }
            return;
        }

        if (time >= frames[frames.length - RotateTimeline.ENTRIES]) { // Time is after last frame.
            let r = frames[frames.length + RotateTimeline.PREV_ROTATION];
            switch (blend) {
                case MixBlend.setup:
                    bone.rotation = bone.data.rotation + r * alpha;
                    break;
                case MixBlend.first:
                case MixBlend.replace:
                    r += bone.data.rotation - bone.rotation;
                    r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360; // Wrap within -180 and 180.
                case MixBlend.add:
                    bone.rotation += r * alpha;
            }
            return;
        }

        // Interpolate between the previous frame and the current frame.
        let frame = Animation.binarySearch(frames, time, RotateTimeline.ENTRIES);
        let prevRotation = frames[frame + RotateTimeline.PREV_ROTATION];
        let frameTime = frames[frame];
        let percent = this.getCurvePercent((frame >> 1) - 1,
            1 - (time - frameTime) / (frames[frame + RotateTimeline.PREV_TIME] - frameTime));

        let r = frames[frame + RotateTimeline.ROTATION] - prevRotation;
        r = prevRotation + (r - (16384 - ((16384.499999999996 - r / 360) | 0)) * 360) * percent;
        switch (blend) {
            case MixBlend.setup:
                bone.rotation = bone.data.rotation + (r - (16384 - ((16384.499999999996 - r / 360) | 0)) * 360) * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                r += bone.data.rotation - bone.rotation;
            case MixBlend.add:
                bone.rotation += (r - (16384 - ((16384.499999999996 - r / 360) | 0)) * 360) * alpha;
        }
    }
} RotateTimeline.__initStatic5(); RotateTimeline.__initStatic6(); RotateTimeline.__initStatic7(); RotateTimeline.__initStatic8();

/** Changes a bone's local {@link Bone#x} and {@link Bone#y}. */
/**
 * @public
 */
class TranslateTimeline extends CurveTimeline {
    static __initStatic9() {this.ENTRIES = 3;}
    static __initStatic10() {this.PREV_TIME = -3;} static __initStatic11() {this.PREV_X = -2;} static __initStatic12() {this.PREV_Y = -1;}
    static __initStatic13() {this.X = 1;} static __initStatic14() {this.Y = 2;}

    /** The index of the bone in {@link Skeleton#bones} that will be changed. */
    

    /** The time in seconds, x, and y values for each key frame. */
     // time, x, y, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount * TranslateTimeline.ENTRIES);
    }

    getPropertyId () {
        return (TimelineType.translate << 24) + this.boneIndex;
    }

    /** Sets the time in seconds, x, and y values for the specified key frame. */
    setFrame (frameIndex, time, x, y) {
        frameIndex *= TranslateTimeline.ENTRIES;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + TranslateTimeline.X] = x;
        this.frames[frameIndex + TranslateTimeline.Y] = y;
    }

        apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.x = bone.data.x;
                    bone.y = bone.data.y;
                    return;
                case MixBlend.first:
                    bone.x += (bone.data.x - bone.x) * alpha;
                    bone.y += (bone.data.y - bone.y) * alpha;
            }
            return;
        }

        let x = 0, y = 0;
        if (time >= frames[frames.length - TranslateTimeline.ENTRIES]) { // Time is after last frame.
            x = frames[frames.length + TranslateTimeline.PREV_X];
            y = frames[frames.length + TranslateTimeline.PREV_Y];
        } else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, TranslateTimeline.ENTRIES);
            x = frames[frame + TranslateTimeline.PREV_X];
            y = frames[frame + TranslateTimeline.PREV_Y];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / TranslateTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + TranslateTimeline.PREV_TIME] - frameTime));

            x += (frames[frame + TranslateTimeline.X] - x) * percent;
            y += (frames[frame + TranslateTimeline.Y] - y) * percent;
        }
        switch (blend) {
            case MixBlend.setup:
                bone.x = bone.data.x + x * alpha;
                bone.y = bone.data.y + y * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                bone.x += (bone.data.x + x - bone.x) * alpha;
                bone.y += (bone.data.y + y - bone.y) * alpha;
                break;
            case MixBlend.add:
                bone.x += x * alpha;
                bone.y += y * alpha;
        }
    }
} TranslateTimeline.__initStatic9(); TranslateTimeline.__initStatic10(); TranslateTimeline.__initStatic11(); TranslateTimeline.__initStatic12(); TranslateTimeline.__initStatic13(); TranslateTimeline.__initStatic14();

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}. */
/**
 * @public
 */
class ScaleTimeline extends TranslateTimeline {
    constructor (frameCount) {
        super(frameCount);
    }

    getPropertyId () {
        return (TimelineType.scale << 24) + this.boneIndex;
    }

        apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.scaleX = bone.data.scaleX;
                    bone.scaleY = bone.data.scaleY;
                    return;
                case MixBlend.first:
                    bone.scaleX += (bone.data.scaleX - bone.scaleX) * alpha;
                    bone.scaleY += (bone.data.scaleY - bone.scaleY) * alpha;
            }
            return;
        }

        let x = 0, y = 0;
        if (time >= frames[frames.length - ScaleTimeline.ENTRIES]) { // Time is after last frame.
            x = frames[frames.length + ScaleTimeline.PREV_X] * bone.data.scaleX;
            y = frames[frames.length + ScaleTimeline.PREV_Y] * bone.data.scaleY;
        } else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, ScaleTimeline.ENTRIES);
            x = frames[frame + ScaleTimeline.PREV_X];
            y = frames[frame + ScaleTimeline.PREV_Y];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / ScaleTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + ScaleTimeline.PREV_TIME] - frameTime));

            x = (x + (frames[frame + ScaleTimeline.X] - x) * percent) * bone.data.scaleX;
            y = (y + (frames[frame + ScaleTimeline.Y] - y) * percent) * bone.data.scaleY;
        }
        if (alpha == 1) {
            if (blend == MixBlend.add) {
                bone.scaleX += x - bone.data.scaleX;
                bone.scaleY += y - bone.data.scaleY;
            } else {
                bone.scaleX = x;
                bone.scaleY = y;
            }
        } else {
            let bx = 0, by = 0;
            if (direction == MixDirection.mixOut) {
                switch (blend) {
                    case MixBlend.setup:
                        bx = bone.data.scaleX;
                        by = bone.data.scaleY;
                        bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                        bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                        break;
                    case MixBlend.first:
                    case MixBlend.replace:
                        bx = bone.scaleX;
                        by = bone.scaleY;
                        bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                        bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                        break;
                    case MixBlend.add:
                        bx = bone.scaleX;
                        by = bone.scaleY;
                        bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bone.data.scaleX) * alpha;
                        bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - bone.data.scaleY) * alpha;
                }
            } else {
                switch (blend) {
                    case MixBlend.setup:
                        bx = Math.abs(bone.data.scaleX) * MathUtils.signum(x);
                        by = Math.abs(bone.data.scaleY) * MathUtils.signum(y);
                        bone.scaleX = bx + (x - bx) * alpha;
                        bone.scaleY = by + (y - by) * alpha;
                        break;
                    case MixBlend.first:
                    case MixBlend.replace:
                        bx = Math.abs(bone.scaleX) * MathUtils.signum(x);
                        by = Math.abs(bone.scaleY) * MathUtils.signum(y);
                        bone.scaleX = bx + (x - bx) * alpha;
                        bone.scaleY = by + (y - by) * alpha;
                        break;
                    case MixBlend.add:
                        bx = MathUtils.signum(x);
                        by = MathUtils.signum(y);
                        bone.scaleX = Math.abs(bone.scaleX) * bx + (x - Math.abs(bone.data.scaleX) * bx) * alpha;
                        bone.scaleY = Math.abs(bone.scaleY) * by + (y - Math.abs(bone.data.scaleY) * by) * alpha;
                }
            }
        }
    }
}

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}. */
/**
 * @public
 */
class ShearTimeline extends TranslateTimeline {
    constructor (frameCount) {
        super(frameCount);
    }

    getPropertyId () {
        return (TimelineType.shear << 24) + this.boneIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.shearX = bone.data.shearX;
                    bone.shearY = bone.data.shearY;
                    return;
                case MixBlend.first:
                    bone.shearX += (bone.data.shearX - bone.shearX) * alpha;
                    bone.shearY += (bone.data.shearY - bone.shearY) * alpha;
            }
            return;
        }

        let x = 0, y = 0;
        if (time >= frames[frames.length - ShearTimeline.ENTRIES]) { // Time is after last frame.
            x = frames[frames.length + ShearTimeline.PREV_X];
            y = frames[frames.length + ShearTimeline.PREV_Y];
        } else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, ShearTimeline.ENTRIES);
            x = frames[frame + ShearTimeline.PREV_X];
            y = frames[frame + ShearTimeline.PREV_Y];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / ShearTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + ShearTimeline.PREV_TIME] - frameTime));

            x = x + (frames[frame + ShearTimeline.X] - x) * percent;
            y = y + (frames[frame + ShearTimeline.Y] - y) * percent;
        }
        switch (blend) {
            case MixBlend.setup:
                bone.shearX = bone.data.shearX + x * alpha;
                bone.shearY = bone.data.shearY + y * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                bone.shearX += (bone.data.shearX + x - bone.shearX) * alpha;
                bone.shearY += (bone.data.shearY + y - bone.shearY) * alpha;
                break;
            case MixBlend.add:
                bone.shearX += x * alpha;
                bone.shearY += y * alpha;
        }
    }
}

/** Changes a slot's {@link Slot#color}. */
/**
 * @public
 */
class ColorTimeline extends CurveTimeline {
    static __initStatic15() {this.ENTRIES = 5;}
    static __initStatic16() {this.PREV_TIME = -5;} static __initStatic17() {this.PREV_R = -4;} static __initStatic18() {this.PREV_G = -3;} static __initStatic19() {this.PREV_B = -2;} static __initStatic20() {this.PREV_A = -1;}
    static __initStatic21() {this.R = 1;} static __initStatic22() {this.G = 2;} static __initStatic23() {this.B = 3;} static __initStatic24() {this.A = 4;}

    /** The index of the slot in {@link Skeleton#slots} that will be changed. */
    

    /** The time in seconds, red, green, blue, and alpha values for each key frame. */
     // time, r, g, b, a, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount * ColorTimeline.ENTRIES);
    }

    getPropertyId () {
        return (TimelineType.color << 24) + this.slotIndex;
    }

    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame (frameIndex, time, r, g, b, a) {
        frameIndex *= ColorTimeline.ENTRIES;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + ColorTimeline.R] = r;
        this.frames[frameIndex + ColorTimeline.G] = g;
        this.frames[frameIndex + ColorTimeline.B] = b;
        this.frames[frameIndex + ColorTimeline.A] = a;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;
        let frames = this.frames;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    slot.color.setFromColor(slot.data.color);
                    return;
                case MixBlend.first:
                    let color = slot.color, setup = slot.data.color;
                    color.add((setup.r - color.r) * alpha, (setup.g - color.g) * alpha, (setup.b - color.b) * alpha,
                        (setup.a - color.a) * alpha);
            }
            return;
        }

        let r = 0, g = 0, b = 0, a = 0;
        if (time >= frames[frames.length - ColorTimeline.ENTRIES]) { // Time is after last frame.
            let i = frames.length;
            r = frames[i + ColorTimeline.PREV_R];
            g = frames[i + ColorTimeline.PREV_G];
            b = frames[i + ColorTimeline.PREV_B];
            a = frames[i + ColorTimeline.PREV_A];
        } else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, ColorTimeline.ENTRIES);
            r = frames[frame + ColorTimeline.PREV_R];
            g = frames[frame + ColorTimeline.PREV_G];
            b = frames[frame + ColorTimeline.PREV_B];
            a = frames[frame + ColorTimeline.PREV_A];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / ColorTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + ColorTimeline.PREV_TIME] - frameTime));

            r += (frames[frame + ColorTimeline.R] - r) * percent;
            g += (frames[frame + ColorTimeline.G] - g) * percent;
            b += (frames[frame + ColorTimeline.B] - b) * percent;
            a += (frames[frame + ColorTimeline.A] - a) * percent;
        }
        if (alpha == 1)
            slot.color.set(r, g, b, a);
        else {
            let color = slot.color;
            if (blend == MixBlend.setup) color.setFromColor(slot.data.color);
            color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha, (a - color.a) * alpha);
        }
    }
} ColorTimeline.__initStatic15(); ColorTimeline.__initStatic16(); ColorTimeline.__initStatic17(); ColorTimeline.__initStatic18(); ColorTimeline.__initStatic19(); ColorTimeline.__initStatic20(); ColorTimeline.__initStatic21(); ColorTimeline.__initStatic22(); ColorTimeline.__initStatic23(); ColorTimeline.__initStatic24();

/** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting. */
/**
 * @public
 */
class TwoColorTimeline extends CurveTimeline {
    static __initStatic25() {this.ENTRIES = 8;}
    static __initStatic26() {this.PREV_TIME = -8;} static __initStatic27() {this.PREV_R = -7;} static __initStatic28() {this.PREV_G = -6;} static __initStatic29() {this.PREV_B = -5;} static __initStatic30() {this.PREV_A = -4;}
    static __initStatic31() {this.PREV_R2 = -3;} static __initStatic32() {this.PREV_G2 = -2;} static __initStatic33() {this.PREV_B2 = -1;}
    static __initStatic34() {this.R = 1;} static __initStatic35() {this.G = 2;} static __initStatic36() {this.B = 3;} static __initStatic37() {this.A = 4;} static __initStatic38() {this.R2 = 5;} static __initStatic39() {this.G2 = 6;} static __initStatic40() {this.B2 = 7;}

    /** The index of the slot in {@link Skeleton#slots()} that will be changed. The {@link Slot#darkColor()} must not be
     * null. */
    

    /** The time in seconds, red, green, blue, and alpha values of the color, red, green, blue of the dark color, for each key frame. */
     // time, r, g, b, a, r2, g2, b2, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount * TwoColorTimeline.ENTRIES);
    }

    getPropertyId () {
        return (TimelineType.twoColor << 24) + this.slotIndex;
    }

    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame (frameIndex, time, r, g, b, a, r2, g2, b2) {
        frameIndex *= TwoColorTimeline.ENTRIES;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + TwoColorTimeline.R] = r;
        this.frames[frameIndex + TwoColorTimeline.G] = g;
        this.frames[frameIndex + TwoColorTimeline.B] = b;
        this.frames[frameIndex + TwoColorTimeline.A] = a;
        this.frames[frameIndex + TwoColorTimeline.R2] = r2;
        this.frames[frameIndex + TwoColorTimeline.G2] = g2;
        this.frames[frameIndex + TwoColorTimeline.B2] = b2;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;
        let frames = this.frames;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    slot.color.setFromColor(slot.data.color);
                    slot.darkColor.setFromColor(slot.data.darkColor);
                    return;
                case MixBlend.first:
                    let light = slot.color, dark = slot.darkColor, setupLight = slot.data.color, setupDark = slot.data.darkColor;
                    light.add((setupLight.r - light.r) * alpha, (setupLight.g - light.g) * alpha, (setupLight.b - light.b) * alpha,
                        (setupLight.a - light.a) * alpha);
                    dark.add((setupDark.r - dark.r) * alpha, (setupDark.g - dark.g) * alpha, (setupDark.b - dark.b) * alpha, 0);
            }
            return;
        }

        let r = 0, g = 0, b = 0, a = 0, r2 = 0, g2 = 0, b2 = 0;
        if (time >= frames[frames.length - TwoColorTimeline.ENTRIES]) { // Time is after last frame.
            let i = frames.length;
            r = frames[i + TwoColorTimeline.PREV_R];
            g = frames[i + TwoColorTimeline.PREV_G];
            b = frames[i + TwoColorTimeline.PREV_B];
            a = frames[i + TwoColorTimeline.PREV_A];
            r2 = frames[i + TwoColorTimeline.PREV_R2];
            g2 = frames[i + TwoColorTimeline.PREV_G2];
            b2 = frames[i + TwoColorTimeline.PREV_B2];
        } else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, TwoColorTimeline.ENTRIES);
            r = frames[frame + TwoColorTimeline.PREV_R];
            g = frames[frame + TwoColorTimeline.PREV_G];
            b = frames[frame + TwoColorTimeline.PREV_B];
            a = frames[frame + TwoColorTimeline.PREV_A];
            r2 = frames[frame + TwoColorTimeline.PREV_R2];
            g2 = frames[frame + TwoColorTimeline.PREV_G2];
            b2 = frames[frame + TwoColorTimeline.PREV_B2];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / TwoColorTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + TwoColorTimeline.PREV_TIME] - frameTime));

            r += (frames[frame + TwoColorTimeline.R] - r) * percent;
            g += (frames[frame + TwoColorTimeline.G] - g) * percent;
            b += (frames[frame + TwoColorTimeline.B] - b) * percent;
            a += (frames[frame + TwoColorTimeline.A] - a) * percent;
            r2 += (frames[frame + TwoColorTimeline.R2] - r2) * percent;
            g2 += (frames[frame + TwoColorTimeline.G2] - g2) * percent;
            b2 += (frames[frame + TwoColorTimeline.B2] - b2) * percent;
        }
        if (alpha == 1) {
            slot.color.set(r, g, b, a);
            slot.darkColor.set(r2, g2, b2, 1);
        } else {
            let light = slot.color, dark = slot.darkColor;
            if (blend == MixBlend.setup) {
                light.setFromColor(slot.data.color);
                dark.setFromColor(slot.data.darkColor);
            }
            light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha, (a - light.a) * alpha);
            dark.add((r2 - dark.r) * alpha, (g2 - dark.g) * alpha, (b2 - dark.b) * alpha, 0);
        }
    }
} TwoColorTimeline.__initStatic25(); TwoColorTimeline.__initStatic26(); TwoColorTimeline.__initStatic27(); TwoColorTimeline.__initStatic28(); TwoColorTimeline.__initStatic29(); TwoColorTimeline.__initStatic30(); TwoColorTimeline.__initStatic31(); TwoColorTimeline.__initStatic32(); TwoColorTimeline.__initStatic33(); TwoColorTimeline.__initStatic34(); TwoColorTimeline.__initStatic35(); TwoColorTimeline.__initStatic36(); TwoColorTimeline.__initStatic37(); TwoColorTimeline.__initStatic38(); TwoColorTimeline.__initStatic39(); TwoColorTimeline.__initStatic40();

/** Changes a slot's {@link Slot#attachment}. */
/**
 * @public
 */
class AttachmentTimeline  {
    /** The index of the slot in {@link Skeleton#slots} that will be changed. */
    

    /** The time in seconds for each key frame. */
     // time, ...

    /** The attachment name for each key frame. May contain null values to clear the attachment. */
    

    constructor (frameCount) {
        this.frames = Utils.newFloatArray(frameCount);
        this.attachmentNames = new Array(frameCount);
    }

    getPropertyId () {
        return (TimelineType.attachment << 24) + this.slotIndex;
    }

    /** The number of key frames for this timeline. */
    getFrameCount () {
        return this.frames.length;
    }

    /** Sets the time in seconds and the attachment name for the specified key frame. */
    setFrame (frameIndex, time, attachmentName) {
        this.frames[frameIndex] = time;
        this.attachmentNames[frameIndex] = attachmentName;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;
        if (direction == MixDirection.mixOut) {
            if (blend == MixBlend.setup)
                this.setAttachment(skeleton, slot, slot.data.attachmentName);
            return;
        }

        let frames = this.frames;
        if (time < frames[0]) {
            if (blend == MixBlend.setup || blend == MixBlend.first) this.setAttachment(skeleton, slot, slot.data.attachmentName);
            return;
        }

        let frameIndex = 0;
        if (time >= frames[frames.length - 1]) // Time is after last frame.
            frameIndex = frames.length - 1;
        else
            frameIndex = Animation.binarySearch(frames, time, 1) - 1;

        let attachmentName = this.attachmentNames[frameIndex];
        skeleton.slots[this.slotIndex]
            .setAttachment(attachmentName == null ? null : skeleton.getAttachment(this.slotIndex, attachmentName));
    }

    setAttachment(skeleton, slot, attachmentName) {
        slot.setAttachment(attachmentName == null ? null : skeleton.getAttachment(this.slotIndex, attachmentName));
    }
}

let zeros  = null;

/** Changes a slot's {@link Slot#deform} to deform a {@link VertexAttachment}. */
/**
 * @public
 */
class DeformTimeline extends CurveTimeline {
    /** The index of the slot in {@link Skeleton#getSlots()} that will be changed. */
    

    /** The attachment that will be deformed. */
    

    /** The time in seconds for each key frame. */
     // time, ...

    /** The vertices for each key frame. */
    

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount);
        this.frameVertices = new Array(frameCount);
        if (zeros == null) zeros = Utils.newFloatArray(64);
    }

    getPropertyId () {
        return (TimelineType.deform << 27) + + this.attachment.id + this.slotIndex;
    }

    /** Sets the time in seconds and the vertices for the specified key frame.
     * @param vertices Vertex positions for an unweighted VertexAttachment, or deform offsets if it has weights. */
    setFrame (frameIndex, time, vertices) {
        this.frames[frameIndex] = time;
        this.frameVertices[frameIndex] = vertices;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;
        let slotAttachment = slot.getAttachment();
        if (!(slotAttachment instanceof VertexAttachment) || !((slotAttachment).deformAttachment == this.attachment)) return;

        let deformArray = slot.deform;
        if (deformArray.length == 0) blend = MixBlend.setup;

        let frameVertices = this.frameVertices;
        let vertexCount = frameVertices[0].length;

        let frames = this.frames;
        if (time < frames[0]) {
            let vertexAttachment = slotAttachment;
            switch (blend) {
                case MixBlend.setup:
                    deformArray.length = 0;
                    return;
                case MixBlend.first:
                    if (alpha == 1) {
                        deformArray.length = 0;
                        break;
                    }
                    let deform = Utils.setArraySize(deformArray, vertexCount);
                    if (vertexAttachment.bones == null) {
                        // Unweighted vertex positions.
                        let setupVertices = vertexAttachment.vertices;
                        for (var i = 0; i < vertexCount; i++)
                            deform[i] += (setupVertices[i] - deform[i]) * alpha;
                    } else {
                        // Weighted deform offsets.
                        alpha = 1 - alpha;
                        for (var i = 0; i < vertexCount; i++)
                            deform[i] *= alpha;
                    }
            }
            return;
        }

        let deform = Utils.setArraySize(deformArray, vertexCount);
        if (time >= frames[frames.length - 1]) { // Time is after last frame.
            let lastVertices = frameVertices[frames.length - 1];
            if (alpha == 1) {
                if (blend == MixBlend.add) {
                    let vertexAttachment = slotAttachment ;
                    if (vertexAttachment.bones == null) {
                        // Unweighted vertex positions, with alpha.
                        let setupVertices = vertexAttachment.vertices;
                        for (let i = 0; i < vertexCount; i++) {
                            deform[i] += lastVertices[i] - setupVertices[i];
                        }
                    } else {
                        // Weighted deform offsets, with alpha.
                        for (let i = 0; i < vertexCount; i++)
                            deform[i] += lastVertices[i];
                    }
                } else {
                    Utils.arrayCopy(lastVertices, 0, deform, 0, vertexCount);
                }
            } else {
                switch (blend) {
                    case MixBlend.setup: {
                        let vertexAttachment = slotAttachment ;
                        if (vertexAttachment.bones == null) {
                            // Unweighted vertex positions, with alpha.
                            let setupVertices = vertexAttachment.vertices;
                            for (let i = 0; i < vertexCount; i++) {
                                let setup = setupVertices[i];
                                deform[i] = setup + (lastVertices[i] - setup) * alpha;
                            }
                        } else {
                            // Weighted deform offsets, with alpha.
                            for (let i = 0; i < vertexCount; i++)
                                deform[i] = lastVertices[i] * alpha;
                        }
                        break;
                    }
                    case MixBlend.first:
                    case MixBlend.replace:
                        for (let i = 0; i < vertexCount; i++)
                            deform[i] += (lastVertices[i] - deform[i]) * alpha;
                        break;
                    case MixBlend.add:
                        let vertexAttachment = slotAttachment ;
                        if (vertexAttachment.bones == null) {
                            // Unweighted vertex positions, with alpha.
                            let setupVertices = vertexAttachment.vertices;
                            for (let i = 0; i < vertexCount; i++) {
                                deform[i] += (lastVertices[i] - setupVertices[i]) * alpha;
                            }
                        } else {
                            // Weighted deform offsets, with alpha.
                            for (let i = 0; i < vertexCount; i++)
                                deform[i] += lastVertices[i] * alpha;
                        }
                }
            }
            return;
        }

        // Interpolate between the previous frame and the current frame.
        let frame = Animation.binarySearch(frames, time);
        let prevVertices = frameVertices[frame - 1];
        let nextVertices = frameVertices[frame];
        let frameTime = frames[frame];
        let percent = this.getCurvePercent(frame - 1, 1 - (time - frameTime) / (frames[frame - 1] - frameTime));

        if (alpha == 1) {
            if (blend == MixBlend.add) {
                let vertexAttachment = slotAttachment ;
                if (vertexAttachment.bones == null) {
                    // Unweighted vertex positions, with alpha.
                    let setupVertices = vertexAttachment.vertices;
                    for (let i = 0; i < vertexCount; i++) {
                        let prev = prevVertices[i];
                        deform[i] += prev + (nextVertices[i] - prev) * percent - setupVertices[i];
                    }
                } else {
                    // Weighted deform offsets, with alpha.
                    for (let i = 0; i < vertexCount; i++) {
                        let prev = prevVertices[i];
                        deform[i] += prev + (nextVertices[i] - prev) * percent;
                    }
                }
            } else {
                for (let i = 0; i < vertexCount; i++) {
                    let prev = prevVertices[i];
                    deform[i] = prev + (nextVertices[i] - prev) * percent;
                }
            }
        } else {
            switch (blend) {
                case MixBlend.setup: {
                    let vertexAttachment = slotAttachment ;
                    if (vertexAttachment.bones == null) {
                        // Unweighted vertex positions, with alpha.
                        let setupVertices = vertexAttachment.vertices;
                        for (let i = 0; i < vertexCount; i++) {
                            let prev = prevVertices[i], setup = setupVertices[i];
                            deform[i] = setup + (prev + (nextVertices[i] - prev) * percent - setup) * alpha;
                        }
                    } else {
                        // Weighted deform offsets, with alpha.
                        for (let i = 0; i < vertexCount; i++) {
                            let prev = prevVertices[i];
                            deform[i] = (prev + (nextVertices[i] - prev) * percent) * alpha;
                        }
                    }
                    break;
                }
                case MixBlend.first:
                case MixBlend.replace:
                    for (let i = 0; i < vertexCount; i++) {
                        let prev = prevVertices[i];
                        deform[i] += (prev + (nextVertices[i] - prev) * percent - deform[i]) * alpha;
                    }
                    break;
                case MixBlend.add:
                    let vertexAttachment = slotAttachment ;
                    if (vertexAttachment.bones == null) {
                        // Unweighted vertex positions, with alpha.
                        let setupVertices = vertexAttachment.vertices;
                        for (let i = 0; i < vertexCount; i++) {
                            let prev = prevVertices[i];
                            deform[i] += (prev + (nextVertices[i] - prev) * percent - setupVertices[i]) * alpha;
                        }
                    } else {
                        // Weighted deform offsets, with alpha.
                        for (let i = 0; i < vertexCount; i++) {
                            let prev = prevVertices[i];
                            deform[i] += (prev + (nextVertices[i] - prev) * percent) * alpha;
                        }
                    }
            }
        }
    }
}

/** Fires an {@link Event} when specific animation times are reached. */
/**
 * @public
 */
class EventTimeline  {
    /** The time in seconds for each key frame. */
     // time, ...

    /** The event for each key frame. */
    

    constructor (frameCount) {
        this.frames = Utils.newFloatArray(frameCount);
        this.events = new Array(frameCount);
    }

    getPropertyId () {
        return TimelineType.event << 24;
    }

    /** The number of key frames for this timeline. */
    getFrameCount () {
        return this.frames.length;
    }

    /** Sets the time in seconds and the event for the specified key frame. */
    setFrame (frameIndex, event) {
        this.frames[frameIndex] = event.time;
        this.events[frameIndex] = event;
    }

    /** Fires events for frames > `lastTime` and <= `time`. */
    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        if (firedEvents == null) return;
        let frames = this.frames;
        let frameCount = this.frames.length;

        if (lastTime > time) { // Fire events after last time for looped animations.
            this.apply(skeleton, lastTime, Number.MAX_VALUE, firedEvents, alpha, blend, direction);
            lastTime = -1;
        } else if (lastTime >= frames[frameCount - 1]) // Last time is after last frame.
            return;
        if (time < frames[0]) return; // Time is before first frame.

        let frame = 0;
        if (lastTime < frames[0])
            frame = 0;
        else {
            frame = Animation.binarySearch(frames, lastTime);
            let frameTime = frames[frame];
            while (frame > 0) { // Fire multiple events with the same frame.
                if (frames[frame - 1] != frameTime) break;
                frame--;
            }
        }
        for (; frame < frameCount && time >= frames[frame]; frame++)
            firedEvents.push(this.events[frame]);
    }
}

/** Changes a skeleton's {@link Skeleton#drawOrder}. */
/**
 * @public
 */
class DrawOrderTimeline  {
    /** The time in seconds for each key frame. */
     // time, ...

    /** The draw order for each key frame. See {@link #setFrame(int, float, int[])}. */
    

    constructor (frameCount) {
        this.frames = Utils.newFloatArray(frameCount);
        this.drawOrders = new Array(frameCount);
    }

    getPropertyId () {
        return TimelineType.drawOrder << 24;
    }

    /** The number of key frames for this timeline. */
    getFrameCount () {
        return this.frames.length;
    }

    /** Sets the time in seconds and the draw order for the specified key frame.
     * @param drawOrder For each slot in {@link Skeleton#slots}, the index of the new draw order. May be null to use setup pose
     *           draw order. */
    setFrame (frameIndex, time, drawOrder) {
        this.frames[frameIndex] = time;
        this.drawOrders[frameIndex] = drawOrder;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let drawOrder = skeleton.drawOrder;
        let slots = skeleton.slots;
        if (direction == MixDirection.mixOut && blend == MixBlend.setup) {
            Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
            return;
        }

        let frames = this.frames;
        if (time < frames[0]) {
            if (blend == MixBlend.setup || blend == MixBlend.first) Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
            return;
        }

        let frame = 0;
        if (time >= frames[frames.length - 1]) // Time is after last frame.
            frame = frames.length - 1;
        else
            frame = Animation.binarySearch(frames, time) - 1;

        let drawOrderToSetupIndex = this.drawOrders[frame];
        if (drawOrderToSetupIndex == null)
            Utils.arrayCopy(slots, 0, drawOrder, 0, slots.length);
        else {
            for (let i = 0, n = drawOrderToSetupIndex.length; i < n; i++)
                drawOrder[i] = slots[drawOrderToSetupIndex[i]];
        }
    }
}

/** Changes an IK constraint's {@link IkConstraint#mix}, {@link IkConstraint#softness},
 * {@link IkConstraint#bendDirection}, {@link IkConstraint#stretch}, and {@link IkConstraint#compress}. */
/**
 * @public
 */
class IkConstraintTimeline extends CurveTimeline {
    static __initStatic41() {this.ENTRIES = 6;}
    static __initStatic42() {this.PREV_TIME = -6;} static __initStatic43() {this.PREV_MIX = -5;} static __initStatic44() {this.PREV_SOFTNESS = -4;} static __initStatic45() {this.PREV_BEND_DIRECTION = -3;} static __initStatic46() {this.PREV_COMPRESS = -2;} static __initStatic47() {this.PREV_STRETCH = -1;}
    static __initStatic48() {this.MIX = 1;} static __initStatic49() {this.SOFTNESS = 2;} static __initStatic50() {this.BEND_DIRECTION = 3;} static __initStatic51() {this.COMPRESS = 4;} static __initStatic52() {this.STRETCH = 5;}

    /** The index of the IK constraint slot in {@link Skeleton#ikConstraints} that will be changed. */
    

    /** The time in seconds, mix, softness, bend direction, compress, and stretch for each key frame. */
     // time, mix, softness, bendDirection, compress, stretch, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount * IkConstraintTimeline.ENTRIES);
    }

    getPropertyId () {
        return (TimelineType.ikConstraint << 24) + this.ikConstraintIndex;
    }

    /** Sets the time in seconds, mix, softness, bend direction, compress, and stretch for the specified key frame. */
    setFrame (frameIndex, time, mix, softness, bendDirection, compress, stretch) {
        frameIndex *= IkConstraintTimeline.ENTRIES;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + IkConstraintTimeline.MIX] = mix;
        this.frames[frameIndex + IkConstraintTimeline.SOFTNESS] = softness;
        this.frames[frameIndex + IkConstraintTimeline.BEND_DIRECTION] = bendDirection;
        this.frames[frameIndex + IkConstraintTimeline.COMPRESS] = compress ? 1 : 0;
        this.frames[frameIndex + IkConstraintTimeline.STRETCH] = stretch ? 1 : 0;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let frames = this.frames;
        let constraint = skeleton.ikConstraints[this.ikConstraintIndex];
        if (!constraint.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    constraint.mix = constraint.data.mix;
                    constraint.softness = constraint.data.softness;
                    constraint.bendDirection = constraint.data.bendDirection;
                    constraint.compress = constraint.data.compress;
                    constraint.stretch = constraint.data.stretch;
                    return;
                case MixBlend.first:
                    constraint.mix += (constraint.data.mix - constraint.mix) * alpha;
                    constraint.softness += (constraint.data.softness - constraint.softness) * alpha;
                    constraint.bendDirection = constraint.data.bendDirection;
                    constraint.compress = constraint.data.compress;
                    constraint.stretch = constraint.data.stretch;
            }
            return;
        }

        if (time >= frames[frames.length - IkConstraintTimeline.ENTRIES]) { // Time is after last frame.
            if (blend == MixBlend.setup) {
                constraint.mix = constraint.data.mix + (frames[frames.length + IkConstraintTimeline.PREV_MIX] - constraint.data.mix) * alpha;
                constraint.softness = constraint.data.softness
                    + (frames[frames.length + IkConstraintTimeline.PREV_SOFTNESS] - constraint.data.softness) * alpha;
                if (direction == MixDirection.mixOut) {
                    constraint.bendDirection = constraint.data.bendDirection;
                    constraint.compress = constraint.data.compress;
                    constraint.stretch = constraint.data.stretch;
                } else {
                    constraint.bendDirection = frames[frames.length + IkConstraintTimeline.PREV_BEND_DIRECTION];
                    constraint.compress = frames[frames.length + IkConstraintTimeline.PREV_COMPRESS] != 0;
                    constraint.stretch = frames[frames.length + IkConstraintTimeline.PREV_STRETCH] != 0;
                }
            } else {
                constraint.mix += (frames[frames.length + IkConstraintTimeline.PREV_MIX] - constraint.mix) * alpha;
                constraint.softness += (frames[frames.length + IkConstraintTimeline.PREV_SOFTNESS] - constraint.softness) * alpha;
                if (direction == MixDirection.mixIn) {
                    constraint.bendDirection = frames[frames.length + IkConstraintTimeline.PREV_BEND_DIRECTION];
                    constraint.compress = frames[frames.length + IkConstraintTimeline.PREV_COMPRESS] != 0;
                    constraint.stretch = frames[frames.length + IkConstraintTimeline.PREV_STRETCH] != 0;
                }
            }
            return;
        }

        // Interpolate between the previous frame and the current frame.
        let frame = Animation.binarySearch(frames, time, IkConstraintTimeline.ENTRIES);
        let mix = frames[frame + IkConstraintTimeline.PREV_MIX];
        let softness = frames[frame + IkConstraintTimeline.PREV_SOFTNESS];
        let frameTime = frames[frame];
        let percent = this.getCurvePercent(frame / IkConstraintTimeline.ENTRIES - 1,
            1 - (time - frameTime) / (frames[frame + IkConstraintTimeline.PREV_TIME] - frameTime));

        if (blend == MixBlend.setup) {
            constraint.mix = constraint.data.mix + (mix + (frames[frame + IkConstraintTimeline.MIX] - mix) * percent - constraint.data.mix) * alpha;
            constraint.softness = constraint.data.softness
                + (softness + (frames[frame + IkConstraintTimeline.SOFTNESS] - softness) * percent - constraint.data.softness) * alpha;
            if (direction == MixDirection.mixOut) {
                constraint.bendDirection = constraint.data.bendDirection;
                constraint.compress = constraint.data.compress;
                constraint.stretch = constraint.data.stretch;
            } else {
                constraint.bendDirection = frames[frame + IkConstraintTimeline.PREV_BEND_DIRECTION];
                constraint.compress = frames[frame + IkConstraintTimeline.PREV_COMPRESS] != 0;
                constraint.stretch = frames[frame + IkConstraintTimeline.PREV_STRETCH] != 0;
            }
        } else {
            constraint.mix += (mix + (frames[frame + IkConstraintTimeline.MIX] - mix) * percent - constraint.mix) * alpha;
            constraint.softness += (softness + (frames[frame + IkConstraintTimeline.SOFTNESS] - softness) * percent - constraint.softness) * alpha;
            if (direction == MixDirection.mixIn) {
                constraint.bendDirection = frames[frame + IkConstraintTimeline.PREV_BEND_DIRECTION];
                constraint.compress = frames[frame + IkConstraintTimeline.PREV_COMPRESS] != 0;
                constraint.stretch = frames[frame + IkConstraintTimeline.PREV_STRETCH] != 0;
            }
        }
    }
} IkConstraintTimeline.__initStatic41(); IkConstraintTimeline.__initStatic42(); IkConstraintTimeline.__initStatic43(); IkConstraintTimeline.__initStatic44(); IkConstraintTimeline.__initStatic45(); IkConstraintTimeline.__initStatic46(); IkConstraintTimeline.__initStatic47(); IkConstraintTimeline.__initStatic48(); IkConstraintTimeline.__initStatic49(); IkConstraintTimeline.__initStatic50(); IkConstraintTimeline.__initStatic51(); IkConstraintTimeline.__initStatic52();

/** Changes a transform constraint's {@link TransformConstraint#rotateMix}, {@link TransformConstraint#translateMix},
 * {@link TransformConstraint#scaleMix}, and {@link TransformConstraint#shearMix}. */
/**
 * @public
 */
class TransformConstraintTimeline extends CurveTimeline {
    static __initStatic53() {this.ENTRIES = 5;}
    static __initStatic54() {this.PREV_TIME = -5;} static __initStatic55() {this.PREV_ROTATE = -4;} static __initStatic56() {this.PREV_TRANSLATE = -3;} static __initStatic57() {this.PREV_SCALE = -2;} static __initStatic58() {this.PREV_SHEAR = -1;}
    static __initStatic59() {this.ROTATE = 1;} static __initStatic60() {this.TRANSLATE = 2;} static __initStatic61() {this.SCALE = 3;} static __initStatic62() {this.SHEAR = 4;}

    /** The index of the transform constraint slot in {@link Skeleton#transformConstraints} that will be changed. */
    

    /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for each key frame. */
     // time, rotate mix, translate mix, scale mix, shear mix, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount * TransformConstraintTimeline.ENTRIES);
    }

    getPropertyId () {
        return (TimelineType.transformConstraint << 24) + this.transformConstraintIndex;
    }

    /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for the specified key frame. */
    setFrame (frameIndex, time, rotateMix, translateMix, scaleMix, shearMix) {
        frameIndex *= TransformConstraintTimeline.ENTRIES;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + TransformConstraintTimeline.ROTATE] = rotateMix;
        this.frames[frameIndex + TransformConstraintTimeline.TRANSLATE] = translateMix;
        this.frames[frameIndex + TransformConstraintTimeline.SCALE] = scaleMix;
        this.frames[frameIndex + TransformConstraintTimeline.SHEAR] = shearMix;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let frames = this.frames;

        let constraint = skeleton.transformConstraints[this.transformConstraintIndex];
        if (!constraint.active) return;
        if (time < frames[0]) {
            let data = constraint.data;
            switch (blend) {
                case MixBlend.setup:
                    constraint.rotateMix = data.rotateMix;
                    constraint.translateMix = data.translateMix;
                    constraint.scaleMix = data.scaleMix;
                    constraint.shearMix = data.shearMix;
                    return;
                case MixBlend.first:
                    constraint.rotateMix += (data.rotateMix - constraint.rotateMix) * alpha;
                    constraint.translateMix += (data.translateMix - constraint.translateMix) * alpha;
                    constraint.scaleMix += (data.scaleMix - constraint.scaleMix) * alpha;
                    constraint.shearMix += (data.shearMix - constraint.shearMix) * alpha;
            }
            return;
        }

        let rotate = 0, translate = 0, scale = 0, shear = 0;
        if (time >= frames[frames.length - TransformConstraintTimeline.ENTRIES]) { // Time is after last frame.
            let i = frames.length;
            rotate = frames[i + TransformConstraintTimeline.PREV_ROTATE];
            translate = frames[i + TransformConstraintTimeline.PREV_TRANSLATE];
            scale = frames[i + TransformConstraintTimeline.PREV_SCALE];
            shear = frames[i + TransformConstraintTimeline.PREV_SHEAR];
        } else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, TransformConstraintTimeline.ENTRIES);
            rotate = frames[frame + TransformConstraintTimeline.PREV_ROTATE];
            translate = frames[frame + TransformConstraintTimeline.PREV_TRANSLATE];
            scale = frames[frame + TransformConstraintTimeline.PREV_SCALE];
            shear = frames[frame + TransformConstraintTimeline.PREV_SHEAR];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / TransformConstraintTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + TransformConstraintTimeline.PREV_TIME] - frameTime));

            rotate += (frames[frame + TransformConstraintTimeline.ROTATE] - rotate) * percent;
            translate += (frames[frame + TransformConstraintTimeline.TRANSLATE] - translate) * percent;
            scale += (frames[frame + TransformConstraintTimeline.SCALE] - scale) * percent;
            shear += (frames[frame + TransformConstraintTimeline.SHEAR] - shear) * percent;
        }
        if (blend == MixBlend.setup) {
            let data = constraint.data;
            constraint.rotateMix = data.rotateMix + (rotate - data.rotateMix) * alpha;
            constraint.translateMix = data.translateMix + (translate - data.translateMix) * alpha;
            constraint.scaleMix = data.scaleMix + (scale - data.scaleMix) * alpha;
            constraint.shearMix = data.shearMix + (shear - data.shearMix) * alpha;
        } else {
            constraint.rotateMix += (rotate - constraint.rotateMix) * alpha;
            constraint.translateMix += (translate - constraint.translateMix) * alpha;
            constraint.scaleMix += (scale - constraint.scaleMix) * alpha;
            constraint.shearMix += (shear - constraint.shearMix) * alpha;
        }
    }
} TransformConstraintTimeline.__initStatic53(); TransformConstraintTimeline.__initStatic54(); TransformConstraintTimeline.__initStatic55(); TransformConstraintTimeline.__initStatic56(); TransformConstraintTimeline.__initStatic57(); TransformConstraintTimeline.__initStatic58(); TransformConstraintTimeline.__initStatic59(); TransformConstraintTimeline.__initStatic60(); TransformConstraintTimeline.__initStatic61(); TransformConstraintTimeline.__initStatic62();

/** Changes a path constraint's {@link PathConstraint#position}. */
/**
 * @public
 */
class PathConstraintPositionTimeline extends CurveTimeline {
    static __initStatic63() {this.ENTRIES = 2;}
    static __initStatic64() {this.PREV_TIME = -2;} static __initStatic65() {this.PREV_VALUE = -1;}
    static __initStatic66() {this.VALUE = 1;}

    /** The index of the path constraint slot in {@link Skeleton#pathConstraints} that will be changed. */
    

    /** The time in seconds and path constraint position for each key frame. */
     // time, position, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount * PathConstraintPositionTimeline.ENTRIES);
    }

    getPropertyId () {
        return (TimelineType.pathConstraintPosition << 24) + this.pathConstraintIndex;
    }

    /** Sets the time in seconds and path constraint position for the specified key frame. */
    setFrame (frameIndex, time, value) {
        frameIndex *= PathConstraintPositionTimeline.ENTRIES;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + PathConstraintPositionTimeline.VALUE] = value;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let frames = this.frames;
        let constraint = skeleton.pathConstraints[this.pathConstraintIndex];
        if (!constraint.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    constraint.position = constraint.data.position;
                    return;
                case MixBlend.first:
                    constraint.position += (constraint.data.position - constraint.position) * alpha;
            }
            return;
        }

        let position = 0;
        if (time >= frames[frames.length - PathConstraintPositionTimeline.ENTRIES]) // Time is after last frame.
            position = frames[frames.length + PathConstraintPositionTimeline.PREV_VALUE];
        else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, PathConstraintPositionTimeline.ENTRIES);
            position = frames[frame + PathConstraintPositionTimeline.PREV_VALUE];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / PathConstraintPositionTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + PathConstraintPositionTimeline.PREV_TIME] - frameTime));

            position += (frames[frame + PathConstraintPositionTimeline.VALUE] - position) * percent;
        }
        if (blend == MixBlend.setup)
            constraint.position = constraint.data.position + (position - constraint.data.position) * alpha;
        else
            constraint.position += (position - constraint.position) * alpha;
    }
} PathConstraintPositionTimeline.__initStatic63(); PathConstraintPositionTimeline.__initStatic64(); PathConstraintPositionTimeline.__initStatic65(); PathConstraintPositionTimeline.__initStatic66();

/** Changes a path constraint's {@link PathConstraint#spacing}. */
/**
 * @public
 */
class PathConstraintSpacingTimeline extends PathConstraintPositionTimeline {
    constructor (frameCount) {
        super(frameCount);
    }

    getPropertyId () {
        return (TimelineType.pathConstraintSpacing << 24) + this.pathConstraintIndex;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let frames = this.frames;
        let constraint = skeleton.pathConstraints[this.pathConstraintIndex];
        if (!constraint.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    constraint.spacing = constraint.data.spacing;
                    return;
                case MixBlend.first:
                    constraint.spacing += (constraint.data.spacing - constraint.spacing) * alpha;
            }
            return;
        }

        let spacing = 0;
        if (time >= frames[frames.length - PathConstraintSpacingTimeline.ENTRIES]) // Time is after last frame.
            spacing = frames[frames.length + PathConstraintSpacingTimeline.PREV_VALUE];
        else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, PathConstraintSpacingTimeline.ENTRIES);
            spacing = frames[frame + PathConstraintSpacingTimeline.PREV_VALUE];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / PathConstraintSpacingTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + PathConstraintSpacingTimeline.PREV_TIME] - frameTime));

            spacing += (frames[frame + PathConstraintSpacingTimeline.VALUE] - spacing) * percent;
        }

        if (blend == MixBlend.setup)
            constraint.spacing = constraint.data.spacing + (spacing - constraint.data.spacing) * alpha;
        else
            constraint.spacing += (spacing - constraint.spacing) * alpha;
    }
}

/** Changes a transform constraint's {@link PathConstraint#rotateMix} and
 * {@link TransformConstraint#translateMix}. */
/**
 * @public
 */
class PathConstraintMixTimeline extends CurveTimeline {
    static __initStatic67() {this.ENTRIES = 3;}
    static __initStatic68() {this.PREV_TIME = -3;} static __initStatic69() {this.PREV_ROTATE = -2;} static __initStatic70() {this.PREV_TRANSLATE = -1;}
    static __initStatic71() {this.ROTATE = 1;} static __initStatic72() {this.TRANSLATE = 2;}

    /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
    

    /** The time in seconds, rotate mix, and translate mix for each key frame. */
     // time, rotate mix, translate mix, ...

    constructor (frameCount) {
        super(frameCount);
        this.frames = Utils.newFloatArray(frameCount * PathConstraintMixTimeline.ENTRIES);
    }

    getPropertyId () {
        return (TimelineType.pathConstraintMix << 24) + this.pathConstraintIndex;
    }

    /** The time in seconds, rotate mix, and translate mix for the specified key frame. */
    setFrame (frameIndex, time, rotateMix, translateMix) {
        frameIndex *= PathConstraintMixTimeline.ENTRIES;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + PathConstraintMixTimeline.ROTATE] = rotateMix;
        this.frames[frameIndex + PathConstraintMixTimeline.TRANSLATE] = translateMix;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let frames = this.frames;
        let constraint = skeleton.pathConstraints[this.pathConstraintIndex];
        if (!constraint.active) return;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    constraint.rotateMix = constraint.data.rotateMix;
                    constraint.translateMix = constraint.data.translateMix;
                    return;
                case MixBlend.first:
                    constraint.rotateMix += (constraint.data.rotateMix - constraint.rotateMix) * alpha;
                    constraint.translateMix += (constraint.data.translateMix - constraint.translateMix) * alpha;
            }
            return;
        }

        let rotate = 0, translate = 0;
        if (time >= frames[frames.length - PathConstraintMixTimeline.ENTRIES]) { // Time is after last frame.
            rotate = frames[frames.length + PathConstraintMixTimeline.PREV_ROTATE];
            translate = frames[frames.length + PathConstraintMixTimeline.PREV_TRANSLATE];
        } else {
            // Interpolate between the previous frame and the current frame.
            let frame = Animation.binarySearch(frames, time, PathConstraintMixTimeline.ENTRIES);
            rotate = frames[frame + PathConstraintMixTimeline.PREV_ROTATE];
            translate = frames[frame + PathConstraintMixTimeline.PREV_TRANSLATE];
            let frameTime = frames[frame];
            let percent = this.getCurvePercent(frame / PathConstraintMixTimeline.ENTRIES - 1,
                1 - (time - frameTime) / (frames[frame + PathConstraintMixTimeline.PREV_TIME] - frameTime));

            rotate += (frames[frame + PathConstraintMixTimeline.ROTATE] - rotate) * percent;
            translate += (frames[frame + PathConstraintMixTimeline.TRANSLATE] - translate) * percent;
        }

        if (blend == MixBlend.setup) {
            constraint.rotateMix = constraint.data.rotateMix + (rotate - constraint.data.rotateMix) * alpha;
            constraint.translateMix = constraint.data.translateMix + (translate - constraint.data.translateMix) * alpha;
        } else {
            constraint.rotateMix += (rotate - constraint.rotateMix) * alpha;
            constraint.translateMix += (translate - constraint.translateMix) * alpha;
        }
    }
} PathConstraintMixTimeline.__initStatic67(); PathConstraintMixTimeline.__initStatic68(); PathConstraintMixTimeline.__initStatic69(); PathConstraintMixTimeline.__initStatic70(); PathConstraintMixTimeline.__initStatic71(); PathConstraintMixTimeline.__initStatic72();

/** Applies animations over time, queues animations for later playback, mixes (crossfading) between animations, and applies
 * multiple animations on top of each other (layering).
 *
 * See [Applying Animations](http://esotericsoftware.com/spine-applying-animations/) in the Spine Runtimes Guide. */
/**
 * @public
 */
class AnimationState  {
    static __initStatic() {this.emptyAnimation = new Animation("<empty>", [], 0);}

    /** 1. A previously applied timeline has set this property.
     *
     * Result: Mix from the current pose to the timeline pose. */
    static __initStatic2() {this.SUBSEQUENT = 0;}
    /** 1. This is the first timeline to set this property.
     * 2. The next track entry applied after this one does not have a timeline to set this property.
     *
     * Result: Mix from the setup pose to the timeline pose. */
    static __initStatic3() {this.FIRST = 1;}
    /** 1) A previously applied timeline has set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the current pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading
     * animations that key the same property. A subsequent timeline will set this property using a mix. */
    static __initStatic4() {this.HOLD_SUBSEQUENT = 2;}
    /** 1) This is the first timeline to set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the setup pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading animations
     * that key the same property. A subsequent timeline will set this property using a mix. */
    static __initStatic5() {this.HOLD_FIRST = 3;}
    /** 1. This is the first timeline to set this property.
     * 2. The next track entry to be applied does have a timeline to set this property.
     * 3. The next track entry after that one does have a timeline to set this property.
     * 4. timelineHoldMix stores the first subsequent track entry that does not have a timeline to set this property.
     *
     * Result: The same as HOLD except the mix percentage from the timelineHoldMix track entry is used. This handles when more than
     * 2 track entries in a row have a timeline that sets the same property.
     *
     * Eg, A -> B -> C -> D where A, B, and C have a timeline setting same property, but D does not. When A is applied, to avoid
     * "dipping" A is not mixed out, however D (the first entry that doesn't set the property) mixing in is used to mix out A
     * (which affects B and C). Without using D to mix out, A would be applied fully until mixing completes, then snap into
     * place. */
    static __initStatic6() {this.HOLD_MIX = 4;}

    static __initStatic7() {this.SETUP = 1;}
    static __initStatic8() {this.CURRENT = 2;}

    /** The AnimationStateData to look up mix durations. */
    

    /** The list of tracks that currently have animations, which may contain null entries. */
    __init() {this.tracks = new Array();}

    /** Multiplier for the delta time when the animation state is updated, causing time for all animations and mixes to play slower
     * or faster. Defaults to 1.
     *
     * See TrackEntry {@link TrackEntry#timeScale} for affecting a single animation. */
    __init2() {this.timeScale = 1;}
    __init3() {this.unkeyedState = 0;}

    __init4() {this.events = new Array();}
    __init5() {this.listeners = new Array();}
    __init6() {this.queue = new EventQueue(this);}
    __init7() {this.propertyIDs = new IntSet();}
    __init8() {this.animationsChanged = false;}

    __init9() {this.trackEntryPool = new Pool(() => new TrackEntry());}

    constructor (data) {AnimationState.prototype.__init.call(this);AnimationState.prototype.__init2.call(this);AnimationState.prototype.__init3.call(this);AnimationState.prototype.__init4.call(this);AnimationState.prototype.__init5.call(this);AnimationState.prototype.__init6.call(this);AnimationState.prototype.__init7.call(this);AnimationState.prototype.__init8.call(this);AnimationState.prototype.__init9.call(this);
        this.data = data;
    }

    /** Increments each track entry {@link TrackEntry#trackTime()}, setting queued animations as current if needed. */
    update (delta) {
        delta *= this.timeScale;
        let tracks = this.tracks;
        for (let i = 0, n = tracks.length; i < n; i++) {
            let current = tracks[i];
            if (current == null) continue;

            current.animationLast = current.nextAnimationLast;
            current.trackLast = current.nextTrackLast;

            let currentDelta = delta * current.timeScale;

            if (current.delay > 0) {
                current.delay -= currentDelta;
                if (current.delay > 0) continue;
                currentDelta = -current.delay;
                current.delay = 0;
            }

            let next = current.next;
            if (next != null) {
                // When the next entry's delay is passed, change to the next entry, preserving leftover time.
                let nextTime = current.trackLast - next.delay;
                if (nextTime >= 0) {
                    next.delay = 0;
                    next.trackTime += current.timeScale == 0 ? 0 : (nextTime / current.timeScale + delta) * next.timeScale;
                    current.trackTime += currentDelta;
                    this.setCurrent(i, next, true);
                    while (next.mixingFrom != null) {
                        next.mixTime += delta;
                        next = next.mixingFrom;
                    }
                    continue;
                }
            } else if (current.trackLast >= current.trackEnd && current.mixingFrom == null) {
                tracks[i] = null;
                this.queue.end(current);
                this.disposeNext(current);
                continue;
            }
            if (current.mixingFrom != null && this.updateMixingFrom(current, delta)) {
                // End mixing from entries once all have completed.
                let from = current.mixingFrom;
                current.mixingFrom = null;
                if (from != null) from.mixingTo = null;
                while (from != null) {
                    this.queue.end(from);
                    from = from.mixingFrom;
                }
            }

            current.trackTime += currentDelta;
        }

        this.queue.drain();
    }

    /** Returns true when all mixing from entries are complete. */
    updateMixingFrom (to, delta) {
        let from = to.mixingFrom;
        if (from == null) return true;

        let finished = this.updateMixingFrom(from, delta);

        from.animationLast = from.nextAnimationLast;
        from.trackLast = from.nextTrackLast;

        // Require mixTime > 0 to ensure the mixing from entry was applied at least once.
        if (to.mixTime > 0 && to.mixTime >= to.mixDuration) {
            // Require totalAlpha == 0 to ensure mixing is complete, unless mixDuration == 0 (the transition is a single frame).
            if (from.totalAlpha == 0 || to.mixDuration == 0) {
                to.mixingFrom = from.mixingFrom;
                if (from.mixingFrom != null) from.mixingFrom.mixingTo = to;
                to.interruptAlpha = from.interruptAlpha;
                this.queue.end(from);
            }
            return finished;
        }

        from.trackTime += delta * from.timeScale;
        to.mixTime += delta;
        return false;
    }

    /** Poses the skeleton using the track entry animations. There are no side effects other than invoking listeners, so the
     * animation state can be applied to multiple skeletons to pose them identically.
     * @returns True if any animations were applied. */
    apply (skeleton)  {
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        if (this.animationsChanged) this._animationsChanged();

        let events = this.events;
        let tracks = this.tracks;
        let applied = false;

        for (let i = 0, n = tracks.length; i < n; i++) {
            let current = tracks[i];
            if (current == null || current.delay > 0) continue;
            applied = true;
            let blend = i == 0 ? MixBlend.first : current.mixBlend;

            // Apply mixing from entries first.
            let mix = current.alpha;
            if (current.mixingFrom != null)
                mix *= this.applyMixingFrom(current, skeleton, blend);
            else if (current.trackTime >= current.trackEnd && current.next == null)
                mix = 0;

            // Apply current entry.
            let animationLast = current.animationLast, animationTime = current.getAnimationTime();
            let timelineCount = current.animation.timelines.length;
            let timelines = current.animation.timelines;
            if ((i == 0 && mix == 1) || blend == MixBlend.add) {
                for (let ii = 0; ii < timelineCount; ii++) {
                    // Fixes issue #302 on IOS9 where mix, blend sometimes became undefined and caused assets
                    // to sometimes stop rendering when using color correction, as their RGBA values become NaN.
                    // (https://github.com/pixijs/pixi-spine/issues/302)
                    Utils.webkit602BugfixHelper(mix, blend);
                    var timeline = timelines[ii];
                    if (timeline instanceof AttachmentTimeline)
                        this.applyAttachmentTimeline(timeline, skeleton, animationTime, blend, true);
                    else
                        timeline.apply(skeleton, animationLast, animationTime, events, mix, blend, MixDirection.mixIn);
                }
            } else {
                let timelineMode = current.timelineMode;

                let firstFrame = current.timelinesRotation.length == 0;
                if (firstFrame) Utils.setArraySize(current.timelinesRotation, timelineCount << 1, null);
                let timelinesRotation = current.timelinesRotation;

                for (let ii = 0; ii < timelineCount; ii++) {
                    let timeline = timelines[ii];
                    let timelineBlend = timelineMode[ii]  == AnimationState.SUBSEQUENT ? blend : MixBlend.setup;
                    if (timeline instanceof RotateTimeline) {
                        this.applyRotateTimeline(timeline, skeleton, animationTime, mix, timelineBlend, timelinesRotation, ii << 1, firstFrame);
                    } else if (timeline instanceof AttachmentTimeline) {
                        this.applyAttachmentTimeline(timeline, skeleton, animationTime, blend, true);
                    } else {
                        // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                        Utils.webkit602BugfixHelper(mix, blend);
                        timeline.apply(skeleton, animationLast, animationTime, events, mix, timelineBlend, MixDirection.mixIn);
                    }
                }
            }
            this.queueEvents(current, animationTime);
            events.length = 0;
            current.nextAnimationLast = animationTime;
            current.nextTrackLast = current.trackTime;
        }

        // Set slots attachments to the setup pose, if needed. This occurs if an animation that is mixing out sets attachments so
        // subsequent timelines see any deform, but the subsequent timelines don't set an attachment (eg they are also mixing out or
        // the time is before the first key).
        var setupState = this.unkeyedState + AnimationState.SETUP;
        var slots = skeleton.slots;
        for (var i = 0, n = skeleton.slots.length; i < n; i++) {
            var slot = slots[i];
            if (slot.attachmentState == setupState) {
                var attachmentName = slot.data.attachmentName;
                slot.setAttachment(attachmentName == null ? null : skeleton.getAttachment(slot.data.index, attachmentName));
            }
        }
        this.unkeyedState += 2; // Increasing after each use avoids the need to reset attachmentState for every slot.

        this.queue.drain();
        return applied;
    }

    applyMixingFrom (to, skeleton, blend) {
        let from = to.mixingFrom;
        if (from.mixingFrom != null) this.applyMixingFrom(from, skeleton, blend);

        let mix = 0;
        if (to.mixDuration == 0) { // Single frame mix to undo mixingFrom changes.
            mix = 1;
            if (blend == MixBlend.first) blend = MixBlend.setup;
        } else {
            mix = to.mixTime / to.mixDuration;
            if (mix > 1) mix = 1;
            if (blend != MixBlend.first) blend = from.mixBlend;
        }

        let events = mix < from.eventThreshold ? this.events : null;
        let attachments = mix < from.attachmentThreshold, drawOrder = mix < from.drawOrderThreshold;
        let animationLast = from.animationLast, animationTime = from.getAnimationTime();
        let timelineCount = from.animation.timelines.length;
        let timelines = from.animation.timelines;
        let alphaHold = from.alpha * to.interruptAlpha, alphaMix = alphaHold * (1 - mix);
        if (blend == MixBlend.add) {
            for (let i = 0; i < timelineCount; i++)
                timelines[i].apply(skeleton, animationLast, animationTime, events, alphaMix, blend, MixDirection.mixOut);
        } else {
            let timelineMode = from.timelineMode;
            let timelineHoldMix = from.timelineHoldMix;

            let firstFrame = from.timelinesRotation.length == 0;
            if (firstFrame) Utils.setArraySize(from.timelinesRotation, timelineCount << 1, null);
            let timelinesRotation = from.timelinesRotation;

            from.totalAlpha = 0;
            for (let i = 0; i < timelineCount; i++) {
                let timeline = timelines[i];
                let direction = MixDirection.mixOut;
                let timelineBlend;
                let alpha = 0;
                switch (timelineMode[i]) {
                    case AnimationState.SUBSEQUENT:
                        if (!drawOrder && timeline instanceof DrawOrderTimeline) continue;
                        timelineBlend = blend;
                        alpha = alphaMix;
                        break;
                    case AnimationState.FIRST:
                        timelineBlend = MixBlend.setup;
                        alpha = alphaMix;
                        break;
                    case AnimationState.HOLD_SUBSEQUENT:
                        timelineBlend = blend;
                        alpha = alphaHold;
                        break;
                    case AnimationState.HOLD_FIRST:
                        timelineBlend = MixBlend.setup;
                        alpha = alphaHold;
                        break;
                    default:
                        timelineBlend = MixBlend.setup;
                        let holdMix = timelineHoldMix[i];
                        alpha = alphaHold * Math.max(0, 1 - holdMix.mixTime / holdMix.mixDuration);
                        break;
                }
                from.totalAlpha += alpha;

                if (timeline instanceof RotateTimeline)
                    this.applyRotateTimeline(timeline, skeleton, animationTime, alpha, timelineBlend, timelinesRotation, i << 1, firstFrame);
                else if (timeline instanceof AttachmentTimeline)
                    this.applyAttachmentTimeline(timeline, skeleton, animationTime, timelineBlend, attachments);
                else {
                    // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                    Utils.webkit602BugfixHelper(alpha, blend);
                    if (drawOrder && timeline instanceof DrawOrderTimeline && timelineBlend == MixBlend.setup)
                        direction = MixDirection.mixIn;
                    timeline.apply(skeleton, animationLast, animationTime, events, alpha, timelineBlend, direction);
                }
            }
        }

        if (to.mixDuration > 0) this.queueEvents(from, animationTime);
        this.events.length = 0;
        from.nextAnimationLast = animationTime;
        from.nextTrackLast = from.trackTime;

        return mix;
    }

    applyAttachmentTimeline (timeline, skeleton, time, blend, attachments) {

        var slot = skeleton.slots[timeline.slotIndex];
        if (!slot.bone.active) return;

        var frames = timeline.frames;
        if (time < frames[0]) { // Time is before first frame.
            if (blend == MixBlend.setup || blend == MixBlend.first)
                this.setAttachment(skeleton, slot, slot.data.attachmentName, attachments);
        }
        else {
            var frameIndex;
            if (time >= frames[frames.length - 1]) // Time is after last frame.
                frameIndex = frames.length - 1;
            else
                frameIndex = Animation.binarySearch(frames, time) - 1;
            this.setAttachment(skeleton, slot, timeline.attachmentNames[frameIndex], attachments);
        }

        // If an attachment wasn't set (ie before the first frame or attachments is false), set the setup attachment later.
        if (slot.attachmentState <= this.unkeyedState) slot.attachmentState = this.unkeyedState + AnimationState.SETUP;
    }

    setAttachment (skeleton, slot, attachmentName, attachments) {
        slot.setAttachment(attachmentName == null ? null : skeleton.getAttachment(slot.data.index, attachmentName));
        if (attachments) slot.attachmentState = this.unkeyedState + AnimationState.CURRENT;
    }


    applyRotateTimeline (timeline, skeleton, time, alpha, blend,
                         timelinesRotation, i, firstFrame) {

        if (firstFrame) timelinesRotation[i] = 0;

        if (alpha == 1) {
            timeline.apply(skeleton, 0, time, null, 1, blend, MixDirection.mixIn);
            return;
        }

        let rotateTimeline = timeline ;
        let frames = rotateTimeline.frames;
        let bone = skeleton.bones[rotateTimeline.boneIndex];
        if (!bone.active) return;
        let r1 = 0, r2 = 0;
        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.rotation = bone.data.rotation;
                default:
                    return;
                case MixBlend.first:
                    r1 = bone.rotation;
                    r2 = bone.data.rotation;
            }
        } else {
            r1 = blend == MixBlend.setup ? bone.data.rotation : bone.rotation;
            if (time >= frames[frames.length - RotateTimeline.ENTRIES]) // Time is after last frame.
                r2 = bone.data.rotation + frames[frames.length + RotateTimeline.PREV_ROTATION];
            else {
                // Interpolate between the previous frame and the current frame.
                let frame = Animation.binarySearch(frames, time, RotateTimeline.ENTRIES);
                let prevRotation = frames[frame + RotateTimeline.PREV_ROTATION];
                let frameTime = frames[frame];
                let percent = rotateTimeline.getCurvePercent((frame >> 1) - 1,
                    1 - (time - frameTime) / (frames[frame + RotateTimeline.PREV_TIME] - frameTime));

                r2 = frames[frame + RotateTimeline.ROTATION] - prevRotation;
                r2 -= (16384 - ((16384.499999999996 - r2 / 360) | 0)) * 360;
                r2 = prevRotation + r2 * percent + bone.data.rotation;
                r2 -= (16384 - ((16384.499999999996 - r2 / 360) | 0)) * 360;
            }
        }

        // Mix between rotations using the direction of the shortest route on the first frame while detecting crosses.
        let total = 0, diff = r2 - r1;
        diff -= (16384 - ((16384.499999999996 - diff / 360) | 0)) * 360;
        if (diff == 0) {
            total = timelinesRotation[i];
        } else {
            let lastTotal = 0, lastDiff = 0;
            if (firstFrame) {
                lastTotal = 0;
                lastDiff = diff;
            } else {
                lastTotal = timelinesRotation[i]; // Angle and direction of mix, including loops.
                lastDiff = timelinesRotation[i + 1]; // Difference between bones.
            }
            let current = diff > 0, dir = lastTotal >= 0;
            // Detect cross at 0 (not 180).
            if (MathUtils.signum(lastDiff) != MathUtils.signum(diff) && Math.abs(lastDiff) <= 90) {
                // A cross after a 360 rotation is a loop.
                if (Math.abs(lastTotal) > 180) lastTotal += 360 * MathUtils.signum(lastTotal);
                dir = current;
            }
            total = diff + lastTotal - lastTotal % 360; // Store loops as part of lastTotal.
            if (dir != current) total += 360 * MathUtils.signum(lastTotal);
            timelinesRotation[i] = total;
        }
        timelinesRotation[i + 1] = diff;
        r1 += total * alpha;
        bone.rotation = r1 - (16384 - ((16384.499999999996 - r1 / 360) | 0)) * 360;
    }

    queueEvents (entry, animationTime) {
        let animationStart = entry.animationStart, animationEnd = entry.animationEnd;
        let duration = animationEnd - animationStart;
        let trackLastWrapped = entry.trackLast % duration;

        // Queue events before complete.
        let events = this.events;
        let i = 0, n = events.length;
        for (; i < n; i++) {
            let event = events[i];
            if (event.time < trackLastWrapped) break;
            if (event.time > animationEnd) continue; // Discard events outside animation start/end.
            this.queue.event(entry, event);
        }

        // Queue complete if completed a loop iteration or the animation.
        let complete = false;
        if (entry.loop)
            complete = duration == 0 || trackLastWrapped > entry.trackTime % duration;
        else
            complete = animationTime >= animationEnd && entry.animationLast < animationEnd;
        if (complete) this.queue.complete(entry);

        // Queue events after complete.
        for (; i < n; i++) {
            let event = events[i];
            if (event.time < animationStart) continue; // Discard events outside animation start/end.
            this.queue.event(entry, events[i]);
        }
    }

    /** Removes all animations from all tracks, leaving skeletons in their current pose.
     *
     * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
     * rather than leaving them in their current pose. */
    clearTracks () {
        let oldDrainDisabled = this.queue.drainDisabled;
        this.queue.drainDisabled = true;
        for (let i = 0, n = this.tracks.length; i < n; i++)
            this.clearTrack(i);
        this.tracks.length = 0;
        this.queue.drainDisabled = oldDrainDisabled;
        this.queue.drain();
    }

    /** Removes all animations from the track, leaving skeletons in their current pose.
     *
     * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
     * rather than leaving them in their current pose. */
    clearTrack (trackIndex) {
        if (trackIndex >= this.tracks.length) return;
        let current = this.tracks[trackIndex];
        if (current == null) return;

        this.queue.end(current);

        this.disposeNext(current);

        let entry = current;
        while (true) {
            let from = entry.mixingFrom;
            if (from == null) break;
            this.queue.end(from);
            entry.mixingFrom = null;
            entry.mixingTo = null;
            entry = from;
        }

        this.tracks[current.trackIndex] = null;

        this.queue.drain();
    }

    setCurrent (index, current, interrupt) {
        let from = this.expandToIndex(index);
        this.tracks[index] = current;

        if (from != null) {
            if (interrupt) this.queue.interrupt(from);
            current.mixingFrom = from;
            from.mixingTo = current;
            current.mixTime = 0;

            // Store the interrupted mix percentage.
            if (from.mixingFrom != null && from.mixDuration > 0)
                current.interruptAlpha *= Math.min(1, from.mixTime / from.mixDuration);

            from.timelinesRotation.length = 0; // Reset rotation for mixing out, in case entry was mixed in.
        }

        this.queue.start(current);
    }

    /** Sets an animation by name.
     *
     * {@link #setAnimationWith(}. */
    setAnimation (trackIndex, animationName, loop) {
        let animation = this.data.skeletonData.findAnimation(animationName);
        if (animation == null) throw new Error("Animation not found: " + animationName);
        return this.setAnimationWith(trackIndex, animation, loop);
    }

    /** Sets the current animation for a track, discarding any queued animations. If the formerly current track entry was never
     * applied to a skeleton, it is replaced (not mixed from).
     * @param loop If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
     *           duration. In either case {@link TrackEntry#trackEnd} determines when the track is cleared.
     * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    setAnimationWith (trackIndex, animation, loop) {
        if (animation == null) throw new Error("animation cannot be null.");
        let interrupt = true;
        let current = this.expandToIndex(trackIndex);
        if (current != null) {
            if (current.nextTrackLast == -1) {
                // Don't mix from an entry that was never applied.
                this.tracks[trackIndex] = current.mixingFrom;
                this.queue.interrupt(current);
                this.queue.end(current);
                this.disposeNext(current);
                current = current.mixingFrom;
                interrupt = false;
            } else
                this.disposeNext(current);
        }
        let entry = this.trackEntry(trackIndex, animation, loop, current);
        this.setCurrent(trackIndex, entry, interrupt);
        this.queue.drain();
        return entry;
    }

    /** Queues an animation by name.
     *
     * See {@link #addAnimationWith()}. */
    addAnimation (trackIndex, animationName, loop, delay) {
        let animation = this.data.skeletonData.findAnimation(animationName);
        if (animation == null) throw new Error("Animation not found: " + animationName);
        return this.addAnimationWith(trackIndex, animation, loop, delay);
    }

    /** Adds an animation to be played after the current or last queued animation for a track. If the track is empty, it is
     * equivalent to calling {@link #setAnimationWith()}.
     * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
     *           minus any mix duration (from the {@link AnimationStateData}) plus the specified `delay` (ie the mix
     *           ends at (`delay` = 0) or before (`delay` < 0) the previous track entry duration). If the
     *           previous entry is looping, its next loop completion is used instead of its duration.
     * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    addAnimationWith (trackIndex, animation, loop, delay) {
        if (animation == null) throw new Error("animation cannot be null.");

        let last = this.expandToIndex(trackIndex);
        if (last != null) {
            while (last.next != null)
                last = last.next;
        }

        let entry = this.trackEntry(trackIndex, animation, loop, last);

        if (last == null) {
            this.setCurrent(trackIndex, entry, true);
            this.queue.drain();
        } else {
            last.next = entry;
            if (delay <= 0) {
                let duration = last.animationEnd - last.animationStart;
                if (duration != 0) {
                    if (last.loop)
                        delay += duration * (1 + ((last.trackTime / duration) | 0));
                    else
                        delay += Math.max(duration, last.trackTime);
                    delay -= this.data.getMix(last.animation, animation);
                } else
                    delay = last.trackTime;
            }
        }

        entry.delay = delay;
        return entry;
    }

    /** Sets an empty animation for a track, discarding any queued animations, and sets the track entry's
     * {@link TrackEntry#mixduration}. An empty animation has no timelines and serves as a placeholder for mixing in or out.
     *
     * Mixing out is done by setting an empty animation with a mix duration using either {@link #setEmptyAnimation()},
     * {@link #setEmptyAnimations()}, or {@link #addEmptyAnimation()}. Mixing to an empty animation causes
     * the previous animation to be applied less and less over the mix duration. Properties keyed in the previous animation
     * transition to the value from lower tracks or to the setup pose value if no lower tracks key the property. A mix duration of
     * 0 still mixes out over one frame.
     *
     * Mixing in is done by first setting an empty animation, then adding an animation using
     * {@link #addAnimation()} and on the returned track entry, set the
     * {@link TrackEntry#setMixDuration()}. Mixing from an empty animation causes the new animation to be applied more and
     * more over the mix duration. Properties keyed in the new animation transition from the value from lower tracks or from the
     * setup pose value if no lower tracks key the property to the value keyed in the new animation. */
    setEmptyAnimation (trackIndex, mixDuration) {
        let entry = this.setAnimationWith(trackIndex, AnimationState.emptyAnimation, false);
        entry.mixDuration = mixDuration;
        entry.trackEnd = mixDuration;
        return entry;
    }

    /** Adds an empty animation to be played after the current or last queued animation for a track, and sets the track entry's
     * {@link TrackEntry#mixDuration}. If the track is empty, it is equivalent to calling
     * {@link #setEmptyAnimation()}.
     *
     * See {@link #setEmptyAnimation()}.
     * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
     *           minus any mix duration plus the specified `delay` (ie the mix ends at (`delay` = 0) or
     *           before (`delay` < 0) the previous track entry duration). If the previous entry is looping, its next
     *           loop completion is used instead of its duration.
     * @return A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener#dispose()} event occurs. */
    addEmptyAnimation (trackIndex, mixDuration, delay) {
        if (delay <= 0) delay -= mixDuration;
        let entry = this.addAnimationWith(trackIndex, AnimationState.emptyAnimation, false, delay);
        entry.mixDuration = mixDuration;
        entry.trackEnd = mixDuration;
        return entry;
    }

    /** Sets an empty animation for every track, discarding any queued animations, and mixes to it over the specified mix
     * duration. */
    setEmptyAnimations (mixDuration) {
        let oldDrainDisabled = this.queue.drainDisabled;
        this.queue.drainDisabled = true;
        for (let i = 0, n = this.tracks.length; i < n; i++) {
            let current = this.tracks[i];
            if (current != null) this.setEmptyAnimation(current.trackIndex, mixDuration);
        }
        this.queue.drainDisabled = oldDrainDisabled;
        this.queue.drain();
    }

    expandToIndex (index) {
        if (index < this.tracks.length) return this.tracks[index];
        Utils.ensureArrayCapacity(this.tracks, index + 1, null);
        this.tracks.length = index + 1;
        return null;
    }

    /** @param last May be null. */
    trackEntry (trackIndex, animation, loop, last) {
        let entry = this.trackEntryPool.obtain();
        entry.trackIndex = trackIndex;
        entry.animation = animation;
        entry.loop = loop;
        entry.holdPrevious = false;

        entry.eventThreshold = 0;
        entry.attachmentThreshold = 0;
        entry.drawOrderThreshold = 0;

        entry.animationStart = 0;
        entry.animationEnd = animation.duration;
        entry.animationLast = -1;
        entry.nextAnimationLast = -1;

        entry.delay = 0;
        entry.trackTime = 0;
        entry.trackLast = -1;
        entry.nextTrackLast = -1;
        entry.trackEnd = Number.MAX_VALUE;
        entry.timeScale = 1;

        entry.alpha = 1;
        entry.interruptAlpha = 1;
        entry.mixTime = 0;
        entry.mixDuration = last == null ? 0 : this.data.getMix(last.animation, animation);
        entry.mixBlend = MixBlend.replace;
        return entry;
    }

    disposeNext (entry) {
        let next = entry.next;
        while (next != null) {
            this.queue.dispose(next);
            next = next.next;
        }
        entry.next = null;
    }

    _animationsChanged () {
        this.animationsChanged = false;

        this.propertyIDs.clear();

        for (let i = 0, n = this.tracks.length; i < n; i++) {
            let entry = this.tracks[i];
            if (entry == null) continue;
            while (entry.mixingFrom != null)
                entry = entry.mixingFrom;

            do {
                if (entry.mixingFrom == null || entry.mixBlend != MixBlend.add) this.computeHold(entry);
                entry = entry.mixingTo;
            } while (entry != null)
        }
    }

    computeHold (entry) {
        let to = entry.mixingTo;
        let timelines = entry.animation.timelines;
        let timelinesCount = entry.animation.timelines.length;
        let timelineMode = Utils.setArraySize(entry.timelineMode, timelinesCount);
        entry.timelineHoldMix.length = 0;
        let timelineDipMix = Utils.setArraySize(entry.timelineHoldMix, timelinesCount);
        let propertyIDs = this.propertyIDs;

        if (to != null && to.holdPrevious) {
            for (let i = 0; i < timelinesCount; i++) {
                timelineMode[i] = propertyIDs.add(timelines[i].getPropertyId()) ? AnimationState.HOLD_FIRST : AnimationState.HOLD_SUBSEQUENT;
            }
            return;
        }

        outer:
            for (let i = 0; i < timelinesCount; i++) {
                let timeline = timelines[i];
                let id = timeline.getPropertyId();
                if (!propertyIDs.add(id))
                    timelineMode[i] = AnimationState.SUBSEQUENT;
                else if (to == null || timeline instanceof AttachmentTimeline || timeline instanceof DrawOrderTimeline
                    || timeline instanceof EventTimeline || !to.animation.hasTimeline(id)) {
                    timelineMode[i] = AnimationState.FIRST;
                } else {
                    for (let next = to.mixingTo; next != null; next = next.mixingTo) {
                        if (next.animation.hasTimeline(id)) continue;
                        if (entry.mixDuration > 0) {
                            timelineMode[i] = AnimationState.HOLD_MIX;
                            timelineDipMix[i] = next;
                            continue outer;
                        }
                        break;
                    }
                    timelineMode[i] = AnimationState.HOLD_FIRST;
                }
            }
    }

    /** Returns the track entry for the animation currently playing on the track, or null if no animation is currently playing. */
    getCurrent (trackIndex) {
        if (trackIndex >= this.tracks.length) return null;
        return this.tracks[trackIndex];
    }

    /** Adds a listener to receive events for all track entries. */
    addListener (listener) {
        if (listener == null) throw new Error("listener cannot be null.");
        this.listeners.push(listener);
    }

    /** Removes the listener added with {@link #addListener()}. */
    removeListener (listener) {
        let index = this.listeners.indexOf(listener);
        if (index >= 0) this.listeners.splice(index, 1);
    }

    /** Removes all listeners added with {@link #addListener()}. */
    clearListeners () {
        this.listeners.length = 0;
    }

    /** Discards all listener notifications that have not yet been delivered. This can be useful to call from an
     * {@link AnimationStateListener} when it is known that further notifications that may have been already queued for delivery
     * are not wanted because new animations are being set. */
    clearListenerNotifications () {
        this.queue.clear();
    }

    //deprecated stuff
    
    
    
    

     static __initStatic9() {this.deprecatedWarning1 = false;}

    setAnimationByName(trackIndex, animationName, loop) {
        if (!AnimationState.deprecatedWarning1) {
            AnimationState.deprecatedWarning1 = true;
            console.warn("Spine Deprecation Warning: AnimationState.setAnimationByName is deprecated, please use setAnimation from now on.");
        }
        this.setAnimation(trackIndex, animationName, loop);
    }

     static __initStatic10() {this.deprecatedWarning2 = false;}

    addAnimationByName(trackIndex, animationName, loop, delay) {
        if (!AnimationState.deprecatedWarning2) {
            AnimationState.deprecatedWarning2 = true;
            console.warn("Spine Deprecation Warning: AnimationState.addAnimationByName is deprecated, please use addAnimation from now on.");
        }
        this.addAnimation(trackIndex, animationName, loop, delay);
    }

     static __initStatic11() {this.deprecatedWarning3 = false;}

    hasAnimation(animationName) {
        let animation = this.data.skeletonData.findAnimation(animationName);
        return animation !== null;
    }

    hasAnimationByName(animationName) {
        if (!AnimationState.deprecatedWarning3) {
            AnimationState.deprecatedWarning3 = true;
            console.warn("Spine Deprecation Warning: AnimationState.hasAnimationByName is deprecated, please use hasAnimation from now on.");
        }
        return this.hasAnimation(animationName);
    }
} AnimationState.__initStatic(); AnimationState.__initStatic2(); AnimationState.__initStatic3(); AnimationState.__initStatic4(); AnimationState.__initStatic5(); AnimationState.__initStatic6(); AnimationState.__initStatic7(); AnimationState.__initStatic8(); AnimationState.__initStatic9(); AnimationState.__initStatic10(); AnimationState.__initStatic11();

/** Stores settings and other state for the playback of an animation on an {@link AnimationState} track.
 *
 * References to a track entry must not be kept after the {@link AnimationStateListener#dispose()} event occurs. */
/**
 * @public
 */
class TrackEntry {constructor() { TrackEntry.prototype.__init10.call(this);TrackEntry.prototype.__init11.call(this);TrackEntry.prototype.__init12.call(this);TrackEntry.prototype.__init13.call(this); }
    /** The animation to apply for this track entry. */
    

    /** The animation queued to start after this animation, or null. `next` makes up a linked list. */
    

    /** The track entry for the previous animation when mixing from the previous animation to this animation, or null if no
     * mixing is currently occuring. When mixing from multiple animations, `mixingFrom` makes up a linked list. */
    

    /** The track entry for the next animation when mixing from this animation to the next animation, or null if no mixing is
     * currently occuring. When mixing to multiple animations, `mixingTo` makes up a linked list. */
    

    /** The listener for events generated by this track entry, or null.
     *
     * A track entry returned from {@link AnimationState#setAnimation()} is already the current animation
     * for the track, so the track entry listener {@link AnimationStateListener#start()} will not be called. */
    

    /** The index of the track where this track entry is either current or queued.
     *
     * See {@link AnimationState#getCurrent()}. */
    

    /** If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
     * duration. */
    

    /** If true, when mixing from the previous animation to this animation, the previous animation is applied as normal instead
     * of being mixed out.
     *
     * When mixing between animations that key the same property, if a lower track also keys that property then the value will
     * briefly dip toward the lower track value during the mix. This happens because the first animation mixes from 100% to 0%
     * while the second animation mixes from 0% to 100%. Setting `holdPrevious` to true applies the first animation
     * at 100% during the mix so the lower track value is overwritten. Such dipping does not occur on the lowest track which
     * keys the property, only when a higher track also keys the property.
     *
     * Snapping will occur if `holdPrevious` is true and this animation does not key all the same properties as the
     * previous animation. */
    

    /** When the mix percentage ({@link #mixTime} / {@link #mixDuration}) is less than the
     * `eventThreshold`, event timelines are applied while this animation is being mixed out. Defaults to 0, so event
     * timelines are not applied while this animation is being mixed out. */
    

    /** When the mix percentage ({@link #mixtime} / {@link #mixDuration}) is less than the
     * `attachmentThreshold`, attachment timelines are applied while this animation is being mixed out. Defaults to
     * 0, so attachment timelines are not applied while this animation is being mixed out. */
    

    /** When the mix percentage ({@link #mixTime} / {@link #mixDuration}) is less than the
     * `drawOrderThreshold`, draw order timelines are applied while this animation is being mixed out. Defaults to 0,
     * so draw order timelines are not applied while this animation is being mixed out. */
    

    /** Seconds when this animation starts, both initially and after looping. Defaults to 0.
     *
     * When changing the `animationStart` time, it often makes sense to set {@link #animationLast} to the same
     * value to prevent timeline keys before the start time from triggering. */
    

    /** Seconds for the last frame of this animation. Non-looping animations won't play past this time. Looping animations will
     * loop back to {@link #animationStart} at this time. Defaults to the animation {@link Animation#duration}. */
    


    /** The time in seconds this animation was last applied. Some timelines use this for one-time triggers. Eg, when this
     * animation is applied, event timelines will fire all events between the `animationLast` time (exclusive) and
     * `animationTime` (inclusive). Defaults to -1 to ensure triggers on frame 0 happen the first time this animation
     * is applied. */
    

    

    /** Seconds to postpone playing the animation. When this track entry is the current track entry, `delay`
     * postpones incrementing the {@link #trackTime}. When this track entry is queued, `delay` is the time from
     * the start of the previous animation to when this track entry will become the current track entry (ie when the previous
     * track entry {@link TrackEntry#trackTime} >= this track entry's `delay`).
     *
     * {@link #timeScale} affects the delay. */
    

    /** Current time in seconds this track entry has been the current track entry. The track time determines
     * {@link #animationTime}. The track time can be set to start the animation at a time other than 0, without affecting
     * looping. */
    

     

    /** The track time in seconds when this animation will be removed from the track. Defaults to the highest possible float
     * value, meaning the animation will be applied until a new animation is set or the track is cleared. If the track end time
     * is reached, no other animations are queued for playback, and mixing from any previous animations is complete, then the
     * properties keyed by the animation are set to the setup pose and the track is cleared.
     *
     * It may be desired to use {@link AnimationState#addEmptyAnimation()} rather than have the animation
     * abruptly cease being applied. */
    

    /** Multiplier for the delta time when this track entry is updated, causing time for this animation to pass slower or
     * faster. Defaults to 1.
     *
     * {@link #mixTime} is not affected by track entry time scale, so {@link #mixDuration} may need to be adjusted to
     * match the animation speed.
     *
     * When using {@link AnimationState#addAnimation()} with a `delay` <= 0, note the
     * {@link #delay} is set using the mix duration from the {@link AnimationStateData}, assuming time scale to be 1. If
     * the time scale is not 1, the delay may need to be adjusted.
     *
     * See AnimationState {@link AnimationState#timeScale} for affecting all animations. */
    

    /** Values < 1 mix this animation with the skeleton's current pose (usually the pose resulting from lower tracks). Defaults
     * to 1, which overwrites the skeleton's current pose with this animation.
     *
     * Typically track 0 is used to completely pose the skeleton, then alpha is used on higher tracks. It doesn't make sense to
     * use alpha on track 0 if the skeleton pose is from the last frame render. */
    

    /** Seconds from 0 to the {@link #getMixDuration()} when mixing from the previous animation to this animation. May be
     * slightly more than `mixDuration` when the mix is complete. */
    

    /** Seconds for mixing from the previous animation to this animation. Defaults to the value provided by AnimationStateData
     * {@link AnimationStateData#getMix()} based on the animation before this animation (if any).
     *
     * A mix duration of 0 still mixes out over one frame to provide the track entry being mixed out a chance to revert the
     * properties it was animating.
     *
     * The `mixDuration` can be set manually rather than use the value from
     * {@link AnimationStateData#getMix()}. In that case, the `mixDuration` can be set for a new
     * track entry only before {@link AnimationState#update(float)} is first called.
     *
     * When using {@link AnimationState#addAnimation()} with a `delay` <= 0, note the
     * {@link #delay} is set using the mix duration from the {@link AnimationStateData}, not a mix duration set
     * afterward. */
      

    /** Controls how properties keyed in the animation are mixed with lower tracks. Defaults to {@link MixBlend#replace}, which
     * replaces the values from the lower tracks with the animation values. {@link MixBlend#add} adds the animation values to
     * the values from the lower tracks.
     *
     * The `mixBlend` can be set for a new track entry only before {@link AnimationState#apply()} is first
     * called. */
    __init10() {this.mixBlend = MixBlend.replace;}
    __init11() {this.timelineMode = new Array();}
    __init12() {this.timelineHoldMix = new Array();}
    __init13() {this.timelinesRotation = new Array();}

    reset () {
        this.next = null;
        this.mixingFrom = null;
        this.mixingTo = null;
        this.animation = null;
        this.listener = null;
        this.timelineMode.length = 0;
        this.timelineHoldMix.length = 0;
        this.timelinesRotation.length = 0;
    }

    /** Uses {@link #trackTime} to compute the `animationTime`, which is between {@link #animationStart}
     * and {@link #animationEnd}. When the `trackTime` is 0, the `animationTime` is equal to the
     * `animationStart` time. */
    getAnimationTime () {
        if (this.loop) {
            let duration = this.animationEnd - this.animationStart;
            if (duration == 0) return this.animationStart;
            return (this.trackTime % duration) + this.animationStart;
        }
        return Math.min(this.trackTime + this.animationStart, this.animationEnd);
    }

    setAnimationLast(animationLast) {
        this.animationLast = animationLast;
        this.nextAnimationLast = animationLast;
    }

    /** Returns true if at least one loop has been completed.
     *
     * See {@link AnimationStateListener#complete()}. */
    isComplete () {
        return this.trackTime >= this.animationEnd - this.animationStart;
    }

    /** Resets the rotation directions for mixing this entry's rotate timelines. This can be useful to avoid bones rotating the
     * long way around when using {@link #alpha} and starting animations on other tracks.
     *
     * Mixing with {@link MixBlend#replace} involves finding a rotation between two others, which has two possible solutions:
     * the short way or the long way around. The two rotations likely change over time, so which direction is the short or long
     * way also changes. If the short way was always chosen, bones would flip to the other side when that direction became the
     * long way. TrackEntry chooses the short way the first time it is applied and remembers that direction. */
    resetRotationDirections () {
        this.timelinesRotation.length = 0;
    }

    //deprecated stuff
    
    
    
    

     static __initStatic12() {this.deprecatedWarning1 = false;}
     static __initStatic13() {this.deprecatedWarning2 = false;}

    get time() {
        if (!TrackEntry.deprecatedWarning1) {
            TrackEntry.deprecatedWarning1 = true;
            console.warn("Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on.");
        }
        return this.trackTime;
    }

    set time(value) {
        if (!TrackEntry.deprecatedWarning1) {
            TrackEntry.deprecatedWarning1 = true;
            console.warn("Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on.");
        }
        this.trackTime = value;
    }

    get endTime() {
        if (!TrackEntry.deprecatedWarning2) {
            TrackEntry.deprecatedWarning2 = true;
            console.warn("Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on.");
        }
        return this.trackTime;
    }

    set endTime(value) {
        if (!TrackEntry.deprecatedWarning2) {
            TrackEntry.deprecatedWarning2 = true;
            console.warn("Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on.");
        }
        this.trackTime = value;
    }

    loopsCount() {
        return Math.floor(this.trackTime / this.trackEnd);
    }
} TrackEntry.__initStatic12(); TrackEntry.__initStatic13();

/**
 * @public
 */
class EventQueue {
    __init14() {this.objects = [];}
    __init15() {this.drainDisabled = false;}
    

    constructor(animState) {EventQueue.prototype.__init14.call(this);EventQueue.prototype.__init15.call(this);
        this.animState = animState;
    }

    start (entry) {
        this.objects.push(EventType.start);
        this.objects.push(entry);
        this.animState.animationsChanged = true;
    }

    interrupt (entry) {
        this.objects.push(EventType.interrupt);
        this.objects.push(entry);
    }

    end (entry) {
        this.objects.push(EventType.end);
        this.objects.push(entry);
        this.animState.animationsChanged = true;
    }

    dispose (entry) {
        this.objects.push(EventType.dispose);
        this.objects.push(entry);
    }

    complete (entry) {
        this.objects.push(EventType.complete);
        this.objects.push(entry);
    }

    event (entry, event) {
        this.objects.push(EventType.event);
        this.objects.push(entry);
        this.objects.push(event);
    }

     static __initStatic14() {this.deprecatedWarning1 = false;}

    deprecateStuff() {
        if (!EventQueue.deprecatedWarning1) {
            EventQueue.deprecatedWarning1 = true;
            console.warn("Spine Deprecation Warning: onComplete, onStart, onEnd, onEvent art deprecated, please use listeners from now on. 'state.addListener({ complete: function(track, event) { } })'");
        }
        return true;
    }

    drain () {
        if (this.drainDisabled) return;
        this.drainDisabled = true;

        let objects = this.objects;
        let listeners = this.animState.listeners;

        for (let i = 0; i < objects.length; i += 2) {
            let type = objects[i] ;
            let entry = objects[i + 1] ;
            switch (type) {
                case EventType.start:
                    if (entry.listener != null && entry.listener.start) entry.listener.start(entry);
                    for (let ii = 0; ii < listeners.length; ii++)
                        if (listeners[ii].start) listeners[ii].start(entry);
                    //deprecation
                    entry.onStart && this.deprecateStuff() && entry.onStart(entry.trackIndex);
                    this.animState.onStart && this.deprecateStuff() && this.deprecateStuff && this.animState.onStart(entry.trackIndex);
                    break;
                case EventType.interrupt:
                    if (entry.listener != null && entry.listener.interrupt) entry.listener.interrupt(entry);
                    for (let ii = 0; ii < listeners.length; ii++)
                        if (listeners[ii].interrupt) listeners[ii].interrupt(entry);
                    break;
                case EventType.end:
                    if (entry.listener != null && entry.listener.end) entry.listener.end(entry);
                    for (let ii = 0; ii < listeners.length; ii++)
                        if (listeners[ii].end) listeners[ii].end(entry);
                    //deprecation
                    entry.onEnd && this.deprecateStuff() && entry.onEnd(entry.trackIndex);
                    this.animState.onEnd && this.deprecateStuff() && this.animState.onEnd(entry.trackIndex);
                // Fall through.
                case EventType.dispose:
                    if (entry.listener != null && entry.listener.dispose) entry.listener.dispose(entry);
                    for (let ii = 0; ii < listeners.length; ii++)
                        if (listeners[ii].dispose) listeners[ii].dispose(entry);
                    this.animState.trackEntryPool.free(entry);
                    break;
                case EventType.complete:
                    if (entry.listener != null && entry.listener.complete) entry.listener.complete(entry);
                    for (let ii = 0; ii < listeners.length; ii++)
                        if (listeners[ii].complete) listeners[ii].complete(entry);
                    //deprecation

                    let count = MathUtils.toInt(entry.loopsCount()) ;
                    entry.onComplete && this.deprecateStuff() && entry.onComplete(entry.trackIndex, count);
                    this.animState.onComplete && this.deprecateStuff() && this.animState.onComplete(entry.trackIndex, count);
                    break;
                case EventType.event:
                    let event = objects[i++ + 2] ;
                    if (entry.listener != null && entry.listener.event) entry.listener.event(entry, event);
                    for (let ii = 0; ii < listeners.length; ii++)
                        if (listeners[ii].event) listeners[ii].event(entry, event);
                    //deprecation
                    entry.onEvent && this.deprecateStuff() && entry.onEvent(entry.trackIndex, event);
                    this.animState.onEvent && this.deprecateStuff() && this.animState.onEvent(entry.trackIndex, event);
                    break;
            }
        }
        this.clear();

        this.drainDisabled = false;
    }

    clear () {
        this.objects.length = 0;
    }
} EventQueue.__initStatic14();

/**
 * @public
 */
var EventType; (function (EventType) {
    const start = 0; EventType[EventType["start"] = start] = "start"; const interrupt = start + 1; EventType[EventType["interrupt"] = interrupt] = "interrupt"; const end = interrupt + 1; EventType[EventType["end"] = end] = "end"; const dispose = end + 1; EventType[EventType["dispose"] = dispose] = "dispose"; const complete = dispose + 1; EventType[EventType["complete"] = complete] = "complete"; const event = complete + 1; EventType[EventType["event"] = event] = "event";
})(EventType || (EventType = {}));

/**
 * @public
 */






















/**
 * @public
 */
class AnimationStateAdapter  {
    start (entry) {
    }

    interrupt (entry) {
    }

    end (entry) {
    }

    dispose (entry) {
    }

    complete (entry) {
    }

    event (entry, event) {
    }
}

/**
 * @public
 */
class AnimationStateData  {
    
    __init() {this.animationToMixTime = {};}
    __init2() {this.defaultMix = 0;}

    constructor(skeletonData) {AnimationStateData.prototype.__init.call(this);AnimationStateData.prototype.__init2.call(this);
        if (skeletonData == null) throw new Error("skeletonData cannot be null.");
        this.skeletonData = skeletonData;
    }

    setMix(fromName, toName, duration) {
        let from = this.skeletonData.findAnimation(fromName);
        if (from == null) throw new Error("Animation not found: " + fromName);
        let to = this.skeletonData.findAnimation(toName);
        if (to == null) throw new Error("Animation not found: " + toName);
        this.setMixWith(from, to, duration);
    }

     static __initStatic() {this.deprecatedWarning1 = false;}

    setMixByName(fromName, toName, duration) {
        if (!AnimationStateData.deprecatedWarning1) {
            AnimationStateData.deprecatedWarning1 = true;
            console.warn("Deprecation Warning: AnimationStateData.setMixByName is deprecated, please use setMix from now on.");
        }
        this.setMix(fromName, toName, duration);
    }

    setMixWith(from, to, duration) {
        if (from == null) throw new Error("from cannot be null.");
        if (to == null) throw new Error("to cannot be null.");
        let key = from.name + "." + to.name;
        this.animationToMixTime[key] = duration;
    }

    getMix(from, to) {
        let key = from.name + "." + to.name;
        let value = this.animationToMixTime[key];
        return value === undefined ? this.defaultMix : value;
    }
} AnimationStateData.__initStatic();

/**
 * @public
 */
class AtlasAttachmentLoader  {
    

    constructor(atlas) {
        this.atlas = atlas;
    }

    /** @return May be null to not load an attachment. */
    newRegionAttachment(skin, name, path) {
        let region = this.atlas.findRegion(path);
        if (region == null) throw new Error("Region not found in atlas: " + path + " (region attachment: " + name + ")");
        let attachment = new RegionAttachment(name);
        attachment.region = region;
        return attachment;
    }

    /** @return May be null to not load an attachment. */
    newMeshAttachment(skin, name, path) {
        let region = this.atlas.findRegion(path);
        if (region == null) throw new Error("Region not found in atlas: " + path + " (mesh attachment: " + name + ")");
        let attachment = new MeshAttachment(name);
        attachment.region = region;
        return attachment;
    }

    /** @return May be null to not load an attachment. */
    newBoundingBoxAttachment(skin, name) {
        return new BoundingBoxAttachment(name);
    }

    /** @return May be null to not load an attachment */
    newPathAttachment(skin, name) {
        return new PathAttachment(name);
    }

    newPointAttachment(skin, name) {
        return new PointAttachment(name);
    }

    newClippingAttachment(skin, name) {
        return new ClippingAttachment(name);
    }
}

/**
 * @public
 */
class BoneData {
    
    
    
    
    __init() {this.x = 0;}
    __init2() {this.y = 0;}
    __init3() {this.rotation = 0;}
    __init4() {this.scaleX = 1;}
    __init5() {this.scaleY = 1;}
    __init6() {this.shearX = 0;}
    __init7() {this.shearY = 0;}
    __init8() {this.transformMode = TransformMode.Normal;}
    __init9() {this.skinRequired = false;}

    __init10() {this.color = new Color();}

    constructor(index, name, parent) {BoneData.prototype.__init.call(this);BoneData.prototype.__init2.call(this);BoneData.prototype.__init3.call(this);BoneData.prototype.__init4.call(this);BoneData.prototype.__init5.call(this);BoneData.prototype.__init6.call(this);BoneData.prototype.__init7.call(this);BoneData.prototype.__init8.call(this);BoneData.prototype.__init9.call(this);BoneData.prototype.__init10.call(this);
        if (index < 0) throw new Error("index must be >= 0.");
        if (name == null) throw new Error("name cannot be null.");
        this.index = index;
        this.name = name;
        this.parent = parent;
    }
}

/**
 * @public
 */
var TransformMode; (function (TransformMode) {
    const Normal = 0; TransformMode[TransformMode["Normal"] = Normal] = "Normal"; const OnlyTranslation = Normal + 1; TransformMode[TransformMode["OnlyTranslation"] = OnlyTranslation] = "OnlyTranslation"; const NoRotationOrReflection = OnlyTranslation + 1; TransformMode[TransformMode["NoRotationOrReflection"] = NoRotationOrReflection] = "NoRotationOrReflection"; const NoScale = NoRotationOrReflection + 1; TransformMode[TransformMode["NoScale"] = NoScale] = "NoScale"; const NoScaleOrReflection = NoScale + 1; TransformMode[TransformMode["NoScaleOrReflection"] = NoScaleOrReflection] = "NoScaleOrReflection";
})(TransformMode || (TransformMode = {}));

/**
 * @public
 */
class Bone  {
    //be careful! Spine b,c is c,b in pixi matrix
    __init() {this.matrix = new Matrix();}

    get worldX() {
        return this.matrix.tx;
    }

    get worldY() {
        return this.matrix.ty;
    }

    
    
    
    __init2() {this.children = new Array();}
    __init3() {this.x = 0;}
    __init4() {this.y = 0;}
    __init5() {this.rotation = 0;}
    __init6() {this.scaleX = 0;}
    __init7() {this.scaleY = 0;}
    __init8() {this.shearX = 0;}
    __init9() {this.shearY = 0;}
    __init10() {this.ax = 0;}
    __init11() {this.ay = 0;}
    __init12() {this.arotation = 0;}
    __init13() {this.ascaleX = 0;}
    __init14() {this.ascaleY = 0;}
    __init15() {this.ashearX = 0;}
    __init16() {this.ashearY = 0;}
    __init17() {this.appliedValid = false;}

    __init18() {this.sorted = false;}
    __init19() {this.active = false;}

    /** @param parent May be null. */
    constructor(data, skeleton, parent) {Bone.prototype.__init.call(this);Bone.prototype.__init2.call(this);Bone.prototype.__init3.call(this);Bone.prototype.__init4.call(this);Bone.prototype.__init5.call(this);Bone.prototype.__init6.call(this);Bone.prototype.__init7.call(this);Bone.prototype.__init8.call(this);Bone.prototype.__init9.call(this);Bone.prototype.__init10.call(this);Bone.prototype.__init11.call(this);Bone.prototype.__init12.call(this);Bone.prototype.__init13.call(this);Bone.prototype.__init14.call(this);Bone.prototype.__init15.call(this);Bone.prototype.__init16.call(this);Bone.prototype.__init17.call(this);Bone.prototype.__init18.call(this);Bone.prototype.__init19.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        this.data = data;
        this.skeleton = skeleton;
        this.parent = parent;
        this.setToSetupPose();
    }

    isActive () {
        return this.active;
    }

    /** Same as {@link #updateWorldTransform()}. This method exists for Bone to implement {@link Updatable}. */
    update() {
        this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }

    /** Computes the world transform using the parent bone and this bone's local transform. */
    updateWorldTransform() {
        this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }

    /** Computes the world transform using the parent bone and the specified local transform. */
    updateWorldTransformWith(x, y, rotation, scaleX, scaleY, shearX, shearY) {
        this.ax = x;
        this.ay = y;
        this.arotation = rotation;
        this.ascaleX = scaleX;
        this.ascaleY = scaleY;
        this.ashearX = shearX;
        this.ashearY = shearY;
        this.appliedValid = true;

        let parent = this.parent;
        let m = this.matrix;

        let sx = this.skeleton.scaleX;
        let sy = settings.yDown? -this.skeleton.scaleY : this.skeleton.scaleY;

        if (parent == null) { // Root bone.
            let skeleton = this.skeleton;
            let rotationY = rotation + 90 + shearY;
            m.a = MathUtils.cosDeg(rotation + shearX) * scaleX * sx;
            m.c = MathUtils.cosDeg(rotationY) * scaleY * sx;
            m.b = MathUtils.sinDeg(rotation + shearX) * scaleX * sy;
            m.d = MathUtils.sinDeg(rotationY) * scaleY * sy;
            m.tx = x * sx + skeleton.x;
            m.ty = y * sy + skeleton.y;
            return;
        }

        let pa = parent.matrix.a, pb = parent.matrix.c, pc = parent.matrix.b, pd = parent.matrix.d;
        m.tx = pa * x + pb * y + parent.matrix.tx;
        m.ty = pc * x + pd * y + parent.matrix.ty;
        switch (this.data.transformMode) {
            case TransformMode.Normal: {
                let rotationY = rotation + 90 + shearY;
                let la = MathUtils.cosDeg(rotation + shearX) * scaleX;
                let lb = MathUtils.cosDeg(rotationY) * scaleY;
                let lc = MathUtils.sinDeg(rotation + shearX) * scaleX;
                let ld = MathUtils.sinDeg(rotationY) * scaleY;
                m.a = pa * la + pb * lc;
                m.c = pa * lb + pb * ld;
                m.b = pc * la + pd * lc;
                m.d = pc * lb + pd * ld;
                return;
            }
            case TransformMode.OnlyTranslation: {
                let rotationY = rotation + 90 + shearY;
                m.a = MathUtils.cosDeg(rotation + shearX) * scaleX;
                m.c = MathUtils.cosDeg(rotationY) * scaleY;
                m.b = MathUtils.sinDeg(rotation + shearX) * scaleX;
                m.d = MathUtils.sinDeg(rotationY) * scaleY;
                break;
            }
            case TransformMode.NoRotationOrReflection: {
                let s = pa * pa + pc * pc;
                let prx = 0;
                if (s > 0.0001) {
                    s = Math.abs(pa * pd - pb * pc) / s;
                    pa /= this.skeleton.scaleX;
                    pc /= this.skeleton.scaleY;
                    pb = pc * s;
                    pd = pa * s;
                    prx = Math.atan2(pc, pa) * MathUtils.radDeg;
                } else {
                    pa = 0;
                    pc = 0;
                    prx = 90 - Math.atan2(pd, pb) * MathUtils.radDeg;
                }
                let rx = rotation + shearX - prx;
                let ry = rotation + shearY - prx + 90;
                let la = MathUtils.cosDeg(rx) * scaleX;
                let lb = MathUtils.cosDeg(ry) * scaleY;
                let lc = MathUtils.sinDeg(rx) * scaleX;
                let ld = MathUtils.sinDeg(ry) * scaleY;
                m.a = pa * la - pb * lc;
                m.c = pa * lb - pb * ld;
                m.b = pc * la + pd * lc;
                m.d = pc * lb + pd * ld;
                break;
            }
            case TransformMode.NoScale:
            case TransformMode.NoScaleOrReflection: {
                let cos = MathUtils.cosDeg(rotation);
                let sin = MathUtils.sinDeg(rotation);
                let za = (pa * cos + pb * sin) / sx;
                let zc = (pc * cos + pd * sin) / sy;
                let s = Math.sqrt(za * za + zc * zc);
                if (s > 0.00001) s = 1 / s;
                za *= s;
                zc *= s;
                s = Math.sqrt(za * za + zc * zc);
                if (
                    this.data.transformMode == TransformMode.NoScale
                    && (pa * pd - pb * pc < 0) != (settings.yDown?
                    (this.skeleton.scaleX < 0 != this.skeleton.scaleY > 0) :
                        (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0))
                ) s = -s;
                let r = Math.PI / 2 + Math.atan2(zc, za);
                let zb = Math.cos(r) * s;
                let zd = Math.sin(r) * s;
                let la = MathUtils.cosDeg(shearX) * scaleX;
                let lb = MathUtils.cosDeg(90 + shearY) * scaleY;
                let lc = MathUtils.sinDeg(shearX) * scaleX;
                let ld = MathUtils.sinDeg(90 + shearY) * scaleY;
                m.a = za * la + zb * lc;
                m.c = za * lb + zb * ld;
                m.b = zc * la + zd * lc;
                m.d = zc * lb + zd * ld;
                break;
            }
        }
        m.a *= sx;
        m.c *= sx;
        m.b *= sy;
        m.d *= sy;
    }

    setToSetupPose() {
        let data = this.data;
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
        this.scaleX = data.scaleX;
        this.scaleY = data.scaleY;
        this.shearX = data.shearX;
        this.shearY = data.shearY;
    }

    getWorldRotationX() {
        return Math.atan2(this.matrix.b, this.matrix.a) * MathUtils.radDeg;
    }

    getWorldRotationY() {
        return Math.atan2(this.matrix.d, this.matrix.c) * MathUtils.radDeg;
    }

    getWorldScaleX() {
        let m = this.matrix;
        return Math.sqrt(m.a * m.a + m.c * m.c);
    }

    getWorldScaleY() {
        let m = this.matrix;
        return Math.sqrt(m.b * m.b + m.d * m.d);
    }

    /** Computes the individual applied transform values from the world transform. This can be useful to perform processing using
     * the applied transform after the world transform has been modified directly (eg, by a constraint).
     * <p>
     * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. */
    updateAppliedTransform() {
        this.appliedValid = true;
        let parent = this.parent;
        let m = this.matrix;
        if (parent == null) {
            this.ax = m.tx;
            this.ay = m.ty;
            this.arotation = Math.atan2(m.b, m.a) * MathUtils.radDeg;
            this.ascaleX = Math.sqrt(m.a * m.a + m.b * m.b);
            this.ascaleY = Math.sqrt(m.c * m.c + m.d * m.d);
            this.ashearX = 0;
            this.ashearY = Math.atan2(m.a * m.c + m.b * m.d, m.a * m.d - m.b * m.c) * MathUtils.radDeg;
            return;
        }
        let pm = parent.matrix;
        let pid = 1 / (pm.a * pm.d - pm.b * pm.c);
        let dx = m.tx - pm.tx, dy = m.ty - pm.ty;
        this.ax = (dx * pm.d * pid - dy * pm.c * pid);
        this.ay = (dy * pm.a * pid - dx * pm.b * pid);
        let ia = pid * pm.d;
        let id = pid * pm.a;
        let ib = pid * pm.c;
        let ic = pid * pm.b;
        let ra = ia * m.a - ib * m.b;
        let rb = ia * m.c - ib * m.d;
        let rc = id * m.b - ic * m.a;
        let rd = id * m.d - ic * m.c;
        this.ashearX = 0;
        this.ascaleX = Math.sqrt(ra * ra + rc * rc);
        if (this.ascaleX > 0.0001) {
            let det = ra * rd - rb * rc;
            this.ascaleY = det / this.ascaleX;
            this.ashearY = Math.atan2(ra * rb + rc * rd, det) * MathUtils.radDeg;
            this.arotation = Math.atan2(rc, ra) * MathUtils.radDeg;
        } else {
            this.ascaleX = 0;
            this.ascaleY = Math.sqrt(rb * rb + rd * rd);
            this.ashearY = 0;
            this.arotation = 90 - Math.atan2(rd, rb) * MathUtils.radDeg;
        }
    }

    worldToLocal(world) {
        let m = this.matrix;
        let a = m.a, b = m.c, c = m.b, d = m.d;
        let invDet = 1 / (a * d - b * c);
        let x = world.x - m.tx, y = world.y - m.ty;
        world.x = (x * d * invDet - y * b * invDet);
        world.y = (y * a * invDet - x * c * invDet);
        return world;
    }

    localToWorld(local) {
        let m = this.matrix;
        let x = local.x, y = local.y;
        local.x = x * m.a + y * m.c + m.tx;
        local.y = x * m.b + y * m.d + m.ty;
        return local;
    }

    worldToLocalRotation (worldRotation) {
        let sin = MathUtils.sinDeg(worldRotation), cos = MathUtils.cosDeg(worldRotation);
        let mat = this.matrix;
        return Math.atan2(mat.a * sin - mat.b * cos, mat.d * cos - mat.c * sin) * MathUtils.radDeg;
    }

    localToWorldRotation (localRotation) {
        let sin = MathUtils.sinDeg(localRotation), cos = MathUtils.cosDeg(localRotation);
        let mat = this.matrix;
        return Math.atan2(cos * mat.b + sin * mat.d, cos * mat.a + sin * mat.c) * MathUtils.radDeg;
    }

    rotateWorld (degrees) {
        let mat = this.matrix;
        let a = mat.a, b = mat.c, c = mat.b, d = mat.d;
        let cos = MathUtils.cosDeg(degrees), sin = MathUtils.sinDeg(degrees);
        mat.a = cos * a - sin * c;
        mat.c = cos * b - sin * d;
        mat.b = sin * a + cos * c;
        mat.d = sin * b + cos * d;
        this.appliedValid = false;
    }
}

/**
 * @public
 */
class ConstraintData {
    constructor( name,  order,  skinRequired) {this.name = name;this.order = order;this.skinRequired = skinRequired; }
}

/**
 * @public
 */
class Event {
    
    
    
    
    
    
    


    constructor(time, data) {
        if (data == null) throw new Error("data cannot be null.");
        this.time = time;
        this.data = data;
    }
}

/**
 * @public
 */
class EventData {
    
    
    
    
    
    
    

    constructor (name) {
        this.name = name;
    }
}

/**
 * @public
 */
class IkConstraint  {
    
    
    
    __init() {this.bendDirection = 0;}
    __init2() {this.compress = false;}
    __init3() {this.stretch = false;}
    __init4() {this.mix = 1;}
    __init5() {this.softness = 0;}
    __init6() {this.active = false;}

    constructor (data, skeleton) {IkConstraint.prototype.__init.call(this);IkConstraint.prototype.__init2.call(this);IkConstraint.prototype.__init3.call(this);IkConstraint.prototype.__init4.call(this);IkConstraint.prototype.__init5.call(this);IkConstraint.prototype.__init6.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        this.data = data;
        this.mix = data.mix;
        this.softness = data.softness;
        this.bendDirection = data.bendDirection;
        this.compress = data.compress;
        this.stretch = data.stretch;

        this.bones = new Array();
        for (let i = 0; i < data.bones.length; i++)
            this.bones.push(skeleton.findBone(data.bones[i].name));
        this.target = skeleton.findBone(data.target.name);
    }

    isActive () {
        return this.active;
    }

    apply () {
        this.update();
    }

    update () {
        let target = this.target;
        let bones = this.bones;
        switch (bones.length) {
            case 1:
                this.apply1(bones[0], target.worldX, target.worldY, this.compress, this.stretch, this.data.uniform, this.mix);
                break;
            case 2:
                this.apply2(bones[0], bones[1], target.worldX, target.worldY, this.bendDirection, this.stretch, this.softness, this.mix);
                break;
        }
    }

    /** Adjusts the bone rotation so the tip is as close to the target position as possible. The target is specified in the world
     * coordinate system. */
    apply1 (bone, targetX, targetY, compress, stretch, uniform, alpha) {
        if (!bone.appliedValid) bone.updateAppliedTransform();
        let p = bone.parent.matrix;


        let pa = p.a, pb = p.c, pc = p.b, pd = p.d;
        let rotationIK = -bone.ashearX - bone.arotation, tx = 0, ty = 0;

        switch(bone.data.transformMode) {
            case TransformMode.OnlyTranslation:
                tx = targetX - bone.worldX;
                ty = targetY - bone.worldY;
                break;
            case TransformMode.NoRotationOrReflection:
                let s = Math.abs(pa * pd - pb * pc) / (pa * pa + pc * pc);
                let sa = pa / bone.skeleton.scaleX;
                let sc = pc / bone.skeleton.scaleY;
                pb = -sc * s * bone.skeleton.scaleX;
                pd = sa * s * bone.skeleton.scaleY;
                rotationIK += Math.atan2(sc, sa) * MathUtils.radDeg;
            // Fall through
            default:
                let x = targetX - p.tx, y = targetY - p.ty;
                let d = pa * pd - pb * pc;
                tx = (x * pd - y * pb) / d - bone.ax;
                ty = (y * pa - x * pc) / d - bone.ay;
        }
        rotationIK += Math.atan2(ty, tx) * MathUtils.radDeg;

        if (bone.ascaleX < 0) rotationIK += 180;
        if (rotationIK > 180)
            rotationIK -= 360;
        else if (rotationIK < -180) rotationIK += 360;
        let sx = bone.ascaleX, sy = bone.ascaleY;
        if (compress || stretch) {
            switch (bone.data.transformMode) {
                case TransformMode.NoScale:
                case TransformMode.NoScaleOrReflection:
                    tx = targetX - bone.worldX;
                    ty = targetY - bone.worldY;
            }
            let b = bone.data.length * sx, dd = Math.sqrt(tx * tx + ty * ty);
            if ((compress && dd < b) || (stretch && dd > b) && b > 0.0001) {
                let s = (dd / b - 1) * alpha + 1;
                sx *= s;
                if (uniform) sy *= s;
            }
        }
        bone.updateWorldTransformWith(bone.ax, bone.ay, bone.arotation + rotationIK * alpha, sx, sy, bone.ashearX,
            bone.ashearY);
    }

    /** Adjusts the parent and child bone rotations so the tip of the child is as close to the target position as possible. The
     * target is specified in the world coordinate system.
     * @param child A direct descendant of the parent bone. */
    apply2 (parent, child, targetX, targetY, bendDir, stretch, softness, alpha) {
        if (alpha == 0) {
            child.updateWorldTransform();
            return;
        }
        if (!parent.appliedValid) parent.updateAppliedTransform();
        if (!child.appliedValid) child.updateAppliedTransform();
        let px = parent.ax, py = parent.ay, psx = parent.ascaleX, sx = psx, psy = parent.ascaleY, csx = child.ascaleX;
        let pmat = parent.matrix;
        let os1 = 0, os2 = 0, s2 = 0;
        if (psx < 0) {
            psx = -psx;
            os1 = 180;
            s2 = -1;
        } else {
            os1 = 0;
            s2 = 1;
        }
        if (psy < 0) {
            psy = -psy;
            s2 = -s2;
        }
        if (csx < 0) {
            csx = -csx;
            os2 = 180;
        } else
            os2 = 0;
        let cx = child.ax, cy = 0, cwx = 0, cwy = 0, a = pmat.a, b = pmat.c, c = pmat.b, d = pmat.d;
        let u = Math.abs(psx - psy) <= 0.0001;
        if (!u) {
            cy = 0;
            cwx = a * cx + pmat.tx;
            cwy = c * cx + pmat.ty;
        } else {
            cy = child.ay;
            cwx = a * cx + b * cy + pmat.tx;
            cwy = c * cx + d * cy + pmat.ty;
        }
        let pp = parent.parent.matrix;
        a = pp.a;
        b = pp.c;
        c = pp.b;
        d = pp.d;
        let id = 1 / (a * d - b * c), x = cwx - pp.tx, y = cwy - pp.ty;
        let dx = (x * d - y * b) * id - px, dy = (y * a - x * c) * id - py;
        let l1 = Math.sqrt(dx * dx + dy * dy), l2 = child.data.length * csx, a1, a2;
        if (l1 < 0.0001) {
            this.apply1(parent, targetX, targetY, false, stretch, false, alpha);
            child.updateWorldTransformWith(cx, cy, 0, child.ascaleX, child.ascaleY, child.ashearX, child.ashearY);
            return;
        }
        x = targetX - pp.tx;
        y = targetY - pp.ty;
        let tx = (x * d - y * b) * id - px, ty = (y * a - x * c) * id - py;
        let dd = tx * tx + ty * ty;
        if (softness != 0) {
            softness *= psx * (csx + 1) / 2;
            let td = Math.sqrt(dd), sd = td - l1 - l2 * psx + softness;
            if (sd > 0) {
                let p = Math.min(1, sd / (softness * 2)) - 1;
                p = (sd - softness * (1 - p * p)) / td;
                tx -= p * tx;
                ty -= p * ty;
                dd = tx * tx + ty * ty;
            }
        }
        outer:
            if (u) {
                l2 *= psx;
                let cos = (dd - l1 * l1 - l2 * l2) / (2 * l1 * l2);
                if (cos < -1)
                    cos = -1;
                else if (cos > 1) {
                    cos = 1;
                    if (stretch) sx *= (Math.sqrt(dd) / (l1 + l2) - 1) * alpha + 1;
                }
                a2 = Math.acos(cos) * bendDir;
                a = l1 + l2 * cos;
                b = l2 * Math.sin(a2);
                a1 = Math.atan2(ty * a - tx * b, tx * a + ty * b);
            } else {
                a = psx * l2;
                b = psy * l2;
                let aa = a * a, bb = b * b, ta = Math.atan2(ty, tx);
                c = bb * l1 * l1 + aa * dd - aa * bb;
                let c1 = -2 * bb * l1, c2 = bb - aa;
                d = c1 * c1 - 4 * c2 * c;
                if (d >= 0) {
                    let q = Math.sqrt(d);
                    if (c1 < 0) q = -q;
                    q = -(c1 + q) / 2;
                    let r0 = q / c2, r1 = c / q;
                    let r = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
                    if (r * r <= dd) {
                        y = Math.sqrt(dd - r * r) * bendDir;
                        a1 = ta - Math.atan2(y, r);
                        a2 = Math.atan2(y / psy, (r - l1) / psx);
                        break outer;
                    }
                }
                let minAngle = MathUtils.PI, minX = l1 - a, minDist = minX * minX, minY = 0;
                let maxAngle = 0, maxX = l1 + a, maxDist = maxX * maxX, maxY = 0;
                c = -a * l1 / (aa - bb);
                if (c >= -1 && c <= 1) {
                    c = Math.acos(c);
                    x = a * Math.cos(c) + l1;
                    y = b * Math.sin(c);
                    d = x * x + y * y;
                    if (d < minDist) {
                        minAngle = c;
                        minDist = d;
                        minX = x;
                        minY = y;
                    }
                    if (d > maxDist) {
                        maxAngle = c;
                        maxDist = d;
                        maxX = x;
                        maxY = y;
                    }
                }
                if (dd <= (minDist + maxDist) / 2) {
                    a1 = ta - Math.atan2(minY * bendDir, minX);
                    a2 = minAngle * bendDir;
                } else {
                    a1 = ta - Math.atan2(maxY * bendDir, maxX);
                    a2 = maxAngle * bendDir;
                }
            }
        let os = Math.atan2(cy, cx) * s2;
        let rotation = parent.arotation;
        a1 = (a1 - os) * MathUtils.radDeg + os1 - rotation;
        if (a1 > 180)
            a1 -= 360;
        else if (a1 < -180) a1 += 360;
        parent.updateWorldTransformWith(px, py, rotation + a1 * alpha, sx, parent.ascaleY, 0, 0);
        rotation = child.arotation;
        a2 = ((a2 + os) * MathUtils.radDeg - child.ashearX) * s2 + os2 - rotation;
        if (a2 > 180)
            a2 -= 360;
        else if (a2 < -180) a2 += 360;
        child.updateWorldTransformWith(cx, cy, rotation + a2 * alpha, child.ascaleX, child.ascaleY, child.ashearX, child.ashearY);
    }
}

/**
 * @public
 */
class IkConstraintData extends ConstraintData {
    __init() {this.bones = new Array();}
    
    __init2() {this.bendDirection = 1;}
    __init3() {this.compress = false;}
    __init4() {this.stretch = false;}
    __init5() {this.uniform = false;}
    __init6() {this.mix = 1;}
    __init7() {this.softness = 0;}

    constructor (name) {
        super(name, 0, false);IkConstraintData.prototype.__init.call(this);IkConstraintData.prototype.__init2.call(this);IkConstraintData.prototype.__init3.call(this);IkConstraintData.prototype.__init4.call(this);IkConstraintData.prototype.__init5.call(this);IkConstraintData.prototype.__init6.call(this);IkConstraintData.prototype.__init7.call(this);    }
}

/**
 * @public
 */
class PathConstraintData extends ConstraintData {
    __init() {this.bones = new Array();}
    
    
    
    
    
       

    constructor (name) {
        super(name, 0, false);PathConstraintData.prototype.__init.call(this);    }
}
/**
 * @public
 */
var PositionMode; (function (PositionMode) {
    const Fixed = 0; PositionMode[PositionMode["Fixed"] = Fixed] = "Fixed"; const Percent = Fixed + 1; PositionMode[PositionMode["Percent"] = Percent] = "Percent";
})(PositionMode || (PositionMode = {}));
/**
 * @public
 */
var SpacingMode; (function (SpacingMode) {
    const Length = 0; SpacingMode[SpacingMode["Length"] = Length] = "Length"; const Fixed = Length + 1; SpacingMode[SpacingMode["Fixed"] = Fixed] = "Fixed"; const Percent = Fixed + 1; SpacingMode[SpacingMode["Percent"] = Percent] = "Percent";
})(SpacingMode || (SpacingMode = {}));
/**
 * @public
 */
var RotateMode; (function (RotateMode) {
    const Tangent = 0; RotateMode[RotateMode["Tangent"] = Tangent] = "Tangent"; const Chain = Tangent + 1; RotateMode[RotateMode["Chain"] = Chain] = "Chain"; const ChainScale = Chain + 1; RotateMode[RotateMode["ChainScale"] = ChainScale] = "ChainScale";
})(RotateMode || (RotateMode = {}));

/**
 * @public
 */
class PathConstraint  {
    static __initStatic() {this.NONE = -1;} static __initStatic2() {this.BEFORE = -2;} static __initStatic3() {this.AFTER = -3;}
    static __initStatic4() {this.epsilon = 0.00001;}

    
    
    
    __init() {this.position = 0;} __init2() {this.spacing = 0;} __init3() {this.rotateMix = 0;} __init4() {this.translateMix = 0;}

    __init5() {this.spaces = new Array();} __init6() {this.positions = new Array();}
    __init7() {this.world = new Array();} __init8() {this.curves = new Array();} __init9() {this.lengths = new Array();}
    __init10() {this.segments = new Array();}

    __init11() {this.active = false;}

    constructor (data, skeleton) {PathConstraint.prototype.__init.call(this);PathConstraint.prototype.__init2.call(this);PathConstraint.prototype.__init3.call(this);PathConstraint.prototype.__init4.call(this);PathConstraint.prototype.__init5.call(this);PathConstraint.prototype.__init6.call(this);PathConstraint.prototype.__init7.call(this);PathConstraint.prototype.__init8.call(this);PathConstraint.prototype.__init9.call(this);PathConstraint.prototype.__init10.call(this);PathConstraint.prototype.__init11.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        this.data = data;
        this.bones = new Array();
        for (let i = 0, n = data.bones.length; i < n; i++)
            this.bones.push(skeleton.findBone(data.bones[i].name));
        this.target = skeleton.findSlot(data.target.name);
        this.position = data.position;
        this.spacing = data.spacing;
        this.rotateMix = data.rotateMix;
        this.translateMix = data.translateMix;
    }

    isActive () {
        return this.active;
    }

    apply () {
        this.update();
    }

    update () {
        let attachment = this.target.getAttachment();
        if (!(attachment instanceof PathAttachment)) return;

        let rotateMix = this.rotateMix, translateMix = this.translateMix;
        let translate = translateMix > 0, rotate = rotateMix > 0;
        if (!translate && !rotate) return;

        let data = this.data;
        let spacingMode = data.spacingMode;
        let lengthSpacing = spacingMode == SpacingMode.Length;
        let rotateMode = data.rotateMode;
        let tangents = rotateMode == RotateMode.Tangent, scale = rotateMode == RotateMode.ChainScale;
        let boneCount = this.bones.length, spacesCount = tangents ? boneCount : boneCount + 1;
        let bones = this.bones;
        let spaces = Utils.setArraySize(this.spaces, spacesCount), lengths = null;
        let spacing = this.spacing;
        if (scale || lengthSpacing) {
            if (scale) lengths = Utils.setArraySize(this.lengths, boneCount);
            for (let i = 0, n = spacesCount - 1; i < n;) {
                let bone = bones[i];
                let setupLength = bone.data.length;
                if (setupLength < PathConstraint.epsilon) {
                    if (scale) lengths[i] = 0;
                    spaces[++i] = 0;
                } else {
                    let x = setupLength * bone.matrix.a, y = setupLength * bone.matrix.b;
                    let length = Math.sqrt(x * x + y * y);
                    if (scale) lengths[i] = length;
                    spaces[++i] = (lengthSpacing ? setupLength + spacing : spacing) * length / setupLength;
                }
            }
        } else {
            for (let i = 1; i < spacesCount; i++)
                spaces[i] = spacing;
        }

        let positions = this.computeWorldPositions(attachment, spacesCount, tangents,
            data.positionMode == PositionMode.Percent, spacingMode == SpacingMode.Percent);
        let boneX = positions[0], boneY = positions[1], offsetRotation = data.offsetRotation;
        let tip = false;
        if (offsetRotation == 0)
            tip = rotateMode == RotateMode.Chain;
        else {
            tip = false;
            let p = this.target.bone.matrix;
            offsetRotation *= p.a * p.d - p.b * p.c > 0 ? MathUtils.degRad : -MathUtils.degRad;
        }
        for (let i = 0, p = 3; i < boneCount; i++, p += 3) {
            let bone = bones[i];
            let mat = bone.matrix;
            mat.tx += (boneX - mat.tx) * translateMix;
            mat.ty += (boneY - mat.ty) * translateMix;
            let x = positions[p], y = positions[p + 1], dx = x - boneX, dy = y - boneY;
            if (scale) {
                let length = lengths[i];
                if (length != 0) {
                    let s = (Math.sqrt(dx * dx + dy * dy) / length - 1) * rotateMix + 1;
                    mat.a *= s;
                    mat.b *= s;
                }
            }
            boneX = x;
            boneY = y;
            if (rotate) {
                let a = mat.a, b = mat.c, c = mat.b, d = mat.d, r = 0, cos = 0, sin = 0;
                if (tangents)
                    r = positions[p - 1];
                else if (spaces[i + 1] == 0)
                    r = positions[p + 2];
                else
                    r = Math.atan2(dy, dx);
                r -= Math.atan2(c, a);
                if (tip) {
                    cos = Math.cos(r);
                    sin = Math.sin(r);
                    let length = bone.data.length;
                    boneX += (length * (cos * a - sin * c) - dx) * rotateMix;
                    boneY += (length * (sin * a + cos * c) - dy) * rotateMix;
                } else {
                    r += offsetRotation;
                }
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) //
                    r += MathUtils.PI2;
                r *= rotateMix;
                cos = Math.cos(r);
                sin = Math.sin(r);
                mat.a = cos * a - sin * c;
                mat.c = cos * b - sin * d;
                mat.b = sin * a + cos * c;
                mat.d = sin * b + cos * d;
            }
            bone.appliedValid = false;
        }
    }

    computeWorldPositions (path, spacesCount, tangents, percentPosition,
                           percentSpacing) {
        let target = this.target;
        let position = this.position;
        let spaces = this.spaces, out = Utils.setArraySize(this.positions, spacesCount * 3 + 2), world = null;
        let closed = path.closed;
        let verticesLength = path.worldVerticesLength, curveCount = verticesLength / 6, prevCurve = PathConstraint.NONE;

        if (!path.constantSpeed) {
            let lengths = path.lengths;
            curveCount -= closed ? 1 : 2;
            let pathLength = lengths[curveCount];
            if (percentPosition) position *= pathLength;
            if (percentSpacing) {
                for (let i = 0; i < spacesCount; i++)
                    spaces[i] *= pathLength;
            }
            world = Utils.setArraySize(this.world, 8);
            for (let i = 0, o = 0, curve = 0; i < spacesCount; i++, o += 3) {
                let space = spaces[i];
                position += space;
                let p = position;

                if (closed) {
                    p %= pathLength;
                    if (p < 0) p += pathLength;
                    curve = 0;
                } else if (p < 0) {
                    if (prevCurve != PathConstraint.BEFORE) {
                        prevCurve = PathConstraint.BEFORE;
                        path.computeWorldVertices(target, 2, 4, world, 0, 2);
                    }
                    this.addBeforePosition(p, world, 0, out, o);
                    continue;
                } else if (p > pathLength) {
                    if (prevCurve != PathConstraint.AFTER) {
                        prevCurve = PathConstraint.AFTER;
                        path.computeWorldVertices(target, verticesLength - 6, 4, world, 0, 2);
                    }
                    this.addAfterPosition(p - pathLength, world, 0, out, o);
                    continue;
                }

                // Determine curve containing position.
                for (;; curve++) {
                    let length = lengths[curve];
                    if (p > length) continue;
                    if (curve == 0)
                        p /= length;
                    else {
                        let prev = lengths[curve - 1];
                        p = (p - prev) / (length - prev);
                    }
                    break;
                }
                if (curve != prevCurve) {
                    prevCurve = curve;
                    if (closed && curve == curveCount) {
                        path.computeWorldVertices(target, verticesLength - 4, 4, world, 0, 2);
                        path.computeWorldVertices(target, 0, 4, world, 4, 2);
                    } else
                        path.computeWorldVertices(target, curve * 6 + 2, 8, world, 0, 2);
                }
                this.addCurvePosition(p, world[0], world[1], world[2], world[3], world[4], world[5], world[6], world[7], out, o,
                    tangents || (i > 0 && space == 0));
            }
            return out;
        }

        // World vertices.
        if (closed) {
            verticesLength += 2;
            world = Utils.setArraySize(this.world, verticesLength);
            path.computeWorldVertices(target, 2, verticesLength - 4, world, 0, 2);
            path.computeWorldVertices(target, 0, 2, world, verticesLength - 4, 2);
            world[verticesLength - 2] = world[0];
            world[verticesLength - 1] = world[1];
        } else {
            curveCount--;
            verticesLength -= 4;
            world = Utils.setArraySize(this.world, verticesLength);
            path.computeWorldVertices(target, 2, verticesLength, world, 0, 2);
        }

        // Curve lengths.
        let curves = Utils.setArraySize(this.curves, curveCount);
        let pathLength = 0;
        let x1 = world[0], y1 = world[1], cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0, x2 = 0, y2 = 0;
        let tmpx = 0, tmpy = 0, dddfx = 0, dddfy = 0, ddfx = 0, ddfy = 0, dfx = 0, dfy = 0;
        for (let i = 0, w = 2; i < curveCount; i++, w += 6) {
            cx1 = world[w];
            cy1 = world[w + 1];
            cx2 = world[w + 2];
            cy2 = world[w + 3];
            x2 = world[w + 4];
            y2 = world[w + 5];
            tmpx = (x1 - cx1 * 2 + cx2) * 0.1875;
            tmpy = (y1 - cy1 * 2 + cy2) * 0.1875;
            dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.09375;
            dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.09375;
            ddfx = tmpx * 2 + dddfx;
            ddfy = tmpy * 2 + dddfy;
            dfx = (cx1 - x1) * 0.75 + tmpx + dddfx * 0.16666667;
            dfy = (cy1 - y1) * 0.75 + tmpy + dddfy * 0.16666667;
            pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
            dfx += ddfx;
            dfy += ddfy;
            pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
            dfx += ddfx + dddfx;
            dfy += ddfy + dddfy;
            pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
            curves[i] = pathLength;
            x1 = x2;
            y1 = y2;
        }
        if (percentPosition) position *= pathLength;
        if (percentSpacing) {
            for (let i = 0; i < spacesCount; i++)
                spaces[i] *= pathLength;
        }

        let segments = this.segments;
        let curveLength = 0;
        for (let i = 0, o = 0, curve = 0, segment = 0; i < spacesCount; i++, o += 3) {
            let space = spaces[i];
            position += space;
            let p = position;

            if (closed) {
                p %= pathLength;
                if (p < 0) p += pathLength;
                curve = 0;
            } else if (p < 0) {
                this.addBeforePosition(p, world, 0, out, o);
                continue;
            } else if (p > pathLength) {
                this.addAfterPosition(p - pathLength, world, verticesLength - 4, out, o);
                continue;
            }

            // Determine curve containing position.
            for (;; curve++) {
                let length = curves[curve];
                if (p > length) continue;
                if (curve == 0)
                    p /= length;
                else {
                    let prev = curves[curve - 1];
                    p = (p - prev) / (length - prev);
                }
                break;
            }

            // Curve segment lengths.
            if (curve != prevCurve) {
                prevCurve = curve;
                let ii = curve * 6;
                x1 = world[ii];
                y1 = world[ii + 1];
                cx1 = world[ii + 2];
                cy1 = world[ii + 3];
                cx2 = world[ii + 4];
                cy2 = world[ii + 5];
                x2 = world[ii + 6];
                y2 = world[ii + 7];
                tmpx = (x1 - cx1 * 2 + cx2) * 0.03;
                tmpy = (y1 - cy1 * 2 + cy2) * 0.03;
                dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.006;
                dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.006;
                ddfx = tmpx * 2 + dddfx;
                ddfy = tmpy * 2 + dddfy;
                dfx = (cx1 - x1) * 0.3 + tmpx + dddfx * 0.16666667;
                dfy = (cy1 - y1) * 0.3 + tmpy + dddfy * 0.16666667;
                curveLength = Math.sqrt(dfx * dfx + dfy * dfy);
                segments[0] = curveLength;
                for (ii = 1; ii < 8; ii++) {
                    dfx += ddfx;
                    dfy += ddfy;
                    ddfx += dddfx;
                    ddfy += dddfy;
                    curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                    segments[ii] = curveLength;
                }
                dfx += ddfx;
                dfy += ddfy;
                curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                segments[8] = curveLength;
                dfx += ddfx + dddfx;
                dfy += ddfy + dddfy;
                curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
                segments[9] = curveLength;
                segment = 0;
            }

            // Weight by segment length.
            p *= curveLength;
            for (;; segment++) {
                let length = segments[segment];
                if (p > length) continue;
                if (segment == 0)
                    p /= length;
                else {
                    let prev = segments[segment - 1];
                    p = segment + (p - prev) / (length - prev);
                }
                break;
            }
            this.addCurvePosition(p * 0.1, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents || (i > 0 && space == 0));
        }
        return out;
    }

    addBeforePosition (p, temp, i, out, o) {
        let x1 = temp[i], y1 = temp[i + 1], dx = temp[i + 2] - x1, dy = temp[i + 3] - y1, r = Math.atan2(dy, dx);
        out[o] = x1 + p * Math.cos(r);
        out[o + 1] = y1 + p * Math.sin(r);
        out[o + 2] = r;
    }

    addAfterPosition (p, temp, i, out, o) {
        let x1 = temp[i + 2], y1 = temp[i + 3], dx = x1 - temp[i], dy = y1 - temp[i + 1], r = Math.atan2(dy, dx);
        out[o] = x1 + p * Math.cos(r);
        out[o + 1] = y1 + p * Math.sin(r);
        out[o + 2] = r;
    }

    addCurvePosition (p, x1, y1, cx1, cy1, cx2, cy2, x2, y2,
                      out, o, tangents) {
        if (p == 0 || isNaN(p)) p = 0.0001;
        let tt = p * p, ttt = tt * p, u = 1 - p, uu = u * u, uuu = uu * u;
        let ut = u * p, ut3 = ut * 3, uut3 = u * ut3, utt3 = ut3 * p;
        let x = x1 * uuu + cx1 * uut3 + cx2 * utt3 + x2 * ttt, y = y1 * uuu + cy1 * uut3 + cy2 * utt3 + y2 * ttt;
        out[o] = x;
        out[o + 1] = y;
        if (tangents) out[o + 2] = Math.atan2(y - (y1 * uu + cy1 * ut * 2 + cy2 * tt), x - (x1 * uu + cx1 * ut * 2 + cx2 * tt));
    }
} PathConstraint.__initStatic(); PathConstraint.__initStatic2(); PathConstraint.__initStatic3(); PathConstraint.__initStatic4();

/**
 * @public
 */
class Slot  {
    //this is canon
    
    
    
    
    
    
    
    
    __init() {this.deform = new Array();}

    constructor (data, bone) {Slot.prototype.__init.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (bone == null) throw new Error("bone cannot be null.");
        this.data = data;
        this.bone = bone;
        this.color = new Color();
        this.darkColor = data.darkColor == null ? null : new Color();
        this.setToSetupPose();

        this.blendMode = this.data.blendMode;
    }

    /** @return May be null. */
    getAttachment () {
        return this.attachment;
    }

    /** Sets the attachment and if it changed, resets {@link #getAttachmentTime()} and clears {@link #getAttachmentVertices()}.
     * @param attachment May be null. */
    setAttachment (attachment) {
        if (this.attachment == attachment) return;
        this.attachment = attachment;
        this.attachmentTime = this.bone.skeleton.time;
        this.deform.length = 0;
    }

    setAttachmentTime (time) {
        this.attachmentTime = this.bone.skeleton.time - time;
    }

    /** Returns the time since the attachment was set. */
    getAttachmentTime () {
        return this.bone.skeleton.time - this.attachmentTime;
    }

    setToSetupPose () {
        this.color.setFromColor(this.data.color);
        if (this.darkColor != null) this.darkColor.setFromColor(this.data.darkColor);
        if (this.data.attachmentName == null)
            this.attachment = null;
        else {
            this.attachment = null;
            this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName));
        }
    }
}

/**
 * @public
 */
class TransformConstraint  {
    
    
    
    __init() {this.rotateMix = 0;}
    __init2() {this.translateMix = 0;}
    __init3() {this.scaleMix = 0;}
    __init4() {this.shearMix = 0;}
    __init5() {this.temp = new Vector2();}
    __init6() {this.active = false;}

    constructor(data, skeleton) {TransformConstraint.prototype.__init.call(this);TransformConstraint.prototype.__init2.call(this);TransformConstraint.prototype.__init3.call(this);TransformConstraint.prototype.__init4.call(this);TransformConstraint.prototype.__init5.call(this);TransformConstraint.prototype.__init6.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        this.data = data;
        this.rotateMix = data.rotateMix;
        this.translateMix = data.translateMix;
        this.scaleMix = data.scaleMix;
        this.shearMix = data.shearMix;
        this.bones = new Array();
        for (let i = 0; i < data.bones.length; i++)
            this.bones.push(skeleton.findBone(data.bones[i].name));
        this.target = skeleton.findBone(data.target.name);
    }

    isActive () {
        return this.active;
    }

    apply() {
        this.update();
    }

    update() {
        if (this.data.local) {
            if (this.data.relative)
                this.applyRelativeLocal();
            else
                this.applyAbsoluteLocal();

        } else {
            if (this.data.relative)
                this.applyRelativeWorld();
            else
                this.applyAbsoluteWorld();
        }
    }

    applyAbsoluteWorld() {
        let rotateMix = this.rotateMix, translateMix = this.translateMix, scaleMix = this.scaleMix,
            shearMix = this.shearMix;
        let target = this.target;
        let targetMat = target.matrix;
        let ta = targetMat.a, tb = targetMat.c, tc = targetMat.b, td = targetMat.d;
        let degRadReflect = ta * td - tb * tc > 0 ? MathUtils.degRad : -MathUtils.degRad;
        let offsetRotation = this.data.offsetRotation * degRadReflect;
        let offsetShearY = this.data.offsetShearY * degRadReflect;
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            let modified = false;
            let mat = bone.matrix;

            if (rotateMix != 0) {
                let a = mat.a, b = mat.c, c = mat.b, d = mat.d;
                let r = Math.atan2(tc, ta) - Math.atan2(c, a) + offsetRotation;
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI)
                    r += MathUtils.PI2;
                r *= rotateMix;
                let cos = Math.cos(r), sin = Math.sin(r);
                mat.a = cos * a - sin * c;
                mat.c = cos * b - sin * d;
                mat.b = sin * a + cos * c;
                mat.d = sin * b + cos * d;
                modified = true;
            }

            if (translateMix != 0) {
                let temp = this.temp;
                target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                mat.tx += (temp.x - mat.tx) * translateMix;
                mat.ty += (temp.y - mat.ty) * translateMix;
                modified = true;
            }

            if (scaleMix > 0) {
                let s = Math.sqrt(mat.a * mat.a + mat.b * mat.b);
                let ts = Math.sqrt(ta * ta + tc * tc);
                if (s > 0.00001) s = (s + (ts - s + this.data.offsetScaleX) * scaleMix) / s;
                mat.a *= s;
                mat.b *= s;
                s = Math.sqrt(mat.c * mat.c + mat.d * mat.d);
                ts = Math.sqrt(tb * tb + td * td);
                if (s > 0.00001) s = (s + (ts - s + this.data.offsetScaleY) * scaleMix) / s;
                mat.c *= s;
                mat.d *= s;
                modified = true;
            }

            if (shearMix > 0) {
                let b = mat.c, d = mat.d;
                let by = Math.atan2(d, b);
                let r = Math.atan2(td, tb) - Math.atan2(tc, ta) - (by - Math.atan2(mat.b, mat.a));
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI)
                    r += MathUtils.PI2;
                r = by + (r + offsetShearY) * shearMix;
                let s = Math.sqrt(b * b + d * d);
                mat.c = Math.cos(r) * s;
                mat.d = Math.sin(r) * s;
                modified = true;
            }

            if (modified) bone.appliedValid = false;
        }
    }

    applyRelativeWorld() {
        let rotateMix = this.rotateMix, translateMix = this.translateMix, scaleMix = this.scaleMix,
            shearMix = this.shearMix;
        let target = this.target;
        let targetMat = target.matrix;
        let ta = targetMat.a, tb = targetMat.c, tc = targetMat.b, td = targetMat.d;
        let degRadReflect = ta * td - tb * tc > 0 ? MathUtils.degRad : -MathUtils.degRad;
        let offsetRotation = this.data.offsetRotation * degRadReflect,
            offsetShearY = this.data.offsetShearY * degRadReflect;
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            let modified = false;
            let mat = bone.matrix;

            if (rotateMix != 0) {
                let a = mat.a, b = mat.c, c = mat.b, d = mat.d;
                let r = Math.atan2(tc, ta) + offsetRotation;
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) r += MathUtils.PI2;
                r *= rotateMix;
                let cos = Math.cos(r), sin = Math.sin(r);
                mat.a = cos * a - sin * c;
                mat.c = cos * b - sin * d;
                mat.b = sin * a + cos * c;
                mat.d = sin * b + cos * d;
                modified = true;
            }

            if (translateMix != 0) {
                let temp = this.temp;
                target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                mat.tx += temp.x * translateMix;
                mat.ty += temp.y * translateMix;
                modified = true;
            }

            if (scaleMix > 0) {
                let s = (Math.sqrt(ta * ta + tc * tc) - 1 + this.data.offsetScaleX) * scaleMix + 1;
                mat.a *= s;
                mat.b *= s;
                s = (Math.sqrt(tb * tb + td * td) - 1 + this.data.offsetScaleY) * scaleMix + 1;
                mat.c *= s;
                mat.d *= s;
                modified = true;
            }

            if (shearMix > 0) {
                let r = Math.atan2(td, tb) - Math.atan2(tc, ta);
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) r += MathUtils.PI2;
                let b = mat.c, d = mat.d;
                r = Math.atan2(d, b) + (r - MathUtils.PI / 2 + offsetShearY) * shearMix;
                let s = Math.sqrt(b * b + d * d);
                mat.c = Math.cos(r) * s;
                mat.d = Math.sin(r) * s;
                modified = true;
            }

            if (modified) bone.appliedValid = false;
        }
    }

    applyAbsoluteLocal() {
        let rotateMix = this.rotateMix, translateMix = this.translateMix, scaleMix = this.scaleMix,
            shearMix = this.shearMix;
        let target = this.target;
        if (!target.appliedValid) target.updateAppliedTransform();
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (!bone.appliedValid) bone.updateAppliedTransform();

            let rotation = bone.arotation;
            if (rotateMix != 0) {
                let r = target.arotation - rotation + this.data.offsetRotation;
                r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                rotation += r * rotateMix;
            }

            let x = bone.ax, y = bone.ay;
            if (translateMix != 0) {
                x += (target.ax - x + this.data.offsetX) * translateMix;
                y += (target.ay - y + this.data.offsetY) * translateMix;
            }

            let scaleX = bone.ascaleX, scaleY = bone.ascaleY;
            if (scaleMix > 0) {
                if (scaleX > 0.00001) scaleX = (scaleX + (target.ascaleX - scaleX + this.data.offsetScaleX) * scaleMix) / scaleX;
                if (scaleY > 0.00001) scaleY = (scaleY + (target.ascaleY - scaleY + this.data.offsetScaleY) * scaleMix) / scaleY;
            }

            let shearY = bone.ashearY;
            if (shearMix > 0) {
                let r = target.ashearY - shearY + this.data.offsetShearY;
                r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                bone.shearY += r * shearMix;
            }

            bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
        }
    }

    applyRelativeLocal() {
        let rotateMix = this.rotateMix, translateMix = this.translateMix, scaleMix = this.scaleMix,
            shearMix = this.shearMix;
        let target = this.target;
        if (!target.appliedValid) target.updateAppliedTransform();
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (!bone.appliedValid) bone.updateAppliedTransform();

            let rotation = bone.arotation;
            if (rotateMix != 0) rotation += (target.arotation + this.data.offsetRotation) * rotateMix;

            let x = bone.ax, y = bone.ay;
            if (translateMix != 0) {
                x += (target.ax + this.data.offsetX) * translateMix;
                y += (target.ay + this.data.offsetY) * translateMix;
            }

            let scaleX = bone.ascaleX, scaleY = bone.ascaleY;
            if (scaleMix > 0) {
                if (scaleX > 0.00001) scaleX *= ((target.ascaleX - 1 + this.data.offsetScaleX) * scaleMix) + 1;
                if (scaleY > 0.00001) scaleY *= ((target.ascaleY - 1 + this.data.offsetScaleY) * scaleMix) + 1;
            }

            let shearY = bone.ashearY;
            if (shearMix > 0) shearY += (target.ashearY + this.data.offsetShearY) * shearMix;

            bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
        }
    }
}

/**
 * @public
 */
class Skeleton {
    
    
    
    
    
    
    
    __init() {this._updateCache = new Array();}
    __init2() {this.updateCacheReset = new Array();}
    
    
    __init3() {this.time = 0;}
    __init4() {this.scaleX = 1;} __init5() {this.scaleY = 1;}
    __init6() {this.x = 0;} __init7() {this.y = 0;}

    constructor (data) {Skeleton.prototype.__init.call(this);Skeleton.prototype.__init2.call(this);Skeleton.prototype.__init3.call(this);Skeleton.prototype.__init4.call(this);Skeleton.prototype.__init5.call(this);Skeleton.prototype.__init6.call(this);Skeleton.prototype.__init7.call(this);
        if (data == null) throw new Error("data cannot be null.");
        this.data = data;

        this.bones = new Array();
        for (let i = 0; i < data.bones.length; i++) {
            let boneData = data.bones[i];
            let bone;
            if (boneData.parent == null)
                bone = new Bone(boneData, this, null);
            else {
                let parent = this.bones[boneData.parent.index];
                bone = new Bone(boneData, this, parent);
                parent.children.push(bone);
            }
            this.bones.push(bone);
        }

        this.slots = new Array();
        this.drawOrder = new Array();
        for (let i = 0; i < data.slots.length; i++) {
            let slotData = data.slots[i];
            let bone = this.bones[slotData.boneData.index];
            let slot = new Slot(slotData, bone);
            this.slots.push(slot);
            this.drawOrder.push(slot);
        }

        this.ikConstraints = new Array();
        for (let i = 0; i < data.ikConstraints.length; i++) {
            let ikConstraintData = data.ikConstraints[i];
            this.ikConstraints.push(new IkConstraint(ikConstraintData, this));
        }

        this.transformConstraints = new Array();
        for (let i = 0; i < data.transformConstraints.length; i++) {
            let transformConstraintData = data.transformConstraints[i];
            this.transformConstraints.push(new TransformConstraint(transformConstraintData, this));
        }

        this.pathConstraints = new Array();
        for (let i = 0; i < data.pathConstraints.length; i++) {
            let pathConstraintData = data.pathConstraints[i];
            this.pathConstraints.push(new PathConstraint(pathConstraintData, this));
        }

        this.color = new Color(1, 1, 1, 1);
        this.updateCache();
    }

    updateCache () {
        let updateCache = this._updateCache;
        updateCache.length = 0;
        this.updateCacheReset.length = 0;

        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            bone.sorted = bone.data.skinRequired;
            bone.active = !bone.sorted;
        }

        if (this.skin != null) {
            let skinBones = this.skin.bones;
            for (let i = 0, n = this.skin.bones.length; i < n; i++) {
                let bone = this.bones[skinBones[i].index];
                do {
                    bone.sorted = false;
                    bone.active = true;
                    bone = bone.parent;
                } while (bone != null);
            }
        }

        // IK first, lowest hierarchy depth first.
        let ikConstraints = this.ikConstraints;
        let transformConstraints = this.transformConstraints;
        let pathConstraints = this.pathConstraints;
        let ikCount = ikConstraints.length, transformCount = transformConstraints.length, pathCount = pathConstraints.length;
        let constraintCount = ikCount + transformCount + pathCount;

        outer:
            for (let i = 0; i < constraintCount; i++) {
                for (let ii = 0; ii < ikCount; ii++) {
                    let constraint = ikConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortIkConstraint(constraint);
                        continue outer;
                    }
                }
                for (let ii = 0; ii < transformCount; ii++) {
                    let constraint = transformConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortTransformConstraint(constraint);
                        continue outer;
                    }
                }
                for (let ii = 0; ii < pathCount; ii++) {
                    let constraint = pathConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortPathConstraint(constraint);
                        continue outer;
                    }
                }
            }

        for (let i = 0, n = bones.length; i < n; i++)
            this.sortBone(bones[i]);
    }

    sortIkConstraint (constraint) {
        constraint.active = constraint.target.isActive() && (!constraint.data.skinRequired || (this.skin != null && Utils.contains(this.skin.constraints, constraint.data, true)));
        if (!constraint.active) return;

        let target = constraint.target;
        this.sortBone(target);

        let constrained = constraint.bones;
        let parent = constrained[0];
        this.sortBone(parent);

        if (constrained.length > 1) {
            let child = constrained[constrained.length - 1];
            if (!(this._updateCache.indexOf(child) > -1)) this.updateCacheReset.push(child);
        }

        this._updateCache.push(constraint);

        this.sortReset(parent.children);
        constrained[constrained.length - 1].sorted = true;
    }

    sortPathConstraint (constraint) {
        constraint.active = constraint.target.bone.isActive() && (!constraint.data.skinRequired || (this.skin != null && Utils.contains(this.skin.constraints, constraint.data, true)));
        if (!constraint.active) return;

        let slot = constraint.target;
        let slotIndex = slot.data.index;
        let slotBone = slot.bone;
        if (this.skin != null) this.sortPathConstraintAttachment(this.skin, slotIndex, slotBone);
        if (this.data.defaultSkin != null && this.data.defaultSkin != this.skin)
            this.sortPathConstraintAttachment(this.data.defaultSkin, slotIndex, slotBone);
        for (let i = 0, n = this.data.skins.length; i < n; i++)
            this.sortPathConstraintAttachment(this.data.skins[i], slotIndex, slotBone);

        let attachment = slot.getAttachment();
        if (attachment instanceof PathAttachment) this.sortPathConstraintAttachmentWith(attachment, slotBone);

        let constrained = constraint.bones;
        let boneCount = constrained.length;
        for (let i = 0; i < boneCount; i++)
            this.sortBone(constrained[i]);

        this._updateCache.push(constraint);

        for (let i = 0; i < boneCount; i++)
            this.sortReset(constrained[i].children);
        for (let i = 0; i < boneCount; i++)
            constrained[i].sorted = true;
    }

    sortTransformConstraint (constraint) {
        constraint.active = constraint.target.isActive() && (!constraint.data.skinRequired || (this.skin != null && Utils.contains(this.skin.constraints, constraint.data, true)));
        if (!constraint.active) return;

        this.sortBone(constraint.target);

        let constrained = constraint.bones;
        let boneCount = constrained.length;
        if (constraint.data.local) {
            for (let i = 0; i < boneCount; i++) {
                let child = constrained[i];
                this.sortBone(child.parent);
                if (!(this._updateCache.indexOf(child) > -1)) this.updateCacheReset.push(child);
            }
        } else {
            for (let i = 0; i < boneCount; i++) {
                this.sortBone(constrained[i]);
            }
        }

        this._updateCache.push(constraint);

        for (let ii = 0; ii < boneCount; ii++)
            this.sortReset(constrained[ii].children);
        for (let ii = 0; ii < boneCount; ii++)
            constrained[ii].sorted = true;
    }

    sortPathConstraintAttachment (skin, slotIndex, slotBone) {
        let attachments = skin.attachments[slotIndex];
        if (!attachments) return;
        for (let key in attachments) {
            this.sortPathConstraintAttachmentWith(attachments[key], slotBone);
        }
    }

    sortPathConstraintAttachmentWith (attachment, slotBone) {
        if (!(attachment instanceof PathAttachment)) return;
        let pathBones = (attachment).bones;
        if (pathBones == null)
            this.sortBone(slotBone);
        else {
            let bones = this.bones;
            let i = 0;
            while (i < pathBones.length) {
                let boneCount = pathBones[i++];
                for (let n = i + boneCount; i < n; i++) {
                    let boneIndex = pathBones[i];
                    this.sortBone(bones[boneIndex]);
                }
            }
        }
    }

    sortBone (bone) {
        if (bone.sorted) return;
        let parent = bone.parent;
        if (parent != null) this.sortBone(parent);
        bone.sorted = true;
        this._updateCache.push(bone);
    }

    sortReset (bones) {
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (!bone.active) continue;
            if (bone.sorted) this.sortReset(bone.children);
            bone.sorted = false;
        }
    }

    /** Updates the world transform for each bone and applies constraints. */
    updateWorldTransform () {
        let updateCacheReset = this.updateCacheReset;
        for (let i = 0, n = updateCacheReset.length; i < n; i++) {
            let bone = updateCacheReset[i] ;
            bone.ax = bone.x;
            bone.ay = bone.y;
            bone.arotation = bone.rotation;
            bone.ascaleX = bone.scaleX;
            bone.ascaleY = bone.scaleY;
            bone.ashearX = bone.shearX;
            bone.ashearY = bone.shearY;
            bone.appliedValid = true;
        }
        let updateCache = this._updateCache;
        for (let i = 0, n = updateCache.length; i < n; i++)
            updateCache[i].update();
    }

    /** Sets the bones, constraints, and slots to their setup pose values. */
    setToSetupPose () {
        this.setBonesToSetupPose();
        this.setSlotsToSetupPose();
    }

    /** Sets the bones and constraints to their setup pose values. */
    setBonesToSetupPose () {
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++)
            bones[i].setToSetupPose();

        let ikConstraints = this.ikConstraints;
        for (let i = 0, n = ikConstraints.length; i < n; i++) {
            let constraint = ikConstraints[i];
            constraint.mix = constraint.data.mix;
            constraint.softness = constraint.data.softness;
            constraint.bendDirection = constraint.data.bendDirection;
            constraint.compress = constraint.data.compress;
            constraint.stretch = constraint.data.stretch;
        }

        let transformConstraints = this.transformConstraints;
        for (let i = 0, n = transformConstraints.length; i < n; i++) {
            let constraint = transformConstraints[i];
            let data = constraint.data;
            constraint.rotateMix = data.rotateMix;
            constraint.translateMix = data.translateMix;
            constraint.scaleMix = data.scaleMix;
            constraint.shearMix = data.shearMix;
        }

        let pathConstraints = this.pathConstraints;
        for (let i = 0, n = pathConstraints.length; i < n; i++) {
            let constraint = pathConstraints[i];
            let data = constraint.data;
            constraint.position = data.position;
            constraint.spacing = data.spacing;
            constraint.rotateMix = data.rotateMix;
            constraint.translateMix = data.translateMix;
        }
    }

    setSlotsToSetupPose () {
        let slots = this.slots;
        Utils.arrayCopy(slots, 0, this.drawOrder, 0, slots.length);
        for (let i = 0, n = slots.length; i < n; i++)
            slots[i].setToSetupPose();
    }

    /** @return May return null. */
    getRootBone () {
        if (this.bones.length == 0) return null;
        return this.bones[0];
    }

    /** @return May be null. */
    findBone (boneName) {
        if (boneName == null) throw new Error("boneName cannot be null.");
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (bone.data.name == boneName) return bone;
        }
        return null;
    }

    /** @return -1 if the bone was not found. */
    findBoneIndex (boneName) {
        if (boneName == null) throw new Error("boneName cannot be null.");
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return i;
        return -1;
    }

    /** @return May be null. */
    findSlot (slotName) {
        if (slotName == null) throw new Error("slotName cannot be null.");
        let slots = this.slots;
        for (let i = 0, n = slots.length; i < n; i++) {
            let slot = slots[i];
            if (slot.data.name == slotName) return slot;
        }
        return null;
    }

    /** @return -1 if the bone was not found. */
    findSlotIndex (slotName) {
        if (slotName == null) throw new Error("slotName cannot be null.");
        let slots = this.slots;
        for (let i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return i;
        return -1;
    }

    /** Sets a skin by name.
     * @see #setSkin(Skin) */
    setSkinByName (skinName) {
        let skin = this.data.findSkin(skinName);
        if (skin == null) throw new Error("Skin not found: " + skinName);
        this.setSkin(skin);
    }

    /** Sets the skin used to look up attachments before looking in the {@link SkeletonData#getDefaultSkin() default skin}.
     * Attachments from the new skin are attached if the corresponding attachment from the old skin was attached. If there was no
     * old skin, each slot's setup mode attachment is attached from the new skin.
     * @param newSkin May be null. */
    setSkin (newSkin) {
        if (newSkin == this.skin) return;
        if (newSkin != null) {
            if (this.skin != null)
                newSkin.attachAll(this, this.skin);
            else {
                let slots = this.slots;
                for (let i = 0, n = slots.length; i < n; i++) {
                    let slot = slots[i];
                    let name = slot.data.attachmentName;
                    if (name != null) {
                        let attachment = newSkin.getAttachment(i, name);
                        if (attachment != null) slot.setAttachment(attachment);
                    }
                }
            }
        }
        this.skin = newSkin;
        this.updateCache();
    }

    /** @return May be null. */
    getAttachmentByName (slotName, attachmentName) {
        return this.getAttachment(this.data.findSlotIndex(slotName), attachmentName);
    }

    /** @return May be null. */
    getAttachment (slotIndex, attachmentName) {
        if (attachmentName == null) throw new Error("attachmentName cannot be null.");
        if (this.skin != null) {
            let attachment = this.skin.getAttachment(slotIndex, attachmentName);
            if (attachment != null) return attachment;
        }
        if (this.data.defaultSkin != null) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
        return null;
    }

    /** @param attachmentName May be null. */
    setAttachment (slotName, attachmentName) {
        if (slotName == null) throw new Error("slotName cannot be null.");
        let slots = this.slots;
        for (let i = 0, n = slots.length; i < n; i++) {
            let slot = slots[i];
            if (slot.data.name == slotName) {
                let attachment = null;
                if (attachmentName != null) {
                    attachment = this.getAttachment(i, attachmentName);
                    if (attachment == null)
                        throw new Error("Attachment not found: " + attachmentName + ", for slot: " + slotName);
                }
                slot.setAttachment(attachment);
                return;
            }
        }
        throw new Error("Slot not found: " + slotName);
    }

    /** @return May be null. */
    findIkConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let ikConstraints = this.ikConstraints;
        for (let i = 0, n = ikConstraints.length; i < n; i++) {
            let ikConstraint = ikConstraints[i];
            if (ikConstraint.data.name == constraintName) return ikConstraint;
        }
        return null;
    }

    /** @return May be null. */
    findTransformConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let transformConstraints = this.transformConstraints;
        for (let i = 0, n = transformConstraints.length; i < n; i++) {
            let constraint = transformConstraints[i];
            if (constraint.data.name == constraintName) return constraint;
        }
        return null;
    }

    /** @return May be null. */
    findPathConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let pathConstraints = this.pathConstraints;
        for (let i = 0, n = pathConstraints.length; i < n; i++) {
            let constraint = pathConstraints[i];
            if (constraint.data.name == constraintName) return constraint;
        }
        return null;
    }

    /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
     * @param offset The distance from the skeleton origin to the bottom left corner of the AABB.
     * @param size The width and height of the AABB.
     * @param temp Working memory */
    getBounds (offset, size, temp = new Array(2)) {
        if (offset == null) throw new Error("offset cannot be null.");
        if (size == null) throw new Error("size cannot be null.");
        let drawOrder = this.drawOrder;
        let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
        for (let i = 0, n = drawOrder.length; i < n; i++) {
            let slot = drawOrder[i];
            if (!slot.bone.active) continue;
            let verticesLength = 0;
            let vertices = null;
            let attachment = slot.getAttachment();
            if (attachment instanceof RegionAttachment) {
                verticesLength = 8;
                vertices = Utils.setArraySize(temp, verticesLength, 0);
                (attachment).computeWorldVertices(slot.bone, vertices, 0, 2);
            } else if (attachment instanceof MeshAttachment) {
                let mesh = (attachment);
                verticesLength = mesh.worldVerticesLength;
                vertices = Utils.setArraySize(temp, verticesLength, 0);
                mesh.computeWorldVertices(slot, 0, verticesLength, vertices, 0, 2);
            }
            if (vertices != null) {
                for (let ii = 0, nn = vertices.length; ii < nn; ii += 2) {
                    let x = vertices[ii], y = vertices[ii + 1];
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }
        offset.set(minX, minY);
        size.set(maxX - minX, maxY - minY);
    }

    update (delta) {
        this.time += delta;
    }

    get flipX() {
        return this.scaleX == -1;
    }

    set flipX(value) {
        if (!Skeleton.deprecatedWarning1) {
            Skeleton.deprecatedWarning1 = true;
            console.warn("Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY");
        }
        this.scaleX = value ? 1.0 : -1.0;
    }

    get flipY() {
        return this.scaleY == -1;
    }

    set flipY(value) {
        if (!Skeleton.deprecatedWarning1) {
            Skeleton.deprecatedWarning1 = true;
            console.warn("Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY");
        }
        this.scaleY = value ? 1.0 : -1.0;
    }

     static __initStatic() {this.deprecatedWarning1 = false;}
} Skeleton.__initStatic();

/**
 * @public
 */
class SkeletonData {constructor() { SkeletonData.prototype.__init.call(this);SkeletonData.prototype.__init2.call(this);SkeletonData.prototype.__init3.call(this);SkeletonData.prototype.__init4.call(this);SkeletonData.prototype.__init5.call(this);SkeletonData.prototype.__init6.call(this);SkeletonData.prototype.__init7.call(this);SkeletonData.prototype.__init8.call(this);SkeletonData.prototype.__init9.call(this); }
    
    __init() {this.bones = new Array();} // Ordered parents first.
    __init2() {this.slots = new Array();} // Setup pose draw order.
    __init3() {this.skins = new Array();}
    
    __init4() {this.events = new Array();}
    __init5() {this.animations = new Array();}
    __init6() {this.ikConstraints = new Array();}
    __init7() {this.transformConstraints = new Array();}
    __init8() {this.pathConstraints = new Array();}
       
     

    // Nonessential
    __init9() {this.fps = 0;}
    
    

    findBone (boneName) {
        if (boneName == null) throw new Error("boneName cannot be null.");
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (bone.name == boneName) return bone;
        }
        return null;
    }

    findBoneIndex (boneName) {
        if (boneName == null) throw new Error("boneName cannot be null.");
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return i;
        return -1;
    }

    findSlot (slotName) {
        if (slotName == null) throw new Error("slotName cannot be null.");
        let slots = this.slots;
        for (let i = 0, n = slots.length; i < n; i++) {
            let slot = slots[i];
            if (slot.name == slotName) return slot;
        }
        return null;
    }

    findSlotIndex (slotName) {
        if (slotName == null) throw new Error("slotName cannot be null.");
        let slots = this.slots;
        for (let i = 0, n = slots.length; i < n; i++)
            if (slots[i].name == slotName) return i;
        return -1;
    }

    findSkin (skinName) {
        if (skinName == null) throw new Error("skinName cannot be null.");
        let skins = this.skins;
        for (let i = 0, n = skins.length; i < n; i++) {
            let skin = skins[i];
            if (skin.name == skinName) return skin;
        }
        return null;
    }

    findEvent (eventDataName) {
        if (eventDataName == null) throw new Error("eventDataName cannot be null.");
        let events = this.events;
        for (let i = 0, n = events.length; i < n; i++) {
            let event = events[i];
            if (event.name == eventDataName) return event;
        }
        return null;
    }

    findAnimation (animationName) {
        if (animationName == null) throw new Error("animationName cannot be null.");
        let animations = this.animations;
        for (let i = 0, n = animations.length; i < n; i++) {
            let animation = animations[i];
            if (animation.name == animationName) return animation;
        }
        return null;
    }

    findIkConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let ikConstraints = this.ikConstraints;
        for (let i = 0, n = ikConstraints.length; i < n; i++) {
            let constraint = ikConstraints[i];
            if (constraint.name == constraintName) return constraint;
        }
        return null;
    }

    findTransformConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let transformConstraints = this.transformConstraints;
        for (let i = 0, n = transformConstraints.length; i < n; i++) {
            let constraint = transformConstraints[i];
            if (constraint.name == constraintName) return constraint;
        }
        return null;
    }

    findPathConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let pathConstraints = this.pathConstraints;
        for (let i = 0, n = pathConstraints.length; i < n; i++) {
            let constraint = pathConstraints[i];
            if (constraint.name == constraintName) return constraint;
        }
        return null;
    }

    findPathConstraintIndex (pathConstraintName) {
        if (pathConstraintName == null) throw new Error("pathConstraintName cannot be null.");
        let pathConstraints = this.pathConstraints;
        for (let i = 0, n = pathConstraints.length; i < n; i++)
            if (pathConstraints[i].name == pathConstraintName) return i;
        return -1;
    }
}

/**
 * @public
 */
class SlotData  {
    
    
    
    __init() {this.color = new Color(1, 1, 1, 1);}
    
    
    

    constructor (index, name, boneData) {SlotData.prototype.__init.call(this);
        if (index < 0) throw new Error("index must be >= 0.");
        if (name == null) throw new Error("name cannot be null.");
        if (boneData == null) throw new Error("boneData cannot be null.");
        this.index = index;
        this.name = name;
        this.boneData = boneData;
    }
}

/**
 * @public
 */
class TransformConstraintData extends ConstraintData {
    __init() {this.bones = new Array();}
    
    __init2() {this.rotateMix = 0;} __init3() {this.translateMix = 0;} __init4() {this.scaleMix = 0;} __init5() {this.shearMix = 0;}
    __init6() {this.offsetRotation = 0;} __init7() {this.offsetX = 0;} __init8() {this.offsetY = 0;} __init9() {this.offsetScaleX = 0;} __init10() {this.offsetScaleY = 0;} __init11() {this.offsetShearY = 0;}
    __init12() {this.relative = false;}
    __init13() {this.local = false;}

    constructor (name) {
        super(name, 0, false);TransformConstraintData.prototype.__init.call(this);TransformConstraintData.prototype.__init2.call(this);TransformConstraintData.prototype.__init3.call(this);TransformConstraintData.prototype.__init4.call(this);TransformConstraintData.prototype.__init5.call(this);TransformConstraintData.prototype.__init6.call(this);TransformConstraintData.prototype.__init7.call(this);TransformConstraintData.prototype.__init8.call(this);TransformConstraintData.prototype.__init9.call(this);TransformConstraintData.prototype.__init10.call(this);TransformConstraintData.prototype.__init11.call(this);TransformConstraintData.prototype.__init12.call(this);TransformConstraintData.prototype.__init13.call(this);    }
}

/**
 * @public
 */
class SkinEntry {
    constructor( slotIndex,  name,  attachment) {this.slotIndex = slotIndex;this.name = name;this.attachment = attachment; }
}

/**
 * @public
 */
class Skin {
    
    __init() {this.attachments = new Array();}
    __init2() {this.bones = Array();}
    __init3() {this.constraints = new Array();}

    constructor (name) {Skin.prototype.__init.call(this);Skin.prototype.__init2.call(this);Skin.prototype.__init3.call(this);
        if (name == null) throw new Error("name cannot be null.");
        this.name = name;
    }

    setAttachment (slotIndex, name, attachment) {
        if (attachment == null) throw new Error("attachment cannot be null.");
        let attachments = this.attachments;
        if (slotIndex >= attachments.length) attachments.length = slotIndex + 1;
        if (!attachments[slotIndex]) attachments[slotIndex] = { };
        attachments[slotIndex][name] = attachment;
    }

    addSkin (skin) {
        for(let i = 0; i < skin.bones.length; i++) {
            let bone = skin.bones[i];
            let contained = false;
            for (let j = 0; j < this.bones.length; j++) {
                if (this.bones[j] == bone) {
                    contained = true;
                    break;
                }
            }
            if (!contained) this.bones.push(bone);
        }

        for(let i = 0; i < skin.constraints.length; i++) {
            let constraint = skin.constraints[i];
            let contained = false;
            for (let j = 0; j < this.constraints.length; j++) {
                if (this.constraints[j] == constraint) {
                    contained = true;
                    break;
                }
            }
            if (!contained) this.constraints.push(constraint);
        }

        let attachments = skin.getAttachments();
        for (let i = 0; i < attachments.length; i++) {
            var attachment = attachments[i];
            this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
        }
    }

    copySkin (skin) {
        for(let i = 0; i < skin.bones.length; i++) {
            let bone = skin.bones[i];
            let contained = false;
            for (let j = 0; j < this.bones.length; j++) {
                if (this.bones[j] == bone) {
                    contained = true;
                    break;
                }
            }
            if (!contained) this.bones.push(bone);
        }

        for(let i = 0; i < skin.constraints.length; i++) {
            let constraint = skin.constraints[i];
            let contained = false;
            for (let j = 0; j < this.constraints.length; j++) {
                if (this.constraints[j] == constraint) {
                    contained = true;
                    break;
                }
            }
            if (!contained) this.constraints.push(constraint);
        }

        let attachments = skin.getAttachments();
        for (let i = 0; i < attachments.length; i++) {
            var attachment = attachments[i];
            if (attachment.attachment == null) continue;
            if (attachment.attachment instanceof MeshAttachment) {
                attachment.attachment = attachment.attachment.newLinkedMesh();
                this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
            } else {
                attachment.attachment = attachment.attachment.copy();
                this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
            }
        }
    }

    /** @return May be null. */
    getAttachment (slotIndex, name) {
        let dictionary = this.attachments[slotIndex];
        return dictionary ? dictionary[name] : null;
    }

    removeAttachment (slotIndex, name) {
        let dictionary = this.attachments[slotIndex];
        if (dictionary) dictionary[name] = null;
    }

    getAttachments () {
        let entries = new Array();
        for (var i = 0; i < this.attachments.length; i++) {
            let slotAttachments = this.attachments[i];
            if (slotAttachments) {
                for (let name in slotAttachments) {
                    let attachment = slotAttachments[name];
                    if (attachment) entries.push(new SkinEntry(i, name, attachment));
                }
            }
        }
        return entries;
    }

    getAttachmentsForSlot (slotIndex, attachments) {
        let slotAttachments = this.attachments[slotIndex];
        if (slotAttachments) {
            for (let name in slotAttachments) {
                let attachment = slotAttachments[name];
                if (attachment) attachments.push(new SkinEntry(slotIndex, name, attachment));
            }
        }
    }

    clear () {
        this.attachments.length = 0;
        this.bones.length = 0;
        this.constraints.length = 0;
    }

    /** Attach each attachment in this skin if the corresponding attachment in the old skin is currently attached. */
    attachAll (skeleton, oldSkin) {
        let slotIndex = 0;
        for (let i = 0; i < skeleton.slots.length; i++) {
            let slot = skeleton.slots[i];
            let slotAttachment = slot.getAttachment();
            if (slotAttachment && slotIndex < oldSkin.attachments.length) {
                let dictionary = oldSkin.attachments[slotIndex];
                for (let key in dictionary) {
                    let skinAttachment = dictionary[key];
                    if (slotAttachment == skinAttachment) {
                        let attachment = this.getAttachment(slotIndex, key);
                        if (attachment != null) slot.setAttachment(attachment);
                        break;
                    }
                }
            }
            slotIndex++;
        }
    }
}

/**
 * @public
 */
class SkeletonBinary {
    static __initStatic() {this.AttachmentTypeValues = [ 0 /*AttachmentType.Region*/, 1/*AttachmentType.BoundingBox*/, 2/*AttachmentType.Mesh*/, 3/*AttachmentType.LinkedMesh*/, 4/*AttachmentType.Path*/, 5/*AttachmentType.Point*/, 6/*AttachmentType.Clipping*/ ];}
    static __initStatic2() {this.TransformModeValues = [TransformMode.Normal, TransformMode.OnlyTranslation, TransformMode.NoRotationOrReflection, TransformMode.NoScale, TransformMode.NoScaleOrReflection];}
    static __initStatic3() {this.PositionModeValues = [ PositionMode.Fixed, PositionMode.Percent ];}
    static __initStatic4() {this.SpacingModeValues = [ SpacingMode.Length, SpacingMode.Fixed, SpacingMode.Percent];}
    static __initStatic5() {this.RotateModeValues = [ RotateMode.Tangent, RotateMode.Chain, RotateMode.ChainScale ];}
    static __initStatic6() {this.BlendModeValues = [ BLEND_MODES.NORMAL, BLEND_MODES.ADD, BLEND_MODES.MULTIPLY, BLEND_MODES.SCREEN];}

    static __initStatic7() {this.BONE_ROTATE = 0;}
    static __initStatic8() {this.BONE_TRANSLATE = 1;}
    static __initStatic9() {this.BONE_SCALE = 2;}
    static __initStatic10() {this.BONE_SHEAR = 3;}

    static __initStatic11() {this.SLOT_ATTACHMENT = 0;}
    static __initStatic12() {this.SLOT_COLOR = 1;}
    static __initStatic13() {this.SLOT_TWO_COLOR = 2;}

    static __initStatic14() {this.PATH_POSITION = 0;}
    static __initStatic15() {this.PATH_SPACING = 1;}
    static __initStatic16() {this.PATH_MIX = 2;}

    static __initStatic17() {this.CURVE_LINEAR = 0;}
    static __initStatic18() {this.CURVE_STEPPED = 1;}
    static __initStatic19() {this.CURVE_BEZIER = 2;}

    
    __init() {this.scale = 1;}
     __init2() {this.linkedMeshes = new Array();}

    constructor (attachmentLoader) {SkeletonBinary.prototype.__init.call(this);SkeletonBinary.prototype.__init2.call(this);
        this.attachmentLoader = attachmentLoader;
    }

    readSkeletonData (binary) {
        let scale = this.scale;

        let skeletonData = new SkeletonData();
        skeletonData.name = ""; // BOZO

        let input = new BinaryInput(binary);

        skeletonData.hash = input.readString();
        skeletonData.version = input.readString();
        if (skeletonData.version === '3.8.75')
        {
            let error = `Unsupported skeleton data, 3.8.75 is deprecated, please export with a newer version of Spine.`;
            console.error(error);
        }
        skeletonData.x = input.readFloat();
        skeletonData.y = input.readFloat();
        skeletonData.width = input.readFloat();
        skeletonData.height = input.readFloat();

        let nonessential = input.readBoolean();
        if (nonessential) {
            skeletonData.fps = input.readFloat();

            skeletonData.imagesPath = input.readString();
            skeletonData.audioPath = input.readString();
        }

        let n = 0;
        // Strings.
        n = input.readInt(true);
        for (let i = 0; i < n; i++)
            input.strings.push(input.readString());

        // Bones.
        n = input.readInt(true);
        for (let i = 0; i < n; i++) {
            let name = input.readString();
            let parent = i == 0 ? null : skeletonData.bones[input.readInt(true)];
            let data = new BoneData(i, name, parent);
            data.rotation = input.readFloat();
            data.x = input.readFloat() * scale;
            data.y = input.readFloat() * scale;
            data.scaleX = input.readFloat();
            data.scaleY = input.readFloat();
            data.shearX = input.readFloat();
            data.shearY = input.readFloat();
            data.length = input.readFloat() * scale;
            data.transformMode = SkeletonBinary.TransformModeValues[input.readInt(true)];
            data.skinRequired = input.readBoolean();
            if (nonessential) Color.rgba8888ToColor(data.color, input.readInt32());
            skeletonData.bones.push(data);
        }

        // Slots.
        n = input.readInt(true);
        for (let i = 0; i < n; i++) {
            let slotName = input.readString();
            let boneData = skeletonData.bones[input.readInt(true)];
            let data = new SlotData(i, slotName, boneData);
            Color.rgba8888ToColor(data.color, input.readInt32());

            let darkColor = input.readInt32();
            if (darkColor != -1) Color.rgb888ToColor(data.darkColor = new Color(), darkColor);

            data.attachmentName = input.readStringRef();
            data.blendMode = SkeletonBinary.BlendModeValues[input.readInt(true)];
            skeletonData.slots.push(data);
        }

        // IK constraints.
        n = input.readInt(true);
        for (let i = 0, nn; i < n; i++) {
            let data = new IkConstraintData(input.readString());
            data.order = input.readInt(true);
            data.skinRequired = input.readBoolean();
            nn = input.readInt(true);
            for (let ii = 0; ii < nn; ii++)
                data.bones.push(skeletonData.bones[input.readInt(true)]);
            data.target = skeletonData.bones[input.readInt(true)];
            data.mix = input.readFloat();
            data.softness = input.readFloat() * scale;
            data.bendDirection = input.readByte();
            data.compress = input.readBoolean();
            data.stretch = input.readBoolean();
            data.uniform = input.readBoolean();
            skeletonData.ikConstraints.push(data);
        }

        // Transform constraints.
        n = input.readInt(true);
        for (let i = 0, nn; i < n; i++) {
            let data = new TransformConstraintData(input.readString());
            data.order = input.readInt(true);
            data.skinRequired = input.readBoolean();
            nn = input.readInt(true);
            for (let ii = 0; ii < nn; ii++)
                data.bones.push(skeletonData.bones[input.readInt(true)]);
            data.target = skeletonData.bones[input.readInt(true)];
            data.local = input.readBoolean();
            data.relative = input.readBoolean();
            data.offsetRotation = input.readFloat();
            data.offsetX = input.readFloat() * scale;
            data.offsetY = input.readFloat() * scale;
            data.offsetScaleX = input.readFloat();
            data.offsetScaleY = input.readFloat();
            data.offsetShearY = input.readFloat();
            data.rotateMix = input.readFloat();
            data.translateMix = input.readFloat();
            data.scaleMix = input.readFloat();
            data.shearMix = input.readFloat();
            skeletonData.transformConstraints.push(data);
        }

        // Path constraints.
        n = input.readInt(true);
        for (let i = 0, nn; i < n; i++) {
            let data = new PathConstraintData(input.readString());
            data.order = input.readInt(true);
            data.skinRequired = input.readBoolean();
            nn = input.readInt(true);
            for (let ii = 0; ii < nn; ii++)
                data.bones.push(skeletonData.bones[input.readInt(true)]);
            data.target = skeletonData.slots[input.readInt(true)];
            data.positionMode = SkeletonBinary.PositionModeValues[input.readInt(true)];
            data.spacingMode = SkeletonBinary.SpacingModeValues[input.readInt(true)];
            data.rotateMode = SkeletonBinary.RotateModeValues[input.readInt(true)];
            data.offsetRotation = input.readFloat();
            data.position = input.readFloat();
            if (data.positionMode == PositionMode.Fixed) data.position *= scale;
            data.spacing = input.readFloat();
            if (data.spacingMode == SpacingMode.Length || data.spacingMode == SpacingMode.Fixed) data.spacing *= scale;
            data.rotateMix = input.readFloat();
            data.translateMix = input.readFloat();
            skeletonData.pathConstraints.push(data);
        }

        // Default skin.
        let defaultSkin = this.readSkin(input, skeletonData, true, nonessential);
        if (defaultSkin != null) {
            skeletonData.defaultSkin = defaultSkin;
            skeletonData.skins.push(defaultSkin);
        }

        // Skins.
        {
            let i = skeletonData.skins.length;
            Utils.setArraySize(skeletonData.skins, n = i + input.readInt(true));
            for (; i < n; i++)
                skeletonData.skins[i] = this.readSkin(input, skeletonData, false, nonessential);
        }

        // Linked meshes.
        n = this.linkedMeshes.length;
        for (let i = 0; i < n; i++) {
            let linkedMesh = this.linkedMeshes[i];
            let skin = linkedMesh.skin == null ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
            if (skin == null) throw new Error("Skin not found: " + linkedMesh.skin);
            let parent = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
            if (parent == null) throw new Error("Parent mesh not found: " + linkedMesh.parent);
            linkedMesh.mesh.deformAttachment = linkedMesh.inheritDeform ? parent  : linkedMesh.mesh;
            linkedMesh.mesh.setParentMesh(parent );
            // linkedMesh.mesh.updateUVs();
        }
        this.linkedMeshes.length = 0;

        // Events.
        n = input.readInt(true);
        for (let i = 0; i < n; i++) {
            let data = new EventData(input.readStringRef());
            data.intValue = input.readInt(false);
            data.floatValue = input.readFloat();
            data.stringValue = input.readString();
            data.audioPath = input.readString();
            if (data.audioPath != null) {
                data.volume = input.readFloat();
                data.balance = input.readFloat();
            }
            skeletonData.events.push(data);
        }

        // Animations.
        n = input.readInt(true);
        for (let i = 0; i < n; i++)
            skeletonData.animations.push(this.readAnimation(input, input.readString(), skeletonData));
        return skeletonData;
    }

     readSkin (input, skeletonData, defaultSkin, nonessential) {
        let skin = null;
        let slotCount = 0;

        if (defaultSkin) {
            slotCount = input.readInt(true);
            if (slotCount == 0) return null;
            skin = new Skin("default");
        } else {
            skin = new Skin(input.readStringRef());
            skin.bones.length = input.readInt(true);
            for (let i = 0, n = skin.bones.length; i < n; i++)
                skin.bones[i] = skeletonData.bones[input.readInt(true)];

            for (let i = 0, n = input.readInt(true); i < n; i++)
                skin.constraints.push(skeletonData.ikConstraints[input.readInt(true)]);
            for (let i = 0, n = input.readInt(true); i < n; i++)
                skin.constraints.push(skeletonData.transformConstraints[input.readInt(true)]);
            for (let i = 0, n = input.readInt(true); i < n; i++)
                skin.constraints.push(skeletonData.pathConstraints[input.readInt(true)]);

            slotCount = input.readInt(true);
        }

        for (let i = 0; i < slotCount; i++) {
            let slotIndex = input.readInt(true);
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let name = input.readStringRef();
                let attachment = this.readAttachment(input, skeletonData, skin, slotIndex, name, nonessential);
                if (attachment != null) skin.setAttachment(slotIndex, name, attachment);
            }
        }
        return skin;
    }

     readAttachment(input, skeletonData, skin, slotIndex, attachmentName, nonessential) {
        let scale = this.scale;

        let name = input.readStringRef();
        if (name == null) name = attachmentName;

        let typeIndex = input.readByte();
        let type = SkeletonBinary.AttachmentTypeValues[typeIndex];
        switch (type) {
        case AttachmentType.Region: {
            let path = input.readStringRef();
            let rotation = input.readFloat();
            let x = input.readFloat();
            let y = input.readFloat();
            let scaleX = input.readFloat();
            let scaleY = input.readFloat();
            let width = input.readFloat();
            let height = input.readFloat();
            let color = input.readInt32();

            if (path == null) path = name;
            let region = this.attachmentLoader.newRegionAttachment(skin, name, path);
            if (region == null) return null;
            region.path = path;
            region.x = x * scale;
            region.y = y * scale;
            region.scaleX = scaleX;
            region.scaleY = scaleY;
            region.rotation = rotation;
            region.width = width * scale;
            region.height = height * scale;
            Color.rgba8888ToColor(region.color, color);
            // region.updateOffset();
            return region;
        }
        case AttachmentType.BoundingBox: {
            let vertexCount = input.readInt(true);
            let vertices = this.readVertices(input, vertexCount);
            let color = nonessential ? input.readInt32() : 0;

            let box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
            if (box == null) return null;
            box.worldVerticesLength = vertexCount << 1;
            box.vertices = vertices.vertices;
            box.bones = vertices.bones;
            if (nonessential) Color.rgba8888ToColor(box.color, color);
            return box;
        }
        case AttachmentType.Mesh: {
            let path = input.readStringRef();
            let color = input.readInt32();
            let vertexCount = input.readInt(true);
            let uvs = this.readFloatArray(input, vertexCount << 1, 1);
            let triangles = this.readShortArray(input);
            let vertices = this.readVertices(input, vertexCount);
            let hullLength = input.readInt(true);
            let edges = null;
            let width = 0, height = 0;
            if (nonessential) {
                edges = this.readShortArray(input);
                width = input.readFloat();
                height = input.readFloat();
            }

            if (path == null) path = name;
            let mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
            if (mesh == null) return null;
            mesh.path = path;
            Color.rgba8888ToColor(mesh.color, color);
            mesh.bones = vertices.bones;
            mesh.vertices = vertices.vertices;
            mesh.worldVerticesLength = vertexCount << 1;
            mesh.triangles = triangles;
            mesh.regionUVs = new Float32Array(uvs);
            // mesh.updateUVs();
            mesh.hullLength = hullLength << 1;
            if (nonessential) {
                mesh.edges = edges;
                mesh.width = width * scale;
                mesh.height = height * scale;
            }
            return mesh;
        }
        case AttachmentType.LinkedMesh: {
            let path = input.readStringRef();
            let color = input.readInt32();
            let skinName = input.readStringRef();
            let parent = input.readStringRef();
            let inheritDeform = input.readBoolean();
            let width = 0, height = 0;
            if (nonessential) {
                width = input.readFloat();
                height = input.readFloat();
            }

            if (path == null) path = name;
            let mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
            if (mesh == null) return null;
            mesh.path = path;
            Color.rgba8888ToColor(mesh.color, color);
            if (nonessential) {
                mesh.width = width * scale;
                mesh.height = height * scale;
            }
            this.linkedMeshes.push(new LinkedMesh(mesh, skinName, slotIndex, parent, inheritDeform));
            return mesh;
        }
        case AttachmentType.Path: {
            let closed = input.readBoolean();
            let constantSpeed = input.readBoolean();
            let vertexCount = input.readInt(true);
            let vertices = this.readVertices(input, vertexCount);
            let lengths = Utils.newArray(vertexCount / 3, 0);
            for (let i = 0, n = lengths.length; i < n; i++)
                lengths[i] = input.readFloat() * scale;
            let color = nonessential ? input.readInt32() : 0;

            let path = this.attachmentLoader.newPathAttachment(skin, name);
            if (path == null) return null;
            path.closed = closed;
            path.constantSpeed = constantSpeed;
            path.worldVerticesLength = vertexCount << 1;
            path.vertices = vertices.vertices;
            path.bones = vertices.bones;
            path.lengths = lengths;
            if (nonessential) Color.rgba8888ToColor(path.color, color);
            return path;
        }
        case AttachmentType.Point: {
            let rotation = input.readFloat();
            let x = input.readFloat();
            let y = input.readFloat();
            let color = nonessential ? input.readInt32() : 0;

            let point = this.attachmentLoader.newPointAttachment(skin, name);
            if (point == null) return null;
            point.x = x * scale;
            point.y = y * scale;
            point.rotation = rotation;
            if (nonessential) Color.rgba8888ToColor(point.color, color);
            return point;
        }
        case AttachmentType.Clipping: {
            let endSlotIndex = input.readInt(true);
            let vertexCount = input.readInt(true);
            let vertices = this.readVertices(input, vertexCount);
            let color = nonessential ? input.readInt32() : 0;

            let clip = this.attachmentLoader.newClippingAttachment(skin, name);
            if (clip == null) return null;
            clip.endSlot = skeletonData.slots[endSlotIndex];
            clip.worldVerticesLength = vertexCount << 1;
            clip.vertices = vertices.vertices;
            clip.bones = vertices.bones;
            if (nonessential) Color.rgba8888ToColor(clip.color, color);
            return clip;
        }
        }
        return null;
    }

     readVertices (input, vertexCount) {
        let verticesLength = vertexCount << 1;
        let vertices = new Vertices();
        let scale = this.scale;
        if (!input.readBoolean()) {
            vertices.vertices = this.readFloatArray(input, verticesLength, scale);
            return vertices;
        }
        let weights = new Array();
        let bonesArray = new Array();
        for (let i = 0; i < vertexCount; i++) {
            let boneCount = input.readInt(true);
            bonesArray.push(boneCount);
            for (let ii = 0; ii < boneCount; ii++) {
                bonesArray.push(input.readInt(true));
                weights.push(input.readFloat() * scale);
                weights.push(input.readFloat() * scale);
                weights.push(input.readFloat());
            }
        }
        vertices.vertices = Utils.toFloatArray(weights);
        vertices.bones = bonesArray;
        return vertices;
    }

     readFloatArray (input, n, scale) {
        let array = new Array(n);
        if (scale == 1) {
            for (let i = 0; i < n; i++)
                array[i] = input.readFloat();
        } else {
            for (let i = 0; i < n; i++)
                array[i] = input.readFloat() * scale;
        }
        return array;
    }

     readShortArray (input) {
        let n = input.readInt(true);
        let array = new Array(n);
        for (let i = 0; i < n; i++)
            array[i] = input.readShort();
        return array;
    }

     readAnimation (input, name, skeletonData) {
        let timelines = new Array();
        let scale = this.scale;
        let duration = 0;
        let tempColor1 = new Color();
        let tempColor2 = new Color();

        // Slot timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let slotIndex = input.readInt(true);
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let timelineType = input.readByte();
                let frameCount = input.readInt(true);
                switch (timelineType) {
                case SkeletonBinary.SLOT_ATTACHMENT: {
                    let timeline = new AttachmentTimeline(frameCount);
                    timeline.slotIndex = slotIndex;
                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++)
                        timeline.setFrame(frameIndex, input.readFloat(), input.readStringRef());
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[frameCount - 1]);
                    break;
                }
                case SkeletonBinary.SLOT_COLOR: {
                    let timeline = new ColorTimeline(frameCount);
                    timeline.slotIndex = slotIndex;
                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                        let time = input.readFloat();
                        Color.rgba8888ToColor(tempColor1, input.readInt32());
                        timeline.setFrame(frameIndex, time, tempColor1.r, tempColor1.g, tempColor1.b, tempColor1.a);
                        if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[(frameCount - 1) * ColorTimeline.ENTRIES]);
                    break;
                }
                case SkeletonBinary.SLOT_TWO_COLOR: {
                    let timeline = new TwoColorTimeline(frameCount);
                    timeline.slotIndex = slotIndex;
                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                        let time = input.readFloat();
                        Color.rgba8888ToColor(tempColor1, input.readInt32());
                        Color.rgb888ToColor(tempColor2, input.readInt32());
                        timeline.setFrame(frameIndex, time, tempColor1.r, tempColor1.g, tempColor1.b, tempColor1.a, tempColor2.r,
                            tempColor2.g, tempColor2.b);
                        if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[(frameCount - 1) * TwoColorTimeline.ENTRIES]);
                    break;
                }
                }
            }
        }

        // Bone timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let boneIndex = input.readInt(true);
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let timelineType = input.readByte();
                let frameCount = input.readInt(true);
                switch (timelineType) {
                case SkeletonBinary.BONE_ROTATE: {
                    let timeline = new RotateTimeline(frameCount);
                    timeline.boneIndex = boneIndex;
                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                        timeline.setFrame(frameIndex, input.readFloat(), input.readFloat());
                        if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[(frameCount - 1) * RotateTimeline.ENTRIES]);
                    break;
                }
                case SkeletonBinary.BONE_TRANSLATE:
                case SkeletonBinary.BONE_SCALE:
                case SkeletonBinary.BONE_SHEAR: {
                    let timeline;
                    let timelineScale = 1;
                    if (timelineType == SkeletonBinary.BONE_SCALE)
                        timeline = new ScaleTimeline(frameCount);
                    else if (timelineType == SkeletonBinary.BONE_SHEAR)
                        timeline = new ShearTimeline(frameCount);
                    else {
                        timeline = new TranslateTimeline(frameCount);
                        timelineScale = scale;
                    }
                    timeline.boneIndex = boneIndex;
                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                        timeline.setFrame(frameIndex, input.readFloat(), input.readFloat() * timelineScale,
                            input.readFloat() * timelineScale);
                        if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[(frameCount - 1) * TranslateTimeline.ENTRIES]);
                    break;
                }
                }
            }
        }

        // IK constraint timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let index = input.readInt(true);
            let frameCount = input.readInt(true);
            let timeline = new IkConstraintTimeline(frameCount);
            timeline.ikConstraintIndex = index;
            for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                timeline.setFrame(frameIndex, input.readFloat(), input.readFloat(), input.readFloat() * scale, input.readByte(), input.readBoolean(),
                    input.readBoolean());
                if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[(frameCount - 1) * IkConstraintTimeline.ENTRIES]);
        }

        // Transform constraint timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let index = input.readInt(true);
            let frameCount = input.readInt(true);
            let timeline = new TransformConstraintTimeline(frameCount);
            timeline.transformConstraintIndex = index;
            for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                timeline.setFrame(frameIndex, input.readFloat(), input.readFloat(), input.readFloat(), input.readFloat(),
                    input.readFloat());
                if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[(frameCount - 1) * TransformConstraintTimeline.ENTRIES]);
        }

        // Path constraint timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let index = input.readInt(true);
            let data = skeletonData.pathConstraints[index];
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let timelineType = input.readByte();
                let frameCount = input.readInt(true);
                switch (timelineType) {
                case SkeletonBinary.PATH_POSITION:
                case SkeletonBinary.PATH_SPACING: {
                    let timeline;
                    let timelineScale = 1;
                    if (timelineType == SkeletonBinary.PATH_SPACING) {
                        timeline = new PathConstraintSpacingTimeline(frameCount);
                        if (data.spacingMode == SpacingMode.Length || data.spacingMode == SpacingMode.Fixed) timelineScale = scale;
                    } else {
                        timeline = new PathConstraintPositionTimeline(frameCount);
                        if (data.positionMode == PositionMode.Fixed) timelineScale = scale;
                    }
                    timeline.pathConstraintIndex = index;
                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                        timeline.setFrame(frameIndex, input.readFloat(), input.readFloat() * timelineScale);
                        if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[(frameCount - 1) * PathConstraintPositionTimeline.ENTRIES]);
                    break;
                }
                case SkeletonBinary.PATH_MIX: {
                    let timeline = new PathConstraintMixTimeline(frameCount);
                    timeline.pathConstraintIndex = index;
                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                        timeline.setFrame(frameIndex, input.readFloat(), input.readFloat(), input.readFloat());
                        if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[(frameCount - 1) * PathConstraintMixTimeline.ENTRIES]);
                    break;
                }
                }
            }
        }

        // Deform timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let skin = skeletonData.skins[input.readInt(true)];
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let slotIndex = input.readInt(true);
                for (let iii = 0, nnn = input.readInt(true); iii < nnn; iii++) {
                    let attachment = skin.getAttachment(slotIndex, input.readStringRef()) ;
                    let weighted = attachment.bones != null;
                    let vertices = attachment.vertices;
                    let deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;

                    let frameCount = input.readInt(true);
                    let timeline = new DeformTimeline(frameCount);
                    timeline.slotIndex = slotIndex;
                    timeline.attachment = attachment;

                    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
                        let time = input.readFloat();
                        let deform;
                        let end = input.readInt(true);
                        if (end == 0)
                            deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
                        else {
                            deform = Utils.newFloatArray(deformLength);
                            let start = input.readInt(true);
                            end += start;
                            if (scale == 1) {
                                for (let v = start; v < end; v++)
                                    deform[v] = input.readFloat();
                            } else {
                                for (let v = start; v < end; v++)
                                    deform[v] = input.readFloat() * scale;
                            }
                            if (!weighted) {
                                for (let v = 0, vn = deform.length; v < vn; v++)
                                    deform[v] += vertices[v];
                            }
                        }

                        timeline.setFrame(frameIndex, time, deform);
                        if (frameIndex < frameCount - 1) this.readCurve(input, frameIndex, timeline);
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[frameCount - 1]);
                }
            }
        }

        // Draw order timeline.
        let drawOrderCount = input.readInt(true);
        if (drawOrderCount > 0) {
            let timeline = new DrawOrderTimeline(drawOrderCount);
            let slotCount = skeletonData.slots.length;
            for (let i = 0; i < drawOrderCount; i++) {
                let time = input.readFloat();
                let offsetCount = input.readInt(true);
                let drawOrder = Utils.newArray(slotCount, 0);
                for (let ii = slotCount - 1; ii >= 0; ii--)
                    drawOrder[ii] = -1;
                let unchanged = Utils.newArray(slotCount - offsetCount, 0);
                let originalIndex = 0, unchangedIndex = 0;
                for (let ii = 0; ii < offsetCount; ii++) {
                    let slotIndex = input.readInt(true);
                    // Collect unchanged items.
                    while (originalIndex != slotIndex)
                        unchanged[unchangedIndex++] = originalIndex++;
                    // Set changed items.
                    drawOrder[originalIndex + input.readInt(true)] = originalIndex++;
                }
                // Collect remaining unchanged items.
                while (originalIndex < slotCount)
                    unchanged[unchangedIndex++] = originalIndex++;
                // Fill in unchanged items.
                for (let ii = slotCount - 1; ii >= 0; ii--)
                    if (drawOrder[ii] == -1) drawOrder[ii] = unchanged[--unchangedIndex];
                timeline.setFrame(i, time, drawOrder);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[drawOrderCount - 1]);
        }

        // Event timeline.
        let eventCount = input.readInt(true);
        if (eventCount > 0) {
            let timeline = new EventTimeline(eventCount);
            for (let i = 0; i < eventCount; i++) {
                let time = input.readFloat();
                let eventData = skeletonData.events[input.readInt(true)];
                let event = new Event(time, eventData);
                event.intValue = input.readInt(false);
                event.floatValue = input.readFloat();
                event.stringValue = input.readBoolean() ? input.readString() : eventData.stringValue;
                if (event.data.audioPath != null) {
                    event.volume = input.readFloat();
                    event.balance = input.readFloat();
                }
                timeline.setFrame(i, event);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[eventCount - 1]);
        }

        return new Animation(name, timelines, duration);
    }

     readCurve (input, frameIndex, timeline) {
        switch (input.readByte()) {
        case SkeletonBinary.CURVE_STEPPED:
            timeline.setStepped(frameIndex);
            break;
        case SkeletonBinary.CURVE_BEZIER:
            this.setCurve(timeline, frameIndex, input.readFloat(), input.readFloat(), input.readFloat(), input.readFloat());
            break;
        }
    }

    setCurve (timeline, frameIndex, cx1, cy1, cx2, cy2) {
        timeline.setCurve(frameIndex, cx1, cy1, cx2, cy2);
    }
} SkeletonBinary.__initStatic(); SkeletonBinary.__initStatic2(); SkeletonBinary.__initStatic3(); SkeletonBinary.__initStatic4(); SkeletonBinary.__initStatic5(); SkeletonBinary.__initStatic6(); SkeletonBinary.__initStatic7(); SkeletonBinary.__initStatic8(); SkeletonBinary.__initStatic9(); SkeletonBinary.__initStatic10(); SkeletonBinary.__initStatic11(); SkeletonBinary.__initStatic12(); SkeletonBinary.__initStatic13(); SkeletonBinary.__initStatic14(); SkeletonBinary.__initStatic15(); SkeletonBinary.__initStatic16(); SkeletonBinary.__initStatic17(); SkeletonBinary.__initStatic18(); SkeletonBinary.__initStatic19();

class LinkedMesh {
     
    
    
    

    constructor (mesh, skin, slotIndex, parent, inheritDeform) {
        this.mesh = mesh;
        this.skin = skin;
        this.slotIndex = slotIndex;
        this.parent = parent;
        this.inheritDeform = inheritDeform;
    }
}

class Vertices {
    constructor( bones = null,  vertices = null) {this.bones = bones;this.vertices = vertices; }
}

/**
 * @public
 */
class SkeletonBounds {constructor() { SkeletonBounds.prototype.__init.call(this);SkeletonBounds.prototype.__init2.call(this);SkeletonBounds.prototype.__init3.call(this);SkeletonBounds.prototype.__init4.call(this);SkeletonBounds.prototype.__init5.call(this);SkeletonBounds.prototype.__init6.call(this);SkeletonBounds.prototype.__init7.call(this); }
    __init() {this.minX = 0;} __init2() {this.minY = 0;} __init3() {this.maxX = 0;} __init4() {this.maxY = 0;}
    __init5() {this.boundingBoxes = new Array();}
    __init6() {this.polygons = new Array();}
     __init7() {this.polygonPool = new Pool(() => {
        return Utils.newFloatArray(16);
    });}

    update (skeleton, updateAabb) {
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        let boundingBoxes = this.boundingBoxes;
        let polygons = this.polygons;
        let polygonPool = this.polygonPool;
        let slots = skeleton.slots;
        let slotCount = slots.length;

        boundingBoxes.length = 0;
        polygonPool.freeAll(polygons);
        polygons.length = 0;

        for (let i = 0; i < slotCount; i++) {
            let slot = slots[i];
            if (!slot.bone.active) continue;
            let attachment = slot.getAttachment();
            if (attachment instanceof BoundingBoxAttachment) {
                let boundingBox = attachment ;
                boundingBoxes.push(boundingBox);

                let polygon = polygonPool.obtain();
                if (polygon.length != boundingBox.worldVerticesLength) {
                    polygon = Utils.newFloatArray(boundingBox.worldVerticesLength);
                }
                polygons.push(polygon);
                boundingBox.computeWorldVertices(slot, 0, boundingBox.worldVerticesLength, polygon, 0, 2);
            }
        }

        if (updateAabb) {
            this.aabbCompute();
        } else {
            this.minX = Number.POSITIVE_INFINITY;
            this.minY = Number.POSITIVE_INFINITY;
            this.maxX = Number.NEGATIVE_INFINITY;
            this.maxY = Number.NEGATIVE_INFINITY;
        }
    }

    aabbCompute () {
        let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
        let polygons = this.polygons;
        for (let i = 0, n = polygons.length; i < n; i++) {
            let polygon = polygons[i];
            let vertices = polygon;
            for (let ii = 0, nn = polygon.length; ii < nn; ii += 2) {
                let x = vertices[ii];
                let y = vertices[ii + 1];
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    /** Returns true if the axis aligned bounding box contains the point. */
    aabbContainsPoint (x, y) {
        return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
    }

    /** Returns true if the axis aligned bounding box intersects the line segment. */
    aabbIntersectsSegment (x1, y1, x2, y2) {
        let minX = this.minX;
        let minY = this.minY;
        let maxX = this.maxX;
        let maxY = this.maxY;
        if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
            return false;
        let m = (y2 - y1) / (x2 - x1);
        let y = m * (minX - x1) + y1;
        if (y > minY && y < maxY) return true;
        y = m * (maxX - x1) + y1;
        if (y > minY && y < maxY) return true;
        let x = (minY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
        x = (maxY - y1) / m + x1;
        if (x > minX && x < maxX) return true;
        return false;
    }

    /** Returns true if the axis aligned bounding box intersects the axis aligned bounding box of the specified bounds. */
    aabbIntersectsSkeleton (bounds) {
        return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
    }

    /** Returns the first bounding box attachment that contains the point, or null. When doing many checks, it is usually more
     * efficient to only call this method if {@link #aabbContainsPoint(float, float)} returns true. */
    containsPoint (x, y) {
        let polygons = this.polygons;
        for (let i = 0, n = polygons.length; i < n; i++)
            if (this.containsPointPolygon(polygons[i], x, y)) return this.boundingBoxes[i];
        return null;
    }

    /** Returns true if the polygon contains the point. */
    containsPointPolygon (polygon, x, y) {
        let vertices = polygon;
        let nn = polygon.length;

        let prevIndex = nn - 2;
        let inside = false;
        for (let ii = 0; ii < nn; ii += 2) {
            let vertexY = vertices[ii + 1];
            let prevY = vertices[prevIndex + 1];
            if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y)) {
                let vertexX = vertices[ii];
                if (vertexX + (y - vertexY) / (prevY - vertexY) * (vertices[prevIndex] - vertexX) < x) inside = !inside;
            }
            prevIndex = ii;
        }
        return inside;
    }

    /** Returns the first bounding box attachment that contains any part of the line segment, or null. When doing many checks, it
     * is usually more efficient to only call this method if {@link #aabbIntersectsSegment(float, float, float, float)} returns
     * true. */
    intersectsSegment (x1, y1, x2, y2) {
        let polygons = this.polygons;
        for (let i = 0, n = polygons.length; i < n; i++)
            if (this.intersectsSegmentPolygon(polygons[i], x1, y1, x2, y2)) return this.boundingBoxes[i];
        return null;
    }

    /** Returns true if the polygon contains any part of the line segment. */
    intersectsSegmentPolygon (polygon, x1, y1, x2, y2) {
        let vertices = polygon;
        let nn = polygon.length;

        let width12 = x1 - x2, height12 = y1 - y2;
        let det1 = x1 * y2 - y1 * x2;
        let x3 = vertices[nn - 2], y3 = vertices[nn - 1];
        for (let ii = 0; ii < nn; ii += 2) {
            let x4 = vertices[ii], y4 = vertices[ii + 1];
            let det2 = x3 * y4 - y3 * x4;
            let width34 = x3 - x4, height34 = y3 - y4;
            let det3 = width12 * height34 - height12 * width34;
            let x = (det1 * width34 - width12 * det2) / det3;
            if (((x >= x3 && x <= x4) || (x >= x4 && x <= x3)) && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))) {
                let y = (det1 * height34 - height12 * det2) / det3;
                if (((y >= y3 && y <= y4) || (y >= y4 && y <= y3)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1))) return true;
            }
            x3 = x4;
            y3 = y4;
        }
        return false;
    }

    /** Returns the polygon for the specified bounding box, or null. */
    getPolygon (boundingBox) {
        if (boundingBox == null) throw new Error("boundingBox cannot be null.");
        let index = this.boundingBoxes.indexOf(boundingBox);
        return index == -1 ? null : this.polygons[index];
    }

    getWidth () {
        return this.maxX - this.minX;
    }

    getHeight () {
        return this.maxY - this.minY;
    }
}

/**
 * @public
 */
class SkeletonJson {
    
    __init() {this.scale = 1;}
     __init2() {this.linkedMeshes = new Array();}

    constructor (attachmentLoader) {SkeletonJson.prototype.__init.call(this);SkeletonJson.prototype.__init2.call(this);
        this.attachmentLoader = attachmentLoader;
    }

    readSkeletonData (json) {
        let scale = this.scale;
        let skeletonData = new SkeletonData();
        let root = typeof(json) === "string" ? JSON.parse(json) : json;

        // Skeleton
        let skeletonMap = root.skeleton;
        if (skeletonMap != null) {
            skeletonData.hash = skeletonMap.hash;
            skeletonData.version = skeletonMap.spine;
            if (skeletonData.version.substr(0, 3) !== '3.8') {
                let error = `Spine 3.8 loader cant load version ${skeletonMap.spine}. Please configure your pixi-spine bundle`;
                console.error(error);
            }
            if (skeletonData.version === '3.8.75')
            {
                let error = `Unsupported skeleton data, 3.8.75 is deprecated, please export with a newer version of Spine.`;
                console.error(error);
            }
            skeletonData.x = skeletonMap.x;
            skeletonData.y = skeletonMap.y;
            skeletonData.width = skeletonMap.width;
            skeletonData.height = skeletonMap.height;
            skeletonData.fps = skeletonMap.fps;
            skeletonData.imagesPath = skeletonMap.images;
        }

        // Bones
        if (root.bones) {
            for (let i = 0; i < root.bones.length; i++) {
                let boneMap = root.bones[i];

                let parent = null;
                let parentName = this.getValue(boneMap, "parent", null);
                if (parentName != null) {
                    parent = skeletonData.findBone(parentName);
                    if (parent == null) throw new Error("Parent bone not found: " + parentName);
                }
                let data = new BoneData(skeletonData.bones.length, boneMap.name, parent);
                data.length = this.getValue(boneMap, "length", 0) * scale;
                data.x = this.getValue(boneMap, "x", 0) * scale;
                data.y = this.getValue(boneMap, "y", 0) * scale;
                data.rotation = this.getValue(boneMap, "rotation", 0);
                data.scaleX = this.getValue(boneMap, "scaleX", 1);
                data.scaleY = this.getValue(boneMap, "scaleY", 1);
                data.shearX = this.getValue(boneMap, "shearX", 0);
                data.shearY = this.getValue(boneMap, "shearY", 0);
                data.transformMode = SkeletonJson.transformModeFromString(this.getValue(boneMap, "transform", "normal"));
                data.skinRequired = this.getValue(boneMap, "skin", false);

                skeletonData.bones.push(data);
            }
        }

        // Slots.
        if (root.slots) {
            for (let i = 0; i < root.slots.length; i++) {
                let slotMap = root.slots[i];
                let slotName = slotMap.name;
                let boneName = slotMap.bone;
                let boneData = skeletonData.findBone(boneName);
                if (boneData == null) throw new Error("Slot bone not found: " + boneName);
                let data = new SlotData(skeletonData.slots.length, slotName, boneData);

                let color = this.getValue(slotMap, "color", null);
                if (color != null) data.color.setFromString(color);

                let dark = this.getValue(slotMap, "dark", null);
                if (dark != null) {
                    data.darkColor = new Color(1, 1, 1, 1);
                    data.darkColor.setFromString(dark);
                }

                data.attachmentName = this.getValue(slotMap, "attachment", null);
                data.blendMode = SkeletonJson.blendModeFromString(this.getValue(slotMap, "blend", "normal"));
                skeletonData.slots.push(data);
            }
        }

        // IK constraints
        if (root.ik) {
            for (let i = 0; i < root.ik.length; i++) {
                let constraintMap = root.ik[i];
                let data = new IkConstraintData(constraintMap.name);
                data.order = this.getValue(constraintMap, "order", 0);
                data.skinRequired = this.getValue(constraintMap, "skin", false);

                for (let j = 0; j < constraintMap.bones.length; j++) {
                    let boneName = constraintMap.bones[j];
                    let bone = skeletonData.findBone(boneName);
                    if (bone == null) throw new Error("IK bone not found: " + boneName);
                    data.bones.push(bone);
                }

                let targetName = constraintMap.target;
                data.target = skeletonData.findBone(targetName);
                if (data.target == null) throw new Error("IK target bone not found: " + targetName);

                data.mix = this.getValue(constraintMap, "mix", 1);
                data.softness = this.getValue(constraintMap, "softness", 0) * scale;
                data.bendDirection = this.getValue(constraintMap, "bendPositive", true) ? 1 : -1;
                data.compress = this.getValue(constraintMap, "compress", false);
                data.stretch = this.getValue(constraintMap, "stretch", false);
                data.uniform = this.getValue(constraintMap, "uniform", false);

                skeletonData.ikConstraints.push(data);
            }
        }

        // Transform constraints.
        if (root.transform) {
            for (let i = 0; i < root.transform.length; i++) {
                let constraintMap = root.transform[i];
                let data = new TransformConstraintData(constraintMap.name);
                data.order = this.getValue(constraintMap, "order", 0);
                data.skinRequired = this.getValue(constraintMap, "skin", false);

                for (let j = 0; j < constraintMap.bones.length; j++) {
                    let boneName = constraintMap.bones[j];
                    let bone = skeletonData.findBone(boneName);
                    if (bone == null) throw new Error("Transform constraint bone not found: " + boneName);
                    data.bones.push(bone);
                }

                let targetName = constraintMap.target;
                data.target = skeletonData.findBone(targetName);
                if (data.target == null) throw new Error("Transform constraint target bone not found: " + targetName);

                data.local = this.getValue(constraintMap, "local", false);
                data.relative = this.getValue(constraintMap, "relative", false);
                data.offsetRotation = this.getValue(constraintMap, "rotation", 0);
                data.offsetX = this.getValue(constraintMap, "x", 0) * scale;
                data.offsetY = this.getValue(constraintMap, "y", 0) * scale;
                data.offsetScaleX = this.getValue(constraintMap, "scaleX", 0);
                data.offsetScaleY = this.getValue(constraintMap, "scaleY", 0);
                data.offsetShearY = this.getValue(constraintMap, "shearY", 0);

                data.rotateMix = this.getValue(constraintMap, "rotateMix", 1);
                data.translateMix = this.getValue(constraintMap, "translateMix", 1);
                data.scaleMix = this.getValue(constraintMap, "scaleMix", 1);
                data.shearMix = this.getValue(constraintMap, "shearMix", 1);

                skeletonData.transformConstraints.push(data);
            }
        }

        // Path constraints.
        if (root.path) {
            for (let i = 0; i < root.path.length; i++) {
                let constraintMap = root.path[i];
                let data = new PathConstraintData(constraintMap.name);
                data.order = this.getValue(constraintMap, "order", 0);
                data.skinRequired = this.getValue(constraintMap, "skin", false);

                for (let j = 0; j < constraintMap.bones.length; j++) {
                    let boneName = constraintMap.bones[j];
                    let bone = skeletonData.findBone(boneName);
                    if (bone == null) throw new Error("Transform constraint bone not found: " + boneName);
                    data.bones.push(bone);
                }

                let targetName = constraintMap.target;
                data.target = skeletonData.findSlot(targetName);
                if (data.target == null) throw new Error("Path target slot not found: " + targetName);

                data.positionMode = SkeletonJson.positionModeFromString(this.getValue(constraintMap, "positionMode", "percent"));
                data.spacingMode = SkeletonJson.spacingModeFromString(this.getValue(constraintMap, "spacingMode", "length"));
                data.rotateMode = SkeletonJson.rotateModeFromString(this.getValue(constraintMap, "rotateMode", "tangent"));
                data.offsetRotation = this.getValue(constraintMap, "rotation", 0);
                data.position = this.getValue(constraintMap, "position", 0);
                if (data.positionMode == PositionMode.Fixed) data.position *= scale;
                data.spacing = this.getValue(constraintMap, "spacing", 0);
                if (data.spacingMode == SpacingMode.Length || data.spacingMode == SpacingMode.Fixed) data.spacing *= scale;
                data.rotateMix = this.getValue(constraintMap, "rotateMix", 1);
                data.translateMix = this.getValue(constraintMap, "translateMix", 1);

                skeletonData.pathConstraints.push(data);
            }
        }

        // Skins.
        if (root.skins) {
            for (let i = 0; i < root.skins.length; i++) {
                let skinMap = root.skins[i];
                let skin = new Skin(skinMap.name);

                if (skinMap.bones) {
                    for (let ii = 0; ii < skinMap.bones.length; ii++) {
                        let bone = skeletonData.findBone(skinMap.bones[ii]);
                        if (bone == null) throw new Error("Skin bone not found: " + skinMap.bones[i]);
                        skin.bones.push(bone);
                    }
                }

                if (skinMap.ik) {
                    for (let ii = 0; ii < skinMap.ik.length; ii++) {
                        let constraint = skeletonData.findIkConstraint(skinMap.ik[ii]);
                        if (constraint == null) throw new Error("Skin IK constraint not found: " + skinMap.ik[i]);
                        skin.constraints.push(constraint);
                    }
                }

                if (skinMap.transform) {
                    for (let ii = 0; ii < skinMap.transform.length; ii++) {
                        let constraint = skeletonData.findTransformConstraint(skinMap.transform[ii]);
                        if (constraint == null) throw new Error("Skin transform constraint not found: " + skinMap.transform[i]);
                        skin.constraints.push(constraint);
                    }
                }

                if (skinMap.path) {
                    for (let ii = 0; ii < skinMap.path.length; ii++) {
                        let constraint = skeletonData.findPathConstraint(skinMap.path[ii]);
                        if (constraint == null) throw new Error("Skin path constraint not found: " + skinMap.path[i]);
                        skin.constraints.push(constraint);
                    }
                }

                for (let slotName in skinMap.attachments) {
                    let slot = skeletonData.findSlot(slotName);
                    if (slot == null) throw new Error("Slot not found: " + slotName);
                    let slotMap = skinMap.attachments[slotName];
                    for (let entryName in slotMap) {
                        let attachment = this.readAttachment(slotMap[entryName], skin, slot.index, entryName, skeletonData);
                        if (attachment != null) skin.setAttachment(slot.index, entryName, attachment);
                    }
                }
                skeletonData.skins.push(skin);
                if (skin.name == "default") skeletonData.defaultSkin = skin;
            }
        }

        // Linked meshes.
        for (let i = 0, n = this.linkedMeshes.length; i < n; i++) {
            let linkedMesh = this.linkedMeshes[i];
            let skin = linkedMesh.skin == null ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
            if (skin == null) throw new Error("Skin not found: " + linkedMesh.skin);
            let parent = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
            if (parent == null) throw new Error("Parent mesh not found: " + linkedMesh.parent);
            linkedMesh.mesh.deformAttachment = linkedMesh.inheritDeform ? parent : linkedMesh.mesh;
            linkedMesh.mesh.setParentMesh( parent);
            // linkedMesh.mesh.updateUVs();
        }
        this.linkedMeshes.length = 0;

        // Events.
        if (root.events) {
            for (let eventName in root.events) {
                let eventMap = root.events[eventName];
                let data = new EventData(eventName);
                data.intValue = this.getValue(eventMap, "int", 0);
                data.floatValue = this.getValue(eventMap, "float", 0);
                data.stringValue = this.getValue(eventMap, "string", "");
                data.audioPath = this.getValue(eventMap, "audio", null);
                if (data.audioPath != null) {
                    data.volume = this.getValue(eventMap, "volume", 1);
                    data.balance = this.getValue(eventMap, "balance", 0);
                }
                skeletonData.events.push(data);
            }
        }

        // Animations.
        if (root.animations) {
            for (let animationName in root.animations) {
                let animationMap = root.animations[animationName];
                this.readAnimation(animationMap, animationName, skeletonData);
            }
        }

        return skeletonData;
    }

    readAttachment (map, skin, slotIndex, name, skeletonData) {
        let scale = this.scale;
        name = this.getValue(map, "name", name);

        let type = this.getValue(map, "type", "region");

        switch (type) {
            case "region": {
                let path = this.getValue(map, "path", name);
                let region = this.attachmentLoader.newRegionAttachment(skin, name, path);
                if (region == null) return null;
                region.path = path;
                region.x = this.getValue(map, "x", 0) * scale;
                region.y = this.getValue(map, "y", 0) * scale;
                region.scaleX = this.getValue(map, "scaleX", 1);
                region.scaleY = this.getValue(map, "scaleY", 1);
                region.rotation = this.getValue(map, "rotation", 0);
                region.width = map.width * scale;
                region.height = map.height * scale;

                let color = this.getValue(map, "color", null);
                if (color != null) region.color.setFromString(color);

                // region.updateOffset();
                return region;
            }
            case "boundingbox": {
                let box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
                if (box == null) return null;
                this.readVertices(map, box, map.vertexCount << 1);
                let color = this.getValue(map, "color", null);
                if (color != null) box.color.setFromString(color);
                return box;
            }
            case "mesh":
            case "linkedmesh": {
                let path = this.getValue(map, "path", name);
                let mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                if (mesh == null) return null;
                mesh.path = path;

                let color = this.getValue(map, "color", null);
                if (color != null) mesh.color.setFromString(color);

                mesh.width = this.getValue(map, "width", 0) * scale;
                mesh.height = this.getValue(map, "height", 0) * scale;

                let parent = this.getValue(map, "parent", null);
                if (parent != null) {
                    this.linkedMeshes.push(new LinkedMesh$1(mesh,  this.getValue(map, "skin", null), slotIndex, parent, this.getValue(map, "deform", true)));
                    return mesh;
                }

                let uvs = map.uvs;
                this.readVertices(map, mesh, uvs.length);
                mesh.triangles = map.triangles;
                mesh.regionUVs = new Float32Array(uvs);
                // mesh.updateUVs();

                mesh.edges = this.getValue(map, "edges", null);
                mesh.hullLength = this.getValue(map, "hull", 0) * 2;
                return mesh;
            }
            case "path": {
                let path = this.attachmentLoader.newPathAttachment(skin, name);
                if (path == null) return null;
                path.closed = this.getValue(map, "closed", false);
                path.constantSpeed = this.getValue(map, "constantSpeed", true);

                let vertexCount = map.vertexCount;
                this.readVertices(map, path, vertexCount << 1);

                let lengths = Utils.newArray(vertexCount / 3, 0);
                for (let i = 0; i < map.lengths.length; i++)
                    lengths[i] = map.lengths[i] * scale;
                path.lengths = lengths;

                let color = this.getValue(map, "color", null);
                if (color != null) path.color.setFromString(color);
                return path;
            }
            case "point": {
                let point = this.attachmentLoader.newPointAttachment(skin, name);
                if (point == null) return null;
                point.x = this.getValue(map, "x", 0) * scale;
                point.y = this.getValue(map, "y", 0) * scale;
                point.rotation = this.getValue(map, "rotation", 0);

                let color = this.getValue(map, "color", null);
                if (color != null) point.color.setFromString(color);
                return point;
            }
            case "clipping": {
                let clip = this.attachmentLoader.newClippingAttachment(skin, name);
                if (clip == null) return null;

                let end = this.getValue(map, "end", null);
                if (end != null) {
                    let slot = skeletonData.findSlot(end);
                    if (slot == null) throw new Error("Clipping end slot not found: " + end);
                    clip.endSlot = slot;
                }

                let vertexCount = map.vertexCount;
                this.readVertices(map, clip, vertexCount << 1);

                let color = this.getValue(map, "color", null);
                if (color != null) clip.color.setFromString(color);
                return clip;
            }
        }
        return null;
    }

    readVertices (map, attachment, verticesLength) {
        let scale = this.scale;
        attachment.worldVerticesLength = verticesLength;
        let vertices = map.vertices;
        if (verticesLength == vertices.length) {
            let scaledVertices = Utils.toFloatArray(vertices);
            if (scale != 1) {
                for (let i = 0, n = vertices.length; i < n; i++)
                    scaledVertices[i] *= scale;
            }
            attachment.vertices = scaledVertices;
            return;
        }
        let weights = new Array();
        let bones = new Array();
        for (let i = 0, n = vertices.length; i < n;) {
            let boneCount = vertices[i++];
            bones.push(boneCount);
            for (let nn = i + boneCount * 4; i < nn; i += 4) {
                bones.push(vertices[i]);
                weights.push(vertices[i + 1] * scale);
                weights.push(vertices[i + 2] * scale);
                weights.push(vertices[i + 3]);
            }
        }
        attachment.bones = bones;
        attachment.vertices = Utils.toFloatArray(weights);
    }

    readAnimation (map, name, skeletonData) {
        let scale = this.scale;
        let timelines = new Array();
        let duration = 0;

        // Slot timelines.
        if (map.slots) {
            for (let slotName in map.slots) {
                let slotMap = map.slots[slotName];
                let slotIndex = skeletonData.findSlotIndex(slotName);
                if (slotIndex == -1) throw new Error("Slot not found: " + slotName);
                for (let timelineName in slotMap) {
                    let timelineMap = slotMap[timelineName];
                    if (timelineName == "attachment") {
                        let timeline = new AttachmentTimeline(timelineMap.length);
                        timeline.slotIndex = slotIndex;

                        let frameIndex = 0;
                        for (let i = 0; i < timelineMap.length; i++) {
                            let valueMap = timelineMap[i];
                            timeline.setFrame(frameIndex++, this.getValue(valueMap, "time", 0), valueMap.name);
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
                    } else if (timelineName == "color") {
                        let timeline = new ColorTimeline(timelineMap.length);
                        timeline.slotIndex = slotIndex;

                        let frameIndex = 0;
                        for (let i = 0; i < timelineMap.length; i++) {
                            let valueMap = timelineMap[i];
                            let color = new Color();
                            color.setFromString(valueMap.color || "ffffffff");
                            timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), color.r, color.g, color.b, color.a);
                            this.readCurve(valueMap, timeline, frameIndex);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * ColorTimeline.ENTRIES]);

                    } else if (timelineName == "twoColor") {
                        let timeline = new TwoColorTimeline(timelineMap.length);
                        timeline.slotIndex = slotIndex;

                        let frameIndex = 0;
                        for (let i = 0; i < timelineMap.length; i++) {
                            let valueMap = timelineMap[i];
                            let light = new Color();
                            let dark = new Color();
                            light.setFromString(valueMap.light);
                            dark.setFromString(valueMap.dark);
                            timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), light.r, light.g, light.b, light.a, dark.r, dark.g, dark.b);
                            this.readCurve(valueMap, timeline, frameIndex);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * TwoColorTimeline.ENTRIES]);

                    } else
                        throw new Error("Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")");
                }
            }
        }

        // Bone timelines.
        if (map.bones) {
            for (let boneName in map.bones) {
                let boneMap = map.bones[boneName];
                let boneIndex = skeletonData.findBoneIndex(boneName);
                if (boneIndex == -1) throw new Error("Bone not found: " + boneName);
                for (let timelineName in boneMap) {
                    let timelineMap = boneMap[timelineName];
                    if (timelineName === "rotate") {
                        let timeline = new RotateTimeline(timelineMap.length);
                        timeline.boneIndex = boneIndex;

                        let frameIndex = 0;
                        for (let i = 0; i < timelineMap.length; i++) {
                            let valueMap = timelineMap[i];
                            timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), this.getValue(valueMap, "angle", 0));
                            this.readCurve(valueMap, timeline, frameIndex);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * RotateTimeline.ENTRIES]);

                    } else if (timelineName === "translate" || timelineName === "scale" || timelineName === "shear") {
                        let timeline = null;
                        let timelineScale = 1, defaultValue = 0;
                        if (timelineName === "scale") {
                            timeline = new ScaleTimeline(timelineMap.length);
                            defaultValue = 1;
                        } else if (timelineName === "shear")
                            timeline = new ShearTimeline(timelineMap.length);
                        else {
                            timeline = new TranslateTimeline(timelineMap.length);
                            timelineScale = scale;
                        }
                        timeline.boneIndex = boneIndex;

                        let frameIndex = 0;
                        for (let i = 0; i < timelineMap.length; i++) {
                            let valueMap = timelineMap[i];
                            let x = this.getValue(valueMap, "x", defaultValue), y = this.getValue(valueMap, "y", defaultValue);
                            timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), x * timelineScale, y * timelineScale);
                            this.readCurve(valueMap, timeline, frameIndex);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * TranslateTimeline.ENTRIES]);

                    } else
                        throw new Error("Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")");
                }
            }
        }

        // IK constraint timelines.
        if (map.ik) {
            for (let constraintName in map.ik) {
                let constraintMap = map.ik[constraintName];
                let constraint = skeletonData.findIkConstraint(constraintName);
                let timeline = new IkConstraintTimeline(constraintMap.length);
                timeline.ikConstraintIndex = skeletonData.ikConstraints.indexOf(constraint);
                let frameIndex = 0;
                for (let i = 0; i < constraintMap.length; i++) {
                    let valueMap = constraintMap[i];
                    timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), this.getValue(valueMap, "mix", 1), this.getValue(valueMap, "softness", 0) * scale,
                        this.getValue(valueMap, "bendPositive", true) ? 1 : -1, this.getValue(valueMap, "compress", false), this.getValue(valueMap, "stretch", false));
                    this.readCurve(valueMap, timeline, frameIndex);
                    frameIndex++;
                }
                timelines.push(timeline);
                duration = Math.max(duration, timeline.frames[(timeline.getFrameCount() - 1) * IkConstraintTimeline.ENTRIES]);
            }
        }

        // Transform constraint timelines.
        if (map.transform) {
            for (let constraintName in map.transform) {
                let constraintMap = map.transform[constraintName];
                let constraint = skeletonData.findTransformConstraint(constraintName);
                let timeline = new TransformConstraintTimeline(constraintMap.length);
                timeline.transformConstraintIndex = skeletonData.transformConstraints.indexOf(constraint);
                let frameIndex = 0;
                for (let i = 0; i < constraintMap.length; i++) {
                    let valueMap = constraintMap[i];
                    timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), this.getValue(valueMap, "rotateMix", 1),
                        this.getValue(valueMap, "translateMix", 1), this.getValue(valueMap, "scaleMix", 1), this.getValue(valueMap, "shearMix", 1));
                    this.readCurve(valueMap, timeline, frameIndex);
                    frameIndex++;
                }
                timelines.push(timeline);
                duration = Math.max(duration,
                    timeline.frames[(timeline.getFrameCount() - 1) * TransformConstraintTimeline.ENTRIES]);
            }
        }

        // Path constraint timelines.
        if (map.path) {
            for (let constraintName in map.path) {
                let constraintMap = map.path[constraintName];
                let index = skeletonData.findPathConstraintIndex(constraintName);
                if (index == -1) throw new Error("Path constraint not found: " + constraintName);
                let data = skeletonData.pathConstraints[index];
                for (let timelineName in constraintMap) {
                    let timelineMap = constraintMap[timelineName];
                    if (timelineName === "position" || timelineName === "spacing") {
                        let timeline = null;
                        let timelineScale = 1;
                        if (timelineName === "spacing") {
                            timeline = new PathConstraintSpacingTimeline(timelineMap.length);
                            if (data.spacingMode == SpacingMode.Length || data.spacingMode == SpacingMode.Fixed) timelineScale = scale;
                        } else {
                            timeline = new PathConstraintPositionTimeline(timelineMap.length);
                            if (data.positionMode == PositionMode.Fixed) timelineScale = scale;
                        }
                        timeline.pathConstraintIndex = index;
                        let frameIndex = 0;
                        for (let i = 0; i < timelineMap.length; i++) {
                            let valueMap = timelineMap[i];
                            timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), this.getValue(valueMap, timelineName, 0) * timelineScale);
                            this.readCurve(valueMap, timeline, frameIndex);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration,
                            timeline.frames[(timeline.getFrameCount() - 1) * PathConstraintPositionTimeline.ENTRIES]);
                    } else if (timelineName === "mix") {
                        let timeline = new PathConstraintMixTimeline(timelineMap.length);
                        timeline.pathConstraintIndex = index;
                        let frameIndex = 0;
                        for (let i = 0; i < timelineMap.length; i++) {
                            let valueMap = timelineMap[i];
                            timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), this.getValue(valueMap, "rotateMix", 1),
                                this.getValue(valueMap, "translateMix", 1));
                            this.readCurve(valueMap, timeline, frameIndex);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration,
                            timeline.frames[(timeline.getFrameCount() - 1) * PathConstraintMixTimeline.ENTRIES]);
                    }
                }
            }
        }

        // Deform timelines.
        if (map.deform) {
            for (let deformName in map.deform) {
                let deformMap = map.deform[deformName];
                let skin = skeletonData.findSkin(deformName);
                if (skin == null) {
                   if (settings.FAIL_ON_NON_EXISTING_SKIN) {
                       throw new Error("Skin not found: " + deformName);
                   } else {
                       continue;
                   }
                }
                for (let slotName in deformMap) {
                    let slotMap = deformMap[slotName];
                    let slotIndex = skeletonData.findSlotIndex(slotName);
                    if (slotIndex == -1) throw new Error("Slot not found: " + slotMap.name);
                    for (let timelineName in slotMap) {
                        let timelineMap = slotMap[timelineName];
                        let attachment = skin.getAttachment(slotIndex, timelineName);
                        if (attachment == null) throw new Error("Deform attachment not found: " + timelineMap.name);
                        let weighted = attachment.bones != null;
                        let vertices = attachment.vertices;
                        let deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;

                        let timeline = new DeformTimeline(timelineMap.length);
                        timeline.slotIndex = slotIndex;
                        timeline.attachment = attachment;

                        let frameIndex = 0;
                        for (let j = 0; j < timelineMap.length; j++) {
                            let valueMap = timelineMap[j];
                            let deform;
                            let verticesValue = this.getValue(valueMap, "vertices", null);
                            if (verticesValue == null)
                                deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
                            else {
                                deform = Utils.newFloatArray(deformLength);
                                let start = this.getValue(valueMap, "offset", 0);
                                Utils.arrayCopy(verticesValue, 0, deform, start, verticesValue.length);
                                if (scale != 1) {
                                    for (let i = start, n = i + verticesValue.length; i < n; i++)
                                        deform[i] *= scale;
                                }
                                if (!weighted) {
                                    for (let i = 0; i < deformLength; i++)
                                        deform[i] += vertices[i];
                                }
                            }

                            timeline.setFrame(frameIndex, this.getValue(valueMap, "time", 0), deform);
                            this.readCurve(valueMap, timeline, frameIndex);
                            frameIndex++;
                        }
                        timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
                    }
                }
            }
        }

        // Draw order timeline.
        let drawOrderNode = map.drawOrder;
        if (drawOrderNode == null) drawOrderNode = map.draworder;
        if (drawOrderNode != null) {
            let timeline = new DrawOrderTimeline(drawOrderNode.length);
            let slotCount = skeletonData.slots.length;
            let frameIndex = 0;
            for (let j = 0; j < drawOrderNode.length; j++) {
                let drawOrderMap = drawOrderNode[j];
                let drawOrder = null;
                let offsets = this.getValue(drawOrderMap, "offsets", null);
                if (offsets != null) {
                    drawOrder = Utils.newArray(slotCount, -1);
                    let unchanged = Utils.newArray(slotCount - offsets.length, 0);
                    let originalIndex = 0, unchangedIndex = 0;
                    for (let i = 0; i < offsets.length; i++) {
                        let offsetMap = offsets[i];
                        let slotIndex = skeletonData.findSlotIndex(offsetMap.slot);
                        if (slotIndex == -1) throw new Error("Slot not found: " + offsetMap.slot);
                        // Collect unchanged items.
                        while (originalIndex != slotIndex)
                            unchanged[unchangedIndex++] = originalIndex++;
                        // Set changed items.
                        drawOrder[originalIndex + offsetMap.offset] = originalIndex++;
                    }
                    // Collect remaining unchanged items.
                    while (originalIndex < slotCount)
                        unchanged[unchangedIndex++] = originalIndex++;
                    // Fill in unchanged items.
                    for (let i = slotCount - 1; i >= 0; i--)
                        if (drawOrder[i] == -1) drawOrder[i] = unchanged[--unchangedIndex];
                }
                timeline.setFrame(frameIndex++, this.getValue(drawOrderMap, "time", 0), drawOrder);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
        }

        // Event timeline.
        if (map.events) {
            let timeline = new EventTimeline(map.events.length);
            let frameIndex = 0;
            for (let i = 0; i < map.events.length; i++) {
                let eventMap = map.events[i];
                let eventData = skeletonData.findEvent(eventMap.name);
                if (eventData == null) throw new Error("Event not found: " + eventMap.name);
                let event = new Event(Utils.toSinglePrecision(this.getValue(eventMap, "time", 0)), eventData);
                event.intValue = this.getValue(eventMap, "int", eventData.intValue);
                event.floatValue = this.getValue(eventMap, "float", eventData.floatValue);
                event.stringValue = this.getValue(eventMap, "string", eventData.stringValue);
                if (event.data.audioPath != null) {
                    event.volume = this.getValue(eventMap, "volume", 1);
                    event.balance = this.getValue(eventMap, "balance", 0);
                }
                timeline.setFrame(frameIndex++, event);
            }
            timelines.push(timeline);
            duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);
        }

        if (isNaN(duration)) {
            throw new Error("Error while parsing animation, duration is NaN");
        }

        skeletonData.animations.push(new Animation(name, timelines, duration));
    }

    readCurve (map, timeline, frameIndex) {
        if (!map.hasOwnProperty("curve")) return;
        if (map.curve === "stepped")
            timeline.setStepped(frameIndex);
        else {
            let curve = map.curve;
            timeline.setCurve(frameIndex, curve, this.getValue(map, "c2", 0), this.getValue(map, "c3", 1), this.getValue(map, "c4", 1));
        }
    }

    getValue (map, prop, defaultValue) {
        return map[prop] !== undefined ? map[prop] : defaultValue;
    }

    static blendModeFromString (str) {
        str = str.toLowerCase();
        if (str == "normal") return BLEND_MODES.NORMAL;
        if (str == "additive") return BLEND_MODES.ADD;
        if (str == "multiply") return BLEND_MODES.MULTIPLY;
        if (str == "screen") return BLEND_MODES.SCREEN;
        throw new Error(`Unknown blend mode: ${str}`);
    }

    static positionModeFromString (str) {
        str = str.toLowerCase();
        if (str == "fixed") return PositionMode.Fixed;
        if (str == "percent") return PositionMode.Percent;
        throw new Error(`Unknown position mode: ${str}`);
    }

    static spacingModeFromString (str) {
        str = str.toLowerCase();
        if (str == "length") return SpacingMode.Length;
        if (str == "fixed") return SpacingMode.Fixed;
        if (str == "percent") return SpacingMode.Percent;
        throw new Error(`Unknown position mode: ${str}`);
    }

    static rotateModeFromString (str) {
        str = str.toLowerCase();
        if (str == "tangent") return RotateMode.Tangent;
        if (str == "chain") return RotateMode.Chain;
        if (str == "chainscale") return RotateMode.ChainScale;
        throw new Error(`Unknown rotate mode: ${str}`);
    }

    static transformModeFromString(str) {
        str = str.toLowerCase();
        if (str == "normal") return TransformMode.Normal;
        if (str == "onlytranslation") return TransformMode.OnlyTranslation;
        if (str == "norotationorreflection") return TransformMode.NoRotationOrReflection;
        if (str == "noscale") return TransformMode.NoScale;
        if (str == "noscaleorreflection") return TransformMode.NoScaleOrReflection;
        throw new Error(`Unknown transform mode: ${str}`);
    }
}

class LinkedMesh$1 {
     
    
    
    

    constructor (mesh, skin, slotIndex, parent, inheritDeform) {
        this.mesh = mesh;
        this.skin = skin;
        this.slotIndex = slotIndex;
        this.parent = parent;
        this.inheritDeform = inheritDeform;
    }
}

/**
 * @public
 */
class Spine extends SpineBase {
    createSkeleton(spineData) {
        this.skeleton = new Skeleton(spineData);
        this.skeleton.updateWorldTransform();
        this.stateData = new AnimationStateData(spineData);
        this.state = new AnimationState(this.stateData);
    }
}

export { Animation, AnimationState, AnimationStateAdapter, AnimationStateData, AtlasAttachmentLoader, Attachment, AttachmentTimeline, Bone, BoneData, BoundingBoxAttachment, ClippingAttachment, ColorTimeline, ConstraintData, CurveTimeline, DeformTimeline, DrawOrderTimeline, Event, EventData, EventQueue, EventTimeline, EventType, IkConstraint, IkConstraintData, IkConstraintTimeline, JitterEffect, MeshAttachment, MixBlend, MixDirection, PathAttachment, PathConstraint, PathConstraintData, PathConstraintMixTimeline, PathConstraintPositionTimeline, PathConstraintSpacingTimeline, PointAttachment, PositionMode, RegionAttachment, RotateMode, RotateTimeline, ScaleTimeline, ShearTimeline, Skeleton, SkeletonBinary, SkeletonBounds, SkeletonData, SkeletonJson, Skin, SkinEntry, Slot, SlotData, SpacingMode, Spine, SwirlEffect, TimelineType, TrackEntry, TransformConstraint, TransformConstraintData, TransformConstraintTimeline, TransformMode, TranslateTimeline, TwoColorTimeline, VertexAttachment };
//# sourceMappingURL=runtime-3.8.es.js.map
