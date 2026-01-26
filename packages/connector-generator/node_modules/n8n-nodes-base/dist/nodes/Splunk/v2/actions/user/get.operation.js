"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.userRLC];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['get'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
    const userId = this.getNodeParameter('userId', i, '', { extractValue: true });
    const endpoint = `/services/authentication/users/${userId}`;
    const returnData = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint);
    return returnData;
}
//# sourceMappingURL=get.operation.js.map