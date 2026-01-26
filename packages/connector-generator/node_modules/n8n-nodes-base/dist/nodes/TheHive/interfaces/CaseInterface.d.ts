import type { IDataObject } from 'n8n-workflow';
import type { TLP } from './AlertInterface';
export interface ICase {
    id?: string;
    title?: string;
    description?: string;
    severity?: number;
    startDate?: Date;
    owner?: string;
    flag?: boolean;
    tlp?: TLP;
    tags?: string[];
    resolutionStatus?: CaseResolutionStatus;
    impactStatus?: CaseImpactStatus;
    summary?: string;
    endDate?: Date;
    metrics?: IDataObject;
    status?: CaseStatus;
    caseId?: number;
    mergeInto?: string;
    mergeFrom?: string[];
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    upadtedAt?: Date;
}
export declare const CaseStatuses: {
    readonly OPEN: "Open";
    readonly RESOLVED: "Resolved";
    readonly DELETED: "Deleted";
};
export type CaseStatus = (typeof CaseStatuses)[keyof typeof CaseStatuses];
export declare const CaseResolutionStatuses: {
    readonly INDETERMINATE: "Indeterminate";
    readonly FALSEPOSITIVE: "FalsePositive";
    readonly TRUEPOSITIVE: "TruePositive";
    readonly OTHER: "Other";
    readonly DUPLICATED: "Duplicated";
};
export type CaseResolutionStatus = (typeof CaseResolutionStatuses)[keyof typeof CaseResolutionStatuses];
export declare const CaseImpactStatuses: {
    readonly NOIMPACT: "NoImpact";
    readonly WITHIMPACT: "WithImpact";
    readonly NOTAPPLICABLE: "NotApplicable";
};
export type CaseImpactStatus = (typeof CaseImpactStatuses)[keyof typeof CaseImpactStatuses];
//# sourceMappingURL=CaseInterface.d.ts.map