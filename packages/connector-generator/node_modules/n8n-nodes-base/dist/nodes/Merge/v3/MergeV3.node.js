"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeV3 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
class MergeV3 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
        };
    }
    methods = {
        loadOptions: methods_1.loadOptions,
    };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.MergeV3 = MergeV3;
//# sourceMappingURL=MergeV3.node.js.map