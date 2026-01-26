"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsV2 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
class GoogleSheetsV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
        };
    }
    methods = {
        loadOptions: methods_1.loadOptions,
        credentialTest: methods_1.credentialTest,
        listSearch: methods_1.listSearch,
        resourceMapping: methods_1.resourceMapping,
    };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.GoogleSheetsV2 = GoogleSheetsV2;
//# sourceMappingURL=GoogleSheetsV2.node.js.map