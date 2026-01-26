import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions, INodeListSearchResult, IPollFunctions } from 'n8n-workflow';
import type { RecurringEventInstance } from './EventInterface';
export declare function googleApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, method: IHttpRequestMethods, resource: string, body?: any, qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function googleApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions, propertyName: string, method: IHttpRequestMethods, endpoint: string, body?: any, query?: IDataObject): Promise<any>;
export declare function encodeURIComponentOnce(uri: string): string;
export declare function getCalendars(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
export declare const TIMEZONE_VALIDATION_REGEX: string;
export declare function getTimezones(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
export type RecurrentEvent = {
    start: {
        date?: string;
        dateTime?: string;
        timeZone?: string;
    };
    end: {
        date?: string;
        dateTime?: string;
        timeZone?: string;
    };
    recurrence: string[];
    nextOccurrence?: {
        start: {
            dateTime: string;
            timeZone?: string;
        };
        end: {
            dateTime: string;
            timeZone?: string;
        };
    };
};
export declare function addNextOccurrence(items: RecurrentEvent[]): RecurrentEvent[];
export declare function addTimezoneToDate(date: string, timezone: string): string;
export declare function googleApiRequestWithRetries({ context, method, resource, body, qs, uri, headers, itemIndex, }: {
    context: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions;
    method: IHttpRequestMethods;
    resource: string;
    body?: any;
    qs?: IDataObject;
    uri?: string;
    headers?: IDataObject;
    itemIndex?: number;
}): Promise<any>;
export declare const eventExtendYearIntoFuture: (data: RecurringEventInstance[], timezone: string, currentYear?: number) => boolean;
export declare function dateObjectToISO<T>(date: T): string;
//# sourceMappingURL=GenericFunctions.d.ts.map