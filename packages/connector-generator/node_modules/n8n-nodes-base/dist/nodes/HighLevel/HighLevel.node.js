"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighLevel = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const HighLevelV1_node_1 = require("./v1/HighLevelV1.node");
const HighLevelV2_node_1 = require("./v2/HighLevelV2.node");
class HighLevel extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'HighLevel',
            name: 'highLevel',
            icon: 'file:highLevel.svg',
            group: ['transform'],
            defaultVersion: 2,
            description: 'Consume HighLevel API',
        };
        const nodeVersions = {
            1: new HighLevelV1_node_1.HighLevelV1(baseDescription),
            2: new HighLevelV2_node_1.HighLevelV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.HighLevel = HighLevel;
//# sourceMappingURL=HighLevel.node.js.map