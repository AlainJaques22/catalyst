"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentApi = void 0;
class SegmentApi {
    name = 'segmentApi';
    displayName = 'Segment API';
    documentationUrl = 'segment';
    properties = [
        {
            displayName: 'Write Key',
            name: 'writekey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
    async authenticate(credentials, requestOptions) {
        const base64Key = Buffer.from(`${credentials.writekey}:`).toString('base64');
        requestOptions.headers.Authorization = `Basic ${base64Key}`;
        return requestOptions;
    }
}
exports.SegmentApi = SegmentApi;
//# sourceMappingURL=SegmentApi.credentials.js.map