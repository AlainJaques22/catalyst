"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlV2 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
class MySqlV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
        };
    }
    methods = { listSearch: methods_1.listSearch, loadOptions: methods_1.loadOptions, credentialTest: methods_1.credentialTest };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.MySqlV2 = MySqlV2;
//# sourceMappingURL=MySqlV2.node.js.map