"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtableV2 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
class AirtableV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
            usableAsTool: true,
        };
    }
    methods = {
        listSearch: methods_1.listSearch,
        loadOptions: methods_1.loadOptions,
        resourceMapping: methods_1.resourceMapping,
    };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.AirtableV2 = AirtableV2;
//# sourceMappingURL=AirtableV2.node.js.map