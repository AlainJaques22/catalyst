"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SshPassword = void 0;
class SshPassword {
    name = 'sshPassword';
    displayName = 'SSH Password';
    documentationUrl = 'ssh';
    properties = [
        {
            displayName: 'Host',
            name: 'host',
            required: true,
            type: 'string',
            default: '',
            placeholder: 'localhost',
        },
        {
            displayName: 'Port',
            name: 'port',
            required: true,
            type: 'number',
            default: 22,
        },
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];
}
exports.SshPassword = SshPassword;
//# sourceMappingURL=SshPassword.credentials.js.map