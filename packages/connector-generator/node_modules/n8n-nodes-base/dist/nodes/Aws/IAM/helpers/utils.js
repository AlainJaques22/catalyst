"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBodyAsFormUrlEncoded = encodeBodyAsFormUrlEncoded;
exports.findUsersForGroup = findUsersForGroup;
exports.simplifyGetGroupsResponse = simplifyGetGroupsResponse;
exports.simplifyGetAllGroupsResponse = simplifyGetAllGroupsResponse;
exports.simplifyGetAllUsersResponse = simplifyGetAllUsersResponse;
exports.deleteGroupMembers = deleteGroupMembers;
exports.validatePath = validatePath;
exports.validateUserPath = validateUserPath;
exports.validateName = validateName;
exports.validatePermissionsBoundary = validatePermissionsBoundary;
exports.preprocessTags = preprocessTags;
exports.removeUserFromGroups = removeUserFromGroups;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./constants");
const listSearch_1 = require("../methods/listSearch");
const transport_1 = require("../transport");
async function encodeBodyAsFormUrlEncoded(requestOptions) {
    if (requestOptions.body) {
        requestOptions.body = new URLSearchParams(requestOptions.body).toString();
    }
    return requestOptions;
}
async function findUsersForGroup(groupName) {
    const options = {
        method: 'POST',
        url: '',
        body: new URLSearchParams({
            Action: 'GetGroup',
            Version: constants_1.CURRENT_VERSION,
            GroupName: groupName,
        }).toString(),
    };
    const responseData = (await transport_1.awsApiRequest.call(this, options));
    return responseData?.GetGroupResponse?.GetGroupResult?.Users ?? [];
}
async function simplifyGetGroupsResponse(_, response) {
    const includeUsers = this.getNodeParameter('includeUsers', false);
    const responseBody = response.body;
    const groupData = responseBody.GetGroupResponse.GetGroupResult;
    const group = groupData.Group;
    return [
        { json: includeUsers ? { ...group, Users: groupData.Users ?? [] } : group },
    ];
}
async function simplifyGetAllGroupsResponse(items, response) {
    const includeUsers = this.getNodeParameter('includeUsers', false);
    const responseBody = response.body;
    const groups = responseBody.ListGroupsResponse.ListGroupsResult.Groups ?? [];
    if (groups.length === 0) {
        return items;
    }
    if (!includeUsers) {
        return this.helpers.returnJsonArray(groups);
    }
    const processedItems = [];
    for (const group of groups) {
        const users = await findUsersForGroup.call(this, group.GroupName);
        processedItems.push({ ...group, Users: users });
    }
    return this.helpers.returnJsonArray(processedItems);
}
async function simplifyGetAllUsersResponse(_items, response) {
    if (!response.body) {
        return [];
    }
    const responseBody = response.body;
    const users = responseBody?.ListUsersResponse?.ListUsersResult?.Users ?? [];
    return this.helpers.returnJsonArray(users);
}
async function deleteGroupMembers(requestOptions) {
    const groupName = this.getNodeParameter('group', undefined, { extractValue: true });
    const users = await findUsersForGroup.call(this, groupName);
    if (!users.length) {
        return requestOptions;
    }
    await Promise.all(users.map(async (user) => {
        const userName = user.UserName;
        if (!user.UserName) {
            return;
        }
        try {
            await transport_1.awsApiRequest.call(this, {
                method: 'POST',
                url: '',
                body: {
                    Action: 'RemoveUserFromGroup',
                    GroupName: groupName,
                    UserName: userName,
                    Version: constants_1.CURRENT_VERSION,
                },
                ignoreHttpStatusErrors: true,
            });
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                message: `Failed to remove user "${userName}" from "${groupName}"!`,
            });
        }
    }));
    return requestOptions;
}
async function validatePath(requestOptions) {
    const path = this.getNodeParameter('additionalFields.path');
    if (path.length < 1 || path.length > 512) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The "Path" parameter must be between 1 and 512 characters long.');
    }
    const validPathRegex = /^\/[\u0021-\u007E]*\/$/;
    if (!validPathRegex.test(path) && path !== '/') {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Ensure the path is structured correctly, e.g. /division_abc/subdivision_xyz/');
    }
    return requestOptions;
}
async function validateUserPath(requestOptions) {
    const prefix = this.getNodeParameter('additionalFields.pathPrefix');
    let formattedPrefix = prefix;
    if (!formattedPrefix.startsWith('/')) {
        formattedPrefix = '/' + formattedPrefix;
    }
    if (!formattedPrefix.endsWith('/') && formattedPrefix !== '/') {
        formattedPrefix = formattedPrefix + '/';
    }
    if (requestOptions.body && typeof requestOptions.body === 'object') {
        Object.assign(requestOptions.body, { PathPrefix: formattedPrefix });
    }
    const options = {
        method: 'POST',
        url: '',
        body: {
            Action: 'ListUsers',
            Version: constants_1.CURRENT_VERSION,
        },
    };
    const responseData = (await transport_1.awsApiRequest.call(this, options));
    const users = responseData.ListUsersResponse.ListUsersResult.Users;
    if (!users || users.length === 0) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No users found. Please adjust the "Path" parameter and try again.');
    }
    const userPaths = users.map((user) => user.Path).filter(Boolean);
    const isPathValid = userPaths.some((path) => path?.startsWith(formattedPrefix));
    if (!isPathValid) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The "${formattedPrefix}" path was not found in your users. Try entering a different path.`);
    }
    return requestOptions;
}
async function validateName(requestOptions) {
    const resource = this.getNodeParameter('resource');
    const nameParam = resource === 'user' ? 'userName' : 'groupName';
    const name = this.getNodeParameter(nameParam);
    const maxLength = resource === 'user' ? 64 : 128;
    const capitalizedResource = resource.replace(/^./, (c) => c.toUpperCase());
    const validNamePattern = /^[a-zA-Z0-9-_]+$/;
    const isInvalid = !validNamePattern.test(name) || name.length > maxLength;
    if (/\s/.test(name)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `${capitalizedResource} name should not contain spaces.`);
    }
    if (isInvalid) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `${capitalizedResource} name can have up to ${maxLength} characters. Valid characters: letters, numbers, hyphens (-), and underscores (_).`);
    }
    return requestOptions;
}
async function validatePermissionsBoundary(requestOptions) {
    const permissionsBoundary = this.getNodeParameter('additionalFields.permissionsBoundary');
    if (permissionsBoundary) {
        const arnPattern = /^arn:aws:iam::\d{12}:policy\/[\w\-+\/=._]+$/;
        if (!arnPattern.test(permissionsBoundary)) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Permissions boundaries must be provided in ARN format (e.g. arn:aws:iam::123456789012:policy/ExampleBoundaryPolicy). These can be found at the top of the permissions boundary detail page in the IAM dashboard.');
        }
        if (requestOptions.body) {
            Object.assign(requestOptions.body, { PermissionsBoundary: permissionsBoundary });
        }
        else {
            requestOptions.body = {
                PermissionsBoundary: permissionsBoundary,
            };
        }
    }
    return requestOptions;
}
async function preprocessTags(requestOptions) {
    const tagsData = this.getNodeParameter('additionalFields.tags');
    const tags = tagsData?.tags || [];
    let bodyObj = {};
    if (typeof requestOptions.body === 'string') {
        const params = new URLSearchParams(requestOptions.body);
        bodyObj = Object.fromEntries(params.entries());
    }
    tags.forEach((tag, index) => {
        if (!tag.key || !tag.value) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Tag at position ${index + 1} is missing '${!tag.key ? 'Key' : 'Value'}'. Both 'Key' and 'Value' are required.`);
        }
        bodyObj[`Tags.member.${index + 1}.Key`] = tag.key;
        bodyObj[`Tags.member.${index + 1}.Value`] = tag.value;
    });
    requestOptions.body = new URLSearchParams(bodyObj).toString();
    return requestOptions;
}
async function removeUserFromGroups(requestOptions) {
    const userName = this.getNodeParameter('user', undefined, { extractValue: true });
    const userGroups = await listSearch_1.searchGroupsForUser.call(this);
    for (const group of userGroups.results) {
        await transport_1.awsApiRequest.call(this, {
            method: 'POST',
            url: '',
            body: {
                Action: 'RemoveUserFromGroup',
                Version: constants_1.CURRENT_VERSION,
                GroupName: group.value,
                UserName: userName,
            },
        });
    }
    return requestOptions;
}
//# sourceMappingURL=utils.js.map