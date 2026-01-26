import type { IExecuteFunctions, INodeExecutionData, GenericValue } from 'n8n-workflow';
export declare const prepareFieldsArray: (fields: string | string[], fieldName?: string) => string[];
export declare function sortByCode(this: IExecuteFunctions, items: INodeExecutionData[]): INodeExecutionData[];
export declare function addBinariesToItem(newItem: INodeExecutionData, items: INodeExecutionData[], uniqueOnly?: boolean): INodeExecutionData;
export declare function typeToNumber(value: GenericValue): number;
//# sourceMappingURL=utils.d.ts.map