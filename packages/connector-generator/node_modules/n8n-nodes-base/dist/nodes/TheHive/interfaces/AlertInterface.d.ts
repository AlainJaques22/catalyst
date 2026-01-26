import type { IDataObject } from 'n8n-workflow';
export declare const AlertStatuses: {
    readonly NEW: "New";
    readonly UPDATED: "Updated";
    readonly IGNORED: "Ignored";
    readonly IMPORTED: "Imported";
};
export type AlertStatus = (typeof AlertStatuses)[keyof typeof AlertStatuses];
export declare const TLPs: {
    readonly white: 0;
    readonly green: 1;
    readonly amber: 2;
    readonly red: 3;
};
export type TLP = (typeof TLPs)[keyof typeof TLPs];
export interface IAlert {
    id?: string;
    title?: string;
    description?: string;
    severity?: number;
    date?: Date;
    tags?: string[];
    tlp?: TLP;
    status?: AlertStatus;
    type?: string;
    source?: string;
    sourceRef?: string;
    artifacts?: IDataObject[];
    follow?: boolean;
    caseTemplate?: string;
    lastSyncDate?: Date;
    case?: string;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    upadtedAt?: Date;
}
//# sourceMappingURL=AlertInterface.d.ts.map