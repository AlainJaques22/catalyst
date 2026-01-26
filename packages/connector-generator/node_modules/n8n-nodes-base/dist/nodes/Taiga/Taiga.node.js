"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Taiga = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class Taiga {
    description = {
        displayName: 'Taiga',
        name: 'taiga',
        icon: 'file:taiga.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Taiga API',
        defaults: {
            name: 'Taiga',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'taigaApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Epic',
                        value: 'epic',
                    },
                    {
                        name: 'Issue',
                        value: 'issue',
                    },
                    {
                        name: 'Task',
                        value: 'task',
                    },
                    {
                        name: 'User Story',
                        value: 'userStory',
                    },
                ],
                default: 'issue',
            },
            ...descriptions_1.epicOperations,
            ...descriptions_1.epicFields,
            ...descriptions_1.issueOperations,
            ...descriptions_1.issueFields,
            ...descriptions_1.taskOperations,
            ...descriptions_1.taskFields,
            ...descriptions_1.userStoryOperations,
            ...descriptions_1.userStoryFields,
        ],
    };
    methods = {
        loadOptions: {
            async getEpics() {
                const project = this.getCurrentNodeParameter('projectId');
                const epics = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/epics', {}, { project }));
                return epics.map(({ subject, id }) => ({ name: subject, value: id }));
            },
            async getMilestones() {
                const project = this.getCurrentNodeParameter('projectId');
                const milestones = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/milestones', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(milestones);
            },
            async getPriorities() {
                const project = this.getCurrentNodeParameter('projectId');
                const priorities = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/priorities', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(priorities);
            },
            async getProjects() {
                const { id } = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/users/me'));
                const projects = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/projects', {}, { member: id }));
                return (0, GenericFunctions_1.toOptions)(projects);
            },
            async getRoles() {
                const project = this.getCurrentNodeParameter('projectId');
                const roles = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/roles', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(roles);
            },
            async getSeverities() {
                const project = this.getCurrentNodeParameter('projectId');
                const severities = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/severities', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(severities);
            },
            async getTags() {
                const project = this.getCurrentNodeParameter('projectId');
                const tags = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/projects/${project}/tags_colors`));
                return Object.keys(tags).map((tag) => ({ name: tag, value: tag }));
            },
            async getTypes() {
                const project = this.getCurrentNodeParameter('projectId');
                const types = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/issue-types', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(types);
            },
            async getUsers() {
                const project = this.getCurrentNodeParameter('projectId');
                const users = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/users', {}, { project }));
                return users.map(({ full_name_display, id }) => ({ name: full_name_display, value: id }));
            },
            async getUserStories() {
                const project = this.getCurrentNodeParameter('projectId');
                const userStories = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/userstories', {}, { project }));
                return userStories.map(({ subject, id }) => ({ name: subject, value: id }));
            },
            // statuses
            async getIssueStatuses() {
                const project = this.getCurrentNodeParameter('projectId');
                const statuses = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/issue-statuses', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(statuses);
            },
            async getTaskStatuses() {
                const project = this.getCurrentNodeParameter('projectId');
                const statuses = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/task-statuses', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(statuses);
            },
            async getUserStoryStatuses() {
                const project = this.getCurrentNodeParameter('projectId');
                const statuses = (await GenericFunctions_1.taigaApiRequest.call(this, 'GET', '/userstory-statuses', {}, { project }));
                return (0, GenericFunctions_1.toOptions)(statuses);
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'epic') {
                    // **********************************************************************
                    //                                  epic
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               epic: create
                        // ----------------------------------------
                        const body = {
                            project: this.getNodeParameter('projectId', i),
                            subject: this.getNodeParameter('subject', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/epics', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               epic: delete
                        // ----------------------------------------
                        const epicId = this.getNodeParameter('epicId', i);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', `/epics/${epicId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                epic: get
                        // ----------------------------------------
                        const epicId = this.getNodeParameter('epicId', i);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/epics/${epicId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               epic: getAll
                        // ----------------------------------------
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        if (Object.keys(filters).length) {
                            Object.assign(qs, filters);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/epics', {}, qs, i);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               epic: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const epicId = this.getNodeParameter('epicId', i);
                        body.version = await GenericFunctions_1.getVersionForUpdate.call(this, `/epics/${epicId}`);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/epics/${epicId}`, body);
                    }
                }
                else if (resource === 'issue') {
                    // **********************************************************************
                    //                                 issue
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //              issue: create
                        // ----------------------------------------
                        const body = {
                            project: this.getNodeParameter('projectId', i),
                            subject: this.getNodeParameter('subject', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/issues', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //              issue: delete
                        // ----------------------------------------
                        const issueId = this.getNodeParameter('issueId', i);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', `/issues/${issueId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                issue: get
                        // ----------------------------------------
                        const issueId = this.getNodeParameter('issueId', i);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/issues/${issueId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //              issue: getAll
                        // ----------------------------------------
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        if (Object.keys(filters).length) {
                            Object.assign(qs, filters);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/issues', {}, qs, i);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //              issue: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const issueId = this.getNodeParameter('issueId', i);
                        body.version = await GenericFunctions_1.getVersionForUpdate.call(this, `/issues/${issueId}`);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/issues/${issueId}`, body);
                    }
                }
                else if (resource === 'task') {
                    // **********************************************************************
                    //                                  task
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               task: create
                        // ----------------------------------------
                        const body = {
                            project: this.getNodeParameter('projectId', i),
                            subject: this.getNodeParameter('subject', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/tasks', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               task: delete
                        // ----------------------------------------
                        const taskId = this.getNodeParameter('taskId', i);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                task: get
                        // ----------------------------------------
                        const taskId = this.getNodeParameter('taskId', i);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'GET', `/tasks/${taskId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               task: getAll
                        // ----------------------------------------
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        if (Object.keys(filters).length) {
                            Object.assign(qs, filters);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/tasks', {}, qs, i);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               task: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const taskId = this.getNodeParameter('taskId', i);
                        body.version = await GenericFunctions_1.getVersionForUpdate.call(this, `/tasks/${taskId}`);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/tasks/${taskId}`, body);
                    }
                }
                else if (resource === 'userStory') {
                    // **********************************************************************
                    //                               userStory
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //            userStory: create
                        // ----------------------------------------
                        const body = {
                            project: this.getNodeParameter('projectId', i),
                            subject: this.getNodeParameter('subject', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'POST', '/userstories', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //            userStory: delete
                        // ----------------------------------------
                        const userStoryId = this.getNodeParameter('userStoryId', i);
                        const endpoint = `/userstories/${userStoryId}`;
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //              userStory: get
                        // ----------------------------------------
                        const userStoryId = this.getNodeParameter('userStoryId', i);
                        const endpoint = `/userstories/${userStoryId}`;
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //            userStory: getAll
                        // ----------------------------------------
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        if (Object.keys(filters).length) {
                            Object.assign(qs, filters);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/userstories', {}, qs, i);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //            userStory: update
                        // ----------------------------------------
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        else {
                            GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                        }
                        const userStoryId = this.getNodeParameter('userStoryId', i);
                        body.version = await GenericFunctions_1.getVersionForUpdate.call(this, `/userstories/${userStoryId}`);
                        responseData = await GenericFunctions_1.taigaApiRequest.call(this, 'PATCH', `/userstories/${userStoryId}`, body);
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.Taiga = Taiga;
//# sourceMappingURL=Taiga.node.js.map