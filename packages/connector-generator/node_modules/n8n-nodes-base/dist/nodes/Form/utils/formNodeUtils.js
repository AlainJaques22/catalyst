"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderFormNode = void 0;
exports.getFormTriggerNode = getFormTriggerNode;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("./utils");
const renderFormNode = async (context, res, trigger, fields, mode) => {
    const options = context.getNodeParameter('options', {});
    let title = options.formTitle;
    if (!title) {
        title = context.evaluateExpression(`{{ $('${trigger?.name}').params.formTitle }}`);
    }
    let buttonLabel = options.buttonLabel;
    if (!buttonLabel) {
        buttonLabel =
            context.evaluateExpression(`{{ $('${trigger?.name}').params.options?.buttonLabel }}`) || 'Submit';
    }
    const appendAttribution = context.evaluateExpression(`{{ $('${trigger?.name}').params.options?.appendAttribution === false ? false : true }}`);
    (0, utils_1.renderForm)({
        context,
        res,
        formTitle: title,
        formDescription: options.formDescription,
        formFields: fields,
        responseMode: 'responseNode',
        mode,
        redirectUrl: undefined,
        appendAttribution,
        buttonLabel,
        customCss: options.customCss,
    });
    return {
        noWebhookResponse: true,
    };
};
exports.renderFormNode = renderFormNode;
/**
 * Retrieves the active Form Trigger node from the workflow's parent nodes.
 *
 * This function searches through the parent nodes to find Form Trigger nodes,
 * then determines which one has been executed.
 *
 * @returns The NodeTypeAndVersion object representing the active Form Trigger node
 * @throws {NodeOperationError} When no Form Trigger node is found in parent nodes
 * @throws {NodeOperationError} When Form Trigger node exists but was not executed
 */
function getFormTriggerNode(context) {
    const parentNodes = context.getParentNodes(context.getNode().name);
    const formTriggers = parentNodes.filter((node) => node.type === n8n_workflow_1.FORM_TRIGGER_NODE_TYPE);
    if (!formTriggers.length) {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Form Trigger node must be set before this node');
    }
    for (const trigger of formTriggers) {
        try {
            context.evaluateExpression(`{{ $('${trigger.name}').first() }}`);
        }
        catch (error) {
            continue;
        }
        return trigger;
    }
    throw new n8n_workflow_1.NodeOperationError(context.getNode(), 'Form Trigger node was not executed');
}
//# sourceMappingURL=formNodeUtils.js.map