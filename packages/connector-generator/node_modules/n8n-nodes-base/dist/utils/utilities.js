"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrailingSlash = exports.sanitizeDataPathKey = exports.keysToLowercase = exports.fuzzyCompare = exports.compareItems = exports.flattenKeys = exports.shuffleArray = void 0;
exports.chunk = chunk;
exports.flatten = flatten;
exports.updateDisplayOptions = updateDisplayOptions;
exports.processJsonInput = processJsonInput;
exports.wrapData = wrapData;
exports.formatPrivateKey = formatPrivateKey;
exports.getResolvables = getResolvables;
exports.flattenObject = flattenObject;
exports.capitalize = capitalize;
exports.generatePairedItemData = generatePairedItemData;
exports.preparePairedItemDataArray = preparePairedItemDataArray;
exports.escapeHtml = escapeHtml;
exports.sortItemKeysByPriorityList = sortItemKeysByPriorityList;
exports.createUtmCampaignLink = createUtmCampaignLink;
exports.addExecutionHints = addExecutionHints;
const get_1 = __importDefault(require("lodash/get"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const isNull_1 = __importDefault(require("lodash/isNull"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const merge_1 = __importDefault(require("lodash/merge"));
const reduce_1 = __importDefault(require("lodash/reduce"));
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size = 1) {
    const length = array === null ? 0 : array.length;
    if (!length || size < 1) {
        return [];
    }
    let index = 0;
    let resIndex = 0;
    const result = new Array(Math.ceil(length / size));
    while (index < length) {
        result[resIndex++] = array.slice(index, (index += size));
    }
    return result;
}
/**
 * Shuffles an array in place using the Fisher-Yates shuffle algorithm
 * @param {Array} array The array to shuffle.
 */
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = (0, n8n_workflow_1.randomInt)(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
};
exports.shuffleArray = shuffleArray;
/**
 * Flattens an object with deep data
 * @param {IDataObject} data The object to flatten
 * @param {string[]} prefix The prefix to add to each key in the returned flat object
 */
const flattenKeys = (obj, prefix = []) => {
    return !(0, isObject_1.default)(obj)
        ? { [prefix.join('.')]: obj }
        : (0, reduce_1.default)(obj, (cum, next, key) => (0, merge_1.default)(cum, (0, exports.flattenKeys)(next, [...prefix, key])), {});
};
exports.flattenKeys = flattenKeys;
/**
 * Takes a multidimensional array and converts it to a one-dimensional array.
 *
 * @param {Array} nestedArray The array to be flattened.
 * @example
 *
 * flatten([['a', 'b'], ['c', 'd']])
 * // => ['a', 'b', 'c', 'd']
 *
 */
function flatten(nestedArray) {
    const result = [];
    (function loop(array) {
        for (let i = 0; i < array.length; i++) {
            if (Array.isArray(array[i])) {
                loop(array[i]);
            }
            else {
                result.push(array[i]);
            }
        }
    })(nestedArray);
    //TODO: check logic in MicrosoftSql.node.ts
    return result;
}
/**
 * Compares the values of specified keys in two objects.
 *
 * @param {T} obj1 - The first object to compare.
 * @param {T} obj2 - The second object to compare.
 * @param {string[]} keys - An array of keys to compare.
 * @param {boolean} disableDotNotation - Whether to use dot notation to access nested properties.
 * @returns {boolean} - Whether the values of the specified keys are equal in both objects.
 */
const compareItems = (obj1, obj2, keys, disableDotNotation = false) => {
    let result = true;
    for (const key of keys) {
        if (!disableDotNotation) {
            if (!(0, isEqual_1.default)((0, get_1.default)(obj1.json, key), (0, get_1.default)(obj2.json, key))) {
                result = false;
                break;
            }
        }
        else {
            if (!(0, isEqual_1.default)(obj1.json[key], obj2.json[key])) {
                result = false;
                break;
            }
        }
    }
    return result;
};
exports.compareItems = compareItems;
function updateDisplayOptions(displayOptions, properties) {
    return properties.map((nodeProperty) => {
        return {
            ...nodeProperty,
            displayOptions: (0, merge_1.default)({}, nodeProperty.displayOptions, displayOptions),
        };
    });
}
function processJsonInput(jsonData, inputName) {
    let values;
    const input = inputName ? `'${inputName}' ` : '';
    if (typeof jsonData === 'string') {
        try {
            values = (0, n8n_workflow_1.jsonParse)(jsonData);
        }
        catch (error) {
            throw new n8n_workflow_1.ApplicationError(`Input ${input} must contain a valid JSON`, { level: 'warning' });
        }
    }
    else if (typeof jsonData === 'object') {
        values = jsonData;
    }
    else {
        throw new n8n_workflow_1.ApplicationError(`Input ${input} must contain a valid JSON`, { level: 'warning' });
    }
    return values;
}
function isFalsy(value) {
    if ((0, isNull_1.default)(value))
        return true;
    if (typeof value === 'string' && value === '')
        return true;
    if (Array.isArray(value) && value.length === 0)
        return true;
    return false;
}
const parseStringAndCompareToObject = (str, arr) => {
    try {
        const parsedArray = (0, n8n_workflow_1.jsonParse)(str);
        return (0, isEqual_1.default)(parsedArray, arr);
    }
    catch (error) {
        return false;
    }
};
const fuzzyCompare = (useFuzzyCompare, compareVersion = 1) => {
    if (!useFuzzyCompare) {
        //Fuzzy compare is false we do strict comparison
        return (item1, item2) => (0, isEqual_1.default)(item1, item2);
    }
    return (item1, item2) => {
        //Both types are the same, so we do strict comparison
        if (!(0, isNull_1.default)(item1) && !(0, isNull_1.default)(item2) && typeof item1 === typeof item2) {
            return (0, isEqual_1.default)(item1, item2);
        }
        if (compareVersion >= 2) {
            //Null, 0 and "0" treated as equal
            if ((0, isNull_1.default)(item1) && ((0, isNull_1.default)(item2) || item2 === 0 || item2 === '0')) {
                return true;
            }
            if ((0, isNull_1.default)(item2) && ((0, isNull_1.default)(item1) || item1 === 0 || item1 === '0')) {
                return true;
            }
        }
        //Null, empty strings, empty arrays all treated as the same
        if (isFalsy(item1) && isFalsy(item2))
            return true;
        //When a field is missing in one branch and isFalsy() in another, treat them as matching
        if (isFalsy(item1) && item2 === undefined)
            return true;
        if (item1 === undefined && isFalsy(item2))
            return true;
        //Compare numbers and strings representing that number
        if (typeof item1 === 'number' && typeof item2 === 'string') {
            return item1.toString() === item2;
        }
        if (typeof item1 === 'string' && typeof item2 === 'number') {
            return item1 === item2.toString();
        }
        //Compare objects/arrays and their stringified version
        if (!(0, isNull_1.default)(item1) && typeof item1 === 'object' && typeof item2 === 'string') {
            return parseStringAndCompareToObject(item2, item1);
        }
        if (!(0, isNull_1.default)(item2) && typeof item1 === 'string' && typeof item2 === 'object') {
            return parseStringAndCompareToObject(item1, item2);
        }
        //Compare booleans and strings representing the boolean (’true’, ‘True’, ‘TRUE’)
        if (typeof item1 === 'boolean' && typeof item2 === 'string') {
            if (item1 === true && item2.toLocaleLowerCase() === 'true')
                return true;
            if (item1 === false && item2.toLocaleLowerCase() === 'false')
                return true;
        }
        if (typeof item2 === 'boolean' && typeof item1 === 'string') {
            if (item2 === true && item1.toLocaleLowerCase() === 'true')
                return true;
            if (item2 === false && item1.toLocaleLowerCase() === 'false')
                return true;
        }
        //Compare booleans and the numbers/string 0 and 1
        if (typeof item1 === 'boolean' && typeof item2 === 'number') {
            if (item1 === true && item2 === 1)
                return true;
            if (item1 === false && item2 === 0)
                return true;
        }
        if (typeof item2 === 'boolean' && typeof item1 === 'number') {
            if (item2 === true && item1 === 1)
                return true;
            if (item2 === false && item1 === 0)
                return true;
        }
        if (typeof item1 === 'boolean' && typeof item2 === 'string') {
            if (item1 === true && item2 === '1')
                return true;
            if (item1 === false && item2 === '0')
                return true;
        }
        if (typeof item2 === 'boolean' && typeof item1 === 'string') {
            if (item2 === true && item1 === '1')
                return true;
            if (item2 === false && item1 === '0')
                return true;
        }
        return (0, isEqual_1.default)(item1, item2);
    };
};
exports.fuzzyCompare = fuzzyCompare;
function wrapData(data) {
    if (!Array.isArray(data)) {
        return [{ json: data }];
    }
    return data.map((item) => ({
        json: item,
    }));
}
const keysToLowercase = (headers) => {
    if (typeof headers !== 'object' || Array.isArray(headers) || headers === null)
        return headers;
    return Object.entries(headers).reduce((acc, [key, value]) => {
        acc[key.toLowerCase()] = value;
        return acc;
    }, {});
};
exports.keysToLowercase = keysToLowercase;
/**
 * Formats a private key by removing unnecessary whitespace and adding line breaks.
 * @param privateKey - The private key to format.
 * @returns The formatted private key.
 */
function formatPrivateKey(privateKey, keyIsPublic = false) {
    let regex = /(PRIVATE KEY|CERTIFICATE)/;
    if (keyIsPublic) {
        regex = /(PUBLIC KEY)/;
    }
    if (!privateKey || /\n/.test(privateKey)) {
        return privateKey;
    }
    let formattedPrivateKey = '';
    const parts = privateKey.split('-----').filter((item) => item !== '');
    parts.forEach((part) => {
        if (regex.test(part)) {
            formattedPrivateKey += `-----${part}-----`;
        }
        else {
            const passRegex = /Proc-Type|DEK-Info/;
            if (passRegex.test(part)) {
                part = part.replace(/:\s+/g, ':');
                formattedPrivateKey += part.replace(/\\n/g, '\n').replace(/\s+/g, '\n');
            }
            else {
                formattedPrivateKey += part.replace(/\\n/g, '\n').replace(/\s+/g, '\n');
            }
        }
    });
    return formattedPrivateKey;
}
/**
 * @TECH_DEBT Explore replacing with handlebars
 */
function getResolvables(expression) {
    if (!expression)
        return [];
    const resolvables = [];
    const resolvableRegex = /({{[\s\S]*?}})/g;
    let match;
    while ((match = resolvableRegex.exec(expression)) !== null) {
        if (match[1]) {
            resolvables.push(match[1]);
        }
    }
    return resolvables;
}
/**
 * Flattens an object with deep data
 *
 * @param {IDataObject} data The object to flatten
 */
function flattenObject(data) {
    const returnData = {};
    for (const key1 of Object.keys(data)) {
        if (data[key1] !== null && typeof data[key1] === 'object') {
            if (data[key1] instanceof Date) {
                returnData[key1] = data[key1]?.toString();
                continue;
            }
            const flatObject = flattenObject(data[key1]);
            for (const key2 in flatObject) {
                if (flatObject[key2] === undefined) {
                    continue;
                }
                returnData[`${key1}.${key2}`] = flatObject[key2];
            }
        }
        else {
            returnData[key1] = data[key1];
        }
    }
    return returnData;
}
/**
 * Capitalizes the first letter of a string
 *
 * @param {string} string The string to capitalize
 */
function capitalize(str) {
    if (!str)
        return str;
    const chars = str.split('');
    chars[0] = chars[0].toUpperCase();
    return chars.join('');
}
function generatePairedItemData(length) {
    return Array.from({ length }, (_, item) => ({
        item,
    }));
}
/**
 * Output Paired Item Data Array
 *
 * @param {number | IPairedItemData | IPairedItemData[] | undefined} pairedItem
 */
function preparePairedItemDataArray(pairedItem) {
    if (pairedItem === undefined)
        return [];
    if (typeof pairedItem === 'number')
        return [{ item: pairedItem }];
    if (Array.isArray(pairedItem))
        return pairedItem;
    return [pairedItem];
}
const sanitizeDataPathKey = (item, key) => {
    if (item[key] !== undefined) {
        return key;
    }
    if ((key.startsWith("['") && key.endsWith("']")) ||
        (key.startsWith('["') && key.endsWith('"]'))) {
        key = key.slice(2, -2);
        if (item[key] !== undefined) {
            return key;
        }
    }
    return key;
};
exports.sanitizeDataPathKey = sanitizeDataPathKey;
/**
 * Escape HTML
 *
 * @param {string} text The text to escape
 */
function escapeHtml(text) {
    if (!text)
        return '';
    return text.replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, (match) => {
        switch (match) {
            case '&amp;':
                return '&';
            case '&lt;':
                return '<';
            case '&gt;':
                return '>';
            case '&#39;':
                return "'";
            case '&quot;':
                return '"';
            default:
                return match;
        }
    });
}
/**
 * Sorts each item json's keys by a priority list
 *
 * @param {INodeExecutionData[]} data The array of items which keys will be sorted
 * @param {string[]} priorityList The priority list, keys of item.json will be sorted in this order first then alphabetically
 */
function sortItemKeysByPriorityList(data, priorityList) {
    return data.map((item) => {
        const itemKeys = Object.keys(item.json);
        const updatedKeysOrder = itemKeys.sort((a, b) => {
            const indexA = priorityList.indexOf(a);
            const indexB = priorityList.indexOf(b);
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            else if (indexA !== -1) {
                return -1;
            }
            else if (indexB !== -1) {
                return 1;
            }
            return a.localeCompare(b);
        });
        const updatedItem = {};
        for (const key of updatedKeysOrder) {
            updatedItem[key] = item.json[key];
        }
        item.json = updatedItem;
        return item;
    });
}
function createUtmCampaignLink(nodeType, instanceId) {
    return `https://n8n.io/?utm_source=n8n-internal&utm_medium=powered_by&utm_campaign=${encodeURIComponent(nodeType)}${instanceId ? '_' + instanceId : ''}`;
}
const removeTrailingSlash = (url) => {
    if (url.endsWith('/')) {
        return url.slice(0, -1);
    }
    return url;
};
exports.removeTrailingSlash = removeTrailingSlash;
function addExecutionHints(context, node, items, operation, executeOnce) {
    if ((node.type === n8n_workflow_1.POSTGRES_NODE_TYPE || node.type === n8n_workflow_1.MYSQL_NODE_TYPE) &&
        operation === 'select' &&
        items.length > 1 &&
        !executeOnce) {
        context.addExecutionHints({
            message: `This node ran ${items.length} times, once for each input item. To run for the first item only, enable 'execute once' in the node settings`,
            location: 'outputPane',
        });
    }
    if (node.type === n8n_workflow_1.POSTGRES_NODE_TYPE &&
        operation === 'executeQuery' &&
        items.length > 1 &&
        context.getNodeParameter('options.queryBatching', 0, 'single') === 'single' &&
        context.getNodeParameter('query', 0, '').toLowerCase().startsWith('insert')) {
        context.addExecutionHints({
            message: "Inserts were batched for performance. If you need to preserve item matching, consider changing 'Query batching' to 'Independent' in the options.",
            location: 'outputPane',
        });
    }
    if (node.type === n8n_workflow_1.MYSQL_NODE_TYPE &&
        operation === 'executeQuery' &&
        context.getNodeParameter('options.queryBatching', 0, 'single') === 'single' &&
        context.getNodeParameter('query', 0, '').toLowerCase().startsWith('insert')) {
        context.addExecutionHints({
            message: "Inserts were batched for performance. If you need to preserve item matching, consider changing 'Query batching' to 'Independent' in the options.",
            location: 'outputPane',
        });
    }
}
//# sourceMappingURL=utilities.js.map