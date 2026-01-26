import type { IHourlyRateDto, IMembershipDto } from './CommonDtos';
declare const Estimates: {
    readonly AUTO: "AUTO";
    readonly MANUAL: "MANUAL";
};
type EstimateEnum = (typeof Estimates)[keyof typeof Estimates];
interface IEstimateDto {
    estimate: string;
    type: EstimateEnum;
}
export interface IProjectDto {
    archived: boolean;
    billable: boolean;
    clientId: string;
    clientName: string | undefined;
    color: string;
    duration: string | undefined;
    estimate: IEstimateDto | undefined;
    hourlyRate: IHourlyRateDto | undefined;
    id: string;
    memberships: IMembershipDto[] | undefined;
    name: string;
    isPublic: boolean;
    workspaceId: string;
    note: string | undefined;
}
export interface IProjectRequest {
    name: string;
    clientId: string;
    isPublic: boolean;
    estimate: IEstimateDto;
    color: string;
    note: string;
    billable: boolean;
    hourlyRate: IHourlyRateDto;
    memberships: IMembershipDto;
    tasks: ITaskDto;
}
declare const TaskStatuses: {
    readonly ACTIVE: "ACTIVE";
    readonly DONE: "DONE";
};
type TaskStatusEnum = (typeof TaskStatuses)[keyof typeof TaskStatuses];
export interface ITaskDto {
    assigneeIds: object;
    estimate: string;
    id: string;
    name: string;
    projectId: string;
    status: TaskStatusEnum;
    'is-active': boolean;
}
export {};
//# sourceMappingURL=ProjectInterfaces.d.ts.map