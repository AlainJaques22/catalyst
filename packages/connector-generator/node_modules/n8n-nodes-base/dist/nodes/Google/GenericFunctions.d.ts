import { type IExecuteFunctions, type ILoadOptionsFunctions, type ICredentialTestFunctions, type IDataObject, type IPollFunctions } from 'n8n-workflow';
declare const googleServiceAccountScopes: {
    bigquery: string[];
    books: string[];
    chat: string[];
    docs: string[];
    drive: string[];
    gmail: string[];
    sheetV1: string[];
    sheetV2: string[];
    slides: string[];
    translate: string[];
    firestore: string[];
    vertex: string[];
};
type GoogleServiceAccount = keyof typeof googleServiceAccountScopes;
export declare function getGoogleAccessToken(this: IExecuteFunctions | ILoadOptionsFunctions | ICredentialTestFunctions | IPollFunctions, credentials: IDataObject, service: GoogleServiceAccount): Promise<IDataObject>;
export declare function validateAndSetDate(filter: IDataObject, key: string, timezone: string, context: IExecuteFunctions): void;
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map