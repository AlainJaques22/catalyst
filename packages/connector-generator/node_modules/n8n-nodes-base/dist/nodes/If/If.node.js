"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const IfV1_node_1 = require("./V1/IfV1.node");
const IfV2_node_1 = require("./V2/IfV2.node");
class If extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'If',
            name: 'if',
            icon: 'fa:map-signs',
            iconColor: 'green',
            group: ['transform'],
            description: 'Route items to different branches (true/false)',
            defaultVersion: 2.3,
        };
        const nodeVersions = {
            1: new IfV1_node_1.IfV1(baseDescription),
            2: new IfV2_node_1.IfV2(baseDescription),
            2.1: new IfV2_node_1.IfV2(baseDescription),
            2.2: new IfV2_node_1.IfV2(baseDescription),
            2.3: new IfV2_node_1.IfV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.If = If;
//# sourceMappingURL=If.node.js.map