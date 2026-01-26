"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormTriggerV1 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_descriptions_1 = require("../common.descriptions");
const utils_1 = require("../utils/utils");
const descriptionV1 = {
    displayName: 'n8n Form Trigger',
    name: 'formTrigger',
    icon: 'file:form.svg',
    group: ['trigger'],
    version: 1,
    description: 'Generate webforms in n8n and pass their responses to the workflow',
    defaults: {
        name: 'n8n Form Trigger',
    },
    inputs: [],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    webhooks: [
        {
            name: 'setup',
            httpMethod: 'GET',
            responseMode: 'onReceived',
            isFullPath: true,
            path: `={{$parameter["path"]}}/${n8n_workflow_1.FORM_TRIGGER_PATH_IDENTIFIER}`,
            ndvHideUrl: true,
        },
        {
            name: 'default',
            httpMethod: 'POST',
            responseMode: '={{$parameter["responseMode"]}}',
            responseData: '={{$parameter["responseMode"] === "lastNode" ? "noData" : undefined}}',
            isFullPath: true,
            path: `={{$parameter["path"]}}/${n8n_workflow_1.FORM_TRIGGER_PATH_IDENTIFIER}`,
            ndvHideMethod: true,
        },
    ],
    eventTriggerDescription: 'Waiting for you to submit the form',
    activationMessage: 'You can now make calls to your production Form URL.',
    triggerPanel: common_descriptions_1.formTriggerPanel,
    properties: [
        common_descriptions_1.webhookPath,
        common_descriptions_1.formTitle,
        common_descriptions_1.formDescription,
        common_descriptions_1.formFields,
        common_descriptions_1.formRespondMode,
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            displayOptions: {
                hide: {
                    responseMode: ['responseNode'],
                },
            },
            options: [
                {
                    displayName: 'Form Submitted Text',
                    name: 'formSubmittedText',
                    description: 'The text displayed to users after they filled the form',
                    type: 'string',
                    default: 'Your response has been recorded',
                },
            ],
        },
    ],
};
class FormTriggerV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...descriptionV1,
        };
    }
    async webhook() {
        return await (0, utils_1.formWebhook)(this);
    }
}
exports.FormTriggerV1 = FormTriggerV1;
//# sourceMappingURL=FormTriggerV1.node.js.map