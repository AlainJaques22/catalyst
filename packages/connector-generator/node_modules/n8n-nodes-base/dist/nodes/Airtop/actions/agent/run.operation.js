"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../../constants");
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
const displayOptions = {
    show: {
        resource: ['agent'],
        operation: ['run'],
    },
};
exports.description = [
    {
        displayName: 'Webhook URL',
        name: 'webhookUrl',
        type: 'string',
        required: true,
        default: '',
        description: 'Webhook URL to invoke the Airtop agent. Visit <a href="https://portal.airtop.ai/agents" target="_blank">Airtop Agents</a> for more information.',
        displayOptions,
    },
    {
        displayName: 'Parameters',
        name: 'agentParameters',
        type: 'json',
        required: true,
        default: '{}',
        description: 'Agent\'s input parameters in JSON format. Visit <a href="https://portal.airtop.ai/agents" target="_blank">Airtop Agents</a> for more information.',
        displayOptions,
    },
    {
        displayName: 'Await Agent',
        name: 'awaitExecution',
        type: 'boolean',
        default: true,
        description: 'Whether to wait for the agent to complete its execution',
        displayOptions,
    },
    {
        displayName: 'Timeout',
        name: 'timeout',
        type: 'number',
        default: 600,
        description: 'Timeout in seconds to wait for the agent to finish',
        displayOptions: {
            show: {
                resource: ['agent'],
                operation: ['run'],
                awaitExecution: [true],
            },
        },
    },
];
function throwOperationErrorIf(statement, message, node) {
    if (statement) {
        throw new n8n_workflow_1.NodeOperationError(node, message);
    }
}
/**
 * Extracts the agent ID from the webhook URL
 * Format: https://api.airtop.ai/api/hooks/agents/<agentId>/webhooks/...
 */
function extractAgentId(webhookUrl, node) {
    const match = webhookUrl.match(/\/agents\/([^/]+)\//);
    throwOperationErrorIf(!match?.[1], constants_1.ERROR_MESSAGES.AGENT_INVALID_WEBHOOK_URL, node);
    return match?.[1] ?? '';
}
async function getAgentStatus(agentId, invocationId) {
    const resultUrl = `https://api.airtop.ai/api/hooks/agents/${agentId}/invocations/${invocationId}/result`;
    const response = await transport_1.apiRequest.call(this, 'GET', resultUrl);
    return response;
}
/**
 * Polls the agent execution status until it completes or fails
 */
async function pollAgentStatus(agentId, invocationId, timeoutSeconds) {
    const airtopNode = this.getNode();
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1000;
    let response;
    this.logger.info(`[${airtopNode.name}] Polling agent status for invocationId: ${invocationId}`);
    while (!response?.output && !response?.error) {
        const elapsed = Date.now() - startTime;
        throwOperationErrorIf(elapsed >= timeoutMs, constants_1.ERROR_MESSAGES.TIMEOUT_REACHED, airtopNode);
        response = await getAgentStatus.call(this, agentId, invocationId);
        if (response?.output || response?.error) {
            return response;
        }
        // Wait one second before next poll
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return {
        status: 'Unknown',
        output: {},
    };
}
async function execute(index) {
    const airtopNode = this.getNode();
    const webhookUrl = GenericFunctions_1.validateRequiredStringField.call(this, index, 'webhookUrl', 'Webhook URL');
    const agentParametersJson = GenericFunctions_1.validateRequiredStringField.call(this, index, 'agentParameters', 'Parameters');
    const agentId = extractAgentId(webhookUrl, airtopNode);
    const awaitExecution = this.getNodeParameter('awaitExecution', index, true);
    const timeout = this.getNodeParameter('timeout', index, 600);
    // Validate timeout
    throwOperationErrorIf(timeout < constants_1.AGENT_MIN_TIMEOUT_SECONDS, constants_1.ERROR_MESSAGES.AGENT_TIMEOUT_INVALID, airtopNode);
    const invocationResponse = await transport_1.apiRequest.call(this, 'POST', webhookUrl, (0, n8n_workflow_1.jsonParse)(agentParametersJson));
    const invocationId = invocationResponse.invocationId;
    throwOperationErrorIf(!invocationId, "No 'invocationId' received from agent webhook response", airtopNode);
    if (!awaitExecution) {
        return this.helpers.returnJsonArray({
            invocationId,
        });
    }
    // Poll for agent's execution status
    const result = await pollAgentStatus.call(this, agentId, invocationId, timeout);
    throwOperationErrorIf(Boolean(result?.error), `${result?.error ?? 'Unknown error'}. Agent Invocation ID: ${invocationId}`, airtopNode);
    return this.helpers.returnJsonArray({
        invocationId,
        status: result?.status ?? 'Unknown',
        output: result?.output ?? {},
    });
}
//# sourceMappingURL=run.operation.js.map