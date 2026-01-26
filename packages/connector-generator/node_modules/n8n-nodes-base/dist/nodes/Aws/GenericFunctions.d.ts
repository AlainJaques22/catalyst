import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { AwsAssumeRoleCredentialsType, AwsIamCredentialsType } from '../../credentials/common/aws/types';
export declare function getAwsCredentials(context: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions): Promise<{
    credentials: AwsIamCredentialsType | AwsAssumeRoleCredentialsType;
    credentialsType: "aws" | "awsAssumeRole";
}>;
export declare function awsApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, service: string, method: IHttpRequestMethods, path: string, body?: string, headers?: object): Promise<any>;
export declare function awsApiRequestREST(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, service: string, method: IHttpRequestMethods, path: string, body?: string, headers?: object): Promise<any>;
export declare function awsApiRequestSOAP(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, service: string, method: IHttpRequestMethods, path: string, body?: string, headers?: object): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map