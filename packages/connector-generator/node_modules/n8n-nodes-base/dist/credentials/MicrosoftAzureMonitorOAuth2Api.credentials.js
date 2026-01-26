"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftAzureMonitorOAuth2Api = void 0;
class MicrosoftAzureMonitorOAuth2Api {
    name = 'microsoftAzureMonitorOAuth2Api';
    displayName = 'Microsoft Azure Monitor OAuth2 API';
    extends = ['oAuth2Api'];
    documentationUrl = 'microsoftazuremonitor';
    icon = 'file:icons/Microsoft.svg';
    httpRequestNode = {
        name: 'Microsoft Azure Monitor',
        docsUrl: 'https://learn.microsoft.com/en-us/azure/azure-monitor/logs/api/request-format',
        apiBaseUrlPlaceholder: 'https://api.loganalytics.azure.com/v1/workspaces/[workspace_id]/query',
    };
    properties = [
        {
            displayName: 'Grant Type',
            name: 'grantType',
            type: 'options',
            options: [
                {
                    name: 'Authorization Code',
                    value: 'authorizationCode',
                },
                {
                    name: 'Client Credentials',
                    value: 'clientCredentials',
                },
            ],
            default: 'authorizationCode',
        },
        {
            displayName: 'Tenant ID',
            required: true,
            name: 'tenantId',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            options: [
                {
                    name: 'Azure Log Analytics',
                    value: 'https://api.loganalytics.azure.com',
                },
                {
                    name: 'Log Analytics',
                    value: 'https://api.loganalytics.io',
                },
                {
                    name: 'Azure Monitor',
                    value: 'https://monitor.azure.com',
                },
                {
                    name: 'Azure Management',
                    value: 'https://management.azure.com',
                },
            ],
            default: 'https://api.loganalytics.azure.com',
        },
        {
            displayName: 'Authorization URL',
            name: 'authUrl',
            type: 'hidden',
            default: '=https://login.microsoftonline.com/{{$self["tenantId"]}}/oauth2/authorize',
        },
        {
            displayName: 'Access Token URL',
            name: 'accessTokenUrl',
            type: 'hidden',
            default: '=https://login.microsoftonline.com/{{$self["tenantId"]}}/oauth2/{{$self["grantType"] === "clientCredentials" ? "v2.0/" : ""}}token',
        },
        {
            displayName: 'Auth URI Query Parameters',
            name: 'authQueryParameters',
            type: 'hidden',
            default: '={{$self["grantType"] === "clientCredentials" ? "" : "resource=" + $self["resource"]}}',
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: '={{$self["grantType"] === "clientCredentials" ? $self["resource"] + "/.default" : ""}}',
        },
        {
            displayName: 'Authentication',
            name: 'authentication',
            type: 'hidden',
            default: 'body',
        },
    ];
}
exports.MicrosoftAzureMonitorOAuth2Api = MicrosoftAzureMonitorOAuth2Api;
//# sourceMappingURL=MicrosoftAzureMonitorOAuth2Api.credentials.js.map