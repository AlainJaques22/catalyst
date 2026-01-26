import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { GoogleSheet } from '../../Google/Sheet/v2/helpers/GoogleSheet';
export declare function getSheet(this: IExecuteFunctions, googleSheet: GoogleSheet): Promise<{
    title: string;
    sheetId: number;
}>;
export declare function getGoogleSheet(this: IExecuteFunctions): GoogleSheet;
export declare function getFilteredResults(this: IExecuteFunctions, operationResult: INodeExecutionData[], googleSheet: GoogleSheet, result: {
    title: string;
    sheetId: number;
}, startingRow: number, endingRow: number): Promise<INodeExecutionData[]>;
export declare function getNumberOfRowsLeftFiltered(this: IExecuteFunctions, googleSheet: GoogleSheet, sheetName: string, startingRow: number, endingRow: number): Promise<number>;
export declare function getResults(this: IExecuteFunctions, operationResult: INodeExecutionData[], googleSheet: GoogleSheet, result: {
    title: string;
    sheetId: number;
}, rangeOptions: IDataObject): Promise<INodeExecutionData[]>;
export declare function getRowsLeft(this: IExecuteFunctions, googleSheet: GoogleSheet, sheetName: string, rangeString: string): Promise<number>;
//# sourceMappingURL=evaluationTriggerUtils.d.ts.map