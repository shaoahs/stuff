/* eslint-disable */
 
/*!
 * @pixi-spine/runtime-4.0 - v3.0.1
 * Compiled Fri, 19 May 2023 01:56:05 UTC
 *
 * @pixi-spine/runtime-4.0 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */
import { Utils, AttachmentType, Color, MathUtils, PowOut, StringSet, Pool, settings, Vector2, BinaryInput, SpineBase } from '@pixi-spine/base';
import { Matrix } from '@pixi/math';
import { BLEND_MODES } from '@pixi/constants';

/**
 * @public
 */
class Attachment  {
    
    

    constructor (name) {
        if (name == null) throw new Error("name cannot be null.");
        this.name = name;
    }

    
}

/**
 * Base class for an attachment with vertices that are transformed by one or more bones and can be deformed by a slot's
 * {@link Slot#deform}.
 * @public
 */
class VertexAttachment extends Attachment {
     static __initStatic() {this.nextID = 0;}

    /** The unique ID for this attachment. */
    __init() {this.id = VertexAttachment.nextID++;}

    /** The bones which affect the {@link #getVertices()}. The array entries are, for each vertex, the number of bones affecting
     * the vertex followed by that many bone indices, which is the index of the bone in {@link Skeleton#bones}. Will be null
     * if this attachment has no weights. */
    

    /** The vertex positions in the bone's coordinate system. For a non-weighted attachment, the values are `x,y`
     * entries for each vertex. For a weighted attachment, the values are `x,y,weight` entries for each bone affecting
     * each vertex. */
    

    /** The maximum number of world vertex values that can be output by
     * {@link #computeWorldVertices()} using the `count` parameter. */
    __init2() {this.worldVerticesLength = 0;}

    /** Deform keys for the deform attachment are also applied to this attachment. May be null if no deform keys should be applied. */
    __init3() {this.deformAttachment = this;}

    constructor (name) {
        super(name);VertexAttachment.prototype.__init.call(this);VertexAttachment.prototype.__init2.call(this);VertexAttachment.prototype.__init3.call(this);    }

    computeWorldVerticesOld(slot, worldVertices) {
        this.computeWorldVertices(slot, 0, this.worldVerticesLength, worldVertices, 0, 2);
    }

    /** Transforms the attachment's local {@link #vertices} to world coordinates. If the slot's {@link Slot#deform} is
     * not empty, it is used to deform the vertices.
     *
     * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
     * Runtimes Guide.
     * @param start The index of the first {@link #vertices} value to transform. Each vertex has 2 values, x and y.
     * @param count The number of world vertex values to output. Must be <= {@link #worldVerticesLength} - `start`.
     * @param worldVertices The output world vertices. Must have a length >= `offset` + `count` *
     *           `stride` / 2.
     * @param offset The `worldVertices` index to begin writing values.
     * @param stride The number of `worldVertices` entries between the value pairs written. */
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

    /** Does not copy id (generated) or name (set on construction). **/
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
    /** The color of the clipping polygon as it was in Spine. Available only when nonessential data was exported. Clipping polygons
     * are not usually rendered at runtime. */
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

    

    /** The name of the texture region for this attachment. */
    

    /** The UV pair for each vertex, normalized within the texture region. */
    

    /** Triplets of vertex indices which describe the mesh's triangulation. */
    

    /** The color to tint the mesh. */
    __init2() {this.color = new Color(1, 1, 1, 1);}

    /** The width of the mesh's image. Available only when nonessential data was exported. */
    

    /** The height of the mesh's image. Available only when nonessential data was exported. */
    

    /** The number of entries at the beginning of {@link #vertices} that make up the mesh hull. */
    

    /** Vertex index pairs describing edges for controling triangulation. Mesh triangles will never cross edges. Only available if
     * nonessential data was exported. Triangulation is not performed at runtime. */
    

    
    __init3() {this.tempColor = new Color(0, 0, 0, 0);}

    constructor (name) {
        super(name);MeshAttachment.prototype.__init.call(this);MeshAttachment.prototype.__init2.call(this);MeshAttachment.prototype.__init3.call(this);    }

    /** The parent mesh if this is a linked mesh, else null. A linked mesh shares the {@link #bones}, {@link #vertices},
     * {@link #regionUVs}, {@link #triangles}, {@link #hullLength}, {@link #edges}, {@link #width}, and {@link #height} with the
     * parent mesh, but may have a different {@link #name} or {@link #path} (and therefore a different texture). */
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

    /** Returns a new mesh with the {@link #parentMesh} set to this mesh's parent mesh, if any, else to this mesh. **/
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

    /** The lengths along the path in the setup pose from the start of the path to the end of each Bezier curve. */
    

    /** If true, the start and end knots are connected. */
    __init2() {this.closed = false;}

    /** If true, additional calculations are performed to make calculating positions along the path more accurate. If false, fewer
     * calculations are performed but calculating positions along the path is less accurate. */
    __init3() {this.constantSpeed = false;}

    /** The color of the path as it was in Spine. Available only when nonessential data was exported. Paths are not usually
     * rendered at runtime. */
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

      

    /** The color of the point attachment as it was in Spine. Available only when nonessential data was exported. Point attachments
     * are not usually rendered at runtime. */
    __init2() {this.color = new Color(0.38, 0.94, 0, 1);}

    constructor (name) {
        super(name);PointAttachment.prototype.__init.call(this);PointAttachment.prototype.__init2.call(this);    }

    computeWorldPosition (bone, point) {
        const mat = bone.matrix;
        point.x = this.x * mat.a + this.y * mat.c + bone.worldX;
        point.y = this.x * mat.b + this.y * mat.d + bone.worldY;
        return point;
    }

    computeWorldRotation (bone) {
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

    /** The local x translation. */
    __init2() {this.x = 0;}

    /** The local y translation. */
    __init3() {this.y = 0;}

    /** The local scaleX. */
    __init4() {this.scaleX = 1;}

    /** The local scaleY. */
    __init5() {this.scaleY = 1;}

    /** The local rotation. */
    __init6() {this.rotation = 0;}

    /** The width of the region attachment in Spine. */
    __init7() {this.width = 0;}

    /** The height of the region attachment in Spine. */
    __init8() {this.height = 0;}

    /** The color to tint the region attachment. */
    __init9() {this.color = new Color(1, 1, 1, 1);}

    /** The name of the texture region for this attachment. */
    

    
    

    /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
     *
     * See {@link #updateOffset()}. */
    __init10() {this.offset = Utils.newFloatArray(8);}


    __init11() {this.uvs = Utils.newFloatArray(8);}

    __init12() {this.tempColor = new Color(1, 1, 1, 1);}

    constructor (name) {
        super(name);RegionAttachment.prototype.__init.call(this);RegionAttachment.prototype.__init2.call(this);RegionAttachment.prototype.__init3.call(this);RegionAttachment.prototype.__init4.call(this);RegionAttachment.prototype.__init5.call(this);RegionAttachment.prototype.__init6.call(this);RegionAttachment.prototype.__init7.call(this);RegionAttachment.prototype.__init8.call(this);RegionAttachment.prototype.__init9.call(this);RegionAttachment.prototype.__init10.call(this);RegionAttachment.prototype.__init11.call(this);RegionAttachment.prototype.__init12.call(this);    }

    /** Calculates the {@link #offset} using the region settings. Must be called after changing region settings. */
    updateOffset ()  {
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

    setRegion (region)  {
        this.region = region;
        let uvs = this.uvs;
        if (region.degrees == 90) {
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

    /** Transforms the attachment's four vertices to world coordinates.
     *
     * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
     * Runtimes Guide.
     * @param worldVertices The output world vertices. Must have a length >= `offset` + 8.
     * @param offset The `worldVertices` index to begin writing values.
     * @param stride The number of `worldVertices` entries between the value pairs written. */
    computeWorldVertices (bone, worldVertices, offset, stride) {
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

    //@ts-ignore
    begin(skeleton) {
    }

    //@ts-ignore
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

    //@ts-ignore
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

/**
 * A simple container for a list of timelines and a name.
 * @public
 * */
class Animation {
    /** The animation's name, which is unique across all animations in the skeleton. */
    
    
    

    /** The duration of the animation in seconds, which is the highest time of all keys in the timeline. */
    

    constructor (name, timelines, duration) {
        if (name == null) throw new Error("name cannot be null.");
        if (timelines == null) throw new Error("timelines cannot be null.");
        this.name = name;
        this.timelines = timelines;
        this.timelineIds = new StringSet();
        for (var i = 0; i < timelines.length; i++)
            this.timelineIds.addAll(timelines[i].getPropertyIds());
        this.duration = duration;
    }

    hasTimeline(ids) {
        for (let i = 0; i < ids.length; i++) {
            if (this.timelineIds.contains(ids[i])) return true;
        }
        return false;
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

    static search (frames, time) {
        let n = frames.length;
        for (let i = 1; i < n; i++)
            if (frames[i] > time) return i - 1;
        return n - 1;
    }

    static search2 (values, time, step) {
        let n = values.length;
        for (let i = step; i < n; i += step)
            if (values[i] > time) return i - step;
        return n - step;
    }
}

/** Controls how a timeline value is mixed with the setup pose value or current pose value when a timeline's `alpha`
 * < 1.
 *
 * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
 * @public
 * */
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
 * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
 * @public
 * */
var MixDirection; (function (MixDirection) {
    const mixIn = 0; MixDirection[MixDirection["mixIn"] = mixIn] = "mixIn"; const mixOut = mixIn + 1; MixDirection[MixDirection["mixOut"] = mixOut] = "mixOut";
})(MixDirection || (MixDirection = {}));

/**
 * @public
 */
var Property; (function (Property) {
    const rotate = 0; Property[Property["rotate"] = rotate] = "rotate"; const x = rotate + 1; Property[Property["x"] = x] = "x"; const y = x + 1; Property[Property["y"] = y] = "y"; const scaleX = y + 1; Property[Property["scaleX"] = scaleX] = "scaleX"; const scaleY = scaleX + 1; Property[Property["scaleY"] = scaleY] = "scaleY"; const shearX = scaleY + 1; Property[Property["shearX"] = shearX] = "shearX"; const shearY = shearX + 1; Property[Property["shearY"] = shearY] = "shearY"; //
    const rgb = shearY + 1; Property[Property["rgb"] = rgb] = "rgb"; const alpha = rgb + 1; Property[Property["alpha"] = alpha] = "alpha"; const rgb2 = alpha + 1; Property[Property["rgb2"] = rgb2] = "rgb2"; //
    const attachment = rgb2 + 1; Property[Property["attachment"] = attachment] = "attachment"; const deform = attachment + 1; Property[Property["deform"] = deform] = "deform"; //
    const event = deform + 1; Property[Property["event"] = event] = "event"; const drawOrder = event + 1; Property[Property["drawOrder"] = drawOrder] = "drawOrder"; //
    const ikConstraint = drawOrder + 1; Property[Property["ikConstraint"] = ikConstraint] = "ikConstraint"; const transformConstraint = ikConstraint + 1; Property[Property["transformConstraint"] = transformConstraint] = "transformConstraint"; //
    const pathConstraintPosition = transformConstraint + 1; Property[Property["pathConstraintPosition"] = pathConstraintPosition] = "pathConstraintPosition"; const pathConstraintSpacing = pathConstraintPosition + 1; Property[Property["pathConstraintSpacing"] = pathConstraintSpacing] = "pathConstraintSpacing"; const pathConstraintMix = pathConstraintSpacing + 1; Property[Property["pathConstraintMix"] = pathConstraintMix] = "pathConstraintMix";

})(Property || (Property = {}));

/** The interface for all timelines.
 * @public
 * */
class Timeline {
    
    

    constructor(frameCount, propertyIds) {
        this.propertyIds = propertyIds;
        this.frames = Utils.newFloatArray(frameCount * this.getFrameEntries());
    }

    getPropertyIds () {
        return this.propertyIds;
    }

    

    getFrameCount () {
        return this.frames.length / this.getFrameEntries();
    }

    getDuration () {
        return this.frames[this.frames.length - this.getFrameEntries()];
    }

    
}

/**
 * @public
 */













/** The base class for timelines that use interpolation between key frame values.
 * @public
 * */
class CurveTimeline extends Timeline {
    static __initStatic() {this.LINEAR = 0;} static __initStatic2() {this.STEPPED = 1;} static __initStatic3() {this.BEZIER = 2;}
    static __initStatic4() {this.BEZIER_SIZE = 18;}

     // type, x, y, ...

    constructor (frameCount, bezierCount, propertyIds) {
        super(frameCount, propertyIds);
        this.curves = Utils.newFloatArray(frameCount + bezierCount * CurveTimeline.BEZIER_SIZE);
        this.curves[frameCount - 1] = CurveTimeline.STEPPED;
    }

    /** Sets the specified key frame to linear interpolation. */
    setLinear (frame) {
        this.curves[frame] = CurveTimeline.LINEAR;
    }

    /** Sets the specified key frame to stepped interpolation. */
    setStepped (frame) {
        this.curves[frame] = CurveTimeline.STEPPED;
    }

    /** Shrinks the storage for Bezier curves, for use when <code>bezierCount</code> (specified in the constructor) was larger
     * than the actual number of Bezier curves. */
    shrink (bezierCount) {
        let size = this.getFrameCount() + bezierCount * CurveTimeline.BEZIER_SIZE;
        if (this.curves.length > size) {
            let newCurves = Utils.newFloatArray(size);
            Utils.arrayCopy(this.curves, 0, newCurves, 0, size);
            this.curves = newCurves;
        }
    }

    /** Stores the segments for the specified Bezier curve. For timelines that modify multiple values, there may be more than
     * one curve per frame.
     * @param bezier The ordinal of this Bezier curve for this timeline, between 0 and <code>bezierCount - 1</code> (specified
     *           in the constructor), inclusive.
     * @param frame Between 0 and <code>frameCount - 1</code>, inclusive.
     * @param value The index of the value for this frame that this curve is used for.
     * @param time1 The time for the first key.
     * @param value1 The value for the first key.
     * @param cx1 The time for the first Bezier handle.
     * @param cy1 The value for the first Bezier handle.
     * @param cx2 The time of the second Bezier handle.
     * @param cy2 The value for the second Bezier handle.
     * @param time2 The time for the second key.
     * @param value2 The value for the second key. */
    setBezier (bezier, frame, value, time1, value1, cx1, cy1, cx2,
               cy2, time2, value2) {
        let curves = this.curves;
        let i = this.getFrameCount() + bezier * CurveTimeline.BEZIER_SIZE;
        if (value == 0) curves[frame] = CurveTimeline.BEZIER + i;
        let tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = (value1 - cy1 * 2 + cy2) * 0.03;
        let dddx = ((cx1 - cx2) * 3 - time1 + time2) * 0.006, dddy = ((cy1 - cy2) * 3 - value1 + value2) * 0.006;
        let ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
        let dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = (cy1 - value1) * 0.3 + tmpy + dddy * 0.16666667;
        let x = time1 + dx, y = value1 + dy;
        for (let n = i + CurveTimeline.BEZIER_SIZE; i < n; i += 2) {
            curves[i] = x;
            curves[i + 1] = y;
            dx += ddx;
            dy += ddy;
            ddx += dddx;
            ddy += dddy;
            x += dx;
            y += dy;
        }
    }

    /** Returns the Bezier interpolated value for the specified time.
     * @param frameIndex The index into {@link #getFrames()} for the values of the frame before <code>time</code>.
     * @param valueOffset The offset from <code>frameIndex</code> to the value this curve is used for.
     * @param i The index of the Bezier segments. See {@link #getCurveType(int)}. */
    getBezierValue (time, frameIndex, valueOffset, i) {
        let curves = this.curves;
        let frames = this.frames;
        if (curves[i] > time) {
            let x = frames[frameIndex], y = frames[frameIndex + valueOffset];
            return y + (time - x) / (curves[i] - x) * (curves[i + 1] - y);
        }
        let n = i + CurveTimeline.BEZIER_SIZE;
        for (i += 2; i < n; i += 2) {
            if (curves[i] >= time) {
                let x = curves[i - 2], y = curves[i - 1];
                return y + (time - x) / (curves[i] - x) * (curves[i + 1] - y);
            }
        }
        frameIndex += this.getFrameEntries();
        let x = curves[n - 2], y = curves[n - 1];
        return y + (time - x) / (frames[frameIndex] - x) * (frames[frameIndex + valueOffset] - y);
    }
} CurveTimeline.__initStatic(); CurveTimeline.__initStatic2(); CurveTimeline.__initStatic3(); CurveTimeline.__initStatic4();
/**
 * @public
 */
class CurveTimeline1 extends CurveTimeline {
    static __initStatic5() {this.ENTRIES = 2;}
    static __initStatic6() {this.VALUE = 1;}

    constructor(frameCount, bezierCount, propertyIds) {
        super(frameCount, bezierCount, propertyIds);
    }

    getFrameEntries() {
        return CurveTimeline1.ENTRIES;
    }

    /** Sets the time and value for the specified frame.
     * @param frame Between 0 and <code>frameCount</code>, inclusive.
     * @param time The frame time in seconds. */
    setFrame (frame, time, value) {
        frame <<= 1;
        this.frames[frame] = time;
        this.frames[frame + CurveTimeline1.VALUE] = value;
    }

    /** Returns the interpolated value for the specified time. */
    getCurveValue (time) {
        let frames = this.frames;
        let i = frames.length - 2;
        for (let ii = 2; ii <= i; ii += 2) {
            if (frames[ii] > time) {
                i = ii - 2;
                break;
            }
        }

        let curveType = this.curves[i >> 1];
        switch (curveType) {
            case CurveTimeline.LINEAR:
                let before = frames[i], value = frames[i + CurveTimeline1.VALUE];
                return value + (time - before) / (frames[i + CurveTimeline1.ENTRIES] - before) * (frames[i + CurveTimeline1.ENTRIES + CurveTimeline1.VALUE] - value);
            case CurveTimeline.STEPPED:
                return frames[i + CurveTimeline1.VALUE];
        }
        return this.getBezierValue(time, i, CurveTimeline1.VALUE, curveType - CurveTimeline1.BEZIER);
    }
} CurveTimeline1.__initStatic5(); CurveTimeline1.__initStatic6();

/** The base class for a {@link CurveTimeline} which sets two properties.
 * @public
 * */
class CurveTimeline2 extends CurveTimeline {
    static __initStatic7() {this.ENTRIES = 3;}
    static __initStatic8() {this.VALUE1 = 1;}
    static __initStatic9() {this.VALUE2 = 2;}

    /** @param bezierCount The maximum number of Bezier curves. See {@link #shrink(int)}.
     * @param propertyIds Unique identifiers for the properties the timeline modifies. */
    constructor (frameCount, bezierCount, propertyIds) {
        super(frameCount, bezierCount, propertyIds);
    }

    getFrameEntries () {
        return CurveTimeline2.ENTRIES;
    }

    /** Sets the time and values for the specified frame.
     * @param frame Between 0 and <code>frameCount</code>, inclusive.
     * @param time The frame time in seconds. */
    setFrame (frame, time, value1, value2) {
        frame *= CurveTimeline2.ENTRIES;
        let frames = this.frames;
        frames[frame] = time;
        frames[frame + CurveTimeline2.VALUE1] = value1;
        frames[frame + CurveTimeline2.VALUE2] = value2;
    }
} CurveTimeline2.__initStatic7(); CurveTimeline2.__initStatic8(); CurveTimeline2.__initStatic9();

/** Changes a bone's local {@link Bone#rotation}.
 * @public
 * */
class RotateTimeline extends CurveTimeline1  {
    __init() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.rotate + "|" + boneIndex
        ]);RotateTimeline.prototype.__init.call(this);        this.boneIndex = boneIndex;
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
                    bone.rotation += (bone.data.rotation - bone.rotation) * alpha;
            }
            return;
        }

        let r = this.getCurveValue(time);
        switch (blend) {
            case MixBlend.setup:
                bone.rotation = bone.data.rotation + r * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                r += bone.data.rotation - bone.rotation;
            case MixBlend.add:
                bone.rotation += r * alpha;
        }
    }
}

/** Changes a bone's local {@link Bone#x} and {@link Bone#y}.
 * @public
 * */
class TranslateTimeline extends CurveTimeline2  {
    __init2() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.x + "|" + boneIndex,
            Property.y + "|" + boneIndex,
        ]);TranslateTimeline.prototype.__init2.call(this);        this.boneIndex = boneIndex;
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
        let i = Animation.search2(frames, time, CurveTimeline2.ENTRIES);
        let curveType = this.curves[i / CurveTimeline2.ENTRIES];
        switch (curveType) {
            case CurveTimeline.LINEAR:
                let before = frames[i];
                x = frames[i + CurveTimeline2.VALUE1];
                y = frames[i + CurveTimeline2.VALUE2];
                let t = (time - before) / (frames[i + CurveTimeline2.ENTRIES] - before);
                x += (frames[i + CurveTimeline2.ENTRIES + CurveTimeline2.VALUE1] - x) * t;
                y += (frames[i + CurveTimeline2.ENTRIES + CurveTimeline2.VALUE2] - y) * t;
                break;
            case CurveTimeline.STEPPED:
                x = frames[i + CurveTimeline2.VALUE1];
                y = frames[i + CurveTimeline2.VALUE2];
                break;
            default:
                x = this.getBezierValue(time, i, CurveTimeline2.VALUE1, curveType - CurveTimeline.BEZIER);
                y = this.getBezierValue(time, i, CurveTimeline2.VALUE2, curveType + CurveTimeline.BEZIER_SIZE - CurveTimeline.BEZIER);
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
}

/** Changes a bone's local {@link Bone#x}.
 * @public
 * */
class TranslateXTimeline extends CurveTimeline1  {
    __init3() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.x + "|" + boneIndex
        ]);TranslateXTimeline.prototype.__init3.call(this);        this.boneIndex = boneIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;

        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.x = bone.data.x;
                    return;
                case MixBlend.first:
                    bone.x += (bone.data.x - bone.x) * alpha;
            }
            return;
        }

        let x = this.getCurveValue(time);
        switch (blend) {
            case MixBlend.setup:
                bone.x = bone.data.x + x * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                bone.x += (bone.data.x + x - bone.x) * alpha;
                break;
            case MixBlend.add:
                bone.x += x * alpha;
        }
    }
}

/** Changes a bone's local {@link Bone#x}.
 * @public
 * */
class TranslateYTimeline extends CurveTimeline1  {
    __init4() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.y + "|" + boneIndex
        ]);TranslateYTimeline.prototype.__init4.call(this);        this.boneIndex = boneIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;

        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.y = bone.data.y;
                    return;
                case MixBlend.first:
                    bone.y += (bone.data.y - bone.y) * alpha;
            }
            return;
        }

        let y = this.getCurveValue(time);
        switch (blend) {
            case MixBlend.setup:
                bone.y = bone.data.y + y * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                bone.y += (bone.data.y + y - bone.y) * alpha;
                break;
            case MixBlend.add:
                bone.y += y * alpha;
        }
    }
}

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
 * @public
 * */
