import type { ICredentialDataDecryptedObject, IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
import type { AddressFixedCollection, EmailFixedCollection, EmailsFixedCollection, PhoneNumbersFixedCollection } from './utils/types';
/**
 * Make an authenticated API request to Copper.
 */
export declare function copperApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<any>;
/**
 * Creates a secret from the credentials
 *
 */
export declare function getAutomaticSecret(credentials: ICredentialDataDecryptedObject): string;
export declare function adjustAddress(fixedCollection: AddressFixedCollection): {
    address?: object;
};
export declare function adjustPhoneNumbers(fixedCollection: PhoneNumbersFixedCollection): {
    phone_numbers?: object;
};
export declare function adjustEmails(fixedCollection: EmailsFixedCollection): {
    emails?: object;
};
export declare function adjustProjectIds(fields: {
    project_ids?: string;
}): {
    project_ids?: string;
} | {
    project_ids?: string[];
};
export declare function adjustEmail(fixedCollection: EmailFixedCollection): {
    email?: object;
};
export declare const adjustCompanyFields: (...args: any[]) => any;
export declare const adjustLeadFields: (...args: any[]) => any;
export declare const adjustPersonFields: (...args: any[]) => any;
export declare const adjustTaskFields: (...args: any[]) => any;
/**
 * Make an authenticated API request to Copper and return all items.
 */
export declare function copperApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject, qs?: IDataObject, uri?: string, option?: IDataObject): Promise<IDataObject[]>;
/**
 * Handle a Copper listing by returning all items or up to a limit.
 */
export declare function handleListing(this: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, qs?: IDataObject, body?: IDataObject, uri?: string): Promise<IDataObject[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map