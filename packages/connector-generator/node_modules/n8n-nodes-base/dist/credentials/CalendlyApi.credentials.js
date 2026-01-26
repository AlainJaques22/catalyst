"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendlyApi = void 0;
const getAuthenticationType = (data) => {
    // The access token is a JWT, so it will always include dots to separate
    // header, payoload and signature.
    return data.includes('.') ? 'accessToken' : 'apiKey';
};
class CalendlyApi {
    name = 'calendlyApi';
    displayName = 'Calendly API';
    documentationUrl = 'calendly';
    properties = [
        // Change name to Personal Access Token once API Keys
        // are deprecated
        {
            displayName: 'API Key or Personal Access Token',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    async authenticate(credentials, requestOptions) {
        //check whether the token is an API Key or an access token
        const { apiKey } = credentials;
        const tokenType = getAuthenticationType(apiKey);
        // remove condition once v1 is deprecated
        // and only inject credentials as an access token
        if (tokenType === 'accessToken') {
            requestOptions.headers.Authorization = `Bearer ${apiKey}`;
        }
        else {
            requestOptions.headers['X-TOKEN'] = apiKey;
        }
        return requestOptions;
    }
    test = {
        request: {
            baseURL: 'https://calendly.com',
            url: '/api/v1/users/me',
        },
    };
}
exports.CalendlyApi = CalendlyApi;
//# sourceMappingURL=CalendlyApi.credentials.js.map