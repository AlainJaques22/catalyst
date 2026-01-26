"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOutlookOAuth2Api = void 0;
const scopes = [
    'openid',
    'offline_access',
    'Contacts.Read',
    'Contacts.ReadWrite',
    'Calendars.Read',
    'Calendars.Read.Shared',
    'Calendars.ReadWrite',
    'Mail.ReadWrite',
    'Mail.ReadWrite.Shared',
    'Mail.Send',
    'Mail.Send.Shared',
    'MailboxSettings.Read',
];
class MicrosoftOutlookOAuth2Api {
    name = 'microsoftOutlookOAuth2Api';
    extends = ['microsoftOAuth2Api'];
    displayName = 'Microsoft Outlook OAuth2 API';
    documentationUrl = 'microsoft';
    properties = [
        //https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
        {
            displayName: 'Use Shared Mailbox',
            name: 'useShared',
            type: 'boolean',
            default: false,
        },
        {
            displayName: 'User Principal Name',
            name: 'userPrincipalName',
            description: "Target user's UPN or ID",
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    useShared: [true],
                },
            },
        },
    ];
}
exports.MicrosoftOutlookOAuth2Api = MicrosoftOutlookOAuth2Api;
//# sourceMappingURL=MicrosoftOutlookOAuth2Api.credentials.js.map