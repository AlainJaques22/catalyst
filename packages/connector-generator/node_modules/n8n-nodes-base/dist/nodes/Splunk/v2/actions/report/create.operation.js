"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.searchJobRLC,
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the report',
    },
];
const displayOptions = {
    show: {
        resource: ['report'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const name = this.getNodeParameter('name', i);
    const searchJobId = this.getNodeParameter('searchJobId', i, '', { extractValue: true });
    const endpoint = `/services/search/jobs/${searchJobId}`;
    const searchJob = ((await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint)) ?? [])[0];
    const body = {
        name,
        search: searchJob.search,
        alert_type: 'always',
        'dispatch.earliest_time': searchJob.earliestTime,
        'dispatch.latest_time': searchJob.latestTime,
        is_scheduled: searchJob.isScheduled,
        cron_schedule: searchJob.cronSchedule,
    };
    const returnData = await transport_1.splunkApiRequest
        .call(this, 'POST', '/services/saved/searches', body)
        .then(utils_1.formatFeed);
    return returnData;
}
//# sourceMappingURL=create.operation.js.map