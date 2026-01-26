"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merge = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MergeV1_node_1 = require("./v1/MergeV1.node");
const MergeV2_node_1 = require("./v2/MergeV2.node");
const MergeV3_node_1 = require("./v3/MergeV3.node");
class Merge extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Merge',
            name: 'merge',
            icon: 'file:merge.svg',
            group: ['transform'],
            subtitle: '={{$parameter["mode"]}}',
            description: 'Merges data of multiple streams once data from both is available',
            defaultVersion: 3.2,
        };
        const nodeVersions = {
            1: new MergeV1_node_1.MergeV1(baseDescription),
            2: new MergeV2_node_1.MergeV2(baseDescription),
            2.1: new MergeV2_node_1.MergeV2(baseDescription),
            3: new MergeV3_node_1.MergeV3(baseDescription),
            3.1: new MergeV3_node_1.MergeV3(baseDescription),
            3.2: new MergeV3_node_1.MergeV3(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Merge = Merge;
//# sourceMappingURL=Merge.node.js.map