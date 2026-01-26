"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFirebaseCloudFirestoreOAuth2Api = void 0;
const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/firebase',
];
class GoogleFirebaseCloudFirestoreOAuth2Api {
    name = 'googleFirebaseCloudFirestoreOAuth2Api';
    extends = ['googleOAuth2Api'];
    displayName = 'Google Firebase Cloud Firestore OAuth2 API';
    documentationUrl = 'google/oauth-single-service';
    properties = [
        {
            displayName: 'Scope',
            name: 'scope',
            type: 'hidden',
            default: scopes.join(' '),
        },
    ];
}
exports.GoogleFirebaseCloudFirestoreOAuth2Api = GoogleFirebaseCloudFirestoreOAuth2Api;
//# sourceMappingURL=GoogleFirebaseCloudFirestoreOAuth2Api.credentials.js.map