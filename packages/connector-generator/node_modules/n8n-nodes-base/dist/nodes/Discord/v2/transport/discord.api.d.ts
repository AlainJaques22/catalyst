import type FormData from 'form-data';
import type { IDataObject, IExecuteFunctions, IExecuteSingleFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function discordApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function discordApiMultiPartRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, formData: FormData): Promise<IDataObject[]>;
//# sourceMappingURL=discord.api.d.ts.map