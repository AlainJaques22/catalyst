"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = getFiles;
exports.getFolders = getFolders;
exports.getItems = getItems;
exports.getLists = getLists;
exports.getSites = getSites;
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function getFiles(filter, paginationToken) {
    const site = this.getNodeParameter('site', undefined, { extractValue: true });
    const folder = this.getNodeParameter('folder', undefined, { extractValue: true });
    let response;
    if (paginationToken) {
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/drive/items/${folder}/children`, {}, undefined, undefined, paginationToken);
    }
    else {
        // File filter not supported
        // https://learn.microsoft.com/en-us/onedrive/developer/rest-api/concepts/filtering-results?view=odsp-graph-online#filterable-properties
        const qs = {
            $select: 'id,name,file',
        };
        if (filter) {
            qs.$filter = `startswith(name, '${(0, utils_1.escapeFilterValue)(filter)}')`;
        }
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/drive/items/${folder}/children`, {}, qs);
    }
    const items = response.value;
    const results = items
        .filter((x) => x.file)
        .map((g) => ({
        name: g.name,
        value: g.id,
    }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    return { results, paginationToken: response['@odata.nextLink'] };
}
async function getFolders(filter, paginationToken) {
    const site = this.getNodeParameter('site', undefined, { extractValue: true });
    let response;
    if (paginationToken) {
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/drive/items`, {}, undefined, undefined, paginationToken);
    }
    else {
        const qs = {
            $select: 'id,name,folder',
            // Folder filter not supported, but filter is still required
            // https://learn.microsoft.com/en-us/onedrive/developer/rest-api/concepts/filtering-results?view=odsp-graph-online#filterable-properties
            $filter: 'folder ne null',
        };
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/drive/items`, {}, qs);
    }
    const items = response.value;
    const results = items
        .filter((x) => x.folder && (!filter || x.name?.toLowerCase()?.includes?.(filter.toLowerCase())))
        .map((g) => ({
        name: g.name,
        value: g.id,
    }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    return { results, paginationToken: response['@odata.nextLink'] };
}
async function getItems(filter, paginationToken) {
    const site = this.getNodeParameter('site', undefined, { extractValue: true });
    const list = this.getNodeParameter('list', undefined, { extractValue: true });
    let response;
    if (paginationToken) {
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/lists/${list}/items`, {}, undefined, undefined, paginationToken);
    }
    else {
        const qs = {
            $expand: 'fields(select=Title)',
            $select: 'id,fields',
        };
        if (filter) {
            qs.$filter = `fields/Title eq '${(0, utils_1.escapeFilterValue)(filter)}'`;
        }
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/lists/${list}/items`, {}, qs);
    }
    const items = response.value;
    const results = items
        .map((g) => ({
        name: g.fields.Title ?? g.id,
        value: g.id,
    }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    return { results, paginationToken: response['@odata.nextLink'] };
}
async function getLists(filter, paginationToken) {
    const site = this.getNodeParameter('site', undefined, { extractValue: true });
    let response;
    if (paginationToken) {
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/lists`, {}, undefined, undefined, paginationToken);
    }
    else {
        const qs = {
            $select: 'id,displayName',
        };
        if (filter) {
            qs.$filter = `displayName eq '${(0, utils_1.escapeFilterValue)(filter)}'`;
        }
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/lists`, {}, qs);
    }
    const lists = response.value;
    const results = lists
        .map((g) => ({
        name: g.displayName,
        value: g.id,
    }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    return { results, paginationToken: response['@odata.nextLink'] };
}
async function getSites(filter, paginationToken) {
    let response;
    if (paginationToken) {
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', '/sites', {}, undefined, undefined, paginationToken);
    }
    else {
        const qs = {
            $select: 'id,title',
            $search: '*',
        };
        if (filter) {
            qs.$search = filter;
        }
        response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', '/sites', {}, qs);
    }
    const sites = response.value;
    const results = sites
        .map((g) => ({
        name: g.title,
        value: g.id,
    }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    return { results, paginationToken: response['@odata.nextLink'] };
}
//# sourceMappingURL=listSearch.js.map