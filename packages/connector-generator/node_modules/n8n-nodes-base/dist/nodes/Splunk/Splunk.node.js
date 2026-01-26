"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Splunk = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const SplunkV1_node_1 = require("./v1/SplunkV1.node");
const SplunkV2_node_1 = require("./v2/SplunkV2.node");
class Splunk extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Splunk',
            name: 'splunk',
            icon: 'file:splunk.svg',
            group: ['transform'],
            description: 'Consume the Splunk Enterprise API',
            defaultVersion: 2,
        };
        const nodeVersions = {
            1: new SplunkV1_node_1.SplunkV1(baseDescription),
            2: new SplunkV2_node_1.SplunkV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Splunk = Splunk;
//# sourceMappingURL=Splunk.node.js.map