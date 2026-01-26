import type { GenericValue, IBinaryKeyData, IDataObject, IExecuteFunctions, INodeExecutionData, INodeParameters, IPairedItemData } from 'n8n-workflow';
import type { ClashResolveOptions, MatchFieldsJoinMode, MatchFieldsOptions } from './interfaces';
type PairToMatch = {
    field1: string;
    field2: string;
};
type EntryMatches = {
    entry: INodeExecutionData;
    matches: INodeExecutionData[];
};
export declare function addSuffixToEntriesKeys(data: INodeExecutionData[], suffix: string): {
    json: IDataObject;
    binary?: IBinaryKeyData;
    error?: import("n8n-workflow").NodeApiError | import("n8n-workflow").NodeOperationError;
    pairedItem?: IPairedItemData | IPairedItemData[] | number;
    metadata?: {
        subExecution: import("n8n-workflow").RelatedExecution;
    };
    evaluationData?: Record<string, GenericValue>;
    sendMessage?: string;
    index?: number;
}[];
export declare function findMatches(input1: INodeExecutionData[], input2: INodeExecutionData[], fieldsToMatch: PairToMatch[], options: MatchFieldsOptions): {
    matched: EntryMatches[];
    matched2: INodeExecutionData[];
    unmatched1: INodeExecutionData[];
    unmatched2: INodeExecutionData[];
};
export declare function selectMergeMethod(clashResolveOptions: ClashResolveOptions): (target: IDataObject, ...source: IDataObject[]) => any;
export declare function mergeMatched(matched: EntryMatches[], clashResolveOptions: ClashResolveOptions, joinMode?: MatchFieldsJoinMode): INodeExecutionData[];
export declare function checkMatchFieldsInput(data: IDataObject[]): PairToMatch[];
export declare function checkInput(input: INodeExecutionData[], fields: string[], disableDotNotation: boolean, inputLabel: string): INodeExecutionData[];
export declare function addSourceField(data: INodeExecutionData[], sourceField: string): {
    json: {
        _source: string;
    };
    binary?: IBinaryKeyData;
    error?: import("n8n-workflow").NodeApiError | import("n8n-workflow").NodeOperationError;
    pairedItem?: IPairedItemData | IPairedItemData[] | number;
    metadata?: {
        subExecution: import("n8n-workflow").RelatedExecution;
    };
    evaluationData?: Record<string, GenericValue>;
    sendMessage?: string;
    index?: number;
}[];
export declare const configuredInputs: (parameters: INodeParameters) => {
    type: string;
    displayName: string;
}[];
export declare function getNodeInputsData(this: IExecuteFunctions): INodeExecutionData[][];
export declare const rowToExecutionData: (data: IDataObject) => INodeExecutionData;
export declare function modifySelectQuery(userQuery: string, inputLength: number): string;
export {};
//# sourceMappingURL=utils.d.ts.map