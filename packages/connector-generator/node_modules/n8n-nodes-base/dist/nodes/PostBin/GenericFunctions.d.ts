import type { IExecuteSingleFunctions, IHttpRequestOptions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
/**
 * Creates correctly-formatted PostBin API URL based on the entered binId.
 * This function makes sure binId is in the expected format by parsing it
 * from current node parameter value.
 *
 */
export declare function buildBinAPIURL(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
/**
 * Creates correctly-formatted PostBin Bin test URL based on the entered binId.
 * This function makes sure binId is in the expected format by parsing it
 * from current node parameter value.
 *
 */
export declare function buildBinTestURL(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
/**
 * Creates correctly-formatted PostBin API URL based on the entered binId and reqId.
 * This function makes sure binId is in the expected format by parsing it
 * from current node parameter value.
 *
 */
export declare function buildRequestURL(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
/**
 * Converts the bin response data and adds additional properties
 *
 */
export declare function transformBinResponse(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map