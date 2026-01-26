import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
import type { IAirtopResponse } from './types';
export declare function apiRequest<T extends IAirtopResponse = IAirtopResponse>(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<T>;
//# sourceMappingURL=index.d.ts.map