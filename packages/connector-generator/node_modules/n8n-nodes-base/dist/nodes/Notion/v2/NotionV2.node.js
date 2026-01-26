"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionV2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const methods_1 = require("./methods");
const VersionDescription_1 = require("./VersionDescription");
const GenericFunctions_1 = require("../shared/GenericFunctions");
const methods_2 = require("../shared/methods");
class NotionV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...VersionDescription_1.versionDescription,
        };
    }
    methods = { listSearch: methods_2.listSearch, loadOptions: methods_1.loadOptions };
    async execute() {
        const items = this.getInputData();
        const nodeVersion = this.getNode().typeVersion;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const itemsLength = items.length;
        const timezone = this.getTimezone();
        const qs = {};
        let returnData = [];
        let responseData;
        let download = false;
        if (resource === 'block') {
            if (operation === 'append') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const blockId = GenericFunctions_1.extractBlockId.call(this, nodeVersion, i);
                        const blockValues = this.getNodeParameter('blockUi.blockValues', i, []);
                        (0, GenericFunctions_1.extractDatabaseMentionRLC)(blockValues);
                        const body = {
                            children: (0, GenericFunctions_1.formatBlocks)(blockValues),
                        };
                        const block = await GenericFunctions_1.notionApiRequest.call(this, 'PATCH', `/blocks/${blockId}/children`, body);
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(block), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'getAll') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const blockId = GenericFunctions_1.extractBlockId.call(this, nodeVersion, i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const fetchNestedBlocks = this.getNodeParameter('fetchNestedBlocks', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', `/blocks/${blockId}/children`, {});
                            if (fetchNestedBlocks) {
                                responseData = await GenericFunctions_1.notionApiRequestGetBlockChildrens.call(this, responseData);
                            }
                        }
                        else {
                            const limit = this.getNodeParameter('limit', i);
                            qs.page_size = limit;
                            responseData = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/blocks/${blockId}/children`, {}, qs);
                            const results = responseData.results;
                            if (fetchNestedBlocks) {
                                responseData = await GenericFunctions_1.notionApiRequestGetBlockChildrens.call(this, results, [], limit);
                            }
                            else {
                                responseData = results;
                            }
                        }
                        responseData = responseData.map((_data) => ({
                            object: _data.object,
                            parent_id: blockId,
                            ..._data,
                        }));
                        if (nodeVersion > 2) {
                            const simplifyOutput = this.getNodeParameter('simplifyOutput', i);
                            if (simplifyOutput) {
                                responseData = (0, GenericFunctions_1.simplifyBlocksOutput)(responseData, blockId);
                            }
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
        }
        if (resource === 'database') {
            if (operation === 'get') {
                const simple = this.getNodeParameter('simple', 0);
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const databaseId = (0, GenericFunctions_1.extractDatabaseId)(this.getNodeParameter('databaseId', i, '', { extractValue: true }));
                        responseData = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download)[0];
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'getAll') {
                const simple = this.getNodeParameter('simple', 0);
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const body = {
                            filter: { property: 'object', value: 'database' },
                        };
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                        }
                        else {
                            body.page_size = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.notionApiRequest.call(this, 'POST', '/search', body);
                            responseData = responseData.results;
                        }
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'search') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const text = this.getNodeParameter('text', i);
                        const options = this.getNodeParameter('options', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const simple = this.getNodeParameter('simple', i);
                        const body = {
                            filter: {
                                property: 'object',
                                value: 'database',
                            },
                        };
                        if (text) {
                            body.query = text;
                        }
                        if (options.sort) {
                            const sort = options.sort?.sortValue || {};
                            body.sort = sort;
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
        }
        if (resource === 'databasePage') {
            if (operation === 'create') {
                const databaseId = this.getNodeParameter('databaseId', 0, '', {
                    extractValue: true,
                });
                const { properties } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
                let titleKey = '';
                for (const key of Object.keys(properties)) {
                    if (properties[key].type === 'title') {
                        titleKey = key;
                    }
                }
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const title = this.getNodeParameter('title', i);
                        const simple = this.getNodeParameter('simple', i);
                        const body = {
                            parent: {},
                            properties: {},
                        };
                        if (title !== '') {
                            body.properties[titleKey] = {
                                title: [
                                    {
                                        text: {
                                            content: title,
                                        },
                                    },
                                ],
                            };
                        }
                        body.parent.database_id = this.getNodeParameter('databaseId', i, '', {
                            extractValue: true,
                        });
                        const propertiesValues = this.getNodeParameter('propertiesUi.propertyValues', i, []);
                        if (propertiesValues.length !== 0) {
                            body.properties = Object.assign(body.properties, GenericFunctions_1.mapProperties.call(this, propertiesValues, timezone, 2));
                        }
                        const blockValues = this.getNodeParameter('blockUi.blockValues', i, []);
                        (0, GenericFunctions_1.extractDatabaseMentionRLC)(blockValues);
                        body.children = (0, GenericFunctions_1.formatBlocks)(blockValues);
                        const options = this.getNodeParameter('options', i);
                        if (options.icon) {
                            if (options.iconType && options.iconType === 'file') {
                                body.icon = { external: { url: options.icon } };
                            }
                            else {
                                body.icon = { emoji: options.icon };
                            }
                        }
                        responseData = await GenericFunctions_1.notionApiRequest.call(this, 'POST', '/pages', body);
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'get') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const pageId = GenericFunctions_1.getPageId.call(this, i);
                        const simple = this.getNodeParameter('simple', i);
                        responseData = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/pages/${pageId}`);
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'getAll') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        download = this.getNodeParameter('options.downloadFiles', 0, false);
                        const simple = this.getNodeParameter('simple', 0);
                        const databaseId = this.getNodeParameter('databaseId', i, '', {
                            extractValue: true,
                        });
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const filterType = this.getNodeParameter('filterType', 0);
                        const conditions = this.getNodeParameter('filters.conditions', i, []);
                        const sort = this.getNodeParameter('options.sort.sortValue', i, []);
                        const body = {
                            filter: {},
                        };
                        if (filterType === 'manual') {
                            const matchType = this.getNodeParameter('matchType', 0);
                            if (matchType === 'anyFilter') {
                                Object.assign(body.filter, {
                                    or: conditions.map((data) => (0, GenericFunctions_1.mapFilters)([data], timezone)),
                                });
                            }
                            else if (matchType === 'allFilters') {
                                Object.assign(body.filter, {
                                    and: conditions.map((data) => (0, GenericFunctions_1.mapFilters)([data], timezone)),
                                });
                            }
                        }
                        else if (filterType === 'json') {
                            const filterJson = this.getNodeParameter('filterJson', i);
                            if ((0, GenericFunctions_1.validateJSON)(filterJson) !== undefined) {
                                body.filter = (0, n8n_workflow_1.jsonParse)(filterJson);
                            }
                            else {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                                    message: 'Filters (JSON) must be a valid json',
                                }, { itemIndex: i });
                            }
                        }
                        if (!Object.keys(body.filter).length) {
                            delete body.filter;
                        }
                        if (sort) {
                            body.sorts = (0, GenericFunctions_1.mapSorting)(sort);
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', `/databases/${databaseId}/query`, body, {});
                        }
                        else {
                            body.page_size = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.notionApiRequest.call(this, 'POST', `/databases/${databaseId}/query`, body, qs);
                            responseData = responseData.results;
                        }
                        if (download) {
                            responseData = await GenericFunctions_1.downloadFiles.call(this, responseData, [
                                { item: i },
                            ]);
                        }
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'update') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const pageId = GenericFunctions_1.getPageId.call(this, i);
                        const simple = this.getNodeParameter('simple', i);
                        const properties = this.getNodeParameter('propertiesUi.propertyValues', i, []);
                        const body = {
                            properties: {},
                        };
                        if (properties.length !== 0) {
                            body.properties = GenericFunctions_1.mapProperties.call(this, properties, timezone, 2);
                        }
                        const options = this.getNodeParameter('options', i);
                        if (options.icon) {
                            if (options.iconType && options.iconType === 'file') {
                                body.icon = { type: 'external', external: { url: options.icon } };
                            }
                            else {
                                body.icon = { type: 'emoji', emoji: options.icon };
                            }
                        }
                        responseData = await GenericFunctions_1.notionApiRequest.call(this, 'PATCH', `/pages/${pageId}`, body);
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, false);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
        }
        if (resource === 'user') {
            if (operation === 'get') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const userId = this.getNodeParameter('userId', i);
                        responseData = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/users/${userId}`);
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'getAll') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        if (returnAll) {
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', '/users');
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', '/users');
                            responseData = responseData.splice(0, qs.limit);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
        }
        if (resource === 'page') {
            if (operation === 'archive') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const pageId = GenericFunctions_1.getPageId.call(this, i);
                        const simple = this.getNodeParameter('simple', i);
                        responseData = await GenericFunctions_1.notionApiRequest.call(this, 'PATCH', `/pages/${pageId}`, {
                            archived: true,
                        });
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'create') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const simple = this.getNodeParameter('simple', i);
                        const body = {
                            parent: {},
                            properties: {},
                        };
                        body.parent.page_id = GenericFunctions_1.getPageId.call(this, i);
                        body.properties = (0, GenericFunctions_1.formatTitle)(this.getNodeParameter('title', i));
                        const blockValues = this.getNodeParameter('blockUi.blockValues', i, []);
                        (0, GenericFunctions_1.extractDatabaseMentionRLC)(blockValues);
                        body.children = (0, GenericFunctions_1.formatBlocks)(blockValues);
                        const options = this.getNodeParameter('options', i);
                        if (options.icon) {
                            if (options.iconType && options.iconType === 'file') {
                                body.icon = { external: { url: options.icon } };
                            }
                            else {
                                body.icon = { emoji: options.icon };
                            }
                        }
                        responseData = await GenericFunctions_1.notionApiRequest.call(this, 'POST', '/pages', body);
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
            if (operation === 'search') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const text = this.getNodeParameter('text', i);
                        const options = this.getNodeParameter('options', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const simple = this.getNodeParameter('simple', i);
                        const body = {};
                        if (text) {
                            body.query = text;
                        }
                        if (options.filter) {
                            const filter = options.filter?.filters || [];
                            body.filter = filter;
                        }
                        if (options.sort) {
                            const sort = options.sort?.sortValue || {};
                            body.sort = sort;
                        }
                        if (returnAll) {
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                        }
                        else {
                            qs.limit = this.getNodeParameter('limit', i);
                            responseData = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
                            responseData = responseData.splice(0, qs.limit);
                        }
                        if (simple) {
                            responseData = (0, GenericFunctions_1.simplifyObjects)(responseData, download);
                        }
                        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                        returnData = returnData.concat(executionData);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: { item: i },
                            });
                        }
                        else {
                            throw (0, GenericFunctions_1.prepareNotionError)(this.getNode(), error, i);
                        }
                    }
                }
            }
        }
        return [returnData];
    }
}
exports.NotionV2 = NotionV2;
//# sourceMappingURL=NotionV2.node.js.map