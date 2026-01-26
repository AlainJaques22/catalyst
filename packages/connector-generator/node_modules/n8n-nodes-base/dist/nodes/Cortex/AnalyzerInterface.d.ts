import type { IDataObject } from 'n8n-workflow';
export declare const JobStatuses: {
    readonly WAITING: "Waiting";
    readonly INPROGRESS: "InProgress";
    readonly SUCCESS: "Success";
    readonly FAILURE: "Failure";
    readonly DELETED: "Deleted";
};
export type JobStatus = (typeof JobStatuses)[keyof typeof JobStatuses];
export declare const TLPs: {
    readonly white: 0;
    readonly green: 1;
    readonly amber: 2;
    readonly red: 3;
};
export type TLP = (typeof TLPs)[keyof typeof TLPs];
export declare const ObservableDataTypes: {
    readonly domain: "domain";
    readonly file: "file";
    readonly filename: "filename";
    readonly fqdn: "fqdn";
    readonly hash: "hash";
    readonly ip: "ip";
    readonly mail: "mail";
    readonly mail_subject: "mail_subject";
    readonly other: "other";
    readonly regexp: "regexp";
    readonly registry: "registry";
    readonly uri_path: "uri_path";
    readonly url: "url";
    readonly 'user-agent': "user-agent";
};
export type ObservableDataType = (typeof ObservableDataTypes)[keyof typeof ObservableDataTypes];
export interface IJob {
    id?: string;
    organization?: string;
    analyzerDefinitionId?: string;
    analyzerId?: string;
    analyzerName?: string;
    dataType?: ObservableDataType;
    status?: JobStatus;
    data?: string;
    attachment?: IDataObject;
    parameters?: IDataObject;
    message?: string;
    tlp?: TLP;
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: Date;
    report?: IDataObject | string;
}
export interface IAnalyzer {
    id?: string;
    analyzerDefinitionId?: string;
    name?: string;
    version?: string;
    description?: string;
    author?: string;
    url?: string;
    license?: string;
    dataTypeList?: ObservableDataType[];
    baseConfig?: string;
    jobCache?: number;
    rate?: number;
    rateUnit?: string;
    configuration?: IDataObject;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: Date;
}
export interface IResponder {
    id?: string;
    name?: string;
    version?: string;
    description?: string;
    dataTypeList?: string[];
    maxTlp?: number;
    maxPap?: number;
    cortexIds?: string[] | undefined;
}
//# sourceMappingURL=AnalyzerInterface.d.ts.map