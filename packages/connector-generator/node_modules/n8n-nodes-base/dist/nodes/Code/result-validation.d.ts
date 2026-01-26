import type { INodeExecutionData } from 'n8n-workflow';
export interface TextKeys {
    object: {
        singular: string;
        plural: string;
    };
}
export declare const REQUIRED_N8N_ITEM_KEYS: Set<string>;
export declare function getTextKey(textKeys: TextKeys, key: keyof TextKeys, options?: {
    includeArticle?: boolean;
    plural?: boolean;
}): string;
export declare function validateItem({ json, binary }: INodeExecutionData, itemIndex: number, textKeys: TextKeys): void;
export declare function validateTopLevelKeys(item: INodeExecutionData, itemIndex: number): void;
export declare function validateRunCodeEachItem(executionResult: INodeExecutionData | undefined, itemIndex: number, textKeys: TextKeys, normalizeItems: (items: INodeExecutionData[]) => INodeExecutionData[]): INodeExecutionData;
export declare function validateRunCodeAllItems(executionResult: INodeExecutionData | INodeExecutionData[] | undefined, textKeys: TextKeys, normalizeItems: (items: INodeExecutionData | INodeExecutionData[]) => INodeExecutionData[]): INodeExecutionData[];
//# sourceMappingURL=result-validation.d.ts.map