import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import * as fromFile from '../../../SpreadsheetFile/v2/fromFile.operation';
export declare const operations: string[];
export declare const description: INodeProperties[];
export declare function execute(this: IExecuteFunctions, items: INodeExecutionData[], fileFormatProperty: string, options?: fromFile.FromFileOptions): Promise<INodeExecutionData[]>;
//# sourceMappingURL=spreadsheet.operation.d.ts.map