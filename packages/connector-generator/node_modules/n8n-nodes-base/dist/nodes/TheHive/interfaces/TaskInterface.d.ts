export interface ITask {
    id?: string;
    title?: string;
    status?: TaskStatus;
    flag?: boolean;
    owner?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    upadtedAt?: Date;
}
export declare const TaskStatuses: {
    readonly WAITING: "Waiting";
    readonly INPROGRESS: "InProgress";
    readonly COMPLETED: "Completed";
    readonly CANCEL: "Cancel";
};
export type TaskStatus = (typeof TaskStatuses)[keyof typeof TaskStatuses];
//# sourceMappingURL=TaskInterface.d.ts.map