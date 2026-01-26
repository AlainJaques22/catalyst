import type { AssignmentCollectionValue, FieldType, IDataObject, IExecuteFunctions, INode, INodeExecutionData, ISupplyDataFunctions } from 'n8n-workflow';
import type { SetNodeOptions } from './interfaces';
export declare function composeReturnItem(this: IExecuteFunctions | ISupplyDataFunctions, itemIndex: number, inputItem: INodeExecutionData, newFields: IDataObject, options: SetNodeOptions, nodeVersion: number): INodeExecutionData;
export declare const parseJsonParameter: (jsonData: string | IDataObject, node: INode, i: number, entryName?: string) => IDataObject;
export declare const validateEntry: (name: string, type: FieldType, value: unknown, node: INode, itemIndex: number, ignoreErrors?: boolean, nodeVersion?: number) => {
    name: string;
    value: any;
};
export declare function resolveRawData(this: IExecuteFunctions | ISupplyDataFunctions, rawData: string, i: number): string;
export declare function prepareReturnItem(context: IExecuteFunctions | ISupplyDataFunctions, value: AssignmentCollectionValue, itemIndex: number, item: INodeExecutionData, node: INode, options: SetNodeOptions): INodeExecutionData;
//# sourceMappingURL=utils.d.ts.map