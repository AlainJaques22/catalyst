"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onfleet = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const AdministratorDescription_1 = require("./descriptions/AdministratorDescription");
const ContainerDescription_1 = require("./descriptions/ContainerDescription");
const DestinationDescription_1 = require("./descriptions/DestinationDescription");
const HubDescription_1 = require("./descriptions/HubDescription");
const OrganizationDescription_1 = require("./descriptions/OrganizationDescription");
const RecipientDescription_1 = require("./descriptions/RecipientDescription");
const TaskDescription_1 = require("./descriptions/TaskDescription");
const TeamDescription_1 = require("./descriptions/TeamDescription");
const WorkerDescription_1 = require("./descriptions/WorkerDescription");
const GenericFunctions_1 = require("./GenericFunctions");
const Onfleet_1 = require("./Onfleet");
class Onfleet {
    description = {
        displayName: 'Onfleet',
        name: 'onfleet',
        icon: 'file:Onfleet.svg',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Onfleet API',
        defaults: {
            name: 'Onfleet',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'onfleetApi',
                required: true,
                testedBy: 'onfleetApiTest',
            },
        ],
        properties: [
            // List of option resources
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Admin',
                        value: 'admin',
                    },
                    {
                        name: 'Container',
                        value: 'container',
                    },
                    {
                        name: 'Destination',
                        value: 'destination',
                    },
                    {
                        name: 'Hub',
                        value: 'hub',
                    },
                    {
                        name: 'Organization',
                        value: 'organization',
                    },
                    {
                        name: 'Recipient',
                        value: 'recipient',
                    },
                    {
                        name: 'Task',
                        value: 'task',
                    },
                    {
                        name: 'Team',
                        value: 'team',
                    },
                    // {
                    // 	name: 'Webhook',
                    // 	value: 'webhook',
                    // },
                    {
                        name: 'Worker',
                        value: 'worker',
                    },
                ],
                default: 'task',
                description: 'The resource to perform operations on',
            },
            // Operations & fields
            ...AdministratorDescription_1.adminOperations,
            ...AdministratorDescription_1.adminFields,
            ...ContainerDescription_1.containerOperations,
            ...ContainerDescription_1.containerFields,
            ...DestinationDescription_1.destinationOperations,
            ...DestinationDescription_1.destinationFields,
            ...HubDescription_1.hubOperations,
            ...HubDescription_1.hubFields,
            ...OrganizationDescription_1.organizationOperations,
            ...OrganizationDescription_1.organizationFields,
            ...RecipientDescription_1.recipientOperations,
            ...RecipientDescription_1.recipientFields,
            ...TaskDescription_1.taskOperations,
            ...TaskDescription_1.taskFields,
            ...TeamDescription_1.teamOperations,
            ...TeamDescription_1.teamFields,
            // ...webhookOperations,
            // ...webhookFields,
            ...WorkerDescription_1.workerOperations,
            ...WorkerDescription_1.workerFields,
        ],
    };
    methods = {
        credentialTest: {
            async onfleetApiTest(credential) {
                const credentials = credential.data;
                const options = {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'n8n-onfleet',
                    },
                    auth: {
                        user: credentials.apiKey,
                        pass: '',
                    },
                    method: 'GET',
                    uri: 'https://onfleet.com/api/v2/auth/test',
                    json: true,
                };
                try {
                    await this.helpers.request(options);
                    return {
                        status: 'OK',
                        message: 'Authentication successful',
                    };
                }
                catch (error) {
                    return {
                        status: 'Error',
                        message: `Auth settings are not valid: ${error}`,
                    };
                }
            },
        },
        loadOptions: GenericFunctions_1.resourceLoaders,
    };
    async execute() {
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const items = this.getInputData();
        // eslint-disable-next-line @typescript-eslint/no-restricted-types
        const operations = {
            task: Onfleet_1.Onfleet.executeTaskOperations,
            destination: Onfleet_1.Onfleet.executeDestinationOperations,
            organization: Onfleet_1.Onfleet.executeOrganizationOperations,
            admin: Onfleet_1.Onfleet.executeAdministratorOperations,
            recipient: Onfleet_1.Onfleet.executeRecipientOperations,
            hub: Onfleet_1.Onfleet.executeHubOperations,
            worker: Onfleet_1.Onfleet.executeWorkerOperations,
            webhook: Onfleet_1.Onfleet.executeWebhookOperations,
            container: Onfleet_1.Onfleet.executeContainerOperations,
            team: Onfleet_1.Onfleet.executeTeamOperations,
        };
        const responseData = await operations[resource].call(this, `${resource}s`, operation, items);
        // Map data to n8n data
        return [this.helpers.returnJsonArray(responseData)];
    }
}
exports.Onfleet = Onfleet;
//# sourceMappingURL=Onfleet.node.js.map