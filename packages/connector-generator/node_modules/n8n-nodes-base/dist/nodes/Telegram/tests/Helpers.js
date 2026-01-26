"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockExecuteFunction = exports.telegramNode = void 0;
const get_1 = __importDefault(require("lodash/get"));
exports.telegramNode = {
    id: 'b3039263-29ad-4476-9894-51dfcc5a706d',
    name: 'Telegram node',
    typeVersion: 1.2,
    type: 'n8n-nodes-base.telegram',
    position: [0, 0],
    parameters: {
        resource: 'callback',
        operation: 'answerQuery',
    },
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
            return exports.telegramNode;
        },
        helpers: {},
        continueOnFail: () => false,
    };
    return fakeExecuteFunction;
};
exports.createMockExecuteFunction = createMockExecuteFunction;
//# sourceMappingURL=Helpers.js.map