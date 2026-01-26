import type FormData from 'form-data';
import type { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function mistralApiRequest(this: IExecuteFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject | FormData, qs?: IDataObject): Promise<any>;
export declare function encodeBinaryData(this: IExecuteFunctions, itemIndex: number): Promise<{
    dataUrl: string;
    fileName: string | undefined;
}>;
export declare function processResponseData(response: IDataObject): IDataObject;
//# sourceMappingURL=GenericFunctions.d.ts.map