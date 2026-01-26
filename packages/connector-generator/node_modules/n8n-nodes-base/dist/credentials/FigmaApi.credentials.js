"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FigmaApi = void 0;
class FigmaApi {
    name = 'figmaApi';
    displayName = 'Figma API';
    documentationUrl = 'figma';
    properties = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.FigmaApi = FigmaApi;
//# sourceMappingURL=FigmaApi.credentials.js.map