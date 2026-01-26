"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuencodedPartData = exports.BinaryPartData = exports.SevenBitPartData = exports.QuotedPrintablePartData = exports.Base64PartData = exports.PartData = void 0;
const iconvlite = __importStar(require("iconv-lite"));
const qp = __importStar(require("quoted-printable"));
const utf8 = __importStar(require("utf8"));
const uuencode = __importStar(require("uuencode"));
class PartData {
    constructor(buffer) {
        this.buffer = buffer;
    }
    toString() {
        return this.buffer.toString();
    }
    static fromData(data, encoding, charset) {
        if (encoding === 'BASE64') {
            return new Base64PartData(data);
        }
        if (encoding === 'QUOTED-PRINTABLE') {
            return new QuotedPrintablePartData(data, charset);
        }
        if (encoding === '7BIT') {
            return new SevenBitPartData(data);
        }
        if (encoding === '8BIT' || encoding === 'BINARY') {
            return new BinaryPartData(data, charset);
        }
        if (encoding === 'UUENCODE') {
            return new UuencodedPartData(data);
        }
        throw new Error('Unknown encoding ' + encoding);
    }
}
exports.PartData = PartData;
class Base64PartData extends PartData {
    constructor(data) {
        super(Buffer.from(data, 'base64'));
    }
}
exports.Base64PartData = Base64PartData;
class QuotedPrintablePartData extends PartData {
    constructor(data, charset) {
        const decoded = charset?.toUpperCase() === 'UTF-8' ? utf8.decode(qp.decode(data)) : qp.decode(data);
        super(Buffer.from(decoded));
    }
}
exports.QuotedPrintablePartData = QuotedPrintablePartData;
class SevenBitPartData extends PartData {
    constructor(data) {
        super(Buffer.from(data));
    }
    toString() {
        return this.buffer.toString('ascii');
    }
}
exports.SevenBitPartData = SevenBitPartData;
class BinaryPartData extends PartData {
    constructor(data, charset = 'utf-8') {
        super(Buffer.from(data));
        this.charset = charset;
    }
    toString() {
        return iconvlite.decode(this.buffer, this.charset);
    }
}
exports.BinaryPartData = BinaryPartData;
class UuencodedPartData extends PartData {
    constructor(data) {
        const parts = data.split('\n');
        const merged = parts.splice(1, parts.length - 4).join('');
        const decoded = uuencode.decode(merged);
        super(decoded);
    }
}
exports.UuencodedPartData = UuencodedPartData;
//# sourceMappingURL=part-data.js.map