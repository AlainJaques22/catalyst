"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSuiteAdminOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/admin.directory.group',
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/admin.directory.domain.readonly',
    'https://www.googleapis.com/auth/admin.directory.userschema.readonly',
    'https://www.googleapis.com/auth/admin.directory.device.chromeos',
    'https://www.googleapis.com/auth/admin.directory.orgunit.readonly',
];
class GSuiteAdminOAuth2Api {
    name = 'gSuiteAdminOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Workspace Admin OAuth2 API';
    documentationUrl = 'google';
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
    ];
}
exports.GSuiteAdminOAuth2Api = GSuiteAdminOAuth2Api;
//# sourceMappingURL=GSuiteAdminOAuth2Api.credentials.js.map