import type { DeclarativeRestApiSettings, IDataObject, IExecuteFunctions, IExecutePaginationFunctions, IExecuteSingleFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
export declare function gongApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<any>;
export declare function gongApiPaginateRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject, itemIndex?: number, rootProperty?: string | undefined): Promise<any>;
export declare const extractCalls: (items: INodeExecutionData[]) => INodeExecutionData[];
export declare const extractUsers: (items: INodeExecutionData[]) => INodeExecutionData[];
export declare const getCursorPaginatorCalls: () => (this: IExecutePaginationFunctions, requestOptions: DeclarativeRestApiSettings.ResultOptions) => Promise<INodeExecutionData[]>;
export declare const getCursorPaginatorUsers: () => (this: IExecutePaginationFunctions, requestOptions: DeclarativeRestApiSettings.ResultOptions) => Promise<INodeExecutionData[]>;
export declare function handleErrorPostReceive(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function isValidNumberIds(value: number | number[] | string | string[]): boolean;
//# sourceMappingURL=GenericFunctions.d.ts.map