"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.searchJobRLC];
const displayOptions = {
    show: {
        resource: ['search'],
        operation: ['deleteJob'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTsearch#search.2Fjobs.2F.7Bsearch_id.7D
    const searchJobId = this.getNodeParameter('searchJobId', i, '', { extractValue: true });
    const endpoint = `/services/search/jobs/${searchJobId}`;
    await transport_1.splunkApiRequest.call(this, 'DELETE', endpoint);
    return { success: true };
}
//# sourceMappingURL=deleteJob.operation.js.map