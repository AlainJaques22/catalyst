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
exports.description = exports.deleteChannel = exports.update = exports.getAll = exports.get = exports.create = void 0;
const create = __importStar(require("./create.operation"));
exports.create = create;
const deleteChannel = __importStar(require("./deleteChannel.operation"));
exports.deleteChannel = deleteChannel;
const get = __importStar(require("./get.operation"));
exports.get = get;
const getAll = __importStar(require("./getAll.operation"));
exports.getAll = getAll;
const update = __importStar(require("./update.operation"));
exports.update = update;
const common_description_1 = require("../common.description");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['channel'],
                authentication: ['botToken', 'oAuth2'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new channel',
                action: 'Create a channel',
            },
            {
                name: 'Delete',
                value: 'deleteChannel',
                description: 'Delete a channel',
                action: 'Delete a channel',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a channel',
                action: 'Get a channel',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve the channels of a server',
                action: 'Get many channels',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a channel',
                action: 'Update a channel',
            },
        ],
        default: 'create',
    },
    {
        ...common_description_1.guildRLC,
        displayOptions: {
            show: {
                resource: ['channel'],
                authentication: ['botToken', 'oAuth2'],
            },
        },
    },
    ...create.description,
    ...deleteChannel.description,
    ...get.description,
    ...getAll.description,
    ...update.description,
];
//# sourceMappingURL=index.js.map