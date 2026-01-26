import { DateTime } from 'luxon';
import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INode, INodeExecutionData, INodePropertyOptions, IPollFunctions } from 'n8n-workflow';
import type { IEmail } from '../../../utils/sendAndWait/interfaces';
export interface IAttachments {
    type: string;
    name: string;
    content: string;
}
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
export declare function parseRawEmail(this: IExecuteFunctions | IPollFunctions, messageData: any, dataPropertyNameDownload: string): Promise<INodeExecutionData>;
export declare function encodeEmail(email: IEmail): Promise<string>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function extractEmail(s: string): string;
export declare const prepareTimestamp: (node: INode, itemIndex: number, query: string, dateValue: string | number | DateTime, label: "after" | "before") => string;
export declare function prepareQuery(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, fields: IDataObject, itemIndex: number): IDataObject;
export declare function prepareEmailsInput(this: IExecuteFunctions | ILoadOptionsFunctions, input: string, fieldName: string, itemIndex: number): string;
export declare function prepareEmailBody(this: IExecuteFunctions | ILoadOptionsFunctions, itemIndex: number, appendAttribution?: boolean, instanceId?: string): {
    body: string;
    htmlBody: string;
};
export declare function prepareEmailAttachments(this: IExecuteFunctions, options: IDataObject, itemIndex: number): Promise<IDataObject[]>;
export declare function unescapeSnippets(items: INodeExecutionData[]): INodeExecutionData[];
export declare function simplifyOutput(this: IExecuteFunctions | IPollFunctions, data: IDataObject[]): Promise<IDataObject[]>;
/**
 * Get all the labels to display them to user so that they can select them easily
 */
export declare function getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map