"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespondToWebhook = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
const binary_1 = require("./utils/binary");
const outputs_1 = require("./utils/outputs");
const utilities_1 = require("../../utils/utilities");
const respondWithProperty = {
    displayName: 'Respond With',
    name: 'respondWith',
    type: 'options',
    options: [
        {
            name: 'All Incoming Items',
            value: 'allIncomingItems',
            description: 'Respond with all input JSON items',
        },
        {
            name: 'Binary File',
            value: 'binary',
            description: 'Respond with incoming file binary data',
        },
        {
            name: 'First Incoming Item',
            value: 'firstIncomingItem',
            description: 'Respond with the first input JSON item',
        },
        {
            name: 'JSON',
            value: 'json',
            description: 'Respond with a custom JSON body',
        },
        {
            name: 'JWT Token',
            value: 'jwt',
            description: 'Respond with a JWT token',
        },
        {
            name: 'No Data',
            value: 'noData',
            description: 'Respond with an empty body',
        },
        {
            name: 'Redirect',
            value: 'redirect',
            description: 'Respond with a redirect to a given URL',
        },
        {
            name: 'Text',
            value: 'text',
            description: 'Respond with a simple text message body',
        },
    ],
    default: 'firstIncomingItem',
    description: 'The data that should be returned',
};
class RespondToWebhook {
    description = {
        displayName: 'Respond to Webhook',
        icon: { light: 'file:webhook.svg', dark: 'file:webhook.dark.svg' },
        name: 'respondToWebhook',
        group: ['transform'],
        version: [1, 1.1, 1.2, 1.3, 1.4, 1.5],
        defaultVersion: 1.5,
        description: 'Returns data for Webhook',
        defaults: {
            name: 'Respond to Webhook',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: `={{(${outputs_1.configuredOutputs})($nodeVersion, $parameter)}}`,
        credentials: [
            {
                name: 'jwtAuth',
                required: true,
                displayOptions: {
                    show: {
                        respondWith: ['jwt'],
                    },
                },
            },
        ],
        properties: [
            {
                displayName: 'Enable Response Output Branch',
                name: 'enableResponseOutput',
                type: 'boolean',
                default: false,
                description: 'Whether to provide an additional output branch with the response sent to the webhook',
                isNodeSetting: true,
                displayOptions: { show: { '@version': [{ _cnd: { gte: 1.4 } }] } },
            },
            {
                displayName: 'Verify that the "Webhook" node\'s "Respond" parameter is set to "Using Respond to Webhook Node". <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/" target="_blank">More details',
                name: 'generalNotice',
                type: 'notice',
                default: '',
            },
            {
                ...respondWithProperty,
                displayOptions: { show: { '@version': [1, 1.1] } },
            },
            {
                ...respondWithProperty,
                noDataExpression: true,
                displayOptions: { show: { '@version': [{ _cnd: { gte: 1.2 } }] } },
            },
            {
                displayName: 'Credentials',
                name: 'credentials',
                type: 'credentials',
                default: '',
                displayOptions: {
                    show: {
                        respondWith: ['jwt'],
                    },
                },
            },
            {
                displayName: 'When using expressions, note that this node will only run for the first item in the input data',
                name: 'webhookNotice',
                type: 'notice',
                displayOptions: {
                    show: {
                        respondWith: ['json', 'text', 'jwt'],
                    },
                },
                default: '',
            },
            {
                displayName: 'Redirect URL',
                name: 'redirectURL',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        respondWith: ['redirect'],
                    },
                },
                default: '',
                placeholder: 'e.g. http://www.n8n.io',
                description: 'The URL to redirect to',
                validateType: 'url',
            },
            {
                displayName: 'Response Body',
                name: 'responseBody',
                type: 'json',
                displayOptions: {
                    show: {
                        respondWith: ['json'],
                    },
                },
                default: '{\n  "myField": "value"\n}',
                typeOptions: {
                    rows: 4,
                },
                description: 'The HTTP response JSON data',
            },
            {
                displayName: 'Payload',
                name: 'payload',
                type: 'json',
                displayOptions: {
                    show: {
                        respondWith: ['jwt'],
                    },
                },
                default: '{\n  "myField": "value"\n}',
                typeOptions: {
                    rows: 4,
                },
                validateType: 'object',
                description: 'The payload to include in the JWT token',
            },
            {
                displayName: 'Response Body',
                name: 'responseBody',
                type: 'string',
                displayOptions: {
                    show: {
                        respondWith: ['text'],
                    },
                },
                typeOptions: {
                    rows: 2,
                },
                default: '',
                placeholder: 'e.g. Workflow completed',
                description: 'The HTTP response text data',
            },
            {
                displayName: 'Response Data Source',
                name: 'responseDataSource',
                type: 'options',
                displayOptions: {
                    show: {
                        respondWith: ['binary'],
                    },
                },
                options: [
                    {
                        name: 'Choose Automatically From Input',
                        value: 'automatically',
                        description: 'Use if input data will contain a single piece of binary data',
                    },
                    {
                        name: 'Specify Myself',
                        value: 'set',
                        description: 'Enter the name of the input field the binary data will be in',
                    },
                ],
                default: 'automatically',
            },
            {
                displayName: 'Input Field Name',
                name: 'inputFieldName',
                type: 'string',
                required: true,
                default: 'data',
                displayOptions: {
                    show: {
                        respondWith: ['binary'],
                        responseDataSource: ['set'],
                    },
                },
                description: 'The name of the node input field with the binary data',
            },
            {
                displayName: 'To avoid unexpected behavior, add a "Content-Type" response header with the appropriate value',
                name: 'contentTypeNotice',
                type: 'notice',
                default: '',
                displayOptions: {
                    show: {
                        respondWith: ['text'],
                    },
                },
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add option',
                default: {},
                options: [
                    {
                        displayName: 'Response Code',
                        name: 'responseCode',
                        type: 'number',
                        typeOptions: {
                            minValue: 100,
                            maxValue: 599,
                        },
                        default: 200,
                        description: 'The HTTP response code to return. Defaults to 200.',
                    },
                    {
                        displayName: 'Response Headers',
                        name: 'responseHeaders',
                        placeholder: 'Add Response Header',
                        description: 'Add headers to the webhook response',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                        },
                        default: {},
                        options: [
                            {
                                name: 'entries',
                                displayName: 'Entries',
                                values: [
                                    {
                                        displayName: 'Name',
                                        name: 'name',
                                        type: 'string',
                                        default: '',
                                        description: 'Name of the header',
                                    },
                                    {
                                        displayName: 'Value',
                                        name: 'value',
                                        type: 'string',
                                        default: '',
                                        description: 'Value of the header',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        displayName: 'Put Response in Field',
                        name: 'responseKey',
                        type: 'string',
                        displayOptions: {
                            show: {
                                ['/respondWith']: ['allIncomingItems', 'firstIncomingItem'],
                            },
                        },
                        default: '',
                        description: 'The name of the response field to put all items in',
                        placeholder: 'e.g. data',
                    },
                    {
                        displayName: 'Enable Streaming',
                        name: 'enableStreaming',
                        type: 'boolean',
                        default: true,
                        description: 'Whether to enable streaming to the response',
                        displayOptions: {
                            show: {
                                ['/respondWith']: ['allIncomingItems', 'firstIncomingItem', 'text', 'json', 'jwt'],
                                '@version': [{ _cnd: { gte: 1.5 } }],
                            },
                        },
                    },
                ],
            },
        ],
    };
    async onMessage(context, _data) {
        const inputData = context.getInputData();
        return [inputData];
    }
    async execute() {
        const items = this.getInputData();
        const nodeVersion = this.getNode().typeVersion;
        const WEBHOOK_NODE_TYPES = [
            n8n_workflow_1.WEBHOOK_NODE_TYPE,
            n8n_workflow_1.FORM_TRIGGER_NODE_TYPE,
            n8n_workflow_1.CHAT_TRIGGER_NODE_TYPE,
            n8n_workflow_1.WAIT_NODE_TYPE,
        ];
        let response;
        const connectedNodes = this.getParentNodes(this.getNode().name, {
            includeNodeParameters: true,
        });
        const options = this.getNodeParameter('options', 0, {});
        const shouldStream = nodeVersion >= 1.5 && this.isStreaming() && options.enableStreaming !== false;
        try {
            if (nodeVersion >= 1.1) {
                if (!connectedNodes.some(({ type }) => WEBHOOK_NODE_TYPES.includes(type))) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), new Error('No Webhook node found in the workflow'), {
                        description: 'Insert a Webhook node to your workflow and set the “Respond” parameter to “Using Respond to Webhook Node” ',
                    });
                }
            }
            const respondWith = this.getNodeParameter('respondWith', 0);
            const headers = {};
            if (options.responseHeaders) {
                for (const header of options.responseHeaders.entries) {
                    if (typeof header.name !== 'string') {
                        header.name = header.name?.toString();
                    }
                    headers[header.name?.toLowerCase()] = header.value?.toString();
                }
            }
            let statusCode = options.responseCode || 200;
            let responseBody;
            if (respondWith === 'json') {
                const responseBodyParameter = this.getNodeParameter('responseBody', 0);
                if (responseBodyParameter) {
                    if (typeof responseBodyParameter === 'object') {
                        responseBody = responseBodyParameter;
                    }
                    else {
                        try {
                            responseBody = (0, n8n_workflow_1.jsonParse)(responseBodyParameter);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                                message: "Invalid JSON in 'Response Body' field",
                                description: "Check that the syntax of the JSON in the 'Response Body' parameter is valid",
                            });
                        }
                    }
                }
                if (shouldStream) {
                    this.sendChunk('begin', 0);
                    this.sendChunk('item', 0, responseBody);
                    this.sendChunk('end', 0);
                }
            }
            else if (respondWith === 'jwt') {
                try {
                    const { keyType, secret, algorithm, privateKey } = await this.getCredentials('jwtAuth');
                    let secretOrPrivateKey;
                    if (keyType === 'passphrase') {
                        secretOrPrivateKey = secret;
                    }
                    else {
                        secretOrPrivateKey = (0, utilities_1.formatPrivateKey)(privateKey);
                    }
                    const payload = this.getNodeParameter('payload', 0, {});
                    const token = jsonwebtoken_1.default.sign(payload, secretOrPrivateKey, { algorithm });
                    responseBody = { token };
                    if (shouldStream) {
                        this.sendChunk('begin', 0);
                        this.sendChunk('item', 0, responseBody);
                        this.sendChunk('end', 0);
                    }
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        message: 'Error signing JWT token',
                    });
                }
            }
            else if (respondWith === 'allIncomingItems') {
                const respondItems = items.map((item, index) => {
                    this.sendChunk('begin', index);
                    this.sendChunk('item', index, item.json);
                    this.sendChunk('end', index);
                    return item.json;
                });
                responseBody = options.responseKey
                    ? (0, set_1.default)({}, options.responseKey, respondItems)
                    : respondItems;
            }
            else if (respondWith === 'firstIncomingItem') {
                responseBody = options.responseKey
                    ? (0, set_1.default)({}, options.responseKey, items[0].json)
                    : items[0].json;
                if (shouldStream) {
                    this.sendChunk('begin', 0);
                    this.sendChunk('item', 0, items[0].json);
                    this.sendChunk('end', 0);
                }
            }
            else if (respondWith === 'text') {
                const rawBody = this.getNodeParameter('responseBody', 0);
                responseBody = rawBody;
                // Send the raw body to the stream
                if (shouldStream) {
                    this.sendChunk('begin', 0);
                    this.sendChunk('item', 0, rawBody);
                    this.sendChunk('end', 0);
                }
            }
            else if (respondWith === 'binary') {
                const item = items[0];
                if (item.binary === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on the first item!');
                }
                let responseBinaryPropertyName;
                const responseDataSource = this.getNodeParameter('responseDataSource', 0);
                if (responseDataSource === 'set') {
                    responseBinaryPropertyName = this.getNodeParameter('inputFieldName', 0);
                }
                else {
                    const binaryKeys = Object.keys(item.binary);
                    if (binaryKeys.length === 0) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on the first item!');
                    }
                    responseBinaryPropertyName = binaryKeys[0];
                }
                const binaryData = this.helpers.assertBinaryData(0, responseBinaryPropertyName);
                responseBody = (0, binary_1.getBinaryResponse)(binaryData, headers);
            }
            else if (respondWith === 'redirect') {
                headers.location = this.getNodeParameter('redirectURL', 0);
                statusCode = options.responseCode ?? 307;
            }
            else if (respondWith !== 'noData') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The Response Data option "${respondWith}" is not supported!`);
            }
            const chatTrigger = connectedNodes.find((node) => node.type === n8n_workflow_1.CHAT_TRIGGER_NODE_TYPE && !node.disabled);
            const parameters = chatTrigger?.parameters;
            // if workflow is started from chat trigger and responseMode is set to "responseNodes"
            // response to chat will be send by ChatService
            if (chatTrigger &&
                !chatTrigger.disabled &&
                parameters.options.responseMode === 'responseNodes') {
                let message = '';
                if (responseBody && typeof responseBody === 'object' && !Array.isArray(responseBody)) {
                    message =
                        (responseBody.output ??
                            responseBody.text ??
                            responseBody.message) ?? '';
                    if (message === '' && Object.keys(responseBody).length > 0) {
                        try {
                            message = JSON.stringify(responseBody, null, 2);
                        }
                        catch (e) { }
                    }
                }
                await this.putExecutionToWait(n8n_workflow_1.WAIT_INDEFINITELY);
                return [[{ json: {}, sendMessage: message }]];
            }
            response = {
                body: responseBody,
                headers,
                statusCode,
            };
            if (!shouldStream || respondWith === 'binary') {
                this.sendResponse(response);
            }
        }
        catch (error) {
            if (this.continueOnFail()) {
                const itemData = (0, utilities_1.generatePairedItemData)(items.length);
                const returnData = this.helpers.constructExecutionMetaData([{ json: { error: error.message } }], { itemData });
                return [returnData];
            }
            throw error;
        }
        if (nodeVersion === 1.3) {
            return [items, [{ json: { response } }]];
        }
        else if (nodeVersion >= 1.4 && this.getNodeParameter('enableResponseOutput', 0, false)) {
            return [items, [{ json: { response } }]];
        }
        return [items];
    }
}
exports.RespondToWebhook = RespondToWebhook;
//# sourceMappingURL=RespondToWebhook.node.js.map