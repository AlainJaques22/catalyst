import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
import type { AllFieldsUi, FieldWithPrimaryField, LinksFieldContainer, Resource, Response } from './types';
export declare function actionNetworkApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function handleListing(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, options?: {
    returnAll: true;
}): Promise<IDataObject[]>;
export declare const extractId: (response: LinksFieldContainer) => string;
export declare const makeOsdiLink: (personId: string) => {
    _links: {
        'osdi:person': {
            href: string;
        };
    };
};
export declare const isPrimary: (field: FieldWithPrimaryField) => boolean;
declare function adjustLocation(allFields: AllFieldsUi): AllFieldsUi | {
    location: IDataObject;
    languages_spoken: import("./types").LanguageCodes;
    phone_numbers: {
        phone_numbers_fields: import("./types").PhoneNumberField[];
    };
    postal_addresses: {
        postal_addresses_fields: import("./types").PostalAddressField[];
    };
    target: string;
    email_addresses: import("./types").EmailAddressUi;
};
declare function adjustTargets(allFields: AllFieldsUi): AllFieldsUi | {
    target: {
        name: string;
    }[];
    location: {
        postal_addresses_fields: import("./types").PostalAddressField;
    };
    languages_spoken: import("./types").LanguageCodes;
    phone_numbers: {
        phone_numbers_fields: import("./types").PhoneNumberField[];
    };
    postal_addresses: {
        postal_addresses_fields: import("./types").PostalAddressField[];
    };
    email_addresses: import("./types").EmailAddressUi;
};
export declare const adjustPersonPayload: (...args: any[]) => any;
export declare const adjustPetitionPayload: typeof adjustTargets;
export declare const adjustEventPayload: typeof adjustLocation;
export declare const resourceLoaders: {
    getTags(this: ILoadOptionsFunctions): Promise<{
        name: string;
        value: string;
    }[]>;
    getTaggings(this: ILoadOptionsFunctions): Promise<{
        name: string;
        value: string;
    }[]>;
};
export declare const simplifyResponse: (response: Response, resource: Resource) => {
    language_spoken: any;
    postal_address: {
        address_lines: string;
        region: string;
        primary: boolean;
        locality: string;
        postal_code: string;
        country: string;
        language: import("./types").LanguageCodes;
        location: {
            location_fields: {
                latitude: string;
                longitude: string;
            };
        };
    };
    phone_number: string;
    email_address: string;
    id: string;
} | {
    creator: {
        language_spoken: any;
        postal_address: {
            address_lines: string;
            region: string;
            primary: boolean;
            locality: string;
            postal_code: string;
            country: string;
            language: import("./types").LanguageCodes;
            location: {
                location_fields: {
                    latitude: string;
                    longitude: string;
                };
            };
        };
        phone_number: string;
        email_address: string;
        id: string;
    };
    id: string;
} | {
    id: string;
};
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map