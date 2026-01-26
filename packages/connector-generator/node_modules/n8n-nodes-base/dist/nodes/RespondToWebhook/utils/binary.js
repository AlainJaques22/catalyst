"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaryResponse = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const setContentLength = (responseBody, headers) => {
    if (Buffer.isBuffer(responseBody)) {
        headers['content-length'] = responseBody.length;
    }
    else if (typeof responseBody === 'string') {
        headers['content-length'] = Buffer.byteLength(responseBody, 'utf8');
    }
};
/**
 * Returns a response body for a binary data and sets the content-type header.
 */
const getBinaryResponse = (binaryData, headers) => {
    let responseBody;
    if (binaryData.id) {
        responseBody = { binaryData };
    }
    else {
        const responseBuffer = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
        responseBody = responseBuffer;
        setContentLength(responseBody, headers);
    }
    headers['content-type'] ??= binaryData.mimeType;
    return responseBody;
};
exports.getBinaryResponse = getBinaryResponse;
//# sourceMappingURL=binary.js.map