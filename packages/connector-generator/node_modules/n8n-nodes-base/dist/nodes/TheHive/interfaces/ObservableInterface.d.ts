import type { TLP } from './AlertInterface';
export declare const ObservableStatuses: {
    readonly OK: "Ok";
    readonly DELETED: "Deleted";
};
export type ObservableStatus = (typeof ObservableStatuses)[keyof typeof ObservableStatuses];
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
export interface IAttachment {
    name?: string;
    size?: number;
    id?: string;
    contentType?: string;
    hashes: string[];
}
export interface IObservable {
    id?: string;
    data?: string;
    attachment?: IAttachment;
    dataType?: ObservableDataType;
    message?: string;
    startDate?: Date;
    tlp?: TLP;
    ioc?: boolean;
    status?: ObservableStatus;
    tags: string[];
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    upadtedAt?: Date;
}
//# sourceMappingURL=ObservableInterface.d.ts.map