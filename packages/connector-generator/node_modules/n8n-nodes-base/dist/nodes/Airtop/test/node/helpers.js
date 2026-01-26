"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockExecuteFunction = exports.node = void 0;
const get_1 = __importDefault(require("lodash/get"));
const n8n_core_1 = require("n8n-core");
exports.node = {
    id: '1',
    name: 'Airtop node',
    typeVersion: 1,
    type: 'n8n-nodes-base.airtop',
    position: [10, 10],
    parameters: {},
};
const createMockExecuteFunction = (nodeParameters) => {
    const fakeExecuteFunction = {
        getInputData() {
            return [{ json: {} }];
        },
        getNodeParameter(parameterName, _itemIndex, fallbackValue, options) {
            const parameter = options?.extractValue ? `${parameterName}.value` : parameterName;
            return (0, get_1.default)(nodeParameters, parameter, fallbackValue);
        },
        getNode() {
            return exports.node;
        },
        helpers: {
            constructExecutionMetaData: n8n_core_1.constructExecutionMetaData,
            returnJsonArray: (data) => {
                return [{ json: data }];
            },
            prepareBinaryData: async (data) => {
                return {
                    mimeType: 'image/jpeg',
                    fileType: 'jpg',
                    fileName: 'screenshot.jpg',
                    data: data.toString('base64'),
                };
            },
        },
        continueOnFail: () => false,
        logger: {
            info: () => { },
        },
    };
    return fakeExecuteFunction;
};
exports.createMockExecuteFunction = createMockExecuteFunction;
//# sourceMappingURL=helpers.js.map