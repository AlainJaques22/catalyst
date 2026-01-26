"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.reportRLC];
const displayOptions = {
    show: {
        resource: ['report'],
        operation: ['deleteReport'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#saved.2Fsearches.2F.7Bname.7D
    const reportId = this.getNodeParameter('reportId', i, '', { extractValue: true });
    const endpoint = `/services/saved/searches/${reportId}`;
    await transport_1.splunkApiRequest.call(this, 'DELETE', endpoint);
    return { success: true };
}
//# sourceMappingURL=deleteReport.operation.js.map