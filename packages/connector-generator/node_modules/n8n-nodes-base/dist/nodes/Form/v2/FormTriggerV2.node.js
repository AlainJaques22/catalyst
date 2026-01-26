"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormTriggerV2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_descriptions_1 = require("../common.descriptions");
const cssVariables_1 = require("../cssVariables");
const interfaces_1 = require("../interfaces");
const utils_1 = require("../utils/utils");
const useWorkflowTimezone = {
    displayName: 'Use Workflow Timezone',
    name: 'useWorkflowTimezone',
    type: 'boolean',
    default: false,
    description: "Whether to use the workflow timezone set in node's settings rather than UTC",
};
const descriptionV2 = {
    displayName: 'n8n Form Trigger',
    name: 'formTrigger',
    icon: 'file:form.svg',
    group: ['trigger'],
    // since trigger and node are sharing descriptions and logic we need to sync the versions
    // and keep them aligned in both nodes
    version: [2, 2.1, 2.2, 2.3],
    description: 'Generate webforms in n8n and pass their responses to the workflow',
    defaults: {
        name: 'On form submission',
    },
    inputs: [],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    webhooks: [
        {
            name: 'setup',
            httpMethod: 'GET',
            responseMode: 'onReceived',
            isFullPath: true,
            path: '={{ $parameter["path"] || $parameter["options"]?.path || $webhookId }}',
            ndvHideUrl: true,
            nodeType: 'form',
        },
        {
            name: 'default',
            httpMethod: 'POST',
            responseMode: '={{$parameter["responseMode"]}}',
            responseData: '={{$parameter["responseMode"] === "lastNode" ? "noData" : undefined}}',
            isFullPath: true,
            path: '={{ $parameter["path"] || $parameter["options"]?.path || $webhookId }}',
            ndvHideMethod: true,
            nodeType: 'form',
        },
    ],
    eventTriggerDescription: 'Waiting for you to submit the form',
    activationMessage: 'You can now make calls to your production Form URL.',
    triggerPanel: common_descriptions_1.formTriggerPanel,
    credentials: [
        {
            // eslint-disable-next-line n8n-nodes-base/node-class-description-credentials-name-unsuffixed
            name: 'httpBasicAuth',
            required: true,
            displayOptions: {
                show: {
                    [interfaces_1.FORM_TRIGGER_AUTHENTICATION_PROPERTY]: ['basicAuth'],
                },
            },
        },
    ],
    properties: [
        {
            displayName: 'Authentication',
            name: interfaces_1.FORM_TRIGGER_AUTHENTICATION_PROPERTY,
            type: 'options',
            options: [
                {
                    name: 'Basic Auth',
                    value: 'basicAuth',
                },
                {
                    name: 'None',
                    value: 'none',
                },
            ],
            default: 'none',
        },
        { ...common_descriptions_1.webhookPath, displayOptions: { show: { '@version': [{ _cnd: { lte: 2.1 } }] } } },
        common_descriptions_1.formTitle,
        common_descriptions_1.formDescription,
        common_descriptions_1.formFields,
        { ...common_descriptions_1.formRespondMode, displayOptions: { show: { '@version': [{ _cnd: { lte: 2.1 } }] } } },
        {
            ...common_descriptions_1.formRespondMode,
            options: common_descriptions_1.formRespondMode.options?.filter((option) => option.value !== 'responseNode'),
            displayOptions: { show: { '@version': [{ _cnd: { gte: 2.2 } }] } },
        },
        {
            displayName: "In the 'Respond to Webhook' node, select 'Respond With JSON' and set the <strong>formSubmittedText</strong> key to display a custom response in the form, or the <strong>redirectURL</strong> key to redirect users to a URL",
            name: 'formNotice',
            type: 'notice',
            displayOptions: {
                show: { responseMode: ['responseNode'] },
            },
            default: '',
        },
        // notice would be shown if no Form node was connected to trigger
        {
            displayName: 'Build multi-step forms by adding a form page later in your workflow',
            name: n8n_workflow_1.ADD_FORM_NOTICE,
            type: 'notice',
            default: '',
        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add option',
            default: {},
            options: [
                common_descriptions_1.appendAttributionToForm,
                {
                    displayName: 'Button Label',
                    description: 'The label of the submit button in the form',
                    name: 'buttonLabel',
                    type: 'string',
                    default: 'Submit',
                },
                {
                    ...common_descriptions_1.webhookPath,
                    required: false,
                    displayOptions: { show: { '@version': [{ _cnd: { gte: 2.2 } }] } },
                },
                {
                    ...common_descriptions_1.respondWithOptions,
                    displayOptions: {
                        hide: {
                            '/responseMode': ['responseNode'],
                        },
                    },
                },
                {
                    displayName: 'Ignore Bots',
                    name: 'ignoreBots',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to ignore requests from bots like link previewers and web crawlers',
                },
                {
                    ...useWorkflowTimezone,
                    default: false,
                    description: "Whether to use the workflow timezone in 'submittedAt' field or UTC",
                    displayOptions: {
                        show: {
                            '@version': [2],
                        },
                    },
                },
                {
                    ...useWorkflowTimezone,
                    default: true,
                    description: "Whether to use the workflow timezone in 'submittedAt' field or UTC",
                    displayOptions: {
                        show: {
                            '@version': [{ _cnd: { gt: 2 } }],
                        },
                    },
                },
                {
                    displayName: 'Custom Form Styling',
                    name: 'customCss',
                    type: 'string',
                    typeOptions: {
                        rows: 10,
                        editor: 'cssEditor',
                    },
                    displayOptions: {
                        show: {
                            '@version': [{ _cnd: { gt: 2 } }],
                        },
                    },
                    default: cssVariables_1.cssVariables.trim(),
                    description: 'Override default styling of the public form interface with CSS',
                },
            ],
        },
    ],
};
class FormTriggerV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...descriptionV2,
        };
    }
    async webhook() {
        return await (0, utils_1.formWebhook)(this);
    }
}
exports.FormTriggerV2 = FormTriggerV2;
//# sourceMappingURL=FormTriggerV2.node.js.map