import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
export declare function isObject(maybe: unknown): maybe is {
    [key: string]: unknown;
};
/**
 * Stringify any non-standard JS objects (e.g. `Date`, `RegExp`) inside output items at any depth.
 */
export declare function standardizeOutput(output: IDataObject): IDataObject;
export declare const addPostExecutionWarning: (context: IExecuteFunctions, returnData: INodeExecutionData[], inputItemsLength: number) => void;
//# sourceMappingURL=utils.d.ts.map