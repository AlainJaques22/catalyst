"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventbriteApi = void 0;
class EventbriteApi {
    name = 'eventbriteApi';
    displayName = 'Eventbrite API';
    documentationUrl = 'eventbrite';
    properties = [
        {
            displayName: 'Private Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.EventbriteApi = EventbriteApi;
//# sourceMappingURL=EventbriteApi.credentials.js.map