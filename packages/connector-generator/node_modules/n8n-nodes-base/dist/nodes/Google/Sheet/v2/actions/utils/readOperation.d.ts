import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { type GoogleSheet } from '../../helpers/GoogleSheet';
export declare function readSheet(this: IExecuteFunctions, sheet: GoogleSheet, sheetName: string, itemIndex: number, returnData: INodeExecutionData[], nodeVersion: number, items: INodeExecutionData[], rangeString?: string, additionalOptions?: IDataObject): Promise<INodeExecutionData[]>;
//# sourceMappingURL=readOperation.d.ts.map