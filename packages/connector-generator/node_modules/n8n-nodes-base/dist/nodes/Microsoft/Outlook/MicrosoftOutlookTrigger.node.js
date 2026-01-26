"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOutlookTrigger = void 0;
const luxon_1 = require("luxon");
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./trigger/GenericFunctions");
const MessageDescription_1 = require("./trigger/MessageDescription");
const methods_1 = require("./v2/methods");
class MicrosoftOutlookTrigger {
    description = {
        displayName: 'Microsoft Outlook Trigger',
        name: 'microsoftOutlookTrigger',
        icon: 'file:outlook.svg',
        group: ['trigger'],
        version: 1,
        description: 'Fetches emails from Microsoft Outlook and starts the workflow on specified polling intervals.',
        subtitle: '={{"Microsoft Outlook Trigger"}}',
        defaults: {
            name: 'Microsoft Outlook Trigger',
        },
        credentials: [
            {
                name: 'microsoftOutlookOAuth2Api',
                required: true,
            },
        ],
        polling: true,
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Trigger On',
                name: 'event',
                type: 'options',
                default: 'messageReceived',
                options: [
                    {
                        name: 'Message Received',
                        value: 'messageReceived',
                    },
                ],
            },
            ...MessageDescription_1.properties,
        ],
    };
    methods = { loadOptions: methods_1.loadOptions };
    async poll() {
        const webhookData = this.getWorkflowStaticData('node');
        let responseData;
        const now = luxon_1.DateTime.now().toISO();
        const startDate = webhookData.lastTimeChecked || now;
        const endDate = now;
        try {
            const pollStartDate = startDate;
            const pollEndDate = endDate;
            responseData = await GenericFunctions_1.getPollResponse.call(this, pollStartDate, pollEndDate);
            if (!responseData?.length) {
                webhookData.lastTimeChecked = endDate;
                return null;
            }
        }
        catch (error) {
            if (this.getMode() === 'manual' || !webhookData.lastTimeChecked) {
                throw error;
            }
            const workflow = this.getWorkflow();
            const node = this.getNode();
            this.logger.error(`There was a problem in '${node.name}' node in workflow '${workflow.id}': '${error.description}'`, {
                node: node.name,
                workflowId: workflow.id,
                error,
            });
        }
        webhookData.lastTimeChecked = endDate;
        if (Array.isArray(responseData) && responseData.length) {
            return [responseData];
        }
        return null;
    }
}
exports.MicrosoftOutlookTrigger = MicrosoftOutlookTrigger;
//# sourceMappingURL=MicrosoftOutlookTrigger.node.js.map