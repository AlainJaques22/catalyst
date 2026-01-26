import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
export interface ICustomInterface {
    name: string;
    key: string;
    field_type: string;
    options?: Array<{
        id: number;
        label: string;
    }>;
}
export interface ICustomProperties {
    [key: string]: ICustomInterface;
}
/**
 * Make an API request to Pipedrive
 *
 */
export declare function pipedriveApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject, formData?: IDataObject, downloadFile?: boolean): Promise<any>;
/**
 * Make an API request to paginated Pipedrive endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function pipedriveApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any>;
/**
 * Gets the custom properties from Pipedrive
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function pipedriveGetCustomProperties(this: IHookFunctions | IExecuteFunctions, resource: string): Promise<ICustomProperties>;
/**
 * Converts names and values of custom properties from their actual values to the
 * Pipedrive internal ones
 *
 */
export declare function pipedriveEncodeCustomProperties(customProperties: ICustomProperties, item: IDataObject): void;
/**
 * Converts names and values of custom properties to their actual values
 *
 */
export declare function pipedriveResolveCustomProperties(customProperties: ICustomProperties, item: IDataObject): void;
export declare function sortOptionParameters(optionParameters: INodePropertyOptions[]): INodePropertyOptions[];
//# sourceMappingURL=GenericFunctions.d.ts.map