"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFilename = void 0;
const setFilename = (preparedBinaryData, requestOptions, responseFileName) => {
    if (!preparedBinaryData.fileName &&
        preparedBinaryData.fileExtension &&
        typeof requestOptions.uri === 'string' &&
        requestOptions.uri.endsWith(preparedBinaryData.fileExtension)) {
        return requestOptions.uri.split('/').pop();
    }
    if (!preparedBinaryData.fileName && preparedBinaryData.fileExtension) {
        return `${responseFileName ?? 'data'}.${preparedBinaryData.fileExtension}`;
    }
    return preparedBinaryData.fileName;
};
exports.setFilename = setFilename;
//# sourceMappingURL=binaryData.js.map