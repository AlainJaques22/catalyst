import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function profitWellApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export type Metrics = {
    [key: string]: [{
        date: string;
        value: number | null;
    }];
};
export declare function simplifyDailyMetrics(responseData: Metrics): IDataObject[];
export declare function simplifyMontlyMetrics(responseData: Metrics): IDataObject;
//# sourceMappingURL=GenericFunctions.d.ts.map