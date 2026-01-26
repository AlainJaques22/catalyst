"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockExecuteFunction = exports.driveNode = void 0;
exports.createTestStream = createTestStream;
const get_1 = __importDefault(require("lodash/get"));
const n8n_core_1 = require("n8n-core");
const stream_1 = require("stream");
exports.driveNode = {
    id: '11',
    name: 'Google Drive node',
    typeVersion: 3,
    type: 'n8n-nodes-base.googleDrive',
    position: [42, 42],
    parameters: {},
};
const createMockExecuteFunction = (nodeParameters, node, continueOnFail = false) => {
    const fakeExecuteFunction = {
        getNodeParameter(parameterName, _itemIndex, fallbackValue, options) {
            const parameter = options?.extractValue ? `${parameterName}.value` : parameterName;
            return (0, get_1.default)(nodeParameters, parameter, fallbackValue);
        },
        getNode() {
            return node;
        },
        helpers: {
            constructExecutionMetaData: n8n_core_1.constructExecutionMetaData,
            returnJsonArray: () => [],
            prepareBinaryData: () => { },
            httpRequest: () => { },
        },
        continueOnFail: () => continueOnFail,
    };
    return fakeExecuteFunction;
};
exports.createMockExecuteFunction = createMockExecuteFunction;
function createTestStream(byteSize) {
    let bytesSent = 0;
    const CHUNK_SIZE = 64 * 1024; // 64kB chunks (default NodeJS highWaterMark)
    return new stream_1.Readable({
        read() {
            const remainingBytes = byteSize - bytesSent;
            if (remainingBytes <= 0) {
                this.push(null);
                return;
            }
            const chunkSize = Math.min(CHUNK_SIZE, remainingBytes);
            const chunk = Buffer.alloc(chunkSize, 'A'); // Test data just a string of "A"
            bytesSent += chunkSize;
            this.push(chunk);
        },
    });
}
//# sourceMappingURL=helpers.js.map