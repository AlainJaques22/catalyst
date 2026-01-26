import type { IExecuteFunctions, IDataObject, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { SalesAccounts } from './types';
export declare function freshworksCrmApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function getAllItemsViewId(this: IExecuteFunctions | ILoadOptionsFunctions, { fromLoadOptions }?: {
    fromLoadOptions: boolean;
}): Promise<string>;
export declare function freshworksCrmApiRequestAllItems(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject[]>;
export declare function handleListing(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject[]>;
/**
 * Load resources for options, except users.
 *
 * See: https://developers.freshworks.com/crm/api/#admin_configuration
 */
export declare function loadResource(this: ILoadOptionsFunctions, resource: string): Promise<{
    name: string;
    value: string;
}[]>;
export declare function adjustAttendees(attendees: [{
    type: string;
    contactId: string;
    userId: string;
}]): ({
    attendee_type: string;
    attendee_id: string;
} | undefined)[];
/**
 * Adjust account data from n8n UI to the format expected by Freshworks CRM API.
 */
export declare function adjustAccounts(additionalFields: IDataObject & SalesAccounts): (IDataObject & SalesAccounts) | {
    sales_accounts: {
        id: number;
        is_primary: boolean;
    }[];
};
export declare function throwOnEmptyUpdate(this: IExecuteFunctions, resource: string): void;
export declare function throwOnEmptyFilter(this: IExecuteFunctions): void;
//# sourceMappingURL=GenericFunctions.d.ts.map