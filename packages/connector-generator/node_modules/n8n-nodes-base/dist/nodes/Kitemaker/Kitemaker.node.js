"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kitemaker = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
const mutations_1 = require("./mutations");
const queries_1 = require("./queries");
class Kitemaker {
    description = {
        displayName: 'Kitemaker',
        name: 'kitemaker',
        icon: { light: 'file:kitemaker.svg', dark: 'file:kitemaker.dark.svg' },
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
        description: 'Consume the Kitemaker GraphQL API',
        defaults: {
            name: 'Kitemaker',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'kitemakerApi',
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
                        name: 'Organization',
                        value: 'organization',
                    },
                    {
                        name: 'Space',
                        value: 'space',
                    },
                    {
                        name: 'User',
                        value: 'user',
                    },
                    {
                        name: 'Work Item',
                        value: 'workItem',
                    },
                ],
                default: 'workItem',
                required: true,
            },
            ...descriptions_1.organizationOperations,
            ...descriptions_1.spaceOperations,
            ...descriptions_1.spaceFields,
            ...descriptions_1.userOperations,
            ...descriptions_1.userFields,
            ...descriptions_1.workItemOperations,
            ...descriptions_1.workItemFields,
        ],
    };
    methods = {
        loadOptions: {
            async getLabels() {
                const responseData = await GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getLabels });
                const { data: { organization: { spaces }, }, } = responseData;
                return (0, GenericFunctions_1.createLoadOptions)(spaces[0].labels);
            },
            async getSpaces() {
                const responseData = await GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getSpaces });
                const { data: { organization: { spaces }, }, } = responseData;
                return (0, GenericFunctions_1.createLoadOptions)(spaces);
            },
            async getStatuses() {
                const spaceId = this.getNodeParameter('spaceId', 0);
                if (!spaceId.length) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please choose a space to set for the work item to create.');
                }
                const responseData = await GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getStatuses });
                const { data: { organization: { spaces }, }, } = responseData;
                const space = spaces.find((e) => e.id === spaceId);
                return (0, GenericFunctions_1.createLoadOptions)(space.statuses);
            },
            async getUsers() {
                const responseData = await GenericFunctions_1.kitemakerRequest.call(this, { query: queries_1.getUsers });
                const { data: { organization: { users }, }, } = responseData;
                return (0, GenericFunctions_1.createLoadOptions)(users);
            },
            async getWorkItems() {
                const spaceId = this.getNodeParameter('spaceId', 0);
                const responseData = await GenericFunctions_1.kitemakerRequest.call(this, {
                    query: queries_1.getWorkItems,
                    variables: { spaceId },
                });
                const { data: { workItems: { workItems }, }, } = responseData;
                return (0, GenericFunctions_1.createLoadOptions)(workItems);
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        const returnData = [];
        // https://github.com/kitemakerhq/docs/blob/main/kitemaker.graphql
        for (let i = 0; i < items.length; i++) {
            if (resource === 'organization') {
                // *********************************************************************
                //                           organization
                // *********************************************************************
                if (operation === 'get') {
                    // ----------------------------------
                    //         organization: get
                    // ----------------------------------
                    responseData = await GenericFunctions_1.kitemakerRequest.call(this, {
                        query: queries_1.getOrganization,
                    });
                    responseData = responseData.data.organization;
                }
            }
            else if (resource === 'space') {
                // *********************************************************************
                //                             space
                // *********************************************************************
                if (operation === 'getAll') {
                    // ----------------------------------
                    //          space: getAll
                    // ----------------------------------
                    const allItems = await GenericFunctions_1.kitemakerRequestAllItems.call(this, {
                        query: queries_1.getAllSpaces,
                        variables: {},
                    });
                    responseData = allItems;
                }
            }
            else if (resource === 'user') {
                // *********************************************************************
                //                             user
                // *********************************************************************
                if (operation === 'getAll') {
                    // ----------------------------------
                    //          user: getAll
                    // ----------------------------------
                    const allItems = await GenericFunctions_1.kitemakerRequestAllItems.call(this, {
                        query: queries_1.getAllUsers,
                        variables: {},
                    });
                    responseData = allItems;
                }
            }
            else if (resource === 'workItem') {
                // *********************************************************************
                //                             workItem
                // *********************************************************************
                if (operation === 'create') {
                    // ----------------------------------
                    //         workItem: create
                    // ----------------------------------
                    const input = {
                        title: this.getNodeParameter('title', i),
                        statusId: this.getNodeParameter('statusId', i),
                    };
                    if (!input.statusId.length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter a status to set for the work item to create.', { itemIndex: i });
                    }
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    if (Object.keys(additionalFields).length) {
                        Object.assign(input, additionalFields);
                    }
                    responseData = await GenericFunctions_1.kitemakerRequest.call(this, {
                        query: mutations_1.createWorkItem,
                        variables: { input },
                    });
                    responseData = responseData.data.createWorkItem.workItem;
                }
                else if (operation === 'get') {
                    // ----------------------------------
                    //         workItem: get
                    // ----------------------------------
                    const workItemId = this.getNodeParameter('workItemId', i);
                    responseData = await GenericFunctions_1.kitemakerRequest.call(this, {
                        query: queries_1.getWorkItem,
                        variables: { workItemId },
                    });
                    responseData = responseData.data.workItem;
                }
                else if (operation === 'getAll') {
                    // ----------------------------------
                    //         workItem: getAll
                    // ----------------------------------
                    const allItems = await GenericFunctions_1.kitemakerRequestAllItems.call(this, {
                        query: queries_1.getAllWorkItems,
                        variables: {
                            spaceId: this.getNodeParameter('spaceId', i),
                        },
                    });
                    responseData = allItems;
                }
                else if (operation === 'update') {
                    // ----------------------------------
                    //         workItem: update
                    // ----------------------------------
                    const input = {
                        id: this.getNodeParameter('workItemId', i),
                    };
                    const updateFields = this.getNodeParameter('updateFields', i);
                    if (!Object.keys(updateFields).length) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please enter at least one field to update for the work item.', { itemIndex: i });
                    }
                    Object.assign(input, updateFields);
                    responseData = await GenericFunctions_1.kitemakerRequest.call(this, {
                        query: mutations_1.editWorkItem,
                        variables: { input },
                    });
                    responseData = responseData.data.editWorkItem.workItem;
                }
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.Kitemaker = Kitemaker;
//# sourceMappingURL=Kitemaker.node.js.map