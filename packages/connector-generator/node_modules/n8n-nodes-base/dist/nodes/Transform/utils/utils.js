"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareFieldsArray = void 0;
const errors_1 = require("@n8n/errors");
const prepareFieldsArray = (fields, fieldName = 'Fields') => {
    if (typeof fields === 'string') {
        return fields
            .split(',')
            .map((entry) => entry.trim())
            .filter((entry) => entry !== '');
    }
    if (Array.isArray(fields)) {
        return fields;
    }
    throw new errors_1.ApplicationError(`The \'${fieldName}\' parameter must be a string of fields separated by commas or an array of strings.`, { level: 'warning' });
};
exports.prepareFieldsArray = prepareFieldsArray;
//# sourceMappingURL=utils.js.map