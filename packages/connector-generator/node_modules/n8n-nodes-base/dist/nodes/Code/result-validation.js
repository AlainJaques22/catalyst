"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_N8N_ITEM_KEYS = void 0;
exports.getTextKey = getTextKey;
exports.validateItem = validateItem;
exports.validateTopLevelKeys = validateTopLevelKeys;
exports.validateRunCodeEachItem = validateRunCodeEachItem;
exports.validateRunCodeAllItems = validateRunCodeAllItems;
const reserved_key_found_error_1 = require("./reserved-key-found-error");
const utils_1 = require("./utils");
const ValidationError_1 = require("./ValidationError");
exports.REQUIRED_N8N_ITEM_KEYS = new Set(['json', 'binary', 'pairedItem', 'error', 'index']);
function getTextKey(textKeys, key, options) {
    const response = textKeys[key][options?.plural ? 'plural' : 'singular'];
    if (!options?.includeArticle) {
        return response;
    }
    if (['a', 'e', 'i', 'o', 'u'].some((value) => response.startsWith(value))) {
        return `an ${response}`;
    }
    return `a ${response}`;
}
function validateItem({ json, binary }, itemIndex, textKeys) {
    if (json === undefined || !(0, utils_1.isObject)(json)) {
        throw new ValidationError_1.ValidationError({
            message: `A 'json' property isn't ${getTextKey(textKeys, 'object', { includeArticle: true })}`,
            description: `In the returned data, every key named 'json' must point to ${getTextKey(textKeys, 'object', { includeArticle: true })}.`,
            itemIndex,
        });
    }
    if (binary !== undefined && !(0, utils_1.isObject)(binary)) {
        throw new ValidationError_1.ValidationError({
            message: `A 'binary' property isn't ${getTextKey(textKeys, 'object', { includeArticle: true })}`,
            description: `In the returned data, every key named 'binary' must point to ${getTextKey(textKeys, 'object', { includeArticle: true })}.`,
            itemIndex,
        });
    }
}
function validateTopLevelKeys(item, itemIndex) {
    let foundReservedKey = null;
    const unknownKeys = [];
    for (const key in item) {
        if (!Object.prototype.hasOwnProperty.call(item, key))
            continue;
        if (exports.REQUIRED_N8N_ITEM_KEYS.has(key)) {
            foundReservedKey ??= key;
        }
        else {
            unknownKeys.push(key);
        }
    }
    if (unknownKeys.length > 0) {
        if (foundReservedKey)
            throw new reserved_key_found_error_1.ReservedKeyFoundError(foundReservedKey, itemIndex);
        throw new ValidationError_1.ValidationError({
            message: `Unknown top-level item key: ${unknownKeys[0]}`,
            description: 'Access the properties of an item under `.json`, e.g. `item.json`',
            itemIndex,
        });
    }
}
function validateRunCodeEachItem(executionResult, itemIndex, textKeys, normalizeItems) {
    if (typeof executionResult !== 'object') {
        throw new ValidationError_1.ValidationError({
            message: `Code doesn't return ${getTextKey(textKeys, 'object', { includeArticle: true })}`,
            description: `Please return ${getTextKey(textKeys, 'object', {
                includeArticle: true,
            })} representing the output item. ('${executionResult}' was returned instead.)`,
            itemIndex,
        });
    }
    if (Array.isArray(executionResult)) {
        const firstSentence = executionResult.length > 0
            ? `An array of ${typeof executionResult[0]}s was returned.`
            : 'An empty array was returned.';
        throw new ValidationError_1.ValidationError({
            message: `Code doesn't return a single ${getTextKey(textKeys, 'object')}`,
            description: `${firstSentence} If you need to output multiple items, please use the 'Run Once for All Items' mode instead.`,
            itemIndex,
        });
    }
    const [returnData] = normalizeItems([executionResult]);
    validateItem(returnData, itemIndex, textKeys);
    // If at least one top-level key is a supported item key (`json`, `binary`, etc.),
    // and another top-level key is unrecognized, then the user mis-added a property
    // directly on the item, when they intended to add it on the `json` property
    validateTopLevelKeys(returnData, itemIndex);
    return returnData;
}
function validateRunCodeAllItems(executionResult, textKeys, normalizeItems) {
    if (typeof executionResult !== 'object') {
        throw new ValidationError_1.ValidationError({
            message: "Code doesn't return items properly",
            description: `Please return an array of ${getTextKey(textKeys, 'object', {
                plural: true,
            })}, one for each item you would like to output.`,
        });
    }
    if (Array.isArray(executionResult)) {
        /**
         * If at least one top-level key is an n8n item key (`json`, `binary`, etc.),
         * then require all item keys to be an n8n item key.
         *
         * If no top-level key is an n8n key, then skip this check, allowing non-n8n
         * item keys to be wrapped in `json` when normalizing items below.
         */
        for (const item of executionResult) {
            if (!(0, utils_1.isObject)(item)) {
                throw new ValidationError_1.ValidationError({
                    message: "Code doesn't return items properly",
                    description: `Please return an array of ${getTextKey(textKeys, 'object', {
                        plural: true,
                    })}, one for each item you would like to output.`,
                });
            }
        }
        const mustHaveTopLevelN8nKey = executionResult.some((item) => Object.keys(item).find((key) => exports.REQUIRED_N8N_ITEM_KEYS.has(key)));
        if (mustHaveTopLevelN8nKey) {
            for (let index = 0; index < executionResult.length; index++) {
                const item = executionResult[index];
                validateTopLevelKeys(item, index);
            }
        }
    }
    const returnData = normalizeItems(executionResult);
    returnData.forEach((item, index) => validateItem(item, index, textKeys));
    return returnData;
}
//# sourceMappingURL=result-validation.js.map