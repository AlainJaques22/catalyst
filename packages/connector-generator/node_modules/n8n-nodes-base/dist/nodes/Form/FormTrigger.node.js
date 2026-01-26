"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const FormTriggerV1_node_1 = require("./v1/FormTriggerV1.node");
const FormTriggerV2_node_1 = require("./v2/FormTriggerV2.node");
class FormTrigger extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'n8n Form Trigger',
            name: 'formTrigger',
            icon: 'file:form.svg',
            group: ['trigger'],
            description: 'Generate webforms in n8n and pass their responses to the workflow',
            defaultVersion: 2.3,
        };
        const nodeVersions = {
            1: new FormTriggerV1_node_1.FormTriggerV1(baseDescription),
            2: new FormTriggerV2_node_1.FormTriggerV2(baseDescription),
            2.1: new FormTriggerV2_node_1.FormTriggerV2(baseDescription),
            2.2: new FormTriggerV2_node_1.FormTriggerV2(baseDescription),
            2.3: new FormTriggerV2_node_1.FormTriggerV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.FormTrigger = FormTrigger;
//# sourceMappingURL=FormTrigger.node.js.map