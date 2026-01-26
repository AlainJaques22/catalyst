"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySql = void 0;
const sshTunnel_properties_1 = require("../utils/sshTunnel.properties");
class MySql {
    name = 'mySql';
    displayName = 'MySQL';
    documentationUrl = 'mysql';
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
            default: 'mysql',
        },
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: 'mysql',
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
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 3306,
        },
        {
            displayName: 'Connect Timeout',
            name: 'connectTimeout',
            type: 'number',
            default: 10000,
            description: 'The milliseconds before a timeout occurs during the initial connection to the MySQL server',
        },
        {
            displayName: 'SSL',
            name: 'ssl',
            type: 'boolean',
            default: false,
        },
        {
            displayName: 'CA Certificate',
            name: 'caCertificate',
            typeOptions: {
                password: true,
            },
            displayOptions: {
                show: {
                    ssl: [true],
                },
            },
            type: 'string',
            default: '',
        },
        {
            displayName: 'Client Private Key',
            name: 'clientPrivateKey',
            typeOptions: {
                password: true,
            },
            displayOptions: {
                show: {
                    ssl: [true],
                },
            },
            type: 'string',
            default: '',
        },
        {
            displayName: 'Client Certificate',
            name: 'clientCertificate',
            typeOptions: {
                password: true,
            },
            displayOptions: {
                show: {
                    ssl: [true],
                },
            },
            type: 'string',
            default: '',
        },
        ...sshTunnel_properties_1.sshTunnelProperties,
    ];
}
exports.MySql = MySql;
//# sourceMappingURL=MySql.credentials.js.map