class ScaleTimeline extends CurveTimeline2  {
    __init5() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.scaleX + "|" + boneIndex,
            Property.scaleY + "|" + boneIndex
        ]);ScaleTimeline.prototype.__init5.call(this);        this.boneIndex = boneIndex;
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
        let i = Animation.search2(frames, time, CurveTimeline2.ENTRIES);
        let curveType = this.curves[i / CurveTimeline2.ENTRIES];
        switch (curveType) {
            case CurveTimeline.LINEAR:
                let before = frames[i];
                x = frames[i + CurveTimeline2.VALUE1];
                y = frames[i + CurveTimeline2.VALUE2];
                let t = (time - before) / (frames[i + CurveTimeline2.ENTRIES] - before);
                x += (frames[i + CurveTimeline2.ENTRIES + CurveTimeline2.VALUE1] - x) * t;
                y += (frames[i + CurveTimeline2.ENTRIES + CurveTimeline2.VALUE2] - y) * t;
                break;
            case CurveTimeline.STEPPED:
                x = frames[i + CurveTimeline2.VALUE1];
                y = frames[i + CurveTimeline2.VALUE2];
                break;
            default:
                x = this.getBezierValue(time, i, CurveTimeline2.VALUE1, curveType - CurveTimeline2.BEZIER);
                y = this.getBezierValue(time, i, CurveTimeline2.VALUE2, curveType + CurveTimeline2.BEZIER_SIZE - CurveTimeline2.BEZIER);
        }
        x *= bone.data.scaleX;
        y *= bone.data.scaleY;

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

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
 * @public
 * */
class ScaleXTimeline extends CurveTimeline1  {
    __init6() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.scaleX + "|" + boneIndex
        ]);ScaleXTimeline.prototype.__init6.call(this);        this.boneIndex = boneIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;

        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.scaleX = bone.data.scaleX;
                    return;
                case MixBlend.first:
                    bone.scaleX += (bone.data.scaleX - bone.scaleX) * alpha;
            }
            return;
        }

        let x = this.getCurveValue(time) * bone.data.scaleX;
        if (alpha == 1) {
            if (blend == MixBlend.add)
                bone.scaleX += x - bone.data.scaleX;
            else
                bone.scaleX = x;
        } else {
            // Mixing out uses sign of setup or current pose, else use sign of key.
            let bx = 0;
            if (direction == MixDirection.mixOut) {
                switch (blend) {
                    case MixBlend.setup:
                        bx = bone.data.scaleX;
                        bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                        break;
                    case MixBlend.first:
                    case MixBlend.replace:
                        bx = bone.scaleX;
                        bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bx) * alpha;
                        break;
                    case MixBlend.add:
                        bx = bone.scaleX;
                        bone.scaleX = bx + (Math.abs(x) * MathUtils.signum(bx) - bone.data.scaleX) * alpha;
                }
            } else {
                switch (blend) {
                    case MixBlend.setup:
                        bx = Math.abs(bone.data.scaleX) * MathUtils.signum(x);
                        bone.scaleX = bx + (x - bx) * alpha;
                        break;
                    case MixBlend.first:
                    case MixBlend.replace:
                        bx = Math.abs(bone.scaleX) * MathUtils.signum(x);
                        bone.scaleX = bx + (x - bx) * alpha;
                        break;
                    case MixBlend.add:
                        bx = MathUtils.signum(x);
                        bone.scaleX = Math.abs(bone.scaleX) * bx + (x - Math.abs(bone.data.scaleX) * bx) * alpha;
                }
            }
        }
    }
}

/** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
 * @public
 * */
class ScaleYTimeline extends CurveTimeline1  {
    __init7() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.scaleY + "|" + boneIndex
        ]);ScaleYTimeline.prototype.__init7.call(this);        this.boneIndex = boneIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;

        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.scaleY = bone.data.scaleY;
                    return;
                case MixBlend.first:
                    bone.scaleY += (bone.data.scaleY - bone.scaleY) * alpha;
            }
            return;
        }

        let y = this.getCurveValue(time) * bone.data.scaleY;
        if (alpha == 1) {
            if (blend == MixBlend.add)
                bone.scaleY += y - bone.data.scaleY;
            else
                bone.scaleY = y;
        } else {
            // Mixing out uses sign of setup or current pose, else use sign of key.
            let by = 0;
            if (direction == MixDirection.mixOut) {
                switch (blend) {
                    case MixBlend.setup:
                        by = bone.data.scaleY;
                        bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                        break;
                    case MixBlend.first:
                    case MixBlend.replace:
                        by = bone.scaleY;
                        bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - by) * alpha;
                        break;
                    case MixBlend.add:
                        by = bone.scaleY;
                        bone.scaleY = by + (Math.abs(y) * MathUtils.signum(by) - bone.data.scaleY) * alpha;
                }
            } else {
                switch (blend) {
                    case MixBlend.setup:
                        by = Math.abs(bone.data.scaleY) * MathUtils.signum(y);
                        bone.scaleY = by + (y - by) * alpha;
                        break;
                    case MixBlend.first:
                    case MixBlend.replace:
                        by = Math.abs(bone.scaleY) * MathUtils.signum(y);
                        bone.scaleY = by + (y - by) * alpha;
                        break;
                    case MixBlend.add:
                        by = MathUtils.signum(y);
                        bone.scaleY = Math.abs(bone.scaleY) * by + (y - Math.abs(bone.data.scaleY) * by) * alpha;
                }
            }
        }
    }
}

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
class ShearTimeline extends CurveTimeline2  {
    __init8() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.shearX + "|" + boneIndex,
            Property.shearY + "|" + boneIndex
        ]);ShearTimeline.prototype.__init8.call(this);        this.boneIndex = boneIndex;
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
        let i = Animation.search2(frames, time, CurveTimeline2.ENTRIES);
        let curveType = this.curves[i / CurveTimeline2.ENTRIES];
        switch (curveType) {
            case CurveTimeline2.LINEAR:
                let before = frames[i];
                x = frames[i + CurveTimeline2.VALUE1];
                y = frames[i + CurveTimeline2.VALUE2];
                let t = (time - before) / (frames[i + CurveTimeline2.ENTRIES] - before);
                x += (frames[i + CurveTimeline2.ENTRIES + CurveTimeline2.VALUE1] - x) * t;
                y += (frames[i + CurveTimeline2.ENTRIES + CurveTimeline2.VALUE2] - y) * t;
                break;
            case CurveTimeline2.STEPPED:
                x = frames[i + CurveTimeline2.VALUE1];
                y = frames[i + CurveTimeline2.VALUE2];
                break;
            default:
                x = this.getBezierValue(time, i, CurveTimeline2.VALUE1, curveType - CurveTimeline2.BEZIER);
                y = this.getBezierValue(time, i, CurveTimeline2.VALUE2, curveType + CurveTimeline2.BEZIER_SIZE - CurveTimeline2.BEZIER);
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

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
class ShearXTimeline extends CurveTimeline1  {
    __init9() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.shearX + "|" + boneIndex
        ]);ShearXTimeline.prototype.__init9.call(this);        this.boneIndex = boneIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;

        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.shearX = bone.data.shearX;
                    return;
                case MixBlend.first:
                    bone.shearX += (bone.data.shearX - bone.shearX) * alpha;
            }
            return;
        }

        let x = this.getCurveValue(time);
        switch (blend) {
            case MixBlend.setup:
                bone.shearX = bone.data.shearX + x * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                bone.shearX += (bone.data.shearX + x - bone.shearX) * alpha;
                break;
            case MixBlend.add:
                bone.shearX += x * alpha;
        }
    }
}

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
class ShearYTimeline extends CurveTimeline1  {
    __init10() {this.boneIndex = 0;}

    constructor (frameCount, bezierCount, boneIndex) {
        super(frameCount, bezierCount, [
            Property.shearY + "|" + boneIndex
        ]);ShearYTimeline.prototype.__init10.call(this);        this.boneIndex = boneIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let bone = skeleton.bones[this.boneIndex];
        if (!bone.active) return;

        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    bone.shearY = bone.data.shearY;
                    return;
                case MixBlend.first:
                    bone.shearY += (bone.data.shearY - bone.shearY) * alpha;
            }
            return;
        }

        let y = this.getCurveValue(time);
        switch (blend) {
            case MixBlend.setup:
                bone.shearY = bone.data.shearY + y * alpha;
                break;
            case MixBlend.first:
            case MixBlend.replace:
                bone.shearY += (bone.data.shearY + y - bone.shearY) * alpha;
                break;
            case MixBlend.add:
                bone.shearY += y * alpha;
        }
    }
}

/** Changes a slot's {@link Slot#color}.
 * @public
 * */
class RGBATimeline extends CurveTimeline  {
    static __initStatic10() {this.ENTRIES = 5;}

    static __initStatic11() {this.R = 1;} static __initStatic12() {this.G = 2;} static __initStatic13() {this.B = 3;} static __initStatic14() {this.A = 4;}

    __init11() {this.slotIndex = 0;}

    constructor (frameCount, bezierCount, slotIndex) {
        super(frameCount, bezierCount, [
            Property.rgb + "|" + slotIndex,
            Property.alpha + "|" + slotIndex
        ]);RGBATimeline.prototype.__init11.call(this);        this.slotIndex = slotIndex;
    }

    getFrameEntries () {
        return RGBATimeline.ENTRIES;
    }

    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame (frame, time, r, g, b, a) {
        frame *= RGBATimeline.ENTRIES;
        this.frames[frame] = time;
        this.frames[frame + RGBATimeline.R] = r;
        this.frames[frame + RGBATimeline.G] = g;
        this.frames[frame + RGBATimeline.B] = b;
        this.frames[frame + RGBATimeline.A] = a;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;

        let frames = this.frames;
        if (time < frames[0]) {
            let color = slot.color, setup = slot.data.color;
            switch (blend) {
                case MixBlend.setup:
                    color.setFromColor(slot.data.color);
                    return;
                case MixBlend.first:
                    color.add((setup.r - color.r) * alpha, (setup.g - color.g) * alpha, (setup.b - color.b) * alpha,
                        (setup.a - color.a) * alpha);
            }
            return;
        }

        let r = 0, g = 0, b = 0, a = 0;
        let i = Animation.search2(frames, time, RGBATimeline.ENTRIES);
        let curveType = this.curves[i / RGBATimeline.ENTRIES];
        switch (curveType) {
            case RGBATimeline.LINEAR:
                let before = frames[i];
                r = frames[i + RGBATimeline.R];
                g = frames[i + RGBATimeline.G];
                b = frames[i + RGBATimeline.B];
                a = frames[i + RGBATimeline.A];
                let t = (time - before) / (frames[i + RGBATimeline.ENTRIES] - before);
                r += (frames[i + RGBATimeline.ENTRIES + RGBATimeline.R] - r) * t;
                g += (frames[i + RGBATimeline.ENTRIES + RGBATimeline.G] - g) * t;
                b += (frames[i + RGBATimeline.ENTRIES + RGBATimeline.B] - b) * t;
                a += (frames[i + RGBATimeline.ENTRIES + RGBATimeline.A] - a) * t;
                break;
            case RGBATimeline.STEPPED:
                r = frames[i + RGBATimeline.R];
                g = frames[i + RGBATimeline.G];
                b = frames[i + RGBATimeline.B];
                a = frames[i + RGBATimeline.A];
                break;
            default:
                r = this.getBezierValue(time, i, RGBATimeline.R, curveType - RGBATimeline.BEZIER);
                g = this.getBezierValue(time, i, RGBATimeline.G, curveType + RGBATimeline.BEZIER_SIZE - RGBATimeline.BEZIER);
                b = this.getBezierValue(time, i, RGBATimeline.B, curveType + RGBATimeline.BEZIER_SIZE * 2 - RGBATimeline.BEZIER);
                a = this.getBezierValue(time, i, RGBATimeline.A, curveType + RGBATimeline.BEZIER_SIZE * 3 - RGBATimeline.BEZIER);
        }
        let color = slot.color;
        if (alpha == 1)
            color.set(r, g, b, a);
        else {
            if (blend == MixBlend.setup) color.setFromColor(slot.data.color);
            color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha, (a - color.a) * alpha);
        }
    }
} RGBATimeline.__initStatic10(); RGBATimeline.__initStatic11(); RGBATimeline.__initStatic12(); RGBATimeline.__initStatic13(); RGBATimeline.__initStatic14();

/** Changes a slot's {@link Slot#color}.
 * @public
 * */
class RGBTimeline extends CurveTimeline  {
    static __initStatic15() {this.ENTRIES = 4;}

    static __initStatic16() {this.R = 1;} static __initStatic17() {this.G = 2;} static __initStatic18() {this.B = 3;}

    __init12() {this.slotIndex = 0;}

    constructor (frameCount, bezierCount, slotIndex) {
        super(frameCount, bezierCount, [
            Property.rgb + "|" + slotIndex
        ]);RGBTimeline.prototype.__init12.call(this);        this.slotIndex = slotIndex;
    }

    getFrameEntries () {
        return RGBTimeline.ENTRIES;
    }

    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame (frame, time, r, g, b) {
        frame *= RGBTimeline.ENTRIES;
        this.frames[frame] = time;
        this.frames[frame + RGBTimeline.R] = r;
        this.frames[frame + RGBTimeline.G] = g;
        this.frames[frame + RGBTimeline.B] = b;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;

        let frames = this.frames;
        if (time < frames[0]) {
            let color = slot.color, setup = slot.data.color;
            switch (blend) {
                case MixBlend.setup:
                    color.r = setup.r;
                    color.g = setup.g;
                    color.b = setup.b;
                    return;
                case MixBlend.first:
                    color.r += (setup.r - color.r) * alpha;
                    color.g += (setup.g - color.g) * alpha;
                    color.b += (setup.b - color.b) * alpha;
            }
            return;
        }

        let r = 0, g = 0, b = 0;
        let i = Animation.search2(frames, time, RGBTimeline.ENTRIES);
        let curveType = this.curves[i / RGBTimeline.ENTRIES];
        switch (curveType) {
            case RGBTimeline.LINEAR:
                let before = frames[i];
                r = frames[i + RGBTimeline.R];
                g = frames[i + RGBTimeline.G];
                b = frames[i + RGBTimeline.B];
                let t = (time - before) / (frames[i + RGBTimeline.ENTRIES] - before);
                r += (frames[i + RGBTimeline.ENTRIES + RGBTimeline.R] - r) * t;
                g += (frames[i + RGBTimeline.ENTRIES + RGBTimeline.G] - g) * t;
                b += (frames[i + RGBTimeline.ENTRIES + RGBTimeline.B] - b) * t;
                break;
            case RGBATimeline.STEPPED:
                r = frames[i + RGBTimeline.R];
                g = frames[i + RGBTimeline.G];
                b = frames[i + RGBTimeline.B];
                break;
            default:
                r = this.getBezierValue(time, i, RGBTimeline.R, curveType - RGBTimeline.BEZIER);
                g = this.getBezierValue(time, i, RGBTimeline.G, curveType + RGBTimeline.BEZIER_SIZE - RGBTimeline.BEZIER);
                b = this.getBezierValue(time, i, RGBTimeline.B, curveType + RGBTimeline.BEZIER_SIZE * 2 - RGBTimeline.BEZIER);
        }
        let color = slot.color;
        if (alpha == 1) {
            color.r = r;
            color.g = g;
            color.b = b;
        } else {
            if (blend == MixBlend.setup) {
                let setup = slot.data.color;
                color.r = setup.r;
                color.g = setup.g;
                color.b = setup.b;
            }
            color.r += (r - color.r) * alpha;
            color.g += (g - color.g) * alpha;
            color.b += (b - color.b) * alpha;
        }
    }
} RGBTimeline.__initStatic15(); RGBTimeline.__initStatic16(); RGBTimeline.__initStatic17(); RGBTimeline.__initStatic18();

/** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
 * @public
 * */
class AlphaTimeline extends CurveTimeline1  {
    __init13() {this.slotIndex = 0;}

    constructor (frameCount, bezierCount, slotIndex) {
        super(frameCount, bezierCount, [
            Property.alpha + "|" + slotIndex
        ]);AlphaTimeline.prototype.__init13.call(this);        this.slotIndex = slotIndex;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let frames = this.frames;

        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;

        if (time < frames[0]) { // Time is before first frame.
            let color = slot.color, setup = slot.data.color;
            switch (blend) {
                case MixBlend.setup:
                    color.a = setup.a;
                    return;
                case MixBlend.first:
                    color.a += (setup.a - color.a) * alpha;
            }
            return;
        }

        let a = this.getCurveValue(time);
        if (alpha == 1)
            slot.color.a = a;
        else {
            if (blend == MixBlend.setup) slot.color.a = slot.data.color.a;
            slot.color.a += (a - slot.color.a) * alpha;
        }
    }
}

/** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting.
 * @public
 * */
class RGBA2Timeline extends CurveTimeline {
    static __initStatic19() {this.ENTRIES = 8;}

    static __initStatic20() {this.R = 1;} static __initStatic21() {this.G = 2;} static __initStatic22() {this.B = 3;} static __initStatic23() {this.A = 4;} static __initStatic24() {this.R2 = 5;} static __initStatic25() {this.G2 = 6;} static __initStatic26() {this.B2 = 7;}

    __init14() {this.slotIndex = 0;}

    constructor (frameCount, bezierCount, slotIndex) {
        super(frameCount, bezierCount, [
            Property.rgb + "|" + slotIndex,
            Property.alpha + "|" + slotIndex,
            Property.rgb2 + "|" + slotIndex
        ]);RGBA2Timeline.prototype.__init14.call(this);        this.slotIndex = slotIndex;
    }

    getFrameEntries () {
        return RGBA2Timeline.ENTRIES;
    }

    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame (frame, time, r, g, b, a, r2, g2, b2) {
        frame *= RGBA2Timeline.ENTRIES;
        this.frames[frame] = time;
        this.frames[frame + RGBA2Timeline.R] = r;
        this.frames[frame + RGBA2Timeline.G] = g;
        this.frames[frame + RGBA2Timeline.B] = b;
        this.frames[frame + RGBA2Timeline.A] = a;
        this.frames[frame + RGBA2Timeline.R2] = r2;
        this.frames[frame + RGBA2Timeline.G2] = g2;
        this.frames[frame + RGBA2Timeline.B2] = b2;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;

        let frames = this.frames;
        if (time < frames[0]) {
            let light = slot.color, dark = slot.darkColor, setupLight = slot.data.color, setupDark = slot.data.darkColor;
            switch (blend) {
                case MixBlend.setup:
                    light.setFromColor(setupLight);
                    dark.r = setupDark.r;
                    dark.g = setupDark.g;
                    dark.b = setupDark.b;
                    return;
                case MixBlend.first:
                    light.add((setupLight.r - light.r) * alpha, (setupLight.g - light.g) * alpha, (setupLight.b - light.b) * alpha,
                        (setupLight.a - light.a) * alpha);
                    dark.r += (setupDark.r - dark.r) * alpha;
                    dark.g += (setupDark.g - dark.g) * alpha;
                    dark.b += (setupDark.b - dark.b) * alpha;
            }
            return;
        }

        let r = 0, g = 0, b = 0, a = 0, r2 = 0, g2 = 0, b2 = 0;
        let i = Animation.search2(frames, time, RGBA2Timeline.ENTRIES);
        let curveType = this.curves[i >> 3];
        switch (curveType) {
            case RGBA2Timeline.LINEAR:
                let before = frames[i];
                r = frames[i + RGBA2Timeline.R];
                g = frames[i + RGBA2Timeline.G];
                b = frames[i + RGBA2Timeline.B];
                a = frames[i + RGBA2Timeline.A];
                r2 = frames[i + RGBA2Timeline.R2];
                g2 = frames[i + RGBA2Timeline.G2];
                b2 = frames[i + RGBA2Timeline.B2];
                let t = (time - before) / (frames[i + RGBA2Timeline.ENTRIES] - before);
                r += (frames[i + RGBA2Timeline.ENTRIES + RGBA2Timeline.R] - r) * t;
                g += (frames[i + RGBA2Timeline.ENTRIES + RGBA2Timeline.G] - g) * t;
                b += (frames[i + RGBA2Timeline.ENTRIES + RGBA2Timeline.B] - b) * t;
                a += (frames[i + RGBA2Timeline.ENTRIES + RGBA2Timeline.A] - a) * t;
                r2 += (frames[i + RGBA2Timeline.ENTRIES + RGBA2Timeline.R2] - r2) * t;
                g2 += (frames[i + RGBA2Timeline.ENTRIES + RGBA2Timeline.G2] - g2) * t;
                b2 += (frames[i + RGBA2Timeline.ENTRIES + RGBA2Timeline.B2] - b2) * t;
                break;
            case RGBA2Timeline.STEPPED:
                r = frames[i + RGBA2Timeline.R];
                g = frames[i + RGBA2Timeline.G];
                b = frames[i + RGBA2Timeline.B];
                a = frames[i + RGBA2Timeline.A];
                r2 = frames[i + RGBA2Timeline.R2];
                g2 = frames[i + RGBA2Timeline.G2];
                b2 = frames[i + RGBA2Timeline.B2];
                break;
            default:
                r = this.getBezierValue(time, i, RGBA2Timeline.R, curveType - RGBA2Timeline.BEZIER);
                g = this.getBezierValue(time, i, RGBA2Timeline.G, curveType + RGBA2Timeline.BEZIER_SIZE - RGBA2Timeline.BEZIER);
                b = this.getBezierValue(time, i, RGBA2Timeline.B, curveType + RGBA2Timeline.BEZIER_SIZE * 2 - RGBA2Timeline.BEZIER);
                a = this.getBezierValue(time, i, RGBA2Timeline.A, curveType + RGBA2Timeline.BEZIER_SIZE * 3 - RGBA2Timeline.BEZIER);
                r2 = this.getBezierValue(time, i, RGBA2Timeline.R2, curveType + RGBA2Timeline.BEZIER_SIZE * 4 - RGBA2Timeline.BEZIER);
                g2 = this.getBezierValue(time, i, RGBA2Timeline.G2, curveType + RGBA2Timeline.BEZIER_SIZE * 5 - RGBA2Timeline.BEZIER);
                b2 = this.getBezierValue(time, i, RGBA2Timeline.B2, curveType + RGBA2Timeline.BEZIER_SIZE * 6 - RGBA2Timeline.BEZIER);
        }

        let light = slot.color, dark = slot.darkColor;
        if (alpha == 1) {
            light.set(r, g, b, a);
            dark.r = r2;
            dark.g = g2;
            dark.b = b2;
        } else {
            if (blend == MixBlend.setup) {
                light.setFromColor(slot.data.color);
                dark.setFromColor(slot.data.darkColor);
            }
            light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha, (a - light.a) * alpha);
            dark.r += (r2 - dark.r) * alpha;
            dark.g += (g2 - dark.g) * alpha;
            dark.b += (b2 - dark.b) * alpha;
        }
    }
} RGBA2Timeline.__initStatic19(); RGBA2Timeline.__initStatic20(); RGBA2Timeline.__initStatic21(); RGBA2Timeline.__initStatic22(); RGBA2Timeline.__initStatic23(); RGBA2Timeline.__initStatic24(); RGBA2Timeline.__initStatic25(); RGBA2Timeline.__initStatic26();

/** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting.
 * @public
 * */
class RGB2Timeline extends CurveTimeline {
    static __initStatic27() {this.ENTRIES = 7;}

    static __initStatic28() {this.R = 1;} static __initStatic29() {this.G = 2;} static __initStatic30() {this.B = 3;} static __initStatic31() {this.R2 = 4;} static __initStatic32() {this.G2 = 5;} static __initStatic33() {this.B2 = 6;}

    __init15() {this.slotIndex = 0;}

    constructor (frameCount, bezierCount, slotIndex) {
        super(frameCount, bezierCount, [
            Property.rgb + "|" + slotIndex,
            Property.rgb2 + "|" + slotIndex
        ]);RGB2Timeline.prototype.__init15.call(this);        this.slotIndex = slotIndex;
    }

    getFrameEntries () {
        return RGB2Timeline.ENTRIES;
    }

    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame (frame, time, r, g, b, r2, g2, b2) {
        frame *= RGB2Timeline.ENTRIES;
        this.frames[frame] = time;
        this.frames[frame + RGB2Timeline.R] = r;
        this.frames[frame + RGB2Timeline.G] = g;
        this.frames[frame + RGB2Timeline.B] = b;
        this.frames[frame + RGB2Timeline.R2] = r2;
        this.frames[frame + RGB2Timeline.G2] = g2;
        this.frames[frame + RGB2Timeline.B2] = b2;
    }

    apply (skeleton, lastTime, time, events, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;

        let frames = this.frames;
        if (time < frames[0]) {
            let light = slot.color, dark = slot.darkColor, setupLight = slot.data.color, setupDark = slot.data.darkColor;
            switch (blend) {
                case MixBlend.setup:
                    light.r = setupLight.r;
                    light.g = setupLight.g;
                    light.b = setupLight.b;
                    dark.r = setupDark.r;
                    dark.g = setupDark.g;
                    dark.b = setupDark.b;
                    return;
                case MixBlend.first:
                    light.r += (setupLight.r - light.r) * alpha;
                    light.g += (setupLight.g - light.g) * alpha;
                    light.b += (setupLight.b - light.b) * alpha;
                    dark.r += (setupDark.r - dark.r) * alpha;
                    dark.g += (setupDark.g - dark.g) * alpha;
                    dark.b += (setupDark.b - dark.b) * alpha;
            }
            return;
        }

        // @ts-ignore
        let r = 0, g = 0, b = 0, r2 = 0, g2 = 0, b2 = 0;
        let i = Animation.search2(frames, time, RGB2Timeline.ENTRIES);
        let curveType = this.curves[i >> 3];
        switch (curveType) {
            case RGB2Timeline.LINEAR:
                let before = frames[i];
                r = frames[i + RGB2Timeline.R];
                g = frames[i + RGB2Timeline.G];
                b = frames[i + RGB2Timeline.B];
                r2 = frames[i + RGB2Timeline.R2];
                g2 = frames[i + RGB2Timeline.G2];
                b2 = frames[i + RGB2Timeline.B2];
                let t = (time - before) / (frames[i + RGB2Timeline.ENTRIES] - before);
                r += (frames[i + RGB2Timeline.ENTRIES + RGB2Timeline.R] - r) * t;
                g += (frames[i + RGB2Timeline.ENTRIES + RGB2Timeline.G] - g) * t;
                b += (frames[i + RGB2Timeline.ENTRIES + RGB2Timeline.B] - b) * t;
                r2 += (frames[i + RGB2Timeline.ENTRIES + RGB2Timeline.R2] - r2) * t;
                g2 += (frames[i + RGB2Timeline.ENTRIES + RGB2Timeline.G2] - g2) * t;
                b2 += (frames[i + RGB2Timeline.ENTRIES + RGB2Timeline.B2] - b2) * t;
                break;
            case RGB2Timeline.STEPPED:
                r = frames[i + RGB2Timeline.R];
                g = frames[i + RGB2Timeline.G];
                b = frames[i + RGB2Timeline.B];
                r2 = frames[i + RGB2Timeline.R2];
                g2 = frames[i + RGB2Timeline.G2];
                b2 = frames[i + RGB2Timeline.B2];
                break;
            default:
                r = this.getBezierValue(time, i, RGB2Timeline.R, curveType - RGB2Timeline.BEZIER);
                g = this.getBezierValue(time, i, RGB2Timeline.G, curveType + RGB2Timeline.BEZIER_SIZE - RGB2Timeline.BEZIER);
                b = this.getBezierValue(time, i, RGB2Timeline.B, curveType + RGB2Timeline.BEZIER_SIZE * 2 - RGB2Timeline.BEZIER);
                r2 = this.getBezierValue(time, i, RGB2Timeline.R2, curveType + RGB2Timeline.BEZIER_SIZE * 3 - RGB2Timeline.BEZIER);
                g2 = this.getBezierValue(time, i, RGB2Timeline.G2, curveType + RGB2Timeline.BEZIER_SIZE * 4 - RGB2Timeline.BEZIER);
                b2 = this.getBezierValue(time, i, RGB2Timeline.B2, curveType + RGB2Timeline.BEZIER_SIZE * 5 - RGB2Timeline.BEZIER);
        }

        let light = slot.color, dark = slot.darkColor;
        if (alpha == 1) {
            light.r = r;
            light.g = g;
            light.b = b;
            dark.r = r2;
            dark.g = g2;
            dark.b = b2;
        } else {
            if (blend == MixBlend.setup) {
                let setupLight = slot.data.color, setupDark = slot.data.darkColor;
                light.r = setupLight.r;
                light.g = setupLight.g;
                light.b = setupLight.b;
                dark.r = setupDark.r;
                dark.g = setupDark.g;
                dark.b = setupDark.b;
            }
            light.r += (r - light.r) * alpha;
            light.g += (g - light.g) * alpha;
            light.b += (b - light.b) * alpha;
            dark.r += (r2 - dark.r) * alpha;
            dark.g += (g2 - dark.g) * alpha;
            dark.b += (b2 - dark.b) * alpha;
        }
    }
} RGB2Timeline.__initStatic27(); RGB2Timeline.__initStatic28(); RGB2Timeline.__initStatic29(); RGB2Timeline.__initStatic30(); RGB2Timeline.__initStatic31(); RGB2Timeline.__initStatic32(); RGB2Timeline.__initStatic33();

/** Changes a slot's {@link Slot#attachment}.
 * @public
 * */
class AttachmentTimeline extends Timeline  {
    __init16() {this.slotIndex = 0;}

    /** The attachment name for each key frame. May contain null values to clear the attachment. */
    

    constructor (frameCount, slotIndex) {
        super(frameCount, [
            Property.attachment + "|" + slotIndex
        ]);AttachmentTimeline.prototype.__init16.call(this);        this.slotIndex = slotIndex;
        this.attachmentNames = new Array(frameCount);
    }

    getFrameEntries () {
        return 1;
    }

    /** The number of key frames for this timeline. */
    getFrameCount () {
        return this.frames.length;
    }

    /** Sets the time in seconds and the attachment name for the specified key frame. */
    setFrame (frame, time, attachmentName) {
        this.frames[frame] = time;
        this.attachmentNames[frame] = attachmentName;
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

        this.setAttachment(skeleton, slot, this.attachmentNames[Animation.search(frames, time)]);
    }

    setAttachment(skeleton, slot, attachmentName) {
        slot.setAttachment(attachmentName == null ? null : skeleton.getAttachment(this.slotIndex, attachmentName));
    }
}

let zeros  = null;

/** Changes a slot's {@link Slot#deform} to deform a {@link VertexAttachment}.
 * @public
 * */
class DeformTimeline extends CurveTimeline  {
    __init17() {this.slotIndex = 0;}

    /** The attachment that will be deformed. */
    

    /** The vertices for each key frame. */
    

    constructor (frameCount, bezierCount, slotIndex, attachment) {
        super(frameCount, bezierCount, [
            Property.deform + "|" + slotIndex + "|" + attachment.id
        ]);DeformTimeline.prototype.__init17.call(this);        this.slotIndex = slotIndex;
        this.attachment = attachment;
        this.vertices = new Array(frameCount);
        if (zeros == null) zeros = Utils.newFloatArray(64);
    }

    getFrameEntries () {
        return 1;
    }

    /** Sets the time in seconds and the vertices for the specified key frame.
     * @param vertices Vertex positions for an unweighted VertexAttachment, or deform offsets if it has weights. */
    setFrame (frame, time, vertices) {
        this.frames[frame] = time;
        this.vertices[frame] = vertices;
    }

    /** @param value1 Ignored (0 is used for a deform timeline).
     * @param value2 Ignored (1 is used for a deform timeline). */
    setBezier (bezier, frame, value, time1, value1, cx1, cy1, cx2,
               cy2, time2, value2) {
        let curves = this.curves;
        let i = this.getFrameCount() + bezier * DeformTimeline.BEZIER_SIZE;
        if (value == 0) curves[frame] = DeformTimeline.BEZIER + i;
        let tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = cy2 * 0.03 - cy1 * 0.06;
        let dddx = ((cx1 - cx2) * 3 - time1 + time2) * 0.006, dddy = (cy1 - cy2 + 0.33333333) * 0.018;
        let ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
        let dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = cy1 * 0.3 + tmpy + dddy * 0.16666667;
        let x = time1 + dx, y = dy;
        for (let n = i + DeformTimeline.BEZIER_SIZE; i < n; i += 2) {
            curves[i] = x;
            curves[i + 1] = y;
            dx += ddx;
            dy += ddy;
            ddx += dddx;
            ddy += dddy;
            x += dx;
            y += dy;
        }
    }

