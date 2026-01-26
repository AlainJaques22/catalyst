"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryblokContentApi = void 0;
class StoryblokContentApi {
    name = 'storyblokContentApi';
    displayName = 'Storyblok Content API';
    documentationUrl = 'storyblok';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.StoryblokContentApi = StoryblokContentApi;
//# sourceMappingURL=StoryblokContentApi.credentials.js.map