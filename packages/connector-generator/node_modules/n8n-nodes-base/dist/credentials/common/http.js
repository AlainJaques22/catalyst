"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = void 0;
const getUrl = (options) => {
    if (options.url) {
        return new URL(options.url, options.baseURL).toString();
    }
    if ('uri' in options && options.uri) {
        return options.uri;
    }
    throw new Error('No URL found in request options');
};
exports.getUrl = getUrl;
//# sourceMappingURL=http.js.map