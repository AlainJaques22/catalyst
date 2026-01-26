import { DateTime } from 'luxon';
import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject, IHttpRequestMethods, IPollFunctions } from 'n8n-workflow';
export declare function microsoftApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject, option?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItemsSkip(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function microsoftApiRequestAllItemsDelta(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, link: string, lastDate: DateTime, eventType: string): Promise<any>;
export declare function getPath(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, itemId: string): Promise<string>;
//# sourceMappingURL=GenericFunctions.d.ts.map