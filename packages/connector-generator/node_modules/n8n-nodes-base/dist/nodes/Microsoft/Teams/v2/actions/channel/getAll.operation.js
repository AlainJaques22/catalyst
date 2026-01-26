"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const descriptions_1 = require("../../../../../../utils/descriptions");
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_2 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_2.teamRLC, ...descriptions_1.returnAllOrLimit];
const displayOptions = {
    show: {
        resource: ['channel'],
        operation: ['getAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-beta&tabs=http
    const teamId = this.getNodeParameter('teamId', i, '', { extractValue: true });
    const returnAll = this.getNodeParameter('returnAll', i);
    if (returnAll) {
        return await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/v1.0/teams/${teamId}/channels`);
    }
    else {
        const limit = this.getNodeParameter('limit', i);
        const responseData = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', `/v1.0/teams/${teamId}/channels`, {});
        return responseData.splice(0, limit);
    }
}
//# sourceMappingURL=getAll.operation.js.map