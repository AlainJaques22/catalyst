"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemListsV3 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
class ItemListsV3 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
        };
    }
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.ItemListsV3 = ItemListsV3;
//# sourceMappingURL=ItemListsV3.node.js.map