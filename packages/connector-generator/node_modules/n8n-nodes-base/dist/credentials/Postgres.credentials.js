"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postgres = void 0;
const sshTunnel_properties_1 = require("../utils/sshTunnel.properties");
class Postgres {
    name = 'postgres';
    displayName = 'Postgres';
    documentationUrl = 'postgres';
    properties = [
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: 'localhost',
        },
        {
            displayName: 'Database',
            name: 'database',
            type: 'string',
            default: 'postgres',
        },
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: 'postgres',
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
        {
            displayName: 'Maximum Number of Connections',
            name: 'maxConnections',
            type: 'number',
            default: 100,
            description: 'Make sure this value times the number of workers you have is lower than the maximum number of connections your postgres instance allows.',
        },
        {
            displayName: 'Ignore SSL Issues (Insecure)',
            name: 'allowUnauthorizedCerts',
            type: 'boolean',
            default: false,
            description: 'Whether to connect even if SSL certificate validation is not possible',
        },
        {
            displayName: 'SSL',
            name: 'ssl',
            type: 'options',
            displayOptions: {
                show: {
                    allowUnauthorizedCerts: [false],
                },
            },
            options: [
                {
                    name: 'Allow',
                    value: 'allow',
                },
                {
                    name: 'Disable',
                    value: 'disable',
                },
                {
                    name: 'Require',
                    value: 'require',
                },
            ],
            default: 'disable',
        },
        {
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 5432,
        },
        ...sshTunnel_properties_1.sshTunnelProperties,
    ];
}
exports.Postgres = Postgres;
//# sourceMappingURL=Postgres.credentials.js.map