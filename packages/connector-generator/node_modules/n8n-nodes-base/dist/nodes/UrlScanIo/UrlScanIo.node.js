"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlScanIo = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class UrlScanIo {
    description = {
        displayName: 'urlscan.io',
        name: 'urlScanIo',
        icon: 'file:urlScanIo.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Provides various utilities for monitoring websites like health checks or screenshots',
        defaults: {
            name: 'urlscan.io',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'urlScanIoApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                noDataExpression: true,
                type: 'options',
                options: [
                    {
                        name: 'Scan',
                        value: 'scan',
                    },
                ],
                default: 'scan',
            },
            ...descriptions_1.scanOperations,
            ...descriptions_1.scanFields,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'scan') {
                    // **********************************************************************
                    //                               scan
                    // **********************************************************************
                    if (operation === 'get') {
                        // ----------------------------------------
                        //               scan: get
                        // ----------------------------------------
                        const scanId = this.getNodeParameter('scanId', i);
                        responseData = await GenericFunctions_1.urlScanIoApiRequest.call(this, 'GET', `/result/${scanId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             scan: getAll
                        // ----------------------------------------
                        // https://urlscan.io/docs/search
                        const filters = this.getNodeParameter('filters', i);
                        const qs = {};
                        if (filters?.query) {
                            qs.q = filters.query;
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, '/search', qs);
                        responseData = responseData.map(GenericFunctions_1.normalizeId);
                    }
                    else if (operation === 'perform') {
                        // ----------------------------------------
                        //             scan: perform
                        // ----------------------------------------
                        // https://urlscan.io/docs/search
                        const { tags: rawTags, ...rest } = this.getNodeParameter('additionalFields', i);
                        const body = {
                            url: this.getNodeParameter('url', i),
                            ...rest,
                        };
                        if (rawTags) {
                            const tags = rawTags.split(',').map((tag) => tag.trim());
                            if (tags.length > 10) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at most 10 tags', {
                                    itemIndex: i,
                                });
                            }
                            body.tags = tags;
                        }
                        responseData = await GenericFunctions_1.urlScanIoApiRequest.call(this, 'POST', '/scan', body);
                        responseData = (0, GenericFunctions_1.normalizeId)(responseData);
                    }
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
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
exports.UrlScanIo = UrlScanIo;
//# sourceMappingURL=UrlScanIo.node.js.map