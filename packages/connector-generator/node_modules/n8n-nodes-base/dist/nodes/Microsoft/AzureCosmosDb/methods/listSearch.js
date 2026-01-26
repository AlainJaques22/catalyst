"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContainers = searchContainers;
exports.searchItems = searchItems;
const constants_1 = require("../helpers/constants");
const transport_1 = require("../transport");
function formatResults(items, filter) {
    return items
        .map(({ id }) => ({
        name: String(id).replace(/ /g, ''),
        value: String(id),
    }))
        .filter(({ name }) => !filter || name.includes(filter))
        .sort((a, b) => a.name.localeCompare(b.name));
}
async function searchContainers(filter, paginationToken) {
    const headers = paginationToken ? { [constants_1.HeaderConstants.X_MS_CONTINUATION]: paginationToken } : {};
    const responseData = (await transport_1.azureCosmosDbApiRequest.call(this, 'GET', '/colls', {}, {}, headers, true));
    const containers = responseData.body.DocumentCollections;
    return {
        results: formatResults(containers, filter),
        paginationToken: responseData.headers[constants_1.HeaderConstants.X_MS_CONTINUATION],
    };
}
async function searchItems(filter, paginationToken) {
    const container = this.getCurrentNodeParameter('container', {
        extractValue: true,
    });
    const headers = paginationToken ? { [constants_1.HeaderConstants.X_MS_CONTINUATION]: paginationToken } : {};
    const responseData = (await transport_1.azureCosmosDbApiRequest.call(this, 'GET', `/colls/${container}/docs`, {}, {}, headers, true));
    const items = responseData.body.Documents;
    return {
        results: formatResults(items, filter),
        paginationToken: responseData.headers[constants_1.HeaderConstants.X_MS_CONTINUATION],
    };
}
//# sourceMappingURL=listSearch.js.map