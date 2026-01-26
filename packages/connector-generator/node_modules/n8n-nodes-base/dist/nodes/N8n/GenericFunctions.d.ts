import type { DeclarativeRestApiSettings, IDataObject, IExecuteFunctions, IExecutePaginationFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeExecutionData, PreSendAction } from 'n8n-workflow';
/**
 * A custom API request function to be used with the resourceLocator lookup queries.
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject): Promise<any>;
export declare function apiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject): Promise<any>;
/**
 * Get a cursor-based paginator to use with n8n 'getAll' type endpoints.
 *
 * It will look up a 'nextCursor' in the response and if the node has
 * 'returnAll' set to true, will consecutively include it as the 'cursor' query
 * parameter for the next request, effectively getting everything in slices.
 *
 * Prequisites:
 * - routing.send.paginate must be set to true, for all requests to go through here
 * - node is expected to have a boolean parameter 'returnAll'
 * - no postReceive action setting the rootProperty, to get the items mapped
 *
 * @returns A ready-to-use cursor-based paginator function.
 */
export declare const getCursorPaginator: () => (this: IExecutePaginationFunctions, requestOptions: DeclarativeRestApiSettings.ResultOptions) => Promise<INodeExecutionData[]>;
/**
 * A helper function to parse a node parameter as JSON and set it in the request body.
 * Throws a NodeOperationError is the content is not valid JSON or it cannot be set.
 *
 * Currently, parameters with type 'json' are not validated automatically.
 * Also mapping the value for 'body.data' declaratively has it treated as a string,
 * but some operations (e.g. POST /credentials) don't work unless it is set as an object.
 * To get the JSON-body operations to work consistently, we need to parse and set the body
 * manually.
 *
 * @param parameterName The name of the node parameter to parse
 * @param setAsBodyProperty An optional property name to set the parsed data into
 * @returns The requestOptions with its body replaced with the contents of the parameter
 */
export declare const parseAndSetBodyJson: (parameterName: string, setAsBodyProperty?: string) => PreSendAction;
/**
 * A helper function to prepare the workflow object data for creation. It only sets
 * known workflow properties, for pre-emptively avoiding a HTTP 400 Bad Request
 * response until we have a better client-side schema validation mechanism.
 *
 * NOTE! This expects the requestOptions.body to already be set as an object,
 * so take care to first call parseAndSetBodyJson().
 */
export declare const prepareWorkflowCreateBody: PreSendAction;
/**
 * A helper function to prepare the workflow object data for update.
 *
 * NOTE! This expects the requestOptions.body to already be set as an object,
 * so take care to first call parseAndSetBodyJson().
 */
export declare const prepareWorkflowUpdateBody: PreSendAction;
//# sourceMappingURL=GenericFunctions.d.ts.map