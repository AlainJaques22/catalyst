import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IDataObject, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
export interface ITypeformDefinition {
    fields: ITypeformDefinitionField[];
}
export interface ITypeformDefinitionField {
    id: string;
    title: string;
}
export interface ITypeformAnswer {
    field: ITypeformAnswerField;
    type: string;
    [key: string]: string | ITypeformAnswerField | object;
}
export interface ITypeformAnswerField {
    id: string;
    type: string;
    ref: string;
    [key: string]: string | object;
}
/**
 * Make an API request to Typeform
 *
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated Typeform endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function apiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject, _dataKey?: string): Promise<any>;
/**
 * Returns all the available forms
 *
 */
export declare function getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map