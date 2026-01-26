"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputData = void 0;
exports.removeDuplicateInputItems = removeDuplicateInputItems;
const get_1 = __importDefault(require("lodash/get"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const lt_1 = __importDefault(require("lodash/lt"));
const pick_1 = __importDefault(require("lodash/pick"));
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../utils/utilities");
const utils_1 = require("../utils/utils");
const validateInputData = (node, items, keysToCompare, disableDotNotation) => {
    for (const key of keysToCompare) {
        let type = undefined;
        for (const [i, item] of items.entries()) {
            if (key === '') {
                throw new n8n_workflow_1.NodeOperationError(node, 'Name of field to compare is blank');
            }
            const value = !disableDotNotation ? (0, get_1.default)(item.json, key) : item.json[key];
            if (value === null && node.typeVersion > 1)
                continue;
            if (value === undefined && disableDotNotation && key.includes('.')) {
                throw new n8n_workflow_1.NodeOperationError(node, `'${key}' field is missing from some input items`, {
                    description: "If you're trying to use a nested field, make sure you turn off 'disable dot notation' in the node options",
                });
            }
            else if (value === undefined) {
                throw new n8n_workflow_1.NodeOperationError(node, `'${key}' field is missing from some input items`);
            }
            if (type !== undefined && value !== undefined && type !== typeof value) {
                const description = 'The type of this field varies between items' +
                    (node.typeVersion > 1
                        ? `, in item [${i - 1}] it's a ${type} and in item [${i}] it's a ${typeof value} `
                        : '');
                throw new n8n_workflow_1.NodeOperationError(node, `'${key}' isn't always the same type`, {
                    description,
                });
            }
            else {
                type = typeof value;
            }
        }
    }
};
exports.validateInputData = validateInputData;
function removeDuplicateInputItems(context, items) {
    const compare = context.getNodeParameter('compare', 0);
    const disableDotNotation = context.getNodeParameter('options.disableDotNotation', 0, false);
    const removeOtherFields = context.getNodeParameter('options.removeOtherFields', 0, false);
    let keys = disableDotNotation
        ? Object.keys(items[0].json)
        : Object.keys((0, utilities_1.flattenKeys)(items[0].json));
    for (const item of items) {
        const itemKeys = disableDotNotation
            ? Object.keys(item.json)
            : Object.keys((0, utilities_1.flattenKeys)(item.json));
        for (const key of itemKeys) {
            if (!keys.includes(key)) {
                keys.push(key);
            }
        }
    }
    if (compare === 'allFieldsExcept') {
        const fieldsToExclude = (0, utils_1.prepareFieldsArray)(context.getNodeParameter('fieldsToExclude', 0, ''), 'Fields To Exclude');
        if (!fieldsToExclude.length) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'No fields specified. Please add a field to exclude from comparison');
        }
        if (!disableDotNotation) {
            keys = Object.keys((0, utilities_1.flattenKeys)(items[0].json));
        }
        keys = keys.filter((key) => !fieldsToExclude.includes(key));
    }
    if (compare === 'selectedFields') {
        const fieldsToCompare = (0, utils_1.prepareFieldsArray)(context.getNodeParameter('fieldsToCompare', 0, ''), 'Fields To Compare');
        if (!fieldsToCompare.length) {
            throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'No fields specified. Please add a field to compare on');
        }
        if (!disableDotNotation) {
            keys = Object.keys((0, utilities_1.flattenKeys)(items[0].json));
        }
        keys = fieldsToCompare.map((key) => key.trim());
    }
    // This solution is O(nlogn)
    // add original index to the items
    const newItems = items.map((item, index) => ({
        json: { ...item.json, __INDEX: index },
        pairedItem: { item: index },
    }));
    //sort items using the compare keys
    newItems.sort((a, b) => {
        let result = 0;
        for (const key of keys) {
            let equal;
            if (!disableDotNotation) {
                equal = (0, isEqual_1.default)((0, get_1.default)(a.json, key), (0, get_1.default)(b.json, key));
            }
            else {
                equal = (0, isEqual_1.default)(a.json[key], b.json[key]);
            }
            if (!equal) {
                let lessThan;
                if (!disableDotNotation) {
                    lessThan = (0, lt_1.default)((0, get_1.default)(a.json, key), (0, get_1.default)(b.json, key));
                }
                else {
                    lessThan = (0, lt_1.default)(a.json[key], b.json[key]);
                }
                result = lessThan ? -1 : 1;
                break;
            }
        }
        return result;
    });
    (0, exports.validateInputData)(context.getNode(), newItems, keys, disableDotNotation);
    // collect the original indexes of items to be removed
    const removedIndexes = [];
    let temp = newItems[0];
    for (let index = 1; index < newItems.length; index++) {
        if ((0, utilities_1.compareItems)(newItems[index], temp, keys, disableDotNotation)) {
            removedIndexes.push(newItems[index].json.__INDEX);
        }
        else {
            temp = newItems[index];
        }
    }
    let updatedItems = items.filter((_, index) => !removedIndexes.includes(index));
    if (removeOtherFields) {
        updatedItems = updatedItems.map((item, index) => ({
            json: (0, pick_1.default)(item.json, ...keys),
            pairedItem: { item: index },
        }));
    }
    return [updatedItems];
}
//# sourceMappingURL=utils.js.map