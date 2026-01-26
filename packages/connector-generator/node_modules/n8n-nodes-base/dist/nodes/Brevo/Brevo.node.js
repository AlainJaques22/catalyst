"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brevo = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const AttributeDescription_1 = require("./AttributeDescription");
const ContactDescription_1 = require("./ContactDescription");
const EmailDescription_1 = require("./EmailDescription");
const SenderDescrition_1 = require("./SenderDescrition");
class Brevo {
    description = {
        displayName: 'Brevo',
        // keep sendinblue name for backward compatibility
        name: 'sendInBlue',
        icon: 'file:brevo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Brevo API',
        defaults: {
            name: 'Brevo',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'sendInBlueApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.brevo.com',
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Contact',
                        value: 'contact',
                    },
                    {
                        name: 'Contact Attribute',
                        value: 'attribute',
                    },
                    {
                        name: 'Email',
                        value: 'email',
                    },
                    {
                        name: 'Sender',
                        value: 'sender',
                    },
                ],
                default: 'email',
            },
            ...AttributeDescription_1.attributeOperations,
            ...AttributeDescription_1.attributeFields,
            ...SenderDescrition_1.senderOperations,
            ...SenderDescrition_1.senderFields,
            ...ContactDescription_1.contactOperations,
            ...ContactDescription_1.contactFields,
            ...EmailDescription_1.emailOperations,
            ...EmailDescription_1.emailFields,
        ],
    };
}
exports.Brevo = Brevo;
//# sourceMappingURL=Brevo.node.js.map