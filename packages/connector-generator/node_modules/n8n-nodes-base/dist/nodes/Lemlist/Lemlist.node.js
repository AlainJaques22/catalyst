"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lemlist = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const LemlistV1_node_1 = require("./v1/LemlistV1.node");
const LemlistV2_node_1 = require("./v2/LemlistV2.node");
class Lemlist extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Lemlist',
            name: 'lemlist',
            icon: 'file:lemlist.svg',
            group: ['transform'],
            defaultVersion: 2,
            description: 'Consume the Lemlist API',
        };
        const nodeVersions = {
            1: new LemlistV1_node_1.LemlistV1(baseDescription),
            2: new LemlistV2_node_1.LemlistV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Lemlist = Lemlist;
//# sourceMappingURL=Lemlist.node.js.map