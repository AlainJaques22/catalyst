import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, INodeProperties, IHttpRequestMethods } from 'n8n-workflow';
export interface IProduct {
    fields: {
        item?: object[];
    };
}
/**
 * Make an API request to ActiveCampaign
 *
 */
export declare function activeCampaignApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject, dataKey?: string): Promise<any>;
/**
 * Make an API request to paginated ActiveCampaign endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function activeCampaignApiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject, dataKey?: string): Promise<any>;
export declare function activeCampaignDefaultGetAllProperties(resource: string, operation: string): INodeProperties[];
//# sourceMappingURL=GenericFunctions.d.ts.map