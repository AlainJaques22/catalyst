"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaTableV2 = void 0;
const router_1 = require("./actions/router");
const SeaTable_node_1 = require("./actions/SeaTable.node");
const methods_1 = require("./methods");
class SeaTableV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...SeaTable_node_1.versionDescription,
        };
    }
    methods = { loadOptions: methods_1.loadOptions };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.SeaTableV2 = SeaTableV2;
//# sourceMappingURL=SeaTableV2.node.js.map