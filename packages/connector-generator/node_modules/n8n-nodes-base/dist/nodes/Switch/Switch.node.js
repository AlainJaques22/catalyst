"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const SwitchV1_node_1 = require("./V1/SwitchV1.node");
const SwitchV2_node_1 = require("./V2/SwitchV2.node");
const SwitchV3_node_1 = require("./V3/SwitchV3.node");
class Switch extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Switch',
            name: 'switch',
            icon: 'fa:map-signs',
            iconColor: 'light-blue',
            group: ['transform'],
            description: 'Route items depending on defined expression or rules',
            defaultVersion: 3.4,
        };
        const nodeVersions = {
            1: new SwitchV1_node_1.SwitchV1(baseDescription),
            2: new SwitchV2_node_1.SwitchV2(baseDescription),
            3: new SwitchV3_node_1.SwitchV3(baseDescription),
            3.1: new SwitchV3_node_1.SwitchV3(baseDescription),
            3.2: new SwitchV3_node_1.SwitchV3(baseDescription),
            3.3: new SwitchV3_node_1.SwitchV3(baseDescription),
            3.4: new SwitchV3_node_1.SwitchV3(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Switch = Switch;
//# sourceMappingURL=Switch.node.js.map