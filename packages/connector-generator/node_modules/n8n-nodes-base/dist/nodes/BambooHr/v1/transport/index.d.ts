import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
/**
 * Make an API request to Mattermost
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, body?: string[] | IDataObject, query?: IDataObject, option?: IDataObject): Promise<any>;
//# sourceMappingURL=index.d.ts.map