"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEntry = formatEntry;
exports.parseXml = parseXml;
exports.extractErrorDescription = extractErrorDescription;
exports.toUnixEpoch = toUnixEpoch;
exports.formatFeed = formatFeed;
exports.setReturnAllOrLimit = setReturnAllOrLimit;
exports.populate = populate;
exports.getId = getId;
const xml2js_1 = require("xml2js");
const types_1 = require("../../v1/types");
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
function formatEntry(entry, doNotFormatContent = false) {
    const { content, link, ...rest } = entry;
    const formattedContent = doNotFormatContent ? content : formatEntryContent(content);
    const formattedEntry = { ...rest, ...formattedContent };
    if (formattedEntry.id) {
        formattedEntry.entryUrl = formattedEntry.id;
        formattedEntry.id = formattedEntry.id.split('/').pop();
    }
    return formattedEntry;
}
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
function formatFeed(responseData) {
    const { entry: entries } = responseData.feed;
    if (!entries)
        return [];
    return Array.isArray(entries)
        ? entries.map((entry) => formatEntry(entry))
        : [formatEntry(entries)];
}
function setReturnAllOrLimit(qs) {
    qs.count = this.getNodeParameter('returnAll', 0) ? 0 : this.getNodeParameter('limit', 0);
}
function populate(source, destination) {
    if (Object.keys(source).length) {
        Object.assign(destination, source);
    }
}
function getId(i, idType, endpoint) {
    const id = this.getNodeParameter(idType, i);
    return id.includes(endpoint) ? id.split(endpoint).pop() : id;
}
//# sourceMappingURL=utils.js.map