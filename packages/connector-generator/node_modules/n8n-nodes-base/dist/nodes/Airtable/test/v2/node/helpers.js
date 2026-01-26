"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockExecuteFunction = exports.node = void 0;
const get_1 = __importDefault(require("lodash/get"));
const n8n_core_1 = require("n8n-core");
exports.node = {
    id: '11',
    name: 'Airtable node',
    typeVersion: 2,
    type: 'n8n-nodes-base.airtable',
    position: [42, 42],
    parameters: {
        operation: 'create',
    },
};
const createMockExecuteFunction = (nodeParameters) => {
    const fakeExecuteFunction = {
        getInputData: jest.fn(() => {
            return [{ json: {} }];
        }),
        getNodeParameter: jest.fn((parameterName, _itemIndex, fallbackValue, options) => {
            const parameter = options?.extractValue ? `${parameterName}.value` : parameterName;
            return (0, get_1.default)(nodeParameters, parameter, fallbackValue);
        }),
        getNode: jest.fn(() => {
            return exports.node;
        }),
        helpers: { constructExecutionMetaData: jest.fn(n8n_core_1.constructExecutionMetaData) },
        continueOnFail: jest.fn(() => false),
    };
    return fakeExecuteFunction;
};
exports.createMockExecuteFunction = createMockExecuteFunction;
//# sourceMappingURL=helpers.js.map