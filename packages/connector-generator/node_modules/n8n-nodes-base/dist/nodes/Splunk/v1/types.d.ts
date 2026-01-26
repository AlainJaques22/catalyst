export type SplunkCredentials = {
    authToken: string;
    baseUrl: string;
    allowUnauthorizedCerts: boolean;
};
export type SplunkFeedResponse = {
    feed: {
        entry: {
            title: string;
        };
    };
};
export type SplunkSearchResponse = {
    entry: {
        title: string;
    };
};
export type SplunkResultResponse = {
    results: {
        result: Array<{
            field: string;
        }>;
    } | {
        result: {
            field: string;
        };
    };
};
export type SplunkError = {
    response?: {
        messages?: {
            msg: {
                $: {
                    type: string;
                };
                _: string;
            };
        };
    };
};
export declare const SPLUNK: {
    DICT: string;
    LIST: string;
    ITEM: string;
    KEY: string;
};
//# sourceMappingURL=types.d.ts.map