    getCurvePercent (time, frame) {
        let curves = this.curves;
        let frames = this.frames;
        let i = curves[frame];
        switch (i) {
            case DeformTimeline.LINEAR:
                let x = frames[frame];
                return (time - x) / (frames[frame + this.getFrameEntries()] - x);
            case DeformTimeline.STEPPED:
                return 0;
        }
        i -= DeformTimeline.BEZIER;
        if (curves[i] > time) {
            let x = frames[frame];
            return curves[i + 1] * (time - x) / (curves[i] - x);
        }
        let n = i + DeformTimeline.BEZIER_SIZE;
        for (i += 2; i < n; i += 2) {
            if (curves[i] >= time) {
                let x = curves[i - 2], y = curves[i - 1];
                return y + (time - x) / (curves[i] - x) * (curves[i + 1] - y);
            }
        }
        let x = curves[n - 2], y = curves[n - 1];
        return y + (1 - y) * (time - x) / (frames[frame + this.getFrameEntries()] - x);
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let slot = skeleton.slots[this.slotIndex];
        if (!slot.bone.active) return;
        let slotAttachment = slot.getAttachment();
        if (!(slotAttachment instanceof VertexAttachment) || !((slotAttachment).deformAttachment == this.attachment)) return;

        let deformArray = slot.deform;
        if (deformArray.length == 0) blend = MixBlend.setup;

        let vertices = this.vertices;
        let vertexCount = vertices[0].length;

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
            let lastVertices = vertices[frames.length - 1];
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
        let frame = Animation.search(frames, time);
        let percent = this.getCurvePercent(time, frame);
        let prevVertices = vertices[frame];
        let nextVertices = vertices[frame + 1];

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

/** Fires an {@link Event} when specific animation times are reached.
 * @public
 * */
class EventTimeline extends Timeline {
    static __initStatic34() {this.propertyIds = [ "" + Property.event ];}

    /** The event for each key frame. */
    

    constructor (frameCount) {
        super(frameCount, EventTimeline.propertyIds);

        this.events = new Array(frameCount);
    }

    getFrameEntries () {
        return 1;
    }

    /** Sets the time in seconds and the event for the specified key frame. */
    setFrame (frame, event) {
        this.frames[frame] = event.time;
        this.events[frame] = event;
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

        let i = 0;
        if (lastTime < frames[0])
            i = 0;
        else {
            i = Animation.search(frames, lastTime) + 1;
            let frameTime = frames[i];
            while (i > 0) { // Fire multiple events with the same frame.
                if (frames[i - 1] != frameTime) break;
                i--;
            }
        }
        for (; i < frameCount && time >= frames[i]; i++)
            firedEvents.push(this.events[i]);
    }
} EventTimeline.__initStatic34();

/** Changes a skeleton's {@link Skeleton#drawOrder}.
 * @public
 * */
class DrawOrderTimeline extends Timeline {
    static __initStatic35() {this.propertyIds = [ "" + Property.drawOrder ];}

    /** The draw order for each key frame. See {@link #setFrame(int, float, int[])}. */
    

    constructor (frameCount) {
        super(frameCount, DrawOrderTimeline.propertyIds);
        this.drawOrders = new Array(frameCount);
    }

    getFrameEntries () {
        return 1;
    }

    /** Sets the time in seconds and the draw order for the specified key frame.
     * @param drawOrder For each slot in {@link Skeleton#slots}, the index of the new draw order. May be null to use setup pose
     *           draw order. */
    setFrame (frame, time, drawOrder) {
        this.frames[frame] = time;
        this.drawOrders[frame] = drawOrder;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let drawOrder = skeleton.drawOrder;
        let slots = skeleton.slots;
        if (direction == MixDirection.mixOut) {
            if (blend == MixBlend.setup) Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
            return;
        }

        let frames = this.frames;
        if (time < frames[0]) {
            if (blend == MixBlend.setup || blend == MixBlend.first) Utils.arrayCopy(skeleton.slots, 0, drawOrder, 0, skeleton.slots.length);
            return;
        }

        let drawOrderToSetupIndex = this.drawOrders[Animation.search(frames, time)];
        if (drawOrderToSetupIndex == null)
            Utils.arrayCopy(slots, 0, drawOrder, 0, slots.length);
        else {
            for (let i = 0, n = drawOrderToSetupIndex.length; i < n; i++)
                drawOrder[i] = slots[drawOrderToSetupIndex[i]];
        }
    }
} DrawOrderTimeline.__initStatic35();

/** Changes an IK constraint's {@link IkConstraint#mix}, {@link IkConstraint#softness},
 * {@link IkConstraint#bendDirection}, {@link IkConstraint#stretch}, and {@link IkConstraint#compress}.
 * @public
 * */
class IkConstraintTimeline extends CurveTimeline {
    static __initStatic36() {this.ENTRIES = 6;}

    static __initStatic37() {this.MIX = 1;} static __initStatic38() {this.SOFTNESS = 2;} static __initStatic39() {this.BEND_DIRECTION = 3;} static __initStatic40() {this.COMPRESS = 4;} static __initStatic41() {this.STRETCH = 5;}

    /** The index of the IK constraint slot in {@link Skeleton#ikConstraints} that will be changed. */
    

    constructor (frameCount, bezierCount, ikConstraintIndex) {
        super(frameCount, bezierCount, [
            Property.ikConstraint + "|" + ikConstraintIndex
        ]);
        this.ikConstraintIndex = ikConstraintIndex;
    }

    getFrameEntries () {
        return IkConstraintTimeline.ENTRIES;
    }

    /** Sets the time in seconds, mix, softness, bend direction, compress, and stretch for the specified key frame. */
    setFrame (frame, time, mix, softness, bendDirection, compress, stretch) {
        frame *= IkConstraintTimeline.ENTRIES;
        this.frames[frame] = time;
        this.frames[frame + IkConstraintTimeline.MIX] = mix;
        this.frames[frame + IkConstraintTimeline.SOFTNESS] = softness;
        this.frames[frame + IkConstraintTimeline.BEND_DIRECTION] = bendDirection;
        this.frames[frame + IkConstraintTimeline.COMPRESS] = compress ? 1 : 0;
        this.frames[frame + IkConstraintTimeline.STRETCH] = stretch ? 1 : 0;
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

        let mix = 0, softness = 0;
        let i = Animation.search2(frames, time, IkConstraintTimeline.ENTRIES);
        let curveType = this.curves[i / IkConstraintTimeline.ENTRIES];
        switch (curveType) {
            case IkConstraintTimeline.LINEAR:
                let before = frames[i];
                mix = frames[i + IkConstraintTimeline.MIX];
                softness = frames[i + IkConstraintTimeline.SOFTNESS];
                let t = (time - before) / (frames[i + IkConstraintTimeline.ENTRIES] - before);
                mix += (frames[i + IkConstraintTimeline.ENTRIES + IkConstraintTimeline.MIX] - mix) * t;
                softness += (frames[i + IkConstraintTimeline.ENTRIES + IkConstraintTimeline.SOFTNESS] - softness) * t;
                break;
            case IkConstraintTimeline.STEPPED:
                mix = frames[i + IkConstraintTimeline.MIX];
                softness = frames[i + IkConstraintTimeline.SOFTNESS];
                break;
            default:
                mix = this.getBezierValue(time, i, IkConstraintTimeline.MIX, curveType - IkConstraintTimeline.BEZIER);
                softness = this.getBezierValue(time, i, IkConstraintTimeline.SOFTNESS, curveType + IkConstraintTimeline.BEZIER_SIZE - IkConstraintTimeline.BEZIER);
        }

        if (blend == MixBlend.setup) {
            constraint.mix = constraint.data.mix + (mix - constraint.data.mix) * alpha;
            constraint.softness = constraint.data.softness + (softness - constraint.data.softness) * alpha;

            if (direction == MixDirection.mixOut) {
                constraint.bendDirection = constraint.data.bendDirection;
                constraint.compress = constraint.data.compress;
                constraint.stretch = constraint.data.stretch;
            } else {
                constraint.bendDirection = frames[i + IkConstraintTimeline.BEND_DIRECTION];
                constraint.compress = frames[i + IkConstraintTimeline.COMPRESS] != 0;
                constraint.stretch = frames[i + IkConstraintTimeline.STRETCH] != 0;
            }
        } else {
            constraint.mix += (mix - constraint.mix) * alpha;
            constraint.softness += (softness - constraint.softness) * alpha;
            if (direction == MixDirection.mixIn) {
                constraint.bendDirection = frames[i + IkConstraintTimeline.BEND_DIRECTION];
                constraint.compress = frames[i + IkConstraintTimeline.COMPRESS] != 0;
                constraint.stretch = frames[i + IkConstraintTimeline.STRETCH] != 0;
            }
        }
    }
} IkConstraintTimeline.__initStatic36(); IkConstraintTimeline.__initStatic37(); IkConstraintTimeline.__initStatic38(); IkConstraintTimeline.__initStatic39(); IkConstraintTimeline.__initStatic40(); IkConstraintTimeline.__initStatic41();

/** Changes a transform constraint's {@link TransformConstraint#rotateMix}, {@link TransformConstraint#translateMix},
 * {@link TransformConstraint#scaleMix}, and {@link TransformConstraint#shearMix}.
 * @public
 * */
class TransformConstraintTimeline extends CurveTimeline {
    static __initStatic42() {this.ENTRIES = 7;}

    static __initStatic43() {this.ROTATE = 1;} static __initStatic44() {this.X = 2;} static __initStatic45() {this.Y = 3;} static __initStatic46() {this.SCALEX = 4;} static __initStatic47() {this.SCALEY = 5;} static __initStatic48() {this.SHEARY = 6;}

    /** The index of the transform constraint slot in {@link Skeleton#transformConstraints} that will be changed. */
    

    constructor (frameCount, bezierCount, transformConstraintIndex) {
        super(frameCount, bezierCount, [
            Property.transformConstraint + "|" + transformConstraintIndex
        ]);
        this.transformConstraintIndex = transformConstraintIndex;
    }

    getFrameEntries () {
        return TransformConstraintTimeline.ENTRIES;
    }

    /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for the specified key frame. */
    setFrame (frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY,
              mixShearY) {
        let frames = this.frames;
        frame *= TransformConstraintTimeline.ENTRIES;
        this.frames[frame] = time;
        frames[frame + TransformConstraintTimeline.ROTATE] = mixRotate;
        frames[frame + TransformConstraintTimeline.X] = mixX;
        frames[frame + TransformConstraintTimeline.Y] = mixY;
        frames[frame + TransformConstraintTimeline.SCALEX] = mixScaleX;
        frames[frame + TransformConstraintTimeline.SCALEY] = mixScaleY;
        frames[frame + TransformConstraintTimeline.SHEARY] = mixShearY;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let frames = this.frames;

        let constraint = skeleton.transformConstraints[this.transformConstraintIndex];
        if (!constraint.active) return;

        if (time < frames[0]) {
            let data = constraint.data;
            switch (blend) {
                case MixBlend.setup:
                    constraint.mixRotate = data.mixRotate;
                    constraint.mixX = data.mixX;
                    constraint.mixY = data.mixY;
                    constraint.mixScaleX = data.mixScaleX;
                    constraint.mixScaleY = data.mixScaleY;
                    constraint.mixShearY = data.mixShearY;
                    return;
                case MixBlend.first:
                    constraint.mixRotate += (data.mixRotate - constraint.mixRotate) * alpha;
                    constraint.mixX += (data.mixX - constraint.mixX) * alpha;
                    constraint.mixY += (data.mixY - constraint.mixY) * alpha;
                    constraint.mixScaleX += (data.mixScaleX - constraint.mixScaleX) * alpha;
                    constraint.mixScaleY += (data.mixScaleY - constraint.mixScaleY) * alpha;
                    constraint.mixShearY += (data.mixShearY - constraint.mixShearY) * alpha;
            }
            return;
        }

        let rotate, x, y, scaleX, scaleY, shearY;
        let i = Animation.search2(frames, time, TransformConstraintTimeline.ENTRIES);
        let curveType = this.curves[i / TransformConstraintTimeline.ENTRIES];
        let ROTATE = TransformConstraintTimeline.ROTATE;
        let X = TransformConstraintTimeline.X;
        let Y = TransformConstraintTimeline.Y;
        let SCALEX = TransformConstraintTimeline.SCALEX;
        let SCALEY = TransformConstraintTimeline.SCALEY;
        let SHEARY = TransformConstraintTimeline.SHEARY;
        let ENTRIES = TransformConstraintTimeline.ENTRIES;
        let BEZIER = TransformConstraintTimeline.BEZIER;
        let BEZIER_SIZE = TransformConstraintTimeline.BEZIER_SIZE;
        switch (curveType) {
            case TransformConstraintTimeline.LINEAR:
                let before = frames[i];
                rotate = frames[i + ROTATE];
                x = frames[i + X];
                y = frames[i + Y];
                scaleX = frames[i + SCALEX];
                scaleY = frames[i + SCALEY];
                shearY = frames[i + SHEARY];
                let t = (time - before) / (frames[i + ENTRIES] - before);
                rotate += (frames[i + ENTRIES + ROTATE] - rotate) * t;
                x += (frames[i + ENTRIES + X] - x) * t;
                y += (frames[i + ENTRIES + Y] - y) * t;
                scaleX += (frames[i + ENTRIES + SCALEX] - scaleX) * t;
                scaleY += (frames[i + ENTRIES + SCALEY] - scaleY) * t;
                shearY += (frames[i + ENTRIES + SHEARY] - shearY) * t;
                break;
            case TransformConstraintTimeline.STEPPED:
                rotate = frames[i + ROTATE];
                x = frames[i + X];
                y = frames[i + Y];
                scaleX = frames[i + SCALEX];
                scaleY = frames[i + SCALEY];
                shearY = frames[i + SHEARY];
                break;
            default:
                rotate = this.getBezierValue(time, i, ROTATE, curveType - BEZIER);
                x = this.getBezierValue(time, i, X, curveType + BEZIER_SIZE - BEZIER);
                y = this.getBezierValue(time, i, Y, curveType + BEZIER_SIZE * 2 - BEZIER);
                scaleX = this.getBezierValue(time, i, SCALEX, curveType + BEZIER_SIZE * 3 - BEZIER);
                scaleY = this.getBezierValue(time, i, SCALEY, curveType + BEZIER_SIZE * 4 - BEZIER);
                shearY = this.getBezierValue(time, i, SHEARY, curveType + BEZIER_SIZE * 5 - BEZIER);
        }

        if (blend == MixBlend.setup) {
            let data = constraint.data;
            constraint.mixRotate = data.mixRotate + (rotate - data.mixRotate) * alpha;
            constraint.mixX = data.mixX + (x - data.mixX) * alpha;
            constraint.mixY = data.mixY + (y - data.mixY) * alpha;
            constraint.mixScaleX = data.mixScaleX + (scaleX - data.mixScaleX) * alpha;
            constraint.mixScaleY = data.mixScaleY + (scaleY - data.mixScaleY) * alpha;
            constraint.mixShearY = data.mixShearY + (shearY - data.mixShearY) * alpha;
        } else {
            constraint.mixRotate += (rotate - constraint.mixRotate) * alpha;
            constraint.mixX += (x - constraint.mixX) * alpha;
            constraint.mixY += (y - constraint.mixY) * alpha;
            constraint.mixScaleX += (scaleX - constraint.mixScaleX) * alpha;
            constraint.mixScaleY += (scaleY - constraint.mixScaleY) * alpha;
            constraint.mixShearY += (shearY - constraint.mixShearY) * alpha;
        }
    }
} TransformConstraintTimeline.__initStatic42(); TransformConstraintTimeline.__initStatic43(); TransformConstraintTimeline.__initStatic44(); TransformConstraintTimeline.__initStatic45(); TransformConstraintTimeline.__initStatic46(); TransformConstraintTimeline.__initStatic47(); TransformConstraintTimeline.__initStatic48();

/** Changes a path constraint's {@link PathConstraint#position}.
 * @public
 * */
class PathConstraintPositionTimeline extends CurveTimeline1 {

    /** The index of the path constraint slot in {@link Skeleton#pathConstraints} that will be changed. */
    

    constructor (frameCount, bezierCount, pathConstraintIndex) {
        super(frameCount, bezierCount, [
            Property.pathConstraintPosition + "|" + pathConstraintIndex
        ]);
        this.pathConstraintIndex = pathConstraintIndex;
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

        let position = this.getCurveValue(time);

        if (blend == MixBlend.setup)
            constraint.position = constraint.data.position + (position - constraint.data.position) * alpha;
        else
            constraint.position += (position - constraint.position) * alpha;
    }
}

/** Changes a path constraint's {@link PathConstraint#spacing}.
 * @public
 * */
class PathConstraintSpacingTimeline extends CurveTimeline1 {
    /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
    __init18() {this.pathConstraintIndex = 0;}

    constructor (frameCount, bezierCount, pathConstraintIndex) {
        super(frameCount, bezierCount, [
            Property.pathConstraintSpacing + "|" + pathConstraintIndex
        ]);PathConstraintSpacingTimeline.prototype.__init18.call(this);        this.pathConstraintIndex = pathConstraintIndex;
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

        let spacing = this.getCurveValue(time);

        if (blend == MixBlend.setup)
            constraint.spacing = constraint.data.spacing + (spacing - constraint.data.spacing) * alpha;
        else
            constraint.spacing += (spacing - constraint.spacing) * alpha;
    }
}

/** Changes a transform constraint's {@link PathConstraint#getMixRotate()}, {@link PathConstraint#getMixX()}, and
 * {@link PathConstraint#getMixY()}.
 * @public
 * */
class PathConstraintMixTimeline extends CurveTimeline {
    /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
    __init19() {this.pathConstraintIndex = 0;}
    static __initStatic49() {this.ENTRIES = 4;}
    static __initStatic50() {this.ROTATE = 1;} static __initStatic51() {this.X = 2;} static __initStatic52() {this.Y = 3;}

    constructor (frameCount, bezierCount, pathConstraintIndex) {
        super(frameCount, bezierCount, [
            Property.pathConstraintMix + "|" + pathConstraintIndex
        ]);PathConstraintMixTimeline.prototype.__init19.call(this);        this.pathConstraintIndex = pathConstraintIndex;
    }

    getFrameEntries() {
        return PathConstraintMixTimeline.ENTRIES;
    }

    setFrame (frame, time, mixRotate, mixX, mixY) {
        let frames = this.frames;
        frame <<= 2;
        frames[frame] = time;
        frames[frame + PathConstraintMixTimeline.ROTATE] = mixRotate;
        frames[frame + PathConstraintMixTimeline.X] = mixX;
        frames[frame + PathConstraintMixTimeline.Y] = mixY;
    }

    apply (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
        let frames = this.frames;
        let constraint = skeleton.pathConstraints[this.pathConstraintIndex];
        if (!constraint.active) return;

        if (time < frames[0]) {
            switch (blend) {
                case MixBlend.setup:
                    constraint.mixRotate = constraint.data.mixRotate;
                    constraint.mixX = constraint.data.mixX;
                    constraint.mixY = constraint.data.mixY;
                    return;
                case MixBlend.first:
                    constraint.mixRotate += (constraint.data.mixRotate - constraint.mixRotate) * alpha;
                    constraint.mixX += (constraint.data.mixX - constraint.mixX) * alpha;
                    constraint.mixY += (constraint.data.mixY - constraint.mixY) * alpha;
            }
            return;
        }

        let rotate, x, y;
        let i = Animation.search2(frames, time, PathConstraintMixTimeline.ENTRIES);
        let curveType = this.curves[i >> 2];
        switch (curveType) {
            case PathConstraintMixTimeline.LINEAR:
                let before = frames[i];
                rotate = frames[i + PathConstraintMixTimeline.ROTATE];
                x = frames[i + PathConstraintMixTimeline.X];
                y = frames[i + PathConstraintMixTimeline.Y];
                let t = (time - before) / (frames[i + PathConstraintMixTimeline.ENTRIES] - before);
                rotate += (frames[i + PathConstraintMixTimeline.ENTRIES + PathConstraintMixTimeline.ROTATE] - rotate) * t;
                x += (frames[i + PathConstraintMixTimeline.ENTRIES + PathConstraintMixTimeline.X] - x) * t;
                y += (frames[i + PathConstraintMixTimeline.ENTRIES + PathConstraintMixTimeline.Y] - y) * t;
                break;
            case PathConstraintMixTimeline.STEPPED:
                rotate = frames[i + PathConstraintMixTimeline.ROTATE];
                x = frames[i + PathConstraintMixTimeline.X];
                y = frames[i + PathConstraintMixTimeline.Y];
                break;
            default:
                rotate = this.getBezierValue(time, i, PathConstraintMixTimeline.ROTATE, curveType - PathConstraintMixTimeline.BEZIER);
                x = this.getBezierValue(time, i, PathConstraintMixTimeline.X, curveType + PathConstraintMixTimeline.BEZIER_SIZE - PathConstraintMixTimeline.BEZIER);
                y = this.getBezierValue(time, i, PathConstraintMixTimeline.Y, curveType + PathConstraintMixTimeline.BEZIER_SIZE * 2 - PathConstraintMixTimeline.BEZIER);
        }

        if (blend == MixBlend.setup) {
            let data = constraint.data;
            constraint.mixRotate = data.mixRotate + (rotate - data.mixRotate) * alpha;
            constraint.mixX = data.mixX + (x - data.mixX) * alpha;
            constraint.mixY = data.mixY + (y - data.mixY) * alpha;
        } else {
            constraint.mixRotate += (rotate - constraint.mixRotate) * alpha;
            constraint.mixX += (x - constraint.mixX) * alpha;
            constraint.mixY += (y - constraint.mixY) * alpha;
        }
    }
} PathConstraintMixTimeline.__initStatic49(); PathConstraintMixTimeline.__initStatic50(); PathConstraintMixTimeline.__initStatic51(); PathConstraintMixTimeline.__initStatic52();

/** Applies animations over time, queues animations for later playback, mixes (crossfading) between animations, and applies
 * multiple animations on top of each other (layering).
 *
 * See [Applying Animations](http://esotericsoftware.com/spine-applying-animations/) in the Spine Runtimes Guide.
 * @public
 * */
class AnimationState  {
     static __initStatic() {this._emptyAnimation = null;}

     static emptyAnimation() {
        if (AnimationState._emptyAnimation == null) AnimationState._emptyAnimation = new Animation("<empty>", [], 0);
        return AnimationState._emptyAnimation;
    }

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
    __init7() {this.propertyIDs = new StringSet();}
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
            let animationLast = current.animationLast, animationTime = current.getAnimationTime(), applyTime = animationTime;
            let applyEvents = events;
            if (current.reverse) {
                applyTime = current.animation.duration - applyTime;
                applyEvents = null;
            }
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
                        this.applyAttachmentTimeline(timeline, skeleton, applyTime, blend, true);
                    else
                        timeline.apply(skeleton, animationLast, applyTime, applyEvents, mix, blend, MixDirection.mixIn);
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
                        this.applyRotateTimeline(timeline, skeleton, applyTime, mix, timelineBlend, timelinesRotation, ii << 1, firstFrame);
                    } else if (timeline instanceof AttachmentTimeline) {
                        this.applyAttachmentTimeline(timeline, skeleton, applyTime, blend, true);
                    } else {
                        // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                        Utils.webkit602BugfixHelper(mix, blend);
                        timeline.apply(skeleton, animationLast, applyTime, applyEvents, mix, timelineBlend, MixDirection.mixIn);
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


        let attachments = mix < from.attachmentThreshold, drawOrder = mix < from.drawOrderThreshold;
        let timelineCount = from.animation.timelines.length;
        let timelines = from.animation.timelines;
        let alphaHold = from.alpha * to.interruptAlpha, alphaMix = alphaHold * (1 - mix);
        let animationLast = from.animationLast, animationTime = from.getAnimationTime(), applyTime = animationTime;
        let events = null;
        // let events = mix < from.eventThreshold ? this.events : null;
        if (from.reverse) {
            applyTime = from.animation.duration - applyTime;
        } else {
            if  (mix < from.eventThreshold) events = this.events;
        }

        if (blend == MixBlend.add) {
            for (let i = 0; i < timelineCount; i++)
                timelines[i].apply(skeleton, animationLast, applyTime, events, alphaMix, blend, MixDirection.mixOut);
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
                    this.applyRotateTimeline(timeline, skeleton, applyTime, alpha, timelineBlend, timelinesRotation, i << 1, firstFrame);
                else if (timeline instanceof AttachmentTimeline)
                    this.applyAttachmentTimeline(timeline, skeleton, applyTime, timelineBlend, attachments);
                else {
                    // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                    Utils.webkit602BugfixHelper(alpha, blend);
                    if (drawOrder && timeline instanceof DrawOrderTimeline && timelineBlend == MixBlend.setup)
                        direction = MixDirection.mixIn;
                    timeline.apply(skeleton, animationLast, applyTime, events, alpha, timelineBlend, direction);
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
        else
            this.setAttachment(skeleton, slot, timeline.attachmentNames[Animation.search(frames, time)], attachments);

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
        let bone = skeleton.bones[rotateTimeline.boneIndex];
        if (!bone.active) return;
        let frames = rotateTimeline.frames;
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
            r2 = bone.data.rotation + rotateTimeline.getCurveValue(time);
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
        bone.rotation = r1 + total * alpha;
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
            this.queue.event(entry, event);
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

    /** Removes the {@link TrackEntry#getNext() next entry} and all entries after it for the specified entry. */
    clearNext(entry) {
        this.disposeNext(entry.next);
    }

    setCurrent (index, current, interrupt) {
        let from = this.expandToIndex(index);
        this.tracks[index] = current;
        current.previous = null;

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
            entry.previous = last;
            if (delay <= 0) delay += last.getTrackComplete() - entry.mixDuration;
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
        let entry = this.setAnimationWith(trackIndex, AnimationState.emptyAnimation(), false);
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
        let entry = this.addAnimationWith(trackIndex, AnimationState.emptyAnimation(), false, delay <= 0 ? 1 : delay);
        entry.mixDuration = mixDuration;
        entry.trackEnd = mixDuration;
        if (delay <= 0 && entry.previous != null) entry.delay = entry.previous.getTrackComplete() - entry.mixDuration;
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
                timelineMode[i] = propertyIDs.addAll(timelines[i].getPropertyIds()) ? AnimationState.HOLD_FIRST : AnimationState.HOLD_SUBSEQUENT;
            }
            return;
        }

        outer:
            for (let i = 0; i < timelinesCount; i++) {
                let timeline = timelines[i];
                let ids = timeline.getPropertyIds();
                if (!propertyIDs.addAll(ids))
                    timelineMode[i] = AnimationState.SUBSEQUENT;
                else if (to == null || timeline instanceof AttachmentTimeline || timeline instanceof DrawOrderTimeline
                    || timeline instanceof EventTimeline || !to.animation.hasTimeline(ids)) {
                    timelineMode[i] = AnimationState.FIRST;
                } else {
                    for (let next = to.mixingTo; next != null; next = next.mixingTo) {
                        if (next.animation.hasTimeline(ids)) continue;
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
 * References to a track entry must not be kept after the {@link AnimationStateListener#dispose()} event occurs.
 * @public
 * */
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
        this.previous = null;
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

    getTrackComplete() {
        let duration = this.animationEnd - this.animationStart;
        if (duration != 0) {
            if (this.loop) return duration * (1 + ((this.trackTime / duration) | 0)); // Completion of next loop.
            if (this.trackTime < duration) return duration; // Before duration.
        }
        return this.trackTime; // Next update.
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
                    break;
                case EventType.event:
                    let event = objects[i++ + 2] ;
                    if (entry.listener != null && entry.listener.event) entry.listener.event(entry, event);
                    for (let ii = 0; ii < listeners.length; ii++)
                        if (listeners[ii].event) listeners[ii].event(entry, event);
                    break;
            }
        }
        this.clear();

        this.drainDisabled = false;
    }

    clear () {
        this.objects.length = 0;
    }
}

/**
 * @public
 */
var EventType; (function (EventType) {
    const start = 0; EventType[EventType["start"] = start] = "start"; const interrupt = start + 1; EventType[EventType["interrupt"] = interrupt] = "interrupt"; const end = interrupt + 1; EventType[EventType["end"] = end] = "end"; const dispose = end + 1; EventType[EventType["dispose"] = dispose] = "dispose"; const complete = dispose + 1; EventType[EventType["complete"] = complete] = "complete"; const event = complete + 1; EventType[EventType["event"] = event] = "event";
})(EventType || (EventType = {}));

/** The interface to implement for receiving TrackEntry events. It is always safe to call AnimationState methods when receiving
 * events.
 *
 * See TrackEntry {@link TrackEntry#listener} and AnimationState
 * {@link AnimationState#addListener()}.
 * @public
 * */






















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

/** Stores mix (crossfade) durations to be applied when {@link AnimationState} animations are changed.
 * @public
 * */
class AnimationStateData  {
    /** The SkeletonData to look up animations when they are specified by name. */
    

    __init() {this.animationToMixTime = { };}

    /** The mix duration to use when no mix duration has been defined between two animations. */
    __init2() {this.defaultMix = 0;}

    constructor (skeletonData) {AnimationStateData.prototype.__init.call(this);AnimationStateData.prototype.__init2.call(this);
        if (skeletonData == null) throw new Error("skeletonData cannot be null.");
        this.skeletonData = skeletonData;
    }

    /** Sets a mix duration by animation name.
     *
     * See {@link #setMixWith()}. */
    setMix (fromName, toName, duration) {
        let from = this.skeletonData.findAnimation(fromName);
        if (from == null) throw new Error("Animation not found: " + fromName);
        let to = this.skeletonData.findAnimation(toName);
        if (to == null) throw new Error("Animation not found: " + toName);
        this.setMixWith(from, to, duration);
    }

    /** Sets the mix duration when changing from the specified animation to the other.
     *
     * See {@link TrackEntry#mixDuration}. */
    setMixWith (from, to, duration) {
        if (from == null) throw new Error("from cannot be null.");
        if (to == null) throw new Error("to cannot be null.");
        let key = from.name + "." + to.name;
        this.animationToMixTime[key] = duration;
    }

    /** Returns the mix duration to use when changing from the specified animation to the other, or the {@link #defaultMix} if
     * no mix duration has been set. */
    getMix (from, to) {
        let key = from.name + "." + to.name;
        let value = this.animationToMixTime[key];
        return value === undefined ? this.defaultMix : value;
    }
}

/**
 * @public
 */
class AtlasAttachmentLoader  {
    

    constructor(atlas) {
        this.atlas = atlas;
    }

    /** @return May be null to not load an attachment. */
    // @ts-ignore
    newRegionAttachment(skin, name, path) {
        let region = this.atlas.findRegion(path);
        if (region == null) throw new Error("Region not found in atlas: " + path + " (region attachment: " + name + ")");
        let attachment = new RegionAttachment(name);
        attachment.region = region;
        return attachment;
    }

    /** @return May be null to not load an attachment. */
    // @ts-ignore
    newMeshAttachment(skin, name, path) {
        let region = this.atlas.findRegion(path);
        if (region == null) throw new Error("Region not found in atlas: " + path + " (mesh attachment: " + name + ")");
        let attachment = new MeshAttachment(name);
        attachment.region = region;
        return attachment;
    }

    /** @return May be null to not load an attachment. */
    // @ts-ignore
    newBoundingBoxAttachment(skin, name) {
        return new BoundingBoxAttachment(name);
    }

    /** @return May be null to not load an attachment */
    // @ts-ignore
    newPathAttachment(skin, name) {
        return new PathAttachment(name);
    }

    // @ts-ignore
    newPointAttachment(skin, name) {
        return new PointAttachment(name);
    }

    // @ts-ignore
    newClippingAttachment(skin, name) {
        return new ClippingAttachment(name);
    }
}

/** Stores the setup pose for a {@link Bone}.
 * @public
 * */
class BoneData {
    /** The index of the bone in {@link Skeleton#getBones()}. */
    

    /** The name of the bone, which is unique across all bones in the skeleton. */
    

    /** @returns May be null. */
    

    /** The bone's length. */
    

    /** The local x translation. */
    __init() {this.x = 0;}

    /** The local y translation. */
    __init2() {this.y = 0;}

    /** The local rotation. */
    __init3() {this.rotation = 0;}

    /** The local scaleX. */
    __init4() {this.scaleX = 1;}

    /** The local scaleY. */
    __init5() {this.scaleY = 1;}

    /** The local shearX. */
    __init6() {this.shearX = 0;}

    /** The local shearX. */
    __init7() {this.shearY = 0;}

    /** The transform mode for how parent world transforms affect this bone. */
    __init8() {this.transformMode = TransformMode.Normal;}

    /** When true, {@link Skeleton#updateWorldTransform()} only updates this bone if the {@link Skeleton#skin} contains this
     * bone.
     * @see Skin#bones */
    __init9() {this.skinRequired = false;}

    /** The color of the bone as it was in Spine. Available only when nonessential data was exported. Bones are not usually
     * rendered at runtime. */
    __init10() {this.color = new Color();}

    constructor (index, name, parent) {BoneData.prototype.__init.call(this);BoneData.prototype.__init2.call(this);BoneData.prototype.__init3.call(this);BoneData.prototype.__init4.call(this);BoneData.prototype.__init5.call(this);BoneData.prototype.__init6.call(this);BoneData.prototype.__init7.call(this);BoneData.prototype.__init8.call(this);BoneData.prototype.__init9.call(this);BoneData.prototype.__init10.call(this);
        if (index < 0) throw new Error("index must be >= 0.");
        if (name == null) throw new Error("name cannot be null.");
        this.index = index;
        this.name = name;
        this.parent = parent;
    }
}

/** Determines how a bone inherits world transforms from parent bones.
 * @public
 * */
var TransformMode; (function (TransformMode) {
    const Normal = 0; TransformMode[TransformMode["Normal"] = Normal] = "Normal"; const OnlyTranslation = Normal + 1; TransformMode[TransformMode["OnlyTranslation"] = OnlyTranslation] = "OnlyTranslation"; const NoRotationOrReflection = OnlyTranslation + 1; TransformMode[TransformMode["NoRotationOrReflection"] = NoRotationOrReflection] = "NoRotationOrReflection"; const NoScale = NoRotationOrReflection + 1; TransformMode[TransformMode["NoScale"] = NoScale] = "NoScale"; const NoScaleOrReflection = NoScale + 1; TransformMode[TransformMode["NoScaleOrReflection"] = NoScaleOrReflection] = "NoScaleOrReflection";
})(TransformMode || (TransformMode = {}));

/** Stores a bone's current pose.
 *
 * A bone has a local transform which is used to compute its world transform. A bone also has an applied transform, which is a
 * local transform that can be applied to compute the world transform. The local transform and applied transform may differ if a
 * constraint or application code modifies the world transform after it was computed from the local transform.
 * @public
 * */
class Bone  {
    //be careful! Spine b,c is c,b in pixi matrix
    __init() {this.matrix = new Matrix();}

    get worldX() {
        return this.matrix.tx;
    }

    get worldY() {
        return this.matrix.ty;
    }

    /** The bone's setup pose data. */
    

    /** The skeleton this bone belongs to. */
    

    /** The parent bone, or null if this is the root bone. */
    

    /** The immediate children of this bone. */
    __init2() {this.children = new Array();}

    /** The local x translation. */
    __init3() {this.x = 0;}

    /** The local y translation. */
    __init4() {this.y = 0;}

    /** The local rotation in degrees, counter clockwise. */
    __init5() {this.rotation = 0;}

    /** The local scaleX. */
    __init6() {this.scaleX = 0;}

    /** The local scaleY. */
    __init7() {this.scaleY = 0;}

    /** The local shearX. */
    __init8() {this.shearX = 0;}

    /** The local shearY. */
    __init9() {this.shearY = 0;}

    /** The applied local x translation. */
    __init10() {this.ax = 0;}

    /** The applied local y translation. */
    __init11() {this.ay = 0;}

    /** The applied local rotation in degrees, counter clockwise. */
    __init12() {this.arotation = 0;}

    /** The applied local scaleX. */
    __init13() {this.ascaleX = 0;}

    /** The applied local scaleY. */
    __init14() {this.ascaleY = 0;}

    /** The applied local shearX. */
    __init15() {this.ashearX = 0;}

    /** The applied local shearY. */
    __init16() {this.ashearY = 0;}

    /** If true, the applied transform matches the world transform. If false, the world transform has been modified since it was
     * computed and {@link #updateAppliedTransform()} must be called before accessing the applied transform. */
    __init17() {this.appliedValid = false;}

    __init18() {this.sorted = false;}
    __init19() {this.active = false;}

    /** @param parent May be null. */
    constructor (data, skeleton, parent) {Bone.prototype.__init.call(this);Bone.prototype.__init2.call(this);Bone.prototype.__init3.call(this);Bone.prototype.__init4.call(this);Bone.prototype.__init5.call(this);Bone.prototype.__init6.call(this);Bone.prototype.__init7.call(this);Bone.prototype.__init8.call(this);Bone.prototype.__init9.call(this);Bone.prototype.__init10.call(this);Bone.prototype.__init11.call(this);Bone.prototype.__init12.call(this);Bone.prototype.__init13.call(this);Bone.prototype.__init14.call(this);Bone.prototype.__init15.call(this);Bone.prototype.__init16.call(this);Bone.prototype.__init17.call(this);Bone.prototype.__init18.call(this);Bone.prototype.__init19.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        this.data = data;
        this.skeleton = skeleton;
        this.parent = parent;
        this.setToSetupPose();
    }

    /** Returns false when the bone has not been computed because {@link BoneData#skinRequired} is true and the
     * {@link Skeleton#skin active skin} does not {@link Skin#bones contain} this bone. */
    isActive () {
        return this.active;
    }

    /** Same as {@link #updateWorldTransform()}. This method exists for Bone to implement {@link Updatable}. */
    update () {
        this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }

    /** Computes the world transform using the parent bone and this bone's local transform.
     *
     * See {@link #updateWorldTransformWith()}. */
    updateWorldTransform () {
        this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
    }

    /** Computes the world transform using the parent bone and the specified local transform. Child bones are not updated.
     *
     * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
     * Runtimes Guide. */
    updateWorldTransformWith (x, y, rotation, scaleX, scaleY, shearX, shearY) {
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

    /** Sets this bone's local transform to the setup pose. */
    setToSetupPose () {
        let data = this.data;
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
        this.scaleX = data.scaleX;
        this.scaleY = data.scaleY;
        this.shearX = data.shearX;
        this.shearY = data.shearY;
    }

    /** The world rotation for the X axis, calculated using {@link #a} and {@link #c}. */
    getWorldRotationX () {
        return Math.atan2(this.matrix.b, this.matrix.a) * MathUtils.radDeg;
    }

    /** The world rotation for the Y axis, calculated using {@link #b} and {@link #d}. */
    getWorldRotationY () {
        return Math.atan2(this.matrix.d, this.matrix.c) * MathUtils.radDeg;
    }

    /** The magnitude (always positive) of the world scale X, calculated using {@link #a} and {@link #c}. */
    getWorldScaleX () {
        let m = this.matrix;
        return Math.sqrt(m.a * m.a + m.c * m.c);
    }

    /** The magnitude (always positive) of the world scale Y, calculated using {@link #b} and {@link #d}. */
    getWorldScaleY () {
        let m = this.matrix;
        return Math.sqrt(m.b * m.b + m.d * m.d);
    }

    /** Computes the applied transform values from the world transform. This allows the applied transform to be accessed after the
     * world transform has been modified (by a constraint, {@link #rotateWorld()}, etc).
     *
     * If {@link #updateWorldTransform()} has been called for a bone and {@link #appliedValid} is false, then
     * {@link #updateAppliedTransform()} must be called before accessing the applied transform.
     *
     * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. The applied transform after
     * calling this method is equivalent to the local tranform used to compute the world transform, but may not be identical. */
    updateAppliedTransform () {
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

    /** Transforms a point from world coordinates to the bone's local coordinates. */
    worldToLocal(world) {
        let m = this.matrix;
        let a = m.a, b = m.c, c = m.b, d = m.d;
        let invDet = 1 / (a * d - b * c);
        let x = world.x - m.tx, y = world.y - m.ty;
        world.x = (x * d * invDet - y * b * invDet);
        world.y = (y * a * invDet - x * c * invDet);
        return world;
    }

    /** Transforms a point from the bone's local coordinates to world coordinates. */
    localToWorld(local) {
        let m = this.matrix;
        let x = local.x, y = local.y;
        local.x = x * m.a + y * m.c + m.tx;
        local.y = x * m.b + y * m.d + m.ty;
        return local;
    }

    /** Transforms a world rotation to a local rotation. */
    worldToLocalRotation (worldRotation) {
        let sin = MathUtils.sinDeg(worldRotation), cos = MathUtils.cosDeg(worldRotation);
        let mat = this.matrix;
        return Math.atan2(mat.a * sin - mat.b * cos, mat.d * cos - mat.c * sin) * MathUtils.radDeg;
    }

    /** Transforms a local rotation to a world rotation. */
    localToWorldRotation (localRotation) {
        //TODO: check same place in 3.8
        localRotation -= this.rotation - this.shearX;
        let sin = MathUtils.sinDeg(localRotation), cos = MathUtils.cosDeg(localRotation);
        let mat = this.matrix;
        return Math.atan2(cos * mat.b + sin * mat.d, cos * mat.a + sin * mat.c) * MathUtils.radDeg;
    }

    /** Rotates the world transform the specified amount and sets {@link #appliedValid} to false.
     * {@link #updateWorldTransform()} will need to be called on any child bones, recursively, and any constraints reapplied. */
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

/** The base class for all constraint datas.
 * @public
 * */
class ConstraintData {
    constructor( name,  order,  skinRequired) {this.name = name;this.order = order;this.skinRequired = skinRequired; }
}

/** Stores the current pose values for an {@link Event}.
 *
 * See Timeline {@link Timeline#apply()},
 * AnimationStateListener {@link AnimationStateListener#event()}, and
 * [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide.
 * @public
 * */
class Event {
    
    
    
    
    
    
    

    constructor (time, data) {
        if (data == null) throw new Error("data cannot be null.");
        this.time = time;
        this.data = data;
    }
}

/** Stores the setup pose values for an {@link Event}.
 *
 * See [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide.
 * @public
 * */
class EventData {
    
    
    
    
    
    
    

    constructor (name) {
        this.name = name;
    }
}

/** Stores the current pose for an IK constraint. An IK constraint adjusts the rotation of 1 or 2 constrained bones so the tip of
 * the last bone is as close to the target bone as possible.
 *
 * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide.
 * @public
 * */
class IkConstraint  {
    /** The IK constraint's setup pose data. */
    

    /** The bones that will be modified by this IK constraint. */
    

    /** The bone that is the IK target. */
    

    /** Controls the bend direction of the IK bones, either 1 or -1. */
    __init() {this.bendDirection = 0;}

    /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
    __init2() {this.compress = false;}

    /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
     * and the parent bone has local nonuniform scale, stretch is not applied. */
    __init3() {this.stretch = false;}

    /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
    __init4() {this.mix = 1;}

    /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
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

    update () {
        if (this.mix == 0) return;
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

    /** Applies 1 bone IK. The target is specified in the world coordinate system. */
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

    /** Applies 2 bone IK. The target is specified in the world coordinate system.
     * @param child A direct descendant of the parent bone. */
    apply2 (parent, child, targetX, targetY, bendDir, stretch, softness, alpha) {
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

/** Stores the setup pose for an {@link IkConstraint}.
 * <p>
 * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide.
 * @public
 * */
class IkConstraintData extends ConstraintData {
    /** The bones that are constrained by this IK constraint. */
    __init() {this.bones = new Array();}

    /** The bone that is the IK target. */
    

    /** Controls the bend direction of the IK bones, either 1 or -1. */
    __init2() {this.bendDirection = 1;}

    /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
    __init3() {this.compress = false;}

    /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
     * and the parent bone has local nonuniform scale, stretch is not applied. */
    __init4() {this.stretch = false;}

    /** When true, only a single bone is being constrained, and {@link #getCompress()} or {@link #getStretch()} is used, the bone
     * is scaled on both the X and Y axes. */
    __init5() {this.uniform = false;}

    /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
    __init6() {this.mix = 1;}

    /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
    __init7() {this.softness = 0;}

    constructor (name) {
        super(name, 0, false);IkConstraintData.prototype.__init.call(this);IkConstraintData.prototype.__init2.call(this);IkConstraintData.prototype.__init3.call(this);IkConstraintData.prototype.__init4.call(this);IkConstraintData.prototype.__init5.call(this);IkConstraintData.prototype.__init6.call(this);IkConstraintData.prototype.__init7.call(this);    }
}

/** Stores the setup pose for a {@link PathConstraint}.
 *
 * See [Path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide.
 * @public
 * */
class PathConstraintData extends ConstraintData {

    /** The bones that will be modified by this path constraint. */
    __init() {this.bones = new Array();}

    /** The slot whose path attachment will be used to constrained the bones. */
    

    /** The mode for positioning the first bone on the path. */
    

    /** The mode for positioning the bones after the first bone on the path. */
    

    /** The mode for adjusting the rotation of the bones. */
    

    /** An offset added to the constrained bone rotation. */
    

    /** The position along the path. */
    

    /** The spacing between bones. */
    

    __init2() {this.mixRotate = 0;}
    __init3() {this.mixX = 0;}
    __init4() {this.mixY = 0;}

    constructor (name) {
        super(name, 0, false);PathConstraintData.prototype.__init.call(this);PathConstraintData.prototype.__init2.call(this);PathConstraintData.prototype.__init3.call(this);PathConstraintData.prototype.__init4.call(this);    }
}

/** Controls how the first bone is positioned along the path.
 *
 * See [Position mode](http://esotericsoftware.com/spine-path-constraints#Position-mode) in the Spine User Guide.
 * @public
 * */
var PositionMode; (function (PositionMode) {
    const Fixed = 0; PositionMode[PositionMode["Fixed"] = Fixed] = "Fixed"; const Percent = Fixed + 1; PositionMode[PositionMode["Percent"] = Percent] = "Percent";
})(PositionMode || (PositionMode = {}));

/** Controls how bones after the first bone are positioned along the path.
 *
 * [Spacing mode](http://esotericsoftware.com/spine-path-constraints#Spacing-mode) in the Spine User Guide.
 * @public
 * */
var SpacingMode; (function (SpacingMode) {
    const Length = 0; SpacingMode[SpacingMode["Length"] = Length] = "Length"; const Fixed = Length + 1; SpacingMode[SpacingMode["Fixed"] = Fixed] = "Fixed"; const Percent = Fixed + 1; SpacingMode[SpacingMode["Percent"] = Percent] = "Percent"; const Proportional = Percent + 1; SpacingMode[SpacingMode["Proportional"] = Proportional] = "Proportional";
})(SpacingMode || (SpacingMode = {}));

/** Controls how bones are rotated, translated, and scaled to match the path.
 *
 * [Rotate mode](http://esotericsoftware.com/spine-path-constraints#Rotate-mod) in the Spine User Guide.
 * @public
 * */
var RotateMode; (function (RotateMode) {
    const Tangent = 0; RotateMode[RotateMode["Tangent"] = Tangent] = "Tangent"; const Chain = Tangent + 1; RotateMode[RotateMode["Chain"] = Chain] = "Chain"; const ChainScale = Chain + 1; RotateMode[RotateMode["ChainScale"] = ChainScale] = "ChainScale";
})(RotateMode || (RotateMode = {}));

/** Stores the current pose for a path constraint. A path constraint adjusts the rotation, translation, and scale of the
 * constrained bones so they follow a {@link PathAttachment}.
 *
 * See [Path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide.
 * @public
 * */
class PathConstraint  {
    static __initStatic() {this.NONE = -1;} static __initStatic2() {this.BEFORE = -2;} static __initStatic3() {this.AFTER = -3;}
    static __initStatic4() {this.epsilon = 0.00001;}

    /** The path constraint's setup pose data. */
    

    /** The bones that will be modified by this path constraint. */
    

    /** The slot whose path attachment will be used to constrained the bones. */
    

    /** The position along the path. */
    __init() {this.position = 0;}

    /** The spacing between bones. */
    __init2() {this.spacing = 0;}

    __init3() {this.mixRotate = 0;}

    __init4() {this.mixX = 0;}

    __init5() {this.mixY = 0;}

    __init6() {this.spaces = new Array();} __init7() {this.positions = new Array();}
    __init8() {this.world = new Array();} __init9() {this.curves = new Array();} __init10() {this.lengths = new Array();}
    __init11() {this.segments = new Array();}

    __init12() {this.active = false;}

    constructor (data, skeleton) {PathConstraint.prototype.__init.call(this);PathConstraint.prototype.__init2.call(this);PathConstraint.prototype.__init3.call(this);PathConstraint.prototype.__init4.call(this);PathConstraint.prototype.__init5.call(this);PathConstraint.prototype.__init6.call(this);PathConstraint.prototype.__init7.call(this);PathConstraint.prototype.__init8.call(this);PathConstraint.prototype.__init9.call(this);PathConstraint.prototype.__init10.call(this);PathConstraint.prototype.__init11.call(this);PathConstraint.prototype.__init12.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        this.data = data;
        this.bones = new Array();
        for (let i = 0, n = data.bones.length; i < n; i++)
            this.bones.push(skeleton.findBone(data.bones[i].name));
        this.target = skeleton.findSlot(data.target.name);
        this.position = data.position;
        this.spacing = data.spacing;
        this.mixRotate = data.mixRotate;
        this.mixX = data.mixX;
        this.mixY = data.mixY;
    }

    isActive () {
        return this.active;
    }

    update () {
        let attachment = this.target.getAttachment();
        if (!(attachment instanceof PathAttachment)) return;

        let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY;
        if (mixRotate == 0 && mixX == 0 && mixY == 0) return;

        let data = this.data;
        let tangents = data.rotateMode == RotateMode.Tangent, scale = data.rotateMode == RotateMode.ChainScale;

        let boneCount = this.bones.length, spacesCount = tangents ? boneCount : boneCount + 1;
        let bones = this.bones;
        let spaces = Utils.setArraySize(this.spaces, spacesCount), lengths = scale ? this.lengths = Utils.setArraySize(this.lengths, boneCount) : null;
        let spacing = this.spacing;

        switch (data.spacingMode) {
            case SpacingMode.Percent:
                if (scale) {
                    for (let i = 0, n = spacesCount - 1; i < n; i++) {
                        let bone = bones[i];
                        let setupLength = bone.data.length;
                        if (setupLength < PathConstraint.epsilon)
                            lengths[i] = 0;
                        else {
                            let x = setupLength * bone.matrix.a, y = setupLength * bone.matrix.b;
                            lengths[i] = Math.sqrt(x * x + y * y);
                        }
                    }
                }
                Utils.arrayFill(spaces, 1, spacesCount, spacing);
                break;
            case SpacingMode.Proportional:
                let sum = 0;
                for (let i = 0; i < boneCount;) {
                    let bone = bones[i];
                    let setupLength = bone.data.length;
                    if (setupLength < PathConstraint.epsilon) {
                        if (scale) lengths[i] = 0;
                        spaces[++i] = spacing;
                    } else {
                        let x = setupLength * bone.matrix.a, y = setupLength * bone.matrix.b;
                        let length = Math.sqrt(x * x + y * y);
                        if (scale) lengths[i] = length;
                        spaces[++i] = length;
                        sum += length;
                    }
                }
                if (sum > 0) {
                    sum = spacesCount / sum * spacing;
                    for (let i = 1; i < spacesCount; i++)
                        spaces[i] *= sum;
                }
                break;
            default:
                let lengthSpacing = data.spacingMode == SpacingMode.Length;
                for (let i = 0, n = spacesCount - 1; i < n;) {
                    let bone = bones[i];
                    let setupLength = bone.data.length;
                    if (setupLength < PathConstraint.epsilon) {
                        if (scale) lengths[i] = 0;
                        spaces[++i] = spacing;
                    } else {
                        let x = setupLength * bone.matrix.a, y = setupLength * bone.matrix.b;
                        let length = Math.sqrt(x * x + y * y);
                        if (scale) lengths[i] = length;
                        spaces[++i] = (lengthSpacing ? setupLength + spacing : spacing) * length / setupLength;
                    }
                }
        }

        let positions = this.computeWorldPositions(attachment, spacesCount, tangents);
        let boneX = positions[0], boneY = positions[1], offsetRotation = data.offsetRotation;
        let tip = false;
        if (offsetRotation == 0)
            tip = data.rotateMode == RotateMode.Chain;
        else {
            tip = false;
            let p = this.target.bone.matrix;
            offsetRotation *= p.a * p.d - p.b * p.c > 0 ? MathUtils.degRad : -MathUtils.degRad;
        }
        for (let i = 0, p = 3; i < boneCount; i++, p += 3) {
            let bone = bones[i];
            let mat = bone.matrix;
            mat.tx += (boneX - mat.tx) * mixX;
            mat.ty += (boneY - mat.ty) * mixY;
            let x = positions[p], y = positions[p + 1], dx = x - boneX, dy = y - boneY;
            if (scale) {
                let length = lengths[i];
                if (length != 0) {
                    let s = (Math.sqrt(dx * dx + dy * dy) / length - 1) * mixRotate + 1;
                    mat.a *= s;
                    mat.b *= s;
                }
            }
            boneX = x;
            boneY = y;
            if (mixRotate) {
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
                    boneX += (length * (cos * a - sin * c) - dx) * mixRotate;
                    boneY += (length * (sin * a + cos * c) - dy) * mixRotate;
                } else {
                    r += offsetRotation;
                }
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) //
                    r += MathUtils.PI2;
                r *= mixRotate;
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

    computeWorldPositions (path, spacesCount, tangents) {
        let target = this.target;
        let position = this.position;
        let spaces = this.spaces, out = Utils.setArraySize(this.positions, spacesCount * 3 + 2), world = null;
        let closed = path.closed;
        let verticesLength = path.worldVerticesLength, curveCount = verticesLength / 6, prevCurve = PathConstraint.NONE;

        if (!path.constantSpeed) {
            let lengths = path.lengths;
            curveCount -= closed ? 1 : 2;
            let pathLength = lengths[curveCount];
            if (this.data.positionMode == PositionMode.Percent) position *= pathLength;

            let multiplier;
            switch (this.data.spacingMode) {
                case SpacingMode.Percent:
                    multiplier = pathLength;
                    break;
                case SpacingMode.Proportional:
                    multiplier = pathLength / spacesCount;
                    break;
                default:
                    multiplier = 1;
            }
            world = Utils.setArraySize(this.world, 8);
            for (let i = 0, o = 0, curve = 0; i < spacesCount; i++, o += 3) {
                let space = spaces[i] * multiplier;
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

        if (this.data.positionMode == PositionMode.Percent) position *= pathLength;

        let multiplier = 0;
        switch (this.data.spacingMode) {
            case SpacingMode.Percent:
                multiplier = pathLength;
                break;
            case SpacingMode.Proportional:
                multiplier = pathLength / spacesCount;
                break;
            default:
                multiplier = 1;
        }

        let segments = this.segments;
        let curveLength = 0;
        for (let i = 0, o = 0, curve = 0, segment = 0; i < spacesCount; i++, o += 3) {
            let space = spaces[i] * multiplier;
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
        if (p == 0 || isNaN(p)) {
            out[o] = x1;
            out[o + 1] = y1;
            out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
            return;
        }
        let tt = p * p, ttt = tt * p, u = 1 - p, uu = u * u, uuu = uu * u;
        let ut = u * p, ut3 = ut * 3, uut3 = u * ut3, utt3 = ut3 * p;
        let x = x1 * uuu + cx1 * uut3 + cx2 * utt3 + x2 * ttt, y = y1 * uuu + cy1 * uut3 + cy2 * utt3 + y2 * ttt;
        out[o] = x;
        out[o + 1] = y;
        if (tangents) {
            if (p < 0.001)
                out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
            else
                out[o + 2] = Math.atan2(y - (y1 * uu + cy1 * ut * 2 + cy2 * tt), x - (x1 * uu + cx1 * ut * 2 + cx2 * tt));
        }
    }
} PathConstraint.__initStatic(); PathConstraint.__initStatic2(); PathConstraint.__initStatic3(); PathConstraint.__initStatic4();

/** Stores a slot's current pose. Slots organize attachments for {@link Skeleton#drawOrder} purposes and provide a place to store
 * state for an attachment. State cannot be stored in an attachment itself because attachments are stateless and may be shared
 * across multiple skeletons.
 * @public
 * */
class Slot  {
    //this is canon
    
    /** The slot's setup pose data. */
    

    /** The bone this slot belongs to. */
    

    /** The color used to tint the slot's attachment. If {@link #getDarkColor()} is set, this is used as the light color for two
     * color tinting. */
    

    /** The dark color used to tint the slot's attachment for two color tinting, or null if two color tinting is not used. The dark
     * color's alpha is not used. */
    

    

    

    

    /** Values to deform the slot's attachment. For an unweighted mesh, the entries are local positions for each vertex. For a
     * weighted mesh, the entries are an offset for each vertex which will be added to the mesh's local vertex positions.
     *
     * See {@link VertexAttachment#computeWorldVertices()} and {@link DeformTimeline}. */
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

    /** The skeleton this slot belongs to. */
    getSkeleton () {
        return this.bone.skeleton;
    }

    /** The current attachment for the slot, or null if the slot has no attachment. */
    getAttachment () {
        return this.attachment;
    }

    /** Sets the slot's attachment and, if the attachment changed, resets {@link #attachmentTime} and clears {@link #deform}.
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

    /** The time that has elapsed since the last time the attachment was set or cleared. Relies on Skeleton
     * {@link Skeleton#time}. */
    getAttachmentTime () {
        return this.bone.skeleton.time - this.attachmentTime;
    }

    /** Sets this slot to the setup pose. */
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

/** Stores the current pose for a transform constraint. A transform constraint adjusts the world transform of the constrained
 * bones to match that of the target bone.
 *
 * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide.
 * @public
 * */
class TransformConstraint  {

    /** The transform constraint's setup pose data. */
    

    /** The bones that will be modified by this transform constraint. */
    

    /** The target bone whose world transform will be copied to the constrained bones. */
    

    __init() {this.mixRotate = 0;} __init2() {this.mixX = 0;} __init3() {this.mixY = 0;} __init4() {this.mixScaleX = 0;} __init5() {this.mixScaleY = 0;} __init6() {this.mixShearY = 0;}

    __init7() {this.temp = new Vector2();}
    __init8() {this.active = false;}

    constructor (data, skeleton) {TransformConstraint.prototype.__init.call(this);TransformConstraint.prototype.__init2.call(this);TransformConstraint.prototype.__init3.call(this);TransformConstraint.prototype.__init4.call(this);TransformConstraint.prototype.__init5.call(this);TransformConstraint.prototype.__init6.call(this);TransformConstraint.prototype.__init7.call(this);TransformConstraint.prototype.__init8.call(this);
        if (data == null) throw new Error("data cannot be null.");
        if (skeleton == null) throw new Error("skeleton cannot be null.");
        this.data = data;
        this.mixRotate = data.mixRotate;
        this.mixX = data.mixX;
        this.mixY = data.mixY;
        this.mixScaleX = data.mixScaleX;
        this.mixScaleY = data.mixScaleY;
        this.mixShearY = data.mixShearY;
        this.bones = new Array();
        for (let i = 0; i < data.bones.length; i++)
            this.bones.push(skeleton.findBone(data.bones[i].name));
        this.target = skeleton.findBone(data.target.name);
    }

    isActive () {
        return this.active;
    }

    update () {
        if (this.mixRotate == 0 && this.mixX == 0 && this.mixY == 0 && this.mixScaleX == 0 && this.mixScaleX == 0 && this.mixShearY == 0) return;

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

    applyAbsoluteWorld () {
        let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX,
            mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
        let translate = mixX != 0 || mixY != 0;
        let target = this.target;
        const targetMat = target.matrix;
        let ta = targetMat.a, tb = targetMat.c, tc = targetMat.b, td = targetMat.d;
        let degRadReflect = ta * td - tb * tc > 0 ? MathUtils.degRad : -MathUtils.degRad;
        let offsetRotation = this.data.offsetRotation * degRadReflect;
        let offsetShearY = this.data.offsetShearY * degRadReflect;

        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            const mat = bone.matrix;

            if (mixRotate != 0) {
                let a = mat.a, b = mat.c, c = mat.b, d = mat.d;
                let r = Math.atan2(tc, ta) - Math.atan2(c, a) + offsetRotation;
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) //
                    r += MathUtils.PI2;
                r *= mixRotate;
                let cos = Math.cos(r), sin = Math.sin(r);
                mat.a = cos * a - sin * c;
                mat.c = cos * b - sin * d;
                mat.b = sin * a + cos * c;
                mat.d = sin * b + cos * d;
            }

            if (translate) {
                let temp = this.temp;
                target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                mat.tx += (temp.x - mat.tx) * mixX;
                mat.ty += (temp.y - mat.tx) * mixY;
            }

            if (mixScaleX != 0) {
                let s = Math.sqrt(mat.a * mat.a + mat.b * mat.b);
                if (s != 0) s = (s + (Math.sqrt(ta * ta + tc * tc) - s + this.data.offsetScaleX) * mixScaleX) / s;
                mat.a *= s;
                mat.b *= s;
            }
            if (mixScaleY != 0) {
                let s = Math.sqrt(mat.c * mat.c + mat.d * mat.d);
                if (s != 0) s = (s + (Math.sqrt(tb * tb + td * td) - s + this.data.offsetScaleY) * mixScaleY) / s;
                mat.c *= s;
                mat.d *= s;

            }

            if (mixShearY > 0) {
                let b = mat.c, d = mat.d;
                let by = Math.atan2(d, b);
                let r = Math.atan2(td, tb) - Math.atan2(tc, ta) - (by - Math.atan2(mat.b, mat.a));
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) //
                    r += MathUtils.PI2;
                r = by + (r + offsetShearY) * mixShearY;
                let s = Math.sqrt(b * b + d * d);
                mat.c = Math.cos(r) * s;
                mat.d = Math.sin(r) * s;

            }

            bone.appliedValid = false;
        }
    }

    applyRelativeWorld () {
        let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX,
            mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
        let translate = mixX != 0 || mixY != 0;

        let target = this.target;
        let targetMat = target.matrix;
        let ta = targetMat.a, tb = targetMat.c, tc = targetMat.b, td = targetMat.d;
        let degRadReflect = ta * td - tb * tc > 0 ? MathUtils.degRad : -MathUtils.degRad;
        let offsetRotation = this.data.offsetRotation * degRadReflect, offsetShearY = this.data.offsetShearY * degRadReflect;

        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            const mat = bone.matrix;

            if (mixRotate != 0) {
                let a = mat.a, b = mat.c, c = mat.b, d = mat.d;
                let r = Math.atan2(tc, ta) + offsetRotation;
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) //
                    r += MathUtils.PI2;
                r *= mixRotate;
                let cos = Math.cos(r), sin = Math.sin(r);
                mat.a = cos * a - sin * c;
                mat.c = cos * b - sin * d;
                mat.b = sin * a + cos * c;
                mat.d = sin * b + cos * d;
            }

            if (translate) {
                let temp = this.temp;
                target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                mat.tx += temp.x * mixX;
                mat.ty += temp.y * mixY;
            }

            if (mixScaleX != 0) {
                let s = (Math.sqrt(ta * ta + tc * tc) - 1 + this.data.offsetScaleX) * mixScaleX + 1;
                mat.a *= s;
                mat.b *= s;
            }
            if (mixScaleY != 0) {
                let s = (Math.sqrt(tb * tb + td * td) - 1 + this.data.offsetScaleY) * mixScaleY + 1;
                mat.c *= s;
                mat.d *= s;
            }

            if (mixShearY > 0) {
                let r = Math.atan2(td, tb) - Math.atan2(tc, ta);
                if (r > MathUtils.PI)
                    r -= MathUtils.PI2;
                else if (r < -MathUtils.PI) //
                    r += MathUtils.PI2;
                let b = mat.c, d = mat.d;
                r = Math.atan2(d, b) + (r - MathUtils.PI / 2 + offsetShearY) * mixShearY;
                let s = Math.sqrt(b * b + d * d);
                mat.c = Math.cos(r) * s;
                mat.d = Math.sin(r) * s;
            }

            bone.appliedValid = false;
        }
    }

    applyAbsoluteLocal () {
        let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX,
            mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;

        let target = this.target;
        if (!target.appliedValid) target.updateAppliedTransform();

        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (!bone.appliedValid) bone.updateAppliedTransform();

            let rotation = bone.arotation;
            if (mixRotate != 0) {
                let r = target.arotation - rotation + this.data.offsetRotation;
                r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                rotation += r * mixRotate;
            }

            let x = bone.ax, y = bone.ay;
            x += (target.ax - x + this.data.offsetX) * mixX;
            y += (target.ay - y + this.data.offsetY) * mixY;

            let scaleX = bone.ascaleX, scaleY = bone.ascaleY;
            if (mixScaleX != 0 && scaleX != 0)
                scaleX = (scaleX + (target.ascaleX - scaleX + this.data.offsetScaleX) * mixScaleX) / scaleX;
            if (mixScaleY != 0 && scaleY != 0)
                scaleY = (scaleY + (target.ascaleY - scaleY + this.data.offsetScaleY) * mixScaleY) / scaleY;

            let shearY = bone.ashearY;
            if (mixShearY != 0) {
                let r = target.ashearY - shearY + this.data.offsetShearY;
                r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                // TODO: check this place in 3.8
                shearY += r * mixShearY;
            }

            bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
        }
    }

    applyRelativeLocal () {
        let mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX,
            mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;

        let target = this.target;
        if (!target.appliedValid) target.updateAppliedTransform();
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (!bone.appliedValid) bone.updateAppliedTransform();

            let rotation = bone.arotation + (target.arotation + this.data.offsetRotation) * mixRotate;
            let x = bone.ax + (target.ax + this.data.offsetX) * mixX;
            let y = bone.ay + (target.ay + this.data.offsetY) * mixY;
            let scaleX = (bone.ascaleX * ((target.ascaleX - 1 + this.data.offsetScaleX) * mixScaleX) + 1);
            let scaleY = (bone.ascaleY * ((target.ascaleY - 1 + this.data.offsetScaleY) * mixScaleY) + 1);
            let shearY = bone.ashearY + (target.ashearY + this.data.offsetShearY) * mixShearY;

            bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
        }
    }
}

/** Stores the current pose for a skeleton.
 *
 * See [Instance objects](http://esotericsoftware.com/spine-runtime-architecture#Instance-objects) in the Spine Runtimes Guide.
 * @public
 * */
class Skeleton {
    /** The skeleton's setup pose data. */
    

    /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
    

    /** The skeleton's slots. */
    

    /** The skeleton's slots in the order they should be drawn. The returned array may be modified to change the draw order. */
    

    /** The skeleton's IK constraints. */
    

    /** The skeleton's transform constraints. */
    

    /** The skeleton's path constraints. */
    

    /** The list of bones and constraints, sorted in the order they should be updated, as computed by {@link #updateCache()}. */
    __init() {this._updateCache = new Array();}

    /** The skeleton's current skin. May be null. */
    

    /** The color to tint all the skeleton's attachments. */
    

    /** Returns the skeleton's time. This can be used for tracking, such as with Slot {@link Slot#attachmentTime}.
     * <p>
     * See {@link #update()}. */
    __init2() {this.time = 0;}

    /** Scales the entire skeleton on the X axis. This affects all bones, even if the bone's transform mode disallows scale
     * inheritance. */
    __init3() {this.scaleX = 1;}

    /** Scales the entire skeleton on the Y axis. This affects all bones, even if the bone's transform mode disallows scale
     * inheritance. */
    __init4() {this.scaleY = 1;}

    /** Sets the skeleton X position, which is added to the root bone worldX position. */
    __init5() {this.x = 0;}

    /** Sets the skeleton Y position, which is added to the root bone worldY position. */
    __init6() {this.y = 0;}

    constructor (data) {Skeleton.prototype.__init.call(this);Skeleton.prototype.__init2.call(this);Skeleton.prototype.__init3.call(this);Skeleton.prototype.__init4.call(this);Skeleton.prototype.__init5.call(this);Skeleton.prototype.__init6.call(this);
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

    /** Caches information about bones and constraints. Must be called if the {@link #getSkin()} is modified or if bones,
     * constraints, or weighted path attachments are added or removed. */
    updateCache () {
        let updateCache = this._updateCache;
        updateCache.length = 0;

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

        if (constrained.length == 1) {
            this._updateCache.push(constraint);
            this.sortReset(parent.children);
        } else {
            let child = constrained[constrained.length - 1];
            this.sortBone(child);

            this._updateCache.push(constraint);

            this.sortReset(parent.children);
            child.sorted = true;
        }
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
                this.sortBone(child);
            }
        } else {
            for (let i = 0; i < boneCount; i++) {
                this.sortBone(constrained[i]);
            }
        }

        this._updateCache.push(constraint);

        for (let i = 0; i < boneCount; i++)
            this.sortReset(constrained[i].children);
        for (let i = 0; i < boneCount; i++)
            constrained[i].sorted = true;
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
            for (let i = 0, n = pathBones.length; i < n;) {
                let nn = pathBones[i++];
                nn += i;
                while (i < nn)
                    this.sortBone(bones[pathBones[i++]]);
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

    /** Updates the world transform for each bone and applies all constraints.
     *
     * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
     * Runtimes Guide. */
    updateWorldTransform () {
        let updateCache = this._updateCache;
        for (let i = 0, n = updateCache.length; i < n; i++)
            updateCache[i].update();
    }

    updateWorldTransformWith (parent) {
        // Apply the parent bone transform to the root bone. The root bone always inherits scale, rotation and reflection.
        let rootBone = this.getRootBone();
        let pa = parent.matrix.a, pb = parent.matrix.c, pc = parent.matrix.b, pd = parent.matrix.d;
        rootBone.matrix.tx = pa * this.x + pb * this.y + parent.worldX;
        rootBone.matrix.ty = pc * this.x + pd * this.y + parent.worldY;

        let rotationY = rootBone.rotation + 90 + rootBone.shearY;
        let la = MathUtils.cosDeg(rootBone.rotation + rootBone.shearX) * rootBone.scaleX;
        let lb = MathUtils.cosDeg(rotationY) * rootBone.scaleY;
        let lc = MathUtils.sinDeg(rootBone.rotation + rootBone.shearX) * rootBone.scaleX;
        let ld = MathUtils.sinDeg(rotationY) * rootBone.scaleY;

        const sx = this.scaleX;
        const sy = settings.yDown? -this.scaleY : this.scaleY;
        rootBone.matrix.a = (pa * la + pb * lc) * sx;
        rootBone.matrix.b = (pa * lb + pb * ld) * sx;
        rootBone.matrix.c = (pc * la + pd * lc) * sy;
        rootBone.matrix.d = (pc * lb + pd * ld) * sy;

        // Update everything except root bone.
        let updateCache = this._updateCache;
        for (let i = 0, n = updateCache.length; i < n; i++) {
            let updatable = updateCache[i];
            if (updatable != rootBone) updatable.update();
        }
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
            constraint.mixRotate = data.mixRotate;
            constraint.mixX = data.mixX;
            constraint.mixY = data.mixY;
            constraint.mixScaleX = data.mixScaleX;
            constraint.mixScaleY = data.mixScaleY;
            constraint.mixShearY = data.mixShearY;
        }

        let pathConstraints = this.pathConstraints;
        for (let i = 0, n = pathConstraints.length; i < n; i++) {
            let constraint = pathConstraints[i];
            let data = constraint.data;
            constraint.position = data.position;
            constraint.spacing = data.spacing;
            constraint.mixRotate = data.mixRotate;
            constraint.mixX = data.mixX;
            constraint.mixY = data.mixY;
        }
    }

    /** Sets the slots and draw order to their setup pose values. */
    setSlotsToSetupPose () {
        let slots = this.slots;
        Utils.arrayCopy(slots, 0, this.drawOrder, 0, slots.length);
        for (let i = 0, n = slots.length; i < n; i++)
            slots[i].setToSetupPose();
    }

    /** @returns May return null. */
    getRootBone () {
        if (this.bones.length == 0) return null;
        return this.bones[0];
    }

    /** @returns May be null. */
    findBone (boneName) {
        if (boneName == null) throw new Error("boneName cannot be null.");
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++) {
            let bone = bones[i];
            if (bone.data.name == boneName) return bone;
        }
        return null;
    }

    /** @returns -1 if the bone was not found. */
    findBoneIndex (boneName) {
        if (boneName == null) throw new Error("boneName cannot be null.");
        let bones = this.bones;
        for (let i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return i;
        return -1;
    }

    /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
     * repeatedly.
     * @returns May be null. */
    findSlot (slotName) {
        if (slotName == null) throw new Error("slotName cannot be null.");
        let slots = this.slots;
        for (let i = 0, n = slots.length; i < n; i++) {
            let slot = slots[i];
            if (slot.data.name == slotName) return slot;
        }
        return null;
    }

    /** @returns -1 if the bone was not found. */
    findSlotIndex (slotName) {
        if (slotName == null) throw new Error("slotName cannot be null.");
        let slots = this.slots;
        for (let i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return i;
        return -1;
    }

    /** Sets a skin by name.
     *
     * See {@link #setSkin()}. */
    setSkinByName (skinName) {
        let skin = this.data.findSkin(skinName);
        if (skin == null) throw new Error("Skin not found: " + skinName);
        this.setSkin(skin);
    }

    /** Sets the skin used to look up attachments before looking in the {@link SkeletonData#defaultSkin default skin}. If the
     * skin is changed, {@link #updateCache()} is called.
     *
     * Attachments from the new skin are attached if the corresponding attachment from the old skin was attached. If there was no
     * old skin, each slot's setup mode attachment is attached from the new skin.
     *
     * After changing the skin, the visible attachments can be reset to those attached in the setup pose by calling
     * {@link #setSlotsToSetupPose()}. Also, often {@link AnimationState#apply()} is called before the next time the
     * skeleton is rendered to allow any attachment keys in the current animation(s) to hide or show attachments from the new skin.
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


    /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot name and attachment
     * name.
     *
     * See {@link #getAttachment()}.
     * @returns May be null. */
    getAttachmentByName (slotName, attachmentName) {
        return this.getAttachment(this.data.findSlotIndex(slotName), attachmentName);
    }

    /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot index and
     * attachment name. First the skin is checked and if the attachment was not found, the default skin is checked.
     *
     * See [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
     * @returns May be null. */
    getAttachment (slotIndex, attachmentName) {
        if (attachmentName == null) throw new Error("attachmentName cannot be null.");
        if (this.skin != null) {
            let attachment = this.skin.getAttachment(slotIndex, attachmentName);
            if (attachment != null) return attachment;
        }
        if (this.data.defaultSkin != null) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
        return null;
    }

    /** A convenience method to set an attachment by finding the slot with {@link #findSlot()}, finding the attachment with
     * {@link #getAttachment()}, then setting the slot's {@link Slot#attachment}.
     * @param attachmentName May be null to clear the slot's attachment. */
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


    /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
     * than to call it repeatedly.
     * @return May be null. */
    findIkConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let ikConstraints = this.ikConstraints;
        for (let i = 0, n = ikConstraints.length; i < n; i++) {
            let ikConstraint = ikConstraints[i];
            if (ikConstraint.data.name == constraintName) return ikConstraint;
        }
        return null;
    }

    /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
     * this method than to call it repeatedly.
     * @return May be null. */
    findTransformConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let transformConstraints = this.transformConstraints;
        for (let i = 0, n = transformConstraints.length; i < n; i++) {
            let constraint = transformConstraints[i];
            if (constraint.data.name == constraintName) return constraint;
        }
        return null;
    }

    /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
     * than to call it repeatedly.
     * @return May be null. */
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
     * @param offset An output value, the distance from the skeleton origin to the bottom left corner of the AABB.
     * @param size An output value, the width and height of the AABB.
     * @param temp Working memory to temporarily store attachments' computed world vertices. */
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

    /** Increments the skeleton's {@link #time}. */
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

/** Stores the setup pose and all of the stateless data for a skeleton.
 *
 * See [Data objects](http://esotericsoftware.com/spine-runtime-architecture#Data-objects) in the Spine Runtimes
 * Guide.
 * @public
 * */
class SkeletonData {constructor() { SkeletonData.prototype.__init.call(this);SkeletonData.prototype.__init2.call(this);SkeletonData.prototype.__init3.call(this);SkeletonData.prototype.__init4.call(this);SkeletonData.prototype.__init5.call(this);SkeletonData.prototype.__init6.call(this);SkeletonData.prototype.__init7.call(this);SkeletonData.prototype.__init8.call(this);SkeletonData.prototype.__init9.call(this); }

    /** The skeleton's name, which by default is the name of the skeleton data file, if possible. May be null. */
    

    /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
    __init() {this.bones = new Array();} // Ordered parents first.

    /** The skeleton's slots. */
    __init2() {this.slots = new Array();} // Setup pose draw order.
    __init3() {this.skins = new Array();}

    /** The skeleton's default skin. By default this skin contains all attachments that were not in a skin in Spine.
     *
     * See {@link Skeleton#getAttachmentByName()}.
     * May be null. */
    

    /** The skeleton's events. */
    __init4() {this.events = new Array();}

    /** The skeleton's animations. */
    __init5() {this.animations = new Array();}

    /** The skeleton's IK constraints. */
    __init6() {this.ikConstraints = new Array();}

    /** The skeleton's transform constraints. */
    __init7() {this.transformConstraints = new Array();}

    /** The skeleton's path constraints. */
    __init8() {this.pathConstraints = new Array();}

    /** The X coordinate of the skeleton's axis aligned bounding box in the setup pose. */
    

    /** The Y coordinate of the skeleton's axis aligned bounding box in the setup pose. */
    

    /** The width of the skeleton's axis aligned bounding box in the setup pose. */
    

    /** The height of the skeleton's axis aligned bounding box in the setup pose. */
    

    /** The Spine version used to export the skeleton data, or null. */
    

    /** The skeleton data hash. This value will change if any of the skeleton data has changed. May be null. */
    

    // Nonessential
    /** The dopesheet FPS in Spine. Available only when nonessential data was exported. */
    __init9() {this.fps = 0;}

    /** The path to the images directory as defined in Spine. Available only when nonessential data was exported. May be null. */
    

    /** The path to the audio directory as defined in Spine. Available only when nonessential data was exported. May be null. */
    

    /** Finds a bone by comparing each bone's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
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

    /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
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

    /** Finds a skin by comparing each skin's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findSkin (skinName) {
        if (skinName == null) throw new Error("skinName cannot be null.");
        let skins = this.skins;
        for (let i = 0, n = skins.length; i < n; i++) {
            let skin = skins[i];
            if (skin.name == skinName) return skin;
        }
        return null;
    }

    /** Finds an event by comparing each events's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findEvent (eventDataName) {
        if (eventDataName == null) throw new Error("eventDataName cannot be null.");
        let events = this.events;
        for (let i = 0, n = events.length; i < n; i++) {
            let event = events[i];
            if (event.name == eventDataName) return event;
        }
        return null;
    }

    /** Finds an animation by comparing each animation's name. It is more efficient to cache the results of this method than to
     * call it multiple times.
     * @returns May be null. */
    findAnimation (animationName) {
        if (animationName == null) throw new Error("animationName cannot be null.");
        let animations = this.animations;
        for (let i = 0, n = animations.length; i < n; i++) {
            let animation = animations[i];
            if (animation.name == animationName) return animation;
        }
        return null;
    }

    /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
     * than to call it multiple times.
     * @return May be null. */
    findIkConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let ikConstraints = this.ikConstraints;
        for (let i = 0, n = ikConstraints.length; i < n; i++) {
            let constraint = ikConstraints[i];
            if (constraint.name == constraintName) return constraint;
        }
        return null;
    }

    /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
     * this method than to call it multiple times.
     * @return May be null. */
    findTransformConstraint (constraintName) {
        if (constraintName == null) throw new Error("constraintName cannot be null.");
        let transformConstraints = this.transformConstraints;
        for (let i = 0, n = transformConstraints.length; i < n; i++) {
            let constraint = transformConstraints[i];
            if (constraint.name == constraintName) return constraint;
        }
        return null;
    }

    /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
     * than to call it multiple times.
     * @return May be null. */
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

/** Stores the setup pose for a {@link Slot}.
 * @public
 * */
class SlotData  {

    /** The index of the slot in {@link Skeleton#getSlots()}. */
    

    /** The name of the slot, which is unique across all slots in the skeleton. */
    

    /** The bone this slot belongs to. */
    

    /** The color used to tint the slot's attachment. If {@link #getDarkColor()} is set, this is used as the light color for two
     * color tinting. */
    __init() {this.color = new Color(1, 1, 1, 1);}

    /** The dark color used to tint the slot's attachment for two color tinting, or null if two color tinting is not used. The dark
     * color's alpha is not used. */
    

    /** The name of the attachment that is visible for this slot in the setup pose, or null if no attachment is visible. */
    

    /** The blend mode for drawing the slot's attachment. */
    

    constructor (index, name, boneData) {SlotData.prototype.__init.call(this);
        if (index < 0) throw new Error("index must be >= 0.");
        if (name == null) throw new Error("name cannot be null.");
        if (boneData == null) throw new Error("boneData cannot be null.");
        this.index = index;
        this.name = name;
        this.boneData = boneData;
    }
}

/** Stores the setup pose for a {@link TransformConstraint}.
 *
 * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide.
 * @public
 * */
class TransformConstraintData extends ConstraintData {

    /** The bones that will be modified by this transform constraint. */
    __init() {this.bones = new Array();}

    /** The target bone whose world transform will be copied to the constrained bones. */
    

    __init2() {this.mixRotate = 0;}
    __init3() {this.mixX = 0;}
    __init4() {this.mixY = 0;}
    __init5() {this.mixScaleX = 0;}
    __init6() {this.mixScaleY = 0;}
    __init7() {this.mixShearY = 0;}

    /** An offset added to the constrained bone rotation. */
    __init8() {this.offsetRotation = 0;}

    /** An offset added to the constrained bone X translation. */
    __init9() {this.offsetX = 0;}

    /** An offset added to the constrained bone Y translation. */
    __init10() {this.offsetY = 0;}

    /** An offset added to the constrained bone scaleX. */
    __init11() {this.offsetScaleX = 0;}

    /** An offset added to the constrained bone scaleY. */
    __init12() {this.offsetScaleY = 0;}

    /** An offset added to the constrained bone shearY. */
    __init13() {this.offsetShearY = 0;}

    __init14() {this.relative = false;}
    __init15() {this.local = false;}

    constructor (name) {
        super(name, 0, false);TransformConstraintData.prototype.__init.call(this);TransformConstraintData.prototype.__init2.call(this);TransformConstraintData.prototype.__init3.call(this);TransformConstraintData.prototype.__init4.call(this);TransformConstraintData.prototype.__init5.call(this);TransformConstraintData.prototype.__init6.call(this);TransformConstraintData.prototype.__init7.call(this);TransformConstraintData.prototype.__init8.call(this);TransformConstraintData.prototype.__init9.call(this);TransformConstraintData.prototype.__init10.call(this);TransformConstraintData.prototype.__init11.call(this);TransformConstraintData.prototype.__init12.call(this);TransformConstraintData.prototype.__init13.call(this);TransformConstraintData.prototype.__init14.call(this);TransformConstraintData.prototype.__init15.call(this);    }
}

/** Stores an entry in the skin consisting of the slot index, name, and attachment
 * @public
 * **/
class SkinEntry {
    constructor( slotIndex,  name,  attachment) {this.slotIndex = slotIndex;this.name = name;this.attachment = attachment; }
}

/** Stores attachments by slot index and attachment name.
 *
 * See SkeletonData {@link SkeletonData#defaultSkin}, Skeleton {@link Skeleton#skin}, and
 * [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
 * @public
 * */
class Skin {
    /** The skin's name, which is unique across all skins in the skeleton. */
    

    __init() {this.attachments = new Array();}
    __init2() {this.bones = Array();}
    __init3() {this.constraints = new Array();}

    constructor (name) {Skin.prototype.__init.call(this);Skin.prototype.__init2.call(this);Skin.prototype.__init3.call(this);
        if (name == null) throw new Error("name cannot be null.");
        this.name = name;
    }

    /** Adds an attachment to the skin for the specified slot index and name. */
    setAttachment (slotIndex, name, attachment) {
        if (attachment == null) throw new Error("attachment cannot be null.");
        let attachments = this.attachments;
        if (slotIndex >= attachments.length) attachments.length = slotIndex + 1;
        if (!attachments[slotIndex]) attachments[slotIndex] = { };
        attachments[slotIndex][name] = attachment;
    }

    /** Adds all attachments, bones, and constraints from the specified skin to this skin. */
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

    /** Adds all bones and constraints and copies of all attachments from the specified skin to this skin. Mesh attachments are not
     * copied, instead a new linked mesh is created. The attachment copies can be modified without affecting the originals. */
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

    /** Returns the attachment for the specified slot index and name, or null. */
    getAttachment (slotIndex, name) {
        let dictionary = this.attachments[slotIndex];
        return dictionary ? dictionary[name] : null;
    }

    /** Removes the attachment in the skin for the specified slot index and name, if any. */
    removeAttachment (slotIndex, name) {
        let dictionary = this.attachments[slotIndex];
        if (dictionary) dictionary[name] = null;
    }

    /** Returns all attachments in this skin. */
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

    /** Returns all attachments in this skin for the specified slot index. */
    getAttachmentsForSlot (slotIndex, attachments) {
        let slotAttachments = this.attachments[slotIndex];
        if (slotAttachments) {
            for (let name in slotAttachments) {
                let attachment = slotAttachments[name];
                if (attachment) attachments.push(new SkinEntry(slotIndex, name, attachment));
            }
        }
    }

    /** Clears all attachments, bones, and constraints. */
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

/** Loads skeleton data in the Spine binary format.
 *
 * See [Spine binary format](http://esotericsoftware.com/spine-binary-format) and
 * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
 * Runtimes Guide.
 * @public
 * */
class SkeletonBinary {
    static __initStatic() {this.AttachmentTypeValues = [ 0 /*AttachmentType.Region*/, 1/*AttachmentType.BoundingBox*/, 2/*AttachmentType.Mesh*/, 3/*AttachmentType.LinkedMesh*/, 4/*AttachmentType.Path*/, 5/*AttachmentType.Point*/, 6/*AttachmentType.Clipping*/ ];}
    static __initStatic2() {this.TransformModeValues = [TransformMode.Normal, TransformMode.OnlyTranslation, TransformMode.NoRotationOrReflection, TransformMode.NoScale, TransformMode.NoScaleOrReflection];}
    static __initStatic3() {this.PositionModeValues = [ PositionMode.Fixed, PositionMode.Percent ];}
    static __initStatic4() {this.SpacingModeValues = [ SpacingMode.Length, SpacingMode.Fixed, SpacingMode.Percent];}
    static __initStatic5() {this.RotateModeValues = [ RotateMode.Tangent, RotateMode.Chain, RotateMode.ChainScale ];}
    static __initStatic6() {this.BlendModeValues = [ BLEND_MODES.NORMAL, BLEND_MODES.ADD, BLEND_MODES.MULTIPLY, BLEND_MODES.SCREEN];}

    static __initStatic7() {this.BONE_ROTATE = 0;}
    static __initStatic8() {this.BONE_TRANSLATE = 1;}
    static __initStatic9() {this.BONE_TRANSLATEX = 2;}
    static __initStatic10() {this.BONE_TRANSLATEY = 3;}
    static __initStatic11() {this.BONE_SCALE = 4;}
    static __initStatic12() {this.BONE_SCALEX = 5;}
    static __initStatic13() {this.BONE_SCALEY = 6;}
    static __initStatic14() {this.BONE_SHEAR = 7;}
    static __initStatic15() {this.BONE_SHEARX = 8;}
    static __initStatic16() {this.BONE_SHEARY = 9;}

    static __initStatic17() {this.SLOT_ATTACHMENT = 0;}
    static __initStatic18() {this.SLOT_RGBA = 1;}
    static __initStatic19() {this.SLOT_RGB = 2;}
    static __initStatic20() {this.SLOT_RGBA2 = 3;}
    static __initStatic21() {this.SLOT_RGB2 = 4;}
    static __initStatic22() {this.SLOT_ALPHA = 5;}

    static __initStatic23() {this.PATH_POSITION = 0;}
    static __initStatic24() {this.PATH_SPACING = 1;}
    static __initStatic25() {this.PATH_MIX = 2;}

    static __initStatic26() {this.CURVE_LINEAR = 0;}
    static __initStatic27() {this.CURVE_STEPPED = 1;}
    static __initStatic28() {this.CURVE_BEZIER = 2;}

    /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
     * runtime than were used in Spine.
     *
     * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
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

        let lowHash = input.readInt32();
        let highHash = input.readInt32();
        skeletonData.hash = highHash == 0 && lowHash == 0 ? null : highHash.toString(16) + lowHash.toString(16);
        skeletonData.version = input.readString();
        if (skeletonData.version.substr(0, 3) !== '4.0')
        {
            let error = `Spine 4.0 loader cant load version ${skeletonData.version}. Please configure your pixi-spine bundle`;
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
            data.mixRotate = input.readFloat();
            data.mixX = input.readFloat();
            data.mixY = input.readFloat();
            data.mixScaleX = input.readFloat();
            data.mixScaleY = input.readFloat();
            data.mixShearY = input.readFloat();
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
            data.mixRotate = input.readFloat();
            data.mixX = input.readFloat();
            data.mixY = input.readFloat();
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
        switch (SkeletonBinary.AttachmentTypeValues[typeIndex]) {
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
        let scale = this.scale;
        let verticesLength = vertexCount << 1;
        let vertices = new Vertices();
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
        // @ts-ignore
        let numTimelines = input.readInt(true);
        let timelines = new Array();
        let scale = this.scale;

        // Slot timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let slotIndex = input.readInt(true);
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let timelineType = input.readByte();
                let frameCount = input.readInt(true);
                let frameLast = frameCount - 1;
                switch (timelineType) {
                    case SkeletonBinary.SLOT_ATTACHMENT: {
                        let timeline = new AttachmentTimeline(frameCount, slotIndex);
                        for (let frame = 0; frame < frameCount; frame++)
                            timeline.setFrame(frame, input.readFloat(), input.readStringRef());
                        timelines.push(timeline);
                        break;
                    }
                    case SkeletonBinary.SLOT_RGBA: {
                        let bezierCount = input.readInt(true);
                        let timeline = new RGBATimeline(frameCount, bezierCount, slotIndex);

                        let time = input.readFloat();
                        let r = input.readUnsignedByte() / 255.0;
                        let g = input.readUnsignedByte() / 255.0;
                        let b = input.readUnsignedByte() / 255.0;
                        let a = input.readUnsignedByte() / 255.0;

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, r, g, b, a);
                            if (frame == frameLast) break;

                            let time2 = input.readFloat();
                            let r2 = input.readUnsignedByte() / 255.0;
                            let g2 = input.readUnsignedByte() / 255.0;
                            let b2 = input.readUnsignedByte() / 255.0;
                            let a2 = input.readUnsignedByte() / 255.0;

                            switch (input.readByte()) {
                                case SkeletonBinary.CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case SkeletonBinary.CURVE_BEZIER:
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 3, time, time2, a, a2, 1);
                            }
                            time = time2;
                            r = r2;
                            g = g2;
                            b = b2;
                            a = a2;
                        }
                        timelines.push(timeline);
                        break;
                    }
                    case SkeletonBinary.SLOT_RGB: {
                        let bezierCount = input.readInt(true);
                        let timeline = new RGBTimeline(frameCount, bezierCount, slotIndex);

                        let time = input.readFloat();
                        let r = input.readUnsignedByte() / 255.0;
                        let g = input.readUnsignedByte() / 255.0;
                        let b = input.readUnsignedByte() / 255.0;

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, r, g, b);
                            if (frame == frameLast) break;

                            let time2 = input.readFloat();
                            let r2 = input.readUnsignedByte() / 255.0;
                            let g2 = input.readUnsignedByte() / 255.0;
                            let b2 = input.readUnsignedByte() / 255.0;

                            switch (input.readByte()) {
                                case SkeletonBinary.CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case SkeletonBinary.CURVE_BEZIER:
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                            }
                            time = time2;
                            r = r2;
                            g = g2;
                            b = b2;
                        }
                        timelines.push(timeline);
                        break;
                    }
                    case SkeletonBinary.SLOT_RGBA2: {
                        let bezierCount = input.readInt(true);
                        let timeline = new RGBA2Timeline(frameCount, bezierCount, slotIndex);

                        let time = input.readFloat();
                        let r = input.readUnsignedByte() / 255.0;
                        let g = input.readUnsignedByte() / 255.0;
                        let b = input.readUnsignedByte() / 255.0;
                        let a = input.readUnsignedByte() / 255.0;
                        let r2 = input.readUnsignedByte() / 255.0;
                        let g2 = input.readUnsignedByte() / 255.0;
                        let b2 = input.readUnsignedByte() / 255.0;

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, r, g, b, a, r2, g2, b2);
                            if (frame == frameLast) break;
                            let time2 = input.readFloat();
                            let nr = input.readUnsignedByte() / 255.0;
                            let ng = input.readUnsignedByte() / 255.0;
                            let nb = input.readUnsignedByte() / 255.0;
                            let na = input.readUnsignedByte() / 255.0;
                            let nr2 = input.readUnsignedByte() / 255.0;
                            let ng2 = input.readUnsignedByte() / 255.0;
                            let nb2 = input.readUnsignedByte() / 255.0;

                            switch (input.readByte()) {
                                case SkeletonBinary.CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case SkeletonBinary.CURVE_BEZIER:
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 3, time, time2, a, na, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 4, time, time2, r2, nr2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 5, time, time2, g2, ng2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 6, time, time2, b2, nb2, 1);
                            }
                            time = time2;
                            r = nr;
                            g = ng;
                            b = nb;
                            a = na;
                            r2 = nr2;
                            g2 = ng2;
                            b2 = nb2;
                        }
                        timelines.push(timeline);
                        break;
                    }
                    case SkeletonBinary.SLOT_RGB2: {
                        let bezierCount = input.readInt(true);
                        let timeline = new RGB2Timeline(frameCount, bezierCount, slotIndex);

                        let time = input.readFloat();
                        let r = input.readUnsignedByte() / 255.0;
                        let g = input.readUnsignedByte() / 255.0;
                        let b = input.readUnsignedByte() / 255.0;
                        let r2 = input.readUnsignedByte() / 255.0;
                        let g2 = input.readUnsignedByte() / 255.0;
                        let b2 = input.readUnsignedByte() / 255.0;

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, r, g, b, r2, g2, b2);
                            if (frame == frameLast) break;
                            let time2 = input.readFloat();
                            let nr = input.readUnsignedByte() / 255.0;
                            let ng = input.readUnsignedByte() / 255.0;
                            let nb = input.readUnsignedByte() / 255.0;
                            let nr2 = input.readUnsignedByte() / 255.0;
                            let ng2 = input.readUnsignedByte() / 255.0;
                            let nb2 = input.readUnsignedByte() / 255.0;

                            switch (input.readByte()) {
                                case SkeletonBinary.CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case SkeletonBinary.CURVE_BEZIER:
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 3, time, time2, r2, nr2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 4, time, time2, g2, ng2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 5, time, time2, b2, nb2, 1);
                            }
                            time = time2;
                            r = nr;
                            g = ng;
                            b = nb;
                            r2 = nr2;
                            g2 = ng2;
                            b2 = nb2;
                        }
                        timelines.push(timeline);
                        break;
                    }
                    case SkeletonBinary.SLOT_ALPHA: {
                        let timeline = new AlphaTimeline(frameCount, input.readInt(true), slotIndex);
                        let time = input.readFloat(), a = input.readUnsignedByte() / 255;
                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, a);
                            if (frame == frameLast) break;
                            let time2 = input.readFloat();
                            let a2 = input.readUnsignedByte() / 255;
                            switch (input.readByte()) {
                                case SkeletonBinary.CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case SkeletonBinary.CURVE_BEZIER:
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, a, a2, 1);
                            }
                            time = time2;
                            a = a2;
                        }
                        timelines.push(timeline);
                        break;
                    }
                }
            }
        }

        // Bone timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let boneIndex = input.readInt(true);
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let type = input.readByte(), frameCount = input.readInt(true), bezierCount = input.readInt(true);
                switch (type) {
                    case SkeletonBinary.BONE_ROTATE:
                        timelines.push(SkeletonBinary.readTimeline(input, new RotateTimeline(frameCount, bezierCount, boneIndex), 1));
                        break;
                    case SkeletonBinary.BONE_TRANSLATE:
                        timelines.push(SkeletonBinary.readTimeline2(input, new TranslateTimeline(frameCount, bezierCount, boneIndex), scale));
                        break;
                    case SkeletonBinary.BONE_TRANSLATEX:
                        timelines.push(SkeletonBinary.readTimeline(input, new TranslateXTimeline(frameCount, bezierCount, boneIndex), scale));
                        break;
                    case SkeletonBinary.BONE_TRANSLATEY:
                        timelines.push(SkeletonBinary.readTimeline(input, new TranslateYTimeline(frameCount, bezierCount, boneIndex), scale));
                        break;
                    case SkeletonBinary.BONE_SCALE:
                        timelines.push(SkeletonBinary.readTimeline2(input, new ScaleTimeline(frameCount, bezierCount, boneIndex), 1));
                        break;
                    case SkeletonBinary.BONE_SCALEX:
                        timelines.push(SkeletonBinary.readTimeline(input, new ScaleXTimeline(frameCount, bezierCount, boneIndex), 1));
                        break;
                    case SkeletonBinary.BONE_SCALEY:
                        timelines.push(SkeletonBinary.readTimeline(input, new ScaleYTimeline(frameCount, bezierCount, boneIndex), 1));
                        break;
                    case SkeletonBinary.BONE_SHEAR:
                        timelines.push(SkeletonBinary.readTimeline2(input, new ShearTimeline(frameCount, bezierCount, boneIndex), 1));
                        break;
                    case SkeletonBinary.BONE_SHEARX:
                        timelines.push(SkeletonBinary.readTimeline(input, new ShearXTimeline(frameCount, bezierCount, boneIndex), 1));
                        break;
                    case SkeletonBinary.BONE_SHEARY:
                        timelines.push(SkeletonBinary.readTimeline(input, new ShearYTimeline(frameCount, bezierCount, boneIndex), 1));
                }
            }
        }

        // IK constraint timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
            let timeline = new IkConstraintTimeline(frameCount, input.readInt(true), index);
            let time = input.readFloat(), mix = input.readFloat(), softness = input.readFloat() * scale;
            for (let frame = 0, bezier = 0;; frame++) {
                timeline.setFrame(frame, time, mix, softness, input.readByte(), input.readBoolean(), input.readBoolean());
                if (frame == frameLast) break;
                let time2 = input.readFloat(), mix2 = input.readFloat(), softness2 = input.readFloat() * scale;
                switch (input.readByte()) {
                    case SkeletonBinary.CURVE_STEPPED:
                        timeline.setStepped(frame);
                        break;
                    case SkeletonBinary.CURVE_BEZIER:
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, mix, mix2, 1);
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 1, time, time2, softness, softness2, scale);
                }
                time = time2;
                mix = mix2;
                softness = softness2;
            }
            timelines.push(timeline);
        }

        // Transform constraint timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
            let timeline = new TransformConstraintTimeline(frameCount, input.readInt(true), index);
            let time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat(),
                mixScaleX = input.readFloat(), mixScaleY = input.readFloat(), mixShearY = input.readFloat();
            for (let frame = 0, bezier = 0;; frame++) {
                timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
                if (frame == frameLast) break;
                let time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(), mixY2 = input.readFloat(),
                    mixScaleX2 = input.readFloat(), mixScaleY2 = input.readFloat(), mixShearY2 = input.readFloat();
                switch (input.readByte()) {
                    case SkeletonBinary.CURVE_STEPPED:
                        timeline.setStepped(frame);
                        break;
                    case SkeletonBinary.CURVE_BEZIER:
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
                        SkeletonBinary.setBezier(input, timeline, bezier++, frame, 5, time, time2, mixShearY, mixShearY2, 1);
                }
                time = time2;
                mixRotate = mixRotate2;
                mixX = mixX2;
                mixY = mixY2;
                mixScaleX = mixScaleX2;
                mixScaleY = mixScaleY2;
                mixShearY = mixShearY2;
            }
            timelines.push(timeline);
        }

        // Path constraint timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let index = input.readInt(true);
            let data = skeletonData.pathConstraints[index];
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                switch (input.readByte()) {
                    case SkeletonBinary.PATH_POSITION:
                        timelines
                            .push(SkeletonBinary.readTimeline(input, new PathConstraintPositionTimeline(input.readInt(true), input.readInt(true), index),
                                data.positionMode == PositionMode.Fixed ? scale : 1));
                        break;
                    case SkeletonBinary.PATH_SPACING:
                        timelines
                            .push(SkeletonBinary.readTimeline(input, new PathConstraintSpacingTimeline(input.readInt(true), input.readInt(true), index),
                                data.spacingMode == SpacingMode.Length || data.spacingMode == SpacingMode.Fixed ? scale : 1));
                        break;
                    case SkeletonBinary.PATH_MIX:
                        let timeline = new PathConstraintMixTimeline(input.readInt(true), input.readInt(true),
                            index);
                        let time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat();
                        for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
                            timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                            if (frame == frameLast) break;
                            let time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(),
                                mixY2 = input.readFloat();
                            switch (input.readByte()) {
                                case SkeletonBinary.CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case SkeletonBinary.CURVE_BEZIER:
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
                                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);

                            }
                            time = time2;
                            mixRotate = mixRotate2;
                            mixX = mixX2;
                            mixY = mixY2;
                        }
                        timelines.push(timeline);
                }
            }
        }

        // Deform timelines.
        for (let i = 0, n = input.readInt(true); i < n; i++) {
            let skin = skeletonData.skins[input.readInt(true)];
            for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                let slotIndex = input.readInt(true);
                for (let iii = 0, nnn = input.readInt(true); iii < nnn; iii++) {
                    let attachmentName = input.readStringRef();
                    let attachment = skin.getAttachment(slotIndex, attachmentName) ;
                    if (attachment == null) throw Error("Vertex attachment not found: " + attachmentName);
                    let weighted = attachment.bones != null;
                    let vertices = attachment.vertices;
                    let deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;

                    let frameCount = input.readInt(true);
                    let frameLast = frameCount - 1;
                    let bezierCount = input.readInt(true);
                    let timeline = new DeformTimeline(frameCount, bezierCount, slotIndex, attachment);

                    let time = input.readFloat();
                    for (let frame = 0, bezier = 0;; frame++) {
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

                        timeline.setFrame(frame, time, deform);
                        if (frame == frameLast) break;
                        let time2 = input.readFloat();
                        switch(input.readByte()) {
                            case SkeletonBinary.CURVE_STEPPED:
                                timeline.setStepped(frame);
                                break;
                            case SkeletonBinary.CURVE_BEZIER:
                                SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, 0, 1, 1);
                        }
                        time = time2;
                    }
                    timelines.push(timeline);
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
        }

        let duration = 0;
        for (let i = 0, n = timelines.length; i < n; i++)
            duration = Math.max(duration, (timelines[i]).getDuration());
        return new Animation(name, timelines, duration);
    }

    static readTimeline (input, timeline, scale) {
        let time = input.readFloat(), value = input.readFloat() * scale;
        for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
            timeline.setFrame(frame, time, value);
            if (frame == frameLast) break;
            let time2 = input.readFloat(), value2 = input.readFloat() * scale;
            switch (input.readByte()) {
                case SkeletonBinary.CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                case SkeletonBinary.CURVE_BEZIER:
                    SkeletonBinary.setBezier(input, timeline, bezier++, frame, 0, time, time2, value, value2, 1);
            }
            time = time2;
            value = value2;
        }
        return timeline;
    }

    static readTimeline2 (input, timeline, scale) {
        let time = input.readFloat(), value1 = input.readFloat() * scale, value2 = input.readFloat() * scale;
        for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
            timeline.setFrame(frame, time, value1, value2);
            if (frame == frameLast) break;
            let time2 = input.readFloat(), nvalue1 = input.readFloat() * scale, nvalue2 = input.readFloat() * scale;
            switch (input.readByte()) {
                case SkeletonBinary.CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                case SkeletonBinary.CURVE_BEZIER:
                    this.setBezier(input, timeline, bezier++, frame, 0, time, time2, value1, nvalue1, scale);
                    this.setBezier(input, timeline, bezier++, frame, 1, time, time2, value2, nvalue2, scale);
            }
            time = time2;
            value1 = nvalue1;
            value2 = nvalue2;
        }
        return timeline;
    }

    static setBezier (input, timeline, bezier, frame, value, time1, time2, value1, value2, scale) {
        timeline.setBezier(bezier, frame, value, time1, value1, input.readFloat(), input.readFloat() * scale, input.readFloat(), input.readFloat() * scale, time2, value2);
    }
} SkeletonBinary.__initStatic(); SkeletonBinary.__initStatic2(); SkeletonBinary.__initStatic3(); SkeletonBinary.__initStatic4(); SkeletonBinary.__initStatic5(); SkeletonBinary.__initStatic6(); SkeletonBinary.__initStatic7(); SkeletonBinary.__initStatic8(); SkeletonBinary.__initStatic9(); SkeletonBinary.__initStatic10(); SkeletonBinary.__initStatic11(); SkeletonBinary.__initStatic12(); SkeletonBinary.__initStatic13(); SkeletonBinary.__initStatic14(); SkeletonBinary.__initStatic15(); SkeletonBinary.__initStatic16(); SkeletonBinary.__initStatic17(); SkeletonBinary.__initStatic18(); SkeletonBinary.__initStatic19(); SkeletonBinary.__initStatic20(); SkeletonBinary.__initStatic21(); SkeletonBinary.__initStatic22(); SkeletonBinary.__initStatic23(); SkeletonBinary.__initStatic24(); SkeletonBinary.__initStatic25(); SkeletonBinary.__initStatic26(); SkeletonBinary.__initStatic27(); SkeletonBinary.__initStatic28();

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

