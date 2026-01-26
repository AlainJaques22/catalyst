"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const descriptions_1 = require("../../../../../../utils/descriptions");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_2 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_2.teamRLC, descriptions_2.channelRLC, ...descriptions_1.returnAllOrLimit];
const displayOptions = {
    show: {
        resource: ['channelMessage'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/channel-list-messages?view=graph-rest-beta&tabs=http
    const teamId = this.getNodeParameter('teamId', i, '', { extractValue: true });
    const channelId = this.getNodeParameter('channelId', i, '', { extractValue: true });
    const returnAll = this.getNodeParameter('returnAll', i);
    if (returnAll) {
        return await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/beta/teams/${teamId}/channels/${channelId}/messages`);
    }
    else {
        const limit = this.getNodeParameter('limit', i);
        const responseData = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/beta/teams/${teamId}/channels/${channelId}/messages`, {});
        return responseData.splice(0, limit);
    }
}
//# sourceMappingURL=getAll.operation.js.map