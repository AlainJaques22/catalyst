"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allEvents = void 0;
exports.jiraSoftwareCloudApiRequest = jiraSoftwareCloudApiRequest;
exports.handlePagination = handlePagination;
exports.jiraSoftwareCloudApiRequestAllItems = jiraSoftwareCloudApiRequestAllItems;
exports.validateJSON = validateJSON;
exports.eventExists = eventExists;
exports.getWebhookId = getWebhookId;
exports.simplifyIssueOutput = simplifyIssueOutput;
exports.filterSortSearchListItems = filterSortSearchListItems;
exports.getUsers = getUsers;
exports.getServerInfo = getServerInfo;
exports.getWebhookEndpoint = getWebhookEndpoint;
const n8n_workflow_1 = require("n8n-workflow");
async function jiraSoftwareCloudApiRequest(endpoint, method, body = {}, query, uri, option = {}) {
    const jiraVersion = this.getNodeParameter('jiraVersion', 0);
    let domain = '';
    let credentialType;
    if (jiraVersion === 'server') {
        domain = (await this.getCredentials('jiraSoftwareServerApi')).domain;
        credentialType = 'jiraSoftwareServerApi';
    }
    else if (jiraVersion === 'serverPat') {
        domain = (await this.getCredentials('jiraSoftwareServerPatApi')).domain;
        credentialType = 'jiraSoftwareServerPatApi';
    }
    else {
        domain = (await this.getCredentials('jiraSoftwareCloudApi')).domain;
        credentialType = 'jiraSoftwareCloudApi';
    }
    const options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Atlassian-Token': 'no-check',
        },
        method,
        qs: query,
        uri: uri || `${domain}/rest${endpoint}`,
        body,
        json: true,
    };
    if (Object.keys(option).length !== 0) {
        Object.assign(options, option);
    }
    if (Object.keys(body).length === 0) {
        delete options.body;
    }
    if (Object.keys(query || {}).length === 0) {
        delete options.qs;
    }
    try {
        return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
    }
    catch (error) {
        if (error.description?.includes?.("Field 'priority' cannot be set")) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: "Field 'priority' cannot be set. You need to add the Priority field to your Jira Project's Issue Types.",
            });
        }
        throw error;
    }
}
function handlePagination(method, body, query, paginationType, responseData) {
    if (!responseData) {
        if (paginationType === 'offset') {
            if (method === 'GET') {
                // Example: https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-get
                query.startAt = 0;
                query.maxResults = 100;
            }
            else {
                // Example: https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-post
                body.startAt = 0;
                body.maxResults = 100;
            }
        }
        else {
            if (method === 'GET') {
                // Example: https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-jql-get
                query.maxResults = 100;
            }
            else {
                // Example: https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-jql-post
                body.maxResults = 100;
            }
        }
        return true;
    }
    if (paginationType === 'offset') {
        const nextStartAt = responseData.startAt + responseData.maxResults;
        if (method === 'GET') {
            query.startAt = nextStartAt;
        }
        else {
            body.startAt = nextStartAt;
        }
        return nextStartAt < responseData.total;
    }
    else {
        if (method === 'GET') {
            query.nextPageToken = responseData.nextPageToken;
        }
        else {
            body.nextPageToken = responseData.nextPageToken;
        }
        return !!responseData.nextPageToken;
    }
}
async function jiraSoftwareCloudApiRequestAllItems(propertyName, endpoint, method, body = {}, query = {}, paginationType = 'offset') {
    const returnData = [];
    let responseData;
    let hasNextPage = handlePagination(method, body, query, paginationType);
    do {
        responseData = await jiraSoftwareCloudApiRequest.call(this, endpoint, method, body, query);
        returnData.push.apply(returnData, responseData[propertyName]);
        hasNextPage = handlePagination(method, body, query, paginationType, responseData);
    } while (hasNextPage);
    return returnData;
}
function validateJSON(json) {
    let result;
    try {
        result = JSON.parse(json);
    }
    catch (exception) {
        result = '';
    }
    return result;
}
function eventExists(currentEvents, webhookEvents) {
    for (const currentEvent of currentEvents) {
        if (!webhookEvents.includes(currentEvent)) {
            return false;
        }
    }
    return true;
}
function getWebhookId(webhook) {
    if (webhook.id)
        return webhook.id.toString();
    return webhook.self?.split('/').pop();
}
function simplifyIssueOutput(responseData) {
    const mappedFields = {
        id: responseData.id,
        key: responseData.key,
        self: responseData.self,
    };
    // Sort custom fields last so we map them last
    const customField = /^customfield_\d+$/;
    const sortedFields = Object.keys(responseData.fields).sort((a, b) => {
        if (customField.test(a) && customField.test(b)) {
            return a > b ? 1 : -1;
        }
        if (customField.test(a)) {
            return 1;
        }
        if (customField.test(b)) {
            return -1;
        }
        return a > b ? 1 : -1;
    });
    for (const field of sortedFields) {
        if (responseData.names[field] in mappedFields) {
            let newField = responseData.names[field];
            let counter = 0;
            while (newField in mappedFields) {
                counter++;
                newField = `${responseData.names[field]}_${counter}`;
            }
            mappedFields[newField] = responseData.fields[field];
        }
        else {
            mappedFields[responseData.names[field] || field] = responseData.fields[field];
        }
    }
    return mappedFields;
}
exports.allEvents = [
    'board_created',
    'board_updated',
    'board_deleted',
    'board_configuration_changed',
    'comment_created',
    'comment_updated',
    'comment_deleted',
    'jira:issue_created',
    'jira:issue_updated',
    'jira:issue_deleted',
    'option_voting_changed',
    'option_watching_changed',
    'option_unassigned_issues_changed',
    'option_subtasks_changed',
    'option_attachments_changed',
    'option_issuelinks_changed',
    'option_timetracking_changed',
    'project_created',
    'project_updated',
    'project_deleted',
    'sprint_created',
    'sprint_deleted',
    'sprint_updated',
    'sprint_started',
    'sprint_closed',
    'user_created',
    'user_updated',
    'user_deleted',
    'jira:version_released',
    'jira:version_unreleased',
    'jira:version_created',
    'jira:version_moved',
    'jira:version_updated',
    'jira:version_deleted',
    'issuelink_created',
    'issuelink_deleted',
    'worklog_created',
    'worklog_updated',
    'worklog_deleted',
];
function filterSortSearchListItems(items, filter) {
    return items
        .filter((item) => !filter ||
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.value.toString().toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
            return -1;
        }
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
            return 1;
        }
        return 0;
    });
}
async function getUsers() {
    const jiraVersion = this.getCurrentNodeParameter('jiraVersion');
    const maxResults = 1000;
    const query = { maxResults };
    let endpoint = '/api/2/users/search';
    if (jiraVersion === 'server' || jiraVersion === 'serverPat') {
        endpoint = '/api/2/user/search';
        query.username = "'";
    }
    const users = [];
    let hasNextPage;
    do {
        const usersPage = (await jiraSoftwareCloudApiRequest.call(this, endpoint, 'GET', {}, { ...query, startAt: users.length }));
        users.push(...usersPage);
        hasNextPage = usersPage.length === maxResults;
    } while (hasNextPage);
    return users
        .filter((user) => user.active)
        .map((user) => ({
        name: user.displayName,
        value: (user.accountId ?? user.name),
    }))
        .sort((a, b) => {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    });
}
async function getServerInfo() {
    return await jiraSoftwareCloudApiRequest.call(this, '/api/2/serverInfo', 'GET');
}
async function getWebhookEndpoint() {
    const serverInfo = await getServerInfo.call(this).catch(() => null);
    if (!serverInfo || serverInfo.deploymentType === 'Cloud')
        return '/webhooks/1.0/webhook';
    // Assume old version when versionNumbers is not set
    const majorVersion = serverInfo.versionNumbers?.[0] ?? 1;
    return majorVersion >= 10 ? '/jira-webhook/1.0/webhooks' : '/webhooks/1.0/webhook';
}
//# sourceMappingURL=GenericFunctions.js.map