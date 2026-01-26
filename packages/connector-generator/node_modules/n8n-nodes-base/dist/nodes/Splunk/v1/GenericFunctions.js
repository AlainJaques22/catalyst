"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSearch = formatSearch;
exports.parseXml = parseXml;
exports.extractErrorDescription = extractErrorDescription;
exports.toUnixEpoch = toUnixEpoch;
exports.splunkApiRequest = splunkApiRequest;
exports.formatFeed = formatFeed;
exports.formatResults = formatResults;
exports.setCount = setCount;
exports.populate = populate;
exports.getId = getId;
const n8n_workflow_1 = require("n8n-workflow");
const xml2js_1 = require("xml2js");
const types_1 = require("./types");
// ----------------------------------------
//            entry formatting
// ----------------------------------------
function compactEntryContent(splunkObject) {
    if (typeof splunkObject !== 'object') {
        return {};
    }
    if (Array.isArray(splunkObject)) {
        return splunkObject.reduce((acc, cur) => {
            acc = { ...acc, ...compactEntryContent(cur) };
            return acc;
        }, {});
    }
    if (splunkObject[types_1.SPLUNK.DICT]) {
        const obj = splunkObject[types_1.SPLUNK.DICT][types_1.SPLUNK.KEY];
        return { [splunkObject.$.name]: compactEntryContent(obj) };
    }
    if (splunkObject[types_1.SPLUNK.LIST]) {
        const items = splunkObject[types_1.SPLUNK.LIST][types_1.SPLUNK.ITEM];
        return { [splunkObject.$.name]: items };
    }
    if (splunkObject._) {
        return {
            [splunkObject.$.name]: splunkObject._,
        };
    }
    return {
        [splunkObject.$.name]: '',
    };
}
function formatEntryContent(content) {
    return content[types_1.SPLUNK.DICT][types_1.SPLUNK.KEY].reduce((acc, cur) => {
        acc = { ...acc, ...compactEntryContent(cur) };
        return acc;
    }, {});
}
function formatEntry(entry) {
    const { content, link, ...rest } = entry;
    const formattedEntry = { ...rest, ...formatEntryContent(content) };
    if (formattedEntry.id) {
        formattedEntry.entryUrl = formattedEntry.id;
        formattedEntry.id = formattedEntry.id.split('/').pop();
    }
    return formattedEntry;
}
// ----------------------------------------
//            search formatting
// ----------------------------------------
function formatSearch(responseData) {
    const { entry: entries } = responseData;
    if (!entries)
        return [];
    return Array.isArray(entries) ? entries.map(formatEntry) : [formatEntry(entries)];
}
// ----------------------------------------
//                 utils
// ----------------------------------------
async function parseXml(xml) {
    return await new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(xml, { explicitArray: false }, (error, result) => {
            error ? reject(error) : resolve(result);
        });
    });
}
function extractErrorDescription(rawError) {
    const messages = rawError.response?.messages;
    return messages ? { [messages.msg.$.type.toLowerCase()]: messages.msg._ } : rawError;
}
function toUnixEpoch(timestamp) {
    return Date.parse(timestamp) / 1000;
}
async function splunkApiRequest(method, endpoint, body = {}, qs = {}) {
    const { baseUrl, allowUnauthorizedCerts } = await this.getCredentials('splunkApi');
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method,
        form: body,
        qs,
        uri: `${baseUrl}${endpoint}`,
        json: true,
        rejectUnauthorized: !allowUnauthorizedCerts,
        useQuerystring: true, // serialize roles array as `roles=A&roles=B`
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    let result;
    try {
        let attempts = 0;
        do {
            try {
                const response = await this.helpers.requestWithAuthentication.call(this, 'splunkApi', options);
                result = await parseXml(response);
                return result;
            }
            catch (error) {
                if (attempts >= 5) {
                    throw error;
                }
                await (0, n8n_workflow_1.sleep)(1000);
                attempts++;
            }
        } while (true);
    }
    catch (error) {
        if (result === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No response from API call', {
                description: "Try to use 'Retry On Fail' option from node's settings",
            });
        }
        if (error?.cause?.code === 'ECONNREFUSED') {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), { ...error, code: 401 });
        }
        const rawError = (await parseXml(error.error));
        error = extractErrorDescription(rawError);
        if ('fatal' in error) {
            error = { error: error.fatal };
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
// ----------------------------------------
//            feed formatting
// ----------------------------------------
function formatFeed(responseData) {
    const { entry: entries } = responseData.feed;
    if (!entries)
        return [];
    return Array.isArray(entries) ? entries.map(formatEntry) : [formatEntry(entries)];
}
// ----------------------------------------
//            result formatting
// ----------------------------------------
function compactResult(splunkObject) {
    if (typeof splunkObject !== 'object') {
        return {};
    }
    if (Array.isArray(splunkObject?.value) && splunkObject?.value[0]?.text) {
        return {
            [splunkObject.$.k]: splunkObject.value.map((v) => v.text).join(','),
        };
    }
    if (!splunkObject?.$?.k || !splunkObject?.value?.text) {
        return {};
    }
    return {
        [splunkObject.$.k]: splunkObject.value.text,
    };
}
function formatResult(field) {
    return field.reduce((acc, cur) => {
        acc = { ...acc, ...compactResult(cur) };
        return acc;
    }, {});
}
function formatResults(responseData) {
    const results = responseData.results.result;
    if (!results)
        return [];
    return Array.isArray(results)
        ? results.map((r) => formatResult(r.field))
        : [formatResult(results.field)];
}
// ----------------------------------------
//             param loaders
// ----------------------------------------
/**
 * Set count of entries to retrieve.
 */
function setCount(qs) {
    qs.count = this.getNodeParameter('returnAll', 0) ? 0 : this.getNodeParameter('limit', 0);
}
function populate(source, destination) {
    if (Object.keys(source).length) {
        Object.assign(destination, source);
    }
}
/**
 * Retrieve an ID, with tolerance when contained in an endpoint.
 * The field `id` in Splunk API responses is a full link.
 */
function getId(i, idType, endpoint) {
    const id = this.getNodeParameter(idType, i);
    return id.includes(endpoint) ? id.split(endpoint).pop() : id;
}
//# sourceMappingURL=GenericFunctions.js.map