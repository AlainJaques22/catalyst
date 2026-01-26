"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.teamRLC, descriptions_1.channelRLC];
const displayOptions = {
    show: {
        resource: ['channel'],
        operation: ['get'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/channel-get?view=graph-rest-beta&tabs=http
    try {
        const teamId = this.getNodeParameter('teamId', i, '', { extractValue: true });
        const channelId = this.getNodeParameter('channelId', i, '', { extractValue: true });
        return await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/teams/${teamId}/channels/${channelId}`);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), "The channel you are trying to get doesn't exist", {
            description: "Check that the 'Channel' parameter is correctly set",
        });
    }
}
//# sourceMappingURL=get.operation.js.map