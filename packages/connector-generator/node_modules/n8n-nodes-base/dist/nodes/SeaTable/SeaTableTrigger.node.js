"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaTableTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const SeaTableTriggerV1_node_1 = require("./v1/SeaTableTriggerV1.node");
const SeaTableTriggerV2_node_1 = require("./v2/SeaTableTriggerV2.node");
class SeaTableTrigger extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'SeaTable Trigger',
            name: 'seaTableTrigger',
            icon: 'file:seaTable.svg',
            group: ['trigger'],
            defaultVersion: 2,
            description: 'Starts the workflow when SeaTable events occur',
        };
        const nodeVersions = {
            1: new SeaTableTriggerV1_node_1.SeaTableTriggerV1(baseDescription),
            2: new SeaTableTriggerV2_node_1.SeaTableTriggerV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.SeaTableTrigger = SeaTableTrigger;
//# sourceMappingURL=SeaTableTrigger.node.js.map