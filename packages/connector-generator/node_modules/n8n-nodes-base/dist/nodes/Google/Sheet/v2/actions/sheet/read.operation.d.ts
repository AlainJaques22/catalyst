import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import type { GoogleSheet } from '../../helpers/GoogleSheet';
import type { SheetProperties } from '../../helpers/GoogleSheets.types';
export declare const readFilter: INodeProperties;
export declare const description: SheetProperties;
export declare function execute(this: IExecuteFunctions, sheet: GoogleSheet, sheetName: string): Promise<INodeExecutionData[]>;
//# sourceMappingURL=read.operation.d.ts.map