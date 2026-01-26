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
exports.descriptions = exports.postEphemeral = exports.post = exports.delete = void 0;
const del = __importStar(require("./del"));
exports.delete = del;
const post = __importStar(require("./post"));
exports.post = post;
const postEphemeral = __importStar(require("./postEphemeral"));
exports.postEphemeral = postEphemeral;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['message'],
            },
        },
        options: [
            {
                name: 'Delete',
                value: 'delete',
                description: 'Soft delete a post, by marking the post as deleted in the database',
                action: 'Delete a message',
            },
            {
                name: 'Post',
                value: 'post',
                description: 'Post a message into a channel',
                action: 'Post a message',
            },
            {
                name: 'Post Ephemeral',
                value: 'postEphemeral',
                description: 'Post an ephemeral message into a channel',
                action: 'Post an ephemeral message',
            },
        ],
        default: 'post',
    },
    ...del.description,
    ...post.description,
    ...postEphemeral.description,
];
//# sourceMappingURL=index.js.map