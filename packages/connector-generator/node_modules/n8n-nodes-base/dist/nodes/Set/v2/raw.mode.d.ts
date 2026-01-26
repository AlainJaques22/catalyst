import type { INodeExecutionData, IExecuteFunctions, INodeProperties, IDataObject, INode } from 'n8n-workflow';
import type { SetNodeOptions } from './helpers/interfaces';
export declare const description: {
    displayOptions: import("n8n-workflow").IDisplayOptions;
    displayName: string;
    name: string;
    type: import("n8n-workflow").NodePropertyTypes;
    typeOptions?: import("n8n-workflow").INodePropertyTypeOptions;
    default: import("n8n-workflow").NodeParameterValueType;
    description?: string;
    hint?: string;
    disabledOptions?: import("n8n-workflow").IDisplayOptions;
    options?: Array<import("n8n-workflow").INodePropertyOptions | INodeProperties | import("n8n-workflow").INodePropertyCollection>;
    placeholder?: string;
    isNodeSetting?: boolean;
    noDataExpression?: boolean;
    required?: boolean;
    routing?: import("n8n-workflow").INodePropertyRouting;
    credentialTypes?: Array<"extends:oAuth2Api" | "extends:oAuth1Api" | "has:authenticate" | "has:genericAuth">;
    extractValue?: import("n8n-workflow").INodePropertyValueExtractor;
    modes?: import("n8n-workflow").INodePropertyMode[];
    requiresDataPath?: "single" | "multiple";
    doNotInherit?: boolean;
    validateType?: import("n8n-workflow").FieldType;
    ignoreValidationDuringExecution?: boolean;
    allowArbitraryValues?: boolean;
}[];
export declare function execute(this: IExecuteFunctions, item: INodeExecutionData, i: number, options: SetNodeOptions, rawData: IDataObject, node: INode): Promise<INodeExecutionData | {
    json: {
        error: string;
    };
    pairedItem: {
        item: number;
    };
}>;
//# sourceMappingURL=raw.mode.d.ts.map