"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mimeTypeFromResponse = void 0;
const mimeTypeFromResponse = (responseContentType) => {
    if (!responseContentType) {
        return undefined;
    }
    return responseContentType.split(' ')[0].split(';')[0];
};
exports.mimeTypeFromResponse = mimeTypeFromResponse;
//# sourceMappingURL=parse.js.map