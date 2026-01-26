import type { IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function apiTemplateIoApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, qs?: {}, body?: {}): Promise<any>;
export declare function loadResource(this: ILoadOptionsFunctions, resource: 'image' | 'pdf'): Promise<any>;
export declare function validateJSON(json: string | object | undefined): any;
export declare function downloadImage(this: IExecuteFunctions, url: string): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map