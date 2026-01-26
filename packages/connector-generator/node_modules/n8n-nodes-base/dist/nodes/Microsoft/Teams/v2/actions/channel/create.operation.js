"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.teamRLC,
    {
        displayName: 'New Channel Name',
        name: 'name',
        required: true,
        type: 'string',
        default: '',
        placeholder: 'e.g. My New Channel',
        description: 'The name of the new channel you want to create',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        default: {},
        placeholder: 'Add option',
        options: [
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                default: '',
                description: 'The description of the channel',
                typeOptions: {
                    rows: 2,
                },
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                    {
                        name: 'Private',
                        value: 'private',
                    },
                    {
                        name: 'Standard',
                        value: 'standard',
                    },
                ],
                default: 'standard',
                description: 'Standard: Accessible to everyone on the team. Private: Accessible only to a specific group of people within the team.',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['channel'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/channel-post?view=graph-rest-beta&tabs=http
    const teamId = this.getNodeParameter('teamId', i, '', { extractValue: true });
    const name = this.getNodeParameter('name', i);
    const options = this.getNodeParameter('options', i);
    const body = {
        displayName: name,
    };
    if (options.description) {
        body.description = options.description;
    }
    if (options.type) {
        body.membershipType = options.type;
    }
    return await transport_1.microsoftApiRequest.call(this, 'POST', `/v1.0/teams/${teamId}/channels`, body);
}
//# sourceMappingURL=create.operation.js.map