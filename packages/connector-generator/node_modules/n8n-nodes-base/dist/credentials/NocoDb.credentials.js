"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NocoDb = void 0;
class NocoDb {
    name = 'nocoDb';
    displayName = 'NocoDB';
    documentationUrl = 'nocodb';
    properties = [
        {
            displayName: 'User Token',
            name: 'apiToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: '',
            placeholder: 'http(s)://localhost:8080',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                'xc-auth': '={{$credentials.apiToken}}',
            },
        },
    };
}
exports.NocoDb = NocoDb;
//# sourceMappingURL=NocoDb.credentials.js.map