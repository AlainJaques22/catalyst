"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Msg91Api = void 0;
class Msg91Api {
    name = 'msg91Api';
    displayName = 'Msg91 Api';
    documentationUrl = 'msg91';
    properties = [
        // User authentication key
        {
            displayName: 'Authentication Key',
            name: 'authkey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ];
}
exports.Msg91Api = Msg91Api;
//# sourceMappingURL=Msg91Api.credentials.js.map