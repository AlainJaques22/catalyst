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
exports.description = void 0;
const download = __importStar(require("./download.operation"));
const update = __importStar(require("./update.operation"));
const upload = __importStar(require("./upload.operation"));
const utils_1 = require("../../helpers/utils");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['file'],
            },
        },
        options: [
            {
                name: 'Download',
                value: 'download',
                description: 'Download a file',
                routing: {
                    request: {
                        method: 'GET',
                        url: '=/sites/{{ $parameter["site"] }}/drive/items/{{ $parameter["file"] }}/content',
                        json: false,
                        encoding: 'arraybuffer',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive, utils_1.downloadFilePostReceive],
                    },
                },
                action: 'Download file',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a file',
                routing: {
                    request: {
                        method: 'PATCH',
                        url: '=/sites/{{ $parameter["site"] }}/drive/items/{{ $parameter["file"] }}',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive],
                    },
                },
                action: 'Update file',
            },
            {
                name: 'Upload',
                value: 'upload',
                description: 'Upload an existing file',
                routing: {
                    request: {
                        method: 'PUT',
                        url: '=/sites/{{ $parameter["site"] }}/drive/items/{{ $parameter["folder"] }}:/{{ $parameter["fileName"] }}:/content',
                    },
                    output: {
                        postReceive: [utils_1.handleErrorPostReceive],
                    },
                },
                action: 'Upload file',
            },
        ],
        default: 'download',
    },
    ...download.description,
    ...update.description,
    ...upload.description,
];
//# sourceMappingURL=File.resource.js.map