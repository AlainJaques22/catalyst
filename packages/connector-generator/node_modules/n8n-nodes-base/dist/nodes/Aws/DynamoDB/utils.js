"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustExpressionAttributeValues = adjustExpressionAttributeValues;
exports.adjustExpressionAttributeName = adjustExpressionAttributeName;
exports.adjustPutItem = adjustPutItem;
exports.simplify = simplify;
exports.validateJSON = validateJSON;
exports.copyInputItem = copyInputItem;
exports.mapToAttributeValues = mapToAttributeValues;
exports.decodeItem = decodeItem;
const n8n_workflow_1 = require("n8n-workflow");
const addColon = (attribute) => (attribute = attribute.charAt(0) === ':' ? attribute : `:${attribute}`);
const addPound = (key) => (key = key.charAt(0) === '#' ? key : `#${key}`);
function adjustExpressionAttributeValues(eavUi) {
    const eav = {};
    eavUi.forEach(({ attribute, type, value }) => {
        eav[addColon(attribute)] = { [type]: value };
    });
    return eav;
}
function adjustExpressionAttributeName(eanUi) {
    const ean = {};
    eanUi.forEach(({ key, value }) => {
        ean[addPound(key)] = value;
    });
    return ean;
}
function adjustPutItem(putItemUi) {
    const adjustedPutItem = {};
    Object.entries(putItemUi).forEach(([attribute, value]) => {
        let type;
        if (typeof value === 'boolean') {
            type = 'BOOL';
        }
        else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            type = 'M';
        }
        else if (isNaN(Number(value))) {
            type = 'S';
        }
        else {
            type = 'N';
        }
        adjustedPutItem[attribute] = { [type]: value.toString() };
    });
    return adjustedPutItem;
}
function simplify(item) {
    const output = {};
    for (const [attribute, value] of Object.entries(item)) {
        const [type, content] = Object.entries(value)[0];
        //nedded as simplify is used in decodeItem
        output[attribute] = decodeAttribute(type, content);
    }
    return output;
}
function decodeAttribute(type, attribute) {
    switch (type) {
        case 'BOOL':
            return Boolean(attribute);
        case 'N':
            return Number(attribute);
        case 'S':
            return String(attribute);
        case 'SS':
        case 'NS':
            return attribute;
        case 'M':
            (0, n8n_workflow_1.assert)(typeof attribute === 'object' && !Array.isArray(attribute) && attribute !== null, 'Attribute must be an object');
            return simplify(attribute);
        default:
            return null;
    }
}
function validateJSON(input) {
    try {
        return JSON.parse(input);
    }
    catch (error) {
        throw new n8n_workflow_1.ApplicationError('Items must be a valid JSON', { level: 'warning' });
    }
}
function copyInputItem(item, properties) {
    // Prepare the data to insert and copy it to be returned
    const newItem = {};
    for (const property of properties) {
        if (item.json[property] === undefined) {
            newItem[property] = null;
        }
        else {
            newItem[property] = (0, n8n_workflow_1.deepCopy)(item.json[property]);
        }
    }
    return newItem;
}
function mapToAttributeValues(item) {
    for (const key of Object.keys(item)) {
        if (!key.startsWith(':')) {
            item[`:${key}`] = item[key];
            delete item[key];
        }
    }
}
function decodeItem(item) {
    const _item = {};
    for (const entry of Object.entries(item)) {
        const [attribute, value] = entry;
        const [type, content] = Object.entries(value)[0];
        _item[attribute] = decodeAttribute(type, content);
    }
    return _item;
}
//# sourceMappingURL=utils.js.map