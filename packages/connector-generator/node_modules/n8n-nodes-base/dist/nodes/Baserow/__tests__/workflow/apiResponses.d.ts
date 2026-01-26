export declare const fieldsResponse: ({
    id: number;
    table_id: number;
    name: string;
    order: number;
    type: string;
    primary: boolean;
    read_only: boolean;
    immutable_type: boolean;
    immutable_properties: boolean;
    description: null;
    text_default: string;
    long_text_enable_rich_text?: undefined;
} | {
    id: number;
    table_id: number;
    name: string;
    order: number;
    type: string;
    primary: boolean;
    read_only: boolean;
    immutable_type: boolean;
    immutable_properties: boolean;
    description: null;
    long_text_enable_rich_text: boolean;
    text_default?: undefined;
} | {
    id: number;
    table_id: number;
    name: string;
    order: number;
    type: string;
    primary: boolean;
    read_only: boolean;
    immutable_type: boolean;
    immutable_properties: boolean;
    description: null;
    text_default?: undefined;
    long_text_enable_rich_text?: undefined;
})[];
export declare const getResponse: {
    id: number;
    order: string;
    field_3799030: string;
    field_3799031: string;
    field_3799032: boolean;
};
export declare const getAllResponse: {
    count: number;
    next: null;
    previous: null;
    results: {
        id: number;
        order: string;
        field_3799030: string;
        field_3799031: string;
        field_3799032: boolean;
    }[];
};
export declare const createResponse: {
    id: number;
    order: string;
    field_3799030: string;
    field_3799031: string;
    field_3799032: boolean;
};
export declare const updateResponse: {
    id: number;
    order: string;
    field_3799030: string;
    field_3799031: string;
    field_3799032: boolean;
};
//# sourceMappingURL=apiResponses.d.ts.map