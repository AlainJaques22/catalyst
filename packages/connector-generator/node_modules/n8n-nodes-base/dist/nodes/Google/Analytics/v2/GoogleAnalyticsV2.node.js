"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAnalyticsV2 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
class GoogleAnalyticsV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
            usableAsTool: true,
        };
    }
    methods = { loadOptions: methods_1.loadOptions, listSearch: methods_1.listSearch };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.GoogleAnalyticsV2 = GoogleAnalyticsV2;
//# sourceMappingURL=GoogleAnalyticsV2.node.js.map