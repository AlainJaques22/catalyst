"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenOutput = void 0;
exports.removeIgnored = removeIgnored;
exports.findMatches = findMatches;
exports.processAirtableError = processAirtableError;
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
function removeIgnored(data, ignore) {
    if (ignore) {
        let ignoreFields = [];
        if (typeof ignore === 'string') {
            ignoreFields = ignore.split(',').map((field) => field.trim());
        }
        else {
            ignoreFields = ignore;
        }
        const newData = {};
        for (const field of Object.keys(data)) {
            if (!ignoreFields.includes(field)) {
                newData[field] = data[field];
            }
        }
        return newData;
    }
    else {
        return data;
    }
}
function findMatches(data, keys, fields, updateAll) {
    if (updateAll) {
        const matches = data.filter((record) => {
            for (const key of keys) {
                if (record.fields[key] !== fields[key]) {
                    return false;
                }
            }
            return true;
        });
        if (!matches?.length) {
            throw new n8n_workflow_1.ApplicationError('No records match provided keys', { level: 'warning' });
        }
        return matches;
    }
    else {
        const match = data.find((record) => {
            for (const key of keys) {
                if (record.fields[key] !== fields[key]) {
                    return false;
                }
            }
            return true;
        });
        if (!match) {
            throw new n8n_workflow_1.ApplicationError('Record matching provided keys was not found', {
                level: 'warning',
            });
        }
        return [match];
    }
}
function processAirtableError(error, id, itemIndex) {
    if (error.description === 'NOT_FOUND' && id) {
        error.description = `${id} is not a valid Record ID`;
    }
    if (error.description?.includes('You must provide an array of up to 10 record objects') && id) {
        error.description = `${id} is not a valid Record ID`;
    }
    if (itemIndex !== undefined) {
        (0, set_1.default)(error, 'context.itemIndex', itemIndex);
    }
    return error;
}
const flattenOutput = (record) => {
    const { fields, ...rest } = record;
    return {
        ...rest,
        ...fields,
    };
};
exports.flattenOutput = flattenOutput;
//# sourceMappingURL=utils.js.map