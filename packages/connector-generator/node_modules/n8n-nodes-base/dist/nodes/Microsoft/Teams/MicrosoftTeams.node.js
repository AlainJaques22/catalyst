"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftTeams = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MicrosoftTeamsV1_node_1 = require("./v1/MicrosoftTeamsV1.node");
const MicrosoftTeamsV2_node_1 = require("./v2/MicrosoftTeamsV2.node");
class MicrosoftTeams extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Microsoft Teams',
            name: 'microsoftTeams',
            icon: 'file:teams.svg',
            group: ['input'],
            description: 'Consume Microsoft Teams API',
            defaultVersion: 2,
        };
        const nodeVersions = {
            1: new MicrosoftTeamsV1_node_1.MicrosoftTeamsV1(baseDescription),
            1.1: new MicrosoftTeamsV1_node_1.MicrosoftTeamsV1(baseDescription),
            2: new MicrosoftTeamsV2_node_1.MicrosoftTeamsV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.MicrosoftTeams = MicrosoftTeams;
//# sourceMappingURL=MicrosoftTeams.node.js.map