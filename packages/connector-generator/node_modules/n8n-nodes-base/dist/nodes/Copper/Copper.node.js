"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copper = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class Copper {
    description = {
        displayName: 'Copper',
        name: 'copper',
        icon: 'file:copper.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume the Copper API',
        defaults: {
            name: 'Copper',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'copperApi',
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
                        name: 'Company',
                        value: 'company',
                    },
                    {
                        name: 'Customer Source',
                        value: 'customerSource',
                    },
                    {
                        name: 'Lead',
                        value: 'lead',
                    },
                    {
                        name: 'Opportunity',
                        value: 'opportunity',
                    },
                    {
                        name: 'Person',
                        value: 'person',
                    },
                    {
                        name: 'Project',
                        value: 'project',
                    },
                    {
                        name: 'Task',
                        value: 'task',
                    },
                    {
                        name: 'User',
                        value: 'user',
                    },
                ],
                default: 'company',
            },
            ...descriptions_1.companyOperations,
            ...descriptions_1.companyFields,
            ...descriptions_1.customerSourceOperations,
            ...descriptions_1.customerSourceFields,
            ...descriptions_1.leadOperations,
            ...descriptions_1.leadFields,
            ...descriptions_1.opportunityOperations,
            ...descriptions_1.opportunityFields,
            ...descriptions_1.personOperations,
            ...descriptions_1.personFields,
            ...descriptions_1.projectOperations,
            ...descriptions_1.projectFields,
            ...descriptions_1.taskOperations,
            ...descriptions_1.taskFields,
            ...descriptions_1.userOperations,
            ...descriptions_1.userFields,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'company') {
                    // **********************************************************************
                    //                                company
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             company: create
                        // ----------------------------------------
                        // https://developer.copper.com/companies/create-a-new-company.html
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustCompanyFields)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'POST', '/companies', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             company: delete
                        // ----------------------------------------
                        // https://developer.copper.com/companies/delete-a-company.html
                        const companyId = this.getNodeParameter('companyId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'DELETE', `/companies/${companyId}`);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //               company: get
                        // ----------------------------------------
                        // https://developer.copper.com/companies/fetch-a-company-by-id.html
                        const companyId = this.getNodeParameter('companyId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'GET', `/companies/${companyId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             company: getAll
                        // ----------------------------------------
                        // https://developer.copper.com/companies/list-companies-search.html
                        const body = {};
                        const filterFields = this.getNodeParameter('filterFields', i);
                        if (Object.keys(filterFields).length) {
                            Object.assign(body, filterFields);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'POST', '/companies/search', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             company: update
                        // ----------------------------------------
                        // https://developer.copper.com/companies/update-a-company.html
                        const companyId = this.getNodeParameter('companyId', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustCompanyFields)(updateFields));
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'PUT', `/companies/${companyId}`, body);
                    }
                }
                else if (resource === 'customerSource') {
                    // **********************************************************************
                    //                            customerSource
                    // **********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------------
                        //        customerSource: getAll
                        // ----------------------------------------
                        responseData = await GenericFunctions_1.handleListing.call(this, 'GET', '/customer_sources');
                    }
                }
                else if (resource === 'lead') {
                    // **********************************************************************
                    //                                  lead
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               lead: create
                        // ----------------------------------------
                        // https://developer.copper.com/leads/create-a-new-lead.html
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustLeadFields)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'POST', '/leads', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               lead: delete
                        // ----------------------------------------
                        // https://developer.copper.com/leads/delete-a-lead.html
                        const leadId = this.getNodeParameter('leadId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'DELETE', `/leads/${leadId}`);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                lead: get
                        // ----------------------------------------
                        // https://developer.copper.com/leads/fetch-a-lead-by-id.html
                        const leadId = this.getNodeParameter('leadId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'GET', `/leads/${leadId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               lead: getAll
                        // ----------------------------------------
                        const body = {};
                        const filterFields = this.getNodeParameter('filterFields', i);
                        if (Object.keys(filterFields).length) {
                            Object.assign(body, filterFields);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'POST', '/leads/search', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               lead: update
                        // ----------------------------------------
                        // https://developer.copper.com/leads/update-a-lead.html
                        const leadId = this.getNodeParameter('leadId', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustLeadFields)(updateFields));
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'PUT', `/leads/${leadId}`, body);
                    }
                }
                else if (resource === 'opportunity') {
                    // **********************************************************************
                    //                              opportunity
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //           opportunity: create
                        // ----------------------------------------
                        // https://developer.copper.com/opportunities/create-a-new-opportunity.html
                        const body = {
                            name: this.getNodeParameter('name', i),
                            customer_source_id: this.getNodeParameter('customerSourceId', i),
                            primary_contact_id: this.getNodeParameter('primaryContactId', i),
                        };
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'POST', '/opportunities', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //           opportunity: delete
                        // ----------------------------------------
                        // https://developer.copper.com/opportunities/delete-an-opportunity.html
                        const opportunityId = this.getNodeParameter('opportunityId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'DELETE', `/opportunities/${opportunityId}`);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //             opportunity: get
                        // ----------------------------------------
                        // https://developer.copper.com/opportunities/fetch-an-opportunity-by-id.html
                        const opportunityId = this.getNodeParameter('opportunityId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'GET', `/opportunities/${opportunityId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //           opportunity: getAll
                        // ----------------------------------------
                        // https://developer.copper.com/opportunities/list-opportunities-search.html
                        const body = {};
                        const filterFields = this.getNodeParameter('filterFields', i);
                        if (Object.keys(filterFields).length) {
                            Object.assign(body, filterFields);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'POST', '/opportunities/search', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //           opportunity: update
                        // ----------------------------------------
                        // https://developer.copper.com/opportunities/update-an-opportunity.html
                        const opportunityId = this.getNodeParameter('opportunityId', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'PUT', `/opportunities/${opportunityId}`, body);
                    }
                }
                else if (resource === 'person') {
                    // **********************************************************************
                    //                                 person
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //              person: create
                        // ----------------------------------------
                        // https://developer.copper.com/people/create-a-new-person.html
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustPersonFields)(additionalFields));
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'POST', '/people', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //              person: delete
                        // ----------------------------------------
                        // https://developer.copper.com/people/delete-a-person.html
                        const personId = this.getNodeParameter('personId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'DELETE', `/people/${personId}`);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //               person: get
                        // ----------------------------------------
                        // https://developer.copper.com/people/fetch-a-person-by-id.html
                        const personId = this.getNodeParameter('personId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'GET', `/people/${personId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //              person: getAll
                        // ----------------------------------------
                        const body = {};
                        const filterFields = this.getNodeParameter('filterFields', i);
                        if (Object.keys(filterFields).length) {
                            Object.assign(body, filterFields);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'POST', '/people/search', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //              person: update
                        // ----------------------------------------
                        // https://developer.copper.com/people/update-a-person.html
                        const personId = this.getNodeParameter('personId', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustPersonFields)(updateFields));
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'PUT', `/people/${personId}`, body);
                    }
                }
                else if (resource === 'project') {
                    // **********************************************************************
                    //                                project
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             project: create
                        // ----------------------------------------
                        // https://developer.copper.com/projects/create-a-new-project.html
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'POST', '/projects', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             project: delete
                        // ----------------------------------------
                        // https://developer.copper.com/projects/delete-a-project.html
                        const projectId = this.getNodeParameter('projectId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'DELETE', `/projects/${projectId}`);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //               project: get
                        // ----------------------------------------
                        // https://developer.copper.com/projects/fetch-a-project-by-id.html
                        const projectId = this.getNodeParameter('projectId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'GET', `/projects/${projectId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             project: getAll
                        // ----------------------------------------
                        // https://developer.copper.com/projects/list-projects-search.html
                        const body = {};
                        const filterFields = this.getNodeParameter('filterFields', i);
                        if (Object.keys(filterFields).length) {
                            Object.assign(body, filterFields);
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'POST', '/projects/search', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             project: update
                        // ----------------------------------------
                        // https://developer.copper.com/projects/update-a-project.html
                        const projectId = this.getNodeParameter('projectId', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'PUT', `/projects/${projectId}`, body);
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
                        // https://developer.copper.com/tasks/create-a-new-task.html
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'POST', '/tasks', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               task: delete
                        // ----------------------------------------
                        // https://developer.copper.com/tasks/delete-a-task.html
                        const taskId = this.getNodeParameter('taskId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                task: get
                        // ----------------------------------------
                        // https://developer.copper.com/tasks/fetch-a-task-by-id.html
                        const taskId = this.getNodeParameter('taskId', i);
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'GET', `/tasks/${taskId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               task: getAll
                        // ----------------------------------------
                        // https://developer.copper.com/tasks/list-tasks-search.html
                        const body = {};
                        const filterFields = this.getNodeParameter('filterFields', i);
                        if (Object.keys(filterFields).length) {
                            Object.assign(body, (0, GenericFunctions_1.adjustTaskFields)(filterFields));
                        }
                        responseData = await GenericFunctions_1.handleListing.call(this, 'POST', '/tasks/search', body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               task: update
                        // ----------------------------------------
                        // https://developer.copper.com/tasks/update-a-task.html
                        const taskId = this.getNodeParameter('taskId', i);
                        const body = {};
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.copperApiRequest.call(this, 'PUT', `/tasks/${taskId}`, body);
                    }
                }
                else if (resource === 'user') {
                    // **********************************************************************
                    //                            user
                    // **********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------------
                        //              user: getAll
                        // ----------------------------------------
                        responseData = await GenericFunctions_1.handleListing.call(this, 'POST', '/users/search');
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.toString(), json: {} });
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
exports.Copper = Copper;
//# sourceMappingURL=Copper.node.js.map