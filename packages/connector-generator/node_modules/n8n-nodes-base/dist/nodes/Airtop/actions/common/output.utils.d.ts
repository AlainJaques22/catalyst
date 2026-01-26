import { NodeOperationError } from 'n8n-workflow';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { IAirtopNodeExecutionData, IAirtopResponse } from '../../transport/types';
/**
 * Parse JSON when the 'Parse JSON Output' parameter is enabled
 * @param this - The execution context
 * @param index - The index of the node
 * @param response - The Airtop API response to parse
 * @returns The parsed output
 */
export declare function parseJsonIfPresent(this: IExecuteFunctions, index: number, response: IAirtopResponse): IAirtopResponse;
/**
 * Clean up the output when used as a tool
 * @param output - The output to clean up
 * @returns The cleaned up output
 */
export declare function cleanOutputForToolUse(output: IAirtopNodeExecutionData[]): {
    json: {
        [key: string]: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
    };
    binary?: import("n8n-workflow").IBinaryKeyData;
    error?: import("n8n-workflow").NodeApiError | NodeOperationError;
    pairedItem?: import("n8n-workflow").IPairedItemData | import("n8n-workflow").IPairedItemData[] | number;
    metadata?: {
        subExecution: import("n8n-workflow").RelatedExecution;
    };
    evaluationData?: Record<string, import("n8n-workflow").GenericValue>;
    sendMessage?: string;
    index?: number;
}[];
//# sourceMappingURL=output.utils.d.ts.map