import type { TColumnType, TDateTimeFormat, TInheritColumnKey } from './types';
export type ColumnType = keyof typeof schema.columnTypes;
export declare const schema: {
    rowFetchSegmentLimit: number;
    dateTimeFormat: TDateTimeFormat;
    internalNames: { [key in TInheritColumnKey]: ColumnType; };
    columnTypes: { [key in TColumnType]: string; };
    nonUpdateAbleColumnTypes: { [key in ColumnType]: ColumnType; };
};
//# sourceMappingURL=Schema.d.ts.map