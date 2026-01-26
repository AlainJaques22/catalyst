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
exports.description = exports.load = exports.upload = exports.getMany = exports.get = exports.deleteFile = void 0;
const deleteFile = __importStar(require("./delete.operation"));
exports.deleteFile = deleteFile;
const get = __importStar(require("./get.operation"));
exports.get = get;
const getMany = __importStar(require("./getMany.operation"));
exports.getMany = getMany;
const load = __importStar(require("./load.operation"));
exports.load = load;
const upload = __importStar(require("./upload.operation"));
exports.upload = upload;
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
                name: 'Delete',
                value: 'deleteFile',
                description: 'Delete an uploaded file',
                action: 'Delete a file',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a details of an uploaded file',
                action: 'Get a file',
            },
            {
                name: 'Get Many',
                value: 'getMany',
                description: 'Get details of multiple uploaded files',
                action: 'Get many files',
            },
            {
                name: 'Load',
                value: 'load',
                description: 'Load a file into a session',
                action: 'Load a file',
            },
            {
                name: 'Upload',
                value: 'upload',
                description: 'Upload a file into a session',
                action: 'Upload a file',
            },
        ],
        default: 'getMany',
    },
    ...deleteFile.description,
    ...get.description,
    ...getMany.description,
    ...load.description,
    ...upload.description,
];
//# sourceMappingURL=File.resource.js.map