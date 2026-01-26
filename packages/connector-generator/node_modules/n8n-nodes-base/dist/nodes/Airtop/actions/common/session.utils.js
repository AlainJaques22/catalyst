"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeRequestWithSessionManagement = executeRequestWithSessionManagement;
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
/**
 * Execute the node operation. Creates and terminates a new session if needed.
 * @param this - The execution context
 * @param index - The index of the node
 * @param request - The request to execute
 * @returns The response from the request
 */
async function executeRequestWithSessionManagement(index, request) {
    let airtopSessionId = '';
    try {
        const { sessionId, windowId } = GenericFunctions_1.shouldCreateNewSession.call(this, index)
            ? await GenericFunctions_1.createSessionAndWindow.call(this, index)
            : GenericFunctions_1.validateSessionAndWindowId.call(this, index);
        airtopSessionId = sessionId;
        const shouldTerminateSession = this.getNodeParameter('autoTerminateSession', index, false);
        const endpoint = request.path.replace('{sessionId}', sessionId).replace('{windowId}', windowId);
        const response = await transport_1.apiRequest.call(this, request.method, endpoint, request.body);
        (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
        if (shouldTerminateSession) {
            await transport_1.apiRequest.call(this, 'DELETE', `/sessions/${sessionId}`);
            this.logger.info(`[${this.getNode().name}] Session terminated.`);
            return response;
        }
        return { sessionId, windowId, ...response };
    }
    catch (error) {
        // terminate session on error
        if (airtopSessionId) {
            await transport_1.apiRequest.call(this, 'DELETE', `/sessions/${airtopSessionId}`);
            this.logger.info(`[${this.getNode().name}] Session terminated.`);
        }
        throw error;
    }
}
//# sourceMappingURL=session.utils.js.map