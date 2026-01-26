"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistralAi = void 0;
const form_data_1 = __importDefault(require("form-data"));
const chunk_1 = __importDefault(require("lodash/chunk"));
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class MistralAi {
    description = {
        displayName: 'Mistral AI',
        name: 'mistralAi',
        icon: {
            light: 'file:mistralAi.svg',
            dark: 'file:mistralAi.svg',
        },
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Consume Mistral AI API',
        defaults: {
            name: 'Mistral AI',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'mistralCloudApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Document',
                        value: 'document',
                    },
                ],
                default: 'document',
            },
            ...descriptions_1.document.description,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        if (resource === 'document') {
            if (operation === 'extractText') {
                const enableBatch = this.getNodeParameter('options.batch', 0, false);
                if (enableBatch) {
                    try {
                        const deleteFiles = this.getNodeParameter('options.deleteFiles', 0, true);
                        const model = this.getNodeParameter('model', 0);
                        const batchSize = this.getNodeParameter('options.batchSize', 0, 50);
                        const itemsWithIndex = items.map((item, index) => ({
                            ...item,
                            index,
                        }));
                        const fileIds = [];
                        for (const batch of (0, chunk_1.default)(itemsWithIndex, batchSize)) {
                            const entries = [];
                            for (const item of batch) {
                                const documentType = this.getNodeParameter('documentType', item.index);
                                const { dataUrl, fileName } = await GenericFunctions_1.encodeBinaryData.call(this, item.index);
                                entries.push({
                                    custom_id: item.index.toString(),
                                    body: {
                                        document: {
                                            type: documentType,
                                            document_name: documentType === 'document_url' ? fileName : undefined,
                                            [documentType]: dataUrl,
                                        },
                                    },
                                });
                            }
                            const formData = new form_data_1.default();
                            formData.append('file', Buffer.from(entries.map((entry) => JSON.stringify(entry)).join('\n')), {
                                filename: 'batch_file.jsonl',
                                contentType: 'application/json',
                            });
                            formData.append('purpose', 'batch');
                            const fileResponse = await GenericFunctions_1.mistralApiRequest.call(this, 'POST', '/v1/files', formData);
                            fileIds.push(fileResponse.id);
                        }
                        const jobIds = [];
                        for (const fileId of fileIds) {
                            const body = {
                                model,
                                input_files: [fileId],
                                endpoint: '/v1/ocr',
                            };
                            jobIds.push((await GenericFunctions_1.mistralApiRequest.call(this, 'POST', '/v1/batch/jobs', body)).id);
                        }
                        const jobResults = [];
                        for (const jobId of jobIds) {
                            let job = (await GenericFunctions_1.mistralApiRequest.call(this, 'GET', `/v1/batch/jobs/${jobId}`));
                            while (job.status === 'QUEUED' || job.status === 'RUNNING') {
                                await new Promise((resolve) => setTimeout(resolve, 2000));
                                job = (await GenericFunctions_1.mistralApiRequest.call(this, 'GET', `/v1/batch/jobs/${jobId}`));
                            }
                            jobResults.push(job);
                        }
                        if (deleteFiles) {
                            for (const fileId of fileIds) {
                                try {
                                    await GenericFunctions_1.mistralApiRequest.call(this, 'DELETE', `/v1/files/${fileId}`);
                                }
                                catch { }
                            }
                        }
                        for (const jobResult of jobResults) {
                            if (jobResult.status !== 'SUCCESS' ||
                                (jobResult.errors && jobResult.errors.length > 0)) {
                                for (let i = 0; i < items.length; i++) {
                                    if (this.continueOnFail()) {
                                        const errorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({
                                            error: 'Batch job failed or returned errors',
                                        }), { itemData: { item: i } });
                                        returnData.push(...errorData);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                                            message: `Batch job failed with status: ${jobResult.status}`,
                                        });
                                    }
                                }
                                continue;
                            }
                            else {
                                const fileResponse = (await GenericFunctions_1.mistralApiRequest.call(this, 'GET', `/v1/files/${jobResult.output_file}/content`));
                                if (deleteFiles) {
                                    try {
                                        await GenericFunctions_1.mistralApiRequest.call(this, 'DELETE', `/v1/files/${jobResult.output_file}`);
                                    }
                                    catch { }
                                }
                                let batchResult;
                                if (typeof fileResponse === 'string') {
                                    batchResult = fileResponse
                                        .trim()
                                        .split('\n')
                                        .map((json) => JSON.parse(json));
                                }
                                else {
                                    // If the response is not a string, it is a single item result
                                    batchResult = [fileResponse];
                                }
                                for (const result of batchResult) {
                                    const index = parseInt(result.custom_id, 10);
                                    if (result.error) {
                                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: result.error }), { itemData: { item: index } });
                                        returnData.push(...executionData);
                                    }
                                    else {
                                        const data = (0, GenericFunctions_1.processResponseData)(result.response.body);
                                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(data), { itemData: { item: index } });
                                        returnData.push(...executionData);
                                    }
                                }
                            }
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            const executionError = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({
                                error: error instanceof Error ? error.message : JSON.stringify(error),
                            }), { itemData: { item: 0 } });
                            returnData.push(...executionError);
                        }
                        else {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                    }
                }
                else {
                    let responseData;
                    for (let i = 0; i < items.length; i++) {
                        try {
                            const model = this.getNodeParameter('model', i);
                            const inputType = this.getNodeParameter('inputType', i);
                            const documentType = this.getNodeParameter('documentType', i);
                            if (inputType === 'binary') {
                                const { dataUrl, fileName } = await GenericFunctions_1.encodeBinaryData.call(this, i);
                                const body = {
                                    model,
                                    document: {
                                        type: documentType,
                                        document_name: documentType === 'document_url' ? fileName : undefined,
                                        [documentType]: dataUrl,
                                    },
                                };
                                responseData = (await GenericFunctions_1.mistralApiRequest.call(this, 'POST', '/v1/ocr', body));
                                responseData = (0, GenericFunctions_1.processResponseData)(responseData);
                            }
                            else {
                                const url = this.getNodeParameter('url', i);
                                const body = {
                                    model,
                                    document: {
                                        type: documentType,
                                        [documentType]: url,
                                    },
                                };
                                responseData = (await GenericFunctions_1.mistralApiRequest.call(this, 'POST', '/v1/ocr', body));
                                responseData = (0, GenericFunctions_1.processResponseData)(responseData);
                            }
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                            returnData.push(...executionData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                const executionError = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({
                                    error: error instanceof Error ? error.message : JSON.stringify(error),
                                }), { itemData: { item: i } });
                                returnData.push(...executionError);
                            }
                            else {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                        }
                    }
                }
            }
        }
        return [returnData];
    }
}
exports.MistralAi = MistralAi;
//# sourceMappingURL=MistralAi.node.js.map