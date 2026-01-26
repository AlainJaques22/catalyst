"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchReports = searchReports;
exports.searchJobs = searchJobs;
exports.searchUsers = searchUsers;
const transport_1 = require("../transport");
async function searchReports(filter) {
    const qs = {};
    if (filter) {
        qs.search = filter;
    }
    const endpoint = '/services/saved/searches';
    const response = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint, undefined, qs);
    return {
        results: response.map((entry) => {
            return {
                name: entry.name,
                value: entry.id,
                url: entry.entryUrl,
            };
        }),
    };
}
async function searchJobs(filter) {
    const qs = {};
    if (filter) {
        qs.search = filter;
    }
    const endpoint = '/services/search/jobs';
    const response = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint, undefined, qs);
    return {
        results: response.map((entry) => {
            return {
                name: entry.name.replace(/^\|\s*/, ''),
                value: entry.id,
                url: entry.entryUrl,
            };
        }),
    };
}
async function searchUsers(filter) {
    const qs = {};
    if (filter) {
        qs.search = filter;
    }
    const endpoint = '/services/authentication/users';
    const response = await transport_1.splunkApiJsonRequest.call(this, 'GET', endpoint, undefined, qs);
    return {
        results: response.map((entry) => {
            return {
                name: entry.name,
                value: entry.id,
                url: entry.entryUrl,
            };
        }),
    };
}
//# sourceMappingURL=listSearch.js.map