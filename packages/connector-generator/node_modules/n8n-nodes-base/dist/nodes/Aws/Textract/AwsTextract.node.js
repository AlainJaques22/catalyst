"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsTextract = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const utils_1 = require("../utils");
class AwsTextract {
    description = {
        displayName: 'AWS Textract',
        name: 'awsTextract',
        icon: 'file:textract.svg',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Sends data to Amazon Textract',
        defaults: {
            name: 'AWS Textract',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: utils_1.awsNodeCredentials,
        properties: [
            utils_1.awsNodeAuthOptions,
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Analyze Receipt or Invoice',
                        value: 'analyzeExpense',
                    },
                ],
                default: 'analyzeExpense',
            },
            {
                displayName: 'Input Data Field Name',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                displayOptions: {
                    show: {
                        operation: ['analyzeExpense'],
                    },
                },
                required: true,
                description: 'The name of the input field containing the binary file data to be uploaded. Supported file types: PNG, JPEG.',
            },
            {
                displayName: 'Simplify',
                name: 'simple',
                type: 'boolean',
                displayOptions: {
                    show: {
                        operation: ['analyzeExpense'],
                    },
                },
                default: true,
                description: 'Whether to return a simplified version of the response instead of the raw data',
            },
        ],
    };
    methods = {
        credentialTest: {
            async awsTextractApiCredentialTest(credential) {
                try {
                    await GenericFunctions_1.validateCredentials.call(this, credential.data, 'sts');
                }
                catch (error) {
                    return {
                        status: 'Error',
                        message: 'The security token included in the request is invalid',
                    };
                }
                return {
                    status: 'OK',
                    message: 'Connection successful!',
                };
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        let responseData;
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                //https://docs.aws.amazon.com/textract/latest/dg/API_AnalyzeExpense.html
                if (operation === 'analyzeExpense') {
                    const simple = this.getNodeParameter('simple', i);
                    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                    const binaryBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                    // Convert the binary buffer to a base64 string
                    const binaryData = Buffer.from(binaryBuffer).toString(n8n_workflow_1.BINARY_ENCODING);
                    const body = {
                        Document: {
                            Bytes: binaryData,
                        },
                    };
                    const action = 'Textract.AnalyzeExpense';
                    responseData = (await GenericFunctions_1.awsApiRequestREST.call(this, 'textract', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' }));
                    if (simple) {
                        responseData = (0, GenericFunctions_1.simplify)(responseData);
                    }
                }
                if (Array.isArray(responseData)) {
                    returnData.push.apply(returnData, responseData);
                }
                else {
                    returnData.push(responseData);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.AwsTextract = AwsTextract;
//# sourceMappingURL=AwsTextract.node.js.map