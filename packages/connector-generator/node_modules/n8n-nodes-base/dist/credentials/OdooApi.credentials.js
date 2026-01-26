"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdooApi = void 0;
class OdooApi {
    name = 'odooApi';
    displayName = 'Odoo API';
    documentationUrl = 'odoo';
    properties = [
        {
            displayName: 'Site URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://my-organization.odoo.com',
            required: true,
        },
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
            placeholder: 'user@email.com',
            required: true,
        },
        {
            displayName: 'Password or API Key',
            name: 'password',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
            required: true,
        },
        {
            displayName: 'Database Name',
            name: 'db',
            type: 'string',
            default: '',
        },
    ];
}
exports.OdooApi = OdooApi;
//# sourceMappingURL=OdooApi.credentials.js.map