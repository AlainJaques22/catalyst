import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { SplunkError, SplunkFeedResponse } from './interfaces';
export declare function formatEntry(entry: any, doNotFormatContent?: boolean): any;
export declare function parseXml(xml: string): Promise<unknown>;
export declare function extractErrorDescription(rawError: SplunkError): SplunkError;
export declare function toUnixEpoch(timestamp: string): number;
export declare function formatFeed(responseData: SplunkFeedResponse): any[];
export declare function setReturnAllOrLimit(this: IExecuteFunctions, qs: IDataObject): void;
export declare function populate(source: IDataObject, destination: IDataObject): void;
export declare function getId(this: IExecuteFunctions, i: number, idType: 'userId' | 'searchJobId' | 'searchConfigurationId', endpoint: string): string | undefined;
//# sourceMappingURL=utils.d.ts.map