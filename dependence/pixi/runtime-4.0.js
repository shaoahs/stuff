/* eslint-disable */
 
/*!
 * @pixi-spine/runtime-4.0 - v3.0.7
 * Compiled Thu, 05 Aug 2021 00:33:14 UTC
 *
 * @pixi-spine/runtime-4.0 is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 * 
 * Copyright 2019-2020, Ivan Igorevich Popelyshev <ivan.popelyshev@gmail.com>, All Rights Reserved
 */
this.PIXI = this.PIXI || {};
this.PIXI.spine40 = this.PIXI.spine40 || {};
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@pixi-spine/base'), require('@pixi/math'), require('@pixi/constants')) :
    typeof define === 'function' && define.amd ? define(['exports', '@pixi-spine/base', '@pixi/math', '@pixi/constants'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global._pixi_spine_runtime_ = {}, global.PIXI.spine.base, global.PIXI, global.PIXI));
}(this, (function (exports, base, math, constants) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    function __exportStar(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    /**
     * The base class for all attachments.
     * @public
     */
    var Attachment = /** @class */ (function () {
        function Attachment(name) {
            if (!name)
                throw new Error("name cannot be null.");
            this.name = name;
        }
        return Attachment;
    }());
    /**
     * Base class for an attachment with vertices that are transformed by one or more bones and can be deformed by a slot's
     * {@link Slot#deform}.
     * @public
     */
    var VertexAttachment = /** @class */ (function (_super) {
        __extends(VertexAttachment, _super);
        function VertexAttachment(name) {
            var _this = _super.call(this, name) || this;
            /** The unique ID for this attachment. */
            _this.id = VertexAttachment.nextID++;
            /** The maximum number of world vertex values that can be output by
             * {@link #computeWorldVertices()} using the `count` parameter. */
            _this.worldVerticesLength = 0;
            /** Deform keys for the deform attachment are also applied to this attachment. May be null if no deform keys should be applied. */
            _this.deformAttachment = _this;
            return _this;
        }
        VertexAttachment.prototype.computeWorldVerticesOld = function (slot, worldVertices) {
            this.computeWorldVertices(slot, 0, this.worldVerticesLength, worldVertices, 0, 2);
        };
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
        VertexAttachment.prototype.computeWorldVertices = function (slot, start, count, worldVertices, offset, stride) {
            count = offset + (count >> 1) * stride;
            var skeleton = slot.bone.skeleton;
            var deformArray = slot.deform;
            var vertices = this.vertices;
            var bones = this.bones;
            if (!bones) {
                if (deformArray.length > 0)
                    vertices = deformArray;
                var mat = slot.bone.matrix;
                var x = mat.tx;
                var y = mat.ty;
                var a = mat.a, b = mat.c, c = mat.b, d = mat.d;
                for (var v_1 = start, w = offset; w < count; v_1 += 2, w += stride) {
                    var vx = vertices[v_1], vy = vertices[v_1 + 1];
                    worldVertices[w] = vx * a + vy * b + x;
                    worldVertices[w + 1] = vx * c + vy * d + y;
                }
                return;
            }
            var v = 0, skip = 0;
            for (var i = 0; i < start; i += 2) {
                var n = bones[v];
                v += n + 1;
                skip += n;
            }
            var skeletonBones = skeleton.bones;
            if (deformArray.length == 0) {
                for (var w = offset, b = skip * 3; w < count; w += stride) {
                    var wx = 0, wy = 0;
                    var n = bones[v++];
                    n += v;
                    for (; v < n; v++, b += 3) {
                        var mat = skeletonBones[bones[v]].matrix;
                        var vx = vertices[b], vy = vertices[b + 1], weight = vertices[b + 2];
                        wx += (vx * mat.a + vy * mat.c + mat.tx) * weight;
                        wy += (vx * mat.b + vy * mat.d + mat.ty) * weight;
                    }
                    worldVertices[w] = wx;
                    worldVertices[w + 1] = wy;
                }
            }
            else {
                var deform = deformArray;
                for (var w = offset, b = skip * 3, f = skip << 1; w < count; w += stride) {
                    var wx = 0, wy = 0;
                    var n = bones[v++];
                    n += v;
                    for (; v < n; v++, b += 3, f += 2) {
                        var mat = skeletonBones[bones[v]].matrix;
                        var vx = vertices[b] + deform[f], vy = vertices[b + 1] + deform[f + 1], weight = vertices[b + 2];
                        wx += (vx * mat.a + vy * mat.c + mat.tx) * weight;
                        wy += (vx * mat.b + vy * mat.d + mat.ty) * weight;
                    }
                    worldVertices[w] = wx;
                    worldVertices[w + 1] = wy;
                }
            }
        };
        /** Does not copy id (generated) or name (set on construction). **/
        VertexAttachment.prototype.copyTo = function (attachment) {
            if (this.bones) {
                attachment.bones = new Array(this.bones.length);
                base.Utils.arrayCopy(this.bones, 0, attachment.bones, 0, this.bones.length);
            }
            else
                attachment.bones = null;
            if (this.vertices) {
                attachment.vertices = base.Utils.newFloatArray(this.vertices.length);
                base.Utils.arrayCopy(this.vertices, 0, attachment.vertices, 0, this.vertices.length);
            }
            else
                attachment.vertices = null;
            attachment.worldVerticesLength = this.worldVerticesLength;
            attachment.deformAttachment = this.deformAttachment;
        };
        VertexAttachment.nextID = 0;
        return VertexAttachment;
    }(Attachment));

    /**
     * @public
     */
    var BoundingBoxAttachment = /** @class */ (function (_super) {
        __extends(BoundingBoxAttachment, _super);
        function BoundingBoxAttachment(name) {
            var _this = _super.call(this, name) || this;
            _this.type = base.AttachmentType.BoundingBox;
            _this.color = new base.Color(1, 1, 1, 1);
            return _this;
        }
        BoundingBoxAttachment.prototype.copy = function () {
            var copy = new BoundingBoxAttachment(this.name);
            this.copyTo(copy);
            copy.color.setFromColor(this.color);
            return copy;
        };
        return BoundingBoxAttachment;
    }(VertexAttachment));

    /**
     * @public
     */
    var ClippingAttachment = /** @class */ (function (_super) {
        __extends(ClippingAttachment, _super);
        function ClippingAttachment(name) {
            var _this = _super.call(this, name) || this;
            _this.type = base.AttachmentType.Clipping;
            // Nonessential.
            /** The color of the clipping polygon as it was in Spine. Available only when nonessential data was exported. Clipping polygons
             * are not usually rendered at runtime. */
            _this.color = new base.Color(0.2275, 0.2275, 0.8078, 1); // ce3a3aff
            return _this;
        }
        ClippingAttachment.prototype.copy = function () {
            var copy = new ClippingAttachment(this.name);
            this.copyTo(copy);
            copy.endSlot = this.endSlot;
            copy.color.setFromColor(this.color);
            return copy;
        };
        return ClippingAttachment;
    }(VertexAttachment));

    /**
     * @public
     */
    var MeshAttachment = /** @class */ (function (_super) {
        __extends(MeshAttachment, _super);
        function MeshAttachment(name) {
            var _this = _super.call(this, name) || this;
            _this.type = base.AttachmentType.Mesh;
            /** The color to tint the mesh. */
            _this.color = new base.Color(1, 1, 1, 1);
            _this.tempColor = new base.Color(0, 0, 0, 0);
            return _this;
        }
        /** The parent mesh if this is a linked mesh, else null. A linked mesh shares the {@link #bones}, {@link #vertices},
         * {@link #regionUVs}, {@link #triangles}, {@link #hullLength}, {@link #edges}, {@link #width}, and {@link #height} with the
         * parent mesh, but may have a different {@link #name} or {@link #path} (and therefore a different texture). */
        MeshAttachment.prototype.getParentMesh = function () {
            return this.parentMesh;
        };
        /** @param parentMesh May be null. */
        MeshAttachment.prototype.setParentMesh = function (parentMesh) {
            this.parentMesh = parentMesh;
            if (parentMesh) {
                this.bones = parentMesh.bones;
                this.vertices = parentMesh.vertices;
                this.worldVerticesLength = parentMesh.worldVerticesLength;
                this.regionUVs = parentMesh.regionUVs;
                this.triangles = parentMesh.triangles;
                this.hullLength = parentMesh.hullLength;
                this.worldVerticesLength = parentMesh.worldVerticesLength;
            }
        };
        MeshAttachment.prototype.copy = function () {
            if (this.parentMesh)
                return this.newLinkedMesh();
            var copy = new MeshAttachment(this.name);
            copy.region = this.region;
            copy.path = this.path;
            copy.color.setFromColor(this.color);
            this.copyTo(copy);
            copy.regionUVs = new Float32Array(this.regionUVs.length);
            base.Utils.arrayCopy(this.regionUVs, 0, copy.regionUVs, 0, this.regionUVs.length);
            copy.triangles = new Array(this.triangles.length);
            base.Utils.arrayCopy(this.triangles, 0, copy.triangles, 0, this.triangles.length);
            copy.hullLength = this.hullLength;
            // Nonessential.
            if (this.edges) {
                copy.edges = new Array(this.edges.length);
                base.Utils.arrayCopy(this.edges, 0, copy.edges, 0, this.edges.length);
            }
            copy.width = this.width;
            copy.height = this.height;
            return copy;
        };
        /** Returns a new mesh with the {@link #parentMesh} set to this mesh's parent mesh, if any, else to this mesh. **/
        MeshAttachment.prototype.newLinkedMesh = function () {
            var copy = new MeshAttachment(this.name);
            copy.region = this.region;
            copy.path = this.path;
            copy.color.setFromColor(this.color);
            copy.deformAttachment = this.deformAttachment;
            copy.setParentMesh(this.parentMesh ? this.parentMesh : this);
            // copy.updateUVs();
            return copy;
        };
        return MeshAttachment;
    }(VertexAttachment));

    /**
     * @public
     */
    var PathAttachment = /** @class */ (function (_super) {
        __extends(PathAttachment, _super);
        function PathAttachment(name) {
            var _this = _super.call(this, name) || this;
            _this.type = base.AttachmentType.Path;
            /** If true, the start and end knots are connected. */
            _this.closed = false;
            /** If true, additional calculations are performed to make calculating positions along the path more accurate. If false, fewer
             * calculations are performed but calculating positions along the path is less accurate. */
            _this.constantSpeed = false;
            /** The color of the path as it was in Spine. Available only when nonessential data was exported. Paths are not usually
             * rendered at runtime. */
            _this.color = new base.Color(1, 1, 1, 1);
            return _this;
        }
        PathAttachment.prototype.copy = function () {
            var copy = new PathAttachment(this.name);
            this.copyTo(copy);
            copy.lengths = new Array(this.lengths.length);
            base.Utils.arrayCopy(this.lengths, 0, copy.lengths, 0, this.lengths.length);
            copy.closed = closed;
            copy.constantSpeed = this.constantSpeed;
            copy.color.setFromColor(this.color);
            return copy;
        };
        return PathAttachment;
    }(VertexAttachment));

    /**
     * @public
     */
    var PointAttachment = /** @class */ (function (_super) {
        __extends(PointAttachment, _super);
        function PointAttachment(name) {
            var _this = _super.call(this, name) || this;
            _this.type = base.AttachmentType.Point;
            /** The color of the point attachment as it was in Spine. Available only when nonessential data was exported. Point attachments
             * are not usually rendered at runtime. */
            _this.color = new base.Color(0.38, 0.94, 0, 1);
            return _this;
        }
        PointAttachment.prototype.computeWorldPosition = function (bone, point) {
            var mat = bone.matrix;
            point.x = this.x * mat.a + this.y * mat.c + bone.worldX;
            point.y = this.x * mat.b + this.y * mat.d + bone.worldY;
            return point;
        };
        PointAttachment.prototype.computeWorldRotation = function (bone) {
            var mat = bone.matrix;
            var cos = base.MathUtils.cosDeg(this.rotation), sin = base.MathUtils.sinDeg(this.rotation);
            var x = cos * mat.a + sin * mat.c;
            var y = cos * mat.b + sin * mat.d;
            return Math.atan2(y, x) * base.MathUtils.radDeg;
        };
        PointAttachment.prototype.copy = function () {
            var copy = new PointAttachment(this.name);
            copy.x = this.x;
            copy.y = this.y;
            copy.rotation = this.rotation;
            copy.color.setFromColor(this.color);
            return copy;
        };
        return PointAttachment;
    }(VertexAttachment));

    /**
     * @public
     */
    var RegionAttachment = /** @class */ (function (_super) {
        __extends(RegionAttachment, _super);
        function RegionAttachment(name) {
            var _this = _super.call(this, name) || this;
            _this.type = base.AttachmentType.Region;
            /** The local x translation. */
            _this.x = 0;
            /** The local y translation. */
            _this.y = 0;
            /** The local scaleX. */
            _this.scaleX = 1;
            /** The local scaleY. */
            _this.scaleY = 1;
            /** The local rotation. */
            _this.rotation = 0;
            /** The width of the region attachment in Spine. */
            _this.width = 0;
            /** The height of the region attachment in Spine. */
            _this.height = 0;
            /** The color to tint the region attachment. */
            _this.color = new base.Color(1, 1, 1, 1);
            /** For each of the 4 vertices, a pair of <code>x,y</code> values that is the local position of the vertex.
             *
             * See {@link #updateOffset()}. */
            _this.offset = base.Utils.newFloatArray(8);
            _this.uvs = base.Utils.newFloatArray(8);
            _this.tempColor = new base.Color(1, 1, 1, 1);
            return _this;
        }
        /** Calculates the {@link #offset} using the region settings. Must be called after changing region settings. */
        RegionAttachment.prototype.updateOffset = function () {
            var regionScaleX = this.width / this.region.originalWidth * this.scaleX;
            var regionScaleY = this.height / this.region.originalHeight * this.scaleY;
            var localX = -this.width / 2 * this.scaleX + this.region.offsetX * regionScaleX;
            var localY = -this.height / 2 * this.scaleY + this.region.offsetY * regionScaleY;
            var localX2 = localX + this.region.width * regionScaleX;
            var localY2 = localY + this.region.height * regionScaleY;
            var radians = this.rotation * Math.PI / 180;
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            var localXCos = localX * cos + this.x;
            var localXSin = localX * sin;
            var localYCos = localY * cos + this.y;
            var localYSin = localY * sin;
            var localX2Cos = localX2 * cos + this.x;
            var localX2Sin = localX2 * sin;
            var localY2Cos = localY2 * cos + this.y;
            var localY2Sin = localY2 * sin;
            var offset = this.offset;
            offset[RegionAttachment.OX1] = localXCos - localYSin;
            offset[RegionAttachment.OY1] = localYCos + localXSin;
            offset[RegionAttachment.OX2] = localXCos - localY2Sin;
            offset[RegionAttachment.OY2] = localY2Cos + localXSin;
            offset[RegionAttachment.OX3] = localX2Cos - localY2Sin;
            offset[RegionAttachment.OY3] = localY2Cos + localX2Sin;
            offset[RegionAttachment.OX4] = localX2Cos - localYSin;
            offset[RegionAttachment.OY4] = localYCos + localX2Sin;
        };
        RegionAttachment.prototype.setRegion = function (region) {
            this.region = region;
            var uvs = this.uvs;
            if (region.degrees == 90) {
                uvs[2] = region.u;
                uvs[3] = region.v2;
                uvs[4] = region.u;
                uvs[5] = region.v;
                uvs[6] = region.u2;
                uvs[7] = region.v;
                uvs[0] = region.u2;
                uvs[1] = region.v2;
            }
            else {
                uvs[0] = region.u;
                uvs[1] = region.v2;
                uvs[2] = region.u;
                uvs[3] = region.v;
                uvs[4] = region.u2;
                uvs[5] = region.v;
                uvs[6] = region.u2;
                uvs[7] = region.v2;
            }
        };
        /** Transforms the attachment's four vertices to world coordinates.
         *
         * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
         * Runtimes Guide.
         * @param worldVertices The output world vertices. Must have a length >= `offset` + 8.
         * @param offset The `worldVertices` index to begin writing values.
         * @param stride The number of `worldVertices` entries between the value pairs written. */
        RegionAttachment.prototype.computeWorldVertices = function (bone, worldVertices, offset, stride) {
            var vertexOffset = this.offset;
            var mat = bone.matrix;
            var x = mat.tx, y = mat.ty;
            var a = mat.a, b = mat.c, c = mat.b, d = mat.d;
            var offsetX = 0, offsetY = 0;
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
        };
        RegionAttachment.prototype.copy = function () {
            var copy = new RegionAttachment(this.name);
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
            base.Utils.arrayCopy(this.uvs, 0, copy.uvs, 0, 8);
            base.Utils.arrayCopy(this.offset, 0, copy.offset, 0, 8);
            copy.color.setFromColor(this.color);
            return copy;
        };
        RegionAttachment.OX1 = 0;
        RegionAttachment.OY1 = 1;
        RegionAttachment.OX2 = 2;
        RegionAttachment.OY2 = 3;
        RegionAttachment.OX3 = 4;
        RegionAttachment.OY3 = 5;
        RegionAttachment.OX4 = 6;
        RegionAttachment.OY4 = 7;
        RegionAttachment.X1 = 0;
        RegionAttachment.Y1 = 1;
        RegionAttachment.C1R = 2;
        RegionAttachment.C1G = 3;
        RegionAttachment.C1B = 4;
        RegionAttachment.C1A = 5;
        RegionAttachment.U1 = 6;
        RegionAttachment.V1 = 7;
        RegionAttachment.X2 = 8;
        RegionAttachment.Y2 = 9;
        RegionAttachment.C2R = 10;
        RegionAttachment.C2G = 11;
        RegionAttachment.C2B = 12;
        RegionAttachment.C2A = 13;
        RegionAttachment.U2 = 14;
        RegionAttachment.V2 = 15;
        RegionAttachment.X3 = 16;
        RegionAttachment.Y3 = 17;
        RegionAttachment.C3R = 18;
        RegionAttachment.C3G = 19;
        RegionAttachment.C3B = 20;
        RegionAttachment.C3A = 21;
        RegionAttachment.U3 = 22;
        RegionAttachment.V3 = 23;
        RegionAttachment.X4 = 24;
        RegionAttachment.Y4 = 25;
        RegionAttachment.C4R = 26;
        RegionAttachment.C4G = 27;
        RegionAttachment.C4B = 28;
        RegionAttachment.C4A = 29;
        RegionAttachment.U4 = 30;
        RegionAttachment.V4 = 31;
        return RegionAttachment;
    }(Attachment));

    /**
     * @public
     */
    var JitterEffect = /** @class */ (function () {
        function JitterEffect(jitterX, jitterY) {
            this.jitterX = 0;
            this.jitterY = 0;
            this.jitterX = jitterX;
            this.jitterY = jitterY;
        }
        //@ts-ignore
        JitterEffect.prototype.begin = function (skeleton) {
        };
        //@ts-ignore
        JitterEffect.prototype.transform = function (position, uv, light, dark) {
            position.x += base.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
            position.y += base.MathUtils.randomTriangular(-this.jitterX, this.jitterY);
        };
        JitterEffect.prototype.end = function () {
        };
        return JitterEffect;
    }());

    /**
     * @public
     */
    var SwirlEffect = /** @class */ (function () {
        function SwirlEffect(radius) {
            this.centerX = 0;
            this.centerY = 0;
            this.radius = 0;
            this.angle = 0;
            this.worldX = 0;
            this.worldY = 0;
            this.radius = radius;
        }
        SwirlEffect.prototype.begin = function (skeleton) {
            this.worldX = skeleton.x + this.centerX;
            this.worldY = skeleton.y + this.centerY;
        };
        //@ts-ignore
        SwirlEffect.prototype.transform = function (position, uv, light, dark) {
            var radAngle = this.angle * base.MathUtils.degreesToRadians;
            var x = position.x - this.worldX;
            var y = position.y - this.worldY;
            var dist = Math.sqrt(x * x + y * y);
            if (dist < this.radius) {
                var theta = SwirlEffect.interpolation.apply(0, radAngle, (this.radius - dist) / this.radius);
                var cos = Math.cos(theta);
                var sin = Math.sin(theta);
                position.x = cos * x - sin * y + this.worldX;
                position.y = sin * x + cos * y + this.worldY;
            }
        };
        SwirlEffect.prototype.end = function () {
        };
        SwirlEffect.interpolation = new base.PowOut(2);
        return SwirlEffect;
    }());

    /**
     * A simple container for a list of timelines and a name.
     * @public
     * */
    var Animation = /** @class */ (function () {
        function Animation(name, timelines, duration) {
            if (!name)
                throw new Error("name cannot be null.");
            this.name = name;
            this.setTimelines(timelines);
            this.duration = duration;
        }
        Animation.prototype.setTimelines = function (timelines) {
            if (!timelines)
                throw new Error("timelines cannot be null.");
            this.timelines = timelines;
            this.timelineIds = new base.StringSet();
            for (var i = 0; i < timelines.length; i++)
                this.timelineIds.addAll(timelines[i].getPropertyIds());
        };
        Animation.prototype.hasTimeline = function (ids) {
            for (var i = 0; i < ids.length; i++)
                if (this.timelineIds.contains(ids[i]))
                    return true;
            return false;
        };
        /** Applies all the animation's timelines to the specified skeleton.
         *
         * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
         * @param loop If true, the animation repeats after {@link #getDuration()}.
         * @param events May be null to ignore fired events. */
        Animation.prototype.apply = function (skeleton, lastTime, time, loop, events, alpha, blend, direction) {
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            if (loop && this.duration != 0) {
                time %= this.duration;
                if (lastTime > 0)
                    lastTime %= this.duration;
            }
            var timelines = this.timelines;
            for (var i = 0, n = timelines.length; i < n; i++)
                timelines[i].apply(skeleton, lastTime, time, events, alpha, blend, direction);
        };
        return Animation;
    }());
    /** Controls how a timeline value is mixed with the setup pose value or current pose value when a timeline's `alpha`
     * < 1.
     *
     * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
     * @public
     * */
    exports.MixBlend = void 0;
    (function (MixBlend) {
        /** Transitions from the setup value to the timeline value (the current value is not used). Before the first key, the setup
         * value is set. */
        MixBlend[MixBlend["setup"] = 0] = "setup";
        /** Transitions from the current value to the timeline value. Before the first key, transitions from the current value to
         * the setup value. Timelines which perform instant transitions, such as {@link DrawOrderTimeline} or
         * {@link AttachmentTimeline}, use the setup value before the first key.
         *
         * `first` is intended for the first animations applied, not for animations layered on top of those. */
        MixBlend[MixBlend["first"] = 1] = "first";
        /** Transitions from the current value to the timeline value. No change is made before the first key (the current value is
         * kept until the first key).
         *
         * `replace` is intended for animations layered on top of others, not for the first animations applied. */
        MixBlend[MixBlend["replace"] = 2] = "replace";
        /** Transitions from the current value to the current value plus the timeline value. No change is made before the first key
         * (the current value is kept until the first key).
         *
         * `add` is intended for animations layered on top of others, not for the first animations applied. Properties
         * keyed by additive animations must be set manually or by another animation before applying the additive animations, else
         * the property values will increase continually. */
        MixBlend[MixBlend["add"] = 3] = "add";
    })(exports.MixBlend || (exports.MixBlend = {}));
    /** Indicates whether a timeline's `alpha` is mixing out over time toward 0 (the setup or current pose value) or
     * mixing in toward 1 (the timeline's value).
     *
     * See Timeline {@link Timeline#apply(Skeleton, float, float, Array, float, MixBlend, MixDirection)}.
     * @public
     * */
    exports.MixDirection = void 0;
    (function (MixDirection) {
        MixDirection[MixDirection["mixIn"] = 0] = "mixIn";
        MixDirection[MixDirection["mixOut"] = 1] = "mixOut";
    })(exports.MixDirection || (exports.MixDirection = {}));
    var Property = {
        rotate: 0,
        x: 1,
        y: 2,
        scaleX: 3,
        scaleY: 4,
        shearX: 5,
        shearY: 6,
        rgb: 7,
        alpha: 8,
        rgb2: 9,
        attachment: 10,
        deform: 11,
        event: 12,
        drawOrder: 13,
        ikConstraint: 14,
        transformConstraint: 15,
        pathConstraintPosition: 16,
        pathConstraintSpacing: 17,
        pathConstraintMix: 18
    };
    /** The interface for all timelines.
     * @public
     * */
    var Timeline = /** @class */ (function () {
        function Timeline(frameCount, propertyIds) {
            this.propertyIds = propertyIds;
            this.frames = base.Utils.newFloatArray(frameCount * this.getFrameEntries());
        }
        Timeline.prototype.getPropertyIds = function () {
            return this.propertyIds;
        };
        Timeline.prototype.getFrameEntries = function () {
            return 1;
        };
        Timeline.prototype.getFrameCount = function () {
            return this.frames.length / this.getFrameEntries();
        };
        Timeline.prototype.getDuration = function () {
            return this.frames[this.frames.length - this.getFrameEntries()];
        };
        Timeline.search1 = function (frames, time) {
            var n = frames.length;
            for (var i = 1; i < n; i++)
                if (frames[i] > time)
                    return i - 1;
            return n - 1;
        };
        Timeline.search = function (frames, time, step) {
            var n = frames.length;
            for (var i = step; i < n; i += step)
                if (frames[i] > time)
                    return i - step;
            return n - step;
        };
        return Timeline;
    }());
    /** The base class for timelines that use interpolation between key frame values.
     * @public
     * */
    var CurveTimeline = /** @class */ (function (_super) {
        __extends(CurveTimeline, _super);
        function CurveTimeline(frameCount, bezierCount, propertyIds) {
            var _this = _super.call(this, frameCount, propertyIds) || this;
            _this.curves = base.Utils.newFloatArray(frameCount + bezierCount * 18 /*BEZIER_SIZE*/);
            _this.curves[frameCount - 1] = 1 /*STEPPED*/;
            return _this;
        }
        /** Sets the specified key frame to linear interpolation. */
        CurveTimeline.prototype.setLinear = function (frame) {
            this.curves[frame] = 0 /*LINEAR*/;
        };
        /** Sets the specified key frame to stepped interpolation. */
        CurveTimeline.prototype.setStepped = function (frame) {
            this.curves[frame] = 1 /*STEPPED*/;
        };
        /** Shrinks the storage for Bezier curves, for use when <code>bezierCount</code> (specified in the constructor) was larger
         * than the actual number of Bezier curves. */
        CurveTimeline.prototype.shrink = function (bezierCount) {
            var size = this.getFrameCount() + bezierCount * 18 /*BEZIER_SIZE*/;
            if (this.curves.length > size) {
                var newCurves = base.Utils.newFloatArray(size);
                base.Utils.arrayCopy(this.curves, 0, newCurves, 0, size);
                this.curves = newCurves;
            }
        };
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
        CurveTimeline.prototype.setBezier = function (bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2) {
            var curves = this.curves;
            var i = this.getFrameCount() + bezier * 18 /*BEZIER_SIZE*/;
            if (value == 0)
                curves[frame] = 2 /*BEZIER*/ + i;
            var tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = (value1 - cy1 * 2 + cy2) * 0.03;
            var dddx = ((cx1 - cx2) * 3 - time1 + time2) * 0.006, dddy = ((cy1 - cy2) * 3 - value1 + value2) * 0.006;
            var ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
            var dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = (cy1 - value1) * 0.3 + tmpy + dddy * 0.16666667;
            var x = time1 + dx, y = value1 + dy;
            for (var n = i + 18 /*BEZIER_SIZE*/; i < n; i += 2) {
                curves[i] = x;
                curves[i + 1] = y;
                dx += ddx;
                dy += ddy;
                ddx += dddx;
                ddy += dddy;
                x += dx;
                y += dy;
            }
        };
        /** Returns the Bezier interpolated value for the specified time.
         * @param frameIndex The index into {@link #getFrames()} for the values of the frame before <code>time</code>.
         * @param valueOffset The offset from <code>frameIndex</code> to the value this curve is used for.
         * @param i The index of the Bezier segments. See {@link #getCurveType(int)}. */
        CurveTimeline.prototype.getBezierValue = function (time, frameIndex, valueOffset, i) {
            var curves = this.curves;
            if (curves[i] > time) {
                var x_1 = this.frames[frameIndex], y_1 = this.frames[frameIndex + valueOffset];
                return y_1 + (time - x_1) / (curves[i] - x_1) * (curves[i + 1] - y_1);
            }
            var n = i + 18 /*BEZIER_SIZE*/;
            for (i += 2; i < n; i += 2) {
                if (curves[i] >= time) {
                    var x_2 = curves[i - 2], y_2 = curves[i - 1];
                    return y_2 + (time - x_2) / (curves[i] - x_2) * (curves[i + 1] - y_2);
                }
            }
            frameIndex += this.getFrameEntries();
            var x = curves[n - 2], y = curves[n - 1];
            return y + (time - x) / (this.frames[frameIndex] - x) * (this.frames[frameIndex + valueOffset] - y);
        };
        return CurveTimeline;
    }(Timeline));
    /**
     * @public
     */
    var CurveTimeline1 = /** @class */ (function (_super) {
        __extends(CurveTimeline1, _super);
        function CurveTimeline1(frameCount, bezierCount, propertyId) {
            return _super.call(this, frameCount, bezierCount, [propertyId]) || this;
        }
        CurveTimeline1.prototype.getFrameEntries = function () {
            return 2 /*ENTRIES*/;
        };
        /** Sets the time and value for the specified frame.
         * @param frame Between 0 and <code>frameCount</code>, inclusive.
         * @param time The frame time in seconds. */
        CurveTimeline1.prototype.setFrame = function (frame, time, value) {
            frame <<= 1;
            this.frames[frame] = time;
            this.frames[frame + 1 /*VALUE*/] = value;
        };
        /** Returns the interpolated value for the specified time. */
        CurveTimeline1.prototype.getCurveValue = function (time) {
            var frames = this.frames;
            var i = frames.length - 2;
            for (var ii = 2; ii <= i; ii += 2) {
                if (frames[ii] > time) {
                    i = ii - 2;
                    break;
                }
            }
            var curveType = this.curves[i >> 1];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i], value = frames[i + 1 /*VALUE*/];
                    return value + (time - before) / (frames[i + 2 /*ENTRIES*/] - before) * (frames[i + 2 /*ENTRIES*/ + 1 /*VALUE*/] - value);
                case 1 /*STEPPED*/:
                    return frames[i + 1 /*VALUE*/];
            }
            return this.getBezierValue(time, i, 1 /*VALUE*/, curveType - 2 /*BEZIER*/);
        };
        return CurveTimeline1;
    }(CurveTimeline));
    /** The base class for a {@link CurveTimeline} which sets two properties.
     * @public
     * */
    var CurveTimeline2 = /** @class */ (function (_super) {
        __extends(CurveTimeline2, _super);
        /** @param bezierCount The maximum number of Bezier curves. See {@link #shrink(int)}.
         * @param propertyIds Unique identifiers for the properties the timeline modifies. */
        function CurveTimeline2(frameCount, bezierCount, propertyId1, propertyId2) {
            return _super.call(this, frameCount, bezierCount, [propertyId1, propertyId2]) || this;
        }
        CurveTimeline2.prototype.getFrameEntries = function () {
            return 3 /*ENTRIES*/;
        };
        /** Sets the time and values for the specified frame.
         * @param frame Between 0 and <code>frameCount</code>, inclusive.
         * @param time The frame time in seconds. */
        CurveTimeline2.prototype.setFrame = function (frame, time, value1, value2) {
            frame *= 3 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*VALUE1*/] = value1;
            this.frames[frame + 2 /*VALUE2*/] = value2;
        };
        return CurveTimeline2;
    }(CurveTimeline));
    /** Changes a bone's local {@link Bone#rotation}.
     * @public
     * */
    var RotateTimeline = /** @class */ (function (_super) {
        __extends(RotateTimeline, _super);
        function RotateTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.rotate + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        RotateTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.rotation = bone.data.rotation;
                        return;
                    case exports.MixBlend.first:
                        bone.rotation += (bone.data.rotation - bone.rotation) * alpha;
                }
                return;
            }
            var r = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.rotation = bone.data.rotation + r * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    r += bone.data.rotation - bone.rotation;
                case exports.MixBlend.add:
                    bone.rotation += r * alpha;
            }
        };
        return RotateTimeline;
    }(CurveTimeline1));
    /** Changes a bone's local {@link Bone#x} and {@link Bone#y}.
     * @public
     * */
    var TranslateTimeline = /** @class */ (function (_super) {
        __extends(TranslateTimeline, _super);
        function TranslateTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.x + "|" + boneIndex, Property.y + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        TranslateTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.x = bone.data.x;
                        bone.y = bone.data.y;
                        return;
                    case exports.MixBlend.first:
                        bone.x += (bone.data.x - bone.x) * alpha;
                        bone.y += (bone.data.y - bone.y) * alpha;
                }
                return;
            }
            var x = 0, y = 0;
            var i = Timeline.search(frames, time, 3 /*ENTRIES*/);
            var curveType = this.curves[i / 3 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    var t = (time - before) / (frames[i + 3 /*ENTRIES*/] - before);
                    x += (frames[i + 3 /*ENTRIES*/ + 1 /*VALUE1*/] - x) * t;
                    y += (frames[i + 3 /*ENTRIES*/ + 2 /*VALUE2*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    break;
                default:
                    x = this.getBezierValue(time, i, 1 /*VALUE1*/, curveType - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 2 /*VALUE2*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.x = bone.data.x + x * alpha;
                    bone.y = bone.data.y + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.x += (bone.data.x + x - bone.x) * alpha;
                    bone.y += (bone.data.y + y - bone.y) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.x += x * alpha;
                    bone.y += y * alpha;
            }
        };
        return TranslateTimeline;
    }(CurveTimeline2));
    /** Changes a bone's local {@link Bone#x}.
     * @public
     * */
    var TranslateXTimeline = /** @class */ (function (_super) {
        __extends(TranslateXTimeline, _super);
        function TranslateXTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.x + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        TranslateXTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.x = bone.data.x;
                        return;
                    case exports.MixBlend.first:
                        bone.x += (bone.data.x - bone.x) * alpha;
                }
                return;
            }
            var x = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.x = bone.data.x + x * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.x += (bone.data.x + x - bone.x) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.x += x * alpha;
            }
        };
        return TranslateXTimeline;
    }(CurveTimeline1));
    /** Changes a bone's local {@link Bone#x}.
     * @public
     * */
    var TranslateYTimeline = /** @class */ (function (_super) {
        __extends(TranslateYTimeline, _super);
        function TranslateYTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.y + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        TranslateYTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.y = bone.data.y;
                        return;
                    case exports.MixBlend.first:
                        bone.y += (bone.data.y - bone.y) * alpha;
                }
                return;
            }
            var y = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.y = bone.data.y + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.y += (bone.data.y + y - bone.y) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.y += y * alpha;
            }
        };
        return TranslateYTimeline;
    }(CurveTimeline1));
    /** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
     * @public
     * */
    var ScaleTimeline = /** @class */ (function (_super) {
        __extends(ScaleTimeline, _super);
        function ScaleTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.scaleX + "|" + boneIndex, Property.scaleY + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        ScaleTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.scaleX = bone.data.scaleX;
                        bone.scaleY = bone.data.scaleY;
                        return;
                    case exports.MixBlend.first:
                        bone.scaleX += (bone.data.scaleX - bone.scaleX) * alpha;
                        bone.scaleY += (bone.data.scaleY - bone.scaleY) * alpha;
                }
                return;
            }
            var x, y;
            var i = Timeline.search(frames, time, 3 /*ENTRIES*/);
            var curveType = this.curves[i / 3 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    var t = (time - before) / (frames[i + 3 /*ENTRIES*/] - before);
                    x += (frames[i + 3 /*ENTRIES*/ + 1 /*VALUE1*/] - x) * t;
                    y += (frames[i + 3 /*ENTRIES*/ + 2 /*VALUE2*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    break;
                default:
                    x = this.getBezierValue(time, i, 1 /*VALUE1*/, curveType - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 2 /*VALUE2*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            x *= bone.data.scaleX;
            y *= bone.data.scaleY;
            if (alpha == 1) {
                if (blend == exports.MixBlend.add) {
                    bone.scaleX += x - bone.data.scaleX;
                    bone.scaleY += y - bone.data.scaleY;
                }
                else {
                    bone.scaleX = x;
                    bone.scaleY = y;
                }
            }
            else {
                var bx = 0, by = 0;
                if (direction == exports.MixDirection.mixOut) {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = bone.data.scaleX;
                            by = bone.data.scaleY;
                            bone.scaleX = bx + (Math.abs(x) * base.MathUtils.signum(bx) - bx) * alpha;
                            bone.scaleY = by + (Math.abs(y) * base.MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = bone.scaleX;
                            by = bone.scaleY;
                            bone.scaleX = bx + (Math.abs(x) * base.MathUtils.signum(bx) - bx) * alpha;
                            bone.scaleY = by + (Math.abs(y) * base.MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bx = bone.scaleX;
                            by = bone.scaleY;
                            bone.scaleX = bx + (Math.abs(x) * base.MathUtils.signum(bx) - bone.data.scaleX) * alpha;
                            bone.scaleY = by + (Math.abs(y) * base.MathUtils.signum(by) - bone.data.scaleY) * alpha;
                    }
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = Math.abs(bone.data.scaleX) * base.MathUtils.signum(x);
                            by = Math.abs(bone.data.scaleY) * base.MathUtils.signum(y);
                            bone.scaleX = bx + (x - bx) * alpha;
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = Math.abs(bone.scaleX) * base.MathUtils.signum(x);
                            by = Math.abs(bone.scaleY) * base.MathUtils.signum(y);
                            bone.scaleX = bx + (x - bx) * alpha;
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bx = base.MathUtils.signum(x);
                            by = base.MathUtils.signum(y);
                            bone.scaleX = Math.abs(bone.scaleX) * bx + (x - Math.abs(bone.data.scaleX) * bx) * alpha;
                            bone.scaleY = Math.abs(bone.scaleY) * by + (y - Math.abs(bone.data.scaleY) * by) * alpha;
                    }
                }
            }
        };
        return ScaleTimeline;
    }(CurveTimeline2));
    /** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
     * @public
     * */
    var ScaleXTimeline = /** @class */ (function (_super) {
        __extends(ScaleXTimeline, _super);
        function ScaleXTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.scaleX + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        ScaleXTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.scaleX = bone.data.scaleX;
                        return;
                    case exports.MixBlend.first:
                        bone.scaleX += (bone.data.scaleX - bone.scaleX) * alpha;
                }
                return;
            }
            var x = this.getCurveValue(time) * bone.data.scaleX;
            if (alpha == 1) {
                if (blend == exports.MixBlend.add)
                    bone.scaleX += x - bone.data.scaleX;
                else
                    bone.scaleX = x;
            }
            else {
                // Mixing out uses sign of setup or current pose, else use sign of key.
                var bx = 0;
                if (direction == exports.MixDirection.mixOut) {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = bone.data.scaleX;
                            bone.scaleX = bx + (Math.abs(x) * base.MathUtils.signum(bx) - bx) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = bone.scaleX;
                            bone.scaleX = bx + (Math.abs(x) * base.MathUtils.signum(bx) - bx) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bx = bone.scaleX;
                            bone.scaleX = bx + (Math.abs(x) * base.MathUtils.signum(bx) - bone.data.scaleX) * alpha;
                    }
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            bx = Math.abs(bone.data.scaleX) * base.MathUtils.signum(x);
                            bone.scaleX = bx + (x - bx) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            bx = Math.abs(bone.scaleX) * base.MathUtils.signum(x);
                            bone.scaleX = bx + (x - bx) * alpha;
                            break;
                        case exports.MixBlend.add:
                            bx = base.MathUtils.signum(x);
                            bone.scaleX = Math.abs(bone.scaleX) * bx + (x - Math.abs(bone.data.scaleX) * bx) * alpha;
                    }
                }
            }
        };
        return ScaleXTimeline;
    }(CurveTimeline1));
    /** Changes a bone's local {@link Bone#scaleX)} and {@link Bone#scaleY}.
     * @public
     * */
    var ScaleYTimeline = /** @class */ (function (_super) {
        __extends(ScaleYTimeline, _super);
        function ScaleYTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.scaleY + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        ScaleYTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.scaleY = bone.data.scaleY;
                        return;
                    case exports.MixBlend.first:
                        bone.scaleY += (bone.data.scaleY - bone.scaleY) * alpha;
                }
                return;
            }
            var y = this.getCurveValue(time) * bone.data.scaleY;
            if (alpha == 1) {
                if (blend == exports.MixBlend.add)
                    bone.scaleY += y - bone.data.scaleY;
                else
                    bone.scaleY = y;
            }
            else {
                // Mixing out uses sign of setup or current pose, else use sign of key.
                var by = 0;
                if (direction == exports.MixDirection.mixOut) {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            by = bone.data.scaleY;
                            bone.scaleY = by + (Math.abs(y) * base.MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            by = bone.scaleY;
                            bone.scaleY = by + (Math.abs(y) * base.MathUtils.signum(by) - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            by = bone.scaleY;
                            bone.scaleY = by + (Math.abs(y) * base.MathUtils.signum(by) - bone.data.scaleY) * alpha;
                    }
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup:
                            by = Math.abs(bone.data.scaleY) * base.MathUtils.signum(y);
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            by = Math.abs(bone.scaleY) * base.MathUtils.signum(y);
                            bone.scaleY = by + (y - by) * alpha;
                            break;
                        case exports.MixBlend.add:
                            by = base.MathUtils.signum(y);
                            bone.scaleY = Math.abs(bone.scaleY) * by + (y - Math.abs(bone.data.scaleY) * by) * alpha;
                    }
                }
            }
        };
        return ScaleYTimeline;
    }(CurveTimeline1));
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
     * @public
     * */
    var ShearTimeline = /** @class */ (function (_super) {
        __extends(ShearTimeline, _super);
        function ShearTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.shearX + "|" + boneIndex, Property.shearY + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        ShearTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.shearX = bone.data.shearX;
                        bone.shearY = bone.data.shearY;
                        return;
                    case exports.MixBlend.first:
                        bone.shearX += (bone.data.shearX - bone.shearX) * alpha;
                        bone.shearY += (bone.data.shearY - bone.shearY) * alpha;
                }
                return;
            }
            var x = 0, y = 0;
            var i = Timeline.search(frames, time, 3 /*ENTRIES*/);
            var curveType = this.curves[i / 3 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    var t = (time - before) / (frames[i + 3 /*ENTRIES*/] - before);
                    x += (frames[i + 3 /*ENTRIES*/ + 1 /*VALUE1*/] - x) * t;
                    y += (frames[i + 3 /*ENTRIES*/ + 2 /*VALUE2*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    x = frames[i + 1 /*VALUE1*/];
                    y = frames[i + 2 /*VALUE2*/];
                    break;
                default:
                    x = this.getBezierValue(time, i, 1 /*VALUE1*/, curveType - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 2 /*VALUE2*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.shearX = bone.data.shearX + x * alpha;
                    bone.shearY = bone.data.shearY + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.shearX += (bone.data.shearX + x - bone.shearX) * alpha;
                    bone.shearY += (bone.data.shearY + y - bone.shearY) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.shearX += x * alpha;
                    bone.shearY += y * alpha;
            }
        };
        return ShearTimeline;
    }(CurveTimeline2));
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
     * @public
     * */
    var ShearXTimeline = /** @class */ (function (_super) {
        __extends(ShearXTimeline, _super);
        function ShearXTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.shearX + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        ShearXTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.shearX = bone.data.shearX;
                        return;
                    case exports.MixBlend.first:
                        bone.shearX += (bone.data.shearX - bone.shearX) * alpha;
                }
                return;
            }
            var x = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.shearX = bone.data.shearX + x * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.shearX += (bone.data.shearX + x - bone.shearX) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.shearX += x * alpha;
            }
        };
        return ShearXTimeline;
    }(CurveTimeline1));
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
     * @public
     * */
    var ShearYTimeline = /** @class */ (function (_super) {
        __extends(ShearYTimeline, _super);
        function ShearYTimeline(frameCount, bezierCount, boneIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.shearY + "|" + boneIndex) || this;
            _this.boneIndex = 0;
            _this.boneIndex = boneIndex;
            return _this;
        }
        ShearYTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var bone = skeleton.bones[this.boneIndex];
            if (!bone.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.shearY = bone.data.shearY;
                        return;
                    case exports.MixBlend.first:
                        bone.shearY += (bone.data.shearY - bone.shearY) * alpha;
                }
                return;
            }
            var y = this.getCurveValue(time);
            switch (blend) {
                case exports.MixBlend.setup:
                    bone.shearY = bone.data.shearY + y * alpha;
                    break;
                case exports.MixBlend.first:
                case exports.MixBlend.replace:
                    bone.shearY += (bone.data.shearY + y - bone.shearY) * alpha;
                    break;
                case exports.MixBlend.add:
                    bone.shearY += y * alpha;
            }
        };
        return ShearYTimeline;
    }(CurveTimeline1));
    /** Changes a slot's {@link Slot#color}.
     * @public
     * */
    var RGBATimeline = /** @class */ (function (_super) {
        __extends(RGBATimeline, _super);
        function RGBATimeline(frameCount, bezierCount, slotIndex) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex,
                Property.alpha + "|" + slotIndex
            ]) || this;
            _this.slotIndex = 0;
            _this.slotIndex = slotIndex;
            return _this;
        }
        RGBATimeline.prototype.getFrameEntries = function () {
            return 5 /*ENTRIES*/;
        };
        /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
        RGBATimeline.prototype.setFrame = function (frame, time, r, g, b, a) {
            frame *= 5 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
            this.frames[frame + 4 /*A*/] = a;
        };
        RGBATimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            var frames = this.frames;
            var color = slot.color;
            if (time < frames[0]) {
                var setup = slot.data.color;
                switch (blend) {
                    case exports.MixBlend.setup:
                        color.setFromColor(setup);
                        return;
                    case exports.MixBlend.first:
                        color.add((setup.r - color.r) * alpha, (setup.g - color.g) * alpha, (setup.b - color.b) * alpha, (setup.a - color.a) * alpha);
                }
                return;
            }
            var r = 0, g = 0, b = 0, a = 0;
            var i = Timeline.search(frames, time, 5 /*ENTRIES*/);
            var curveType = this.curves[i / 5 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    var t = (time - before) / (frames[i + 5 /*ENTRIES*/] - before);
                    r += (frames[i + 5 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 5 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 5 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    a += (frames[i + 5 /*ENTRIES*/ + 4 /*A*/] - a) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    a = this.getBezierValue(time, i, 4 /*A*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
            }
            if (alpha == 1)
                color.set(r, g, b, a);
            else {
                if (blend == exports.MixBlend.setup)
                    color.setFromColor(slot.data.color);
                color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha, (a - color.a) * alpha);
            }
        };
        return RGBATimeline;
    }(CurveTimeline));
    /** Changes a slot's {@link Slot#color}.
     * @public
     * */
    var RGBTimeline = /** @class */ (function (_super) {
        __extends(RGBTimeline, _super);
        function RGBTimeline(frameCount, bezierCount, slotIndex) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex
            ]) || this;
            _this.slotIndex = 0;
            _this.slotIndex = slotIndex;
            return _this;
        }
        RGBTimeline.prototype.getFrameEntries = function () {
            return 4 /*ENTRIES*/;
        };
        /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
        RGBTimeline.prototype.setFrame = function (frame, time, r, g, b) {
            frame <<= 2;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
        };
        RGBTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            var frames = this.frames;
            var color = slot.color;
            if (time < frames[0]) {
                var setup = slot.data.color;
                switch (blend) {
                    case exports.MixBlend.setup:
                        color.r = setup.r;
                        color.g = setup.g;
                        color.b = setup.b;
                        return;
                    case exports.MixBlend.first:
                        color.r += (setup.r - color.r) * alpha;
                        color.g += (setup.g - color.g) * alpha;
                        color.b += (setup.b - color.b) * alpha;
                }
                return;
            }
            var r = 0, g = 0, b = 0;
            var i = Timeline.search(frames, time, 4 /*ENTRIES*/);
            var curveType = this.curves[i >> 2];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    var t = (time - before) / (frames[i + 4 /*ENTRIES*/] - before);
                    r += (frames[i + 4 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 4 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 4 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
            }
            if (alpha == 1) {
                color.r = r;
                color.g = g;
                color.b = b;
            }
            else {
                if (blend == exports.MixBlend.setup) {
                    var setup = slot.data.color;
                    color.r = setup.r;
                    color.g = setup.g;
                    color.b = setup.b;
                }
                color.r += (r - color.r) * alpha;
                color.g += (g - color.g) * alpha;
                color.b += (b - color.b) * alpha;
            }
        };
        return RGBTimeline;
    }(CurveTimeline));
    /** Changes a bone's local {@link Bone#shearX} and {@link Bone#shearY}.
     * @public
     * */
    var AlphaTimeline = /** @class */ (function (_super) {
        __extends(AlphaTimeline, _super);
        function AlphaTimeline(frameCount, bezierCount, slotIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.alpha + "|" + slotIndex) || this;
            _this.slotIndex = 0;
            _this.slotIndex = slotIndex;
            return _this;
        }
        AlphaTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            var color = slot.color;
            if (time < this.frames[0]) { // Time is before first frame.
                var setup = slot.data.color;
                switch (blend) {
                    case exports.MixBlend.setup:
                        color.a = setup.a;
                        return;
                    case exports.MixBlend.first:
                        color.a += (setup.a - color.a) * alpha;
                }
                return;
            }
            var a = this.getCurveValue(time);
            if (alpha == 1)
                color.a = a;
            else {
                if (blend == exports.MixBlend.setup)
                    color.a = slot.data.color.a;
                color.a += (a - color.a) * alpha;
            }
        };
        return AlphaTimeline;
    }(CurveTimeline1));
    /** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting.
     * @public
     * */
    var RGBA2Timeline = /** @class */ (function (_super) {
        __extends(RGBA2Timeline, _super);
        function RGBA2Timeline(frameCount, bezierCount, slotIndex) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex,
                Property.alpha + "|" + slotIndex,
                Property.rgb2 + "|" + slotIndex
            ]) || this;
            _this.slotIndex = 0;
            _this.slotIndex = slotIndex;
            return _this;
        }
        RGBA2Timeline.prototype.getFrameEntries = function () {
            return 8 /*ENTRIES*/;
        };
        /** Sets the time in seconds, light, and dark colors for the specified key frame. */
        RGBA2Timeline.prototype.setFrame = function (frame, time, r, g, b, a, r2, g2, b2) {
            frame <<= 3;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
            this.frames[frame + 4 /*A*/] = a;
            this.frames[frame + 5 /*R2*/] = r2;
            this.frames[frame + 6 /*G2*/] = g2;
            this.frames[frame + 7 /*B2*/] = b2;
        };
        RGBA2Timeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            var frames = this.frames;
            var light = slot.color, dark = slot.darkColor;
            if (time < frames[0]) {
                var setupLight = slot.data.color, setupDark = slot.data.darkColor;
                switch (blend) {
                    case exports.MixBlend.setup:
                        light.setFromColor(setupLight);
                        dark.r = setupDark.r;
                        dark.g = setupDark.g;
                        dark.b = setupDark.b;
                        return;
                    case exports.MixBlend.first:
                        light.add((setupLight.r - light.r) * alpha, (setupLight.g - light.g) * alpha, (setupLight.b - light.b) * alpha, (setupLight.a - light.a) * alpha);
                        dark.r += (setupDark.r - dark.r) * alpha;
                        dark.g += (setupDark.g - dark.g) * alpha;
                        dark.b += (setupDark.b - dark.b) * alpha;
                }
                return;
            }
            var r = 0, g = 0, b = 0, a = 0, r2 = 0, g2 = 0, b2 = 0;
            var i = Timeline.search(frames, time, 8 /*ENTRIES*/);
            var curveType = this.curves[i >> 3];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    r2 = frames[i + 5 /*R2*/];
                    g2 = frames[i + 6 /*G2*/];
                    b2 = frames[i + 7 /*B2*/];
                    var t = (time - before) / (frames[i + 8 /*ENTRIES*/] - before);
                    r += (frames[i + 8 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 8 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 8 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    a += (frames[i + 8 /*ENTRIES*/ + 4 /*A*/] - a) * t;
                    r2 += (frames[i + 8 /*ENTRIES*/ + 5 /*R2*/] - r2) * t;
                    g2 += (frames[i + 8 /*ENTRIES*/ + 6 /*G2*/] - g2) * t;
                    b2 += (frames[i + 8 /*ENTRIES*/ + 7 /*B2*/] - b2) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    a = frames[i + 4 /*A*/];
                    r2 = frames[i + 5 /*R2*/];
                    g2 = frames[i + 6 /*G2*/];
                    b2 = frames[i + 7 /*B2*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    a = this.getBezierValue(time, i, 4 /*A*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
                    r2 = this.getBezierValue(time, i, 5 /*R2*/, curveType + 18 /*BEZIER_SIZE*/ * 4 - 2 /*BEZIER*/);
                    g2 = this.getBezierValue(time, i, 6 /*G2*/, curveType + 18 /*BEZIER_SIZE*/ * 5 - 2 /*BEZIER*/);
                    b2 = this.getBezierValue(time, i, 7 /*B2*/, curveType + 18 /*BEZIER_SIZE*/ * 6 - 2 /*BEZIER*/);
            }
            if (alpha == 1) {
                light.set(r, g, b, a);
                dark.r = r2;
                dark.g = g2;
                dark.b = b2;
            }
            else {
                if (blend == exports.MixBlend.setup) {
                    light.setFromColor(slot.data.color);
                    var setupDark = slot.data.darkColor;
                    dark.r = setupDark.r;
                    dark.g = setupDark.g;
                    dark.b = setupDark.b;
                }
                light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha, (a - light.a) * alpha);
                dark.r += (r2 - dark.r) * alpha;
                dark.g += (g2 - dark.g) * alpha;
                dark.b += (b2 - dark.b) * alpha;
            }
        };
        return RGBA2Timeline;
    }(CurveTimeline));
    /** Changes a slot's {@link Slot#color} and {@link Slot#darkColor} for two color tinting.
     * @public
     * */
    var RGB2Timeline = /** @class */ (function (_super) {
        __extends(RGB2Timeline, _super);
        function RGB2Timeline(frameCount, bezierCount, slotIndex) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.rgb + "|" + slotIndex,
                Property.rgb2 + "|" + slotIndex
            ]) || this;
            _this.slotIndex = 0;
            _this.slotIndex = slotIndex;
            return _this;
        }
        RGB2Timeline.prototype.getFrameEntries = function () {
            return 7 /*ENTRIES*/;
        };
        /** Sets the time in seconds, light, and dark colors for the specified key frame. */
        RGB2Timeline.prototype.setFrame = function (frame, time, r, g, b, r2, g2, b2) {
            frame *= 7 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*R*/] = r;
            this.frames[frame + 2 /*G*/] = g;
            this.frames[frame + 3 /*B*/] = b;
            this.frames[frame + 4 /*R2*/] = r2;
            this.frames[frame + 5 /*G2*/] = g2;
            this.frames[frame + 6 /*B2*/] = b2;
        };
        RGB2Timeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            var frames = this.frames;
            var light = slot.color, dark = slot.darkColor;
            if (time < frames[0]) {
                var setupLight = slot.data.color, setupDark = slot.data.darkColor;
                switch (blend) {
                    case exports.MixBlend.setup:
                        light.r = setupLight.r;
                        light.g = setupLight.g;
                        light.b = setupLight.b;
                        dark.r = setupDark.r;
                        dark.g = setupDark.g;
                        dark.b = setupDark.b;
                        return;
                    case exports.MixBlend.first:
                        light.r += (setupLight.r - light.r) * alpha;
                        light.g += (setupLight.g - light.g) * alpha;
                        light.b += (setupLight.b - light.b) * alpha;
                        dark.r += (setupDark.r - dark.r) * alpha;
                        dark.g += (setupDark.g - dark.g) * alpha;
                        dark.b += (setupDark.b - dark.b) * alpha;
                }
                return;
            }
            var r = 0, g = 0, b = 0, r2 = 0, g2 = 0, b2 = 0;
            var i = Timeline.search(frames, time, 7 /*ENTRIES*/);
            var curveType = this.curves[i / 7 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    r2 = frames[i + 4 /*R2*/];
                    g2 = frames[i + 5 /*G2*/];
                    b2 = frames[i + 6 /*B2*/];
                    var t = (time - before) / (frames[i + 7 /*ENTRIES*/] - before);
                    r += (frames[i + 7 /*ENTRIES*/ + 1 /*R*/] - r) * t;
                    g += (frames[i + 7 /*ENTRIES*/ + 2 /*G*/] - g) * t;
                    b += (frames[i + 7 /*ENTRIES*/ + 3 /*B*/] - b) * t;
                    r2 += (frames[i + 7 /*ENTRIES*/ + 4 /*R2*/] - r2) * t;
                    g2 += (frames[i + 7 /*ENTRIES*/ + 5 /*G2*/] - g2) * t;
                    b2 += (frames[i + 7 /*ENTRIES*/ + 6 /*B2*/] - b2) * t;
                    break;
                case 1 /*STEPPED*/:
                    r = frames[i + 1 /*R*/];
                    g = frames[i + 2 /*G*/];
                    b = frames[i + 3 /*B*/];
                    r2 = frames[i + 4 /*R2*/];
                    g2 = frames[i + 5 /*G2*/];
                    b2 = frames[i + 6 /*B2*/];
                    break;
                default:
                    r = this.getBezierValue(time, i, 1 /*R*/, curveType - 2 /*BEZIER*/);
                    g = this.getBezierValue(time, i, 2 /*G*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    b = this.getBezierValue(time, i, 3 /*B*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    r2 = this.getBezierValue(time, i, 4 /*R2*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
                    g2 = this.getBezierValue(time, i, 5 /*G2*/, curveType + 18 /*BEZIER_SIZE*/ * 4 - 2 /*BEZIER*/);
                    b2 = this.getBezierValue(time, i, 6 /*B2*/, curveType + 18 /*BEZIER_SIZE*/ * 5 - 2 /*BEZIER*/);
            }
            if (alpha == 1) {
                light.r = r;
                light.g = g;
                light.b = b;
                dark.r = r2;
                dark.g = g2;
                dark.b = b2;
            }
            else {
                if (blend == exports.MixBlend.setup) {
                    var setupLight = slot.data.color, setupDark = slot.data.darkColor;
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
        };
        return RGB2Timeline;
    }(CurveTimeline));
    /** Changes a slot's {@link Slot#attachment}.
     * @public
     * */
    var AttachmentTimeline = /** @class */ (function (_super) {
        __extends(AttachmentTimeline, _super);
        function AttachmentTimeline(frameCount, slotIndex) {
            var _this = _super.call(this, frameCount, [
                Property.attachment + "|" + slotIndex
            ]) || this;
            _this.slotIndex = 0;
            _this.slotIndex = slotIndex;
            _this.attachmentNames = new Array(frameCount);
            return _this;
        }
        AttachmentTimeline.prototype.getFrameCount = function () {
            return this.frames.length;
        };
        /** Sets the time in seconds and the attachment name for the specified key frame. */
        AttachmentTimeline.prototype.setFrame = function (frame, time, attachmentName) {
            this.frames[frame] = time;
            this.attachmentNames[frame] = attachmentName;
        };
        AttachmentTimeline.prototype.apply = function (skeleton, lastTime, time, events, alpha, blend, direction) {
            var slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            if (direction == exports.MixDirection.mixOut) {
                if (blend == exports.MixBlend.setup)
                    this.setAttachment(skeleton, slot, slot.data.attachmentName);
                return;
            }
            if (time < this.frames[0]) {
                if (blend == exports.MixBlend.setup || blend == exports.MixBlend.first)
                    this.setAttachment(skeleton, slot, slot.data.attachmentName);
                return;
            }
            this.setAttachment(skeleton, slot, this.attachmentNames[Timeline.search1(this.frames, time)]);
        };
        AttachmentTimeline.prototype.setAttachment = function (skeleton, slot, attachmentName) {
            slot.setAttachment(!attachmentName ? null : skeleton.getAttachment(this.slotIndex, attachmentName));
        };
        return AttachmentTimeline;
    }(Timeline));
    /** Changes a slot's {@link Slot#deform} to deform a {@link VertexAttachment}.
     * @public
     * */
    var DeformTimeline = /** @class */ (function (_super) {
        __extends(DeformTimeline, _super);
        function DeformTimeline(frameCount, bezierCount, slotIndex, attachment) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.deform + "|" + slotIndex + "|" + attachment.id
            ]) || this;
            _this.slotIndex = 0;
            _this.slotIndex = slotIndex;
            _this.attachment = attachment;
            _this.vertices = new Array(frameCount);
            return _this;
        }
        DeformTimeline.prototype.getFrameCount = function () {
            return this.frames.length;
        };
        /** Sets the time in seconds and the vertices for the specified key frame.
         * @param vertices Vertex positions for an unweighted VertexAttachment, or deform offsets if it has weights. */
        DeformTimeline.prototype.setFrame = function (frame, time, vertices) {
            this.frames[frame] = time;
            this.vertices[frame] = vertices;
        };
        /** @param value1 Ignored (0 is used for a deform timeline).
         * @param value2 Ignored (1 is used for a deform timeline). */
        DeformTimeline.prototype.setBezier = function (bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2) {
            var curves = this.curves;
            var i = this.getFrameCount() + bezier * 18 /*BEZIER_SIZE*/;
            if (value == 0)
                curves[frame] = 2 /*BEZIER*/ + i;
            var tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = cy2 * 0.03 - cy1 * 0.06;
            var dddx = ((cx1 - cx2) * 3 - time1 + time2) * 0.006, dddy = (cy1 - cy2 + 0.33333333) * 0.018;
            var ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
            var dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = cy1 * 0.3 + tmpy + dddy * 0.16666667;
            var x = time1 + dx, y = dy;
            for (var n = i + 18 /*BEZIER_SIZE*/; i < n; i += 2) {
                curves[i] = x;
                curves[i + 1] = y;
                dx += ddx;
                dy += ddy;
                ddx += dddx;
                ddy += dddy;
                x += dx;
                y += dy;
            }
        };
        DeformTimeline.prototype.getCurvePercent = function (time, frame) {
            var curves = this.curves;
            var i = curves[frame];
            switch (i) {
                case 0 /*LINEAR*/:
                    var x_3 = this.frames[frame];
                    return (time - x_3) / (this.frames[frame + this.getFrameEntries()] - x_3);
                case 1 /*STEPPED*/:
                    return 0;
            }
            i -= 2 /*BEZIER*/;
            if (curves[i] > time) {
                var x_4 = this.frames[frame];
                return curves[i + 1] * (time - x_4) / (curves[i] - x_4);
            }
            var n = i + 18 /*BEZIER_SIZE*/;
            for (i += 2; i < n; i += 2) {
                if (curves[i] >= time) {
                    var x_5 = curves[i - 2], y_3 = curves[i - 1];
                    return y_3 + (time - x_5) / (curves[i] - x_5) * (curves[i + 1] - y_3);
                }
            }
            var x = curves[n - 2], y = curves[n - 1];
            return y + (1 - y) * (time - x) / (this.frames[frame + this.getFrameEntries()] - x);
        };
        DeformTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            var slot = skeleton.slots[this.slotIndex];
            if (!slot.bone.active)
                return;
            var slotAttachment = slot.getAttachment();
            if (!(slotAttachment instanceof VertexAttachment) || slotAttachment.deformAttachment != this.attachment)
                return;
            var deform = slot.deform;
            if (deform.length == 0)
                blend = exports.MixBlend.setup;
            var vertices = this.vertices;
            var vertexCount = vertices[0].length;
            var frames = this.frames;
            if (time < frames[0]) {
                var vertexAttachment = slotAttachment;
                switch (blend) {
                    case exports.MixBlend.setup:
                        deform.length = 0;
                        return;
                    case exports.MixBlend.first:
                        if (alpha == 1) {
                            deform.length = 0;
                            return;
                        }
                        deform.length = vertexCount;
                        if (!vertexAttachment.bones) {
                            // Unweighted vertex positions.
                            var setupVertices = vertexAttachment.vertices;
                            for (var i = 0; i < vertexCount; i++)
                                deform[i] += (setupVertices[i] - deform[i]) * alpha;
                        }
                        else {
                            // Weighted deform offsets.
                            alpha = 1 - alpha;
                            for (var i = 0; i < vertexCount; i++)
                                deform[i] *= alpha;
                        }
                }
                return;
            }
            deform.length = vertexCount;
            if (time >= frames[frames.length - 1]) { // Time is after last frame.
                var lastVertices = vertices[frames.length - 1];
                if (alpha == 1) {
                    if (blend == exports.MixBlend.add) {
                        var vertexAttachment = slotAttachment;
                        if (!vertexAttachment.bones) {
                            // Unweighted vertex positions, with alpha.
                            var setupVertices = vertexAttachment.vertices;
                            for (var i_1 = 0; i_1 < vertexCount; i_1++)
                                deform[i_1] += lastVertices[i_1] - setupVertices[i_1];
                        }
                        else {
                            // Weighted deform offsets, with alpha.
                            for (var i_2 = 0; i_2 < vertexCount; i_2++)
                                deform[i_2] += lastVertices[i_2];
                        }
                    }
                    else
                        base.Utils.arrayCopy(lastVertices, 0, deform, 0, vertexCount);
                }
                else {
                    switch (blend) {
                        case exports.MixBlend.setup: {
                            var vertexAttachment_1 = slotAttachment;
                            if (!vertexAttachment_1.bones) {
                                // Unweighted vertex positions, with alpha.
                                var setupVertices = vertexAttachment_1.vertices;
                                for (var i_3 = 0; i_3 < vertexCount; i_3++) {
                                    var setup = setupVertices[i_3];
                                    deform[i_3] = setup + (lastVertices[i_3] - setup) * alpha;
                                }
                            }
                            else {
                                // Weighted deform offsets, with alpha.
                                for (var i_4 = 0; i_4 < vertexCount; i_4++)
                                    deform[i_4] = lastVertices[i_4] * alpha;
                            }
                            break;
                        }
                        case exports.MixBlend.first:
                        case exports.MixBlend.replace:
                            for (var i_5 = 0; i_5 < vertexCount; i_5++)
                                deform[i_5] += (lastVertices[i_5] - deform[i_5]) * alpha;
                            break;
                        case exports.MixBlend.add:
                            var vertexAttachment = slotAttachment;
                            if (!vertexAttachment.bones) {
                                // Unweighted vertex positions, with alpha.
                                var setupVertices = vertexAttachment.vertices;
                                for (var i_6 = 0; i_6 < vertexCount; i_6++)
                                    deform[i_6] += (lastVertices[i_6] - setupVertices[i_6]) * alpha;
                            }
                            else {
                                // Weighted deform offsets, with alpha.
                                for (var i_7 = 0; i_7 < vertexCount; i_7++)
                                    deform[i_7] += lastVertices[i_7] * alpha;
                            }
                    }
                }
                return;
            }
            // Interpolate between the previous frame and the current frame.
            var frame = Timeline.search1(frames, time);
            var percent = this.getCurvePercent(time, frame);
            var prevVertices = vertices[frame];
            var nextVertices = vertices[frame + 1];
            if (alpha == 1) {
                if (blend == exports.MixBlend.add) {
                    var vertexAttachment = slotAttachment;
                    if (!vertexAttachment.bones) {
                        // Unweighted vertex positions, with alpha.
                        var setupVertices = vertexAttachment.vertices;
                        for (var i_8 = 0; i_8 < vertexCount; i_8++) {
                            var prev = prevVertices[i_8];
                            deform[i_8] += prev + (nextVertices[i_8] - prev) * percent - setupVertices[i_8];
                        }
                    }
                    else {
                        // Weighted deform offsets, with alpha.
                        for (var i_9 = 0; i_9 < vertexCount; i_9++) {
                            var prev = prevVertices[i_9];
                            deform[i_9] += prev + (nextVertices[i_9] - prev) * percent;
                        }
                    }
                }
                else {
                    for (var i_10 = 0; i_10 < vertexCount; i_10++) {
                        var prev = prevVertices[i_10];
                        deform[i_10] = prev + (nextVertices[i_10] - prev) * percent;
                    }
                }
            }
            else {
                switch (blend) {
                    case exports.MixBlend.setup: {
                        var vertexAttachment_2 = slotAttachment;
                        if (!vertexAttachment_2.bones) {
                            // Unweighted vertex positions, with alpha.
                            var setupVertices = vertexAttachment_2.vertices;
                            for (var i_11 = 0; i_11 < vertexCount; i_11++) {
                                var prev = prevVertices[i_11], setup = setupVertices[i_11];
                                deform[i_11] = setup + (prev + (nextVertices[i_11] - prev) * percent - setup) * alpha;
                            }
                        }
                        else {
                            // Weighted deform offsets, with alpha.
                            for (var i_12 = 0; i_12 < vertexCount; i_12++) {
                                var prev = prevVertices[i_12];
                                deform[i_12] = (prev + (nextVertices[i_12] - prev) * percent) * alpha;
                            }
                        }
                        break;
                    }
                    case exports.MixBlend.first:
                    case exports.MixBlend.replace:
                        for (var i_13 = 0; i_13 < vertexCount; i_13++) {
                            var prev = prevVertices[i_13];
                            deform[i_13] += (prev + (nextVertices[i_13] - prev) * percent - deform[i_13]) * alpha;
                        }
                        break;
                    case exports.MixBlend.add:
                        var vertexAttachment = slotAttachment;
                        if (!vertexAttachment.bones) {
                            // Unweighted vertex positions, with alpha.
                            var setupVertices = vertexAttachment.vertices;
                            for (var i_14 = 0; i_14 < vertexCount; i_14++) {
                                var prev = prevVertices[i_14];
                                deform[i_14] += (prev + (nextVertices[i_14] - prev) * percent - setupVertices[i_14]) * alpha;
                            }
                        }
                        else {
                            // Weighted deform offsets, with alpha.
                            for (var i_15 = 0; i_15 < vertexCount; i_15++) {
                                var prev = prevVertices[i_15];
                                deform[i_15] += (prev + (nextVertices[i_15] - prev) * percent) * alpha;
                            }
                        }
                }
            }
        };
        return DeformTimeline;
    }(CurveTimeline));
    /** Fires an {@link Event} when specific animation times are reached.
     * @public
     * */
    var EventTimeline = /** @class */ (function (_super) {
        __extends(EventTimeline, _super);
        function EventTimeline(frameCount) {
            var _this = _super.call(this, frameCount, EventTimeline.propertyIds) || this;
            _this.events = new Array(frameCount);
            return _this;
        }
        EventTimeline.prototype.getFrameCount = function () {
            return this.frames.length;
        };
        /** Sets the time in seconds and the event for the specified key frame. */
        EventTimeline.prototype.setFrame = function (frame, event) {
            this.frames[frame] = event.time;
            this.events[frame] = event;
        };
        /** Fires events for frames > `lastTime` and <= `time`. */
        EventTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            if (!firedEvents)
                return;
            var frames = this.frames;
            var frameCount = this.frames.length;
            if (lastTime > time) { // Fire events after last time for looped animations.
                this.apply(skeleton, lastTime, Number.MAX_VALUE, firedEvents, alpha, blend, direction);
                lastTime = -1;
            }
            else if (lastTime >= frames[frameCount - 1]) // Last time is after last frame.
                return;
            if (time < frames[0])
                return; // Time is before first frame.
            var i = 0;
            if (lastTime < frames[0])
                i = 0;
            else {
                i = Timeline.search1(frames, lastTime) + 1;
                var frameTime = frames[i];
                while (i > 0) { // Fire multiple events with the same frame.
                    if (frames[i - 1] != frameTime)
                        break;
                    i--;
                }
            }
            for (; i < frameCount && time >= frames[i]; i++)
                firedEvents.push(this.events[i]);
        };
        EventTimeline.propertyIds = ["" + Property.event];
        return EventTimeline;
    }(Timeline));
    /** Changes a skeleton's {@link Skeleton#drawOrder}.
     * @public
     * */
    var DrawOrderTimeline = /** @class */ (function (_super) {
        __extends(DrawOrderTimeline, _super);
        function DrawOrderTimeline(frameCount) {
            var _this = _super.call(this, frameCount, DrawOrderTimeline.propertyIds) || this;
            _this.drawOrders = new Array(frameCount);
            return _this;
        }
        DrawOrderTimeline.prototype.getFrameCount = function () {
            return this.frames.length;
        };
        /** Sets the time in seconds and the draw order for the specified key frame.
         * @param drawOrder For each slot in {@link Skeleton#slots}, the index of the new draw order. May be null to use setup pose
         *           draw order. */
        DrawOrderTimeline.prototype.setFrame = function (frame, time, drawOrder) {
            this.frames[frame] = time;
            this.drawOrders[frame] = drawOrder;
        };
        DrawOrderTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            if (direction == exports.MixDirection.mixOut) {
                if (blend == exports.MixBlend.setup)
                    base.Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
                return;
            }
            if (time < this.frames[0]) {
                if (blend == exports.MixBlend.setup || blend == exports.MixBlend.first)
                    base.Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
                return;
            }
            var drawOrderToSetupIndex = this.drawOrders[Timeline.search1(this.frames, time)];
            if (!drawOrderToSetupIndex)
                base.Utils.arrayCopy(skeleton.slots, 0, skeleton.drawOrder, 0, skeleton.slots.length);
            else {
                var drawOrder = skeleton.drawOrder;
                var slots = skeleton.slots;
                for (var i = 0, n = drawOrderToSetupIndex.length; i < n; i++)
                    drawOrder[i] = slots[drawOrderToSetupIndex[i]];
            }
        };
        DrawOrderTimeline.propertyIds = ["" + Property.drawOrder];
        return DrawOrderTimeline;
    }(Timeline));
    /** Changes an IK constraint's {@link IkConstraint#mix}, {@link IkConstraint#softness},
     * {@link IkConstraint#bendDirection}, {@link IkConstraint#stretch}, and {@link IkConstraint#compress}.
     * @public
     * */
    var IkConstraintTimeline = /** @class */ (function (_super) {
        __extends(IkConstraintTimeline, _super);
        function IkConstraintTimeline(frameCount, bezierCount, ikConstraintIndex) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.ikConstraint + "|" + ikConstraintIndex
            ]) || this;
            _this.ikConstraintIndex = ikConstraintIndex;
            return _this;
        }
        IkConstraintTimeline.prototype.getFrameEntries = function () {
            return 6 /*ENTRIES*/;
        };
        /** Sets the time in seconds, mix, softness, bend direction, compress, and stretch for the specified key frame. */
        IkConstraintTimeline.prototype.setFrame = function (frame, time, mix, softness, bendDirection, compress, stretch) {
            frame *= 6 /*ENTRIES*/;
            this.frames[frame] = time;
            this.frames[frame + 1 /*MIX*/] = mix;
            this.frames[frame + 2 /*SOFTNESS*/] = softness;
            this.frames[frame + 3 /*BEND_DIRECTION*/] = bendDirection;
            this.frames[frame + 4 /*COMPRESS*/] = compress ? 1 : 0;
            this.frames[frame + 5 /*STRETCH*/] = stretch ? 1 : 0;
        };
        IkConstraintTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            var constraint = skeleton.ikConstraints[this.ikConstraintIndex];
            if (!constraint.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.mix = constraint.data.mix;
                        constraint.softness = constraint.data.softness;
                        constraint.bendDirection = constraint.data.bendDirection;
                        constraint.compress = constraint.data.compress;
                        constraint.stretch = constraint.data.stretch;
                        return;
                    case exports.MixBlend.first:
                        constraint.mix += (constraint.data.mix - constraint.mix) * alpha;
                        constraint.softness += (constraint.data.softness - constraint.softness) * alpha;
                        constraint.bendDirection = constraint.data.bendDirection;
                        constraint.compress = constraint.data.compress;
                        constraint.stretch = constraint.data.stretch;
                }
                return;
            }
            var mix = 0, softness = 0;
            var i = Timeline.search(frames, time, 6 /*ENTRIES*/);
            var curveType = this.curves[i / 6 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    mix = frames[i + 1 /*MIX*/];
                    softness = frames[i + 2 /*SOFTNESS*/];
                    var t = (time - before) / (frames[i + 6 /*ENTRIES*/] - before);
                    mix += (frames[i + 6 /*ENTRIES*/ + 1 /*MIX*/] - mix) * t;
                    softness += (frames[i + 6 /*ENTRIES*/ + 2 /*SOFTNESS*/] - softness) * t;
                    break;
                case 1 /*STEPPED*/:
                    mix = frames[i + 1 /*MIX*/];
                    softness = frames[i + 2 /*SOFTNESS*/];
                    break;
                default:
                    mix = this.getBezierValue(time, i, 1 /*MIX*/, curveType - 2 /*BEZIER*/);
                    softness = this.getBezierValue(time, i, 2 /*SOFTNESS*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
            }
            if (blend == exports.MixBlend.setup) {
                constraint.mix = constraint.data.mix + (mix - constraint.data.mix) * alpha;
                constraint.softness = constraint.data.softness + (softness - constraint.data.softness) * alpha;
                if (direction == exports.MixDirection.mixOut) {
                    constraint.bendDirection = constraint.data.bendDirection;
                    constraint.compress = constraint.data.compress;
                    constraint.stretch = constraint.data.stretch;
                }
                else {
                    constraint.bendDirection = frames[i + 3 /*BEND_DIRECTION*/];
                    constraint.compress = frames[i + 4 /*COMPRESS*/] != 0;
                    constraint.stretch = frames[i + 5 /*STRETCH*/] != 0;
                }
            }
            else {
                constraint.mix += (mix - constraint.mix) * alpha;
                constraint.softness += (softness - constraint.softness) * alpha;
                if (direction == exports.MixDirection.mixIn) {
                    constraint.bendDirection = frames[i + 3 /*BEND_DIRECTION*/];
                    constraint.compress = frames[i + 4 /*COMPRESS*/] != 0;
                    constraint.stretch = frames[i + 5 /*STRETCH*/] != 0;
                }
            }
        };
        return IkConstraintTimeline;
    }(CurveTimeline));
    /** Changes a transform constraint's {@link TransformConstraint#rotateMix}, {@link TransformConstraint#translateMix},
     * {@link TransformConstraint#scaleMix}, and {@link TransformConstraint#shearMix}.
     * @public
     * */
    var TransformConstraintTimeline = /** @class */ (function (_super) {
        __extends(TransformConstraintTimeline, _super);
        function TransformConstraintTimeline(frameCount, bezierCount, transformConstraintIndex) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.transformConstraint + "|" + transformConstraintIndex
            ]) || this;
            _this.transformConstraintIndex = transformConstraintIndex;
            return _this;
        }
        TransformConstraintTimeline.prototype.getFrameEntries = function () {
            return 7 /*ENTRIES*/;
        };
        /** The time in seconds, rotate mix, translate mix, scale mix, and shear mix for the specified key frame. */
        TransformConstraintTimeline.prototype.setFrame = function (frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY) {
            var frames = this.frames;
            frame *= 7 /*ENTRIES*/;
            frames[frame] = time;
            frames[frame + 1 /*ROTATE*/] = mixRotate;
            frames[frame + 2 /*X*/] = mixX;
            frames[frame + 3 /*Y*/] = mixY;
            frames[frame + 4 /*SCALEX*/] = mixScaleX;
            frames[frame + 5 /*SCALEY*/] = mixScaleY;
            frames[frame + 6 /*SHEARY*/] = mixShearY;
        };
        TransformConstraintTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            var constraint = skeleton.transformConstraints[this.transformConstraintIndex];
            if (!constraint.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                var data = constraint.data;
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.mixRotate = data.mixRotate;
                        constraint.mixX = data.mixX;
                        constraint.mixY = data.mixY;
                        constraint.mixScaleX = data.mixScaleX;
                        constraint.mixScaleY = data.mixScaleY;
                        constraint.mixShearY = data.mixShearY;
                        return;
                    case exports.MixBlend.first:
                        constraint.mixRotate += (data.mixRotate - constraint.mixRotate) * alpha;
                        constraint.mixX += (data.mixX - constraint.mixX) * alpha;
                        constraint.mixY += (data.mixY - constraint.mixY) * alpha;
                        constraint.mixScaleX += (data.mixScaleX - constraint.mixScaleX) * alpha;
                        constraint.mixScaleY += (data.mixScaleY - constraint.mixScaleY) * alpha;
                        constraint.mixShearY += (data.mixShearY - constraint.mixShearY) * alpha;
                }
                return;
            }
            var rotate, x, y, scaleX, scaleY, shearY;
            var i = Timeline.search(frames, time, 7 /*ENTRIES*/);
            var curveType = this.curves[i / 7 /*ENTRIES*/];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    scaleX = frames[i + 4 /*SCALEX*/];
                    scaleY = frames[i + 5 /*SCALEY*/];
                    shearY = frames[i + 6 /*SHEARY*/];
                    var t = (time - before) / (frames[i + 7 /*ENTRIES*/] - before);
                    rotate += (frames[i + 7 /*ENTRIES*/ + 1 /*ROTATE*/] - rotate) * t;
                    x += (frames[i + 7 /*ENTRIES*/ + 2 /*X*/] - x) * t;
                    y += (frames[i + 7 /*ENTRIES*/ + 3 /*Y*/] - y) * t;
                    scaleX += (frames[i + 7 /*ENTRIES*/ + 4 /*SCALEX*/] - scaleX) * t;
                    scaleY += (frames[i + 7 /*ENTRIES*/ + 5 /*SCALEY*/] - scaleY) * t;
                    shearY += (frames[i + 7 /*ENTRIES*/ + 6 /*SHEARY*/] - shearY) * t;
                    break;
                case 1 /*STEPPED*/:
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    scaleX = frames[i + 4 /*SCALEX*/];
                    scaleY = frames[i + 5 /*SCALEY*/];
                    shearY = frames[i + 6 /*SHEARY*/];
                    break;
                default:
                    rotate = this.getBezierValue(time, i, 1 /*ROTATE*/, curveType - 2 /*BEZIER*/);
                    x = this.getBezierValue(time, i, 2 /*X*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 3 /*Y*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
                    scaleX = this.getBezierValue(time, i, 4 /*SCALEX*/, curveType + 18 /*BEZIER_SIZE*/ * 3 - 2 /*BEZIER*/);
                    scaleY = this.getBezierValue(time, i, 5 /*SCALEY*/, curveType + 18 /*BEZIER_SIZE*/ * 4 - 2 /*BEZIER*/);
                    shearY = this.getBezierValue(time, i, 6 /*SHEARY*/, curveType + 18 /*BEZIER_SIZE*/ * 5 - 2 /*BEZIER*/);
            }
            if (blend == exports.MixBlend.setup) {
                var data = constraint.data;
                constraint.mixRotate = data.mixRotate + (rotate - data.mixRotate) * alpha;
                constraint.mixX = data.mixX + (x - data.mixX) * alpha;
                constraint.mixY = data.mixY + (y - data.mixY) * alpha;
                constraint.mixScaleX = data.mixScaleX + (scaleX - data.mixScaleX) * alpha;
                constraint.mixScaleY = data.mixScaleY + (scaleY - data.mixScaleY) * alpha;
                constraint.mixShearY = data.mixShearY + (shearY - data.mixShearY) * alpha;
            }
            else {
                constraint.mixRotate += (rotate - constraint.mixRotate) * alpha;
                constraint.mixX += (x - constraint.mixX) * alpha;
                constraint.mixY += (y - constraint.mixY) * alpha;
                constraint.mixScaleX += (scaleX - constraint.mixScaleX) * alpha;
                constraint.mixScaleY += (scaleY - constraint.mixScaleY) * alpha;
                constraint.mixShearY += (shearY - constraint.mixShearY) * alpha;
            }
        };
        return TransformConstraintTimeline;
    }(CurveTimeline));
    /** Changes a path constraint's {@link PathConstraint#position}.
     * @public
     * */
    var PathConstraintPositionTimeline = /** @class */ (function (_super) {
        __extends(PathConstraintPositionTimeline, _super);
        function PathConstraintPositionTimeline(frameCount, bezierCount, pathConstraintIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.pathConstraintPosition + "|" + pathConstraintIndex) || this;
            _this.pathConstraintIndex = pathConstraintIndex;
            return _this;
        }
        PathConstraintPositionTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            var constraint = skeleton.pathConstraints[this.pathConstraintIndex];
            if (!constraint.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.position = constraint.data.position;
                        return;
                    case exports.MixBlend.first:
                        constraint.position += (constraint.data.position - constraint.position) * alpha;
                }
                return;
            }
            var position = this.getCurveValue(time);
            if (blend == exports.MixBlend.setup)
                constraint.position = constraint.data.position + (position - constraint.data.position) * alpha;
            else
                constraint.position += (position - constraint.position) * alpha;
        };
        return PathConstraintPositionTimeline;
    }(CurveTimeline1));
    /** Changes a path constraint's {@link PathConstraint#spacing}.
     * @public
     * */
    var PathConstraintSpacingTimeline = /** @class */ (function (_super) {
        __extends(PathConstraintSpacingTimeline, _super);
        function PathConstraintSpacingTimeline(frameCount, bezierCount, pathConstraintIndex) {
            var _this = _super.call(this, frameCount, bezierCount, Property.pathConstraintSpacing + "|" + pathConstraintIndex) || this;
            /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
            _this.pathConstraintIndex = 0;
            _this.pathConstraintIndex = pathConstraintIndex;
            return _this;
        }
        PathConstraintSpacingTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            var constraint = skeleton.pathConstraints[this.pathConstraintIndex];
            if (!constraint.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.spacing = constraint.data.spacing;
                        return;
                    case exports.MixBlend.first:
                        constraint.spacing += (constraint.data.spacing - constraint.spacing) * alpha;
                }
                return;
            }
            var spacing = this.getCurveValue(time);
            if (blend == exports.MixBlend.setup)
                constraint.spacing = constraint.data.spacing + (spacing - constraint.data.spacing) * alpha;
            else
                constraint.spacing += (spacing - constraint.spacing) * alpha;
        };
        return PathConstraintSpacingTimeline;
    }(CurveTimeline1));
    /** Changes a transform constraint's {@link PathConstraint#getMixRotate()}, {@link PathConstraint#getMixX()}, and
     * {@link PathConstraint#getMixY()}.
     * @public
     * */
    var PathConstraintMixTimeline = /** @class */ (function (_super) {
        __extends(PathConstraintMixTimeline, _super);
        function PathConstraintMixTimeline(frameCount, bezierCount, pathConstraintIndex) {
            var _this = _super.call(this, frameCount, bezierCount, [
                Property.pathConstraintMix + "|" + pathConstraintIndex
            ]) || this;
            /** The index of the path constraint slot in {@link Skeleton#getPathConstraints()} that will be changed. */
            _this.pathConstraintIndex = 0;
            _this.pathConstraintIndex = pathConstraintIndex;
            return _this;
        }
        PathConstraintMixTimeline.prototype.getFrameEntries = function () {
            return 4 /*ENTRIES*/;
        };
        PathConstraintMixTimeline.prototype.setFrame = function (frame, time, mixRotate, mixX, mixY) {
            var frames = this.frames;
            frame <<= 2;
            frames[frame] = time;
            frames[frame + 1 /*ROTATE*/] = mixRotate;
            frames[frame + 2 /*X*/] = mixX;
            frames[frame + 3 /*Y*/] = mixY;
        };
        PathConstraintMixTimeline.prototype.apply = function (skeleton, lastTime, time, firedEvents, alpha, blend, direction) {
            var constraint = skeleton.pathConstraints[this.pathConstraintIndex];
            if (!constraint.active)
                return;
            var frames = this.frames;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        constraint.mixRotate = constraint.data.mixRotate;
                        constraint.mixX = constraint.data.mixX;
                        constraint.mixY = constraint.data.mixY;
                        return;
                    case exports.MixBlend.first:
                        constraint.mixRotate += (constraint.data.mixRotate - constraint.mixRotate) * alpha;
                        constraint.mixX += (constraint.data.mixX - constraint.mixX) * alpha;
                        constraint.mixY += (constraint.data.mixY - constraint.mixY) * alpha;
                }
                return;
            }
            var rotate, x, y;
            var i = Timeline.search(frames, time, 4 /*ENTRIES*/);
            var curveType = this.curves[i >> 2];
            switch (curveType) {
                case 0 /*LINEAR*/:
                    var before = frames[i];
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    var t = (time - before) / (frames[i + 4 /*ENTRIES*/] - before);
                    rotate += (frames[i + 4 /*ENTRIES*/ + 1 /*ROTATE*/] - rotate) * t;
                    x += (frames[i + 4 /*ENTRIES*/ + 2 /*X*/] - x) * t;
                    y += (frames[i + 4 /*ENTRIES*/ + 3 /*Y*/] - y) * t;
                    break;
                case 1 /*STEPPED*/:
                    rotate = frames[i + 1 /*ROTATE*/];
                    x = frames[i + 2 /*X*/];
                    y = frames[i + 3 /*Y*/];
                    break;
                default:
                    rotate = this.getBezierValue(time, i, 1 /*ROTATE*/, curveType - 2 /*BEZIER*/);
                    x = this.getBezierValue(time, i, 2 /*X*/, curveType + 18 /*BEZIER_SIZE*/ - 2 /*BEZIER*/);
                    y = this.getBezierValue(time, i, 3 /*Y*/, curveType + 18 /*BEZIER_SIZE*/ * 2 - 2 /*BEZIER*/);
            }
            if (blend == exports.MixBlend.setup) {
                var data = constraint.data;
                constraint.mixRotate = data.mixRotate + (rotate - data.mixRotate) * alpha;
                constraint.mixX = data.mixX + (x - data.mixX) * alpha;
                constraint.mixY = data.mixY + (y - data.mixY) * alpha;
            }
            else {
                constraint.mixRotate += (rotate - constraint.mixRotate) * alpha;
                constraint.mixX += (x - constraint.mixX) * alpha;
                constraint.mixY += (y - constraint.mixY) * alpha;
            }
        };
        return PathConstraintMixTimeline;
    }(CurveTimeline));

    /** Applies animations over time, queues animations for later playback, mixes (crossfading) between animations, and applies
     * multiple animations on top of each other (layering).
     *
     * See [Applying Animations](http://esotericsoftware.com/spine-applying-animations/) in the Spine Runtimes Guide.
     * @public
     * */
    var AnimationState = /** @class */ (function () {
        function AnimationState(data) {
            /** The list of tracks that currently have animations, which may contain null entries. */
            this.tracks = new Array();
            /** Multiplier for the delta time when the animation state is updated, causing time for all animations and mixes to play slower
             * or faster. Defaults to 1.
             *
             * See TrackEntry {@link TrackEntry#timeScale} for affecting a single animation. */
            this.timeScale = 1;
            this.unkeyedState = 0;
            this.events = new Array();
            this.listeners = new Array();
            this.queue = new EventQueue(this);
            this.propertyIDs = new base.StringSet();
            this.animationsChanged = false;
            this.trackEntryPool = new base.Pool(function () { return new TrackEntry(); });
            this.data = data;
        }
        AnimationState.emptyAnimation = function () {
            if (!_emptyAnimation)
                _emptyAnimation = new Animation("<empty>", [], 0);
            return _emptyAnimation;
        };
        /** Increments each track entry {@link TrackEntry#trackTime()}, setting queued animations as current if needed. */
        AnimationState.prototype.update = function (delta) {
            delta *= this.timeScale;
            var tracks = this.tracks;
            for (var i = 0, n = tracks.length; i < n; i++) {
                var current = tracks[i];
                if (!current)
                    continue;
                current.animationLast = current.nextAnimationLast;
                current.trackLast = current.nextTrackLast;
                var currentDelta = delta * current.timeScale;
                if (current.delay > 0) {
                    current.delay -= currentDelta;
                    if (current.delay > 0)
                        continue;
                    currentDelta = -current.delay;
                    current.delay = 0;
                }
                var next = current.next;
                if (next) {
                    // When the next entry's delay is passed, change to the next entry, preserving leftover time.
                    var nextTime = current.trackLast - next.delay;
                    if (nextTime >= 0) {
                        next.delay = 0;
                        next.trackTime += current.timeScale == 0 ? 0 : (nextTime / current.timeScale + delta) * next.timeScale;
                        current.trackTime += currentDelta;
                        this.setCurrent(i, next, true);
                        while (next.mixingFrom) {
                            next.mixTime += delta;
                            next = next.mixingFrom;
                        }
                        continue;
                    }
                }
                else if (current.trackLast >= current.trackEnd && !current.mixingFrom) {
                    tracks[i] = null;
                    this.queue.end(current);
                    this.clearNext(current);
                    continue;
                }
                if (current.mixingFrom && this.updateMixingFrom(current, delta)) {
                    // End mixing from entries once all have completed.
                    var from = current.mixingFrom;
                    current.mixingFrom = null;
                    if (from)
                        from.mixingTo = null;
                    while (from) {
                        this.queue.end(from);
                        from = from.mixingFrom;
                    }
                }
                current.trackTime += currentDelta;
            }
            this.queue.drain();
        };
        /** Returns true when all mixing from entries are complete. */
        AnimationState.prototype.updateMixingFrom = function (to, delta) {
            var from = to.mixingFrom;
            if (!from)
                return true;
            var finished = this.updateMixingFrom(from, delta);
            from.animationLast = from.nextAnimationLast;
            from.trackLast = from.nextTrackLast;
            // Require mixTime > 0 to ensure the mixing from entry was applied at least once.
            if (to.mixTime > 0 && to.mixTime >= to.mixDuration) {
                // Require totalAlpha == 0 to ensure mixing is complete, unless mixDuration == 0 (the transition is a single frame).
                if (from.totalAlpha == 0 || to.mixDuration == 0) {
                    to.mixingFrom = from.mixingFrom;
                    if (from.mixingFrom)
                        from.mixingFrom.mixingTo = to;
                    to.interruptAlpha = from.interruptAlpha;
                    this.queue.end(from);
                }
                return finished;
            }
            from.trackTime += delta * from.timeScale;
            to.mixTime += delta;
            return false;
        };
        /** Poses the skeleton using the track entry animations. There are no side effects other than invoking listeners, so the
         * animation state can be applied to multiple skeletons to pose them identically.
         * @returns True if any animations were applied. */
        AnimationState.prototype.apply = function (skeleton) {
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            if (this.animationsChanged)
                this._animationsChanged();
            var events = this.events;
            var tracks = this.tracks;
            var applied = false;
            for (var i_1 = 0, n_1 = tracks.length; i_1 < n_1; i_1++) {
                var current = tracks[i_1];
                if (!current || current.delay > 0)
                    continue;
                applied = true;
                var blend = i_1 == 0 ? exports.MixBlend.first : current.mixBlend;
                // Apply mixing from entries first.
                var mix = current.alpha;
                if (current.mixingFrom)
                    mix *= this.applyMixingFrom(current, skeleton, blend);
                else if (current.trackTime >= current.trackEnd && !current.next)
                    mix = 0;
                // Apply current entry.
                var animationLast = current.animationLast, animationTime = current.getAnimationTime(), applyTime = animationTime;
                var applyEvents = events;
                if (current.reverse) {
                    applyTime = current.animation.duration - applyTime;
                    applyEvents = null;
                }
                var timelines = current.animation.timelines;
                var timelineCount = timelines.length;
                if ((i_1 == 0 && mix == 1) || blend == exports.MixBlend.add) {
                    for (var ii = 0; ii < timelineCount; ii++) {
                        // Fixes issue #302 on IOS9 where mix, blend sometimes became undefined and caused assets
                        // to sometimes stop rendering when using color correction, as their RGBA values become NaN.
                        // (https://github.com/pixijs/pixi-spine/issues/302)
                        base.Utils.webkit602BugfixHelper(mix, blend);
                        var timeline = timelines[ii];
                        if (timeline instanceof AttachmentTimeline)
                            this.applyAttachmentTimeline(timeline, skeleton, applyTime, blend, true);
                        else
                            timeline.apply(skeleton, animationLast, applyTime, applyEvents, mix, blend, exports.MixDirection.mixIn);
                    }
                }
                else {
                    var timelineMode = current.timelineMode;
                    var firstFrame = current.timelinesRotation.length != timelineCount << 1;
                    if (firstFrame)
                        current.timelinesRotation.length = timelineCount << 1;
                    for (var ii = 0; ii < timelineCount; ii++) {
                        var timeline_1 = timelines[ii];
                        var timelineBlend = timelineMode[ii] == SUBSEQUENT ? blend : exports.MixBlend.setup;
                        if (timeline_1 instanceof RotateTimeline) {
                            this.applyRotateTimeline(timeline_1, skeleton, applyTime, mix, timelineBlend, current.timelinesRotation, ii << 1, firstFrame);
                        }
                        else if (timeline_1 instanceof AttachmentTimeline) {
                            this.applyAttachmentTimeline(timeline_1, skeleton, applyTime, blend, true);
                        }
                        else {
                            // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                            base.Utils.webkit602BugfixHelper(mix, blend);
                            timeline_1.apply(skeleton, animationLast, applyTime, applyEvents, mix, timelineBlend, exports.MixDirection.mixIn);
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
            var setupState = this.unkeyedState + SETUP;
            var slots = skeleton.slots;
            for (var i = 0, n = skeleton.slots.length; i < n; i++) {
                var slot = slots[i];
                if (slot.attachmentState == setupState) {
                    var attachmentName = slot.data.attachmentName;
                    slot.setAttachment(!attachmentName ? null : skeleton.getAttachment(slot.data.index, attachmentName));
                }
            }
            this.unkeyedState += 2; // Increasing after each use avoids the need to reset attachmentState for every slot.
            this.queue.drain();
            return applied;
        };
        AnimationState.prototype.applyMixingFrom = function (to, skeleton, blend) {
            var from = to.mixingFrom;
            if (from.mixingFrom)
                this.applyMixingFrom(from, skeleton, blend);
            var mix = 0;
            if (to.mixDuration == 0) { // Single frame mix to undo mixingFrom changes.
                mix = 1;
                if (blend == exports.MixBlend.first)
                    blend = exports.MixBlend.setup;
            }
            else {
                mix = to.mixTime / to.mixDuration;
                if (mix > 1)
                    mix = 1;
                if (blend != exports.MixBlend.first)
                    blend = from.mixBlend;
            }
            var attachments = mix < from.attachmentThreshold, drawOrder = mix < from.drawOrderThreshold;
            var timelines = from.animation.timelines;
            var timelineCount = timelines.length;
            var alphaHold = from.alpha * to.interruptAlpha, alphaMix = alphaHold * (1 - mix);
            var animationLast = from.animationLast, animationTime = from.getAnimationTime(), applyTime = animationTime;
            var events = null;
            if (from.reverse)
                applyTime = from.animation.duration - applyTime;
            else if (mix < from.eventThreshold)
                events = this.events;
            if (blend == exports.MixBlend.add) {
                for (var i = 0; i < timelineCount; i++)
                    timelines[i].apply(skeleton, animationLast, applyTime, events, alphaMix, blend, exports.MixDirection.mixOut);
            }
            else {
                var timelineMode = from.timelineMode;
                var timelineHoldMix = from.timelineHoldMix;
                var firstFrame = from.timelinesRotation.length != timelineCount << 1;
                if (firstFrame)
                    from.timelinesRotation.length = timelineCount << 1;
                from.totalAlpha = 0;
                for (var i = 0; i < timelineCount; i++) {
                    var timeline = timelines[i];
                    var direction = exports.MixDirection.mixOut;
                    var timelineBlend = void 0;
                    var alpha = 0;
                    switch (timelineMode[i]) {
                        case SUBSEQUENT:
                            if (!drawOrder && timeline instanceof DrawOrderTimeline)
                                continue;
                            timelineBlend = blend;
                            alpha = alphaMix;
                            break;
                        case FIRST:
                            timelineBlend = exports.MixBlend.setup;
                            alpha = alphaMix;
                            break;
                        case HOLD_SUBSEQUENT:
                            timelineBlend = blend;
                            alpha = alphaHold;
                            break;
                        case HOLD_FIRST:
                            timelineBlend = exports.MixBlend.setup;
                            alpha = alphaHold;
                            break;
                        default:
                            timelineBlend = exports.MixBlend.setup;
                            var holdMix = timelineHoldMix[i];
                            alpha = alphaHold * Math.max(0, 1 - holdMix.mixTime / holdMix.mixDuration);
                            break;
                    }
                    from.totalAlpha += alpha;
                    if (timeline instanceof RotateTimeline)
                        this.applyRotateTimeline(timeline, skeleton, applyTime, alpha, timelineBlend, from.timelinesRotation, i << 1, firstFrame);
                    else if (timeline instanceof AttachmentTimeline)
                        this.applyAttachmentTimeline(timeline, skeleton, applyTime, timelineBlend, attachments);
                    else {
                        // This fixes the WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
                        base.Utils.webkit602BugfixHelper(alpha, blend);
                        if (drawOrder && timeline instanceof DrawOrderTimeline && timelineBlend == exports.MixBlend.setup)
                            direction = exports.MixDirection.mixIn;
                        timeline.apply(skeleton, animationLast, applyTime, events, alpha, timelineBlend, direction);
                    }
                }
            }
            if (to.mixDuration > 0)
                this.queueEvents(from, animationTime);
            this.events.length = 0;
            from.nextAnimationLast = animationTime;
            from.nextTrackLast = from.trackTime;
            return mix;
        };
        AnimationState.prototype.applyAttachmentTimeline = function (timeline, skeleton, time, blend, attachments) {
            var slot = skeleton.slots[timeline.slotIndex];
            if (!slot.bone.active)
                return;
            if (time < timeline.frames[0]) { // Time is before first frame.
                if (blend == exports.MixBlend.setup || blend == exports.MixBlend.first)
                    this.setAttachment(skeleton, slot, slot.data.attachmentName, attachments);
            }
            else
                this.setAttachment(skeleton, slot, timeline.attachmentNames[Timeline.search1(timeline.frames, time)], attachments);
            // If an attachment wasn't set (ie before the first frame or attachments is false), set the setup attachment later.
            if (slot.attachmentState <= this.unkeyedState)
                slot.attachmentState = this.unkeyedState + SETUP;
        };
        AnimationState.prototype.setAttachment = function (skeleton, slot, attachmentName, attachments) {
            slot.setAttachment(!attachmentName ? null : skeleton.getAttachment(slot.data.index, attachmentName));
            if (attachments)
                slot.attachmentState = this.unkeyedState + CURRENT;
        };
        AnimationState.prototype.applyRotateTimeline = function (timeline, skeleton, time, alpha, blend, timelinesRotation, i, firstFrame) {
            if (firstFrame)
                timelinesRotation[i] = 0;
            if (alpha == 1) {
                timeline.apply(skeleton, 0, time, null, 1, blend, exports.MixDirection.mixIn);
                return;
            }
            var bone = skeleton.bones[timeline.boneIndex];
            if (!bone.active)
                return;
            var frames = timeline.frames;
            var r1 = 0, r2 = 0;
            if (time < frames[0]) {
                switch (blend) {
                    case exports.MixBlend.setup:
                        bone.rotation = bone.data.rotation;
                    default:
                        return;
                    case exports.MixBlend.first:
                        r1 = bone.rotation;
                        r2 = bone.data.rotation;
                }
            }
            else {
                r1 = blend == exports.MixBlend.setup ? bone.data.rotation : bone.rotation;
                r2 = bone.data.rotation + timeline.getCurveValue(time);
            }
            // Mix between rotations using the direction of the shortest route on the first frame while detecting crosses.
            var total = 0, diff = r2 - r1;
            diff -= (16384 - ((16384.499999999996 - diff / 360) | 0)) * 360;
            if (diff == 0) {
                total = timelinesRotation[i];
            }
            else {
                var lastTotal = 0, lastDiff = 0;
                if (firstFrame) {
                    lastTotal = 0;
                    lastDiff = diff;
                }
                else {
                    lastTotal = timelinesRotation[i]; // Angle and direction of mix, including loops.
                    lastDiff = timelinesRotation[i + 1]; // Difference between bones.
                }
                var current = diff > 0, dir = lastTotal >= 0;
                // Detect cross at 0 (not 180).
                if (base.MathUtils.signum(lastDiff) != base.MathUtils.signum(diff) && Math.abs(lastDiff) <= 90) {
                    // A cross after a 360 rotation is a loop.
                    if (Math.abs(lastTotal) > 180)
                        lastTotal += 360 * base.MathUtils.signum(lastTotal);
                    dir = current;
                }
                total = diff + lastTotal - lastTotal % 360; // Store loops as part of lastTotal.
                if (dir != current)
                    total += 360 * base.MathUtils.signum(lastTotal);
                timelinesRotation[i] = total;
            }
            timelinesRotation[i + 1] = diff;
            bone.rotation = r1 + total * alpha;
        };
        AnimationState.prototype.queueEvents = function (entry, animationTime) {
            var animationStart = entry.animationStart, animationEnd = entry.animationEnd;
            var duration = animationEnd - animationStart;
            var trackLastWrapped = entry.trackLast % duration;
            // Queue events before complete.
            var events = this.events;
            var i = 0, n = events.length;
            for (; i < n; i++) {
                var event_1 = events[i];
                if (event_1.time < trackLastWrapped)
                    break;
                if (event_1.time > animationEnd)
                    continue; // Discard events outside animation start/end.
                this.queue.event(entry, event_1);
            }
            // Queue complete if completed a loop iteration or the animation.
            var complete = false;
            if (entry.loop)
                complete = duration == 0 || trackLastWrapped > entry.trackTime % duration;
            else
                complete = animationTime >= animationEnd && entry.animationLast < animationEnd;
            if (complete)
                this.queue.complete(entry);
            // Queue events after complete.
            for (; i < n; i++) {
                var event_2 = events[i];
                if (event_2.time < animationStart)
                    continue; // Discard events outside animation start/end.
                this.queue.event(entry, event_2);
            }
        };
        /** Removes all animations from all tracks, leaving skeletons in their current pose.
         *
         * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
         * rather than leaving them in their current pose. */
        AnimationState.prototype.clearTracks = function () {
            var oldDrainDisabled = this.queue.drainDisabled;
            this.queue.drainDisabled = true;
            for (var i = 0, n = this.tracks.length; i < n; i++)
                this.clearTrack(i);
            this.tracks.length = 0;
            this.queue.drainDisabled = oldDrainDisabled;
            this.queue.drain();
        };
        /** Removes all animations from the track, leaving skeletons in their current pose.
         *
         * It may be desired to use {@link AnimationState#setEmptyAnimation()} to mix the skeletons back to the setup pose,
         * rather than leaving them in their current pose. */
        AnimationState.prototype.clearTrack = function (trackIndex) {
            if (trackIndex >= this.tracks.length)
                return;
            var current = this.tracks[trackIndex];
            if (!current)
                return;
            this.queue.end(current);
            this.clearNext(current);
            var entry = current;
            while (true) {
                var from = entry.mixingFrom;
                if (!from)
                    break;
                this.queue.end(from);
                entry.mixingFrom = null;
                entry.mixingTo = null;
                entry = from;
            }
            this.tracks[current.trackIndex] = null;
            this.queue.drain();
        };
        AnimationState.prototype.setCurrent = function (index, current, interrupt) {
            var from = this.expandToIndex(index);
            this.tracks[index] = current;
            current.previous = null;
            if (from) {
                if (interrupt)
                    this.queue.interrupt(from);
                current.mixingFrom = from;
                from.mixingTo = current;
                current.mixTime = 0;
                // Store the interrupted mix percentage.
                if (from.mixingFrom && from.mixDuration > 0)
                    current.interruptAlpha *= Math.min(1, from.mixTime / from.mixDuration);
                from.timelinesRotation.length = 0; // Reset rotation for mixing out, in case entry was mixed in.
            }
            this.queue.start(current);
        };
        /** Sets an animation by name.
         *
         * See {@link #setAnimationWith()}. */
        AnimationState.prototype.setAnimation = function (trackIndex, animationName, loop) {
            if (loop === void 0) { loop = false; }
            var animation = this.data.skeletonData.findAnimation(animationName);
            if (!animation)
                throw new Error("Animation not found: " + animationName);
            return this.setAnimationWith(trackIndex, animation, loop);
        };
        /** Sets the current animation for a track, discarding any queued animations. If the formerly current track entry was never
         * applied to a skeleton, it is replaced (not mixed from).
         * @param loop If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
         *           duration. In either case {@link TrackEntry#trackEnd} determines when the track is cleared.
         * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
         *         after the {@link AnimationStateListener#dispose()} event occurs. */
        AnimationState.prototype.setAnimationWith = function (trackIndex, animation, loop) {
            if (loop === void 0) { loop = false; }
            if (!animation)
                throw new Error("animation cannot be null.");
            var interrupt = true;
            var current = this.expandToIndex(trackIndex);
            if (current) {
                if (current.nextTrackLast == -1) {
                    // Don't mix from an entry that was never applied.
                    this.tracks[trackIndex] = current.mixingFrom;
                    this.queue.interrupt(current);
                    this.queue.end(current);
                    this.clearNext(current);
                    current = current.mixingFrom;
                    interrupt = false;
                }
                else
                    this.clearNext(current);
            }
            var entry = this.trackEntry(trackIndex, animation, loop, current);
            this.setCurrent(trackIndex, entry, interrupt);
            this.queue.drain();
            return entry;
        };
        /** Queues an animation by name.
         *
         * See {@link #addAnimationWith()}. */
        AnimationState.prototype.addAnimation = function (trackIndex, animationName, loop, delay) {
            if (loop === void 0) { loop = false; }
            if (delay === void 0) { delay = 0; }
            var animation = this.data.skeletonData.findAnimation(animationName);
            if (!animation)
                throw new Error("Animation not found: " + animationName);
            return this.addAnimationWith(trackIndex, animation, loop, delay);
        };
        /** Adds an animation to be played after the current or last queued animation for a track. If the track is empty, it is
         * equivalent to calling {@link #setAnimationWith()}.
         * @param delay If > 0, sets {@link TrackEntry#delay}. If <= 0, the delay set is the duration of the previous track entry
         *           minus any mix duration (from the {@link AnimationStateData}) plus the specified `delay` (ie the mix
         *           ends at (`delay` = 0) or before (`delay` < 0) the previous track entry duration). If the
         *           previous entry is looping, its next loop completion is used instead of its duration.
         * @returns A track entry to allow further customization of animation playback. References to the track entry must not be kept
         *         after the {@link AnimationStateListener#dispose()} event occurs. */
        AnimationState.prototype.addAnimationWith = function (trackIndex, animation, loop, delay) {
            if (loop === void 0) { loop = false; }
            if (delay === void 0) { delay = 0; }
            if (!animation)
                throw new Error("animation cannot be null.");
            var last = this.expandToIndex(trackIndex);
            if (last) {
                while (last.next)
                    last = last.next;
            }
            var entry = this.trackEntry(trackIndex, animation, loop, last);
            if (!last) {
                this.setCurrent(trackIndex, entry, true);
                this.queue.drain();
            }
            else {
                last.next = entry;
                entry.previous = last;
                if (delay <= 0)
                    delay += last.getTrackComplete() - entry.mixDuration;
            }
            entry.delay = delay;
            return entry;
        };
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
        AnimationState.prototype.setEmptyAnimation = function (trackIndex, mixDuration) {
            if (mixDuration === void 0) { mixDuration = 0; }
            var entry = this.setAnimationWith(trackIndex, AnimationState.emptyAnimation(), false);
            entry.mixDuration = mixDuration;
            entry.trackEnd = mixDuration;
            return entry;
        };
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
        AnimationState.prototype.addEmptyAnimation = function (trackIndex, mixDuration, delay) {
            if (mixDuration === void 0) { mixDuration = 0; }
            if (delay === void 0) { delay = 0; }
            var entry = this.addAnimationWith(trackIndex, AnimationState.emptyAnimation(), false, delay <= 0 ? 1 : delay);
            entry.mixDuration = mixDuration;
            entry.trackEnd = mixDuration;
            if (delay <= 0 && entry.previous)
                entry.delay = entry.previous.getTrackComplete() - entry.mixDuration + delay;
            return entry;
        };
        /** Sets an empty animation for every track, discarding any queued animations, and mixes to it over the specified mix
         * duration. */
        AnimationState.prototype.setEmptyAnimations = function (mixDuration) {
            if (mixDuration === void 0) { mixDuration = 0; }
            var oldDrainDisabled = this.queue.drainDisabled;
            this.queue.drainDisabled = true;
            for (var i = 0, n = this.tracks.length; i < n; i++) {
                var current = this.tracks[i];
                if (current)
                    this.setEmptyAnimation(current.trackIndex, mixDuration);
            }
            this.queue.drainDisabled = oldDrainDisabled;
            this.queue.drain();
        };
        AnimationState.prototype.expandToIndex = function (index) {
            if (index < this.tracks.length)
                return this.tracks[index];
            base.Utils.ensureArrayCapacity(this.tracks, index + 1, null);
            this.tracks.length = index + 1;
            return null;
        };
        /** @param last May be null. */
        AnimationState.prototype.trackEntry = function (trackIndex, animation, loop, last) {
            var entry = this.trackEntryPool.obtain();
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
            entry.mixDuration = !last ? 0 : this.data.getMix(last.animation, animation);
            entry.mixBlend = exports.MixBlend.replace;
            return entry;
        };
        /** Removes the {@link TrackEntry#getNext() next entry} and all entries after it for the specified entry. */
        AnimationState.prototype.clearNext = function (entry) {
            var next = entry.next;
            while (next) {
                this.queue.dispose(next);
                next = next.next;
            }
            entry.next = null;
        };
        AnimationState.prototype._animationsChanged = function () {
            this.animationsChanged = false;
            this.propertyIDs.clear();
            var tracks = this.tracks;
            for (var i = 0, n = tracks.length; i < n; i++) {
                var entry = tracks[i];
                if (!entry)
                    continue;
                while (entry.mixingFrom)
                    entry = entry.mixingFrom;
                do {
                    if (!entry.mixingTo || entry.mixBlend != exports.MixBlend.add)
                        this.computeHold(entry);
                    entry = entry.mixingTo;
                } while (entry);
            }
        };
        AnimationState.prototype.computeHold = function (entry) {
            var to = entry.mixingTo;
            var timelines = entry.animation.timelines;
            var timelinesCount = entry.animation.timelines.length;
            var timelineMode = entry.timelineMode;
            timelineMode.length = timelinesCount;
            var timelineHoldMix = entry.timelineHoldMix;
            timelineHoldMix.length = 0;
            var propertyIDs = this.propertyIDs;
            if (to && to.holdPrevious) {
                for (var i = 0; i < timelinesCount; i++)
                    timelineMode[i] = propertyIDs.addAll(timelines[i].getPropertyIds()) ? HOLD_FIRST : HOLD_SUBSEQUENT;
                return;
            }
            outer: for (var i = 0; i < timelinesCount; i++) {
                var timeline = timelines[i];
                var ids = timeline.getPropertyIds();
                if (!propertyIDs.addAll(ids))
                    timelineMode[i] = SUBSEQUENT;
                else if (!to || timeline instanceof AttachmentTimeline || timeline instanceof DrawOrderTimeline
                    || timeline instanceof EventTimeline || !to.animation.hasTimeline(ids)) {
                    timelineMode[i] = FIRST;
                }
                else {
                    for (var next = to.mixingTo; next; next = next.mixingTo) {
                        if (next.animation.hasTimeline(ids))
                            continue;
                        if (entry.mixDuration > 0) {
                            timelineMode[i] = HOLD_MIX;
                            timelineHoldMix[i] = next;
                            continue outer;
                        }
                        break;
                    }
                    timelineMode[i] = HOLD_FIRST;
                }
            }
        };
        /** Returns the track entry for the animation currently playing on the track, or null if no animation is currently playing. */
        AnimationState.prototype.getCurrent = function (trackIndex) {
            if (trackIndex >= this.tracks.length)
                return null;
            return this.tracks[trackIndex];
        };
        /** Adds a listener to receive events for all track entries. */
        AnimationState.prototype.addListener = function (listener) {
            if (!listener)
                throw new Error("listener cannot be null.");
            this.listeners.push(listener);
        };
        /** Removes the listener added with {@link #addListener()}. */
        AnimationState.prototype.removeListener = function (listener) {
            var index = this.listeners.indexOf(listener);
            if (index >= 0)
                this.listeners.splice(index, 1);
        };
        /** Removes all listeners added with {@link #addListener()}. */
        AnimationState.prototype.clearListeners = function () {
            this.listeners.length = 0;
        };
        /** Discards all listener notifications that have not yet been delivered. This can be useful to call from an
         * {@link AnimationStateListener} when it is known that further notifications that may have been already queued for delivery
         * are not wanted because new animations are being set. */
        AnimationState.prototype.clearListenerNotifications = function () {
            this.queue.clear();
        };
        AnimationState.prototype.setAnimationByName = function (trackIndex, animationName, loop) {
            if (!AnimationState.deprecatedWarning1) {
                AnimationState.deprecatedWarning1 = true;
                console.warn("Spine Deprecation Warning: AnimationState.setAnimationByName is deprecated, please use setAnimation from now on.");
            }
            this.setAnimation(trackIndex, animationName, loop);
        };
        AnimationState.prototype.addAnimationByName = function (trackIndex, animationName, loop, delay) {
            if (!AnimationState.deprecatedWarning2) {
                AnimationState.deprecatedWarning2 = true;
                console.warn("Spine Deprecation Warning: AnimationState.addAnimationByName is deprecated, please use addAnimation from now on.");
            }
            this.addAnimation(trackIndex, animationName, loop, delay);
        };
        AnimationState.prototype.hasAnimation = function (animationName) {
            var animation = this.data.skeletonData.findAnimation(animationName);
            return animation !== null;
        };
        AnimationState.prototype.hasAnimationByName = function (animationName) {
            if (!AnimationState.deprecatedWarning3) {
                AnimationState.deprecatedWarning3 = true;
                console.warn("Spine Deprecation Warning: AnimationState.hasAnimationByName is deprecated, please use hasAnimation from now on.");
            }
            return this.hasAnimation(animationName);
        };
        AnimationState.deprecatedWarning1 = false;
        AnimationState.deprecatedWarning2 = false;
        AnimationState.deprecatedWarning3 = false;
        return AnimationState;
    }());
    /** Stores settings and other state for the playback of an animation on an {@link AnimationState} track.
     *
     * References to a track entry must not be kept after the {@link AnimationStateListener#dispose()} event occurs.
     * @public
     * */
    var TrackEntry = /** @class */ (function () {
        function TrackEntry() {
            /** Controls how properties keyed in the animation are mixed with lower tracks. Defaults to {@link MixBlend#replace}, which
             * replaces the values from the lower tracks with the animation values. {@link MixBlend#add} adds the animation values to
             * the values from the lower tracks.
             *
             * The `mixBlend` can be set for a new track entry only before {@link AnimationState#apply()} is first
             * called. */
            this.mixBlend = exports.MixBlend.replace;
            this.timelineMode = new Array();
            this.timelineHoldMix = new Array();
            this.timelinesRotation = new Array();
        }
        TrackEntry.prototype.reset = function () {
            this.previous = null;
            this.next = null;
            this.mixingFrom = null;
            this.mixingTo = null;
            this.animation = null;
            this.listener = null;
            this.timelineMode.length = 0;
            this.timelineHoldMix.length = 0;
            this.timelinesRotation.length = 0;
        };
        /** Uses {@link #trackTime} to compute the `animationTime`, which is between {@link #animationStart}
         * and {@link #animationEnd}. When the `trackTime` is 0, the `animationTime` is equal to the
         * `animationStart` time. */
        TrackEntry.prototype.getAnimationTime = function () {
            if (this.loop) {
                var duration = this.animationEnd - this.animationStart;
                if (duration == 0)
                    return this.animationStart;
                return (this.trackTime % duration) + this.animationStart;
            }
            return Math.min(this.trackTime + this.animationStart, this.animationEnd);
        };
        TrackEntry.prototype.setAnimationLast = function (animationLast) {
            this.animationLast = animationLast;
            this.nextAnimationLast = animationLast;
        };
        /** Returns true if at least one loop has been completed.
         *
         * See {@link AnimationStateListener#complete()}. */
        TrackEntry.prototype.isComplete = function () {
            return this.trackTime >= this.animationEnd - this.animationStart;
        };
        /** Resets the rotation directions for mixing this entry's rotate timelines. This can be useful to avoid bones rotating the
         * long way around when using {@link #alpha} and starting animations on other tracks.
         *
         * Mixing with {@link MixBlend#replace} involves finding a rotation between two others, which has two possible solutions:
         * the short way or the long way around. The two rotations likely change over time, so which direction is the short or long
         * way also changes. If the short way was always chosen, bones would flip to the other side when that direction became the
         * long way. TrackEntry chooses the short way the first time it is applied and remembers that direction. */
        TrackEntry.prototype.resetRotationDirections = function () {
            this.timelinesRotation.length = 0;
        };
        TrackEntry.prototype.getTrackComplete = function () {
            var duration = this.animationEnd - this.animationStart;
            if (duration != 0) {
                if (this.loop)
                    return duration * (1 + ((this.trackTime / duration) | 0)); // Completion of next loop.
                if (this.trackTime < duration)
                    return duration; // Before duration.
            }
            return this.trackTime; // Next update.
        };
        Object.defineProperty(TrackEntry.prototype, "time", {
            get: function () {
                if (!TrackEntry.deprecatedWarning1) {
                    TrackEntry.deprecatedWarning1 = true;
                    console.warn("Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on.");
                }
                return this.trackTime;
            },
            set: function (value) {
                if (!TrackEntry.deprecatedWarning1) {
                    TrackEntry.deprecatedWarning1 = true;
                    console.warn("Spine Deprecation Warning: TrackEntry.time is deprecated, please use trackTime from now on.");
                }
                this.trackTime = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TrackEntry.prototype, "endTime", {
            get: function () {
                if (!TrackEntry.deprecatedWarning2) {
                    TrackEntry.deprecatedWarning2 = true;
                    console.warn("Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on.");
                }
                return this.trackTime;
            },
            set: function (value) {
                if (!TrackEntry.deprecatedWarning2) {
                    TrackEntry.deprecatedWarning2 = true;
                    console.warn("Spine Deprecation Warning: TrackEntry.endTime is deprecated, please use trackEnd from now on.");
                }
                this.trackTime = value;
            },
            enumerable: false,
            configurable: true
        });
        TrackEntry.prototype.loopsCount = function () {
            return Math.floor(this.trackTime / this.trackEnd);
        };
        TrackEntry.deprecatedWarning1 = false;
        TrackEntry.deprecatedWarning2 = false;
        return TrackEntry;
    }());
    /**
     * @public
     */
    var EventQueue = /** @class */ (function () {
        function EventQueue(animState) {
            this.objects = [];
            this.drainDisabled = false;
            this.animState = animState;
        }
        EventQueue.prototype.start = function (entry) {
            this.objects.push(exports.EventType.start);
            this.objects.push(entry);
            this.animState.animationsChanged = true;
        };
        EventQueue.prototype.interrupt = function (entry) {
            this.objects.push(exports.EventType.interrupt);
            this.objects.push(entry);
        };
        EventQueue.prototype.end = function (entry) {
            this.objects.push(exports.EventType.end);
            this.objects.push(entry);
            this.animState.animationsChanged = true;
        };
        EventQueue.prototype.dispose = function (entry) {
            this.objects.push(exports.EventType.dispose);
            this.objects.push(entry);
        };
        EventQueue.prototype.complete = function (entry) {
            this.objects.push(exports.EventType.complete);
            this.objects.push(entry);
        };
        EventQueue.prototype.event = function (entry, event) {
            this.objects.push(exports.EventType.event);
            this.objects.push(entry);
            this.objects.push(event);
        };
        EventQueue.prototype.drain = function () {
            if (this.drainDisabled)
                return;
            this.drainDisabled = true;
            var objects = this.objects;
            var listeners = this.animState.listeners;
            for (var i = 0; i < objects.length; i += 2) {
                var type = objects[i];
                var entry = objects[i + 1];
                switch (type) {
                    case exports.EventType.start:
                        if (entry.listener != null && entry.listener.start)
                            entry.listener.start(entry);
                        for (var ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].start)
                                listeners[ii].start(entry);
                        break;
                    case exports.EventType.interrupt:
                        if (entry.listener != null && entry.listener.interrupt)
                            entry.listener.interrupt(entry);
                        for (var ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].interrupt)
                                listeners[ii].interrupt(entry);
                        break;
                    case exports.EventType.end:
                        if (entry.listener != null && entry.listener.end)
                            entry.listener.end(entry);
                        for (var ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].end)
                                listeners[ii].end(entry);
                    // Fall through.
                    case exports.EventType.dispose:
                        if (entry.listener != null && entry.listener.dispose)
                            entry.listener.dispose(entry);
                        for (var ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].dispose)
                                listeners[ii].dispose(entry);
                        this.animState.trackEntryPool.free(entry);
                        break;
                    case exports.EventType.complete:
                        if (entry.listener != null && entry.listener.complete)
                            entry.listener.complete(entry);
                        for (var ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].complete)
                                listeners[ii].complete(entry);
                        break;
                    case exports.EventType.event:
                        var event_3 = objects[i++ + 2];
                        if (entry.listener != null && entry.listener.event)
                            entry.listener.event(entry, event_3);
                        for (var ii = 0; ii < listeners.length; ii++)
                            if (listeners[ii].event)
                                listeners[ii].event(entry, event_3);
                        break;
                }
            }
            this.clear();
            this.drainDisabled = false;
        };
        EventQueue.prototype.clear = function () {
            this.objects.length = 0;
        };
        return EventQueue;
    }());
    /**
     * @public
     */
    exports.EventType = void 0;
    (function (EventType) {
        EventType[EventType["start"] = 0] = "start";
        EventType[EventType["interrupt"] = 1] = "interrupt";
        EventType[EventType["end"] = 2] = "end";
        EventType[EventType["dispose"] = 3] = "dispose";
        EventType[EventType["complete"] = 4] = "complete";
        EventType[EventType["event"] = 5] = "event";
    })(exports.EventType || (exports.EventType = {}));
    /**
     * @public
     */
    var AnimationStateAdapter = /** @class */ (function () {
        function AnimationStateAdapter() {
        }
        AnimationStateAdapter.prototype.start = function (entry) {
        };
        AnimationStateAdapter.prototype.interrupt = function (entry) {
        };
        AnimationStateAdapter.prototype.end = function (entry) {
        };
        AnimationStateAdapter.prototype.dispose = function (entry) {
        };
        AnimationStateAdapter.prototype.complete = function (entry) {
        };
        AnimationStateAdapter.prototype.event = function (entry, event) {
        };
        return AnimationStateAdapter;
    }());
    /** 1. A previously applied timeline has set this property.
     *
     * Result: Mix from the current pose to the timeline pose. */
    var SUBSEQUENT = 0;
    /** 1. This is the first timeline to set this property.
     * 2. The next track entry applied after this one does not have a timeline to set this property.
     *
     * Result: Mix from the setup pose to the timeline pose. */
    var FIRST = 1;
    /** 1) A previously applied timeline has set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the current pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading
     * animations that key the same property. A subsequent timeline will set this property using a mix. */
    var HOLD_SUBSEQUENT = 2;
    /** 1) This is the first timeline to set this property.<br>
     * 2) The next track entry to be applied does have a timeline to set this property.<br>
     * 3) The next track entry after that one does not have a timeline to set this property.<br>
     * Result: Mix from the setup pose to the timeline pose, but do not mix out. This avoids "dipping" when crossfading animations
     * that key the same property. A subsequent timeline will set this property using a mix. */
    var HOLD_FIRST = 3;
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
    var HOLD_MIX = 4;
    var SETUP = 1;
    var CURRENT = 2;
    var _emptyAnimation = null;

    /** Stores mix (crossfade) durations to be applied when {@link AnimationState} animations are changed.
     * @public
     * */
    var AnimationStateData = /** @class */ (function () {
        function AnimationStateData(skeletonData) {
            this.animationToMixTime = {};
            /** The mix duration to use when no mix duration has been defined between two animations. */
            this.defaultMix = 0;
            if (skeletonData == null)
                throw new Error("skeletonData cannot be null.");
            this.skeletonData = skeletonData;
        }
        /** Sets a mix duration by animation name.
         *
         * See {@link #setMixWith()}. */
        AnimationStateData.prototype.setMix = function (fromName, toName, duration) {
            var from = this.skeletonData.findAnimation(fromName);
            if (from == null)
                throw new Error("Animation not found: " + fromName);
            var to = this.skeletonData.findAnimation(toName);
            if (to == null)
                throw new Error("Animation not found: " + toName);
            this.setMixWith(from, to, duration);
        };
        /** Sets the mix duration when changing from the specified animation to the other.
         *
         * See {@link TrackEntry#mixDuration}. */
        AnimationStateData.prototype.setMixWith = function (from, to, duration) {
            if (from == null)
                throw new Error("from cannot be null.");
            if (to == null)
                throw new Error("to cannot be null.");
            var key = from.name + "." + to.name;
            this.animationToMixTime[key] = duration;
        };
        /** Returns the mix duration to use when changing from the specified animation to the other, or the {@link #defaultMix} if
         * no mix duration has been set. */
        AnimationStateData.prototype.getMix = function (from, to) {
            var key = from.name + "." + to.name;
            var value = this.animationToMixTime[key];
            return value === undefined ? this.defaultMix : value;
        };
        return AnimationStateData;
    }());

    /**
     * @public
     */
    var AtlasAttachmentLoader = /** @class */ (function () {
        function AtlasAttachmentLoader(atlas) {
            this.atlas = atlas;
        }
        /** @return May be null to not load an attachment. */
        // @ts-ignore
        AtlasAttachmentLoader.prototype.newRegionAttachment = function (skin, name, path) {
            var region = this.atlas.findRegion(path);
            if (region == null)
                throw new Error("Region not found in atlas: " + path + " (region attachment: " + name + ")");
            var attachment = new RegionAttachment(name);
            attachment.region = region;
            return attachment;
        };
        /** @return May be null to not load an attachment. */
        // @ts-ignore
        AtlasAttachmentLoader.prototype.newMeshAttachment = function (skin, name, path) {
            var region = this.atlas.findRegion(path);
            if (region == null)
                throw new Error("Region not found in atlas: " + path + " (mesh attachment: " + name + ")");
            var attachment = new MeshAttachment(name);
            attachment.region = region;
            return attachment;
        };
        /** @return May be null to not load an attachment. */
        // @ts-ignore
        AtlasAttachmentLoader.prototype.newBoundingBoxAttachment = function (skin, name) {
            return new BoundingBoxAttachment(name);
        };
        /** @return May be null to not load an attachment */
        // @ts-ignore
        AtlasAttachmentLoader.prototype.newPathAttachment = function (skin, name) {
            return new PathAttachment(name);
        };
        // @ts-ignore
        AtlasAttachmentLoader.prototype.newPointAttachment = function (skin, name) {
            return new PointAttachment(name);
        };
        // @ts-ignore
        AtlasAttachmentLoader.prototype.newClippingAttachment = function (skin, name) {
            return new ClippingAttachment(name);
        };
        return AtlasAttachmentLoader;
    }());

    /** Stores the setup pose for a {@link Bone}.
     * @public
     * */
    var BoneData = /** @class */ (function () {
        function BoneData(index, name, parent) {
            /** The local x translation. */
            this.x = 0;
            /** The local y translation. */
            this.y = 0;
            /** The local rotation. */
            this.rotation = 0;
            /** The local scaleX. */
            this.scaleX = 1;
            /** The local scaleY. */
            this.scaleY = 1;
            /** The local shearX. */
            this.shearX = 0;
            /** The local shearX. */
            this.shearY = 0;
            /** The transform mode for how parent world transforms affect this bone. */
            this.transformMode = exports.TransformMode.Normal;
            /** When true, {@link Skeleton#updateWorldTransform()} only updates this bone if the {@link Skeleton#skin} contains this
             * bone.
             * @see Skin#bones */
            this.skinRequired = false;
            /** The color of the bone as it was in Spine. Available only when nonessential data was exported. Bones are not usually
             * rendered at runtime. */
            this.color = new base.Color();
            if (index < 0)
                throw new Error("index must be >= 0.");
            if (name == null)
                throw new Error("name cannot be null.");
            this.index = index;
            this.name = name;
            this.parent = parent;
        }
        return BoneData;
    }());
    /** Determines how a bone inherits world transforms from parent bones.
     * @public
     * */
    exports.TransformMode = void 0;
    (function (TransformMode) {
        TransformMode[TransformMode["Normal"] = 0] = "Normal";
        TransformMode[TransformMode["OnlyTranslation"] = 1] = "OnlyTranslation";
        TransformMode[TransformMode["NoRotationOrReflection"] = 2] = "NoRotationOrReflection";
        TransformMode[TransformMode["NoScale"] = 3] = "NoScale";
        TransformMode[TransformMode["NoScaleOrReflection"] = 4] = "NoScaleOrReflection";
    })(exports.TransformMode || (exports.TransformMode = {}));

    /** Stores a bone's current pose.
     *
     * A bone has a local transform which is used to compute its world transform. A bone also has an applied transform, which is a
     * local transform that can be applied to compute the world transform. The local transform and applied transform may differ if a
     * constraint or application code modifies the world transform after it was computed from the local transform.
     * @public
     * */
    var Bone = /** @class */ (function () {
        /** @param parent May be null. */
        function Bone(data, skeleton, parent) {
            //be careful! Spine b,c is c,b in pixi matrix
            this.matrix = new math.Matrix();
            /** The immediate children of this bone. */
            this.children = new Array();
            /** The local x translation. */
            this.x = 0;
            /** The local y translation. */
            this.y = 0;
            /** The local rotation in degrees, counter clockwise. */
            this.rotation = 0;
            /** The local scaleX. */
            this.scaleX = 0;
            /** The local scaleY. */
            this.scaleY = 0;
            /** The local shearX. */
            this.shearX = 0;
            /** The local shearY. */
            this.shearY = 0;
            /** The applied local x translation. */
            this.ax = 0;
            /** The applied local y translation. */
            this.ay = 0;
            /** The applied local rotation in degrees, counter clockwise. */
            this.arotation = 0;
            /** The applied local scaleX. */
            this.ascaleX = 0;
            /** The applied local scaleY. */
            this.ascaleY = 0;
            /** The applied local shearX. */
            this.ashearX = 0;
            /** The applied local shearY. */
            this.ashearY = 0;
            this.sorted = false;
            this.active = false;
            if (!data)
                throw new Error("data cannot be null.");
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.skeleton = skeleton;
            this.parent = parent;
            this.setToSetupPose();
        }
        Object.defineProperty(Bone.prototype, "worldX", {
            get: function () {
                return this.matrix.tx;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "worldY", {
            get: function () {
                return this.matrix.ty;
            },
            enumerable: false,
            configurable: true
        });
        /** Returns false when the bone has not been computed because {@link BoneData#skinRequired} is true and the
         * {@link Skeleton#skin active skin} does not {@link Skin#bones contain} this bone. */
        Bone.prototype.isActive = function () {
            return this.active;
        };
        /** Computes the world transform using the parent bone and this bone's local applied transform. */
        Bone.prototype.update = function () {
            this.updateWorldTransformWith(this.ax, this.ay, this.arotation, this.ascaleX, this.ascaleY, this.ashearX, this.ashearY);
        };
        /** Computes the world transform using the parent bone and this bone's local transform.
         *
         * See {@link #updateWorldTransformWith()}. */
        Bone.prototype.updateWorldTransform = function () {
            this.updateWorldTransformWith(this.x, this.y, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY);
        };
        /** Computes the world transform using the parent bone and the specified local transform. The applied transform is set to the
         * specified local transform. Child bones are not updated.
         *
         * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
         * Runtimes Guide. */
        Bone.prototype.updateWorldTransformWith = function (x, y, rotation, scaleX, scaleY, shearX, shearY) {
            this.ax = x;
            this.ay = y;
            this.arotation = rotation;
            this.ascaleX = scaleX;
            this.ascaleY = scaleY;
            this.ashearX = shearX;
            this.ashearY = shearY;
            var parent = this.parent;
            var m = this.matrix;
            var sx = this.skeleton.scaleX;
            var sy = base.settings.yDown ? -this.skeleton.scaleY : this.skeleton.scaleY;
            if (!parent) { // Root bone.
                var skeleton = this.skeleton;
                var rotationY = rotation + 90 + shearY;
                m.a = base.MathUtils.cosDeg(rotation + shearX) * scaleX * sx;
                m.c = base.MathUtils.cosDeg(rotationY) * scaleY * sx;
                m.b = base.MathUtils.sinDeg(rotation + shearX) * scaleX * sy;
                m.d = base.MathUtils.sinDeg(rotationY) * scaleY * sy;
                m.tx = x * sx + skeleton.x;
                m.ty = y * sy + skeleton.y;
                return;
            }
            var pa = parent.matrix.a, pb = parent.matrix.c, pc = parent.matrix.b, pd = parent.matrix.d;
            m.tx = pa * x + pb * y + parent.matrix.tx;
            m.ty = pc * x + pd * y + parent.matrix.ty;
            switch (this.data.transformMode) {
                case exports.TransformMode.Normal: {
                    var rotationY = rotation + 90 + shearY;
                    var la = base.MathUtils.cosDeg(rotation + shearX) * scaleX;
                    var lb = base.MathUtils.cosDeg(rotationY) * scaleY;
                    var lc = base.MathUtils.sinDeg(rotation + shearX) * scaleX;
                    var ld = base.MathUtils.sinDeg(rotationY) * scaleY;
                    m.a = pa * la + pb * lc;
                    m.c = pa * lb + pb * ld;
                    m.b = pc * la + pd * lc;
                    m.d = pc * lb + pd * ld;
                    return;
                }
                case exports.TransformMode.OnlyTranslation: {
                    var rotationY = rotation + 90 + shearY;
                    m.a = base.MathUtils.cosDeg(rotation + shearX) * scaleX;
                    m.c = base.MathUtils.cosDeg(rotationY) * scaleY;
                    m.b = base.MathUtils.sinDeg(rotation + shearX) * scaleX;
                    m.d = base.MathUtils.sinDeg(rotationY) * scaleY;
                    break;
                }
                case exports.TransformMode.NoRotationOrReflection: {
                    var s = pa * pa + pc * pc;
                    var prx = 0;
                    if (s > 0.0001) {
                        s = Math.abs(pa * pd - pb * pc) / s;
                        pa /= this.skeleton.scaleX;
                        pc /= this.skeleton.scaleY;
                        pb = pc * s;
                        pd = pa * s;
                        prx = Math.atan2(pc, pa) * base.MathUtils.radDeg;
                    }
                    else {
                        pa = 0;
                        pc = 0;
                        prx = 90 - Math.atan2(pd, pb) * base.MathUtils.radDeg;
                    }
                    var rx = rotation + shearX - prx;
                    var ry = rotation + shearY - prx + 90;
                    var la = base.MathUtils.cosDeg(rx) * scaleX;
                    var lb = base.MathUtils.cosDeg(ry) * scaleY;
                    var lc = base.MathUtils.sinDeg(rx) * scaleX;
                    var ld = base.MathUtils.sinDeg(ry) * scaleY;
                    m.a = pa * la - pb * lc;
                    m.c = pa * lb - pb * ld;
                    m.b = pc * la + pd * lc;
                    m.d = pc * lb + pd * ld;
                    break;
                }
                case exports.TransformMode.NoScale:
                case exports.TransformMode.NoScaleOrReflection: {
                    var cos = base.MathUtils.cosDeg(rotation);
                    var sin = base.MathUtils.sinDeg(rotation);
                    var za = (pa * cos + pb * sin) / sx;
                    var zc = (pc * cos + pd * sin) / sy;
                    var s = Math.sqrt(za * za + zc * zc);
                    if (s > 0.00001)
                        s = 1 / s;
                    za *= s;
                    zc *= s;
                    s = Math.sqrt(za * za + zc * zc);
                    if (this.data.transformMode == exports.TransformMode.NoScale
                        && (pa * pd - pb * pc < 0) != (base.settings.yDown ?
                            (this.skeleton.scaleX < 0 != this.skeleton.scaleY > 0) :
                            (this.skeleton.scaleX < 0 != this.skeleton.scaleY < 0)))
                        s = -s;
                    var r = Math.PI / 2 + Math.atan2(zc, za);
                    var zb = Math.cos(r) * s;
                    var zd = Math.sin(r) * s;
                    var la = base.MathUtils.cosDeg(shearX) * scaleX;
                    var lb = base.MathUtils.cosDeg(90 + shearY) * scaleY;
                    var lc = base.MathUtils.sinDeg(shearX) * scaleX;
                    var ld = base.MathUtils.sinDeg(90 + shearY) * scaleY;
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
        };
        /** Sets this bone's local transform to the setup pose. */
        Bone.prototype.setToSetupPose = function () {
            var data = this.data;
            this.x = data.x;
            this.y = data.y;
            this.rotation = data.rotation;
            this.scaleX = data.scaleX;
            this.scaleY = data.scaleY;
            this.shearX = data.shearX;
            this.shearY = data.shearY;
        };
        /** The world rotation for the X axis, calculated using {@link #a} and {@link #c}. */
        Bone.prototype.getWorldRotationX = function () {
            return Math.atan2(this.matrix.b, this.matrix.a) * base.MathUtils.radDeg;
        };
        /** The world rotation for the Y axis, calculated using {@link #b} and {@link #d}. */
        Bone.prototype.getWorldRotationY = function () {
            return Math.atan2(this.matrix.d, this.matrix.c) * base.MathUtils.radDeg;
        };
        /** The magnitude (always positive) of the world scale X, calculated using {@link #a} and {@link #c}. */
        Bone.prototype.getWorldScaleX = function () {
            var m = this.matrix;
            return Math.sqrt(m.a * m.a + m.b * m.b);
        };
        /** The magnitude (always positive) of the world scale Y, calculated using {@link #b} and {@link #d}. */
        Bone.prototype.getWorldScaleY = function () {
            var m = this.matrix;
            return Math.sqrt(m.c * m.c + m.d * m.d);
        };
        /** Computes the applied transform values from the world transform.
         *
         * If the world transform is modified (by a constraint, {@link #rotateWorld(float)}, etc) then this method should be called so
         * the applied transform matches the world transform. The applied transform may be needed by other code (eg to apply other
         * constraints).
         *
         * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. The applied transform after
         * calling this method is equivalent to the local transform used to compute the world transform, but may not be identical. */
        Bone.prototype.updateAppliedTransform = function () {
            var parent = this.parent;
            var m = this.matrix;
            if (!parent) {
                this.ax = m.tx;
                this.ay = m.ty;
                this.arotation = Math.atan2(m.b, m.a) * base.MathUtils.radDeg;
                this.ascaleX = Math.sqrt(m.a * m.a + m.b * m.b);
                this.ascaleY = Math.sqrt(m.c * m.c + m.d * m.d);
                this.ashearX = 0;
                this.ashearY = Math.atan2(m.a * m.c + m.b * m.d, m.a * m.d - m.b * m.c) * base.MathUtils.radDeg;
                return;
            }
            var pm = parent.matrix;
            var pid = 1 / (pm.a * pm.d - pm.b * pm.c);
            var dx = m.tx - pm.tx, dy = m.ty - pm.ty;
            this.ax = (dx * pm.d * pid - dy * pm.c * pid);
            this.ay = (dy * pm.a * pid - dx * pm.b * pid);
            var ia = pid * pm.d;
            var id = pid * pm.a;
            var ib = pid * pm.c;
            var ic = pid * pm.b;
            var ra = ia * m.a - ib * m.b;
            var rb = ia * m.c - ib * m.d;
            var rc = id * m.b - ic * m.a;
            var rd = id * m.d - ic * m.c;
            this.ashearX = 0;
            this.ascaleX = Math.sqrt(ra * ra + rc * rc);
            if (this.ascaleX > 0.0001) {
                var det = ra * rd - rb * rc;
                this.ascaleY = det / this.ascaleX;
                this.ashearY = Math.atan2(ra * rb + rc * rd, det) * base.MathUtils.radDeg;
                this.arotation = Math.atan2(rc, ra) * base.MathUtils.radDeg;
            }
            else {
                this.ascaleX = 0;
                this.ascaleY = Math.sqrt(rb * rb + rd * rd);
                this.ashearY = 0;
                this.arotation = 90 - Math.atan2(rd, rb) * base.MathUtils.radDeg;
            }
        };
        /** Transforms a point from world coordinates to the bone's local coordinates. */
        Bone.prototype.worldToLocal = function (world) {
            var m = this.matrix;
            var a = m.a, b = m.c, c = m.b, d = m.d;
            var invDet = 1 / (a * d - b * c);
            var x = world.x - m.tx, y = world.y - m.ty;
            world.x = (x * d * invDet - y * b * invDet);
            world.y = (y * a * invDet - x * c * invDet);
            return world;
        };
        /** Transforms a point from the bone's local coordinates to world coordinates. */
        Bone.prototype.localToWorld = function (local) {
            var m = this.matrix;
            var x = local.x, y = local.y;
            local.x = x * m.a + y * m.c + m.tx;
            local.y = x * m.b + y * m.d + m.ty;
            return local;
        };
        /** Transforms a world rotation to a local rotation. */
        Bone.prototype.worldToLocalRotation = function (worldRotation) {
            var sin = base.MathUtils.sinDeg(worldRotation), cos = base.MathUtils.cosDeg(worldRotation);
            var mat = this.matrix;
            return Math.atan2(mat.a * sin - mat.b * cos, mat.d * cos - mat.c * sin) * base.MathUtils.radDeg;
        };
        /** Transforms a local rotation to a world rotation. */
        Bone.prototype.localToWorldRotation = function (localRotation) {
            localRotation -= this.rotation - this.shearX;
            var sin = base.MathUtils.sinDeg(localRotation), cos = base.MathUtils.cosDeg(localRotation);
            var mat = this.matrix;
            return Math.atan2(cos * mat.b + sin * mat.d, cos * mat.a + sin * mat.c) * base.MathUtils.radDeg;
        };
        /** Rotates the world transform the specified amount.
         * <p>
         * After changes are made to the world transform, {@link #updateAppliedTransform()} should be called and {@link #update()} will
         * need to be called on any child bones, recursively. */
        Bone.prototype.rotateWorld = function (degrees) {
            var mat = this.matrix;
            var a = mat.a, b = mat.c, c = mat.b, d = mat.d;
            var cos = base.MathUtils.cosDeg(degrees), sin = base.MathUtils.sinDeg(degrees);
            mat.a = cos * a - sin * c;
            mat.c = cos * b - sin * d;
            mat.b = sin * a + cos * c;
            mat.d = sin * b + cos * d;
        };
        return Bone;
    }());

    /** The base class for all constraint datas.
     * @public
     * */
    var ConstraintData = /** @class */ (function () {
        function ConstraintData(name, order, skinRequired) {
            this.name = name;
            this.order = order;
            this.skinRequired = skinRequired;
        }
        return ConstraintData;
    }());

    /** Stores the current pose values for an {@link Event}.
     *
     * See Timeline {@link Timeline#apply()},
     * AnimationStateListener {@link AnimationStateListener#event()}, and
     * [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide.
     * @public
     * */
    var Event = /** @class */ (function () {
        function Event(time, data) {
            if (data == null)
                throw new Error("data cannot be null.");
            this.time = time;
            this.data = data;
        }
        return Event;
    }());

    /** Stores the setup pose values for an {@link Event}.
     *
     * See [Events](http://esotericsoftware.com/spine-events) in the Spine User Guide.
     * @public
     * */
    var EventData = /** @class */ (function () {
        function EventData(name) {
            this.name = name;
        }
        return EventData;
    }());

    /** Stores the current pose for an IK constraint. An IK constraint adjusts the rotation of 1 or 2 constrained bones so the tip of
     * the last bone is as close to the target bone as possible.
     *
     * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide.
     * @public
     * */
    var IkConstraint = /** @class */ (function () {
        function IkConstraint(data, skeleton) {
            /** Controls the bend direction of the IK bones, either 1 or -1. */
            this.bendDirection = 0;
            /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
            this.compress = false;
            /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
             * and the parent bone has local nonuniform scale, stretch is not applied. */
            this.stretch = false;
            /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
            this.mix = 1;
            /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
            this.softness = 0;
            this.active = false;
            if (!data)
                throw new Error("data cannot be null.");
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.mix = data.mix;
            this.softness = data.softness;
            this.bendDirection = data.bendDirection;
            this.compress = data.compress;
            this.stretch = data.stretch;
            this.bones = new Array();
            for (var i = 0; i < data.bones.length; i++)
                this.bones.push(skeleton.findBone(data.bones[i].name));
            this.target = skeleton.findBone(data.target.name);
        }
        IkConstraint.prototype.isActive = function () {
            return this.active;
        };
        IkConstraint.prototype.update = function () {
            if (this.mix == 0)
                return;
            var target = this.target;
            var bones = this.bones;
            switch (bones.length) {
                case 1:
                    this.apply1(bones[0], target.worldX, target.worldY, this.compress, this.stretch, this.data.uniform, this.mix);
                    break;
                case 2:
                    this.apply2(bones[0], bones[1], target.worldX, target.worldY, this.bendDirection, this.stretch, this.data.uniform, this.softness, this.mix);
                    break;
            }
        };
        /** Applies 1 bone IK. The target is specified in the world coordinate system. */
        IkConstraint.prototype.apply1 = function (bone, targetX, targetY, compress, stretch, uniform, alpha) {
            var p = bone.parent.matrix;
            var pa = p.a, pb = p.c, pc = p.b, pd = p.d;
            var rotationIK = -bone.ashearX - bone.arotation, tx = 0, ty = 0;
            switch (bone.data.transformMode) {
                case exports.TransformMode.OnlyTranslation:
                    tx = targetX - bone.worldX;
                    ty = targetY - bone.worldY;
                    break;
                case exports.TransformMode.NoRotationOrReflection:
                    var s = Math.abs(pa * pd - pb * pc) / (pa * pa + pc * pc);
                    var sa = pa / bone.skeleton.scaleX;
                    var sc = pc / bone.skeleton.scaleY;
                    pb = -sc * s * bone.skeleton.scaleX;
                    pd = sa * s * bone.skeleton.scaleY;
                    rotationIK += Math.atan2(sc, sa) * base.MathUtils.radDeg;
                // Fall through
                default:
                    var x = targetX - p.tx, y = targetY - p.ty;
                    var d = pa * pd - pb * pc;
                    tx = (x * pd - y * pb) / d - bone.ax;
                    ty = (y * pa - x * pc) / d - bone.ay;
            }
            rotationIK += Math.atan2(ty, tx) * base.MathUtils.radDeg;
            if (bone.ascaleX < 0)
                rotationIK += 180;
            if (rotationIK > 180)
                rotationIK -= 360;
            else if (rotationIK < -180)
                rotationIK += 360;
            var sx = bone.ascaleX, sy = bone.ascaleY;
            if (compress || stretch) {
                switch (bone.data.transformMode) {
                    case exports.TransformMode.NoScale:
                    case exports.TransformMode.NoScaleOrReflection:
                        tx = targetX - bone.worldX;
                        ty = targetY - bone.worldY;
                }
                var b = bone.data.length * sx, dd = Math.sqrt(tx * tx + ty * ty);
                if ((compress && dd < b) || (stretch && dd > b) && b > 0.0001) {
                    var s = (dd / b - 1) * alpha + 1;
                    sx *= s;
                    if (uniform)
                        sy *= s;
                }
            }
            bone.updateWorldTransformWith(bone.ax, bone.ay, bone.arotation + rotationIK * alpha, sx, sy, bone.ashearX, bone.ashearY);
        };
        /** Applies 2 bone IK. The target is specified in the world coordinate system.
         * @param child A direct descendant of the parent bone. */
        IkConstraint.prototype.apply2 = function (parent, child, targetX, targetY, bendDir, stretch, uniform, softness, alpha) {
            var px = parent.ax, py = parent.ay, psx = parent.ascaleX, psy = parent.ascaleY, sx = psx, sy = psy, csx = child.ascaleX;
            var pmat = parent.matrix;
            var os1 = 0, os2 = 0, s2 = 0;
            if (psx < 0) {
                psx = -psx;
                os1 = 180;
                s2 = -1;
            }
            else {
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
            }
            else
                os2 = 0;
            var cx = child.ax, cy = 0, cwx = 0, cwy = 0, a = pmat.a, b = pmat.c, c = pmat.b, d = pmat.d;
            var u = Math.abs(psx - psy) <= 0.0001;
            if (!u || stretch) {
                cy = 0;
                cwx = a * cx + pmat.tx;
                cwy = c * cx + pmat.ty;
            }
            else {
                cy = child.ay;
                cwx = a * cx + b * cy + pmat.tx;
                cwy = c * cx + d * cy + pmat.ty;
            }
            var pp = parent.parent.matrix;
            a = pp.a;
            b = pp.c;
            c = pp.b;
            d = pp.d;
            var id = 1 / (a * d - b * c), x = cwx - pp.tx, y = cwy - pp.ty;
            var dx = (x * d - y * b) * id - px, dy = (y * a - x * c) * id - py;
            var l1 = Math.sqrt(dx * dx + dy * dy), l2 = child.data.length * csx, a1, a2;
            if (l1 < 0.0001) {
                this.apply1(parent, targetX, targetY, false, stretch, false, alpha);
                child.updateWorldTransformWith(cx, cy, 0, child.ascaleX, child.ascaleY, child.ashearX, child.ashearY);
                return;
            }
            x = targetX - pp.tx;
            y = targetY - pp.ty;
            var tx = (x * d - y * b) * id - px, ty = (y * a - x * c) * id - py;
            var dd = tx * tx + ty * ty;
            if (softness != 0) {
                softness *= psx * (csx + 1) * 0.5;
                var td = Math.sqrt(dd), sd = td - l1 - l2 * psx + softness;
                if (sd > 0) {
                    var p = Math.min(1, sd / (softness * 2)) - 1;
                    p = (sd - softness * (1 - p * p)) / td;
                    tx -= p * tx;
                    ty -= p * ty;
                    dd = tx * tx + ty * ty;
                }
            }
            outer: if (u) {
                l2 *= psx;
                var cos = (dd - l1 * l1 - l2 * l2) / (2 * l1 * l2);
                if (cos < -1) {
                    cos = -1;
                    a2 = Math.PI * bendDir;
                }
                else if (cos > 1) {
                    cos = 1;
                    a2 = 0;
                    if (stretch) {
                        a = (Math.sqrt(dd) / (l1 + l2) - 1) * alpha + 1;
                        sx *= a;
                        if (uniform)
                            sy *= a;
                    }
                }
                else
                    a2 = Math.acos(cos) * bendDir;
                a = l1 + l2 * cos;
                b = l2 * Math.sin(a2);
                a1 = Math.atan2(ty * a - tx * b, tx * a + ty * b);
            }
            else {
                a = psx * l2;
                b = psy * l2;
                var aa = a * a, bb = b * b, ta = Math.atan2(ty, tx);
                c = bb * l1 * l1 + aa * dd - aa * bb;
                var c1 = -2 * bb * l1, c2 = bb - aa;
                d = c1 * c1 - 4 * c2 * c;
                if (d >= 0) {
                    var q = Math.sqrt(d);
                    if (c1 < 0)
                        q = -q;
                    q = -(c1 + q) * 0.5;
                    var r0 = q / c2, r1 = c / q;
                    var r = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
                    if (r * r <= dd) {
                        y = Math.sqrt(dd - r * r) * bendDir;
                        a1 = ta - Math.atan2(y, r);
                        a2 = Math.atan2(y / psy, (r - l1) / psx);
                        break outer;
                    }
                }
                var minAngle = base.MathUtils.PI, minX = l1 - a, minDist = minX * minX, minY = 0;
                var maxAngle = 0, maxX = l1 + a, maxDist = maxX * maxX, maxY = 0;
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
                if (dd <= (minDist + maxDist) * 0.5) {
                    a1 = ta - Math.atan2(minY * bendDir, minX);
                    a2 = minAngle * bendDir;
                }
                else {
                    a1 = ta - Math.atan2(maxY * bendDir, maxX);
                    a2 = maxAngle * bendDir;
                }
            }
            var os = Math.atan2(cy, cx) * s2;
            var rotation = parent.arotation;
            a1 = (a1 - os) * base.MathUtils.radDeg + os1 - rotation;
            if (a1 > 180)
                a1 -= 360;
            else if (a1 < -180) //
                a1 += 360;
            parent.updateWorldTransformWith(px, py, rotation + a1 * alpha, sx, sy, 0, 0);
            rotation = child.arotation;
            a2 = ((a2 + os) * base.MathUtils.radDeg - child.ashearX) * s2 + os2 - rotation;
            if (a2 > 180)
                a2 -= 360;
            else if (a2 < -180) //
                a2 += 360;
            child.updateWorldTransformWith(cx, cy, rotation + a2 * alpha, child.ascaleX, child.ascaleY, child.ashearX, child.ashearY);
        };
        return IkConstraint;
    }());

    /** Stores the setup pose for an {@link IkConstraint}.
     * <p>
     * See [IK constraints](http://esotericsoftware.com/spine-ik-constraints) in the Spine User Guide.
     * @public
     * */
    var IkConstraintData = /** @class */ (function (_super) {
        __extends(IkConstraintData, _super);
        function IkConstraintData(name) {
            var _this = _super.call(this, name, 0, false) || this;
            /** The bones that are constrained by this IK constraint. */
            _this.bones = new Array();
            /** Controls the bend direction of the IK bones, either 1 or -1. */
            _this.bendDirection = 1;
            /** When true and only a single bone is being constrained, if the target is too close, the bone is scaled to reach it. */
            _this.compress = false;
            /** When true, if the target is out of range, the parent bone is scaled to reach it. If more than one bone is being constrained
             * and the parent bone has local nonuniform scale, stretch is not applied. */
            _this.stretch = false;
            /** When true, only a single bone is being constrained, and {@link #getCompress()} or {@link #getStretch()} is used, the bone
             * is scaled on both the X and Y axes. */
            _this.uniform = false;
            /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotations. */
            _this.mix = 1;
            /** For two bone IK, the distance from the maximum reach of the bones that rotation will slow. */
            _this.softness = 0;
            return _this;
        }
        return IkConstraintData;
    }(ConstraintData));

    /** Stores the setup pose for a {@link PathConstraint}.
     *
     * See [Path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide.
     * @public
     * */
    var PathConstraintData = /** @class */ (function (_super) {
        __extends(PathConstraintData, _super);
        function PathConstraintData(name) {
            var _this = _super.call(this, name, 0, false) || this;
            /** The bones that will be modified by this path constraint. */
            _this.bones = new Array();
            _this.mixRotate = 0;
            _this.mixX = 0;
            _this.mixY = 0;
            return _this;
        }
        return PathConstraintData;
    }(ConstraintData));
    /** Controls how the first bone is positioned along the path.
     *
     * See [Position mode](http://esotericsoftware.com/spine-path-constraints#Position-mode) in the Spine User Guide.
     * @public
     * */
    exports.PositionMode = void 0;
    (function (PositionMode) {
        PositionMode[PositionMode["Fixed"] = 0] = "Fixed";
        PositionMode[PositionMode["Percent"] = 1] = "Percent";
    })(exports.PositionMode || (exports.PositionMode = {}));
    /** Controls how bones after the first bone are positioned along the path.
     *
     * [Spacing mode](http://esotericsoftware.com/spine-path-constraints#Spacing-mode) in the Spine User Guide.
     * @public
     * */
    exports.SpacingMode = void 0;
    (function (SpacingMode) {
        SpacingMode[SpacingMode["Length"] = 0] = "Length";
        SpacingMode[SpacingMode["Fixed"] = 1] = "Fixed";
        SpacingMode[SpacingMode["Percent"] = 2] = "Percent";
        SpacingMode[SpacingMode["Proportional"] = 3] = "Proportional";
    })(exports.SpacingMode || (exports.SpacingMode = {}));
    /** Controls how bones are rotated, translated, and scaled to match the path.
     *
     * [Rotate mode](http://esotericsoftware.com/spine-path-constraints#Rotate-mod) in the Spine User Guide.
     * @public
     * */
    exports.RotateMode = void 0;
    (function (RotateMode) {
        RotateMode[RotateMode["Tangent"] = 0] = "Tangent";
        RotateMode[RotateMode["Chain"] = 1] = "Chain";
        RotateMode[RotateMode["ChainScale"] = 2] = "ChainScale";
    })(exports.RotateMode || (exports.RotateMode = {}));

    /** Stores the current pose for a path constraint. A path constraint adjusts the rotation, translation, and scale of the
     * constrained bones so they follow a {@link PathAttachment}.
     *
     * See [Path constraints](http://esotericsoftware.com/spine-path-constraints) in the Spine User Guide.
     * @public
     * */
    var PathConstraint = /** @class */ (function () {
        function PathConstraint(data, skeleton) {
            /** The position along the path. */
            this.position = 0;
            /** The spacing between bones. */
            this.spacing = 0;
            this.mixRotate = 0;
            this.mixX = 0;
            this.mixY = 0;
            this.spaces = new Array();
            this.positions = new Array();
            this.world = new Array();
            this.curves = new Array();
            this.lengths = new Array();
            this.segments = new Array();
            this.active = false;
            if (data == null)
                throw new Error("data cannot be null.");
            if (skeleton == null)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.bones = new Array();
            for (var i = 0, n = data.bones.length; i < n; i++)
                this.bones.push(skeleton.findBone(data.bones[i].name));
            this.target = skeleton.findSlot(data.target.name);
            this.position = data.position;
            this.spacing = data.spacing;
            this.mixRotate = data.mixRotate;
            this.mixX = data.mixX;
            this.mixY = data.mixY;
        }
        PathConstraint.prototype.isActive = function () {
            return this.active;
        };
        PathConstraint.prototype.update = function () {
            var attachment = this.target.getAttachment();
            if (!(attachment instanceof PathAttachment))
                return;
            var mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY;
            if (mixRotate == 0 && mixX == 0 && mixY == 0)
                return;
            var data = this.data;
            var tangents = data.rotateMode == exports.RotateMode.Tangent, scale = data.rotateMode == exports.RotateMode.ChainScale;
            var boneCount = this.bones.length, spacesCount = tangents ? boneCount : boneCount + 1;
            var bones = this.bones;
            var spaces = base.Utils.setArraySize(this.spaces, spacesCount), lengths = scale ? this.lengths = base.Utils.setArraySize(this.lengths, boneCount) : null;
            var spacing = this.spacing;
            switch (data.spacingMode) {
                case exports.SpacingMode.Percent:
                    if (scale) {
                        for (var i = 0, n = spacesCount - 1; i < n; i++) {
                            var bone = bones[i];
                            var setupLength = bone.data.length;
                            if (setupLength < PathConstraint.epsilon)
                                lengths[i] = 0;
                            else {
                                var x = setupLength * bone.matrix.a, y = setupLength * bone.matrix.b;
                                lengths[i] = Math.sqrt(x * x + y * y);
                            }
                        }
                    }
                    base.Utils.arrayFill(spaces, 1, spacesCount, spacing);
                    break;
                case exports.SpacingMode.Proportional:
                    var sum = 0;
                    for (var i = 0, n = spacesCount - 1; i < n;) {
                        var bone = bones[i];
                        var setupLength = bone.data.length;
                        if (setupLength < PathConstraint.epsilon) {
                            if (scale)
                                lengths[i] = 0;
                            spaces[++i] = spacing;
                        }
                        else {
                            var x = setupLength * bone.matrix.a, y = setupLength * bone.matrix.b;
                            var length_1 = Math.sqrt(x * x + y * y);
                            if (scale)
                                lengths[i] = length_1;
                            spaces[++i] = length_1;
                            sum += length_1;
                        }
                    }
                    if (sum > 0) {
                        sum = spacesCount / sum * spacing;
                        for (var i = 1; i < spacesCount; i++)
                            spaces[i] *= sum;
                    }
                    break;
                default:
                    var lengthSpacing = data.spacingMode == exports.SpacingMode.Length;
                    for (var i = 0, n = spacesCount - 1; i < n;) {
                        var bone = bones[i];
                        var setupLength = bone.data.length;
                        if (setupLength < PathConstraint.epsilon) {
                            if (scale)
                                lengths[i] = 0;
                            spaces[++i] = spacing;
                        }
                        else {
                            var x = setupLength * bone.matrix.a, y = setupLength * bone.matrix.b;
                            var length_2 = Math.sqrt(x * x + y * y);
                            if (scale)
                                lengths[i] = length_2;
                            spaces[++i] = (lengthSpacing ? setupLength + spacing : spacing) * length_2 / setupLength;
                        }
                    }
            }
            var positions = this.computeWorldPositions(attachment, spacesCount, tangents);
            var boneX = positions[0], boneY = positions[1], offsetRotation = data.offsetRotation;
            var tip = false;
            if (offsetRotation == 0)
                tip = data.rotateMode == exports.RotateMode.Chain;
            else {
                tip = false;
                var p = this.target.bone.matrix;
                offsetRotation *= p.a * p.d - p.b * p.c > 0 ? base.MathUtils.degRad : -base.MathUtils.degRad;
            }
            for (var i = 0, p = 3; i < boneCount; i++, p += 3) {
                var bone = bones[i];
                var mat = bone.matrix;
                mat.tx += (boneX - mat.tx) * mixX;
                mat.ty += (boneY - mat.ty) * mixY;
                var x = positions[p], y = positions[p + 1], dx = x - boneX, dy = y - boneY;
                if (scale) {
                    var length_3 = lengths[i];
                    if (length_3 != 0) {
                        var s = (Math.sqrt(dx * dx + dy * dy) / length_3 - 1) * mixRotate + 1;
                        mat.a *= s;
                        mat.b *= s;
                    }
                }
                boneX = x;
                boneY = y;
                if (mixRotate > 0) {
                    var a = mat.a, b = mat.c, c = mat.b, d = mat.d, r = 0, cos = 0, sin = 0;
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
                        var length_4 = bone.data.length;
                        boneX += (length_4 * (cos * a - sin * c) - dx) * mixRotate;
                        boneY += (length_4 * (sin * a + cos * c) - dy) * mixRotate;
                    }
                    else {
                        r += offsetRotation;
                    }
                    if (r > base.MathUtils.PI)
                        r -= base.MathUtils.PI2;
                    else if (r < -base.MathUtils.PI) //
                        r += base.MathUtils.PI2;
                    r *= mixRotate;
                    cos = Math.cos(r);
                    sin = Math.sin(r);
                    mat.a = cos * a - sin * c;
                    mat.c = cos * b - sin * d;
                    mat.b = sin * a + cos * c;
                    mat.d = sin * b + cos * d;
                }
                bone.updateAppliedTransform();
            }
        };
        PathConstraint.prototype.computeWorldPositions = function (path, spacesCount, tangents) {
            var target = this.target;
            var position = this.position;
            var spaces = this.spaces, out = base.Utils.setArraySize(this.positions, spacesCount * 3 + 2), world = null;
            var closed = path.closed;
            var verticesLength = path.worldVerticesLength, curveCount = verticesLength / 6, prevCurve = PathConstraint.NONE;
            if (!path.constantSpeed) {
                var lengths = path.lengths;
                curveCount -= closed ? 1 : 2;
                var pathLength_1 = lengths[curveCount];
                if (this.data.positionMode == exports.PositionMode.Percent)
                    position *= pathLength_1;
                var multiplier_1;
                switch (this.data.spacingMode) {
                    case exports.SpacingMode.Percent:
                        multiplier_1 = pathLength_1;
                        break;
                    case exports.SpacingMode.Proportional:
                        multiplier_1 = pathLength_1 / spacesCount;
                        break;
                    default:
                        multiplier_1 = 1;
                }
                world = base.Utils.setArraySize(this.world, 8);
                for (var i = 0, o = 0, curve = 0; i < spacesCount; i++, o += 3) {
                    var space = spaces[i] * multiplier_1;
                    position += space;
                    var p = position;
                    if (closed) {
                        p %= pathLength_1;
                        if (p < 0)
                            p += pathLength_1;
                        curve = 0;
                    }
                    else if (p < 0) {
                        if (prevCurve != PathConstraint.BEFORE) {
                            prevCurve = PathConstraint.BEFORE;
                            path.computeWorldVertices(target, 2, 4, world, 0, 2);
                        }
                        this.addBeforePosition(p, world, 0, out, o);
                        continue;
                    }
                    else if (p > pathLength_1) {
                        if (prevCurve != PathConstraint.AFTER) {
                            prevCurve = PathConstraint.AFTER;
                            path.computeWorldVertices(target, verticesLength - 6, 4, world, 0, 2);
                        }
                        this.addAfterPosition(p - pathLength_1, world, 0, out, o);
                        continue;
                    }
                    // Determine curve containing position.
                    for (;; curve++) {
                        var length_5 = lengths[curve];
                        if (p > length_5)
                            continue;
                        if (curve == 0)
                            p /= length_5;
                        else {
                            var prev = lengths[curve - 1];
                            p = (p - prev) / (length_5 - prev);
                        }
                        break;
                    }
                    if (curve != prevCurve) {
                        prevCurve = curve;
                        if (closed && curve == curveCount) {
                            path.computeWorldVertices(target, verticesLength - 4, 4, world, 0, 2);
                            path.computeWorldVertices(target, 0, 4, world, 4, 2);
                        }
                        else
                            path.computeWorldVertices(target, curve * 6 + 2, 8, world, 0, 2);
                    }
                    this.addCurvePosition(p, world[0], world[1], world[2], world[3], world[4], world[5], world[6], world[7], out, o, tangents || (i > 0 && space == 0));
                }
                return out;
            }
            // World vertices.
            if (closed) {
                verticesLength += 2;
                world = base.Utils.setArraySize(this.world, verticesLength);
                path.computeWorldVertices(target, 2, verticesLength - 4, world, 0, 2);
                path.computeWorldVertices(target, 0, 2, world, verticesLength - 4, 2);
                world[verticesLength - 2] = world[0];
                world[verticesLength - 1] = world[1];
            }
            else {
                curveCount--;
                verticesLength -= 4;
                world = base.Utils.setArraySize(this.world, verticesLength);
                path.computeWorldVertices(target, 2, verticesLength, world, 0, 2);
            }
            // Curve lengths.
            var curves = base.Utils.setArraySize(this.curves, curveCount);
            var pathLength = 0;
            var x1 = world[0], y1 = world[1], cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0, x2 = 0, y2 = 0;
            var tmpx = 0, tmpy = 0, dddfx = 0, dddfy = 0, ddfx = 0, ddfy = 0, dfx = 0, dfy = 0;
            for (var i = 0, w = 2; i < curveCount; i++, w += 6) {
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
            if (this.data.positionMode == exports.PositionMode.Percent)
                position *= pathLength;
            var multiplier = 0;
            switch (this.data.spacingMode) {
                case exports.SpacingMode.Percent:
                    multiplier = pathLength;
                    break;
                case exports.SpacingMode.Proportional:
                    multiplier = pathLength / spacesCount;
                    break;
                default:
                    multiplier = 1;
            }
            var segments = this.segments;
            var curveLength = 0;
            for (var i = 0, o = 0, curve = 0, segment = 0; i < spacesCount; i++, o += 3) {
                var space = spaces[i] * multiplier;
                position += space;
                var p = position;
                if (closed) {
                    p %= pathLength;
                    if (p < 0)
                        p += pathLength;
                    curve = 0;
                }
                else if (p < 0) {
                    this.addBeforePosition(p, world, 0, out, o);
                    continue;
                }
                else if (p > pathLength) {
                    this.addAfterPosition(p - pathLength, world, verticesLength - 4, out, o);
                    continue;
                }
                // Determine curve containing position.
                for (;; curve++) {
                    var length_6 = curves[curve];
                    if (p > length_6)
                        continue;
                    if (curve == 0)
                        p /= length_6;
                    else {
                        var prev = curves[curve - 1];
                        p = (p - prev) / (length_6 - prev);
                    }
                    break;
                }
                // Curve segment lengths.
                if (curve != prevCurve) {
                    prevCurve = curve;
                    var ii = curve * 6;
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
                    var length_7 = segments[segment];
                    if (p > length_7)
                        continue;
                    if (segment == 0)
                        p /= length_7;
                    else {
                        var prev = segments[segment - 1];
                        p = segment + (p - prev) / (length_7 - prev);
                    }
                    break;
                }
                this.addCurvePosition(p * 0.1, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents || (i > 0 && space == 0));
            }
            return out;
        };
        PathConstraint.prototype.addBeforePosition = function (p, temp, i, out, o) {
            var x1 = temp[i], y1 = temp[i + 1], dx = temp[i + 2] - x1, dy = temp[i + 3] - y1, r = Math.atan2(dy, dx);
            out[o] = x1 + p * Math.cos(r);
            out[o + 1] = y1 + p * Math.sin(r);
            out[o + 2] = r;
        };
        PathConstraint.prototype.addAfterPosition = function (p, temp, i, out, o) {
            var x1 = temp[i + 2], y1 = temp[i + 3], dx = x1 - temp[i], dy = y1 - temp[i + 1], r = Math.atan2(dy, dx);
            out[o] = x1 + p * Math.cos(r);
            out[o + 1] = y1 + p * Math.sin(r);
            out[o + 2] = r;
        };
        PathConstraint.prototype.addCurvePosition = function (p, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents) {
            if (p == 0 || isNaN(p)) {
                out[o] = x1;
                out[o + 1] = y1;
                out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
                return;
            }
            var tt = p * p, ttt = tt * p, u = 1 - p, uu = u * u, uuu = uu * u;
            var ut = u * p, ut3 = ut * 3, uut3 = u * ut3, utt3 = ut3 * p;
            var x = x1 * uuu + cx1 * uut3 + cx2 * utt3 + x2 * ttt, y = y1 * uuu + cy1 * uut3 + cy2 * utt3 + y2 * ttt;
            out[o] = x;
            out[o + 1] = y;
            if (tangents) {
                if (p < 0.001)
                    out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
                else
                    out[o + 2] = Math.atan2(y - (y1 * uu + cy1 * ut * 2 + cy2 * tt), x - (x1 * uu + cx1 * ut * 2 + cx2 * tt));
            }
        };
        PathConstraint.NONE = -1;
        PathConstraint.BEFORE = -2;
        PathConstraint.AFTER = -3;
        PathConstraint.epsilon = 0.00001;
        return PathConstraint;
    }());

    /** Stores a slot's current pose. Slots organize attachments for {@link Skeleton#drawOrder} purposes and provide a place to store
     * state for an attachment. State cannot be stored in an attachment itself because attachments are stateless and may be shared
     * across multiple skeletons.
     * @public
     * */
    var Slot = /** @class */ (function () {
        function Slot(data, bone) {
            /** Values to deform the slot's attachment. For an unweighted mesh, the entries are local positions for each vertex. For a
             * weighted mesh, the entries are an offset for each vertex which will be added to the mesh's local vertex positions.
             *
             * See {@link VertexAttachment#computeWorldVertices()} and {@link DeformTimeline}. */
            this.deform = new Array();
            if (data == null)
                throw new Error("data cannot be null.");
            if (bone == null)
                throw new Error("bone cannot be null.");
            this.data = data;
            this.bone = bone;
            this.color = new base.Color();
            this.darkColor = data.darkColor == null ? null : new base.Color();
            this.setToSetupPose();
            this.blendMode = this.data.blendMode;
        }
        /** The skeleton this slot belongs to. */
        Slot.prototype.getSkeleton = function () {
            return this.bone.skeleton;
        };
        /** The current attachment for the slot, or null if the slot has no attachment. */
        Slot.prototype.getAttachment = function () {
            return this.attachment;
        };
        /** Sets the slot's attachment and, if the attachment changed, resets {@link #attachmentTime} and clears {@link #deform}.
         * @param attachment May be null. */
        Slot.prototype.setAttachment = function (attachment) {
            if (this.attachment == attachment)
                return;
            this.attachment = attachment;
            this.attachmentTime = this.bone.skeleton.time;
            this.deform.length = 0;
        };
        Slot.prototype.setAttachmentTime = function (time) {
            this.attachmentTime = this.bone.skeleton.time - time;
        };
        /** The time that has elapsed since the last time the attachment was set or cleared. Relies on Skeleton
         * {@link Skeleton#time}. */
        Slot.prototype.getAttachmentTime = function () {
            return this.bone.skeleton.time - this.attachmentTime;
        };
        /** Sets this slot to the setup pose. */
        Slot.prototype.setToSetupPose = function () {
            this.color.setFromColor(this.data.color);
            if (this.darkColor != null)
                this.darkColor.setFromColor(this.data.darkColor);
            if (this.data.attachmentName == null)
                this.attachment = null;
            else {
                this.attachment = null;
                this.setAttachment(this.bone.skeleton.getAttachment(this.data.index, this.data.attachmentName));
            }
        };
        return Slot;
    }());

    /** Stores the current pose for a transform constraint. A transform constraint adjusts the world transform of the constrained
     * bones to match that of the target bone.
     *
     * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide.
     * @public
     * */
    var TransformConstraint = /** @class */ (function () {
        function TransformConstraint(data, skeleton) {
            this.mixRotate = 0;
            this.mixX = 0;
            this.mixY = 0;
            this.mixScaleX = 0;
            this.mixScaleY = 0;
            this.mixShearY = 0;
            this.temp = new base.Vector2();
            this.active = false;
            if (!data)
                throw new Error("data cannot be null.");
            if (!skeleton)
                throw new Error("skeleton cannot be null.");
            this.data = data;
            this.mixRotate = data.mixRotate;
            this.mixX = data.mixX;
            this.mixY = data.mixY;
            this.mixScaleX = data.mixScaleX;
            this.mixScaleY = data.mixScaleY;
            this.mixShearY = data.mixShearY;
            this.bones = new Array();
            for (var i = 0; i < data.bones.length; i++)
                this.bones.push(skeleton.findBone(data.bones[i].name));
            this.target = skeleton.findBone(data.target.name);
        }
        TransformConstraint.prototype.isActive = function () {
            return this.active;
        };
        TransformConstraint.prototype.update = function () {
            if (this.mixRotate == 0 && this.mixX == 0 && this.mixY == 0 && this.mixScaleX == 0 && this.mixScaleX == 0 && this.mixShearY == 0)
                return;
            if (this.data.local) {
                if (this.data.relative)
                    this.applyRelativeLocal();
                else
                    this.applyAbsoluteLocal();
            }
            else {
                if (this.data.relative)
                    this.applyRelativeWorld();
                else
                    this.applyAbsoluteWorld();
            }
        };
        TransformConstraint.prototype.applyAbsoluteWorld = function () {
            var mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            var translate = mixX != 0 || mixY != 0;
            var target = this.target;
            var targetMat = target.matrix;
            var ta = targetMat.a, tb = targetMat.c, tc = targetMat.b, td = targetMat.d;
            var degRadReflect = ta * td - tb * tc > 0 ? base.MathUtils.degRad : -base.MathUtils.degRad;
            var offsetRotation = this.data.offsetRotation * degRadReflect;
            var offsetShearY = this.data.offsetShearY * degRadReflect;
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                var mat = bone.matrix;
                if (mixRotate != 0) {
                    var a = mat.a, b = mat.c, c = mat.b, d = mat.d;
                    var r = Math.atan2(tc, ta) - Math.atan2(c, a) + offsetRotation;
                    if (r > base.MathUtils.PI)
                        r -= base.MathUtils.PI2;
                    else if (r < -base.MathUtils.PI) //
                        r += base.MathUtils.PI2;
                    r *= mixRotate;
                    var cos = Math.cos(r), sin = Math.sin(r);
                    mat.a = cos * a - sin * c;
                    mat.c = cos * b - sin * d;
                    mat.b = sin * a + cos * c;
                    mat.d = sin * b + cos * d;
                }
                if (translate) {
                    var temp = this.temp;
                    target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                    mat.tx += (temp.x - mat.tx) * mixX;
                    mat.ty += (temp.y - mat.ty) * mixY;
                }
                if (mixScaleX != 0) {
                    var s = Math.sqrt(mat.a * mat.a + mat.b * mat.b);
                    if (s != 0)
                        s = (s + (Math.sqrt(ta * ta + tc * tc) - s + this.data.offsetScaleX) * mixScaleX) / s;
                    mat.a *= s;
                    mat.b *= s;
                }
                if (mixScaleY != 0) {
                    var s = Math.sqrt(mat.c * mat.c + mat.d * mat.d);
                    if (s != 0)
                        s = (s + (Math.sqrt(tb * tb + td * td) - s + this.data.offsetScaleY) * mixScaleY) / s;
                    mat.c *= s;
                    mat.d *= s;
                }
                if (mixShearY > 0) {
                    var b = mat.c, d = mat.d;
                    var by = Math.atan2(d, b);
                    var r = Math.atan2(td, tb) - Math.atan2(tc, ta) - (by - Math.atan2(mat.b, mat.a));
                    if (r > base.MathUtils.PI)
                        r -= base.MathUtils.PI2;
                    else if (r < -base.MathUtils.PI) //
                        r += base.MathUtils.PI2;
                    r = by + (r + offsetShearY) * mixShearY;
                    var s = Math.sqrt(b * b + d * d);
                    mat.c = Math.cos(r) * s;
                    mat.d = Math.sin(r) * s;
                }
                bone.updateAppliedTransform();
            }
        };
        TransformConstraint.prototype.applyRelativeWorld = function () {
            var mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            var translate = mixX != 0 || mixY != 0;
            var target = this.target;
            var targetMat = target.matrix;
            var ta = targetMat.a, tb = targetMat.c, tc = targetMat.b, td = targetMat.d;
            var degRadReflect = ta * td - tb * tc > 0 ? base.MathUtils.degRad : -base.MathUtils.degRad;
            var offsetRotation = this.data.offsetRotation * degRadReflect, offsetShearY = this.data.offsetShearY * degRadReflect;
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                var mat = bone.matrix;
                if (mixRotate != 0) {
                    var a = mat.a, b = mat.c, c = mat.b, d = mat.d;
                    var r = Math.atan2(tc, ta) + offsetRotation;
                    if (r > base.MathUtils.PI)
                        r -= base.MathUtils.PI2;
                    else if (r < -base.MathUtils.PI) //
                        r += base.MathUtils.PI2;
                    r *= mixRotate;
                    var cos = Math.cos(r), sin = Math.sin(r);
                    mat.a = cos * a - sin * c;
                    mat.c = cos * b - sin * d;
                    mat.b = sin * a + cos * c;
                    mat.d = sin * b + cos * d;
                }
                if (translate) {
                    var temp = this.temp;
                    target.localToWorld(temp.set(this.data.offsetX, this.data.offsetY));
                    mat.tx += temp.x * mixX;
                    mat.ty += temp.y * mixY;
                }
                if (mixScaleX != 0) {
                    var s = (Math.sqrt(ta * ta + tc * tc) - 1 + this.data.offsetScaleX) * mixScaleX + 1;
                    mat.a *= s;
                    mat.b *= s;
                }
                if (mixScaleY != 0) {
                    var s = (Math.sqrt(tb * tb + td * td) - 1 + this.data.offsetScaleY) * mixScaleY + 1;
                    mat.c *= s;
                    mat.d *= s;
                }
                if (mixShearY > 0) {
                    var r = Math.atan2(td, tb) - Math.atan2(tc, ta);
                    if (r > base.MathUtils.PI)
                        r -= base.MathUtils.PI2;
                    else if (r < -base.MathUtils.PI) //
                        r += base.MathUtils.PI2;
                    var b = mat.c, d = mat.d;
                    r = Math.atan2(d, b) + (r - base.MathUtils.PI / 2 + offsetShearY) * mixShearY;
                    var s = Math.sqrt(b * b + d * d);
                    mat.c = Math.cos(r) * s;
                    mat.d = Math.sin(r) * s;
                }
                bone.updateAppliedTransform();
            }
        };
        TransformConstraint.prototype.applyAbsoluteLocal = function () {
            var mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            var target = this.target;
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                var rotation = bone.arotation;
                if (mixRotate != 0) {
                    var r = target.arotation - rotation + this.data.offsetRotation;
                    r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                    rotation += r * mixRotate;
                }
                var x = bone.ax, y = bone.ay;
                x += (target.ax - x + this.data.offsetX) * mixX;
                y += (target.ay - y + this.data.offsetY) * mixY;
                var scaleX = bone.ascaleX, scaleY = bone.ascaleY;
                if (mixScaleX != 0 && scaleX != 0)
                    scaleX = (scaleX + (target.ascaleX - scaleX + this.data.offsetScaleX) * mixScaleX) / scaleX;
                if (mixScaleY != 0 && scaleY != 0)
                    scaleY = (scaleY + (target.ascaleY - scaleY + this.data.offsetScaleY) * mixScaleY) / scaleY;
                var shearY = bone.ashearY;
                if (mixShearY != 0) {
                    var r = target.ashearY - shearY + this.data.offsetShearY;
                    r -= (16384 - ((16384.499999999996 - r / 360) | 0)) * 360;
                    shearY += r * mixShearY;
                }
                bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
            }
        };
        TransformConstraint.prototype.applyRelativeLocal = function () {
            var mixRotate = this.mixRotate, mixX = this.mixX, mixY = this.mixY, mixScaleX = this.mixScaleX, mixScaleY = this.mixScaleY, mixShearY = this.mixShearY;
            var target = this.target;
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                var rotation = bone.arotation + (target.arotation + this.data.offsetRotation) * mixRotate;
                var x = bone.ax + (target.ax + this.data.offsetX) * mixX;
                var y = bone.ay + (target.ay + this.data.offsetY) * mixY;
                var scaleX = (bone.ascaleX * ((target.ascaleX - 1 + this.data.offsetScaleX) * mixScaleX) + 1);
                var scaleY = (bone.ascaleY * ((target.ascaleY - 1 + this.data.offsetScaleY) * mixScaleY) + 1);
                var shearY = bone.ashearY + (target.ashearY + this.data.offsetShearY) * mixShearY;
                bone.updateWorldTransformWith(x, y, rotation, scaleX, scaleY, bone.ashearX, shearY);
            }
        };
        return TransformConstraint;
    }());

    /** Stores the current pose for a skeleton.
     *
     * See [Instance objects](http://esotericsoftware.com/spine-runtime-architecture#Instance-objects) in the Spine Runtimes Guide.
     * @public
     * */
    var Skeleton = /** @class */ (function () {
        function Skeleton(data) {
            /** The list of bones and constraints, sorted in the order they should be updated, as computed by {@link #updateCache()}. */
            this._updateCache = new Array();
            /** Returns the skeleton's time. This can be used for tracking, such as with Slot {@link Slot#attachmentTime}.
             * <p>
             * See {@link #update()}. */
            this.time = 0;
            /** Scales the entire skeleton on the X axis. This affects all bones, even if the bone's transform mode disallows scale
             * inheritance. */
            this.scaleX = 1;
            /** Scales the entire skeleton on the Y axis. This affects all bones, even if the bone's transform mode disallows scale
             * inheritance. */
            this.scaleY = 1;
            /** Sets the skeleton X position, which is added to the root bone worldX position. */
            this.x = 0;
            /** Sets the skeleton Y position, which is added to the root bone worldY position. */
            this.y = 0;
            if (!data)
                throw new Error("data cannot be null.");
            this.data = data;
            this.bones = new Array();
            for (var i = 0; i < data.bones.length; i++) {
                var boneData = data.bones[i];
                var bone = void 0;
                if (!boneData.parent)
                    bone = new Bone(boneData, this, null);
                else {
                    var parent_1 = this.bones[boneData.parent.index];
                    bone = new Bone(boneData, this, parent_1);
                    parent_1.children.push(bone);
                }
                this.bones.push(bone);
            }
            this.slots = new Array();
            this.drawOrder = new Array();
            for (var i = 0; i < data.slots.length; i++) {
                var slotData = data.slots[i];
                var bone = this.bones[slotData.boneData.index];
                var slot = new Slot(slotData, bone);
                this.slots.push(slot);
                this.drawOrder.push(slot);
            }
            this.ikConstraints = new Array();
            for (var i = 0; i < data.ikConstraints.length; i++) {
                var ikConstraintData = data.ikConstraints[i];
                this.ikConstraints.push(new IkConstraint(ikConstraintData, this));
            }
            this.transformConstraints = new Array();
            for (var i = 0; i < data.transformConstraints.length; i++) {
                var transformConstraintData = data.transformConstraints[i];
                this.transformConstraints.push(new TransformConstraint(transformConstraintData, this));
            }
            this.pathConstraints = new Array();
            for (var i = 0; i < data.pathConstraints.length; i++) {
                var pathConstraintData = data.pathConstraints[i];
                this.pathConstraints.push(new PathConstraint(pathConstraintData, this));
            }
            this.color = new base.Color(1, 1, 1, 1);
            this.updateCache();
        }
        /** Caches information about bones and constraints. Must be called if the {@link #getSkin()} is modified or if bones,
         * constraints, or weighted path attachments are added or removed. */
        Skeleton.prototype.updateCache = function () {
            var updateCache = this._updateCache;
            updateCache.length = 0;
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                bone.sorted = bone.data.skinRequired;
                bone.active = !bone.sorted;
            }
            if (this.skin) {
                var skinBones = this.skin.bones;
                for (var i = 0, n = this.skin.bones.length; i < n; i++) {
                    var bone = this.bones[skinBones[i].index];
                    do {
                        bone.sorted = false;
                        bone.active = true;
                        bone = bone.parent;
                    } while (bone);
                }
            }
            // IK first, lowest hierarchy depth first.
            var ikConstraints = this.ikConstraints;
            var transformConstraints = this.transformConstraints;
            var pathConstraints = this.pathConstraints;
            var ikCount = ikConstraints.length, transformCount = transformConstraints.length, pathCount = pathConstraints.length;
            var constraintCount = ikCount + transformCount + pathCount;
            outer: for (var i = 0; i < constraintCount; i++) {
                for (var ii = 0; ii < ikCount; ii++) {
                    var constraint = ikConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortIkConstraint(constraint);
                        continue outer;
                    }
                }
                for (var ii = 0; ii < transformCount; ii++) {
                    var constraint = transformConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortTransformConstraint(constraint);
                        continue outer;
                    }
                }
                for (var ii = 0; ii < pathCount; ii++) {
                    var constraint = pathConstraints[ii];
                    if (constraint.data.order == i) {
                        this.sortPathConstraint(constraint);
                        continue outer;
                    }
                }
            }
            for (var i = 0, n = bones.length; i < n; i++)
                this.sortBone(bones[i]);
        };
        Skeleton.prototype.sortIkConstraint = function (constraint) {
            constraint.active = constraint.target.isActive() && (!constraint.data.skinRequired || (this.skin && base.Utils.contains(this.skin.constraints, constraint.data, true)));
            if (!constraint.active)
                return;
            var target = constraint.target;
            this.sortBone(target);
            var constrained = constraint.bones;
            var parent = constrained[0];
            this.sortBone(parent);
            if (constrained.length == 1) {
                this._updateCache.push(constraint);
                this.sortReset(parent.children);
            }
            else {
                var child = constrained[constrained.length - 1];
                this.sortBone(child);
                this._updateCache.push(constraint);
                this.sortReset(parent.children);
                child.sorted = true;
            }
        };
        Skeleton.prototype.sortPathConstraint = function (constraint) {
            constraint.active = constraint.target.bone.isActive() && (!constraint.data.skinRequired || (this.skin && base.Utils.contains(this.skin.constraints, constraint.data, true)));
            if (!constraint.active)
                return;
            var slot = constraint.target;
            var slotIndex = slot.data.index;
            var slotBone = slot.bone;
            if (this.skin)
                this.sortPathConstraintAttachment(this.skin, slotIndex, slotBone);
            if (this.data.defaultSkin && this.data.defaultSkin != this.skin)
                this.sortPathConstraintAttachment(this.data.defaultSkin, slotIndex, slotBone);
            for (var i = 0, n = this.data.skins.length; i < n; i++)
                this.sortPathConstraintAttachment(this.data.skins[i], slotIndex, slotBone);
            var attachment = slot.getAttachment();
            if (attachment instanceof PathAttachment)
                this.sortPathConstraintAttachmentWith(attachment, slotBone);
            var constrained = constraint.bones;
            var boneCount = constrained.length;
            for (var i = 0; i < boneCount; i++)
                this.sortBone(constrained[i]);
            this._updateCache.push(constraint);
            for (var i = 0; i < boneCount; i++)
                this.sortReset(constrained[i].children);
            for (var i = 0; i < boneCount; i++)
                constrained[i].sorted = true;
        };
        Skeleton.prototype.sortTransformConstraint = function (constraint) {
            constraint.active = constraint.target.isActive() && (!constraint.data.skinRequired || (this.skin && base.Utils.contains(this.skin.constraints, constraint.data, true)));
            if (!constraint.active)
                return;
            this.sortBone(constraint.target);
            var constrained = constraint.bones;
            var boneCount = constrained.length;
            if (constraint.data.local) {
                for (var i = 0; i < boneCount; i++) {
                    var child = constrained[i];
                    this.sortBone(child.parent);
                    this.sortBone(child);
                }
            }
            else {
                for (var i = 0; i < boneCount; i++) {
                    this.sortBone(constrained[i]);
                }
            }
            this._updateCache.push(constraint);
            for (var i = 0; i < boneCount; i++)
                this.sortReset(constrained[i].children);
            for (var i = 0; i < boneCount; i++)
                constrained[i].sorted = true;
        };
        Skeleton.prototype.sortPathConstraintAttachment = function (skin, slotIndex, slotBone) {
            var attachments = skin.attachments[slotIndex];
            if (!attachments)
                return;
            for (var key in attachments) {
                this.sortPathConstraintAttachmentWith(attachments[key], slotBone);
            }
        };
        Skeleton.prototype.sortPathConstraintAttachmentWith = function (attachment, slotBone) {
            if (!(attachment instanceof PathAttachment))
                return;
            var pathBones = attachment.bones;
            if (!pathBones)
                this.sortBone(slotBone);
            else {
                var bones = this.bones;
                for (var i = 0, n = pathBones.length; i < n;) {
                    var nn = pathBones[i++];
                    nn += i;
                    while (i < nn)
                        this.sortBone(bones[pathBones[i++]]);
                }
            }
        };
        Skeleton.prototype.sortBone = function (bone) {
            if (bone.sorted)
                return;
            var parent = bone.parent;
            if (parent)
                this.sortBone(parent);
            bone.sorted = true;
            this._updateCache.push(bone);
        };
        Skeleton.prototype.sortReset = function (bones) {
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                if (!bone.active)
                    continue;
                if (bone.sorted)
                    this.sortReset(bone.children);
                bone.sorted = false;
            }
        };
        /** Updates the world transform for each bone and applies all constraints.
         *
         * See [World transforms](http://esotericsoftware.com/spine-runtime-skeletons#World-transforms) in the Spine
         * Runtimes Guide. */
        Skeleton.prototype.updateWorldTransform = function () {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                bone.ax = bone.x;
                bone.ay = bone.y;
                bone.arotation = bone.rotation;
                bone.ascaleX = bone.scaleX;
                bone.ascaleY = bone.scaleY;
                bone.ashearX = bone.shearX;
                bone.ashearY = bone.shearY;
            }
            var updateCache = this._updateCache;
            for (var i = 0, n = updateCache.length; i < n; i++)
                updateCache[i].update();
        };
        Skeleton.prototype.updateWorldTransformWith = function (parent) {
            // Apply the parent bone transform to the root bone. The root bone always inherits scale, rotation and reflection.
            var rootBone = this.getRootBone();
            var pa = parent.matrix.a, pb = parent.matrix.c, pc = parent.matrix.b, pd = parent.matrix.d;
            rootBone.matrix.tx = pa * this.x + pb * this.y + parent.worldX;
            rootBone.matrix.ty = pc * this.x + pd * this.y + parent.worldY;
            var rotationY = rootBone.rotation + 90 + rootBone.shearY;
            var la = base.MathUtils.cosDeg(rootBone.rotation + rootBone.shearX) * rootBone.scaleX;
            var lb = base.MathUtils.cosDeg(rotationY) * rootBone.scaleY;
            var lc = base.MathUtils.sinDeg(rootBone.rotation + rootBone.shearX) * rootBone.scaleX;
            var ld = base.MathUtils.sinDeg(rotationY) * rootBone.scaleY;
            var sx = this.scaleX;
            var sy = base.settings.yDown ? -this.scaleY : this.scaleY;
            rootBone.matrix.a = (pa * la + pb * lc) * sx;
            rootBone.matrix.c = (pa * lb + pb * ld) * sx;
            rootBone.matrix.b = (pc * la + pd * lc) * sy;
            rootBone.matrix.d = (pc * lb + pd * ld) * sy;
            // Update everything except root bone.
            var updateCache = this._updateCache;
            for (var i = 0, n = updateCache.length; i < n; i++) {
                var updatable = updateCache[i];
                if (updatable != rootBone)
                    updatable.update();
            }
        };
        /** Sets the bones, constraints, and slots to their setup pose values. */
        Skeleton.prototype.setToSetupPose = function () {
            this.setBonesToSetupPose();
            this.setSlotsToSetupPose();
        };
        /** Sets the bones and constraints to their setup pose values. */
        Skeleton.prototype.setBonesToSetupPose = function () {
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                bones[i].setToSetupPose();
            var ikConstraints = this.ikConstraints;
            for (var i = 0, n = ikConstraints.length; i < n; i++) {
                var constraint = ikConstraints[i];
                constraint.mix = constraint.data.mix;
                constraint.softness = constraint.data.softness;
                constraint.bendDirection = constraint.data.bendDirection;
                constraint.compress = constraint.data.compress;
                constraint.stretch = constraint.data.stretch;
            }
            var transformConstraints = this.transformConstraints;
            for (var i = 0, n = transformConstraints.length; i < n; i++) {
                var constraint = transformConstraints[i];
                var data = constraint.data;
                constraint.mixRotate = data.mixRotate;
                constraint.mixX = data.mixX;
                constraint.mixY = data.mixY;
                constraint.mixScaleX = data.mixScaleX;
                constraint.mixScaleY = data.mixScaleY;
                constraint.mixShearY = data.mixShearY;
            }
            var pathConstraints = this.pathConstraints;
            for (var i = 0, n = pathConstraints.length; i < n; i++) {
                var constraint = pathConstraints[i];
                var data = constraint.data;
                constraint.position = data.position;
                constraint.spacing = data.spacing;
                constraint.mixRotate = data.mixRotate;
                constraint.mixX = data.mixX;
                constraint.mixY = data.mixY;
            }
        };
        /** Sets the slots and draw order to their setup pose values. */
        Skeleton.prototype.setSlotsToSetupPose = function () {
            var slots = this.slots;
            base.Utils.arrayCopy(slots, 0, this.drawOrder, 0, slots.length);
            for (var i = 0, n = slots.length; i < n; i++)
                slots[i].setToSetupPose();
        };
        /** @returns May return null. */
        Skeleton.prototype.getRootBone = function () {
            if (this.bones.length == 0)
                return null;
            return this.bones[0];
        };
        /** @returns May be null. */
        Skeleton.prototype.findBone = function (boneName) {
            if (!boneName)
                throw new Error("boneName cannot be null.");
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                if (bone.data.name == boneName)
                    return bone;
            }
            return null;
        };
        /** @returns -1 if the bone was not found. */
        Skeleton.prototype.findBoneIndex = function (boneName) {
            if (!boneName)
                throw new Error("boneName cannot be null.");
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                if (bones[i].data.name == boneName)
                    return i;
            return -1;
        };
        /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
         * repeatedly.
         * @returns May be null. */
        Skeleton.prototype.findSlot = function (slotName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++) {
                var slot = slots[i];
                if (slot.data.name == slotName)
                    return slot;
            }
            return null;
        };
        /** @returns -1 if the bone was not found. */
        Skeleton.prototype.findSlotIndex = function (slotName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++)
                if (slots[i].data.name == slotName)
                    return i;
            return -1;
        };
        /** Sets a skin by name.
         *
         * See {@link #setSkin()}. */
        Skeleton.prototype.setSkinByName = function (skinName) {
            var skin = this.data.findSkin(skinName);
            if (!skin)
                throw new Error("Skin not found: " + skinName);
            this.setSkin(skin);
        };
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
        Skeleton.prototype.setSkin = function (newSkin) {
            if (newSkin == this.skin)
                return;
            if (newSkin) {
                if (this.skin)
                    newSkin.attachAll(this, this.skin);
                else {
                    var slots = this.slots;
                    for (var i = 0, n = slots.length; i < n; i++) {
                        var slot = slots[i];
                        var name_1 = slot.data.attachmentName;
                        if (name_1) {
                            var attachment = newSkin.getAttachment(i, name_1);
                            if (attachment)
                                slot.setAttachment(attachment);
                        }
                    }
                }
            }
            this.skin = newSkin;
            this.updateCache();
        };
        /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot name and attachment
         * name.
         *
         * See {@link #getAttachment()}.
         * @returns May be null. */
        Skeleton.prototype.getAttachmentByName = function (slotName, attachmentName) {
            return this.getAttachment(this.data.findSlotIndex(slotName), attachmentName);
        };
        /** Finds an attachment by looking in the {@link #skin} and {@link SkeletonData#defaultSkin} using the slot index and
         * attachment name. First the skin is checked and if the attachment was not found, the default skin is checked.
         *
         * See [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
         * @returns May be null. */
        Skeleton.prototype.getAttachment = function (slotIndex, attachmentName) {
            if (!attachmentName)
                throw new Error("attachmentName cannot be null.");
            if (this.skin) {
                var attachment = this.skin.getAttachment(slotIndex, attachmentName);
                if (attachment)
                    return attachment;
            }
            if (this.data.defaultSkin)
                return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
            return null;
        };
        /** A convenience method to set an attachment by finding the slot with {@link #findSlot()}, finding the attachment with
         * {@link #getAttachment()}, then setting the slot's {@link Slot#attachment}.
         * @param attachmentName May be null to clear the slot's attachment. */
        Skeleton.prototype.setAttachment = function (slotName, attachmentName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++) {
                var slot = slots[i];
                if (slot.data.name == slotName) {
                    var attachment = null;
                    if (attachmentName) {
                        attachment = this.getAttachment(i, attachmentName);
                        if (!attachment)
                            throw new Error("Attachment not found: " + attachmentName + ", for slot: " + slotName);
                    }
                    slot.setAttachment(attachment);
                    return;
                }
            }
            throw new Error("Slot not found: " + slotName);
        };
        /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
         * than to call it repeatedly.
         * @return May be null. */
        Skeleton.prototype.findIkConstraint = function (constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            var ikConstraints = this.ikConstraints;
            for (var i = 0, n = ikConstraints.length; i < n; i++) {
                var ikConstraint = ikConstraints[i];
                if (ikConstraint.data.name == constraintName)
                    return ikConstraint;
            }
            return null;
        };
        /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
         * this method than to call it repeatedly.
         * @return May be null. */
        Skeleton.prototype.findTransformConstraint = function (constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            var transformConstraints = this.transformConstraints;
            for (var i = 0, n = transformConstraints.length; i < n; i++) {
                var constraint = transformConstraints[i];
                if (constraint.data.name == constraintName)
                    return constraint;
            }
            return null;
        };
        /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
         * than to call it repeatedly.
         * @return May be null. */
        Skeleton.prototype.findPathConstraint = function (constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            var pathConstraints = this.pathConstraints;
            for (var i = 0, n = pathConstraints.length; i < n; i++) {
                var constraint = pathConstraints[i];
                if (constraint.data.name == constraintName)
                    return constraint;
            }
            return null;
        };
        /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the current pose.
         * @param offset An output value, the distance from the skeleton origin to the bottom left corner of the AABB.
         * @param size An output value, the width and height of the AABB.
         * @param temp Working memory to temporarily store attachments' computed world vertices. */
        Skeleton.prototype.getBounds = function (offset, size, temp) {
            if (temp === void 0) { temp = new Array(2); }
            if (!offset)
                throw new Error("offset cannot be null.");
            if (!size)
                throw new Error("size cannot be null.");
            var drawOrder = this.drawOrder;
            var minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
            for (var i = 0, n = drawOrder.length; i < n; i++) {
                var slot = drawOrder[i];
                if (!slot.bone.active)
                    continue;
                var verticesLength = 0;
                var vertices = null;
                var attachment = slot.getAttachment();
                if (attachment instanceof RegionAttachment) {
                    verticesLength = 8;
                    vertices = base.Utils.setArraySize(temp, verticesLength, 0);
                    attachment.computeWorldVertices(slot.bone, vertices, 0, 2);
                }
                else if (attachment instanceof MeshAttachment) {
                    var mesh = attachment;
                    verticesLength = mesh.worldVerticesLength;
                    vertices = base.Utils.setArraySize(temp, verticesLength, 0);
                    mesh.computeWorldVertices(slot, 0, verticesLength, vertices, 0, 2);
                }
                if (vertices) {
                    for (var ii = 0, nn = vertices.length; ii < nn; ii += 2) {
                        var x = vertices[ii], y = vertices[ii + 1];
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            offset.set(minX, minY);
            size.set(maxX - minX, maxY - minY);
        };
        /** Increments the skeleton's {@link #time}. */
        Skeleton.prototype.update = function (delta) {
            this.time += delta;
        };
        Object.defineProperty(Skeleton.prototype, "flipX", {
            get: function () {
                return this.scaleX == -1;
            },
            set: function (value) {
                if (!Skeleton.deprecatedWarning1) {
                    Skeleton.deprecatedWarning1 = true;
                    console.warn("Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY");
                }
                this.scaleX = value ? 1.0 : -1.0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Skeleton.prototype, "flipY", {
            get: function () {
                return this.scaleY == -1;
            },
            set: function (value) {
                if (!Skeleton.deprecatedWarning1) {
                    Skeleton.deprecatedWarning1 = true;
                    console.warn("Spine Deprecation Warning: `Skeleton.flipX/flipY` was deprecated, please use scaleX/scaleY");
                }
                this.scaleY = value ? 1.0 : -1.0;
            },
            enumerable: false,
            configurable: true
        });
        Skeleton.deprecatedWarning1 = false;
        return Skeleton;
    }());

    /** Stores the setup pose and all of the stateless data for a skeleton.
     *
     * See [Data objects](http://esotericsoftware.com/spine-runtime-architecture#Data-objects) in the Spine Runtimes
     * Guide.
     * @public
     * */
    var SkeletonData = /** @class */ (function () {
        function SkeletonData() {
            /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
            this.bones = new Array(); // Ordered parents first.
            /** The skeleton's slots. */
            this.slots = new Array(); // Setup pose draw order.
            this.skins = new Array();
            /** The skeleton's events. */
            this.events = new Array();
            /** The skeleton's animations. */
            this.animations = new Array();
            /** The skeleton's IK constraints. */
            this.ikConstraints = new Array();
            /** The skeleton's transform constraints. */
            this.transformConstraints = new Array();
            /** The skeleton's path constraints. */
            this.pathConstraints = new Array();
            // Nonessential
            /** The dopesheet FPS in Spine. Available only when nonessential data was exported. */
            this.fps = 0;
        }
        /** Finds a bone by comparing each bone's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        SkeletonData.prototype.findBone = function (boneName) {
            if (!boneName)
                throw new Error("boneName cannot be null.");
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++) {
                var bone = bones[i];
                if (bone.name == boneName)
                    return bone;
            }
            return null;
        };
        SkeletonData.prototype.findBoneIndex = function (boneName) {
            if (!boneName)
                throw new Error("boneName cannot be null.");
            var bones = this.bones;
            for (var i = 0, n = bones.length; i < n; i++)
                if (bones[i].name == boneName)
                    return i;
            return -1;
        };
        /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        SkeletonData.prototype.findSlot = function (slotName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++) {
                var slot = slots[i];
                if (slot.name == slotName)
                    return slot;
            }
            return null;
        };
        SkeletonData.prototype.findSlotIndex = function (slotName) {
            if (!slotName)
                throw new Error("slotName cannot be null.");
            var slots = this.slots;
            for (var i = 0, n = slots.length; i < n; i++)
                if (slots[i].name == slotName)
                    return i;
            return -1;
        };
        /** Finds a skin by comparing each skin's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        SkeletonData.prototype.findSkin = function (skinName) {
            if (!skinName)
                throw new Error("skinName cannot be null.");
            var skins = this.skins;
            for (var i = 0, n = skins.length; i < n; i++) {
                var skin = skins[i];
                if (skin.name == skinName)
                    return skin;
            }
            return null;
        };
        /** Finds an event by comparing each events's name. It is more efficient to cache the results of this method than to call it
         * multiple times.
         * @returns May be null. */
        SkeletonData.prototype.findEvent = function (eventDataName) {
            if (!eventDataName)
                throw new Error("eventDataName cannot be null.");
            var events = this.events;
            for (var i = 0, n = events.length; i < n; i++) {
                var event_1 = events[i];
                if (event_1.name == eventDataName)
                    return event_1;
            }
            return null;
        };
        /** Finds an animation by comparing each animation's name. It is more efficient to cache the results of this method than to
         * call it multiple times.
         * @returns May be null. */
        SkeletonData.prototype.findAnimation = function (animationName) {
            if (!animationName)
                throw new Error("animationName cannot be null.");
            var animations = this.animations;
            for (var i = 0, n = animations.length; i < n; i++) {
                var animation = animations[i];
                if (animation.name == animationName)
                    return animation;
            }
            return null;
        };
        /** Finds an IK constraint by comparing each IK constraint's name. It is more efficient to cache the results of this method
         * than to call it multiple times.
         * @return May be null. */
        SkeletonData.prototype.findIkConstraint = function (constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            var ikConstraints = this.ikConstraints;
            for (var i = 0, n = ikConstraints.length; i < n; i++) {
                var constraint = ikConstraints[i];
                if (constraint.name == constraintName)
                    return constraint;
            }
            return null;
        };
        /** Finds a transform constraint by comparing each transform constraint's name. It is more efficient to cache the results of
         * this method than to call it multiple times.
         * @return May be null. */
        SkeletonData.prototype.findTransformConstraint = function (constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            var transformConstraints = this.transformConstraints;
            for (var i = 0, n = transformConstraints.length; i < n; i++) {
                var constraint = transformConstraints[i];
                if (constraint.name == constraintName)
                    return constraint;
            }
            return null;
        };
        /** Finds a path constraint by comparing each path constraint's name. It is more efficient to cache the results of this method
         * than to call it multiple times.
         * @return May be null. */
        SkeletonData.prototype.findPathConstraint = function (constraintName) {
            if (!constraintName)
                throw new Error("constraintName cannot be null.");
            var pathConstraints = this.pathConstraints;
            for (var i = 0, n = pathConstraints.length; i < n; i++) {
                var constraint = pathConstraints[i];
                if (constraint.name == constraintName)
                    return constraint;
            }
            return null;
        };
        SkeletonData.prototype.findPathConstraintIndex = function (pathConstraintName) {
            if (pathConstraintName == null)
                throw new Error("pathConstraintName cannot be null.");
            var pathConstraints = this.pathConstraints;
            for (var i = 0, n = pathConstraints.length; i < n; i++)
                if (pathConstraints[i].name == pathConstraintName)
                    return i;
            return -1;
        };
        return SkeletonData;
    }());

    /** Stores the setup pose for a {@link Slot}.
     * @public
     * */
    var SlotData = /** @class */ (function () {
        function SlotData(index, name, boneData) {
            /** The color used to tint the slot's attachment. If {@link #getDarkColor()} is set, this is used as the light color for two
             * color tinting. */
            this.color = new base.Color(1, 1, 1, 1);
            if (index < 0)
                throw new Error("index must be >= 0.");
            if (!name)
                throw new Error("name cannot be null.");
            if (!boneData)
                throw new Error("boneData cannot be null.");
            this.index = index;
            this.name = name;
            this.boneData = boneData;
        }
        return SlotData;
    }());

    /** Stores the setup pose for a {@link TransformConstraint}.
     *
     * See [Transform constraints](http://esotericsoftware.com/spine-transform-constraints) in the Spine User Guide.
     * @public
     * */
    var TransformConstraintData = /** @class */ (function (_super) {
        __extends(TransformConstraintData, _super);
        function TransformConstraintData(name) {
            var _this = _super.call(this, name, 0, false) || this;
            /** The bones that will be modified by this transform constraint. */
            _this.bones = new Array();
            _this.mixRotate = 0;
            _this.mixX = 0;
            _this.mixY = 0;
            _this.mixScaleX = 0;
            _this.mixScaleY = 0;
            _this.mixShearY = 0;
            /** An offset added to the constrained bone rotation. */
            _this.offsetRotation = 0;
            /** An offset added to the constrained bone X translation. */
            _this.offsetX = 0;
            /** An offset added to the constrained bone Y translation. */
            _this.offsetY = 0;
            /** An offset added to the constrained bone scaleX. */
            _this.offsetScaleX = 0;
            /** An offset added to the constrained bone scaleY. */
            _this.offsetScaleY = 0;
            /** An offset added to the constrained bone shearY. */
            _this.offsetShearY = 0;
            _this.relative = false;
            _this.local = false;
            return _this;
        }
        return TransformConstraintData;
    }(ConstraintData));

    /** Stores an entry in the skin consisting of the slot index, name, and attachment
     * @public
     * **/
    var SkinEntry = /** @class */ (function () {
        function SkinEntry(slotIndex, name, attachment) {
            this.slotIndex = slotIndex;
            this.name = name;
            this.attachment = attachment;
        }
        return SkinEntry;
    }());
    /** Stores attachments by slot index and attachment name.
     *
     * See SkeletonData {@link SkeletonData#defaultSkin}, Skeleton {@link Skeleton#skin}, and
     * [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
     * @public
     * */
    var Skin = /** @class */ (function () {
        function Skin(name) {
            this.attachments = new Array();
            this.bones = Array();
            this.constraints = new Array();
            if (!name)
                throw new Error("name cannot be null.");
            this.name = name;
        }
        /** Adds an attachment to the skin for the specified slot index and name. */
        Skin.prototype.setAttachment = function (slotIndex, name, attachment) {
            if (!attachment)
                throw new Error("attachment cannot be null.");
            var attachments = this.attachments;
            if (slotIndex >= attachments.length)
                attachments.length = slotIndex + 1;
            if (!attachments[slotIndex])
                attachments[slotIndex] = {};
            attachments[slotIndex][name] = attachment;
        };
        /** Adds all attachments, bones, and constraints from the specified skin to this skin. */
        Skin.prototype.addSkin = function (skin) {
            for (var i = 0; i < skin.bones.length; i++) {
                var bone = skin.bones[i];
                var contained = false;
                for (var ii = 0; ii < this.bones.length; ii++) {
                    if (this.bones[ii] == bone) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.bones.push(bone);
            }
            for (var i = 0; i < skin.constraints.length; i++) {
                var constraint = skin.constraints[i];
                var contained = false;
                for (var ii = 0; ii < this.constraints.length; ii++) {
                    if (this.constraints[ii] == constraint) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.constraints.push(constraint);
            }
            var attachments = skin.getAttachments();
            for (var i = 0; i < attachments.length; i++) {
                var attachment = attachments[i];
                this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
            }
        };
        /** Adds all bones and constraints and copies of all attachments from the specified skin to this skin. Mesh attachments are not
         * copied, instead a new linked mesh is created. The attachment copies can be modified without affecting the originals. */
        Skin.prototype.copySkin = function (skin) {
            for (var i = 0; i < skin.bones.length; i++) {
                var bone = skin.bones[i];
                var contained = false;
                for (var ii = 0; ii < this.bones.length; ii++) {
                    if (this.bones[ii] == bone) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.bones.push(bone);
            }
            for (var i = 0; i < skin.constraints.length; i++) {
                var constraint = skin.constraints[i];
                var contained = false;
                for (var ii = 0; ii < this.constraints.length; ii++) {
                    if (this.constraints[ii] == constraint) {
                        contained = true;
                        break;
                    }
                }
                if (!contained)
                    this.constraints.push(constraint);
            }
            var attachments = skin.getAttachments();
            for (var i = 0; i < attachments.length; i++) {
                var attachment = attachments[i];
                if (!attachment.attachment)
                    continue;
                if (attachment.attachment instanceof MeshAttachment) {
                    attachment.attachment = attachment.attachment.newLinkedMesh();
                    this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
                }
                else {
                    attachment.attachment = attachment.attachment.copy();
                    this.setAttachment(attachment.slotIndex, attachment.name, attachment.attachment);
                }
            }
        };
        /** Returns the attachment for the specified slot index and name, or null. */
        Skin.prototype.getAttachment = function (slotIndex, name) {
            var dictionary = this.attachments[slotIndex];
            return dictionary ? dictionary[name] : null;
        };
        /** Removes the attachment in the skin for the specified slot index and name, if any. */
        Skin.prototype.removeAttachment = function (slotIndex, name) {
            var dictionary = this.attachments[slotIndex];
            if (dictionary)
                dictionary[name] = null;
        };
        /** Returns all attachments in this skin. */
        Skin.prototype.getAttachments = function () {
            var entries = new Array();
            for (var i = 0; i < this.attachments.length; i++) {
                var slotAttachments = this.attachments[i];
                if (slotAttachments) {
                    for (var name_1 in slotAttachments) {
                        var attachment = slotAttachments[name_1];
                        if (attachment)
                            entries.push(new SkinEntry(i, name_1, attachment));
                    }
                }
            }
            return entries;
        };
        /** Returns all attachments in this skin for the specified slot index. */
        Skin.prototype.getAttachmentsForSlot = function (slotIndex, attachments) {
            var slotAttachments = this.attachments[slotIndex];
            if (slotAttachments) {
                for (var name_2 in slotAttachments) {
                    var attachment = slotAttachments[name_2];
                    if (attachment)
                        attachments.push(new SkinEntry(slotIndex, name_2, attachment));
                }
            }
        };
        /** Clears all attachments, bones, and constraints. */
        Skin.prototype.clear = function () {
            this.attachments.length = 0;
            this.bones.length = 0;
            this.constraints.length = 0;
        };
        /** Attach each attachment in this skin if the corresponding attachment in the old skin is currently attached. */
        Skin.prototype.attachAll = function (skeleton, oldSkin) {
            var slotIndex = 0;
            for (var i = 0; i < skeleton.slots.length; i++) {
                var slot = skeleton.slots[i];
                var slotAttachment = slot.getAttachment();
                if (slotAttachment && slotIndex < oldSkin.attachments.length) {
                    var dictionary = oldSkin.attachments[slotIndex];
                    for (var key in dictionary) {
                        var skinAttachment = dictionary[key];
                        if (slotAttachment == skinAttachment) {
                            var attachment = this.getAttachment(slotIndex, key);
                            if (attachment)
                                slot.setAttachment(attachment);
                            break;
                        }
                    }
                }
                slotIndex++;
            }
        };
        return Skin;
    }());

    /** Loads skeleton data in the Spine binary format.
     *
     * See [Spine binary format](http://esotericsoftware.com/spine-binary-format) and
     * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
     * Runtimes Guide.
     * @public
     * */
    var SkeletonBinary = /** @class */ (function () {
        function SkeletonBinary(attachmentLoader) {
            /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
             * runtime than were used in Spine.
             *
             * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
            this.scale = 1;
            this.linkedMeshes = new Array();
            this.attachmentLoader = attachmentLoader;
        }
        SkeletonBinary.prototype.readSkeletonData = function (binary) {
            var scale = this.scale;
            var skeletonData = new SkeletonData();
            skeletonData.name = ""; // BOZO
            var input = new base.BinaryInput(binary);
            var lowHash = input.readInt32();
            var highHash = input.readInt32();
            skeletonData.hash = highHash == 0 && lowHash == 0 ? null : highHash.toString(16) + lowHash.toString(16);
            skeletonData.version = input.readString();
            if (skeletonData.version.substr(0, 3) !== '4.0') {
                var error = "Spine 4.0 loader cant load version " + skeletonData.version + ". Please configure your pixi-spine bundle";
                console.error(error);
            }
            skeletonData.x = input.readFloat();
            skeletonData.y = input.readFloat();
            skeletonData.width = input.readFloat();
            skeletonData.height = input.readFloat();
            var nonessential = input.readBoolean();
            if (nonessential) {
                skeletonData.fps = input.readFloat();
                skeletonData.imagesPath = input.readString();
                skeletonData.audioPath = input.readString();
            }
            var n = 0;
            // Strings.
            n = input.readInt(true);
            for (var i = 0; i < n; i++)
                input.strings.push(input.readString());
            // Bones.
            n = input.readInt(true);
            for (var i = 0; i < n; i++) {
                var name_1 = input.readString();
                var parent_1 = i == 0 ? null : skeletonData.bones[input.readInt(true)];
                var data = new BoneData(i, name_1, parent_1);
                data.rotation = input.readFloat();
                data.x = input.readFloat() * scale;
                data.y = input.readFloat() * scale;
                data.scaleX = input.readFloat();
                data.scaleY = input.readFloat();
                data.shearX = input.readFloat();
                data.shearY = input.readFloat();
                data.length = input.readFloat() * scale;
                data.transformMode = input.readInt(true);
                data.skinRequired = input.readBoolean();
                if (nonessential)
                    base.Color.rgba8888ToColor(data.color, input.readInt32());
                skeletonData.bones.push(data);
            }
            // Slots.
            n = input.readInt(true);
            for (var i = 0; i < n; i++) {
                var slotName = input.readString();
                var boneData = skeletonData.bones[input.readInt(true)];
                var data = new SlotData(i, slotName, boneData);
                base.Color.rgba8888ToColor(data.color, input.readInt32());
                var darkColor = input.readInt32();
                if (darkColor != -1)
                    base.Color.rgb888ToColor(data.darkColor = new base.Color(), darkColor);
                data.attachmentName = input.readStringRef();
                data.blendMode = SkeletonBinary.BlendModeValues[input.readInt(true)];
                skeletonData.slots.push(data);
            }
            // IK constraints.
            n = input.readInt(true);
            for (var i = 0, nn = void 0; i < n; i++) {
                var data = new IkConstraintData(input.readString());
                data.order = input.readInt(true);
                data.skinRequired = input.readBoolean();
                nn = input.readInt(true);
                for (var ii = 0; ii < nn; ii++)
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
            for (var i = 0, nn = void 0; i < n; i++) {
                var data = new TransformConstraintData(input.readString());
                data.order = input.readInt(true);
                data.skinRequired = input.readBoolean();
                nn = input.readInt(true);
                for (var ii = 0; ii < nn; ii++)
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
            for (var i = 0, nn = void 0; i < n; i++) {
                var data = new PathConstraintData(input.readString());
                data.order = input.readInt(true);
                data.skinRequired = input.readBoolean();
                nn = input.readInt(true);
                for (var ii = 0; ii < nn; ii++)
                    data.bones.push(skeletonData.bones[input.readInt(true)]);
                data.target = skeletonData.slots[input.readInt(true)];
                data.positionMode = input.readInt(true);
                data.spacingMode = input.readInt(true);
                data.rotateMode = input.readInt(true);
                data.offsetRotation = input.readFloat();
                data.position = input.readFloat();
                if (data.positionMode == exports.PositionMode.Fixed)
                    data.position *= scale;
                data.spacing = input.readFloat();
                if (data.spacingMode == exports.SpacingMode.Length || data.spacingMode == exports.SpacingMode.Fixed)
                    data.spacing *= scale;
                data.mixRotate = input.readFloat();
                data.mixX = input.readFloat();
                data.mixY = input.readFloat();
                skeletonData.pathConstraints.push(data);
            }
            // Default skin.
            var defaultSkin = this.readSkin(input, skeletonData, true, nonessential);
            if (defaultSkin) {
                skeletonData.defaultSkin = defaultSkin;
                skeletonData.skins.push(defaultSkin);
            }
            // Skins.
            {
                var i = skeletonData.skins.length;
                base.Utils.setArraySize(skeletonData.skins, n = i + input.readInt(true));
                for (; i < n; i++)
                    skeletonData.skins[i] = this.readSkin(input, skeletonData, false, nonessential);
            }
            // Linked meshes.
            n = this.linkedMeshes.length;
            for (var i = 0; i < n; i++) {
                var linkedMesh = this.linkedMeshes[i];
                var skin = !linkedMesh.skin ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
                var parent_2 = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
                linkedMesh.mesh.deformAttachment = linkedMesh.inheritDeform ? parent_2 : linkedMesh.mesh;
                linkedMesh.mesh.setParentMesh(parent_2);
                // linkedMesh.mesh.updateUVs();
            }
            this.linkedMeshes.length = 0;
            // Events.
            n = input.readInt(true);
            for (var i = 0; i < n; i++) {
                var data = new EventData(input.readStringRef());
                data.intValue = input.readInt(false);
                data.floatValue = input.readFloat();
                data.stringValue = input.readString();
                data.audioPath = input.readString();
                if (data.audioPath) {
                    data.volume = input.readFloat();
                    data.balance = input.readFloat();
                }
                skeletonData.events.push(data);
            }
            // Animations.
            n = input.readInt(true);
            for (var i = 0; i < n; i++)
                skeletonData.animations.push(this.readAnimation(input, input.readString(), skeletonData));
            return skeletonData;
        };
        SkeletonBinary.prototype.readSkin = function (input, skeletonData, defaultSkin, nonessential) {
            var skin = null;
            var slotCount = 0;
            if (defaultSkin) {
                slotCount = input.readInt(true);
                if (slotCount == 0)
                    return null;
                skin = new Skin("default");
            }
            else {
                skin = new Skin(input.readStringRef());
                skin.bones.length = input.readInt(true);
                for (var i = 0, n = skin.bones.length; i < n; i++)
                    skin.bones[i] = skeletonData.bones[input.readInt(true)];
                for (var i = 0, n = input.readInt(true); i < n; i++)
                    skin.constraints.push(skeletonData.ikConstraints[input.readInt(true)]);
                for (var i = 0, n = input.readInt(true); i < n; i++)
                    skin.constraints.push(skeletonData.transformConstraints[input.readInt(true)]);
                for (var i = 0, n = input.readInt(true); i < n; i++)
                    skin.constraints.push(skeletonData.pathConstraints[input.readInt(true)]);
                slotCount = input.readInt(true);
            }
            for (var i = 0; i < slotCount; i++) {
                var slotIndex = input.readInt(true);
                for (var ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    var name_2 = input.readStringRef();
                    var attachment = this.readAttachment(input, skeletonData, skin, slotIndex, name_2, nonessential);
                    if (attachment)
                        skin.setAttachment(slotIndex, name_2, attachment);
                }
            }
            return skin;
        };
        SkeletonBinary.prototype.readAttachment = function (input, skeletonData, skin, slotIndex, attachmentName, nonessential) {
            var scale = this.scale;
            var name = input.readStringRef();
            if (!name)
                name = attachmentName;
            switch (input.readByte()) {
                case base.AttachmentType.Region: {
                    var path = input.readStringRef();
                    var rotation = input.readFloat();
                    var x = input.readFloat();
                    var y = input.readFloat();
                    var scaleX = input.readFloat();
                    var scaleY = input.readFloat();
                    var width = input.readFloat();
                    var height = input.readFloat();
                    var color = input.readInt32();
                    if (!path)
                        path = name;
                    var region = this.attachmentLoader.newRegionAttachment(skin, name, path);
                    if (!region)
                        return null;
                    region.path = path;
                    region.x = x * scale;
                    region.y = y * scale;
                    region.scaleX = scaleX;
                    region.scaleY = scaleY;
                    region.rotation = rotation;
                    region.width = width * scale;
                    region.height = height * scale;
                    base.Color.rgba8888ToColor(region.color, color);
                    // region.updateOffset();
                    return region;
                }
                case base.AttachmentType.BoundingBox: {
                    var vertexCount = input.readInt(true);
                    var vertices = this.readVertices(input, vertexCount);
                    var color = nonessential ? input.readInt32() : 0;
                    var box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
                    if (!box)
                        return null;
                    box.worldVerticesLength = vertexCount << 1;
                    box.vertices = vertices.vertices;
                    box.bones = vertices.bones;
                    if (nonessential)
                        base.Color.rgba8888ToColor(box.color, color);
                    return box;
                }
                case base.AttachmentType.Mesh: {
                    var path = input.readStringRef();
                    var color = input.readInt32();
                    var vertexCount = input.readInt(true);
                    var uvs = this.readFloatArray(input, vertexCount << 1, 1);
                    var triangles = this.readShortArray(input);
                    var vertices = this.readVertices(input, vertexCount);
                    var hullLength = input.readInt(true);
                    var edges = null;
                    var width = 0, height = 0;
                    if (nonessential) {
                        edges = this.readShortArray(input);
                        width = input.readFloat();
                        height = input.readFloat();
                    }
                    if (!path)
                        path = name;
                    var mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                    if (!mesh)
                        return null;
                    mesh.path = path;
                    base.Color.rgba8888ToColor(mesh.color, color);
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
                case base.AttachmentType.LinkedMesh: {
                    var path = input.readStringRef();
                    var color = input.readInt32();
                    var skinName = input.readStringRef();
                    var parent_3 = input.readStringRef();
                    var inheritDeform = input.readBoolean();
                    var width = 0, height = 0;
                    if (nonessential) {
                        width = input.readFloat();
                        height = input.readFloat();
                    }
                    if (!path)
                        path = name;
                    var mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                    if (!mesh)
                        return null;
                    mesh.path = path;
                    base.Color.rgba8888ToColor(mesh.color, color);
                    if (nonessential) {
                        mesh.width = width * scale;
                        mesh.height = height * scale;
                    }
                    this.linkedMeshes.push(new LinkedMesh$1(mesh, skinName, slotIndex, parent_3, inheritDeform));
                    return mesh;
                }
                case base.AttachmentType.Path: {
                    var closed_1 = input.readBoolean();
                    var constantSpeed = input.readBoolean();
                    var vertexCount = input.readInt(true);
                    var vertices = this.readVertices(input, vertexCount);
                    var lengths = base.Utils.newArray(vertexCount / 3, 0);
                    for (var i = 0, n = lengths.length; i < n; i++)
                        lengths[i] = input.readFloat() * scale;
                    var color = nonessential ? input.readInt32() : 0;
                    var path = this.attachmentLoader.newPathAttachment(skin, name);
                    if (!path)
                        return null;
                    path.closed = closed_1;
                    path.constantSpeed = constantSpeed;
                    path.worldVerticesLength = vertexCount << 1;
                    path.vertices = vertices.vertices;
                    path.bones = vertices.bones;
                    path.lengths = lengths;
                    if (nonessential)
                        base.Color.rgba8888ToColor(path.color, color);
                    return path;
                }
                case base.AttachmentType.Point: {
                    var rotation = input.readFloat();
                    var x = input.readFloat();
                    var y = input.readFloat();
                    var color = nonessential ? input.readInt32() : 0;
                    var point = this.attachmentLoader.newPointAttachment(skin, name);
                    if (!point)
                        return null;
                    point.x = x * scale;
                    point.y = y * scale;
                    point.rotation = rotation;
                    if (nonessential)
                        base.Color.rgba8888ToColor(point.color, color);
                    return point;
                }
                case base.AttachmentType.Clipping: {
                    var endSlotIndex = input.readInt(true);
                    var vertexCount = input.readInt(true);
                    var vertices = this.readVertices(input, vertexCount);
                    var color = nonessential ? input.readInt32() : 0;
                    var clip = this.attachmentLoader.newClippingAttachment(skin, name);
                    if (!clip)
                        return null;
                    clip.endSlot = skeletonData.slots[endSlotIndex];
                    clip.worldVerticesLength = vertexCount << 1;
                    clip.vertices = vertices.vertices;
                    clip.bones = vertices.bones;
                    if (nonessential)
                        base.Color.rgba8888ToColor(clip.color, color);
                    return clip;
                }
            }
            return null;
        };
        SkeletonBinary.prototype.readVertices = function (input, vertexCount) {
            var scale = this.scale;
            var verticesLength = vertexCount << 1;
            var vertices = new Vertices();
            if (!input.readBoolean()) {
                vertices.vertices = this.readFloatArray(input, verticesLength, scale);
                return vertices;
            }
            var weights = new Array();
            var bonesArray = new Array();
            for (var i = 0; i < vertexCount; i++) {
                var boneCount = input.readInt(true);
                bonesArray.push(boneCount);
                for (var ii = 0; ii < boneCount; ii++) {
                    bonesArray.push(input.readInt(true));
                    weights.push(input.readFloat() * scale);
                    weights.push(input.readFloat() * scale);
                    weights.push(input.readFloat());
                }
            }
            vertices.vertices = base.Utils.toFloatArray(weights);
            vertices.bones = bonesArray;
            return vertices;
        };
        SkeletonBinary.prototype.readFloatArray = function (input, n, scale) {
            var array = new Array(n);
            if (scale == 1) {
                for (var i = 0; i < n; i++)
                    array[i] = input.readFloat();
            }
            else {
                for (var i = 0; i < n; i++)
                    array[i] = input.readFloat() * scale;
            }
            return array;
        };
        SkeletonBinary.prototype.readShortArray = function (input) {
            var n = input.readInt(true);
            var array = new Array(n);
            for (var i = 0; i < n; i++)
                array[i] = input.readShort();
            return array;
        };
        SkeletonBinary.prototype.readAnimation = function (input, name, skeletonData) {
            input.readInt(true); // Number of timelines.
            var timelines = new Array();
            var scale = this.scale;
            // Slot timelines.
            for (var i = 0, n = input.readInt(true); i < n; i++) {
                var slotIndex = input.readInt(true);
                for (var ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    var timelineType = input.readByte();
                    var frameCount = input.readInt(true);
                    var frameLast = frameCount - 1;
                    switch (timelineType) {
                        case SLOT_ATTACHMENT: {
                            var timeline = new AttachmentTimeline(frameCount, slotIndex);
                            for (var frame = 0; frame < frameCount; frame++)
                                timeline.setFrame(frame, input.readFloat(), input.readStringRef());
                            timelines.push(timeline);
                            break;
                        }
                        case SLOT_RGBA: {
                            var bezierCount = input.readInt(true);
                            var timeline = new RGBATimeline(frameCount, bezierCount, slotIndex);
                            var time = input.readFloat();
                            var r = input.readUnsignedByte() / 255.0;
                            var g = input.readUnsignedByte() / 255.0;
                            var b = input.readUnsignedByte() / 255.0;
                            var a = input.readUnsignedByte() / 255.0;
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b, a);
                                if (frame == frameLast)
                                    break;
                                var time2 = input.readFloat();
                                var r2 = input.readUnsignedByte() / 255.0;
                                var g2 = input.readUnsignedByte() / 255.0;
                                var b2 = input.readUnsignedByte() / 255.0;
                                var a2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                                        setBezier(input, timeline, bezier++, frame, 3, time, time2, a, a2, 1);
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
                        case SLOT_RGB: {
                            var bezierCount = input.readInt(true);
                            var timeline = new RGBTimeline(frameCount, bezierCount, slotIndex);
                            var time = input.readFloat();
                            var r = input.readUnsignedByte() / 255.0;
                            var g = input.readUnsignedByte() / 255.0;
                            var b = input.readUnsignedByte() / 255.0;
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b);
                                if (frame == frameLast)
                                    break;
                                var time2 = input.readFloat();
                                var r2 = input.readUnsignedByte() / 255.0;
                                var g2 = input.readUnsignedByte() / 255.0;
                                var b2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                                }
                                time = time2;
                                r = r2;
                                g = g2;
                                b = b2;
                            }
                            timelines.push(timeline);
                            break;
                        }
                        case SLOT_RGBA2: {
                            var bezierCount = input.readInt(true);
                            var timeline = new RGBA2Timeline(frameCount, bezierCount, slotIndex);
                            var time = input.readFloat();
                            var r = input.readUnsignedByte() / 255.0;
                            var g = input.readUnsignedByte() / 255.0;
                            var b = input.readUnsignedByte() / 255.0;
                            var a = input.readUnsignedByte() / 255.0;
                            var r2 = input.readUnsignedByte() / 255.0;
                            var g2 = input.readUnsignedByte() / 255.0;
                            var b2 = input.readUnsignedByte() / 255.0;
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b, a, r2, g2, b2);
                                if (frame == frameLast)
                                    break;
                                var time2 = input.readFloat();
                                var nr = input.readUnsignedByte() / 255.0;
                                var ng = input.readUnsignedByte() / 255.0;
                                var nb = input.readUnsignedByte() / 255.0;
                                var na = input.readUnsignedByte() / 255.0;
                                var nr2 = input.readUnsignedByte() / 255.0;
                                var ng2 = input.readUnsignedByte() / 255.0;
                                var nb2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                                        setBezier(input, timeline, bezier++, frame, 3, time, time2, a, na, 1);
                                        setBezier(input, timeline, bezier++, frame, 4, time, time2, r2, nr2, 1);
                                        setBezier(input, timeline, bezier++, frame, 5, time, time2, g2, ng2, 1);
                                        setBezier(input, timeline, bezier++, frame, 6, time, time2, b2, nb2, 1);
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
                        case SLOT_RGB2: {
                            var bezierCount = input.readInt(true);
                            var timeline = new RGB2Timeline(frameCount, bezierCount, slotIndex);
                            var time = input.readFloat();
                            var r = input.readUnsignedByte() / 255.0;
                            var g = input.readUnsignedByte() / 255.0;
                            var b = input.readUnsignedByte() / 255.0;
                            var r2 = input.readUnsignedByte() / 255.0;
                            var g2 = input.readUnsignedByte() / 255.0;
                            var b2 = input.readUnsignedByte() / 255.0;
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, r, g, b, r2, g2, b2);
                                if (frame == frameLast)
                                    break;
                                var time2 = input.readFloat();
                                var nr = input.readUnsignedByte() / 255.0;
                                var ng = input.readUnsignedByte() / 255.0;
                                var nb = input.readUnsignedByte() / 255.0;
                                var nr2 = input.readUnsignedByte() / 255.0;
                                var ng2 = input.readUnsignedByte() / 255.0;
                                var nb2 = input.readUnsignedByte() / 255.0;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                                        setBezier(input, timeline, bezier++, frame, 3, time, time2, r2, nr2, 1);
                                        setBezier(input, timeline, bezier++, frame, 4, time, time2, g2, ng2, 1);
                                        setBezier(input, timeline, bezier++, frame, 5, time, time2, b2, nb2, 1);
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
                        case SLOT_ALPHA: {
                            var timeline = new AlphaTimeline(frameCount, input.readInt(true), slotIndex);
                            var time = input.readFloat(), a = input.readUnsignedByte() / 255;
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, a);
                                if (frame == frameLast)
                                    break;
                                var time2 = input.readFloat();
                                var a2 = input.readUnsignedByte() / 255;
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, a, a2, 1);
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
            for (var i = 0, n = input.readInt(true); i < n; i++) {
                var boneIndex = input.readInt(true);
                for (var ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    var type = input.readByte(), frameCount = input.readInt(true), bezierCount = input.readInt(true);
                    switch (type) {
                        case BONE_ROTATE:
                            timelines.push(readTimeline1$1(input, new RotateTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_TRANSLATE:
                            timelines.push(readTimeline2$1(input, new TranslateTimeline(frameCount, bezierCount, boneIndex), scale));
                            break;
                        case BONE_TRANSLATEX:
                            timelines.push(readTimeline1$1(input, new TranslateXTimeline(frameCount, bezierCount, boneIndex), scale));
                            break;
                        case BONE_TRANSLATEY:
                            timelines.push(readTimeline1$1(input, new TranslateYTimeline(frameCount, bezierCount, boneIndex), scale));
                            break;
                        case BONE_SCALE:
                            timelines.push(readTimeline2$1(input, new ScaleTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SCALEX:
                            timelines.push(readTimeline1$1(input, new ScaleXTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SCALEY:
                            timelines.push(readTimeline1$1(input, new ScaleYTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SHEAR:
                            timelines.push(readTimeline2$1(input, new ShearTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SHEARX:
                            timelines.push(readTimeline1$1(input, new ShearXTimeline(frameCount, bezierCount, boneIndex), 1));
                            break;
                        case BONE_SHEARY:
                            timelines.push(readTimeline1$1(input, new ShearYTimeline(frameCount, bezierCount, boneIndex), 1));
                    }
                }
            }
            // IK constraint timelines.
            for (var i = 0, n = input.readInt(true); i < n; i++) {
                var index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
                var timeline = new IkConstraintTimeline(frameCount, input.readInt(true), index);
                var time = input.readFloat(), mix = input.readFloat(), softness = input.readFloat() * scale;
                for (var frame = 0, bezier = 0;; frame++) {
                    timeline.setFrame(frame, time, mix, softness, input.readByte(), input.readBoolean(), input.readBoolean());
                    if (frame == frameLast)
                        break;
                    var time2 = input.readFloat(), mix2 = input.readFloat(), softness2 = input.readFloat() * scale;
                    switch (input.readByte()) {
                        case CURVE_STEPPED:
                            timeline.setStepped(frame);
                            break;
                        case CURVE_BEZIER:
                            setBezier(input, timeline, bezier++, frame, 0, time, time2, mix, mix2, 1);
                            setBezier(input, timeline, bezier++, frame, 1, time, time2, softness, softness2, scale);
                    }
                    time = time2;
                    mix = mix2;
                    softness = softness2;
                }
                timelines.push(timeline);
            }
            // Transform constraint timelines.
            for (var i = 0, n = input.readInt(true); i < n; i++) {
                var index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
                var timeline = new TransformConstraintTimeline(frameCount, input.readInt(true), index);
                var time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat(), mixScaleX = input.readFloat(), mixScaleY = input.readFloat(), mixShearY = input.readFloat();
                for (var frame = 0, bezier = 0;; frame++) {
                    timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
                    if (frame == frameLast)
                        break;
                    var time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(), mixY2 = input.readFloat(), mixScaleX2 = input.readFloat(), mixScaleY2 = input.readFloat(), mixShearY2 = input.readFloat();
                    switch (input.readByte()) {
                        case CURVE_STEPPED:
                            timeline.setStepped(frame);
                            break;
                        case CURVE_BEZIER:
                            setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                            setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
                            setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
                            setBezier(input, timeline, bezier++, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
                            setBezier(input, timeline, bezier++, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
                            setBezier(input, timeline, bezier++, frame, 5, time, time2, mixShearY, mixShearY2, 1);
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
            for (var i = 0, n = input.readInt(true); i < n; i++) {
                var index = input.readInt(true);
                var data = skeletonData.pathConstraints[index];
                for (var ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    switch (input.readByte()) {
                        case PATH_POSITION:
                            timelines
                                .push(readTimeline1$1(input, new PathConstraintPositionTimeline(input.readInt(true), input.readInt(true), index), data.positionMode == exports.PositionMode.Fixed ? scale : 1));
                            break;
                        case PATH_SPACING:
                            timelines
                                .push(readTimeline1$1(input, new PathConstraintSpacingTimeline(input.readInt(true), input.readInt(true), index), data.spacingMode == exports.SpacingMode.Length || data.spacingMode == exports.SpacingMode.Fixed ? scale : 1));
                            break;
                        case PATH_MIX:
                            var timeline = new PathConstraintMixTimeline(input.readInt(true), input.readInt(true), index);
                            var time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat();
                            for (var frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
                                timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                                if (frame == frameLast)
                                    break;
                                var time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(), mixY2 = input.readFloat();
                                switch (input.readByte()) {
                                    case CURVE_STEPPED:
                                        timeline.setStepped(frame);
                                        break;
                                    case CURVE_BEZIER:
                                        setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                                        setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
                                        setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
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
            for (var i = 0, n = input.readInt(true); i < n; i++) {
                var skin = skeletonData.skins[input.readInt(true)];
                for (var ii = 0, nn = input.readInt(true); ii < nn; ii++) {
                    var slotIndex = input.readInt(true);
                    for (var iii = 0, nnn = input.readInt(true); iii < nnn; iii++) {
                        var attachmentName = input.readStringRef();
                        var attachment = skin.getAttachment(slotIndex, attachmentName);
                        var weighted = attachment.bones;
                        var vertices = attachment.vertices;
                        var deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;
                        var frameCount = input.readInt(true);
                        var frameLast = frameCount - 1;
                        var bezierCount = input.readInt(true);
                        var timeline = new DeformTimeline(frameCount, bezierCount, slotIndex, attachment);
                        var time = input.readFloat();
                        for (var frame = 0, bezier = 0;; frame++) {
                            var deform = void 0;
                            var end = input.readInt(true);
                            if (end == 0)
                                deform = weighted ? base.Utils.newFloatArray(deformLength) : vertices;
                            else {
                                deform = base.Utils.newFloatArray(deformLength);
                                var start = input.readInt(true);
                                end += start;
                                if (scale == 1) {
                                    for (var v = start; v < end; v++)
                                        deform[v] = input.readFloat();
                                }
                                else {
                                    for (var v = start; v < end; v++)
                                        deform[v] = input.readFloat() * scale;
                                }
                                if (!weighted) {
                                    for (var v = 0, vn = deform.length; v < vn; v++)
                                        deform[v] += vertices[v];
                                }
                            }
                            timeline.setFrame(frame, time, deform);
                            if (frame == frameLast)
                                break;
                            var time2 = input.readFloat();
                            switch (input.readByte()) {
                                case CURVE_STEPPED:
                                    timeline.setStepped(frame);
                                    break;
                                case CURVE_BEZIER:
                                    setBezier(input, timeline, bezier++, frame, 0, time, time2, 0, 1, 1);
                            }
                            time = time2;
                        }
                        timelines.push(timeline);
                    }
                }
            }
            // Draw order timeline.
            var drawOrderCount = input.readInt(true);
            if (drawOrderCount > 0) {
                var timeline = new DrawOrderTimeline(drawOrderCount);
                var slotCount = skeletonData.slots.length;
                for (var i = 0; i < drawOrderCount; i++) {
                    var time = input.readFloat();
                    var offsetCount = input.readInt(true);
                    var drawOrder = base.Utils.newArray(slotCount, 0);
                    for (var ii = slotCount - 1; ii >= 0; ii--)
                        drawOrder[ii] = -1;
                    var unchanged = base.Utils.newArray(slotCount - offsetCount, 0);
                    var originalIndex = 0, unchangedIndex = 0;
                    for (var ii = 0; ii < offsetCount; ii++) {
                        var slotIndex = input.readInt(true);
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
                    for (var ii = slotCount - 1; ii >= 0; ii--)
                        if (drawOrder[ii] == -1)
                            drawOrder[ii] = unchanged[--unchangedIndex];
                    timeline.setFrame(i, time, drawOrder);
                }
                timelines.push(timeline);
            }
            // Event timeline.
            var eventCount = input.readInt(true);
            if (eventCount > 0) {
                var timeline = new EventTimeline(eventCount);
                for (var i = 0; i < eventCount; i++) {
                    var time = input.readFloat();
                    var eventData = skeletonData.events[input.readInt(true)];
                    var event_1 = new Event(time, eventData);
                    event_1.intValue = input.readInt(false);
                    event_1.floatValue = input.readFloat();
                    event_1.stringValue = input.readBoolean() ? input.readString() : eventData.stringValue;
                    if (event_1.data.audioPath) {
                        event_1.volume = input.readFloat();
                        event_1.balance = input.readFloat();
                    }
                    timeline.setFrame(i, event_1);
                }
                timelines.push(timeline);
            }
            var duration = 0;
            for (var i = 0, n = timelines.length; i < n; i++)
                duration = Math.max(duration, timelines[i].getDuration());
            return new Animation(name, timelines, duration);
        };
        SkeletonBinary.BlendModeValues = [constants.BLEND_MODES.NORMAL, constants.BLEND_MODES.ADD, constants.BLEND_MODES.MULTIPLY, constants.BLEND_MODES.SCREEN];
        return SkeletonBinary;
    }());
    var LinkedMesh$1 = /** @class */ (function () {
        function LinkedMesh(mesh, skin, slotIndex, parent, inheritDeform) {
            this.mesh = mesh;
            this.skin = skin;
            this.slotIndex = slotIndex;
            this.parent = parent;
            this.inheritDeform = inheritDeform;
        }
        return LinkedMesh;
    }());
    var Vertices = /** @class */ (function () {
        function Vertices(bones, vertices) {
            if (bones === void 0) { bones = null; }
            if (vertices === void 0) { vertices = null; }
            this.bones = bones;
            this.vertices = vertices;
        }
        return Vertices;
    }());
    function readTimeline1$1(input, timeline, scale) {
        var time = input.readFloat(), value = input.readFloat() * scale;
        for (var frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
            timeline.setFrame(frame, time, value);
            if (frame == frameLast)
                break;
            var time2 = input.readFloat(), value2 = input.readFloat() * scale;
            switch (input.readByte()) {
                case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, value, value2, 1);
            }
            time = time2;
            value = value2;
        }
        return timeline;
    }
    function readTimeline2$1(input, timeline, scale) {
        var time = input.readFloat(), value1 = input.readFloat() * scale, value2 = input.readFloat() * scale;
        for (var frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1;; frame++) {
            timeline.setFrame(frame, time, value1, value2);
            if (frame == frameLast)
                break;
            var time2 = input.readFloat(), nvalue1 = input.readFloat() * scale, nvalue2 = input.readFloat() * scale;
            switch (input.readByte()) {
                case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, value1, nvalue1, scale);
                    setBezier(input, timeline, bezier++, frame, 1, time, time2, value2, nvalue2, scale);
            }
            time = time2;
            value1 = nvalue1;
            value2 = nvalue2;
        }
        return timeline;
    }
    function setBezier(input, timeline, bezier, frame, value, time1, time2, value1, value2, scale) {
        timeline.setBezier(bezier, frame, value, time1, value1, input.readFloat(), input.readFloat() * scale, input.readFloat(), input.readFloat() * scale, time2, value2);
    }
    var BONE_ROTATE = 0;
    var BONE_TRANSLATE = 1;
    var BONE_TRANSLATEX = 2;
    var BONE_TRANSLATEY = 3;
    var BONE_SCALE = 4;
    var BONE_SCALEX = 5;
    var BONE_SCALEY = 6;
    var BONE_SHEAR = 7;
    var BONE_SHEARX = 8;
    var BONE_SHEARY = 9;
    var SLOT_ATTACHMENT = 0;
    var SLOT_RGBA = 1;
    var SLOT_RGB = 2;
    var SLOT_RGBA2 = 3;
    var SLOT_RGB2 = 4;
    var SLOT_ALPHA = 5;
    var PATH_POSITION = 0;
    var PATH_SPACING = 1;
    var PATH_MIX = 2;
    // @ts-ignore
    var CURVE_LINEAR = 0;
    var CURVE_STEPPED = 1;
    var CURVE_BEZIER = 2;

    /** Collects each visible {@link BoundingBoxAttachment} and computes the world vertices for its polygon. The polygon vertices are
     * provided along with convenience methods for doing hit detection.
     * @public
     * */
    var SkeletonBounds = /** @class */ (function () {
        function SkeletonBounds() {
            /** The left edge of the axis aligned bounding box. */
            this.minX = 0;
            /** The bottom edge of the axis aligned bounding box. */
            this.minY = 0;
            /** The right edge of the axis aligned bounding box. */
            this.maxX = 0;
            /** The top edge of the axis aligned bounding box. */
            this.maxY = 0;
            /** The visible bounding boxes. */
            this.boundingBoxes = new Array();
            /** The world vertices for the bounding box polygons. */
            this.polygons = new Array();
            this.polygonPool = new base.Pool(function () {
                return base.Utils.newFloatArray(16);
            });
        }
        /** Clears any previous polygons, finds all visible bounding box attachments, and computes the world vertices for each bounding
         * box's polygon.
         * @param updateAabb If true, the axis aligned bounding box containing all the polygons is computed. If false, the
         *           SkeletonBounds AABB methods will always return true. */
        SkeletonBounds.prototype.update = function (skeleton, updateAabb) {
            if (skeleton == null)
                throw new Error("skeleton cannot be null.");
            var boundingBoxes = this.boundingBoxes;
            var polygons = this.polygons;
            var polygonPool = this.polygonPool;
            var slots = skeleton.slots;
            var slotCount = slots.length;
            boundingBoxes.length = 0;
            polygonPool.freeAll(polygons);
            polygons.length = 0;
            for (var i = 0; i < slotCount; i++) {
                var slot = slots[i];
                if (!slot.bone.active)
                    continue;
                var attachment = slot.getAttachment();
                if (attachment instanceof BoundingBoxAttachment) {
                    var boundingBox = attachment;
                    boundingBoxes.push(boundingBox);
                    var polygon = polygonPool.obtain();
                    if (polygon.length != boundingBox.worldVerticesLength) {
                        polygon = base.Utils.newFloatArray(boundingBox.worldVerticesLength);
                    }
                    polygons.push(polygon);
                    boundingBox.computeWorldVertices(slot, 0, boundingBox.worldVerticesLength, polygon, 0, 2);
                }
            }
            if (updateAabb) {
                this.aabbCompute();
            }
            else {
                this.minX = Number.POSITIVE_INFINITY;
                this.minY = Number.POSITIVE_INFINITY;
                this.maxX = Number.NEGATIVE_INFINITY;
                this.maxY = Number.NEGATIVE_INFINITY;
            }
        };
        SkeletonBounds.prototype.aabbCompute = function () {
            var minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
            var polygons = this.polygons;
            for (var i = 0, n = polygons.length; i < n; i++) {
                var polygon = polygons[i];
                var vertices = polygon;
                for (var ii = 0, nn = polygon.length; ii < nn; ii += 2) {
                    var x = vertices[ii];
                    var y = vertices[ii + 1];
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
        };
        /** Returns true if the axis aligned bounding box contains the point. */
        SkeletonBounds.prototype.aabbContainsPoint = function (x, y) {
            return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
        };
        /** Returns true if the axis aligned bounding box intersects the line segment. */
        SkeletonBounds.prototype.aabbIntersectsSegment = function (x1, y1, x2, y2) {
            var minX = this.minX;
            var minY = this.minY;
            var maxX = this.maxX;
            var maxY = this.maxY;
            if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
                return false;
            var m = (y2 - y1) / (x2 - x1);
            var y = m * (minX - x1) + y1;
            if (y > minY && y < maxY)
                return true;
            y = m * (maxX - x1) + y1;
            if (y > minY && y < maxY)
                return true;
            var x = (minY - y1) / m + x1;
            if (x > minX && x < maxX)
                return true;
            x = (maxY - y1) / m + x1;
            if (x > minX && x < maxX)
                return true;
            return false;
        };
        /** Returns true if the axis aligned bounding box intersects the axis aligned bounding box of the specified bounds. */
        SkeletonBounds.prototype.aabbIntersectsSkeleton = function (bounds) {
            return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
        };
        /** Returns the first bounding box attachment that contains the point, or null. When doing many checks, it is usually more
         * efficient to only call this method if {@link #aabbContainsPoint(float, float)} returns true. */
        SkeletonBounds.prototype.containsPoint = function (x, y) {
            var polygons = this.polygons;
            for (var i = 0, n = polygons.length; i < n; i++)
                if (this.containsPointPolygon(polygons[i], x, y))
                    return this.boundingBoxes[i];
            return null;
        };
        /** Returns true if the polygon contains the point. */
        SkeletonBounds.prototype.containsPointPolygon = function (polygon, x, y) {
            var vertices = polygon;
            var nn = polygon.length;
            var prevIndex = nn - 2;
            var inside = false;
            for (var ii = 0; ii < nn; ii += 2) {
                var vertexY = vertices[ii + 1];
                var prevY = vertices[prevIndex + 1];
                if ((vertexY < y && prevY >= y) || (prevY < y && vertexY >= y)) {
                    var vertexX = vertices[ii];
                    if (vertexX + (y - vertexY) / (prevY - vertexY) * (vertices[prevIndex] - vertexX) < x)
                        inside = !inside;
                }
                prevIndex = ii;
            }
            return inside;
        };
        /** Returns the first bounding box attachment that contains any part of the line segment, or null. When doing many checks, it
         * is usually more efficient to only call this method if {@link #aabbIntersectsSegment()} returns
         * true. */
        SkeletonBounds.prototype.intersectsSegment = function (x1, y1, x2, y2) {
            var polygons = this.polygons;
            for (var i = 0, n = polygons.length; i < n; i++)
                if (this.intersectsSegmentPolygon(polygons[i], x1, y1, x2, y2))
                    return this.boundingBoxes[i];
            return null;
        };
        /** Returns true if the polygon contains any part of the line segment. */
        SkeletonBounds.prototype.intersectsSegmentPolygon = function (polygon, x1, y1, x2, y2) {
            var vertices = polygon;
            var nn = polygon.length;
            var width12 = x1 - x2, height12 = y1 - y2;
            var det1 = x1 * y2 - y1 * x2;
            var x3 = vertices[nn - 2], y3 = vertices[nn - 1];
            for (var ii = 0; ii < nn; ii += 2) {
                var x4 = vertices[ii], y4 = vertices[ii + 1];
                var det2 = x3 * y4 - y3 * x4;
                var width34 = x3 - x4, height34 = y3 - y4;
                var det3 = width12 * height34 - height12 * width34;
                var x = (det1 * width34 - width12 * det2) / det3;
                if (((x >= x3 && x <= x4) || (x >= x4 && x <= x3)) && ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))) {
                    var y = (det1 * height34 - height12 * det2) / det3;
                    if (((y >= y3 && y <= y4) || (y >= y4 && y <= y3)) && ((y >= y1 && y <= y2) || (y >= y2 && y <= y1)))
                        return true;
                }
                x3 = x4;
                y3 = y4;
            }
            return false;
        };
        /** Returns the polygon for the specified bounding box, or null. */
        SkeletonBounds.prototype.getPolygon = function (boundingBox) {
            if (boundingBox == null)
                throw new Error("boundingBox cannot be null.");
            var index = this.boundingBoxes.indexOf(boundingBox);
            return index == -1 ? null : this.polygons[index];
        };
        /** The width of the axis aligned bounding box. */
        SkeletonBounds.prototype.getWidth = function () {
            return this.maxX - this.minX;
        };
        /** The height of the axis aligned bounding box. */
        SkeletonBounds.prototype.getHeight = function () {
            return this.maxY - this.minY;
        };
        return SkeletonBounds;
    }());

    /** Loads skeleton data in the Spine JSON format.
     *
     * See [Spine JSON format](http://esotericsoftware.com/spine-json-format) and
     * [JSON and binary data](http://esotericsoftware.com/spine-loading-skeleton-data#JSON-and-binary-data) in the Spine
     * Runtimes Guide.
     * @public
     * */
    var SkeletonJson = /** @class */ (function () {
        function SkeletonJson(attachmentLoader) {
            /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
             * runtime than were used in Spine.
             *
             * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
            this.scale = 1;
            this.linkedMeshes = new Array();
            this.attachmentLoader = attachmentLoader;
        }
        SkeletonJson.prototype.readSkeletonData = function (json) {
            var scale = this.scale;
            var skeletonData = new SkeletonData();
            var root = typeof (json) === "string" ? JSON.parse(json) : json;
            // Skeleton
            var skeletonMap = root.skeleton;
            if (skeletonMap) {
                skeletonData.hash = skeletonMap.hash;
                skeletonData.version = skeletonMap.spine;
                if (skeletonData.version.substr(0, 3) !== '4.0') {
                    var error = "Spine 4.0 loader cant load version " + skeletonMap.spine + ". Please configure your pixi-spine bundle";
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
                for (var i = 0; i < root.bones.length; i++) {
                    var boneMap = root.bones[i];
                    var parent_1 = null;
                    var parentName = getValue(boneMap, "parent", null);
                    if (parentName != null) {
                        parent_1 = skeletonData.findBone(parentName);
                        if (parent_1 == null)
                            throw new Error("Parent bone not found: " + parentName);
                    }
                    var data = new BoneData(skeletonData.bones.length, boneMap.name, parent_1);
                    data.length = getValue(boneMap, "length", 0) * scale;
                    data.x = getValue(boneMap, "x", 0) * scale;
                    data.y = getValue(boneMap, "y", 0) * scale;
                    data.rotation = getValue(boneMap, "rotation", 0);
                    data.scaleX = getValue(boneMap, "scaleX", 1);
                    data.scaleY = getValue(boneMap, "scaleY", 1);
                    data.shearX = getValue(boneMap, "shearX", 0);
                    data.shearY = getValue(boneMap, "shearY", 0);
                    data.transformMode = base.Utils.enumValue(exports.TransformMode, getValue(boneMap, "transform", "Normal"));
                    data.skinRequired = getValue(boneMap, "skin", false);
                    var color = getValue(boneMap, "color", null);
                    if (color)
                        data.color.setFromString(color);
                    skeletonData.bones.push(data);
                }
            }
            // Slots.
            if (root.slots) {
                for (var i = 0; i < root.slots.length; i++) {
                    var slotMap = root.slots[i];
                    var slotName = slotMap.name;
                    var boneName = slotMap.bone;
                    var boneData = skeletonData.findBone(boneName);
                    if (boneData == null)
                        throw new Error("Slot bone not found: " + boneName);
                    var data = new SlotData(skeletonData.slots.length, slotName, boneData);
                    var color = getValue(slotMap, "color", null);
                    if (color)
                        data.color.setFromString(color);
                    var dark = getValue(slotMap, "dark", null);
                    if (dark)
                        data.darkColor = base.Color.fromString(dark);
                    data.attachmentName = getValue(slotMap, "attachment", null);
                    data.blendMode = SkeletonJson.blendModeFromString(getValue(slotMap, "blend", "normal"));
                    skeletonData.slots.push(data);
                }
            }
            // IK constraints
            if (root.ik) {
                for (var i = 0; i < root.ik.length; i++) {
                    var constraintMap = root.ik[i];
                    var data = new IkConstraintData(constraintMap.name);
                    data.order = getValue(constraintMap, "order", 0);
                    data.skinRequired = getValue(constraintMap, "skin", false);
                    for (var ii = 0; ii < constraintMap.bones.length; ii++) {
                        var boneName = constraintMap.bones[ii];
                        var bone = skeletonData.findBone(boneName);
                        if (bone == null)
                            throw new Error("IK bone not found: " + boneName);
                        data.bones.push(bone);
                    }
                    data.target = skeletonData.findBone(constraintMap.target);
                    data.mix = getValue(constraintMap, "mix", 1);
                    data.softness = getValue(constraintMap, "softness", 0) * scale;
                    data.bendDirection = getValue(constraintMap, "bendPositive", true) ? 1 : -1;
                    data.compress = getValue(constraintMap, "compress", false);
                    data.stretch = getValue(constraintMap, "stretch", false);
                    data.uniform = getValue(constraintMap, "uniform", false);
                    skeletonData.ikConstraints.push(data);
                }
            }
            // Transform constraints.
            if (root.transform) {
                for (var i = 0; i < root.transform.length; i++) {
                    var constraintMap = root.transform[i];
                    var data = new TransformConstraintData(constraintMap.name);
                    data.order = getValue(constraintMap, "order", 0);
                    data.skinRequired = getValue(constraintMap, "skin", false);
                    for (var ii = 0; ii < constraintMap.bones.length; ii++) {
                        var boneName = constraintMap.bones[ii];
                        var bone = skeletonData.findBone(boneName);
                        if (bone == null)
                            throw new Error("Transform constraint bone not found: " + boneName);
                        data.bones.push(bone);
                    }
                    var targetName = constraintMap.target;
                    data.target = skeletonData.findBone(targetName);
                    if (data.target == null)
                        throw new Error("Transform constraint target bone not found: " + targetName);
                    data.local = getValue(constraintMap, "local", false);
                    data.relative = getValue(constraintMap, "relative", false);
                    data.offsetRotation = getValue(constraintMap, "rotation", 0);
                    data.offsetX = getValue(constraintMap, "x", 0) * scale;
                    data.offsetY = getValue(constraintMap, "y", 0) * scale;
                    data.offsetScaleX = getValue(constraintMap, "scaleX", 0);
                    data.offsetScaleY = getValue(constraintMap, "scaleY", 0);
                    data.offsetShearY = getValue(constraintMap, "shearY", 0);
                    data.mixRotate = getValue(constraintMap, "mixRotate", 1);
                    data.mixX = getValue(constraintMap, "mixX", 1);
                    data.mixY = getValue(constraintMap, "mixY", data.mixX);
                    data.mixScaleX = getValue(constraintMap, "mixScaleX", 1);
                    data.mixScaleY = getValue(constraintMap, "mixScaleY", data.mixScaleX);
                    data.mixShearY = getValue(constraintMap, "mixShearY", 1);
                    skeletonData.transformConstraints.push(data);
                }
            }
            // Path constraints.
            if (root.path) {
                for (var i = 0; i < root.path.length; i++) {
                    var constraintMap = root.path[i];
                    var data = new PathConstraintData(constraintMap.name);
                    data.order = getValue(constraintMap, "order", 0);
                    data.skinRequired = getValue(constraintMap, "skin", false);
                    for (var ii = 0; ii < constraintMap.bones.length; ii++) {
                        var boneName = constraintMap.bones[ii];
                        var bone = skeletonData.findBone(boneName);
                        if (bone == null)
                            throw new Error("Transform constraint bone not found: " + boneName);
                        data.bones.push(bone);
                    }
                    var targetName = constraintMap.target;
                    data.target = skeletonData.findSlot(targetName);
                    if (data.target == null)
                        throw new Error("Path target slot not found: " + targetName);
                    data.positionMode = base.Utils.enumValue(exports.PositionMode, getValue(constraintMap, "positionMode", "Percent"));
                    data.spacingMode = base.Utils.enumValue(exports.SpacingMode, getValue(constraintMap, "spacingMode", "Length"));
                    data.rotateMode = base.Utils.enumValue(exports.RotateMode, getValue(constraintMap, "rotateMode", "Tangent"));
                    data.offsetRotation = getValue(constraintMap, "rotation", 0);
                    data.position = getValue(constraintMap, "position", 0);
                    if (data.positionMode == exports.PositionMode.Fixed)
                        data.position *= scale;
                    data.spacing = getValue(constraintMap, "spacing", 0);
                    if (data.spacingMode == exports.SpacingMode.Length || data.spacingMode == exports.SpacingMode.Fixed)
                        data.spacing *= scale;
                    data.mixRotate = getValue(constraintMap, "mixRotate", 1);
                    data.mixX = getValue(constraintMap, "mixX", 1);
                    data.mixY = getValue(constraintMap, "mixY", data.mixX);
                    skeletonData.pathConstraints.push(data);
                }
            }
            // Skins.
            if (root.skins) {
                for (var i = 0; i < root.skins.length; i++) {
                    var skinMap = root.skins[i];
                    var skin = new Skin(skinMap.name);
                    if (skinMap.bones) {
                        for (var ii = 0; ii < skinMap.bones.length; ii++) {
                            var bone = skeletonData.findBone(skinMap.bones[ii]);
                            if (bone == null)
                                throw new Error("Skin bone not found: " + skinMap.bones[i]);
                            skin.bones.push(bone);
                        }
                    }
                    if (skinMap.ik) {
                        for (var ii = 0; ii < skinMap.ik.length; ii++) {
                            var constraint = skeletonData.findIkConstraint(skinMap.ik[ii]);
                            if (constraint == null)
                                throw new Error("Skin IK constraint not found: " + skinMap.ik[i]);
                            skin.constraints.push(constraint);
                        }
                    }
                    if (skinMap.transform) {
                        for (var ii = 0; ii < skinMap.transform.length; ii++) {
                            var constraint = skeletonData.findTransformConstraint(skinMap.transform[ii]);
                            if (constraint == null)
                                throw new Error("Skin transform constraint not found: " + skinMap.transform[i]);
                            skin.constraints.push(constraint);
                        }
                    }
                    if (skinMap.path) {
                        for (var ii = 0; ii < skinMap.path.length; ii++) {
                            var constraint = skeletonData.findPathConstraint(skinMap.path[ii]);
                            if (constraint == null)
                                throw new Error("Skin path constraint not found: " + skinMap.path[i]);
                            skin.constraints.push(constraint);
                        }
                    }
                    for (var slotName in skinMap.attachments) {
                        var slot = skeletonData.findSlot(slotName);
                        if (slot == null)
                            throw new Error("Slot not found: " + slotName);
                        var slotMap = skinMap.attachments[slotName];
                        for (var entryName in slotMap) {
                            var attachment = this.readAttachment(slotMap[entryName], skin, slot.index, entryName, skeletonData);
                            if (attachment)
                                skin.setAttachment(slot.index, entryName, attachment);
                        }
                    }
                    skeletonData.skins.push(skin);
                    if (skin.name == "default")
                        skeletonData.defaultSkin = skin;
                }
            }
            // Linked meshes.
            for (var i = 0, n = this.linkedMeshes.length; i < n; i++) {
                var linkedMesh = this.linkedMeshes[i];
                var skin = !linkedMesh.skin ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
                var parent_2 = skin.getAttachment(linkedMesh.slotIndex, linkedMesh.parent);
                linkedMesh.mesh.deformAttachment = linkedMesh.inheritDeform ? parent_2 : linkedMesh.mesh;
                linkedMesh.mesh.setParentMesh(parent_2);
                // linkedMesh.mesh.updateUVs();
            }
            this.linkedMeshes.length = 0;
            // Events.
            if (root.events) {
                for (var eventName in root.events) {
                    var eventMap = root.events[eventName];
                    var data = new EventData(eventName);
                    data.intValue = getValue(eventMap, "int", 0);
                    data.floatValue = getValue(eventMap, "float", 0);
                    data.stringValue = getValue(eventMap, "string", "");
                    data.audioPath = getValue(eventMap, "audio", null);
                    if (data.audioPath) {
                        data.volume = getValue(eventMap, "volume", 1);
                        data.balance = getValue(eventMap, "balance", 0);
                    }
                    skeletonData.events.push(data);
                }
            }
            // Animations.
            if (root.animations) {
                for (var animationName in root.animations) {
                    var animationMap = root.animations[animationName];
                    this.readAnimation(animationMap, animationName, skeletonData);
                }
            }
            return skeletonData;
        };
        SkeletonJson.prototype.readAttachment = function (map, skin, slotIndex, name, skeletonData) {
            var scale = this.scale;
            name = getValue(map, "name", name);
            switch (getValue(map, "type", "region")) {
                case "region": {
                    var path = getValue(map, "path", name);
                    var region = this.attachmentLoader.newRegionAttachment(skin, name, path);
                    if (!region)
                        return null;
                    region.path = path;
                    region.x = getValue(map, "x", 0) * scale;
                    region.y = getValue(map, "y", 0) * scale;
                    region.scaleX = getValue(map, "scaleX", 1);
                    region.scaleY = getValue(map, "scaleY", 1);
                    region.rotation = getValue(map, "rotation", 0);
                    region.width = map.width * scale;
                    region.height = map.height * scale;
                    var color = getValue(map, "color", null);
                    if (color)
                        region.color.setFromString(color);
                    // region.updateOffset();
                    return region;
                }
                case "boundingbox": {
                    var box = this.attachmentLoader.newBoundingBoxAttachment(skin, name);
                    if (!box)
                        return null;
                    this.readVertices(map, box, map.vertexCount << 1);
                    var color = getValue(map, "color", null);
                    if (color)
                        box.color.setFromString(color);
                    return box;
                }
                case "mesh":
                case "linkedmesh": {
                    var path = getValue(map, "path", name);
                    var mesh = this.attachmentLoader.newMeshAttachment(skin, name, path);
                    if (!mesh)
                        return null;
                    mesh.path = path;
                    var color = getValue(map, "color", null);
                    if (color)
                        mesh.color.setFromString(color);
                    mesh.width = getValue(map, "width", 0) * scale;
                    mesh.height = getValue(map, "height", 0) * scale;
                    var parent_3 = getValue(map, "parent", null);
                    if (parent_3) {
                        this.linkedMeshes.push(new LinkedMesh(mesh, getValue(map, "skin", null), slotIndex, parent_3, getValue(map, "deform", true)));
                        return mesh;
                    }
                    var uvs = map.uvs;
                    this.readVertices(map, mesh, uvs.length);
                    mesh.triangles = map.triangles;
                    mesh.regionUVs = new Float32Array(uvs);
                    // mesh.updateUVs();
                    mesh.edges = getValue(map, "edges", null);
                    mesh.hullLength = getValue(map, "hull", 0) * 2;
                    return mesh;
                }
                case "path": {
                    var path = this.attachmentLoader.newPathAttachment(skin, name);
                    if (!path)
                        return null;
                    path.closed = getValue(map, "closed", false);
                    path.constantSpeed = getValue(map, "constantSpeed", true);
                    var vertexCount = map.vertexCount;
                    this.readVertices(map, path, vertexCount << 1);
                    var lengths = base.Utils.newArray(vertexCount / 3, 0);
                    for (var i = 0; i < map.lengths.length; i++)
                        lengths[i] = map.lengths[i] * scale;
                    path.lengths = lengths;
                    var color = getValue(map, "color", null);
                    if (color)
                        path.color.setFromString(color);
                    return path;
                }
                case "point": {
                    var point = this.attachmentLoader.newPointAttachment(skin, name);
                    if (!point)
                        return null;
                    point.x = getValue(map, "x", 0) * scale;
                    point.y = getValue(map, "y", 0) * scale;
                    point.rotation = getValue(map, "rotation", 0);
                    var color = getValue(map, "color", null);
                    if (color)
                        point.color.setFromString(color);
                    return point;
                }
                case "clipping": {
                    var clip = this.attachmentLoader.newClippingAttachment(skin, name);
                    if (!clip)
                        return null;
                    var end = getValue(map, "end", null);
                    if (end != null) {
                        var slot = skeletonData.findSlot(end);
                        if (slot == null)
                            throw new Error("Clipping end slot not found: " + end);
                        clip.endSlot = slot;
                    }
                    var vertexCount = map.vertexCount;
                    this.readVertices(map, clip, vertexCount << 1);
                    var color = getValue(map, "color", null);
                    if (color)
                        clip.color.setFromString(color);
                    return clip;
                }
            }
            return null;
        };
        SkeletonJson.prototype.readVertices = function (map, attachment, verticesLength) {
            var scale = this.scale;
            attachment.worldVerticesLength = verticesLength;
            var vertices = map.vertices;
            if (verticesLength == vertices.length) {
                var scaledVertices = base.Utils.toFloatArray(vertices);
                if (scale != 1) {
                    for (var i = 0, n = vertices.length; i < n; i++)
                        scaledVertices[i] *= scale;
                }
                attachment.vertices = scaledVertices;
                return;
            }
            var weights = new Array();
            var bones = new Array();
            for (var i = 0, n = vertices.length; i < n;) {
                var boneCount = vertices[i++];
                bones.push(boneCount);
                for (var nn = i + boneCount * 4; i < nn; i += 4) {
                    bones.push(vertices[i]);
                    weights.push(vertices[i + 1] * scale);
                    weights.push(vertices[i + 2] * scale);
                    weights.push(vertices[i + 3]);
                }
            }
            attachment.bones = bones;
            attachment.vertices = base.Utils.toFloatArray(weights);
        };
        SkeletonJson.prototype.readAnimation = function (map, name, skeletonData) {
            var scale = this.scale;
            var timelines = new Array();
            // Slot timelines.
            if (map.slots) {
                for (var slotName in map.slots) {
                    var slotMap = map.slots[slotName];
                    var slotIndex = skeletonData.findSlotIndex(slotName);
                    if (slotIndex == -1)
                        throw new Error("Slot not found: " + slotName);
                    for (var timelineName in slotMap) {
                        var timelineMap = slotMap[timelineName];
                        if (!timelineMap)
                            continue;
                        if (timelineName == "attachment") {
                            var timeline = new AttachmentTimeline(timelineMap.length, slotIndex);
                            for (var frame = 0; frame < timelineMap.length; frame++) {
                                var keyMap = timelineMap[frame];
                                timeline.setFrame(frame, getValue(keyMap, "time", 0), keyMap.name);
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "rgba") {
                            var timeline = new RGBATimeline(timelineMap.length, timelineMap.length << 2, slotIndex);
                            var keyMap = timelineMap[0];
                            var time = getValue(keyMap, "time", 0);
                            var color = base.Color.fromString(keyMap.color);
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b, color.a);
                                var nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                var time2 = getValue(nextMap, "time", 0);
                                var newColor = base.Color.fromString(nextMap.color);
                                var curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
                                }
                                time = time2;
                                color = newColor;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "rgb") {
                            var timeline = new RGBTimeline(timelineMap.length, timelineMap.length * 3, slotIndex);
                            var keyMap = timelineMap[0];
                            var time = getValue(keyMap, "time", 0);
                            var color = base.Color.fromString(keyMap.color);
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b);
                                var nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                var time2 = getValue(nextMap, "time", 0);
                                var newColor = base.Color.fromString(nextMap.color);
                                var curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                }
                                time = time2;
                                color = newColor;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "alpha") {
                            timelines.push(readTimeline1(timelineMap, new AlphaTimeline(timelineMap.length, timelineMap.length, slotIndex), 0, 1));
                        }
                        else if (timelineName == "rgba2") {
                            var timeline = new RGBA2Timeline(timelineMap.length, timelineMap.length * 7, slotIndex);
                            var keyMap = timelineMap[0];
                            var time = getValue(keyMap, "time", 0);
                            var color = base.Color.fromString(keyMap.light);
                            var color2 = base.Color.fromString(keyMap.dark);
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b, color.a, color2.r, color2.g, color2.b);
                                var nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                var time2 = getValue(nextMap, "time", 0);
                                var newColor = base.Color.fromString(nextMap.light);
                                var newColor2 = base.Color.fromString(nextMap.dark);
                                var curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color.a, newColor.a, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.r, newColor2.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.g, newColor2.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 6, time, time2, color2.b, newColor2.b, 1);
                                }
                                time = time2;
                                color = newColor;
                                color2 = newColor2;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                        else if (timelineName == "rgb2") {
                            var timeline = new RGB2Timeline(timelineMap.length, timelineMap.length * 6, slotIndex);
                            var keyMap = timelineMap[0];
                            var time = getValue(keyMap, "time", 0);
                            var color = base.Color.fromString(keyMap.light);
                            var color2 = base.Color.fromString(keyMap.dark);
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, color.r, color.g, color.b, color2.r, color2.g, color2.b);
                                var nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                var time2 = getValue(nextMap, "time", 0);
                                var newColor = base.Color.fromString(nextMap.light);
                                var newColor2 = base.Color.fromString(nextMap.dark);
                                var curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color.r, newColor.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color.g, newColor.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color.b, newColor.b, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color2.r, newColor2.r, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color2.g, newColor2.g, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color2.b, newColor2.b, 1);
                                }
                                time = time2;
                                color = newColor;
                                color2 = newColor2;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                        else
                            throw new Error("Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")");
                    }
                }
            }
            // Bone timelines.
            if (map.bones) {
                for (var boneName in map.bones) {
                    var boneMap = map.bones[boneName];
                    var boneIndex = skeletonData.findBoneIndex(boneName);
                    if (boneIndex == -1)
                        throw new Error("Bone not found: " + boneName);
                    for (var timelineName in boneMap) {
                        var timelineMap = boneMap[timelineName];
                        if (timelineMap.length == 0)
                            continue;
                        if (timelineName === "rotate") {
                            timelines.push(readTimeline1(timelineMap, new RotateTimeline(timelineMap.length, timelineMap.length, boneIndex), 0, 1));
                        }
                        else if (timelineName === "translate") {
                            var timeline = new TranslateTimeline(timelineMap.length, timelineMap.length << 1, boneIndex);
                            timelines.push(readTimeline2(timelineMap, timeline, "x", "y", 0, scale));
                        }
                        else if (timelineName === "translatex") {
                            var timeline = new TranslateXTimeline(timelineMap.length, timelineMap.length, boneIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 0, scale));
                        }
                        else if (timelineName === "translatey") {
                            var timeline = new TranslateYTimeline(timelineMap.length, timelineMap.length, boneIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 0, scale));
                        }
                        else if (timelineName === "scale") {
                            var timeline = new ScaleTimeline(timelineMap.length, timelineMap.length << 1, boneIndex);
                            timelines.push(readTimeline2(timelineMap, timeline, "x", "y", 1, 1));
                        }
                        else if (timelineName === "scalex") {
                            var timeline = new ScaleXTimeline(timelineMap.length, timelineMap.length, boneIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 1, 1));
                        }
                        else if (timelineName === "scaley") {
                            var timeline = new ScaleYTimeline(timelineMap.length, timelineMap.length, boneIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 1, 1));
                        }
                        else if (timelineName === "shear") {
                            var timeline = new ShearTimeline(timelineMap.length, timelineMap.length << 1, boneIndex);
                            timelines.push(readTimeline2(timelineMap, timeline, "x", "y", 0, 1));
                        }
                        else if (timelineName === "shearx") {
                            var timeline = new ShearXTimeline(timelineMap.length, timelineMap.length, boneIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 0, 1));
                        }
                        else if (timelineName === "sheary") {
                            var timeline = new ShearYTimeline(timelineMap.length, timelineMap.length, boneIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 0, 1));
                        }
                    }
                }
            }
            // IK constraint timelines.
            if (map.ik) {
                for (var constraintName in map.ik) {
                    var constraintMap = map.ik[constraintName];
                    var keyMap = constraintMap[0];
                    if (!keyMap)
                        continue;
                    var constraint = skeletonData.findIkConstraint(constraintName);
                    var constraintIndex = skeletonData.ikConstraints.indexOf(constraint);
                    var timeline = new IkConstraintTimeline(constraintMap.length, constraintMap.length << 1, constraintIndex);
                    var time = getValue(keyMap, "time", 0);
                    var mix = getValue(keyMap, "mix", 1);
                    var softness = getValue(keyMap, "softness", 0) * scale;
                    for (var frame = 0, bezier = 0;; frame++) {
                        timeline.setFrame(frame, time, mix, softness, getValue(keyMap, "bendPositive", true) ? 1 : -1, getValue(keyMap, "compress", false), getValue(keyMap, "stretch", false));
                        var nextMap = constraintMap[frame + 1];
                        if (!nextMap) {
                            timeline.shrink(bezier);
                            break;
                        }
                        var time2 = getValue(nextMap, "time", 0);
                        var mix2 = getValue(nextMap, "mix", 1);
                        var softness2 = getValue(nextMap, "softness", 0) * scale;
                        var curve = keyMap.curve;
                        if (curve) {
                            bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mix, mix2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, softness, softness2, scale);
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
                for (var constraintName in map.transform) {
                    var timelineMap = map.transform[constraintName];
                    var keyMap = timelineMap[0];
                    if (!keyMap)
                        continue;
                    var constraint = skeletonData.findTransformConstraint(constraintName);
                    var constraintIndex = skeletonData.transformConstraints.indexOf(constraint);
                    var timeline = new TransformConstraintTimeline(timelineMap.length, timelineMap.length << 2, constraintIndex);
                    var time = getValue(keyMap, "time", 0);
                    var mixRotate = getValue(keyMap, "mixRotate", 1);
                    var mixX = getValue(keyMap, "mixX", 1);
                    var mixY = getValue(keyMap, "mixY", mixX);
                    var mixScaleX = getValue(keyMap, "mixScaleX", 1);
                    var mixScaleY = getValue(keyMap, "mixScaleY", mixScaleX);
                    var mixShearY = getValue(keyMap, "mixShearY", 1);
                    for (var frame = 0, bezier = 0;; frame++) {
                        timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
                        var nextMap = timelineMap[frame + 1];
                        if (!nextMap) {
                            timeline.shrink(bezier);
                            break;
                        }
                        var time2 = getValue(nextMap, "time", 0);
                        var mixRotate2 = getValue(nextMap, "mixRotate", 1);
                        var mixX2 = getValue(nextMap, "mixX", 1);
                        var mixY2 = getValue(nextMap, "mixY", mixX2);
                        var mixScaleX2 = getValue(nextMap, "mixScaleX", 1);
                        var mixScaleY2 = getValue(nextMap, "mixScaleY", mixScaleX2);
                        var mixShearY2 = getValue(nextMap, "mixShearY", 1);
                        var curve = keyMap.curve;
                        if (curve) {
                            bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
                            bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, mixShearY, mixShearY2, 1);
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
                for (var constraintName in map.path) {
                    var constraintMap = map.path[constraintName];
                    var constraintIndex = skeletonData.findPathConstraintIndex(constraintName);
                    if (constraintIndex == -1)
                        throw new Error("Path constraint not found: " + constraintName);
                    var constraint = skeletonData.pathConstraints[constraintIndex];
                    for (var timelineName in constraintMap) {
                        var timelineMap = constraintMap[timelineName];
                        var keyMap = timelineMap[0];
                        if (!keyMap)
                            continue;
                        if (timelineName === "position") {
                            var timeline = new PathConstraintPositionTimeline(timelineMap.length, timelineMap.length, constraintIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 0, constraint.positionMode == exports.PositionMode.Fixed ? scale : 1));
                        }
                        else if (timelineName === "spacing") {
                            var timeline = new PathConstraintSpacingTimeline(timelineMap.length, timelineMap.length, constraintIndex);
                            timelines.push(readTimeline1(timelineMap, timeline, 0, constraint.spacingMode == exports.SpacingMode.Length || constraint.spacingMode == exports.SpacingMode.Fixed ? scale : 1));
                        }
                        else if (timelineName === "mix") {
                            var timeline = new PathConstraintMixTimeline(timelineMap.size, timelineMap.size * 3, constraintIndex);
                            var time = getValue(keyMap, "time", 0);
                            var mixRotate = getValue(keyMap, "mixRotate", 1);
                            var mixX = getValue(keyMap, "mixX", 1);
                            var mixY = getValue(keyMap, "mixY", mixX);
                            for (var frame = 0, bezier = 0;; frame++) {
                                timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                                var nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                var time2 = getValue(nextMap, "time", 0);
                                var mixRotate2 = getValue(nextMap, "mixRotate", 1);
                                var mixX2 = getValue(nextMap, "mixX", 1);
                                var mixY2 = getValue(nextMap, "mixY", mixX2);
                                var curve = keyMap.curve;
                                if (curve) {
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
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
                for (var deformName in map.deform) {
                    var deformMap = map.deform[deformName];
                    var skin = skeletonData.findSkin(deformName);
                    if (skin == null) {
                        if (base.settings.FAIL_ON_NON_EXISTING_SKIN) {
                            throw new Error("Skin not found: " + deformName);
                        }
                        else {
                            continue;
                        }
                    }
                    for (var slotName in deformMap) {
                        var slotMap = deformMap[slotName];
                        var slotIndex = skeletonData.findSlotIndex(slotName);
                        if (slotIndex == -1)
                            throw new Error("Slot not found: " + slotMap.name);
                        for (var timelineName in slotMap) {
                            var timelineMap = slotMap[timelineName];
                            var keyMap = timelineMap[0];
                            if (!keyMap)
                                continue;
                            var attachment = skin.getAttachment(slotIndex, timelineName);
                            if (attachment == null)
                                throw new Error("Deform attachment not found: " + timelineMap.name);
                            var weighted = attachment.bones != null;
                            var vertices = attachment.vertices;
                            var deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;
                            var timeline = new DeformTimeline(timelineMap.length, timelineMap.length, slotIndex, attachment);
                            var time = getValue(keyMap, "time", 0);
                            for (var frame = 0, bezier = 0;; frame++) {
                                var deform = void 0;
                                var verticesValue = getValue(keyMap, "vertices", null);
                                if (!verticesValue)
                                    deform = weighted ? base.Utils.newFloatArray(deformLength) : vertices;
                                else {
                                    deform = base.Utils.newFloatArray(deformLength);
                                    var start = getValue(keyMap, "offset", 0);
                                    base.Utils.arrayCopy(verticesValue, 0, deform, start, verticesValue.length);
                                    if (scale != 1) {
                                        for (var i = start, n = i + verticesValue.length; i < n; i++)
                                            deform[i] *= scale;
                                    }
                                    if (!weighted) {
                                        for (var i = 0; i < deformLength; i++)
                                            deform[i] += vertices[i];
                                    }
                                }
                                timeline.setFrame(frame, time, deform);
                                var nextMap = timelineMap[frame + 1];
                                if (!nextMap) {
                                    timeline.shrink(bezier);
                                    break;
                                }
                                var time2 = getValue(nextMap, "time", 0);
                                var curve = keyMap.curve;
                                if (curve)
                                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, 0, 1, 1);
                                time = time2;
                                keyMap = nextMap;
                            }
                            timelines.push(timeline);
                        }
                    }
                }
            }
            // Draw order timelines.
            if (map.drawOrder) {
                var timeline = new DrawOrderTimeline(map.drawOrder.length);
                var slotCount = skeletonData.slots.length;
                var frame = 0;
                for (var i = 0; i < map.drawOrder.length; i++, frame++) {
                    var drawOrderMap = map.drawOrder[i];
                    var drawOrder = null;
                    var offsets = getValue(drawOrderMap, "offsets", null);
                    if (offsets) {
                        drawOrder = base.Utils.newArray(slotCount, -1);
                        var unchanged = base.Utils.newArray(slotCount - offsets.length, 0);
                        var originalIndex = 0, unchangedIndex = 0;
                        for (var ii = 0; ii < offsets.length; ii++) {
                            var offsetMap = offsets[ii];
                            var slotIndex = skeletonData.findSlotIndex(offsetMap.slot);
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
                        for (var ii = slotCount - 1; ii >= 0; ii--)
                            if (drawOrder[ii] == -1)
                                drawOrder[ii] = unchanged[--unchangedIndex];
                    }
                    timeline.setFrame(frame, getValue(drawOrderMap, "time", 0), drawOrder);
                }
                timelines.push(timeline);
            }
            // Event timelines.
            if (map.events) {
                var timeline = new EventTimeline(map.events.length);
                var frame = 0;
                for (var i = 0; i < map.events.length; i++, frame++) {
                    var eventMap = map.events[i];
                    var eventData = skeletonData.findEvent(eventMap.name);
                    var event_1 = new Event(base.Utils.toSinglePrecision(getValue(eventMap, "time", 0)), eventData);
                    event_1.intValue = getValue(eventMap, "int", eventData.intValue);
                    event_1.floatValue = getValue(eventMap, "float", eventData.floatValue);
                    event_1.stringValue = getValue(eventMap, "string", eventData.stringValue);
                    if (event_1.data.audioPath) {
                        event_1.volume = getValue(eventMap, "volume", 1);
                        event_1.balance = getValue(eventMap, "balance", 0);
                    }
                    timeline.setFrame(frame, event_1);
                }
                timelines.push(timeline);
            }
            var duration = 0;
            for (var i = 0, n = timelines.length; i < n; i++)
                duration = Math.max(duration, timelines[i].getDuration());
            if (isNaN(duration)) {
                throw new Error("Error while parsing animation, duration is NaN");
            }
            skeletonData.animations.push(new Animation(name, timelines, duration));
        };
        SkeletonJson.blendModeFromString = function (str) {
            str = str.toLowerCase();
            if (str == "normal")
                return constants.BLEND_MODES.NORMAL;
            if (str == "additive")
                return constants.BLEND_MODES.ADD;
            if (str == "multiply")
                return constants.BLEND_MODES.MULTIPLY;
            if (str == "screen")
                return constants.BLEND_MODES.SCREEN;
            throw new Error("Unknown blend mode: " + str);
        };
        return SkeletonJson;
    }());
    var LinkedMesh = /** @class */ (function () {
        function LinkedMesh(mesh, skin, slotIndex, parent, inheritDeform) {
            this.mesh = mesh;
            this.skin = skin;
            this.slotIndex = slotIndex;
            this.parent = parent;
            this.inheritDeform = inheritDeform;
        }
        return LinkedMesh;
    }());
    function readTimeline1(keys, timeline, defaultValue, scale) {
        var keyMap = keys[0];
        var time = getValue(keyMap, "time", 0);
        var value = getValue(keyMap, "value", defaultValue) * scale;
        var bezier = 0;
        for (var frame = 0;; frame++) {
            timeline.setFrame(frame, time, value);
            var nextMap = keys[frame + 1];
            if (!nextMap) {
                timeline.shrink(bezier);
                return timeline;
            }
            var time2 = getValue(nextMap, "time", 0);
            var value2 = getValue(nextMap, "value", defaultValue) * scale;
            if (keyMap.curve)
                bezier = readCurve(keyMap.curve, timeline, bezier, frame, 0, time, time2, value, value2, scale);
            time = time2;
            value = value2;
            keyMap = nextMap;
        }
    }
    function readTimeline2(keys, timeline, name1, name2, defaultValue, scale) {
        var keyMap = keys[0];
        var time = getValue(keyMap, "time", 0);
        var value1 = getValue(keyMap, name1, defaultValue) * scale;
        var value2 = getValue(keyMap, name2, defaultValue) * scale;
        var bezier = 0;
        for (var frame = 0;; frame++) {
            timeline.setFrame(frame, time, value1, value2);
            var nextMap = keys[frame + 1];
            if (!nextMap) {
                timeline.shrink(bezier);
                return timeline;
            }
            var time2 = getValue(nextMap, "time", 0);
            var nvalue1 = getValue(nextMap, name1, defaultValue) * scale;
            var nvalue2 = getValue(nextMap, name2, defaultValue) * scale;
            var curve = keyMap.curve;
            if (curve) {
                bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, value1, nvalue1, scale);
                bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, value2, nvalue2, scale);
            }
            time = time2;
            value1 = nvalue1;
            value2 = nvalue2;
            keyMap = nextMap;
        }
    }
    function readCurve(curve, timeline, bezier, frame, value, time1, time2, value1, value2, scale) {
        if (curve == "stepped") {
            timeline.setStepped(frame);
            return bezier;
        }
        var i = value << 2;
        var cx1 = curve[i];
        var cy1 = curve[i + 1] * scale;
        var cx2 = curve[i + 2];
        var cy2 = curve[i + 3] * scale;
        timeline.setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2);
        return bezier + 1;
    }
    function getValue(map, property, defaultValue) {
        return map[property] !== undefined ? map[property] : defaultValue;
    }

    /**
     * @public
     */
    var Spine = /** @class */ (function (_super) {
        __extends(Spine, _super);
        function Spine() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Spine.prototype.createSkeleton = function (spineData) {
            this.skeleton = new Skeleton(spineData);
            this.skeleton.updateWorldTransform();
            this.stateData = new AnimationStateData(spineData);
            this.state = new AnimationState(this.stateData);
        };
        return Spine;
    }(base.SpineBase));

    exports.AlphaTimeline = AlphaTimeline;
    exports.Animation = Animation;
    exports.AnimationState = AnimationState;
    exports.AnimationStateAdapter = AnimationStateAdapter;
    exports.AnimationStateData = AnimationStateData;
    exports.AtlasAttachmentLoader = AtlasAttachmentLoader;
    exports.Attachment = Attachment;
    exports.AttachmentTimeline = AttachmentTimeline;
    exports.Bone = Bone;
    exports.BoneData = BoneData;
    exports.BoundingBoxAttachment = BoundingBoxAttachment;
    exports.ClippingAttachment = ClippingAttachment;
    exports.ConstraintData = ConstraintData;
    exports.CurveTimeline = CurveTimeline;
    exports.CurveTimeline1 = CurveTimeline1;
    exports.CurveTimeline2 = CurveTimeline2;
    exports.DeformTimeline = DeformTimeline;
    exports.DrawOrderTimeline = DrawOrderTimeline;
    exports.Event = Event;
    exports.EventData = EventData;
    exports.EventQueue = EventQueue;
    exports.EventTimeline = EventTimeline;
    exports.IkConstraint = IkConstraint;
    exports.IkConstraintData = IkConstraintData;
    exports.IkConstraintTimeline = IkConstraintTimeline;
    exports.JitterEffect = JitterEffect;
    exports.MeshAttachment = MeshAttachment;
    exports.PathAttachment = PathAttachment;
    exports.PathConstraint = PathConstraint;
    exports.PathConstraintData = PathConstraintData;
    exports.PathConstraintMixTimeline = PathConstraintMixTimeline;
    exports.PathConstraintPositionTimeline = PathConstraintPositionTimeline;
    exports.PathConstraintSpacingTimeline = PathConstraintSpacingTimeline;
    exports.PointAttachment = PointAttachment;
    exports.RGB2Timeline = RGB2Timeline;
    exports.RGBA2Timeline = RGBA2Timeline;
    exports.RGBATimeline = RGBATimeline;
    exports.RGBTimeline = RGBTimeline;
    exports.RegionAttachment = RegionAttachment;
    exports.RotateTimeline = RotateTimeline;
    exports.ScaleTimeline = ScaleTimeline;
    exports.ScaleXTimeline = ScaleXTimeline;
    exports.ScaleYTimeline = ScaleYTimeline;
    exports.ShearTimeline = ShearTimeline;
    exports.ShearXTimeline = ShearXTimeline;
    exports.ShearYTimeline = ShearYTimeline;
    exports.Skeleton = Skeleton;
    exports.SkeletonBinary = SkeletonBinary;
    exports.SkeletonBounds = SkeletonBounds;
    exports.SkeletonData = SkeletonData;
    exports.SkeletonJson = SkeletonJson;
    exports.Skin = Skin;
    exports.SkinEntry = SkinEntry;
    exports.Slot = Slot;
    exports.SlotData = SlotData;
    exports.Spine = Spine;
    exports.SwirlEffect = SwirlEffect;
    exports.Timeline = Timeline;
    exports.TrackEntry = TrackEntry;
    exports.TransformConstraint = TransformConstraint;
    exports.TransformConstraintData = TransformConstraintData;
    exports.TransformConstraintTimeline = TransformConstraintTimeline;
    exports.TranslateTimeline = TranslateTimeline;
    exports.TranslateXTimeline = TranslateXTimeline;
    exports.TranslateYTimeline = TranslateYTimeline;
    exports.VertexAttachment = VertexAttachment;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
if (typeof _pixi_spine_runtime_ !== 'undefined') { Object.assign(this.PIXI.spine40, _pixi_spine_runtime_); }
//# sourceMappingURL=runtime-4.0.js.map
