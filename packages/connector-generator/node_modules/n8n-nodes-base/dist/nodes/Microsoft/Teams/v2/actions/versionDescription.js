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
exports.versionDescription = void 0;
/* eslint-disable n8n-nodes-base/node-filename-against-convention */
const n8n_workflow_1 = require("n8n-workflow");
const channel = __importStar(require("./channel"));
const channelMessage = __importStar(require("./channelMessage"));
const chatMessage = __importStar(require("./chatMessage"));
const task = __importStar(require("./task"));
const descriptions_1 = require("../../../../../utils/sendAndWait/descriptions");
const utils_1 = require("../../../../../utils/sendAndWait/utils");
exports.versionDescription = {
    displayName: 'Microsoft Teams',
    name: 'microsoftTeams',
    icon: 'file:teams.svg',
    group: ['input'],
    version: 2,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume Microsoft Teams API',
    defaults: {
        name: 'Microsoft Teams',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'microsoftTeamsOAuth2Api',
            required: true,
        },
    ],
    waitingNodeTooltip: utils_1.SEND_AND_WAIT_WAITING_TOOLTIP,
    webhooks: descriptions_1.sendAndWaitWebhooksDescription,
    properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Channel',
                    value: 'channel',
                },
                {
                    name: 'Channel Message',
                    value: 'channelMessage',
                },
                {
                    name: 'Chat Message',
                    value: 'chatMessage',
                },
                {
                    name: 'Task',
                    value: 'task',
                },
            ],
            default: 'channel',
        },
        ...channel.description,
        ...channelMessage.description,
        ...chatMessage.description,
        ...task.description,
    ],
};
//# sourceMappingURL=versionDescription.js.map