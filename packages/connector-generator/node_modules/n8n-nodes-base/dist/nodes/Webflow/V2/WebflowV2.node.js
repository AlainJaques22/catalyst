"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebflowV2 = void 0;
const GenericFunctions_1 = require("../GenericFunctions");
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
class WebflowV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
            usableAsTool: true,
        };
    }
    methods = {
        loadOptions: {
            getSites: GenericFunctions_1.getSites,
            getCollections: GenericFunctions_1.getCollections,
            getFields: GenericFunctions_1.getFields,
        },
    };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.WebflowV2 = WebflowV2;
//# sourceMappingURL=WebflowV2.node.js.map