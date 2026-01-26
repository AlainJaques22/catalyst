import type { IExecuteSingleFunctions, IHttpRequestOptions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
export declare function getPartitionKey(this: IExecuteSingleFunctions): Promise<string>;
export declare function simplifyData(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function validateQueryParameters(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function processJsonInput<T>(jsonData: T, inputName?: string, fallbackValue?: T | undefined, disallowSpacesIn?: string[]): Record<string, unknown>;
export declare function validatePartitionKey(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function validateCustomProperties(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare const untilContainerSelected: {
    container: string[];
};
export declare const untilItemSelected: {
    item: string[];
};
//# sourceMappingURL=utils.d.ts.map