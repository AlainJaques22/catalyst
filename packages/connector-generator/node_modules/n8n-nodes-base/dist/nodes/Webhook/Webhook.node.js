"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
/* eslint-disable n8n-nodes-base/node-execute-block-wrong-error-thrown */
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const isbot_1 = __importDefault(require("isbot"));
const n8n_workflow_1 = require("n8n-workflow");
const a = __importStar(require("node:assert"));
const promises_2 = require("stream/promises");
const tmp_promise_1 = require("tmp-promise");
const uuid_1 = require("uuid");
const description_1 = require("./description");
const error_1 = require("./error");
const utils_1 = require("./utils");
class Webhook extends n8n_workflow_1.Node {
    authPropertyName = 'authentication';
    description = {
        displayName: 'Webhook',
        icon: { light: 'file:webhook.svg', dark: 'file:webhook.dark.svg' },
        name: 'webhook',
        group: ['trigger'],
        version: [1, 1.1, 2, 2.1],
        defaultVersion: 2.1,
        description: 'Starts the workflow when a webhook is called',
        eventTriggerDescription: 'Waiting for you to call the Test URL',
        activationMessage: 'You can now make calls to your production webhook URL.',
        defaults: {
            name: 'Webhook',
        },
        supportsCORS: true,
        triggerPanel: {
            header: '',
            executionsHelp: {
                inactive: 'Webhooks have two modes: test and production. <br /> <br /> <b>Use test mode while you build your workflow</b>. Click the \'listen\' button, then make a request to the test URL. The executions will show up in the editor.<br /> <br /> <b>Use production mode to run your workflow automatically</b>. <a data-key="activate">Activate</a> the workflow, then make requests to the production URL. These executions will show up in the executions list, but not in the editor.',
                active: 'Webhooks have two modes: test and production. <br /> <br /> <b>Use test mode while you build your workflow</b>. Click the \'listen\' button, then make a request to the test URL. The executions will show up in the editor.<br /> <br /> <b>Use production mode to run your workflow automatically</b>. Since the workflow is activated, you can make requests to the production URL. These executions will show up in the <a data-key="executions">executions list</a>, but not in the editor.',
            },
            activationHint: "Once you've finished building your workflow, run it without having to click this button by using the production webhook URL.",
        },
        inputs: [],
        outputs: `={{(${utils_1.configuredOutputs})($parameter)}}`,
        credentials: (0, description_1.credentialsProperty)(this.authPropertyName),
        webhooks: [description_1.defaultWebhookDescription],
        properties: [
            {
                displayName: 'Allow Multiple HTTP Methods',
                name: 'multipleMethods',
                type: 'boolean',
                default: false,
                isNodeSetting: true,
                description: 'Whether to allow the webhook to listen for multiple HTTP methods',
            },
            {
                ...description_1.httpMethodsProperty,
                displayOptions: {
                    show: {
                        multipleMethods: [false],
                    },
                },
            },
            {
                displayName: 'HTTP Methods',
                name: 'httpMethod',
                type: 'multiOptions',
                options: [
                    {
                        name: 'DELETE',
                        value: 'DELETE',
                    },
                    {
                        name: 'GET',
                        value: 'GET',
                    },
                    {
                        name: 'HEAD',
                        value: 'HEAD',
                    },
                    {
                        name: 'PATCH',
                        value: 'PATCH',
                    },
                    {
                        name: 'POST',
                        value: 'POST',
                    },
                    {
                        name: 'PUT',
                        value: 'PUT',
                    },
                ],
                default: ['GET', 'POST'],
                description: 'The HTTP methods to listen to',
                displayOptions: {
                    show: {
                        multipleMethods: [true],
                    },
                },
            },
            {
                displayName: 'Path',
                name: 'path',
                type: 'string',
                default: '',
                placeholder: 'webhook',
                description: "The path to listen to, dynamic values could be specified by using ':', e.g. 'your-path/:dynamic-value'. If dynamic values are set 'webhookId' would be prepended to path.",
            },
            (0, description_1.authenticationProperty)(this.authPropertyName),
            description_1.responseModeProperty,
            description_1.responseModePropertyStreaming,
            {
                displayName: 'Insert a \'Respond to Webhook\' node to control when and how you respond. <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/" target="_blank">More details</a>',
                name: 'webhookNotice',
                type: 'notice',
                displayOptions: {
                    show: {
                        responseMode: ['responseNode'],
                    },
                },
                default: '',
            },
            {
                displayName: 'Insert a node that supports streaming (e.g. \'AI Agent\') and enable streaming to stream directly to the response while the workflow is executed. <a href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/" target="_blank">More details</a>',
                name: 'webhookStreamingNotice',
                type: 'notice',
                displayOptions: {
                    show: {
                        responseMode: ['streaming'],
                    },
                },
                default: '',
            },
            {
                ...description_1.responseCodeProperty,
                displayOptions: {
                    show: {
                        '@version': [1, 1.1],
                    },
                    hide: {
                        responseMode: ['responseNode'],
                    },
                },
            },
            description_1.responseDataProperty,
            description_1.responseBinaryPropertyNameProperty,
            {
                displayName: 'If you are sending back a response, add a "Content-Type" response header with the appropriate value to avoid unexpected behavior',
                name: 'contentTypeNotice',
                type: 'notice',
                default: '',
                displayOptions: {
                    show: {
                        responseMode: ['onReceived'],
                    },
                },
            },
            {
                ...description_1.optionsProperty,
                options: [...description_1.optionsProperty.options, description_1.responseCodeOption].sort((a, b) => {
                    const nameA = a.displayName.toUpperCase();
                    const nameB = b.displayName.toUpperCase();
                    if (nameA < nameB)
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0;
                }),
            },
        ],
    };
    async webhook(context) {
        const { typeVersion: nodeVersion, type: nodeType } = context.getNode();
        const responseMode = context.getNodeParameter('responseMode', 'onReceived');
        if (nodeVersion >= 2 && nodeType === 'n8n-nodes-base.webhook') {
            (0, utils_1.checkResponseModeConfiguration)(context);
        }
        const options = context.getNodeParameter('options', {});
        const req = context.getRequestObject();
        const resp = context.getResponseObject();
        const requestMethod = context.getRequestObject().method;
        if (!(0, utils_1.isIpWhitelisted)(options.ipWhitelist, req.ips, req.ip)) {
            resp.writeHead(403);
            resp.end('IP is not whitelisted to access the webhook!');
            return { noWebhookResponse: true };
        }
        let validationData;
        try {
            if (options.ignoreBots && (0, isbot_1.default)(req.headers['user-agent']))
                throw new error_1.WebhookAuthorizationError(403);
            validationData = await this.validateAuth(context);
        }
        catch (error) {
            if (error instanceof error_1.WebhookAuthorizationError) {
                resp.writeHead(error.responseCode, { 'WWW-Authenticate': 'Basic realm="Webhook"' });
                resp.end(error.message);
                return { noWebhookResponse: true };
            }
            throw error;
        }
        const prepareOutput = (0, utils_1.setupOutputConnection)(context, requestMethod, {
            jwtPayload: validationData,
        });
        if (options.binaryData) {
            return await this.handleBinaryData(context, prepareOutput);
        }
        if (req.contentType === 'multipart/form-data') {
            return await this.handleFormData(context, prepareOutput);
        }
        if (nodeVersion > 1 && !req.body && !options.rawBody) {
            try {
                return await this.handleBinaryData(context, prepareOutput);
            }
            catch (error) { }
        }
        if (options.rawBody && !req.rawBody) {
            await req.readRawBody();
        }
        const response = {
            json: {
                headers: req.headers,
                params: req.params,
                query: req.query,
                body: req.body,
            },
            binary: options.rawBody
                ? {
                    data: {
                        data: (req.rawBody ?? '').toString(n8n_workflow_1.BINARY_ENCODING),
                        mimeType: req.contentType ?? 'application/json',
                    },
                }
                : undefined,
        };
        if (responseMode === 'streaming') {
            const res = context.getResponseObject();
            // Set up streaming response headers
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            });
            // Flush headers immediately
            res.flushHeaders();
            return {
                noWebhookResponse: true,
                workflowData: prepareOutput(response),
            };
        }
        return {
            webhookResponse: options.responseData,
            workflowData: prepareOutput(response),
        };
    }
    async validateAuth(context) {
        return await (0, utils_1.validateWebhookAuthentication)(context, this.authPropertyName);
    }
    async handleFormData(context, prepareOutput) {
        const req = context.getRequestObject();
        a.ok(req.contentType === 'multipart/form-data', 'Expected multipart/form-data');
        const options = context.getNodeParameter('options', {});
        const { data, files } = req.body;
        const returnItem = {
            json: {
                headers: req.headers,
                params: req.params,
                query: req.query,
                body: data,
            },
        };
        if (files && Object.keys(files).length) {
            returnItem.binary = {};
        }
        let count = 0;
        for (const key of Object.keys(files)) {
            const processFiles = [];
            let multiFile = false;
            if (Array.isArray(files[key])) {
                processFiles.push(...files[key]);
                multiFile = true;
            }
            else {
                processFiles.push(files[key]);
            }
            let fileCount = 0;
            for (const file of processFiles) {
                let binaryPropertyName = key;
                if (binaryPropertyName.endsWith('[]')) {
                    binaryPropertyName = binaryPropertyName.slice(0, -2);
                }
                if (multiFile) {
                    binaryPropertyName += fileCount++;
                }
                if (options.binaryPropertyName) {
                    binaryPropertyName = `${options.binaryPropertyName}${count}`;
                }
                returnItem.binary[binaryPropertyName] = await context.nodeHelpers.copyBinaryFile(file.filepath, file.originalFilename ?? file.newFilename, file.mimetype);
                // Delete original file to prevent tmp directory from growing too large
                await (0, promises_1.rm)(file.filepath, { force: true });
                count += 1;
            }
        }
        return { workflowData: prepareOutput(returnItem) };
    }
    async handleBinaryData(context, prepareOutput) {
        const req = context.getRequestObject();
        const options = context.getNodeParameter('options', {});
        // TODO: create empty binaryData placeholder, stream into that path, and then finalize the binaryData
        const binaryFile = await (0, tmp_promise_1.file)({ prefix: 'n8n-webhook-' });
        try {
            await (0, promises_2.pipeline)(req, (0, fs_1.createWriteStream)(binaryFile.path));
            const returnItem = {
                json: {
                    headers: req.headers,
                    params: req.params,
                    query: req.query,
                    body: {},
                },
            };
            const stats = await (0, promises_1.stat)(binaryFile.path);
            if (stats.size) {
                const binaryPropertyName = (options.binaryPropertyName ?? 'data');
                const fileName = req.contentDisposition?.filename ?? (0, uuid_1.v4)();
                const binaryData = await context.nodeHelpers.copyBinaryFile(binaryFile.path, fileName, req.contentType ?? 'application/octet-stream');
                returnItem.binary = { [binaryPropertyName]: binaryData };
            }
            return { workflowData: prepareOutput(returnItem) };
        }
        catch (error) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), error);
        }
        finally {
            await binaryFile.cleanup();
        }
    }
}
exports.Webhook = Webhook;
//# sourceMappingURL=Webhook.node.js.map