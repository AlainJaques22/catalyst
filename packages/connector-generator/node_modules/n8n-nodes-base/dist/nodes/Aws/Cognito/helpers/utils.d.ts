import type { IHttpRequestOptions, ILoadOptionsFunctions, IExecuteSingleFunctions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
import type { IUser, IUserPool } from './interfaces';
export declare function preSendStringifyBody(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function getUserPool(this: IExecuteSingleFunctions | ILoadOptionsFunctions, userPoolId: string): Promise<IUserPool>;
export declare function getUsersInGroup(this: IExecuteSingleFunctions | ILoadOptionsFunctions, groupName: string, userPoolId: string): Promise<IUser[]>;
export declare function getUserNameFromExistingUsers(this: IExecuteSingleFunctions | ILoadOptionsFunctions, userName: string, userPoolId: string, isEmailOrPhone: boolean): Promise<string | undefined>;
export declare function preSendUserFields(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function processGroup(this: IExecuteSingleFunctions, items: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function validateArn(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function simplifyUserPool(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function simplifyUser(this: IExecuteSingleFunctions, items: INodeExecutionData[], _response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
export declare function preSendAttributes(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
export declare function preSendDesiredDeliveryMediums(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
//# sourceMappingURL=utils.d.ts.map