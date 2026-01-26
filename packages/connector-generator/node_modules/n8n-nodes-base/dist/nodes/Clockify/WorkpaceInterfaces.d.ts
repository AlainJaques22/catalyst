import type { IHourlyRateDto, IMembershipDto } from './CommonDtos';
export declare const AdminOnlyPages: {
    readonly PROJECT: "PROJECT";
    readonly TEAM: "TEAM";
    readonly REPORTS: "REPORTS";
};
export type AdminOnlyPagesEnum = (typeof AdminOnlyPages)[keyof typeof AdminOnlyPages];
export declare const DaysOfWeek: {
    readonly MONDAY: "MONDAY";
    readonly TUESDAY: "TUESDAY";
    readonly WEDNESDAY: "WEDNESDAY";
    readonly THURSDAY: "THURSDAY";
    readonly FRIDAY: "FRIDAY";
    readonly SATURDAY: "SATURDAY";
    readonly SUNDAY: "SUNDAY";
};
export type DaysOfWeekEnum = (typeof DaysOfWeek)[keyof typeof DaysOfWeek];
export declare const DatePeriods: {
    readonly DAYS: "DAYS";
    readonly WEEKS: "WEEKS";
    readonly MONTHS: "MONTHS";
};
export type DatePeriodEnum = (typeof DatePeriods)[keyof typeof DatePeriods];
export declare const AutomaticLockTypes: {
    readonly WEEKLY: "WEEKLY";
    readonly MONTHLY: "MONTHLY";
    readonly OLDER_THAN: "OLDER_THAN";
};
export type AutomaticLockTypeEnum = (typeof AutomaticLockTypes)[keyof typeof AutomaticLockTypes];
interface IAutomaticLockDto {
    changeDay: DaysOfWeekEnum;
    dayOfMonth: number;
    firstDay: DaysOfWeekEnum;
    olderThanPeriod: DatePeriodEnum;
    olderThanValue: number;
    type: AutomaticLockTypeEnum;
}
interface IRound {
    minutes: string;
    round: string;
}
interface IWorkspaceSettingsDto {
    adminOnlyPages: AdminOnlyPagesEnum[];
    automaticLock: IAutomaticLockDto;
    canSeeTimeSheet: boolean;
    defaultBillableProjects: boolean;
    forceDescription: boolean;
    forceProjects: boolean;
    forceTags: boolean;
    forceTasks: boolean;
    lockTimeEntries: string;
    onlyAdminsCreateProject: boolean;
    onlyAdminsCreateTag: boolean;
    onlyAdminsSeeAllTimeEntries: boolean;
    onlyAdminsSeeBillableRates: boolean;
    onlyAdminsSeeDashboard: boolean;
    onlyAdminsSeePublicProjectsEntries: boolean;
    projectFavorites: boolean;
    projectGroupingLabel: string;
    projectPickerSpecialFilter: boolean;
    round: IRound;
    timeRoundingInReports: boolean;
    trackTimeDownToSecond: boolean;
}
export interface IWorkspaceDto {
    hourlyRate: IHourlyRateDto;
    id: string;
    imageUrl: string;
    memberships: IMembershipDto[];
    name: string;
    workspaceSettings: IWorkspaceSettingsDto;
}
export interface IClientDto {
    id: string;
    name: string;
    workspaceId: string;
}
export {};
//# sourceMappingURL=WorkpaceInterfaces.d.ts.map