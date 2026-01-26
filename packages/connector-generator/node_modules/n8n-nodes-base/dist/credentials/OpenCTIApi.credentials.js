"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenCTIApi = void 0;
class OpenCTIApi {
    name = 'openCtiApi';
    displayName = 'OpenCTI API';
    documentationUrl = 'opencti';
    icon = 'file:icons/OpenCTI.png';
    httpRequestNode = {
        name: 'OpenCTI',
        docsUrl: 'https://docs.opencti.io/latest/deployment/integrations/?h=api#graphql-api',
        apiBaseUrl: '',
    };
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };
}
exports.OpenCTIApi = OpenCTIApi;
//# sourceMappingURL=OpenCTIApi.credentials.js.map