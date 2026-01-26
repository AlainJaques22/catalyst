import type { IExecuteFunctions, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
export declare function getToken(this: ILoadOptionsFunctions | IExecuteFunctions): Promise<any>;
/**
 * Make an API request to ActiveCampaign
 *
 */
export declare function layoutsApiRequest(this: ILoadOptionsFunctions | IExecuteFunctions): Promise<INodePropertyOptions[]>;
/**
 * Make an API request to ActiveCampaign
 *
 */
export declare function getFields(this: ILoadOptionsFunctions): Promise<any>;
/**
 * Make an API request to ActiveCampaign
 *
 */
export declare function getPortals(this: ILoadOptionsFunctions): Promise<any>;
/**
 * Make an API request to ActiveCampaign
 *
 */
export declare function getScripts(this: ILoadOptionsFunctions): Promise<any>;
export declare function logout(this: ILoadOptionsFunctions | IExecuteFunctions, token: string): Promise<any>;
export declare function parseSort(this: IExecuteFunctions, i: number): object | null;
export declare function parseScripts(this: IExecuteFunctions, i: number): object | null;
export declare function parsePortals(this: IExecuteFunctions, i: number): object | null;
export declare function parseQuery(this: IExecuteFunctions, i: number): object | null;
export declare function parseFields(this: IExecuteFunctions, i: number): object | null;
//# sourceMappingURL=GenericFunctions.d.ts.map