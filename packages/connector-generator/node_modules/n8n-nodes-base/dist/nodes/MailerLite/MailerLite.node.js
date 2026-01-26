"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerLite = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MailerLiteV1_node_1 = require("./v1/MailerLiteV1.node");
const MailerLiteV2_node_1 = require("./v2/MailerLiteV2.node");
class MailerLite extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'MailerLite',
            name: 'mailerLite',
            icon: 'file:MailerLite.svg',
            group: ['input'],
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume MailerLite API',
            defaultVersion: 2,
        };
        const nodeVersions = {
            1: new MailerLiteV1_node_1.MailerLiteV1(baseDescription),
            2: new MailerLiteV2_node_1.MailerLiteV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.MailerLite = MailerLite;
//# sourceMappingURL=MailerLite.node.js.map