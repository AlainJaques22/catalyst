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
exports.description = exports.getAll = exports.get = exports.download = exports.add = void 0;
const add = __importStar(require("./add.operation"));
exports.add = add;
const download = __importStar(require("./download.operation"));
exports.download = download;
const get = __importStar(require("./get.operation"));
exports.get = get;
const getAll = __importStar(require("./getAll.operation"));
exports.getAll = getAll;
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['messageAttachment'],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'add',
                description: 'Add an attachment to a message',
                action: 'Add an attachment',
            },
            {
                name: 'Download',
                value: 'download',
                description: 'Download an attachment from a message',
                action: 'Download an attachment',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve information about an attachment of a message',
                action: 'Get an attachment',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve information about the attachments of a message',
                action: 'Get many attachments',
            },
        ],
        default: 'add',
    },
    ...add.description,
    ...download.description,
    ...get.description,
    ...getAll.description,
];
//# sourceMappingURL=index.js.map