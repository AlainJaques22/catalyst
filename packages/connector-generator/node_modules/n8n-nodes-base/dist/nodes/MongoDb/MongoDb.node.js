"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDb = void 0;
const mongodb_1 = require("mongodb");
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const MongoDbProperties_1 = require("./MongoDbProperties");
const utilities_1 = require("../../utils/utilities");
class MongoDb {
    description = {
        displayName: 'MongoDB',
        name: 'mongoDb',
        icon: 'file:mongodb.svg',
        group: ['input'],
        version: [1, 1.1, 1.2],
        description: 'Find, insert and update documents in MongoDB',
        defaults: {
            name: 'MongoDB',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        usableAsTool: true,
        credentials: [
            {
                name: 'mongoDb',
                required: true,
                testedBy: 'mongoDbCredentialTest',
            },
        ],
        properties: MongoDbProperties_1.nodeProperties,
    };
    methods = {
        credentialTest: {
            async mongoDbCredentialTest(credential) {
                const credentials = credential.data;
                try {
                    const database = (credentials.database || '').trim();
                    let connectionString = '';
                    if (credentials.configurationType === 'connectionString') {
                        connectionString = (credentials.connectionString || '').trim();
                    }
                    else {
                        connectionString = (0, GenericFunctions_1.buildParameterizedConnString)(credentials);
                    }
                    // Note: ICredentialTestFunctions doesn't have a way to get the Node instance
                    // so we set the version to 0
                    const client = await (0, GenericFunctions_1.connectMongoClient)(connectionString, 0, credentials);
                    const { databases } = await client.db().admin().listDatabases();
                    if (!databases.map((db) => db.name).includes(database)) {
                        throw new n8n_workflow_1.ApplicationError(`Database "${database}" does not exist`, {
                            level: 'warning',
                        });
                    }
                    await client.close();
                }
                catch (error) {
                    return {
                        status: 'Error',
                        message: error.message,
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
        const credentials = await this.getCredentials('mongoDb');
        const node = this.getNode();
        const { database, connectionString } = (0, GenericFunctions_1.validateAndResolveMongoCredentials)(node, credentials);
        const nodeVersion = node.typeVersion;
        const client = await (0, GenericFunctions_1.connectMongoClient)(connectionString, nodeVersion, credentials);
        let returnData = [];
        try {
            const mdb = client.db(database);
            const items = this.getInputData();
            const operation = this.getNodeParameter('operation', 0);
            let itemsLength = items.length ? 1 : 0;
            let fallbackPairedItems = null;
            if (nodeVersion >= 1.1) {
                itemsLength = items.length;
            }
            else {
                fallbackPairedItems = (0, utilities_1.generatePairedItemData)(items.length);
            }
            if (operation === 'aggregate') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const queryParameter = JSON.parse(this.getNodeParameter('query', i));
                        if (queryParameter._id && typeof queryParameter._id === 'string') {
                            queryParameter._id = new mongodb_1.ObjectId(queryParameter._id);
                        }
                        const query = mdb
                            .collection(this.getNodeParameter('collection', i))
                            .aggregate(queryParameter);
                        for (const entry of await query.toArray()) {
                            returnData.push({ json: entry, pairedItem: fallbackPairedItems ?? [{ item: i }] });
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: fallbackPairedItems ?? [{ item: i }],
                            });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'delete') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const { deletedCount } = await mdb
                            .collection(this.getNodeParameter('collection', i))
                            .deleteMany(JSON.parse(this.getNodeParameter('query', i)));
                        returnData.push({
                            json: { deletedCount },
                            pairedItem: fallbackPairedItems ?? [{ item: i }],
                        });
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: fallbackPairedItems ?? [{ item: i }],
                            });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'find') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const queryParameter = JSON.parse(this.getNodeParameter('query', i));
                        if (queryParameter._id && typeof queryParameter._id === 'string') {
                            queryParameter._id = new mongodb_1.ObjectId(queryParameter._id);
                        }
                        let query = mdb
                            .collection(this.getNodeParameter('collection', i))
                            .find(queryParameter);
                        const options = this.getNodeParameter('options', i);
                        const limit = options.limit;
                        const skip = options.skip;
                        const projection = options.projection && JSON.parse(options.projection);
                        const sort = options.sort && JSON.parse(options.sort);
                        if (skip > 0) {
                            query = query.skip(skip);
                        }
                        if (limit > 0) {
                            query = query.limit(limit);
                        }
                        if (sort && Object.keys(sort).length !== 0 && sort.constructor === Object) {
                            query = query.sort(sort);
                        }
                        if (projection &&
                            Object.keys(projection).length !== 0 &&
                            projection.constructor === Object) {
                            query = query.project(projection);
                        }
                        const queryResult = await query.toArray();
                        for (const entry of queryResult) {
                            returnData.push({ json: entry, pairedItem: fallbackPairedItems ?? [{ item: i }] });
                        }
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: fallbackPairedItems ?? [{ item: i }],
                            });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'findOneAndReplace') {
                fallbackPairedItems = fallbackPairedItems ?? (0, utilities_1.generatePairedItemData)(items.length);
                const fields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('fields', 0));
                const useDotNotation = this.getNodeParameter('options.useDotNotation', 0, false);
                const dateFields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('options.dateFields', 0, ''));
                const updateKey = (this.getNodeParameter('updateKey', 0) || '').trim();
                const updateOptions = this.getNodeParameter('upsert', 0)
                    ? { upsert: true }
                    : undefined;
                const updateItems = (0, GenericFunctions_1.prepareItems)({ items, fields, updateKey, useDotNotation, dateFields });
                for (const item of updateItems) {
                    try {
                        const filter = { [updateKey]: item[updateKey] };
                        if (updateKey === '_id') {
                            filter[updateKey] = new mongodb_1.ObjectId(item[updateKey]);
                            delete item._id;
                        }
                        await mdb
                            .collection(this.getNodeParameter('collection', 0))
                            .findOneAndReplace(filter, item, updateOptions);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            item.json = { error: error.message };
                            continue;
                        }
                        throw error;
                    }
                }
                returnData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(updateItems), { itemData: fallbackPairedItems });
            }
            if (operation === 'findOneAndUpdate') {
                fallbackPairedItems = fallbackPairedItems ?? (0, utilities_1.generatePairedItemData)(items.length);
                const fields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('fields', 0));
                const useDotNotation = this.getNodeParameter('options.useDotNotation', 0, false);
                const dateFields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('options.dateFields', 0, ''));
                const updateKey = (this.getNodeParameter('updateKey', 0) || '').trim();
                const updateOptions = this.getNodeParameter('upsert', 0)
                    ? { upsert: true }
                    : undefined;
                const updateItems = (0, GenericFunctions_1.prepareItems)({
                    items,
                    fields,
                    updateKey,
                    useDotNotation,
                    dateFields,
                    isUpdate: nodeVersion >= 1.2,
                });
                for (const item of updateItems) {
                    try {
                        const filter = { [updateKey]: item[updateKey] };
                        if (updateKey === '_id') {
                            filter[updateKey] = new mongodb_1.ObjectId(item[updateKey]);
                            delete item._id;
                        }
                        await mdb
                            .collection(this.getNodeParameter('collection', 0))
                            .findOneAndUpdate(filter, { $set: item }, updateOptions);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            item.json = { error: error.message };
                            continue;
                        }
                        throw error;
                    }
                }
                returnData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(updateItems), { itemData: fallbackPairedItems });
            }
            if (operation === 'insert') {
                fallbackPairedItems = fallbackPairedItems ?? (0, utilities_1.generatePairedItemData)(items.length);
                let responseData = [];
                try {
                    // Prepare the data to insert and copy it to be returned
                    const fields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('fields', 0));
                    const useDotNotation = this.getNodeParameter('options.useDotNotation', 0, false);
                    const dateFields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('options.dateFields', 0, ''));
                    const insertItems = (0, GenericFunctions_1.prepareItems)({
                        items,
                        fields,
                        updateKey: '',
                        useDotNotation,
                        dateFields,
                    });
                    const { insertedIds } = await mdb
                        .collection(this.getNodeParameter('collection', 0))
                        .insertMany(insertItems);
                    // Add the id to the data
                    for (const i of Object.keys(insertedIds)) {
                        responseData.push({
                            ...insertItems[parseInt(i, 10)],
                            id: insertedIds[parseInt(i, 10)],
                        });
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData = [{ error: error.message }];
                    }
                    else {
                        throw error;
                    }
                }
                returnData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: fallbackPairedItems });
            }
            if (operation === 'update') {
                fallbackPairedItems = fallbackPairedItems ?? (0, utilities_1.generatePairedItemData)(items.length);
                const fields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('fields', 0));
                const useDotNotation = this.getNodeParameter('options.useDotNotation', 0, false);
                const dateFields = (0, GenericFunctions_1.prepareFields)(this.getNodeParameter('options.dateFields', 0, ''));
                const updateKey = (this.getNodeParameter('updateKey', 0) || '').trim();
                const updateOptions = this.getNodeParameter('upsert', 0)
                    ? { upsert: true }
                    : undefined;
                const updateItems = (0, GenericFunctions_1.prepareItems)({
                    items,
                    fields,
                    updateKey,
                    useDotNotation,
                    dateFields,
                    isUpdate: nodeVersion >= 1.2,
                });
                for (const item of updateItems) {
                    try {
                        const filter = { [updateKey]: item[updateKey] };
                        if (updateKey === '_id') {
                            filter[updateKey] = new mongodb_1.ObjectId(item[updateKey]);
                            delete item._id;
                        }
                        await mdb
                            .collection(this.getNodeParameter('collection', 0))
                            .updateOne(filter, { $set: item }, updateOptions);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            item.json = { error: error.message };
                            continue;
                        }
                        throw error;
                    }
                }
                returnData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(updateItems), { itemData: fallbackPairedItems });
            }
            if (operation === 'listSearchIndexes') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const collection = this.getNodeParameter('collection', i);
                        const indexName = (() => {
                            const name = this.getNodeParameter('indexName', i);
                            return name.length === 0 ? undefined : name;
                        })();
                        const cursor = indexName
                            ? mdb.collection(collection).listSearchIndexes(indexName)
                            : mdb.collection(collection).listSearchIndexes();
                        const query = await cursor.toArray();
                        const result = query.map((json) => ({
                            json,
                            pairedItem: fallbackPairedItems ?? [{ item: i }],
                        }));
                        returnData.push(...result);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: fallbackPairedItems ?? [{ item: i }],
                            });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'dropSearchIndex') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const collection = this.getNodeParameter('collection', i);
                        const indexName = this.getNodeParameter('indexNameRequired', i);
                        await mdb.collection(collection).dropSearchIndex(indexName);
                        returnData.push({
                            json: {
                                [indexName]: true,
                            },
                            pairedItem: fallbackPairedItems ?? [{ item: i }],
                        });
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: fallbackPairedItems ?? [{ item: i }],
                            });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'createSearchIndex') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const collection = this.getNodeParameter('collection', i);
                        const indexName = this.getNodeParameter('indexNameRequired', i);
                        const indexType = this.getNodeParameter('indexType', i);
                        const definition = JSON.parse(this.getNodeParameter('indexDefinition', i));
                        await mdb.collection(collection).createSearchIndex({
                            name: indexName,
                            definition,
                            type: indexType,
                        });
                        returnData.push({
                            json: { indexName },
                            pairedItem: fallbackPairedItems ?? [{ item: i }],
                        });
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: fallbackPairedItems ?? [{ item: i }],
                            });
                            continue;
                        }
                        throw error;
                    }
                }
            }
            if (operation === 'updateSearchIndex') {
                for (let i = 0; i < itemsLength; i++) {
                    try {
                        const collection = this.getNodeParameter('collection', i);
                        const indexName = this.getNodeParameter('indexNameRequired', i);
                        const definition = JSON.parse(this.getNodeParameter('indexDefinition', i));
                        await mdb.collection(collection).updateSearchIndex(indexName, definition);
                        returnData.push({
                            json: { [indexName]: true },
                            pairedItem: fallbackPairedItems ?? [{ item: i }],
                        });
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            returnData.push({
                                json: { error: error.message },
                                pairedItem: fallbackPairedItems ?? [{ item: i }],
                            });
                            continue;
                        }
                        throw error;
                    }
                }
            }
        }
        finally {
            await client.close().catch(() => { });
        }
        return [(0, GenericFunctions_1.stringifyObjectIDs)(returnData)];
    }
}
exports.MongoDb = MongoDb;
//# sourceMappingURL=MongoDb.node.js.map