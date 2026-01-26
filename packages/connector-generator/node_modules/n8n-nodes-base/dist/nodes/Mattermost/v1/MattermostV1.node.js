"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MattermostV1 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
class MattermostV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
            usableAsTool: true,
        };
    }
    methods = { loadOptions: methods_1.loadOptions };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.MattermostV1 = MattermostV1;
//# sourceMappingURL=MattermostV1.node.js.map