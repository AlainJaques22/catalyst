"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadPDF = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const binary_1 = require("../../utils/binary");
class ReadPDF {
    description = {
        hidden: true,
        displayName: 'Read PDF',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
        name: 'readPDF',
        icon: 'fa:file-pdf',
        group: ['input'],
        version: 1,
        description: 'Reads a PDF and extracts its content',
        defaults: {
            name: 'Read PDF',
            color: '#003355',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Input Binary Field',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                description: 'Name of the binary property from which to read the PDF file',
            },
            {
                displayName: 'Encrypted',
                name: 'encrypted',
                type: 'boolean',
                default: false,
                required: true,
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Password to decrypt the PDF file with',
                displayOptions: {
                    show: {
                        encrypted: [true],
                    },
                },
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        for (let itemIndex = 0; itemIndex < length; itemIndex++) {
            try {
                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex);
                let password;
                if (this.getNodeParameter('encrypted', itemIndex) === true) {
                    password = this.getNodeParameter('password', itemIndex);
                }
                const json = await binary_1.extractDataFromPDF.call(this, binaryPropertyName, password, undefined, undefined, itemIndex);
                returnData.push({
                    binary: items[itemIndex].binary,
                    json,
                });
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                        pairedItem: {
                            item: itemIndex,
                        },
                    });
                    continue;
                }
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex });
            }
        }
        return [returnData];
    }
}
exports.ReadPDF = ReadPDF;
//# sourceMappingURL=ReadPDF.node.js.map