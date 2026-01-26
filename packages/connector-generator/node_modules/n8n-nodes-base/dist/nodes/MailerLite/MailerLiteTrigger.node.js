"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerLiteTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MailerLiteTriggerV1_node_1 = require("./v1/MailerLiteTriggerV1.node");
const MailerLiteTriggerV2_node_1 = require("./v2/MailerLiteTriggerV2.node");
class MailerLiteTrigger extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'MailerLite Trigger',
            name: 'mailerLiteTrigger',
            icon: 'file:MailerLite.svg',
            group: ['trigger'],
            description: 'Starts the workflow when MailerLite events occur',
            defaultVersion: 2,
        };
        const nodeVersions = {
            1: new MailerLiteTriggerV1_node_1.MailerLiteTriggerV1(baseDescription),
            2: new MailerLiteTriggerV2_node_1.MailerLiteTriggerV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.MailerLiteTrigger = MailerLiteTrigger;
//# sourceMappingURL=MailerLiteTrigger.node.js.map