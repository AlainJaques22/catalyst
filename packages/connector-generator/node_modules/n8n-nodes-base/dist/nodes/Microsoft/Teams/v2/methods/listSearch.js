"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = getChats;
exports.getTeams = getTeams;
exports.getChannels = getChannels;
exports.getGroups = getGroups;
exports.getPlans = getPlans;
exports.getBuckets = getBuckets;
exports.getMembers = getMembers;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function getChats(filter) {
    const returnData = [];
    const qs = {
        $expand: 'members',
    };
    let value = [];
    let attempts = 5;
    do {
        try {
            value = (await transport_1.microsoftApiRequest.call(this, 'GET', '/v1.0/chats', {}, qs))
                .value;
            break;
        }
        catch (error) {
            if (attempts > 0) {
                await (0, n8n_workflow_1.sleep)(1000);
                attempts--;
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
            }
        }
    } while (attempts > 0);
    for (const chat of value) {
        if (!chat.topic) {
            chat.topic = chat.members
                .filter((member) => member.displayName)
                .map((member) => member.displayName)
                .join(', ');
        }
        const chatName = `${chat.topic || '(no title) - ' + chat.id} (${chat.chatType})`;
        const chatId = chat.id;
        const url = chat.webUrl;
        returnData.push({
            name: chatName,
            value: chatId,
            url,
        });
    }
    const results = returnData
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
    return { results };
}
async function getTeams(filter) {
    const returnData = [];
    const { value } = await transport_1.microsoftApiRequest.call(this, 'GET', '/v1.0/me/joinedTeams');
    for (const team of value) {
        const teamName = team.displayName;
        const teamId = team.id;
        // let channelId: string = '';
        // try {
        // 	const channels = await microsoftApiRequestAllItems.call(
        // 		this,
        // 		'value',
        // 		'GET',
        // 		`/v1.0/teams/${teamId}/channels`,
        // 		{},
        // 	);
        // 	if (channels.length > 0) {
        // 		channelId = channels.find((channel: IDataObject) => channel.displayName === 'General').id;
        // 		if (!channelId) {
        // 			channelId = channels[0].id;
        // 		}
        // 	}
        // } catch (error) {}
        returnData.push({
            name: teamName,
            value: teamId,
            // url: channelId
            // 	? `https://teams.microsoft.com/l/team/${channelId}/conversations?groupId=${teamId}&tenantId=${team.tenantId}`
            // 	: undefined,
        });
    }
    const results = (0, utils_1.filterSortSearchListItems)(returnData, filter);
    return { results };
}
async function getChannels(filter) {
    const returnData = [];
    const teamId = this.getCurrentNodeParameter('teamId', { extractValue: true });
    const operation = this.getNodeParameter('operation', 0);
    const resource = this.getNodeParameter('resource', 0);
    const excludeGeneralChannel = ['deleteChannel'];
    if (resource === 'channel')
        excludeGeneralChannel.push('update');
    const { value } = await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/teams/${teamId}/channels`);
    for (const channel of value) {
        if (channel.displayName === 'General' && excludeGeneralChannel.includes(operation)) {
            continue;
        }
        const channelName = channel.displayName;
        const channelId = channel.id;
        const url = channel.webUrl;
        returnData.push({
            name: channelName,
            value: channelId,
            url,
        });
    }
    const results = (0, utils_1.filterSortSearchListItems)(returnData, filter);
    return { results };
}
async function getGroups(filter) {
    const returnData = [];
    // const groupSource = this.getCurrentNodeParameter('groupSource') as string;
    const requestUrl = '/v1.0/groups';
    // if (groupSource === 'mine') {
    // 	requestUrl = '/v1.0/me/transitiveMemberOf';
    // }
    const { value } = await transport_1.microsoftApiRequest.call(this, 'GET', requestUrl);
    for (const group of value) {
        if (group.displayName === 'All Company')
            continue;
        const name = group.displayName || group.mail;
        if (name === undefined)
            continue;
        returnData.push({
            name,
            value: group.id,
        });
    }
    const results = (0, utils_1.filterSortSearchListItems)(returnData, filter);
    return { results };
}
async function getPlans(filter) {
    const returnData = [];
    let groupId = '';
    try {
        groupId = this.getCurrentNodeParameter('groupId', { extractValue: true });
    }
    catch (error) { }
    const operation = this.getNodeParameter('operation', 0);
    if (operation === 'update' && !groupId) {
        groupId = this.getCurrentNodeParameter('updateFields.groupId', {
            extractValue: true,
        });
    }
    const { value } = await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/groups/${groupId}/planner/plans`);
    for (const plan of value) {
        returnData.push({
            name: plan.title,
            value: plan.id,
        });
    }
    const results = (0, utils_1.filterSortSearchListItems)(returnData, filter);
    return { results };
}
async function getBuckets(filter) {
    const returnData = [];
    let planId = '';
    try {
        planId = this.getCurrentNodeParameter('planId', { extractValue: true });
    }
    catch (error) { }
    const operation = this.getNodeParameter('operation', 0);
    if (operation === 'update' && !planId) {
        planId = this.getCurrentNodeParameter('updateFields.planId', {
            extractValue: true,
        });
    }
    const { value } = await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/planner/plans/${planId}/buckets`);
    for (const bucket of value) {
        returnData.push({
            name: bucket.name,
            value: bucket.id,
        });
    }
    const results = (0, utils_1.filterSortSearchListItems)(returnData, filter);
    return { results };
}
async function getMembers(filter) {
    const returnData = [];
    let groupId = '';
    try {
        groupId = this.getCurrentNodeParameter('groupId', { extractValue: true });
    }
    catch (error) { }
    const operation = this.getNodeParameter('operation', 0);
    if (operation === 'update' && !groupId) {
        groupId = this.getCurrentNodeParameter('updateFields.groupId', {
            extractValue: true,
        });
    }
    const { value } = await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/groups/${groupId}/members`);
    for (const member of value) {
        returnData.push({
            name: member.displayName,
            value: member.id,
        });
    }
    const results = (0, utils_1.filterSortSearchListItems)(returnData, filter);
    return { results };
}
//# sourceMappingURL=listSearch.js.map