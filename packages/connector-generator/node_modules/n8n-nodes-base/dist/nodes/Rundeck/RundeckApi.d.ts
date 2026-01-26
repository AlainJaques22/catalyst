import type { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
export interface RundeckCredentials {
    url: string;
    token: string;
}
export declare class RundeckApi {
    private credentials?;
    private executeFunctions;
    constructor(executeFunctions: IExecuteFunctions);
    protected request(method: IHttpRequestMethods, endpoint: string, body: IDataObject, query: IDataObject): Promise<any>;
    init(): Promise<void>;
    executeJob(jobId: string, args: IDataObject[], filter?: string): Promise<IDataObject>;
    getJobMetadata(jobId: string): Promise<IDataObject>;
}
//# sourceMappingURL=RundeckApi.d.ts.map