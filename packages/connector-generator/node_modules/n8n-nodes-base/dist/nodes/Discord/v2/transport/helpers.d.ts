import type { IExecuteFunctions, IExecuteSingleFunctions, IHookFunctions, ILoadOptionsFunctions, IRequestOptions } from 'n8n-workflow';
export declare const getCredentialsType: (authentication: string) => string;
export declare function requestApi(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, options: IRequestOptions, credentialType: string, endpoint: string): Promise<any>;
//# sourceMappingURL=helpers.d.ts.map