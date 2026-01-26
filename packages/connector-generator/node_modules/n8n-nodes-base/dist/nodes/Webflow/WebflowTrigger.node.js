"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebflowTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const WebflowTriggerV1_node_1 = require("./V1/WebflowTriggerV1.node");
const WebflowTriggerV2_node_1 = require("./V2/WebflowTriggerV2.node");
class WebflowTrigger extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Webflow Trigger',
            name: 'webflowTrigger',
            icon: 'file:webflow.svg',
            group: ['trigger'],
            description: 'Handle Webflow events via webhooks',
            defaultVersion: 2,
        };
        const nodeVersions = {
            1: new WebflowTriggerV1_node_1.WebflowTriggerV1(baseDescription),
            2: new WebflowTriggerV2_node_1.WebflowTriggerV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.WebflowTrigger = WebflowTrigger;
//# sourceMappingURL=WebflowTrigger.node.js.map