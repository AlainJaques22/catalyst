import type { IAttachment } from './ObservableInterface';
export declare const LogStatuses: {
    readonly OK: "Ok";
    readonly DELETED: "Deleted";
};
export type LogStatus = (typeof LogStatuses)[keyof typeof LogStatuses];
export interface ILog {
    id?: string;
    message?: string;
    startDate?: Date;
    status?: LogStatus;
    attachment?: IAttachment;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    upadtedAt?: Date;
}
//# sourceMappingURL=LogInterface.d.ts.map