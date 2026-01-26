"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const transport_1 = require("../../transport");
const properties = [];
const displayOptions = {
    show: {
        resource: ['alert'],
        operation: ['getReport'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(_i) {
    // https://docs.splunk.com/Documentation/Splunk/latest/RESTREF/RESTsearch#alerts.2Ffired_alerts
    const endpoint = '/services/alerts/fired_alerts';
    const returnData = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint);
    return returnData;
}
//# sourceMappingURL=getReport.operation.js.map