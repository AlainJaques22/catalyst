"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStorageOAuth2Api = void 0;
class AzureStorageOAuth2Api {
    name = 'azureStorageOAuth2Api';
    displayName = 'Azure Storage OAuth2 API';
    extends = ['microsoftOAuth2Api'];
    documentationUrl = 'azurestorage';
    properties = [
        {
            displayName: 'Account',
            name: 'account',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'hidden',
            default: '=https://{{ $self["account"] }}.blob.core.windows.net',
        },
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: 'https://storage.azure.com/.default',
        },
    ];
}
exports.AzureStorageOAuth2Api = AzureStorageOAuth2Api;
//# sourceMappingURL=AzureStorageOAuth2Api.credentials.js.map