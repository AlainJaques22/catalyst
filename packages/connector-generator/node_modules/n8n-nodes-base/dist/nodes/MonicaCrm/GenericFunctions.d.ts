import type { IExecuteFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { LoaderGetResponse } from './types';
export declare function monicaCrmApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function monicaCrmApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, { forLoader }?: {
    forLoader: boolean;
}): Promise<IDataObject[]>;
/**
 * Get day, month, and year from the n8n UI datepicker.
 */
export declare const getDateParts: (date: string) => number[];
export declare const toOptions: (response: LoaderGetResponse) => {
    value: string;
    name: string;
}[];
//# sourceMappingURL=GenericFunctions.d.ts.map