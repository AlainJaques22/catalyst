export interface IHourlyRateDto {
    amount: number;
    currency: string;
}
declare const MembershipStatuses: {
    readonly PENDING: "PENDING";
    readonly ACTIVE: "ACTIVE";
    readonly DECLINED: "DECLINED";
    readonly INACTIVE: "INACTIVE";
};
type MembershipStatusEnum = (typeof MembershipStatuses)[keyof typeof MembershipStatuses];
declare const TaskStatuses: {
    readonly ACTIVE: "ACTIVE";
    readonly DONE: "DONE";
};
type TaskStatusEnum = (typeof TaskStatuses)[keyof typeof TaskStatuses];
export interface IMembershipDto {
    hourlyRate: IHourlyRateDto;
    membershipStatus: MembershipStatusEnum;
    membershipType: string;
    targetId: string;
    userId: string;
}
export interface ITagDto {
    id: string;
    name: any;
    workspaceId: string;
    archived: boolean;
}
export interface ITaskDto {
    assigneeIds: object;
    estimate: string;
    id: string;
    name: any;
    workspaceId: string;
    projectId: string;
    'is-active': boolean;
    status: TaskStatusEnum;
}
export interface ITimeIntervalDto {
    duration: string;
    end: string;
    start: string;
}
export {};
//# sourceMappingURL=CommonDtos.d.ts.map