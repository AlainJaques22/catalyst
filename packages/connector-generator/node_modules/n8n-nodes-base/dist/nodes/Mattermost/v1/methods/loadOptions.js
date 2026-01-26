"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannels = getChannels;
exports.getChannelsInTeam = getChannelsInTeam;
exports.getTeams = getTeams;
exports.getUsers = getUsers;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
// Get all the available channels
async function getChannels() {
    const endpoint = 'channels';
    const responseData = await transport_1.apiRequestAllItems.call(this, 'GET', endpoint, {});
    if (responseData === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const returnData = [];
    let name;
    for (const data of responseData) {
        if (data.delete_at !== 0 || !data.display_name || !data.name) {
            continue;
        }
        name = `${data.team_display_name} - ${data.display_name || data.name} (${data.type === 'O' ? 'public' : 'private'})`;
        returnData.push({
            name,
            value: data.id,
        });
    }
    returnData.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
// Get all the channels in a team
async function getChannelsInTeam() {
    const teamId = this.getCurrentNodeParameter('teamId');
    const endpoint = `users/me/teams/${teamId}/channels`;
    const responseData = await transport_1.apiRequestAllItems.call(this, 'GET', endpoint, {});
    if (responseData === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const returnData = [];
    let name;
    for (const data of responseData) {
        if (data.delete_at !== 0 || !data.display_name || !data.name) {
            continue;
        }
        const channelTypes = {
            D: 'direct',
            G: 'group',
            O: 'public',
            P: 'private',
        };
        name = `${data.display_name} (${channelTypes[data.type]})`;
        returnData.push({
            name,
            value: data.id,
        });
    }
    returnData.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
async function getTeams() {
    const endpoint = 'users/me/teams';
    const responseData = await transport_1.apiRequestAllItems.call(this, 'GET', endpoint, {});
    if (responseData === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const returnData = [];
    let name;
    for (const data of responseData) {
        if (data.delete_at !== 0) {
            continue;
        }
        name = `${data.display_name} (${data.type === 'O' ? 'public' : 'private'})`;
        returnData.push({
            name,
            value: data.id,
        });
    }
    returnData.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
async function getUsers() {
    const endpoint = 'users';
    const responseData = await transport_1.apiRequestAllItems.call(this, 'GET', endpoint, {});
    if (responseData === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
    }
    const returnData = [];
    for (const data of responseData) {
        if (data.delete_at !== 0) {
            continue;
        }
        returnData.push({
            name: data.username,
            value: data.id,
        });
    }
    returnData.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
//# sourceMappingURL=loadOptions.js.map