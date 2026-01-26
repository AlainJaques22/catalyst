"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerIoApi = void 0;
const errors_1 = require("@n8n/errors");
class CustomerIoApi {
    name = 'customerIoApi';
    displayName = 'Customer.io API';
    documentationUrl = 'customerio';
    properties = [
        {
            displayName: 'Tracking API Key',
            name: 'trackingApiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Required for tracking API',
            required: true,
        },
        {
            displayName: 'Region',
            name: 'region',
            type: 'options',
            options: [
                {
                    name: 'EU region',
                    value: 'track-eu.customer.io',
                },
                {
                    name: 'Global region',
                    value: 'track.customer.io',
                },
            ],
            default: 'track.customer.io',
            description: 'Should be set based on your account region',
            hint: 'The region will be omitted when being used with the HTTP node',
            required: true,
        },
        {
            displayName: 'Tracking Site ID',
            name: 'trackingSiteId',
            type: 'string',
            default: '',
            description: 'Required for tracking API',
        },
        {
            displayName: 'App API Key',
            name: 'appApiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            description: 'Required for App API',
        },
    ];
    async authenticate(credentials, requestOptions) {
        // @ts-ignore
        const url = new URL(requestOptions.url ? requestOptions.url : requestOptions.uri);
        if (url.hostname === 'track.customer.io' ||
            url.hostname === 'track-eu.customer.io' ||
            url.hostname === 'api.customer.io' ||
            url.hostname === 'api-eu.customer.io') {
            const basicAuthKey = Buffer.from(`${credentials.trackingSiteId}:${credentials.trackingApiKey}`).toString('base64');
            // @ts-ignore
            Object.assign(requestOptions.headers, { Authorization: `Basic ${basicAuthKey}` });
        }
        else if (url.hostname === 'beta-api.customer.io' ||
            url.hostname === 'beta-api-eu.customer.io') {
            // @ts-ignore
            Object.assign(requestOptions.headers, {
                Authorization: `Bearer ${credentials.appApiKey}`,
            });
        }
        else {
            throw new errors_1.ApplicationError('Unknown way of authenticating', { level: 'warning' });
        }
        return requestOptions;
    }
}
exports.CustomerIoApi = CustomerIoApi;
//# sourceMappingURL=CustomerIoApi.credentials.js.map