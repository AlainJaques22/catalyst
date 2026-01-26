"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsNodeAuthOptions = exports.awsNodeCredentials = void 0;
exports.awsNodeCredentials = [
    {
        name: 'aws',
        required: true,
        displayOptions: {
            show: {
                authentication: ['iam'],
            },
        },
    },
    {
        name: 'awsAssumeRole',
        required: true,
        displayOptions: {
            show: {
                authentication: ['assumeRole'],
            },
        },
    },
];
exports.awsNodeAuthOptions = {
    displayName: 'Authentication',
    name: 'authentication',
    type: 'options',
    options: [
        {
            name: 'AWS (IAM)',
            value: 'iam',
        },
        {
            name: 'AWS (Assume Role)',
            value: 'assumeRole',
        },
    ],
    default: 'iam',
};
//# sourceMappingURL=utils.js.map