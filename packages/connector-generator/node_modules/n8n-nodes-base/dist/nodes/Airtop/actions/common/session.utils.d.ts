import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { IAirtopResponse } from '../../transport/types';
/**
 * Execute the node operation. Creates and terminates a new session if needed.
 * @param this - The execution context
 * @param index - The index of the node
 * @param request - The request to execute
 * @returns The response from the request
 */
export declare function executeRequestWithSessionManagement(this: IExecuteFunctions, index: number, request: {
    method: 'POST' | 'DELETE';
    path: string;
    body: IDataObject;
}): Promise<IAirtopResponse>;
//# sourceMappingURL=session.utils.d.ts.map