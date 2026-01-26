"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.teamRLC,
    descriptions_1.channelRLC,
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        placeholder: 'e.g. My New Channel name',
        description: 'The name of the channel',
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
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['channel'],
        operation: ['update'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    //https://docs.microsoft.com/en-us/graph/api/channel-patch?view=graph-rest-beta&tabs=http
    const teamId = this.getNodeParameter('teamId', i, '', { extractValue: true });
    const channelId = this.getNodeParameter('channelId', i, '', { extractValue: true });
    const newName = this.getNodeParameter('name', i);
    const newDescription = this.getNodeParameter('options.description', i, '');
    const body = {};
    if (newName) {
        body.displayName = newName;
    }
    if (newDescription) {
        body.description = newDescription;
    }
    await transport_1.microsoftApiRequest.call(this, 'PATCH', `/v1.0/teams/${teamId}/channels/${channelId}`, body);
    return { success: true };
}
//# sourceMappingURL=update.operation.js.map