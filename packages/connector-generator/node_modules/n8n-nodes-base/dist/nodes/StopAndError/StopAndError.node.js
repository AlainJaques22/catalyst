"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopAndError = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("./utils");
const errorObjectPlaceholder = `{
	"code": "404",
	"description": "The resource could not be fetched"
}`;
class StopAndError {
    description = {
        displayName: 'Stop and Error',
        name: 'stopAndError',
        icon: 'fa:exclamation-triangle',
        iconColor: 'red',
        group: ['input'],
        version: 1,
        description: 'Throw an error in the workflow',
        defaults: {
            name: 'Stop and Error',
            color: '#ff0000',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [],
        properties: [
            {
                displayName: 'Error Type',
                name: 'errorType',
                type: 'options',
                options: [
                    {
                        name: 'Error Message',
                        value: 'errorMessage',
                    },
                    {
                        name: 'Error Object',
                        value: 'errorObject',
                    },
                ],
                default: 'errorMessage',
                description: 'Type of error to throw',
            },
            {
                displayName: 'Error Message',
                name: 'errorMessage',
                type: 'string',
                placeholder: 'An error occurred!',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        errorType: ['errorMessage'],
                    },
                },
            },
            {
                displayName: 'Error Object',
                name: 'errorObject',
                type: 'json',
                description: 'Object containing error properties',
                default: '',
                typeOptions: {
                    alwaysOpenEditWindow: true,
                },
                placeholder: errorObjectPlaceholder,
                required: true,
                displayOptions: {
                    show: {
                        errorType: ['errorObject'],
                    },
                },
            },
        ],
    };
    async execute() {
        const errorType = this.getNodeParameter('errorType', 0);
        const errorParameter = errorType === 'errorMessage'
            ? this.getNodeParameter('errorMessage', 0)
            : this.getNodeParameter('errorObject', 0);
        const { message, options } = (0, utils_1.createErrorFromParameters)(errorType, errorParameter);
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), message, options);
    }
}
exports.StopAndError = StopAndError;
//# sourceMappingURL=StopAndError.node.js.map