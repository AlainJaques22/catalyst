"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeFilterValue = void 0;
exports.simplifyItemPostReceive = simplifyItemPostReceive;
exports.simplifyListPostReceive = simplifyListPostReceive;
exports.downloadFilePostReceive = downloadFilePostReceive;
exports.uploadFilePreSend = uploadFilePreSend;
exports.itemGetAllFieldsPreSend = itemGetAllFieldsPreSend;
exports.itemColumnsPreSend = itemColumnsPreSend;
exports.handleErrorPostReceive = handleErrorPostReceive;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const escapeFilterValue = (value) => value.replaceAll("'", "''");
exports.escapeFilterValue = escapeFilterValue;
async function simplifyItemPostReceive(items, _response) {
    if (items.length === 0) {
        return items;
    }
    const simplify = this.getNodeParameter('simplify');
    if (simplify) {
        for (const item of items) {
            delete item.json['@odata.context'];
            delete item.json['@odata.etag'];
            delete item.json['fields@odata.navigationLink'];
            delete item.json.fields?.['@odata.etag'];
        }
    }
    return items;
}
async function simplifyListPostReceive(items, _response) {
    if (items.length === 0) {
        return items;
    }
    const simplify = this.getNodeParameter('simplify');
    if (simplify) {
        for (const item of items) {
            delete item.json['@odata.context'];
            delete item.json['@odata.etag'];
        }
    }
    return items;
}
async function downloadFilePostReceive(_items, response) {
    let fileName;
    if (response.headers['content-disposition']) {
        let fileNameMatch = /filename\*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/g.exec(response.headers['content-disposition']);
        fileName =
            fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[3] || fileNameMatch[2] : undefined;
        if (fileName) {
            fileName = decodeURIComponent(fileName);
        }
        else {
            fileNameMatch = /filename="?([^"]*?)"?(;|$)/g.exec(response.headers['content-disposition']);
            fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
        }
    }
    const newItem = {
        json: {},
        binary: {
            data: await this.helpers.prepareBinaryData(response.body, fileName, response.headers['content-type']),
        },
    };
    return [newItem];
}
async function uploadFilePreSend(requestOptions) {
    const binaryProperty = this.getNodeParameter('fileContents');
    this.helpers.assertBinaryData(binaryProperty);
    const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(binaryProperty);
    requestOptions.body = binaryDataBuffer;
    return requestOptions;
}
async function itemGetAllFieldsPreSend(requestOptions) {
    const fields = this.getNodeParameter('options.fields');
    requestOptions.qs ??= {};
    if (fields.some((x) => x === 'fields')) {
        requestOptions.qs.$expand = 'fields';
    }
    requestOptions.qs.$select = fields.map((x) => x);
    return requestOptions;
}
async function itemColumnsPreSend(requestOptions) {
    const mapperValue = this.getNodeParameter('columns');
    const operation = this.getNodeParameter('operation');
    if (['upsert', 'update'].includes(operation) && mapperValue.matchingColumns?.length > 0) {
        if (!mapperValue.matchingColumns.includes('id')) {
            const site = this.getNodeParameter('site', undefined, { extractValue: true });
            const list = this.getNodeParameter('list', undefined, { extractValue: true });
            const response = await transport_1.microsoftSharePointApiRequest.call(this, 'GET', `/sites/${site}/lists/${list}/items`, {}, {
                $filter: mapperValue.matchingColumns
                    .map((x) => `fields/${x} eq '${mapperValue.value[x]}'`)
                    .join(' and'),
            }, {
                Prefer: 'HonorNonIndexedQueriesWarningMayFailRandomly',
            });
            if (response.value?.length === 1) {
                mapperValue.matchingColumns.push('id');
                mapperValue.value ??= {};
                mapperValue.value.id = response.value[0].id;
            }
        }
        if (operation === 'upsert') {
            if (mapperValue.matchingColumns.includes('id')) {
                if (!mapperValue.value?.id) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), "The column(s) don't match any existing item", {
                        description: 'Double-check the value(s) for the columns to match and try again',
                    });
                }
                requestOptions.url += '/' + mapperValue.value.id;
                delete mapperValue.value.id;
                requestOptions.method = 'PATCH';
            }
        }
        else if (operation === 'update') {
            if (mapperValue.matchingColumns.includes('id') && mapperValue.value?.id) {
                requestOptions.url += '/' + mapperValue.value.id;
                delete mapperValue.value.id;
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), "The column(s) don't match any existing item", {
                    description: 'Double-check the value(s) for the columns to match and try again',
                });
            }
        }
    }
    const fields = {};
    for (const [key, value] of Object.entries(mapperValue.value ?? {})) {
        if (mapperValue.schema.find((x) => x.id === key)?.type === 'url') {
            fields[key] = {
                Description: value,
                Url: value,
            };
        }
        else {
            fields[key] = value;
        }
    }
    requestOptions.body ??= {};
    requestOptions.body.fields = fields;
    return requestOptions;
}
async function handleErrorPostReceive(data, response) {
    if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
        const resource = this.getNodeParameter('resource');
        const operation = this.getNodeParameter('operation');
        if (resource === 'file' && operation === 'download' && Buffer.isBuffer(response.body)) {
            response.body = (0, n8n_workflow_1.jsonParse)(response.body.toString());
        }
        const error = response.body?.error ?? {};
        if (resource === 'file') {
            if (operation === 'download') {
            }
            else if (operation === 'update') {
            }
            else if (operation === 'upload') {
            }
        }
        else if (resource === 'item') {
            if (operation === 'create') {
                if (error.code === 'invalidRequest') {
                    if (error.message ===
                        'One or more fields with unique constraints already has the provided value.') {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                            message: 'One or more fields with unique constraints already has the provided value',
                            description: "Double-check the value(s) in 'Values to Send' and try again",
                        });
                    }
                    else {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                            message: error.message,
                            description: "Double-check the value(s) in 'Values to Send' and try again",
                        });
                    }
                }
            }
            else if (operation === 'delete') {
            }
            else if (operation === 'get') {
            }
            else if (operation === 'getAll') {
            }
            else if (operation === 'update') {
                if (error.code === 'invalidRequest') {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                        message: error.message,
                        description: "Double-check the value(s) in 'Values to Update' and try again",
                    });
                }
            }
            else if (operation === 'upsert') {
                if (error.code === 'invalidRequest') {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                        message: error.message,
                        description: "Double-check the value(s) in 'Values to Send' and try again",
                    });
                }
            }
        }
        else if (resource === 'list') {
            if (operation === 'get') {
            }
            else if (operation === 'getAll') {
            }
        }
        if (error.code === 'itemNotFound') {
            if (error.message.includes('list item')) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                    message: "The required item doesn't match any existing one",
                    description: "Double-check the value in the parameter 'Item' and try again",
                });
            }
            else if (error.message.includes('list')) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
                    message: "The required list doesn't match any existing one",
                    description: "Double-check the value in the parameter 'List' and try again",
                });
            }
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response);
    }
    return data;
}
//# sourceMappingURL=utils.js.map