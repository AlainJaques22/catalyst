export declare const getUpdateSubscriberResponseClassic: {
    id: number;
    email: string;
    sent: number;
    opened: number;
    clicked: number;
    type: string;
    fields: {
        key: string;
        value: string;
        type: string;
    }[];
    date_subscribe: null;
    date_unsubscribe: string;
    date_created: string;
    date_updated: null;
};
export declare const getSubscriberResponseClassic: {
    id: number;
    name: string;
    email: string;
    sent: number;
    opened: number;
    clicked: number;
    type: string;
    signup_ip: string;
    signup_timestamp: string;
    confirmation_ip: string;
    confirmation_timestamp: string;
    fields: {
        key: string;
        value: string;
        type: string;
    }[];
    date_subscribe: null;
    date_unsubscribe: null;
    date_created: string;
    date_updated: null;
};
export declare const getCreateResponseClassic: {
    id: number;
    name: string;
    email: string;
    sent: number;
    opened: number;
    clicked: number;
    type: string;
    fields: {
        key: string;
        value: string;
        type: string;
    }[];
    date_subscribe: null;
    date_unsubscribe: null;
    date_created: string;
    date_updated: string;
};
export declare const getAllSubscribersResponseClassic: {
    id: number;
    name: string;
    email: string;
    sent: number;
    opened: number;
    clicked: number;
    type: string;
    fields: {
        key: string;
        value: string;
        type: string;
    }[];
    date_subscribe: null;
    date_unsubscribe: null;
    date_created: string;
    date_updated: null;
}[];
export declare const getUpdateSubscriberResponseV2: {
    data: {
        id: string;
        email: string;
        status: string;
        source: string;
        sent: number;
        opens_count: number;
        clicks_count: number;
        open_rate: number;
        click_rate: number;
        ip_address: null;
        subscribed_at: string;
        unsubscribed_at: null;
        created_at: string;
        updated_at: string;
        fields: {
            name: null;
            last_name: null;
            company: null;
            country: null;
            city: null;
            phone: null;
            state: null;
            z_i_p: null;
        };
        groups: never[];
        opted_in_at: null;
        optin_ip: string;
    };
};
export declare const getCreateResponseV2: {
    data: {
        id: string;
        email: string;
        status: string;
        source: string;
        sent: number;
        opens_count: number;
        clicks_count: number;
        open_rate: number;
        click_rate: number;
        ip_address: null;
        subscribed_at: string;
        unsubscribed_at: null;
        created_at: string;
        updated_at: string;
        fields: {
            name: null;
            last_name: null;
            company: null;
            country: null;
            city: null;
            phone: null;
            state: null;
            z_i_p: null;
        };
        groups: never[];
        opted_in_at: null;
        optin_ip: string;
    };
};
export declare const getSubscriberResponseV2: {
    data: {
        id: string;
        email: string;
        status: string;
        source: string;
        sent: number;
        opens_count: number;
        clicks_count: number;
        open_rate: number;
        click_rate: number;
        ip_address: null;
        subscribed_at: string;
        unsubscribed_at: null;
        created_at: string;
        updated_at: string;
        fields: {
            name: null;
            last_name: null;
            company: null;
            country: null;
            city: null;
            phone: null;
            state: null;
            z_i_p: null;
        };
        groups: never[];
        opted_in_at: null;
        optin_ip: string;
    };
};
export declare const getAllSubscribersResponseV2: {
    data: ({
        id: string;
        email: string;
        status: string;
        source: string;
        sent: number;
        opens_count: number;
        clicks_count: number;
        open_rate: number;
        click_rate: number;
        ip_address: null;
        subscribed_at: string;
        unsubscribed_at: null;
        created_at: string;
        updated_at: string;
        fields: {
            name: null;
            last_name: null;
            company: null;
            country: null;
            city: null;
            phone: null;
            state: null;
            z_i_p: null;
        };
        opted_in_at: null;
        optin_ip: string;
    } | {
        id: string;
        email: string;
        status: string;
        source: string;
        sent: number;
        opens_count: number;
        clicks_count: number;
        open_rate: number;
        click_rate: number;
        ip_address: null;
        subscribed_at: null;
        unsubscribed_at: null;
        created_at: string;
        updated_at: string;
        fields: {
            name: string;
            last_name: string;
            company: null;
            country: null;
            city: null;
            phone: null;
            state: null;
            z_i_p: null;
        };
        opted_in_at: null;
        optin_ip: null;
    })[];
    links: {
        first: null;
        last: null;
        prev: null;
        next: null;
    };
    meta: {
        path: string;
        per_page: number;
        next_cursor: null;
        prev_cursor: null;
    };
};
//# sourceMappingURL=apiResponses.d.ts.map