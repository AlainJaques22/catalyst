"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGroups = searchGroups;
exports.searchGroupsForUser = searchGroupsForUser;
exports.searchUsers = searchUsers;
exports.searchUserPools = searchUserPools;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
function formatResults(items, filter) {
    return items
        .map(({ id, name }) => ({
        name: String(name).replace(/ /g, ''),
        value: String(id),
    }))
        .filter(({ name }) => !filter || name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}
async function searchGroups(filter, paginationToken) {
    const userPoolId = this.getNodeParameter('userPool', undefined, {
        extractValue: true,
    });
    if (!userPoolId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'User Pool ID is required to search groups');
    }
    const responseData = (await transport_1.awsApiRequest.call(this, 'POST', 'ListGroups', JSON.stringify({ UserPoolId: userPoolId, Limit: 50, NextToken: paginationToken })));
    const groups = responseData.Groups;
    const groupsMapped = groups.map(({ GroupName }) => ({
        id: GroupName,
        name: GroupName,
    }));
    const formattedResults = formatResults(groupsMapped, filter);
    return { results: formattedResults, paginationToken: responseData.NextToken };
}
async function searchGroupsForUser(filter) {
    const userPoolId = this.getNodeParameter('userPool', undefined, {
        extractValue: true,
    });
    const inputUser = this.getNodeParameter('user', undefined, {
        extractValue: true,
    });
    if (!userPoolId || !inputUser) {
        return { results: [] };
    }
    const userPool = await utils_1.getUserPool.call(this, userPoolId);
    const usernameAttributes = userPool.UsernameAttributes ?? [];
    const isEmailAuth = usernameAttributes.includes('email');
    const isPhoneAuth = usernameAttributes.includes('phone_number');
    const isEmailOrPhone = isEmailAuth || isPhoneAuth;
    const userName = await utils_1.getUserNameFromExistingUsers.call(this, inputUser, userPoolId, isEmailOrPhone);
    if (!userName) {
        return { results: [] };
    }
    const groups = (await transport_1.awsApiRequestAllItems.call(this, 'POST', 'AdminListGroupsForUser', {
        Username: userName,
        UserPoolId: userPoolId,
    }, 'Groups'));
    const resultGroups = groups
        .filter((group) => !filter || group.GroupName.toLowerCase().includes(filter.toLowerCase()))
        .map((group) => ({
        name: group.GroupName,
        value: group.GroupName,
    }))
        .sort((a, b) => a.name.localeCompare(b.name));
    return { results: resultGroups };
}
async function searchUsers(filter, paginationToken) {
    const userPoolId = this.getNodeParameter('userPool', undefined, { extractValue: true });
    if (!userPoolId) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'User Pool ID is required to search users');
    }
    const userPoolData = (await transport_1.awsApiRequest.call(this, 'POST', 'DescribeUserPool', JSON.stringify({ UserPoolId: userPoolId })));
    const userPool = userPoolData.UserPool;
    const usernameAttributes = userPool.UsernameAttributes;
    const responseData = (await transport_1.awsApiRequest.call(this, 'POST', 'ListUsers', JSON.stringify({
        UserPoolId: userPoolId,
        Limit: 50,
        NextToken: paginationToken,
    })));
    const users = responseData.Users;
    if (!users.length) {
        return { results: [] };
    }
    const userResults = users.map((user) => {
        const attributes = user.Attributes ?? [];
        const username = user.Username;
        const email = attributes.find((attr) => attr.Name === 'email')?.Value ?? '';
        const phoneNumber = attributes.find((attr) => attr.Name === 'phone_number')?.Value ?? '';
        const sub = attributes.find((attr) => attr.Name === 'sub')?.Value ?? '';
        const name = usernameAttributes?.includes('email')
            ? email
            : usernameAttributes?.includes('phone_number')
                ? phoneNumber
                : username;
        return { id: sub, name, value: sub };
    });
    return { results: formatResults(userResults, filter), paginationToken: responseData.NextToken };
}
async function searchUserPools(filter, paginationToken) {
    const responseData = (await transport_1.awsApiRequest.call(this, 'POST', 'ListUserPools', JSON.stringify({ Limit: 50, NextToken: paginationToken })));
    const userPools = responseData.UserPools;
    const userPoolsMapped = userPools.map((userPool) => ({
        id: userPool.Id,
        name: userPool.Name,
    }));
    const formattedResults = formatResults(userPoolsMapped, filter);
    return { results: formattedResults, paginationToken: responseData.NextToken };
}
//# sourceMappingURL=listSearch.js.map