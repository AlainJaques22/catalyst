import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import type oracledb from 'oracledb';
import type { OracleDBNodeOptions, QueriesRunner } from '../../helpers/interfaces';
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
/**
 * Query execution function for this node.
 *
 * This method is called once for every execution of the node during a workflow run.
 * It receives input data from the previous node(s) and returns output data to the next node(s).
 *
 *
 * Returns:
 * - An array of `INodeExecutionData` objects containing JSON data and optionally binary data, PairedItem,...
 */
export declare function execute(this: IExecuteFunctions, runQueries: QueriesRunner, items: INodeExecutionData[], nodeOptions: OracleDBNodeOptions, _pool?: oracledb.Pool): Promise<INodeExecutionData[]>;
//# sourceMappingURL=executeQuery.operation.d.ts.map