/** Collects each visible {@link BoundingBoxAttachment} and computes the world vertices for its polygon. The polygon vertices are
 * provided along with convenience methods for doing hit detection.
 * @public
 * */
class SkeletonBounds {constructor() { SkeletonBounds.prototype.__init.call(this);SkeletonBounds.prototype.__init2.call(this);SkeletonBounds.prototype.__init3.call(this);SkeletonBounds.prototype.__init4.call(this);SkeletonBounds.prototype.__init5.call(this);SkeletonBounds.prototype.__init6.call(this);SkeletonBounds.prototype.__init7.call(this); }

    /** The left edge of the axis aligned bounding box. */
    __init() {this.minX = 0;}

    /** The bottom edge of the axis aligned bounding box. */
    __init2() {this.minY = 0;}

    /** The right edge of the axis aligned bounding box. */
    __init3() {this.maxX = 0;}

    /** The top edge of the axis aligned bounding box. */
    __init4() {this.maxY = 0;}

    /** The visible bounding boxes. */
    __init5() {this.boundingBoxes = new Array();}

    /** The world vertices for the bounding box polygons. */
    __init6() {this.polygons = new Array();}

     __init7() {this.polygonPool = new Pool(() => {
        return Utils.newFloatArray(16);
    });}

    /** Clears any previous polygons, finds all visible bounding box attachments, and computes the world vertices for each bounding
     * box's polygon.
     * @param updateAabb If true, the axis aligned bounding box containing all the polygons is computed. If false, the
     *           SkeletonBounds AABB methods will always return true. */
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
     * is usually more efficient to only call this method if {@link #aabbIntersectsSegment()} returns
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

    /** The width of the axis aligned bounding box. */
    getWidth () {
        return this.maxX - this.minX;
    }

    /** The height of the axis aligned bounding box. */
    getHeight () {
        return this.maxY - this.minY;
    }
}

/** Loads skeleton data in the Spine JSON format.
 *
 * See [Spine JSON format](http://esotericsoftware.com/spine-json-format) and
 * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
 * Runtimes Guide.
 * @public
 * */
class SkeletonJson {
    

