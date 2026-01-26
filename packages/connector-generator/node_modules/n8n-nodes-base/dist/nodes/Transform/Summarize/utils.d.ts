import { type GenericValue, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
type AggregationType = 'append' | 'average' | 'concatenate' | 'count' | 'countUnique' | 'max' | 'min' | 'sum';
export type Aggregation = {
    aggregation: AggregationType;
    field: string;
    includeEmpty?: boolean;
    separateBy?: string;
    customSeparator?: string;
};
export type Aggregations = Aggregation[];
export declare const NUMERICAL_AGGREGATIONS: string[];
export type SummarizeOptions = {
    continueIfFieldNotFound: boolean;
    disableDotNotation?: boolean;
    outputFormat?: 'separateItems' | 'singleItem';
    skipEmptySplitFields?: boolean;
};
export type ValueGetterFn = (item: IDataObject, field: string) => IDataObject | IDataObject[] | GenericValue | GenericValue[];
export declare const fieldValueGetter: (disableDotNotation?: boolean) => (item: IDataObject, field: string) => GenericValue;
export declare function checkIfFieldExists(this: IExecuteFunctions, items: IDataObject[], aggregations: Aggregations, getValue: ValueGetterFn): void;
type AggregationResult = {
    returnData: IDataObject;
    pairedItems?: number[];
};
type NestedAggregationResult = AggregationResult | {
    fieldName: string;
    splits: Map<unknown, NestedAggregationResult>;
};
export declare function aggregateAndSplitData({ splitKeys, inputItems, fieldsToSummarize, options, getValue, convertKeysToString, }: {
    splitKeys: string[] | undefined;
    inputItems: IDataObject[];
    fieldsToSummarize: Aggregations;
    options: SummarizeOptions;
    getValue: ValueGetterFn;
    convertKeysToString?: boolean;
}): NestedAggregationResult;
export declare function flattenAggregationResultToObject(result: NestedAggregationResult): IDataObject;
export declare function flattenAggregationResultToArray(result: NestedAggregationResult): AggregationResult[];
export {};
//# sourceMappingURL=utils.d.ts.map