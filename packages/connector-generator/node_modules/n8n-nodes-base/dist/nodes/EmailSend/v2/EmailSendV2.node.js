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
exports.EmailSendV2 = exports.versionDescription = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const send = __importStar(require("./send.operation"));
const sendAndWait = __importStar(require("./sendAndWait.operation"));
const utils_1 = require("./utils");
const descriptions_1 = require("../../../utils/sendAndWait/descriptions");
const utils_2 = require("../../../utils/sendAndWait/utils");
exports.versionDescription = {
    displayName: 'Send Email',
    name: 'emailSend',
    icon: 'fa:envelope',
    group: ['output'],
    version: [2, 2.1],
    description: 'Sends an email using SMTP protocol',
    defaults: {
        name: 'Send Email',
        color: '#00bb88',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    usableAsTool: true,
    credentials: [
        {
            name: 'smtp',
            required: true,
            testedBy: 'smtpConnectionTest',
        },
    ],
    waitingNodeTooltip: utils_2.SEND_AND_WAIT_WAITING_TOOLTIP,
    webhooks: descriptions_1.sendAndWaitWebhooksDescription,
    properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'hidden',
            noDataExpression: true,
            default: 'email',
            options: [
                {
                    name: 'Email',
                    value: 'email',
                },
            ],
        },
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            default: 'send',
            options: [
                {
                    name: 'Send',
                    value: 'send',
                    action: 'Send an Email',
                },
                {
                    name: 'Send and Wait for Response',
                    value: n8n_workflow_1.SEND_AND_WAIT_OPERATION,
                    action: 'Send message and wait for response',
                },
            ],
        },
        ...send.description,
        ...sendAndWait.description,
    ],
};
class EmailSendV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...exports.versionDescription,
        };
    }
    methods = {
        credentialTest: { smtpConnectionTest: utils_1.smtpConnectionTest },
    };
    webhook = utils_2.sendAndWaitWebhook;
    async execute() {
        let returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        if (operation === n8n_workflow_1.SEND_AND_WAIT_OPERATION) {
            returnData = await sendAndWait.execute.call(this);
        }
        if (operation === 'send') {
            returnData = await send.execute.call(this);
        }
        return returnData;
    }
}
exports.EmailSendV2 = EmailSendV2;
//# sourceMappingURL=EmailSendV2.node.js.map