"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsTriggerOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.metadata',
];
class GoogleSheetsTriggerOAuth2Api {
    name = 'googleSheetsTriggerOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Sheets Trigger OAuth2 API';
    documentationUrl = 'google/oauth-single-service';
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
        {
            displayName: 'Make sure you have enabled the following APIs & Services in the Google Cloud Console: Google Drive API, Google Sheets API. <a href="https://docs.n8n.io/integrations/builtin/credentials/google/oauth-generic/#scopes" target="_blank">More info</a>.',
            name: 'notice',
            type: 'notice',
            default: '',
            displayOptions: {
                hideOnCloud: true,
            },
        },
    ];
}
exports.GoogleSheetsTriggerOAuth2Api = GoogleSheetsTriggerOAuth2Api;
//# sourceMappingURL=GoogleSheetsTriggerOAuth2Api.credentials.js.map