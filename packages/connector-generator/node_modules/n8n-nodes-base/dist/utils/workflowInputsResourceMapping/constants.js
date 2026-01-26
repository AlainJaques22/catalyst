"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FALLBACK_DEFAULT_VALUE = exports.TYPE_OPTIONS = exports.PASSTHROUGH = exports.JSON_EXAMPLE = exports.VALUES = exports.WORKFLOW_INPUTS = exports.INPUT_SOURCE = void 0;
exports.INPUT_SOURCE = 'inputSource';
exports.WORKFLOW_INPUTS = 'workflowInputs';
exports.VALUES = 'values';
exports.JSON_EXAMPLE = 'jsonExample';
exports.PASSTHROUGH = 'passthrough';
exports.TYPE_OPTIONS = [
    {
        name: 'Allow Any Type',
        value: 'any',
    },
    {
        name: 'String',
        value: 'string',
    },
    {
        name: 'Number',
        value: 'number',
    },
    {
        name: 'Boolean',
        value: 'boolean',
    },
    {
        name: 'Array',
        value: 'array',
    },
    {
        name: 'Object',
        value: 'object',
    },
    // Intentional omission of `dateTime`, `time`, `string-alphanumeric`, `form-fields`, `jwt` and `url`
];
exports.FALLBACK_DEFAULT_VALUE = null;
//# sourceMappingURL=constants.js.map