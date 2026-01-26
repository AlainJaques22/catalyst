import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
export declare function errorMapper(this: IExecuteFunctions, error: Error, itemIndex: number, context?: IDataObject): NodeOperationError;
export declare function escapeSpecialCharacters(str: string): string;
//# sourceMappingURL=utils.d.ts.map