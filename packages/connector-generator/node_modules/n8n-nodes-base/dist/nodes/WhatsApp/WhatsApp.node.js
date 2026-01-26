"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsApp = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const MediaDescription_1 = require("./MediaDescription");
const MessageFunctions_1 = require("./MessageFunctions");
const MessagesDescription_1 = require("./MessagesDescription");
const configureWaitTillDate_util_1 = require("../../utils/sendAndWait/configureWaitTillDate.util");
const descriptions_1 = require("../../utils/sendAndWait/descriptions");
const utils_1 = require("../../utils/sendAndWait/utils");
const WHATSAPP_CREDENTIALS_TYPE = 'whatsAppApi';
class WhatsApp {
    description = {
        displayName: 'WhatsApp Business Cloud',
        name: 'whatsApp',
        icon: 'file:whatsapp.svg',
        group: ['output'],
        version: [1, 1.1],
        defaultVersion: 1.1,
        subtitle: '={{ $parameter["resource"] + ": " + $parameter["operation"] }}',
        description: 'Access WhatsApp API',
        defaults: {
            name: 'WhatsApp Business Cloud',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        waitingNodeTooltip: utils_1.SEND_AND_WAIT_WAITING_TOOLTIP,
        webhooks: descriptions_1.sendAndWaitWebhooksDescription,
        credentials: [
            {
                name: WHATSAPP_CREDENTIALS_TYPE,
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: GenericFunctions_1.WHATSAPP_BASE_URL,
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Message',
                        value: 'message',
                    },
                    {
                        name: 'Media',
                        value: 'media',
                    },
                ],
                default: 'message',
            },
            ...MessagesDescription_1.messageFields,
            ...MediaDescription_1.mediaFields,
            ...MessagesDescription_1.messageTypeFields,
            ...MediaDescription_1.mediaTypeFields,
            ...(0, utils_1.getSendAndWaitProperties)([], 'message', undefined, {
                noButtonStyle: true,
                defaultApproveLabel: '✓ Approve',
                defaultDisapproveLabel: '✗ Decline',
            }).filter((p) => p.name !== 'subject'),
        ],
    };
    webhook = utils_1.sendAndWaitWebhook;
    customOperations = {
        message: {
            async [n8n_workflow_1.SEND_AND_WAIT_OPERATION]() {
                try {
                    const phoneNumberId = this.getNodeParameter('phoneNumberId', 0);
                    const recipientPhoneNumber = (0, MessageFunctions_1.sanitizePhoneNumber)(this.getNodeParameter('recipientPhoneNumber', 0));
                    const config = (0, utils_1.getSendAndWaitConfig)(this);
                    const instanceId = this.getInstanceId();
                    await this.helpers.httpRequestWithAuthentication.call(this, WHATSAPP_CREDENTIALS_TYPE, (0, GenericFunctions_1.createMessage)(config, phoneNumberId, recipientPhoneNumber, instanceId));
                    const waitTill = (0, configureWaitTillDate_util_1.configureWaitTillDate)(this);
                    await this.putExecutionToWait(waitTill);
                    return [this.getInputData()];
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
                }
            },
        },
    };
}
exports.WhatsApp = WhatsApp;
//# sourceMappingURL=WhatsApp.node.js.map