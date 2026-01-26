"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectionEntry = createCollectionEntry;
exports.getAllCollectionEntries = getAllCollectionEntries;
exports.getAllCollectionNames = getAllCollectionNames;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
async function createCollectionEntry(resourceName, data, id) {
    const body = {
        data,
    };
    if (id) {
        body.data = {
            _id: id,
            ...body.data,
        };
    }
    return await GenericFunctions_1.cockpitApiRequest.call(this, 'POST', `/collections/save/${resourceName}`, body);
}
async function getAllCollectionEntries(resourceName, options) {
    const body = {};
    if (options.fields) {
        const fields = options.fields.split(',').map((field) => field.trim());
        const bodyFields = {
            _id: false,
        };
        for (const field of fields) {
            bodyFields[field] = true;
        }
        body.fields = bodyFields;
    }
    if (options.filter) {
        body.filter = (0, n8n_workflow_1.jsonParse)(options.filter.toString(), {
            errorMessage: "'Filter' option is not valid JSON",
        });
    }
    if (options.limit) {
        body.limit = options.limit;
    }
    if (options.skip) {
        body.skip = options.skip;
    }
    if (options.sort) {
        body.sort = (0, n8n_workflow_1.jsonParse)(options.sort.toString(), {
            errorMessage: "'Sort' option is not valid JSON",
        });
    }
    if (options.populate) {
        body.populate = options.populate;
    }
    body.simple = true;
    if (options.rawData) {
        body.simple = !options.rawData;
    }
    if (options.language) {
        body.lang = options.language;
    }
    return await GenericFunctions_1.cockpitApiRequest.call(this, 'POST', `/collections/get/${resourceName}`, body);
}
async function getAllCollectionNames() {
    return await GenericFunctions_1.cockpitApiRequest.call(this, 'GET', '/collections/listCollections', {});
}
//# sourceMappingURL=CollectionFunctions.js.map