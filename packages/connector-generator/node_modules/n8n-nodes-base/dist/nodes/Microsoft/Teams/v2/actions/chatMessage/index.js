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
exports.description = exports.sendAndWait = exports.getAll = exports.get = exports.create = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const create = __importStar(require("./create.operation"));
exports.create = create;
const get = __importStar(require("./get.operation"));
exports.get = get;
const getAll = __importStar(require("./getAll.operation"));
exports.getAll = getAll;
const sendAndWait = __importStar(require("./sendAndWait.operation"));
exports.sendAndWait = sendAndWait;
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['chatMessage'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a message in a chat',
                action: 'Create chat message',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a message from a chat',
                action: 'Get chat message',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many messages from a chat',
                action: 'Get many chat messages',
            },
            {
                name: 'Send and Wait for Response',
                value: n8n_workflow_1.SEND_AND_WAIT_OPERATION,
                description: 'Send a message and wait for response',
                action: 'Send message and wait for response',
            },
        ],
        default: 'create',
    },
    ...create.description,
    ...get.description,
    ...getAll.description,
    ...sendAndWait.description,
];
//# sourceMappingURL=index.js.map