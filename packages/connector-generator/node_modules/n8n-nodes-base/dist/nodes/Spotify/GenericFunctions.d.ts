import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Spotify
 *
 */
export declare function spotifyApiRequest(this: IHookFunctions | IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject, uri?: string): Promise<any>;
export declare function spotifyApiRequestAllItems(this: IHookFunctions | IExecuteFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body: object, query?: IDataObject): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map