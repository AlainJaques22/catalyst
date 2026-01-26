import { type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import type { GoogleSheet } from '../../helpers/GoogleSheet';
import type { SheetProperties } from '../../helpers/GoogleSheets.types';
export declare const description: SheetProperties;
export declare function execute(this: IExecuteFunctions, sheet: GoogleSheet, range: string, sheetId: string): Promise<INodeExecutionData[]>;
//# sourceMappingURL=append.operation.d.ts.map