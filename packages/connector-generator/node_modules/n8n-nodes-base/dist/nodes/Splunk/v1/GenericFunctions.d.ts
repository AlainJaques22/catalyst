import type { IExecuteFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { type SplunkError, type SplunkFeedResponse, type SplunkResultResponse, type SplunkSearchResponse } from './types';
export declare function formatSearch(responseData: SplunkSearchResponse): any[];
export declare function parseXml(xml: string): Promise<unknown>;
export declare function extractErrorDescription(rawError: SplunkError): SplunkError;
export declare function toUnixEpoch(timestamp: string): number;
export declare function splunkApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function formatFeed(responseData: SplunkFeedResponse): any[];
export declare function formatResults(responseData: SplunkResultResponse): any[];
/**
 * Set count of entries to retrieve.
 */
export declare function setCount(this: IExecuteFunctions, qs: IDataObject): void;
export declare function populate(source: IDataObject, destination: IDataObject): void;
/**
 * Retrieve an ID, with tolerance when contained in an endpoint.
 * The field `id` in Splunk API responses is a full link.
 */
export declare function getId(this: IExecuteFunctions, i: number, idType: 'userId' | 'searchJobId' | 'searchConfigurationId', endpoint: string): string | undefined;
//# sourceMappingURL=GenericFunctions.d.ts.map