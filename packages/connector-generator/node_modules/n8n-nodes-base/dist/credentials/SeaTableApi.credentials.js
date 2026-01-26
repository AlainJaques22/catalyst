"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaTableApi = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Get options for timezones
const timezones = moment_timezone_1.default.tz
    .countries()
    .reduce((tz, country) => {
    const zonesForCountry = moment_timezone_1.default.tz
        .zonesForCountry(country)
        .map((zone) => ({ value: zone, name: zone }));
    return tz.concat(zonesForCountry);
}, []);
class SeaTableApi {
    name = 'seaTableApi';
    displayName = 'SeaTable API';
    documentationUrl = 'seatable';
    properties = [
        {
            displayName: 'Environment',
            name: 'environment',
            type: 'options',
            default: 'cloudHosted',
            options: [
                {
                    name: 'Cloud-Hosted',
                    value: 'cloudHosted',
                },
                {
                    name: 'Self-Hosted',
                    value: 'selfHosted',
                },
            ],
        },
        {
            displayName: 'Self-Hosted Domain',
            name: 'domain',
            type: 'string',
            default: '',
            placeholder: 'https://seatable.example.com',
            displayOptions: {
                show: {
                    environment: ['selfHosted'],
                },
            },
        },
        {
            displayName: 'API Token (of a Base)',
            name: 'token',
            type: 'string',
            description: 'The API-Token of the SeaTable base you would like to use with n8n. n8n can only connect to one base at a time.',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'Timezone',
            name: 'timezone',
            type: 'options',
            default: '',
            description: "Seatable server's timezone",
            options: [...timezones],
        },
    ];
    test = {
        request: {
            baseURL: '={{$credentials?.domain || "https://cloud.seatable.io" }}',
            url: '/api/v2.1/dtable/app-access-token/',
            headers: {
                Authorization: '={{"Token " + $credentials.token}}',
            },
        },
    };
}
exports.SeaTableApi = SeaTableApi;
//# sourceMappingURL=SeaTableApi.credentials.js.map