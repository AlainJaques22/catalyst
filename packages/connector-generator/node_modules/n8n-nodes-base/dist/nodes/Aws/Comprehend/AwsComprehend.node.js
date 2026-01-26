"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsComprehend = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const utils_1 = require("../utils");
class AwsComprehend {
    description = {
        displayName: 'AWS Comprehend',
        name: 'awsComprehend',
        icon: 'file:comprehend.svg',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Sends data to Amazon Comprehend',
        defaults: {
            name: 'AWS Comprehend',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: utils_1.awsNodeCredentials,
        properties: [
            utils_1.awsNodeAuthOptions,
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Text',
                        value: 'text',
                    },
                ],
                default: 'text',
                description: 'The resource to perform',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Detect Dominant Language',
                        value: 'detectDominantLanguage',
                        description: 'Identify the dominant language',
                        action: 'Identify the dominant language',
                    },
                    {
                        name: 'Detect Entities',
                        value: 'detectEntities',
                        description: 'Inspects text for named entities, and returns information about them',
                        action: 'Inspect text for named entities, and returns information about them',
                    },
                    {
                        name: 'Detect Sentiment',
                        value: 'detectSentiment',
                        description: 'Analyse the sentiment of the text',
                        action: 'Analyze the sentiment of the text',
                    },
                ],
                default: 'detectDominantLanguage',
            },
            {
                displayName: 'Language Code',
                name: 'languageCode',
                type: 'options',
                options: [
                    {
                        name: 'Arabic',
                        value: 'ar',
                    },
                    {
                        name: 'Chinese',
                        value: 'zh',
                    },
                    {
                        name: 'Chinese (T)',
                        value: 'zh-TW',
                    },
                    {
                        name: 'English',
                        value: 'en',
                    },
                    {
                        name: 'French',
                        value: 'fr',
                    },
                    {
                        name: 'German',
                        value: 'de',
                    },
                    {
                        name: 'Hindi',
                        value: 'hi',
                    },
                    {
                        name: 'Italian',
                        value: 'it',
                    },
                    {
                        name: 'Japanese',
                        value: 'ja',
                    },
                    {
                        name: 'Korean',
                        value: 'ko',
                    },
                    {
                        name: 'Portuguese',
                        value: 'pt',
                    },
                    {
                        name: 'Spanish',
                        value: 'es',
                    },
                ],
                default: 'en',
                displayOptions: {
                    show: {
                        resource: ['text'],
                        operation: ['detectSentiment', 'detectEntities'],
                    },
                },
                description: 'The language code for text',
            },
            {
                displayName: 'Text',
                name: 'text',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['text'],
                    },
                },
                description: 'The text to send',
            },
            {
                displayName: 'Simplify',
                name: 'simple',
                type: 'boolean',
                displayOptions: {
                    show: {
                        resource: ['text'],
                        operation: ['detectDominantLanguage'],
                    },
                },
                default: true,
                description: 'Whether to return a simplified version of the response instead of the raw data',
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                displayOptions: {
                    show: {
                        resource: ['text'],
                        operation: ['detectEntities'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'Endpoint Arn',
                        name: 'endpointArn',
                        type: 'string',
                        default: '',
                        description: 'The Amazon Resource Name of an endpoint that is associated with a custom entity recognition model',
                    },
                ],
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'text') {
                    //https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectDominantLanguage.html
                    if (operation === 'detectDominantLanguage') {
                        const text = this.getNodeParameter('text', i);
                        const simple = this.getNodeParameter('simple', i);
                        const body = {
                            Text: text,
                        };
                        const action = 'Comprehend_20171127.DetectDominantLanguage';
                        responseData = await GenericFunctions_1.awsApiRequestREST.call(this, 'comprehend', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                        if (simple) {
                            responseData = responseData.Languages.reduce((accumulator, currentValue) => {
                                accumulator[currentValue.LanguageCode] = currentValue.Score;
                                return accumulator;
                            }, {});
                        }
                    }
                    //https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectSentiment.html
                    if (operation === 'detectSentiment') {
                        const action = 'Comprehend_20171127.DetectSentiment';
                        const text = this.getNodeParameter('text', i);
                        const languageCode = this.getNodeParameter('languageCode', i);
                        const body = {
                            Text: text,
                            LanguageCode: languageCode,
                        };
                        responseData = await GenericFunctions_1.awsApiRequestREST.call(this, 'comprehend', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                    }
                    //https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectEntities.html
                    if (operation === 'detectEntities') {
                        const action = 'Comprehend_20171127.DetectEntities';
                        const text = this.getNodeParameter('text', i);
                        const languageCode = this.getNodeParameter('languageCode', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            Text: text,
                            LanguageCode: languageCode,
                        };
                        if (additionalFields.endpointArn) {
                            body.EndpointArn = additionalFields.endpointArn;
                        }
                        responseData = await GenericFunctions_1.awsApiRequestREST.call(this, 'comprehend', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                        responseData = responseData.Entities;
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionData);
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.AwsComprehend = AwsComprehend;
//# sourceMappingURL=AwsComprehend.node.js.map