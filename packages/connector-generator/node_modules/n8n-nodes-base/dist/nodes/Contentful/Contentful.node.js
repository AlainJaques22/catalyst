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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contentful = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const AssetDescription = __importStar(require("./AssetDescription"));
const ContentTypeDescription = __importStar(require("./ContentTypeDescription"));
const EntryDescription = __importStar(require("./EntryDescription"));
const GenericFunctions_1 = require("./GenericFunctions");
const LocaleDescription = __importStar(require("./LocaleDescription"));
const SpaceDescription = __importStar(require("./SpaceDescription"));
class Contentful {
    description = {
        displayName: 'Contentful',
        name: 'contentful',
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:contentful.png',
        group: ['input'],
        version: 1,
        description: 'Consume Contentful API',
        defaults: {
            name: 'Contentful',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'contentfulApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Source',
                name: 'source',
                type: 'options',
                default: 'deliveryApi',
                description: 'Pick where your data comes from, delivery or preview API',
                options: [
                    {
                        name: 'Delivery API',
                        value: 'deliveryApi',
                    },
                    {
                        name: 'Preview API',
                        value: 'previewApi',
                    },
                ],
            },
            // Resources:
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    AssetDescription.resource,
                    ContentTypeDescription.resource,
                    EntryDescription.resource,
                    LocaleDescription.resource,
                    SpaceDescription.resource,
                ],
                default: 'entry',
            },
            // Operations:
            ...SpaceDescription.operations,
            ...ContentTypeDescription.operations,
            ...EntryDescription.operations,
            ...AssetDescription.operations,
            ...LocaleDescription.operations,
            // Resource specific fields:
            ...SpaceDescription.fields,
            ...ContentTypeDescription.fields,
            ...EntryDescription.fields,
            ...AssetDescription.fields,
            ...LocaleDescription.fields,
        ],
    };
    async execute() {
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        const items = this.getInputData();
        const returnData = [];
        const qs = {};
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'space') {
                    if (operation === 'get') {
                        const credentials = await this.getCredentials('contentfulApi');
                        responseData = await GenericFunctions_1.contentfulApiRequest.call(this, 'GET', `/spaces/${credentials?.spaceId}`);
                    }
                }
                if (resource === 'contentType') {
                    if (operation === 'get') {
                        const credentials = await this.getCredentials('contentfulApi');
                        const env = this.getNodeParameter('environmentId', 0);
                        const id = this.getNodeParameter('contentTypeId', 0);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        responseData = await GenericFunctions_1.contentfulApiRequest.call(this, 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/content_types/${id}`);
                        if (!additionalFields.rawData) {
                            responseData = responseData.fields;
                        }
                    }
                }
                if (resource === 'entry') {
                    if (operation === 'get') {
                        const credentials = await this.getCredentials('contentfulApi');
                        const env = this.getNodeParameter('environmentId', 0);
                        const id = this.getNodeParameter('entryId', 0);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        responseData = await GenericFunctions_1.contentfulApiRequest.call(this, 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/entries/${id}`, {}, qs);
                        if (!additionalFields.rawData) {
                            responseData = responseData.fields;
                        }
                    }
                    else if (operation === 'getAll') {
                        const credentials = await this.getCredentials('contentfulApi');
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const rawData = additionalFields.rawData;
                        additionalFields.rawData = undefined;
                        const env = this.getNodeParameter('environmentId', i);
                        Object.assign(qs, additionalFields);
                        if (qs.equal) {
                            const [atribute, value] = qs.equal.split('=');
                            qs[atribute] = value;
                            delete qs.equal;
                        }
                        if (qs.notEqual) {
                            const [atribute, value] = qs.notEqual.split('=');
                            qs[atribute] = value;
                            delete qs.notEqual;
                        }
                        if (qs.include) {
                            const [atribute, value] = qs.include.split('=');
                            qs[atribute] = value;
                            delete qs.include;
                        }
                        if (qs.exclude) {
                            const [atribute, value] = qs.exclude.split('=');
                            qs[atribute] = value;
                            delete qs.exclude;
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.contentfulApiRequestAllItems.call(this, 'items', 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/entries`, {}, qs);
                            if (!rawData) {
                                const assets = [];
                                responseData.map((asset) => {
                                    assets.push(asset.fields);
                                });
                                responseData = assets;
                            }
                        }
                        else {
                            const limit = this.getNodeParameter('limit', 0);
                            qs.limit = limit;
                            responseData = await GenericFunctions_1.contentfulApiRequest.call(this, 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/entries`, {}, qs);
                            responseData = responseData.items;
                            if (!rawData) {
                                const assets = [];
                                responseData.map((asset) => {
                                    assets.push(asset.fields);
                                });
                                responseData = assets;
                            }
                        }
                    }
                }
                if (resource === 'asset') {
                    if (operation === 'get') {
                        const credentials = await this.getCredentials('contentfulApi');
                        const env = this.getNodeParameter('environmentId', 0);
                        const id = this.getNodeParameter('assetId', 0);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        responseData = await GenericFunctions_1.contentfulApiRequest.call(this, 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/assets/${id}`, {}, qs);
                        if (!additionalFields.rawData) {
                            responseData = responseData.fields;
                        }
                    }
                    else if (operation === 'getAll') {
                        const credentials = await this.getCredentials('contentfulApi');
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const rawData = additionalFields.rawData;
                        additionalFields.rawData = undefined;
                        const env = this.getNodeParameter('environmentId', i);
                        Object.assign(qs, additionalFields);
                        if (qs.equal) {
                            const [atribute, value] = qs.equal.split('=');
                            qs[atribute] = value;
                            delete qs.equal;
                        }
                        if (qs.notEqual) {
                            const [atribute, value] = qs.notEqual.split('=');
                            qs[atribute] = value;
                            delete qs.notEqual;
                        }
                        if (qs.include) {
                            const [atribute, value] = qs.include.split('=');
                            qs[atribute] = value;
                            delete qs.include;
                        }
                        if (qs.exclude) {
                            const [atribute, value] = qs.exclude.split('=');
                            qs[atribute] = value;
                            delete qs.exclude;
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.contentfulApiRequestAllItems.call(this, 'items', 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/assets`, {}, qs);
                            if (!rawData) {
                                const assets = [];
                                responseData.map((asset) => {
                                    assets.push(asset.fields);
                                });
                                responseData = assets;
                            }
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.limit = limit;
                            responseData = await GenericFunctions_1.contentfulApiRequest.call(this, 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/assets`, {}, qs);
                            responseData = responseData.items;
                            if (!rawData) {
                                const assets = [];
                                responseData.map((asset) => {
                                    assets.push(asset.fields);
                                });
                                responseData = assets;
                            }
                        }
                    }
                }
                if (resource === 'locale') {
                    if (operation === 'getAll') {
                        const credentials = await this.getCredentials('contentfulApi');
                        const returnAll = this.getNodeParameter('returnAll', 0);
                        const env = this.getNodeParameter('environmentId', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.contentfulApiRequestAllItems.call(this, 'items', 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/locales`, {}, qs);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', 0);
                            qs.limit = limit;
                            responseData = await GenericFunctions_1.contentfulApiRequest.call(this, 'GET', `/spaces/${credentials?.spaceId}/environments/${env}/locales`, {}, qs);
                            responseData = responseData.items;
                        }
                    }
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message, json: {} });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Contentful = Contentful;
//# sourceMappingURL=Contentful.node.js.map