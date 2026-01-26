"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllTeams = fetchAllTeams;
exports.fetchAllChannels = fetchAllChannels;
exports.createSubscription = createSubscription;
exports.getResourcePath = getResourcePath;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
async function fetchAllTeams() {
    const { value: teams } = (await transport_1.microsoftApiRequest.call(this, 'GET', '/v1.0/me/joinedTeams'));
    return teams;
}
async function fetchAllChannels(teamId) {
    const { value: channels } = (await transport_1.microsoftApiRequest.call(this, 'GET', `/v1.0/teams/${teamId}/channels`));
    return channels;
}
async function createSubscription(webhookUrl, resourcePath) {
    const expirationTime = new Date(Date.now() + 4318 * 60 * 1000).toISOString();
    const body = {
        changeType: 'created',
        notificationUrl: webhookUrl,
        resource: resourcePath,
        expirationDateTime: expirationTime,
        latestSupportedTlsVersion: 'v1_2',
        lifecycleNotificationUrl: webhookUrl,
    };
    const response = (await transport_1.microsoftApiRequest.call(this, 'POST', '/v1.0/subscriptions', body));
    return response;
}
async function getResourcePath(event) {
    switch (event) {
        case 'newChat': {
            return '/me/chats';
        }
        case 'newChatMessage': {
            const watchAllChats = this.getNodeParameter('watchAllChats', false, {
                extractValue: true,
            });
            if (watchAllChats) {
                return '/me/chats/getAllMessages';
            }
            else {
                const chatId = this.getNodeParameter('chatId', undefined, { extractValue: true });
                return `/chats/${decodeURIComponent(chatId)}/messages`;
            }
        }
        case 'newChannel': {
            const watchAllTeams = this.getNodeParameter('watchAllTeams', false, {
                extractValue: true,
            });
            if (watchAllTeams) {
                const teams = await fetchAllTeams.call(this);
                return teams.map((team) => `/teams/${team.id}/channels`);
            }
            else {
                const teamId = this.getNodeParameter('teamId', undefined, { extractValue: true });
                return `/teams/${teamId}/channels`;
            }
        }
        case 'newChannelMessage': {
            const watchAllTeams = this.getNodeParameter('watchAllTeams', false, {
                extractValue: true,
            });
            if (watchAllTeams) {
                const teams = await fetchAllTeams.call(this);
                const teamChannels = await Promise.all(teams.map(async (team) => {
                    const channels = await fetchAllChannels.call(this, team.id);
                    return channels.map((channel) => `/teams/${team.id}/channels/${channel.id}/messages`);
                }));
                return teamChannels.flat();
            }
            else {
                const teamId = this.getNodeParameter('teamId', undefined, { extractValue: true });
                const watchAllChannels = this.getNodeParameter('watchAllChannels', false, {
                    extractValue: true,
                });
                if (watchAllChannels) {
                    const channels = await fetchAllChannels.call(this, teamId);
                    return channels.map((channel) => `/teams/${teamId}/channels/${channel.id}/messages`);
                }
                else {
                    const channelId = this.getNodeParameter('channelId', undefined, {
                        extractValue: true,
                    });
                    return `/teams/${teamId}/channels/${decodeURIComponent(channelId)}/messages`;
                }
            }
        }
        case 'newTeamMember': {
            const watchAllTeams = this.getNodeParameter('watchAllTeams', false, {
                extractValue: true,
            });
            if (watchAllTeams) {
                const teams = await fetchAllTeams.call(this);
                return teams.map((team) => `/teams/${team.id}/members`);
            }
            else {
                const teamId = this.getNodeParameter('teamId', undefined, { extractValue: true });
                return `/teams/${teamId}/members`;
            }
        }
        default: {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), {
                message: `Invalid event: ${event}`,
                description: `The selected event "${event}" is not recognized.`,
            });
        }
    }
}
//# sourceMappingURL=utils-trigger.js.map