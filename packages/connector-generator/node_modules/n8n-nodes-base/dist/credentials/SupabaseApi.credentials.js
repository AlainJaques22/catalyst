"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseApi = void 0;
class SupabaseApi {
    name = 'supabaseApi';
    displayName = 'Supabase API';
    documentationUrl = 'supabase';
    properties = [
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            placeholder: 'https://your_account.supabase.co',
            default: '',
        },
        {
            displayName: 'Service Role Secret',
            name: 'serviceRole',
            type: 'string',
            default: '',
            typeOptions: {
                password: true,
            },
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                apikey: '={{$credentials.serviceRole}}',
                Authorization: '=Bearer {{$credentials.serviceRole}}',
            },
        },
    };
    test = {
        request: {
            baseURL: '={{$credentials.host}}/rest/v1',
            headers: {
                Prefer: 'return=representation',
            },
            url: '/',
        },
    };
}
exports.SupabaseApi = SupabaseApi;
//# sourceMappingURL=SupabaseApi.credentials.js.map