    /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
     * runtime than were used in Spine.
     *
     * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
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
            if (skeletonData.version.substr(0, 3) !== '4.0') {
                let error = `Spine 4.0 loader cant load version ${skeletonMap.spine}. Please configure your pixi-spine bundle`;
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

                let color = this.getValue(boneMap, "color", null);
                if (color) data.color.setFromString(color);

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

                data.mixRotate = this.getValue(constraintMap, "mixRotate", 1);
                data.mixX = this.getValue(constraintMap, "mixX", 1);
                data.mixY = this.getValue(constraintMap, "mixY", data.mixX);
                data.mixScaleX = this.getValue(constraintMap, "mixScaleX", 1);
                data.mixScaleY = this.getValue(constraintMap, "mixScaleY", data.mixScaleX);
                data.mixShearY = this.getValue(constraintMap, "mixShearY", 1);

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
                data.mixRotate = this.getValue(constraintMap, "mixRotate", 1);
                data.mixX = this.getValue(constraintMap, "mixX", 1);
                data.mixY = this.getValue(constraintMap, "mixY", 1);

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

        switch (this.getValue(map, "type", "region")) {
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

        // Slot timelines.
        if (map.slots) {
            for (let slotName in map.slots) {
                let slotMap = map.slots[slotName];
                let slotIndex = skeletonData.findSlotIndex(slotName);
                if (slotIndex == -1) throw new Error("Slot not found: " + slotName);
                for (let timelineName in slotMap) {
                    let timelineMap = slotMap[timelineName];
                    if (!timelineMap) continue;
                    if (timelineName == "attachment") {
                        let timeline = new AttachmentTimeline(timelineMap.length, slotIndex);
                        for (let frame = 0; frame < timelineMap.length; frame++) {
                            let keyMap = timelineMap[frame];
                            timeline.setFrame(frame, this.getValue(keyMap, "time", 0), keyMap.name);
                        }
                        timelines.push(timeline);

                    } else if (timelineName == "rgba") {
                        let timeline = new RGBATimeline(timelineMap.length, timelineMap.length << 2, slotIndex);
                        let keyMap = timelineMap[0];
                        let time = this.getValue(keyMap, "time", 0);
                        let color = new Color().setFromString(keyMap.color);

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, color.r, color.g, color.b, color.a);
                            if (timelineMap.length == frame + 1) {
                                break;
                            }
                            let nextMap = timelineMap[frame + 1];
                            let time2 = this.getValue(nextMap, "time", 0);
                            let newColor = new Color().setFromString(nextMap.color);
                            let curve = keyMap.curve;
                            if (curve) {
                                bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
                            }
                            time = time2;
                            color = newColor;
                            keyMap = nextMap;
                        }

                        timelines.push(timeline);

                    } else if (timelineName == "rgb") {
                        let timeline = new RGBTimeline(timelineMap.length, timelineMap.length * 3, slotIndex);
                        let keyMap = timelineMap[0];
                        let time = this.getValue(keyMap, "time", 0);
                        let color = new Color().setFromString(keyMap.color);

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, color.r, color.g, color.b);
                            if (timelineMap.length == frame + 1) {
                                break;
                            }
                            let nextMap = timelineMap[frame + 1];
                            let time2 = this.getValue(nextMap, "time", 0);
                            let newColor = new Color().setFromString(nextMap.color);
                            let curve = keyMap.curve;
                            if (curve) {
                                bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                            }
                            time = time2;
                            color = newColor;
                            keyMap = nextMap;
                        }

                        timelines.push(timeline);

                    } else if (timelineName == "alpha") {
                        timelines.push(this.readTimeline(timelineMap, new AlphaTimeline(timelineMap.length, timelineMap.length, slotIndex), 0, 1));
                    } else if (timelineName == "rgba2") {
                        let timeline = new RGBA2Timeline(timelineMap.length, timelineMap.length * 7, slotIndex);

                        let keyMap = timelineMap[0];
                        let time = this.getValue(keyMap, "time", 0);
                        let color = new Color().setFromString(keyMap.light);
                        let color2 = new Color().setFromString(keyMap.dark);

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, color.r, color.g, color.b, color.a, color2.r, color2.g, color2.b);
                            if (timelineMap.length == frame + 1) {
                                break;
                            }
                            let nextMap = timelineMap[frame + 1];
                            let time2 = this.getValue(nextMap, "time", 0);
                            let newColor = new Color().setFromString(nextMap.light);
                            let newColor2 = new Color().setFromString(nextMap.dark);
                            let curve = keyMap.curve;
                            if (curve) {
                                bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.r, newColor2.r, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.g, newColor2.g, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 6, time, time2, color2.b, newColor2.b, 1);
                            }
                            time = time2;
                            color = newColor;
                            color2 = newColor2;
                            keyMap = nextMap;
                        }

