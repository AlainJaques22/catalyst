import type { IExecuteSingleFunctions, IHttpRequestOptions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
export declare const escapeFilterValue: (value: string) => string;
export declare function simplifyItemPostReceive(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function simplifyListPostReceive(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function downloadFilePostReceive(this: IExecuteSingleFunctions, _items: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function uploadFilePreSend(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function itemGetAllFieldsPreSend(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function itemColumnsPreSend(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function handleErrorPostReceive(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
//# sourceMappingURL=utils.d.ts.map