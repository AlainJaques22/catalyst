import type { DeclarativeRestApiSettings, IDataObject, IExecuteFunctions, IExecutePaginationFunctions, IExecuteSingleFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IN8nHttpFullResponse, INodeExecutionData, INodeListSearchResult } from 'n8n-workflow';
type OktaUser = {
    status: string;
    created: string;
    activated: string;
    lastLogin: string;
    lastUpdated: string;
    passwordChanged: string;
    profile: {
        login: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    id: string;
};
export declare function oktaApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | IHookFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, url?: string, option?: IDataObject): Promise<OktaUser[]>;
export declare function getUsers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
export declare function simplifyGetAllResponse(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function simplifyGetResponse(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare const getCursorPaginator: () => (this: IExecutePaginationFunctions, requestOptions: DeclarativeRestApiSettings.ResultOptions) => Promise<INodeExecutionData[]>;
export {};
//# sourceMappingURL=UserFunctions.d.ts.map