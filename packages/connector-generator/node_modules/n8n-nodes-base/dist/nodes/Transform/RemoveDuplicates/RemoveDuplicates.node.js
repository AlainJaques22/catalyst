"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveDuplicates = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const RemoveDuplicatesV1_node_1 = require("./v1/RemoveDuplicatesV1.node");
const RemoveDuplicatesV2_node_1 = require("./v2/RemoveDuplicatesV2.node");
class RemoveDuplicates extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Remove Duplicates',
            name: 'removeDuplicates',
            icon: 'file:removeDuplicates.svg',
            group: ['transform'],
            defaultVersion: 2,
            description: 'Delete items with matching field values',
        };
        const nodeVersions = {
            1: new RemoveDuplicatesV1_node_1.RemoveDuplicatesV1(baseDescription),
            1.1: new RemoveDuplicatesV1_node_1.RemoveDuplicatesV1(baseDescription),
            2: new RemoveDuplicatesV2_node_1.RemoveDuplicatesV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.RemoveDuplicates = RemoveDuplicates;
//# sourceMappingURL=RemoveDuplicates.node.js.map