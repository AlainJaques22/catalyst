"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftSharePointOAuth2Api = void 0;
class MicrosoftSharePointOAuth2Api {
    name = 'microsoftSharePointOAuth2Api';
    extends = ['microsoftOAuth2Api'];
    icon = {
        light: 'file:icons/microsoftSharePoint.svg',
        dark: 'file:icons/microsoftSharePoint.svg',
    };
    displayName = 'Microsoft SharePoint OAuth2 API';
    documentationUrl = 'microsoft';
    httpRequestNode = {
        name: 'Microsoft SharePoint',
        docsUrl: 'https://learn.microsoft.com/en-us/sharepoint/dev/apis/sharepoint-rest-graph',
        apiBaseUrlPlaceholder: 'https://{subdomain}.sharepoint.com/_api/v2.0/',
    };
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: '=openid offline_access https://{{$self.subdomain}}.sharepoint.com/.default',
        },
        {
            displayName: 'Subdomain',
            name: 'subdomain',
            type: 'string',
            default: '',
            hint: 'You can extract the subdomain from the URL. For example, in the URL "https://tenant123.sharepoint.com", the subdomain is "tenant123".',
        },
    ];
}
exports.MicrosoftSharePointOAuth2Api = MicrosoftSharePointOAuth2Api;
//# sourceMappingURL=MicrosoftSharePointOAuth2Api.credentials.js.map