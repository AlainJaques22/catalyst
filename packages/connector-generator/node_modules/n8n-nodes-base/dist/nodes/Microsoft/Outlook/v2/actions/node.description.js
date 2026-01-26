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
/* eslint-disable n8n-nodes-base/node-filename-against-convention */
const n8n_workflow_1 = require("n8n-workflow");
const calendar = __importStar(require("./calendar"));
const contact = __importStar(require("./contact"));
const draft = __importStar(require("./draft"));
const event = __importStar(require("./event"));
const folder = __importStar(require("./folder"));
const folderMessage = __importStar(require("./folderMessage"));
const message = __importStar(require("./message"));
const messageAttachment = __importStar(require("./messageAttachment"));
const descriptions_1 = require("../../../../../utils/sendAndWait/descriptions");
const utils_1 = require("../../../../../utils/sendAndWait/utils");
exports.description = {
    displayName: 'Microsoft Outlook',
    name: 'microsoftOutlook',
    group: ['transform'],
    icon: 'file:outlook.svg',
    version: 2,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume Microsoft Outlook API',
    defaults: {
        name: 'Microsoft Outlook',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
        {
            name: 'microsoftOutlookOAuth2Api',
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
            default: 'message',
            options: [
                {
                    name: 'Calendar',
                    value: 'calendar',
                },
                {
                    name: 'Contact',
                    value: 'contact',
                },
                {
                    name: 'Draft',
                    value: 'draft',
                },
                {
                    name: 'Event',
                    value: 'event',
                },
                {
                    name: 'Folder',
                    value: 'folder',
                },
                {
                    name: 'Folder Message',
                    value: 'folderMessage',
                },
                {
                    name: 'Message',
                    value: 'message',
                },
                {
                    name: 'Message Attachment',
                    value: 'messageAttachment',
                },
            ],
        },
        ...calendar.description,
        ...contact.description,
        ...draft.description,
        ...event.description,
        ...folder.description,
        ...folderMessage.description,
        ...message.description,
        ...messageAttachment.description,
    ],
};
//# sourceMappingURL=node.description.js.map