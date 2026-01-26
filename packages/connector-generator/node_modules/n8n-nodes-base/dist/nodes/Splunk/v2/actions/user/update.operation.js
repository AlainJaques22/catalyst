"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
    descriptions_1.userRLC,
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        options: [
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
            },
            {
                displayName: 'Full Name',
                name: 'realname',
                type: 'string',
                default: '',
                description: 'Full name of the user',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: '',
            },
            {
                displayName: 'Role Names or IDs',
                name: 'roles',
                type: 'multiOptions',
                description: 'Comma-separated list of roles to assign to the user. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                default: [],
                typeOptions: {
                    loadOptionsMethod: 'getRoles',
                },
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['user'],
        operation: ['update'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    // https://docs.splunk.com/Documentation/Splunk/8.2.2/RESTREF/RESTaccess#authentication.2Fusers.2F.7Bname.7D
    const body = {};
    const { roles, ...rest } = this.getNodeParameter('updateFields', i);
    (0, utils_1.populate)({
        ...(roles && { roles }),
        ...rest,
    }, body);
    const userId = this.getNodeParameter('userId', i, '', { extractValue: true });
    const endpoint = `/services/authentication/users/${userId}`;
    const returnData = await transport_1.splunkApiRequest.call(this, 'POST', endpoint, body).then(utils_1.formatFeed);
    return returnData;
}
//# sourceMappingURL=update.operation.js.map