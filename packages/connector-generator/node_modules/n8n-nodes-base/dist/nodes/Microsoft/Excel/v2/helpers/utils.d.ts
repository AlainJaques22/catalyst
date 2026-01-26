import type { IExecuteFunctions, INode, INodeExecutionData } from 'n8n-workflow';
import type { ExcelResponse, SheetData, UpdateSummary } from './interfaces';
export declare const CELL_REGEX: RegExp;
type PrepareOutputConfig = {
    rawData: boolean;
    dataProperty?: string;
    keyRow?: number;
    firstDataRow?: number;
    columnsRow?: string[];
    updatedRows?: number[];
};
export declare function prepareOutput(this: IExecuteFunctions, node: INode, responseData: ExcelResponse, config: PrepareOutputConfig): INodeExecutionData[];
export declare function updateByDefinedValues(this: IExecuteFunctions, itemslength: number, sheetData: SheetData, updateAllOccurences: boolean): UpdateSummary;
export declare function updateByAutoMaping(items: INodeExecutionData[], sheetData: SheetData, columnToMatchOn: string, updateAllOccurences?: boolean): UpdateSummary;
export declare const checkRange: (node: INode, range: string) => void;
/**
 * Parses strings like A1:B5 to Sheet!A1:B5 into detailed range information
 * If the range does not have an end, it will be assumed to be the same as the start. E.g. A1 will be parsed as A1:A1
 */
export declare const parseAddress: (addressOrRange: string) => {
    cellFrom: {
        value: string;
        column: string;
        row: string;
    };
    cellTo: {
        value: string;
        column: string;
        row: string;
    };
};
/**
 * Finds a next column in the sequence of columns in Excel
 * Example:
 * A -> B
 * Z -> AA
 */
export declare const nextExcelColumn: (col: string, offset?: number) => string;
/**
 * Accepts a used range and finds a new area under the used range.
 * Changes the new area based on the number of columns and rows inserted.
 * Example:
 * A1:B2 -> A3:B4
 */
export declare const findAppendRange: (usedRange: string, { cols, rows }: {
    cols: number;
    rows: number;
}) => string;
export {};
//# sourceMappingURL=utils.d.ts.map