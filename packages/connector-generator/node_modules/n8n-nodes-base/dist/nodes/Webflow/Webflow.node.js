"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webflow = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const WebflowV1_node_1 = require("./V1/WebflowV1.node");
const WebflowV2_node_1 = require("./V2/WebflowV2.node");
class Webflow extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Webflow',
            name: 'webflow',
            icon: 'file:webflow.svg',
            group: ['transform'],
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Webflow API',
            defaultVersion: 2,
        };
        const nodeVersions = {
            1: new WebflowV1_node_1.WebflowV1(baseDescription),
            2: new WebflowV2_node_1.WebflowV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Webflow = Webflow;
//# sourceMappingURL=Webflow.node.js.map