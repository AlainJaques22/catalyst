"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitPassword = void 0;
class GitPassword {
    name = 'gitPassword';
    displayName = 'Git';
    documentationUrl = 'git';
    properties = [
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
            description: 'The username to authenticate with',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'The password to use in combination with the user',
        },
    ];
}
exports.GitPassword = GitPassword;
//# sourceMappingURL=GitPassword.credentials.js.map