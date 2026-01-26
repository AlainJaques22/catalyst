import { type IDataObject } from 'n8n-workflow';
export declare function splitAndTrim(str: string | string[]): string[];
export declare function fixFieldType(fields: IDataObject): IDataObject;
export declare function prepareInputItem(item: IDataObject, schema: IDataObject[], i: number): IDataObject;
export declare function constructFilter(entry: IDataObject): {
    _between: {
        _field: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
        _from: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
        _to: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    };
    _in?: undefined;
} | {
    _in: {
        _field: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
        _values: number | boolean | object | null | undefined;
    };
    _between?: undefined;
} | {
    [x: string]: {
        _field: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
        _value: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    };
    _between?: undefined;
    _in?: undefined;
};
//# sourceMappingURL=utils.d.ts.map