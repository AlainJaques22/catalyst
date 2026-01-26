import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
export interface IFormstackFieldDefinitionType {
    id: string;
    label: string;
    description: string;
    name: string;
    type: string;
    options: unknown;
    required: string;
    uniq: string;
    hidden: string;
    readonly: string;
    colspan: string;
    label_position: string;
    num_columns: string;
    date_format: string;
    time_format: string;
}
export interface IFormstackWebhookResponseBody {
    FormID: string;
    UniqueID: string;
}
export interface IFormstackSubmissionFieldContainer {
    field: string;
    value: string;
}
export declare const FormstackFieldFormats: {
    readonly ID: "id";
    readonly Label: "label";
    readonly Name: "name";
};
export type FormstackFieldFormat = (typeof FormstackFieldFormats)[keyof typeof FormstackFieldFormats];
/**
 * Make an API request to Formstack
 *
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<any>;
/**
 * Make an API request to paginated Formstack endpoint
 * and return all results
 *
 * @param {(IHookFunctions | IExecuteFunctions)} this
 */
export declare function apiRequestAllItems(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, dataKey: string, query?: IDataObject): Promise<any>;
/**
 * Returns all the available forms
 *
 */
export declare function getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
/**
 * Returns all the fields of a form
 *
 */
export declare function getFields(this: IWebhookFunctions, formID: string): Promise<Record<string, IFormstackFieldDefinitionType>>;
/**
 * Returns all the fields of a form
 *
 */
export declare function getSubmission(this: ILoadOptionsFunctions | IWebhookFunctions, uniqueId: string): Promise<IFormstackSubmissionFieldContainer[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map