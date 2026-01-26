import type { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, INodePropertyOptions, IHttpRequestMethods } from 'n8n-workflow';
/**
 * Make an API request to Stripe
 *
 */
export declare function stripeApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any>;
/**
 * Convert n8n's `fixedCollection` metadata object into a Stripe API request metadata object.
 */
export declare function adjustMetadata(fields: {
    metadata?: {
        metadataProperties: Array<{
            key: string;
            value: string;
        }>;
    };
}): {
    metadata?: {
        metadataProperties: Array<{
            key: string;
            value: string;
        }>;
    };
} | {
    metadata: Record<string, string>;
};
/**
 * Make n8n's charge fields compliant with the Stripe API request object.
 */
export declare const adjustChargeFields: (...args: any[]) => any;
/**
 * Make n8n's customer fields compliant with the Stripe API request object.
 */
export declare const adjustCustomerFields: (...args: any[]) => any;
/**
 * Load a resource so it can be selected by name from a dropdown.
 */
export declare function loadResource(this: ILoadOptionsFunctions, resource: 'charge' | 'customer' | 'source'): Promise<INodePropertyOptions[]>;
/**
 * Handles a Stripe listing by returning all items or up to a limit.
 */
export declare function handleListing(this: IExecuteFunctions, resource: string, i: number, qs?: IDataObject): Promise<IDataObject[]>;
//# sourceMappingURL=helpers.d.ts.map