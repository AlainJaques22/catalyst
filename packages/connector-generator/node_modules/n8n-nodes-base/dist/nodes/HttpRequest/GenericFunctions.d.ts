import { type ICredentialDataDecryptedObject, type IDataObject, type INodeExecutionData, type INodeProperties, type IOAuth2Options, type IRequestOptions } from 'n8n-workflow';
import type { HttpSslAuthCredentials } from './interfaces';
export type BodyParameter = {
    name: string;
    value: string;
    parameterType?: 'formBinaryData' | 'formData';
};
export type IAuthDataSanitizeKeys = {
    [key: string]: string[];
};
export declare const replaceNullValues: (item: INodeExecutionData) => INodeExecutionData;
export declare const REDACTED = "**hidden**";
export declare function sanitizeUiMessage(request: IRequestOptions, authDataKeys: IAuthDataSanitizeKeys, secrets?: string[]): IDataObject;
export declare function getSecrets(properties: INodeProperties[], credentials: ICredentialDataDecryptedObject): string[];
export declare const getOAuth2AdditionalParameters: (nodeCredentialType: string) => IOAuth2Options;
export declare const binaryContentTypes: string[];
export type BodyParametersReducer = (acc: IDataObject, cur: {
    name: string;
    value: string;
}) => Promise<IDataObject>;
export declare function reduceAsync<T, R>(arr: T[], reducer: (acc: Awaited<Promise<R>>, cur: T) => Promise<R>, init?: Promise<R>): Promise<R>;
export declare const prepareRequestBody: (parameters: BodyParameter[], bodyType: string, version: number, defaultReducer: BodyParametersReducer) => Promise<{}>;
export declare const setAgentOptions: (requestOptions: IRequestOptions, sslCertificates: HttpSslAuthCredentials | undefined) => void;
export declare const updadeQueryParameterConfig: (version: number) => ((qs: IDataObject, name: string, value: string) => string) | ((qs: {
    [key: string]: any;
}, name: string, value: any) => void);
//# sourceMappingURL=GenericFunctions.d.ts.map