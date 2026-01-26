"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitAndTrim = splitAndTrim;
exports.fixFieldType = fixFieldType;
exports.prepareInputItem = prepareInputItem;
exports.constructFilter = constructFilter;
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
function splitAndTrim(str) {
    if (typeof str === 'string') {
        return str
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag);
    }
    return str;
}
function fixFieldType(fields) {
    const returnData = {};
    for (const key of Object.keys(fields)) {
        if ([
            'date',
            'lastSyncDate',
            'startDate',
            'endDate',
            'dueDate',
            'includeInTimeline',
            'sightedAt',
        ].includes(key)) {
            returnData[key] = Date.parse(fields[key]);
            continue;
        }
        if (['tags', 'addTags', 'removeTags'].includes(key)) {
            returnData[key] = splitAndTrim(fields[key]);
            continue;
        }
        returnData[key] = fields[key];
    }
    return returnData;
}
function prepareInputItem(item, schema, i) {
    const returnData = {};
    for (const entry of schema) {
        const id = entry.id;
        const value = (0, get_1.default)(item, id);
        if (value !== undefined) {
            (0, set_1.default)(returnData, id, value);
        }
        else {
            if (entry.required) {
                throw new n8n_workflow_1.ApplicationError(`Required field "${id}" is missing in item ${i}`, {
                    level: 'warning',
                });
            }
        }
    }
    return returnData;
}
function constructFilter(entry) {
    const { field, value } = entry;
    let { operator } = entry;
    if (operator === undefined) {
        operator = '_eq';
    }
    if (operator === '_between') {
        const { from, to } = entry;
        return {
            _between: {
                _field: field,
                _from: from,
                _to: to,
            },
        };
    }
    if (operator === '_in') {
        const { values } = entry;
        return {
            _in: {
                _field: field,
                _values: typeof values === 'string' ? splitAndTrim(values) : values,
            },
        };
    }
    return {
        [operator]: {
            _field: field,
            _value: value,
        },
    };
}
//# sourceMappingURL=utils.js.map