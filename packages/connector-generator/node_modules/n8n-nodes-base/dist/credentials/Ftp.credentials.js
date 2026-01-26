"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ftp = void 0;
class Ftp {
    name = 'ftp';
    displayName = 'FTP';
    documentationUrl = 'ftp';
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
            default: 21,
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
exports.Ftp = Ftp;
//# sourceMappingURL=Ftp.credentials.js.map