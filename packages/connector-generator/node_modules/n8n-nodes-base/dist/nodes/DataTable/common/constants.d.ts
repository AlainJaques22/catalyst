import type { DataTableColumnJsType } from 'n8n-workflow';
export declare const ANY_CONDITION = "anyCondition";
export declare const ALL_CONDITIONS = "allConditions";
export declare const ROWS_LIMIT_DEFAULT = 50;
export type FilterType = typeof ANY_CONDITION | typeof ALL_CONDITIONS;
export type FieldEntry = {
    keyName: string;
    condition: 'isEmpty' | 'isNotEmpty' | 'isTrue' | 'isFalse';
} | {
    keyName: string;
    condition?: 'eq' | 'neq' | 'like' | 'ilike' | 'gt' | 'gte' | 'lt' | 'lte';
    keyValue: DataTableColumnJsType;
};
//# sourceMappingURL=constants.d.ts.map