                        timelines.push(timeline);

                    } else if (timelineName == "rgb2") {
                        let timeline = new RGB2Timeline(timelineMap.length, timelineMap.length * 6, slotIndex);

                        let keyMap = timelineMap[0];
                        let time = this.getValue(keyMap, "time", 0);
                        let color = new Color().setFromString(keyMap.light);
                        let color2 = new Color().setFromString(keyMap.dark);

                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, color.r, color.g, color.b, color2.r, color2.g, color2.b);
                            if (timelineMap.length == frame + 1) {
                                break;
                            }
                            let nextMap = timelineMap[frame + 1];
                            let time2 = this.getValue(nextMap, "time", 0);
                            let newColor = new Color().setFromString(nextMap.light);
                            let newColor2 = new Color().setFromString(nextMap.dark);
                            let curve = keyMap.curve;
                            if (curve) {
                                bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 3, time, time2, color2.r, newColor2.r, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.g, newColor2.g, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.b, newColor2.b, 1);
                            }
                            time = time2;
                            color = newColor;
                            color2 = newColor2;
                            keyMap = nextMap;
                        }

                        timelines.push(timeline);

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
                    if (timelineMap.length == 0) continue;

                    if (timelineName === "rotate") {
                        timelines.push(this.readTimeline(timelineMap, new RotateTimeline(timelineMap.length, timelineMap.length, boneIndex), 0, 1));
                    } else if (timelineName === "translate") {
                        let timeline = new TranslateTimeline(timelineMap.length, timelineMap.length << 1, boneIndex);
                        timelines.push(this.readTimeline2(timelineMap, timeline, "x", "y", 0, scale));
                    } else if (timelineName === "translatex") {
                        let timeline = new TranslateXTimeline(timelineMap.length, timelineMap.length, boneIndex);
                        timelines.push(this.readTimeline(timelineMap, timeline, 0, scale));
                    } else if (timelineName === "translatey") {
                        let timeline = new TranslateYTimeline(timelineMap.length, timelineMap.length, boneIndex);
                        timelines.push(this.readTimeline(timelineMap, timeline, 0, scale));
                    } else if (timelineName === "scale") {
                        let timeline = new ScaleTimeline(timelineMap.length, timelineMap.length << 1, boneIndex);
                        timelines.push(this.readTimeline2(timelineMap, timeline, "x", "y", 1, 1));
                    } else if (timelineName === "scalex") {
                        let timeline = new ScaleXTimeline(timelineMap.length, timelineMap.length, boneIndex);
                        timelines.push(this.readTimeline(timelineMap, timeline, 1, 1));
                    } else if (timelineName === "scaley") {
                        let timeline = new ScaleYTimeline(timelineMap.length, timelineMap.length, boneIndex);
                        timelines.push(this.readTimeline(timelineMap, timeline, 1, 1));
                    } else if (timelineName === "shear") {
                        let timeline = new ShearTimeline(timelineMap.length, timelineMap.length << 1, boneIndex);
                        timelines.push(this.readTimeline2(timelineMap, timeline, "x", "y", 0, 1));
                    } else if (timelineName === "shearx") {
                        let timeline = new ShearXTimeline(timelineMap.length, timelineMap.length, boneIndex);
                        timelines.push(this.readTimeline(timelineMap, timeline, 0, 1));
                    } else if (timelineName === "sheary") {
                        let timeline = new ShearYTimeline(timelineMap.length, timelineMap.length, boneIndex);
                        timelines.push(this.readTimeline(timelineMap, timeline, 0, 1));
                    } else {
                        throw new Error("Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")");
                    }
                }
            }
        }

        // IK constraint timelines.
        if (map.ik) {
            for (let constraintName in map.ik) {
                let constraintMap = map.ik[constraintName];
                let keyMap = constraintMap[0];
                if (!keyMap) continue;

                let constraint = skeletonData.findIkConstraint(constraintName);
                let constraintIndex = skeletonData.ikConstraints.indexOf(constraint);
                let timeline = new IkConstraintTimeline(constraintMap.length, constraintMap.length << 1, constraintIndex);

                let time = this.getValue(keyMap, "time", 0);
                let mix = this.getValue(keyMap, "mix", 1);
                let softness = this.getValue(keyMap, "softness", 0) * scale;

                for (let frame = 0, bezier = 0;; frame++) {
                    timeline.setFrame(frame, time, mix, softness, this.getValue(keyMap, "bendPositive", true) ? 1 : -1, this.getValue(keyMap, "compress", false), this.getValue(keyMap, "stretch", false));
                    let nextMap = constraintMap[frame + 1];
                    if (!nextMap) {
                        break;
                    }

                    let time2 = this.getValue(nextMap, "time", 0);
                    let mix2 = this.getValue(nextMap, "mix", 1);
                    let softness2 = this.getValue(nextMap, "softness", 0) * scale;
                    let curve = keyMap.curve;
                    if (curve) {
                        bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, mix, mix2, 1);
                        bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, softness, softness2, scale);
                    }

                    time = time2;
                    mix = mix2;
                    softness = softness2;
                    keyMap = nextMap;
                }
                timelines.push(timeline);
            }
        }

        // Transform constraint timelines.
        if (map.transform) {
            for (let constraintName in map.transform) {
                let timelineMap = map.transform[constraintName];
                let keyMap = timelineMap[0];
                if (!keyMap) continue;

                let constraint = skeletonData.findTransformConstraint(constraintName);
                let constraintIndex = skeletonData.transformConstraints.indexOf(constraint);
                let timeline = new TransformConstraintTimeline(timelineMap.length, timelineMap.length << 2, constraintIndex);

                let time = this.getValue(keyMap, "time", 0);
                let mixRotate = this.getValue(keyMap, "mixRotate", 1);
                let mixShearY = this.getValue(keyMap, "mixShearY", 1);
                let mixX = this.getValue(keyMap, "mixX", 1);
                let mixY = this.getValue(keyMap, "mixY", mixX);
                let mixScaleX = this.getValue(keyMap, "mixScaleX", 1);
                let mixScaleY = this.getValue(keyMap, "mixScaleY", mixScaleX);

                for (let frame = 0, bezier = 0;; frame++) {
                    timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
                    let nextMap = timelineMap[frame + 1];
                    if (!nextMap) {
                        break;
                    }

                    let time2 = this.getValue(nextMap, "time", 0);
                    let mixRotate2 = this.getValue(nextMap, "mixRotate", 1);
                    let mixShearY2 = this.getValue(nextMap, "mixShearY", 1);
                    let mixX2 = this.getValue(nextMap, "mixX", 1);
                    let mixY2 = this.getValue(nextMap, "mixY", mixX2);
                    let mixScaleX2 = this.getValue(nextMap, "mixScaleX", 1);
                    let mixScaleY2 = this.getValue(nextMap, "mixScaleY", mixScaleX2);
                    let curve = keyMap.curve;
                    if (curve) {
                        bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                        bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                        bezier = this.readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
                        bezier = this.readCurve(curve, timeline, bezier, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
                        bezier = this.readCurve(curve, timeline, bezier, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
                        bezier = this.readCurve(curve, timeline, bezier, frame, 5, time, time2, mixShearY, mixShearY2, 1);
                    }

                    time = time2;
                    mixRotate = mixRotate2;
                    mixX = mixX2;
                    mixY = mixY2;
                    mixScaleX = mixScaleX2;
                    mixScaleY = mixScaleY2;
                    mixScaleX = mixScaleX2;
                    keyMap = nextMap;
                }
                timelines.push(timeline);
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
                    let keyMap = timelineMap[0];
                    if (!keyMap) continue;

                    if (timelineName === "position") {
                        let timeline = new PathConstraintPositionTimeline(timelineMap.length, timelineMap.length, index);
                        timelines.push(this.readTimeline(timelineMap, timeline, 0, data.positionMode == PositionMode.Fixed ? scale : 1));
                    } else if (timelineName === "spacing") {
                        let timeline = new PathConstraintSpacingTimeline(timelineMap.length, timelineMap.length, index);
                        timelines.push(this.readTimeline(timelineMap, timeline, 0, data.spacingMode == SpacingMode.Length || data.spacingMode == SpacingMode.Fixed ? scale : 1));
                    } else if (timelineName === "mix") {
                        let timeline = new PathConstraintMixTimeline(timelineMap.size, timelineMap.size * 3, index);
                        let time = this.getValue(keyMap, "time", 0);
                        let mixRotate = this.getValue(keyMap, "mixRotate", 1);
                        let mixX = this.getValue(keyMap, "mixX", 1);
                        let mixY = this.getValue(keyMap, "mixY", mixX);
                        for (let frame = 0, bezier = 0;; frame++) {
                            timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                            let nextMap = timelineMap[frame + 1];
                            if (!nextMap) {
                                break;
                            }
                            let time2 = this.getValue(nextMap, "time", 0);
                            let mixRotate2 = this.getValue(nextMap, "mixRotate", 1);
                            let mixX2 = this.getValue(nextMap, "mixX", 1);
                            let mixY2 = this.getValue(nextMap, "mixY", mixX2);
                            let curve = keyMap.curve;
                            if (curve != null) {
                                bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                                bezier = this.readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
                            }
                            time = time2;
                            mixRotate = mixRotate2;
                            mixX = mixX2;
                            mixY = mixY2;
                            keyMap = nextMap;
                        }
                        timelines.push(timeline);
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
                        let keyMap = timelineMap[0];
                        if (!keyMap) continue;

                        let attachment = skin.getAttachment(slotIndex, timelineName);
                        if (attachment == null) throw new Error("Deform attachment not found: " + timelineMap.name);
                        let weighted = attachment.bones != null;
                        let vertices = attachment.vertices;
                        let deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;

                        let timeline = new DeformTimeline(timelineMap.length, timelineMap.length, slotIndex, attachment);
                        let time = this.getValue(keyMap, "time", 0);
                        for (let frame = 0, bezier = 0;; frame++) {
                            let deform;
                            let verticesValue = this.getValue(keyMap, "vertices", null);
                            if (verticesValue == null)
                                deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
                            else {
                                deform = Utils.newFloatArray(deformLength);
                                let start = this.getValue(keyMap, "offset", 0);
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

                            timeline.setFrame(frame, time, deform);
                            let nextMap = timelineMap[frame + 1];
                            if (!nextMap) {
                                break;
                            }
                            let time2 = this.getValue(nextMap, "time", 0);
                            let curve = keyMap.curve;
                            if (curve) {
                                bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, 0, 1, 1);
                            }
                            time = time2;
                            keyMap = nextMap;
                        }
                        timelines.push(timeline);
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
            let frame = 0;
            for (let j = 0; j < drawOrderNode.length; j++, frame++) {
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
                timeline.setFrame(frame, this.getValue(drawOrderMap, "time", 0), drawOrder);
            }
            timelines.push(timeline);
        }

        // Event timeline.
        if (map.events) {
            let timeline = new EventTimeline(map.events.length);
            let frame = 0;
            for (let i = 0; i < map.events.length; i++, frame++) {
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
                timeline.setFrame(frame, event);
            }
            timelines.push(timeline);
        }

        let duration = 0;
        for (let i = 0, n = timelines.length; i < n; i++)
            duration = Math.max(duration, (timelines[i]).getDuration());

        if (isNaN(duration)) {
            throw new Error("Error while parsing animation, duration is NaN");
        }

        skeletonData.animations.push(new Animation(name, timelines, duration));
    }

     readTimeline (keys, timeline, defaultValue, scale) {
        let keyMap = keys[0];
        let time = this.getValue(keyMap, "time", 0);
        let value = this.getValue(keyMap, "value", defaultValue) * scale;
        let bezier = 0;
        for (let frame = 0;; frame++) {
            timeline.setFrame(frame, time, value);
            let nextMap = keys[frame + 1];
            if (!nextMap) break;
            let time2 = this.getValue(nextMap, "time", 0);
            let value2 = this.getValue(nextMap, "value", defaultValue) * scale;
            let curve = keyMap.curve;
            if (curve) bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, value, value2, scale);
            time = time2;
            value = value2;
            keyMap = nextMap;
        }
        return timeline;
    }

     readTimeline2 (keys, timeline, name1, name2, defaultValue, scale) {
        let keyMap = keys[0];
        let time = this.getValue(keyMap, "time", 0);
        let value1 = this.getValue(keyMap, name1, defaultValue) * scale;
        let value2 = this.getValue(keyMap, name2, defaultValue) * scale;
        let bezier = 0;
        for (let frame = 0;; frame++) {
            timeline.setFrame(frame, time, value1, value2);
            let nextMap = keys[frame + 1];
            if (!nextMap) break;
            let time2 = this.getValue(nextMap, "time", 0);
            let nvalue1 = this.getValue(nextMap, name1, defaultValue) * scale;
            let nvalue2 = this.getValue(nextMap, name2, defaultValue) * scale;
            let curve = keyMap.curve;
            if (curve != null) {
                bezier = this.readCurve(curve, timeline, bezier, frame, 0, time, time2, value1, nvalue1, scale);
                bezier = this.readCurve(curve, timeline, bezier, frame, 1, time, time2, value2, nvalue2, scale);
            }
            time = time2;
            value1 = nvalue1;
            value2 = nvalue2;
            keyMap = nextMap;
        }
        timeline.shrink(bezier);
        return timeline;
    }

     readCurve (curve, timeline, bezier, frame, value, time1, time2,
                       value1, value2, scale) {
        if (curve == "stepped") {
            if (value != 0) timeline.setStepped(frame);
        } else {
            let i = value << 2;
            let cx1 = curve[i++];
            let cy1 = curve[i++] * scale;
            let cx2 = curve[i++];
            let cy2 = curve[i++] * scale;
            this.setBezier(timeline, frame, value, bezier++, time1, value1, cx1, cy1, cx2, cy2, time2, value2);
        }
        return bezier;
    }

    setBezier (timeline, frame, value, bezier, time1, value1, cx1, cy1,
               cx2, cy2, time2, value2) {
        timeline.setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2);
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
        if (str == "proportional") return SpacingMode.Proportional;
        throw new Error(`Unknown spacing mode: ${str}`);
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

export { AlphaTimeline, Animation, AnimationState, AnimationStateAdapter, AnimationStateData, AtlasAttachmentLoader, Attachment, AttachmentTimeline, Bone, BoneData, BoundingBoxAttachment, ClippingAttachment, ConstraintData, CurveTimeline, CurveTimeline1, CurveTimeline2, DeformTimeline, DrawOrderTimeline, Event, EventData, EventQueue, EventTimeline, EventType, IkConstraint, IkConstraintData, IkConstraintTimeline, JitterEffect, MeshAttachment, MixBlend, MixDirection, PathAttachment, PathConstraint, PathConstraintData, PathConstraintMixTimeline, PathConstraintPositionTimeline, PathConstraintSpacingTimeline, PointAttachment, PositionMode, Property, RGB2Timeline, RGBA2Timeline, RGBATimeline, RGBTimeline, RegionAttachment, RotateMode, RotateTimeline, ScaleTimeline, ScaleXTimeline, ScaleYTimeline, ShearTimeline, ShearXTimeline, ShearYTimeline, Skeleton, SkeletonBinary, SkeletonBounds, SkeletonData, SkeletonJson, Skin, SkinEntry, Slot, SlotData, SpacingMode, Spine, SwirlEffect, Timeline, TrackEntry, TransformConstraint, TransformConstraintData, TransformConstraintTimeline, TransformMode, TranslateTimeline, TranslateXTimeline, TranslateYTimeline, VertexAttachment };
//# sourceMappingURL=runtime-4.0.es.js.map
