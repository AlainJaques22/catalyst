import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { ISearchConditions } from './FilterInterface';
export declare function agileCrmApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject, uri?: string, sendAsForm?: boolean): Promise<any>;
export declare function agileCrmApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, method: IHttpRequestMethods, resource: string, body?: any, query?: IDataObject, uri?: string, sendAsForm?: boolean): Promise<any>;
export declare function agileCrmApiRequestUpdate(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method?: IHttpRequestMethods, _endpoint?: string, body?: any, _query?: IDataObject, uri?: string): Promise<any>;
export declare function validateJSON(json: string | undefined): any;
export declare function getFilterRules(conditions: ISearchConditions[], matchType: string): IDataObject;
export declare function simplifyResponse(records: [{
    id: string;
    properties: [{
        name: string;
        value: string;
    }];
}]): {
    id: string;
}[];
//# sourceMappingURL=GenericFunctions.d.ts.map