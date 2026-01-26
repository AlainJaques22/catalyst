import { type INodeProperties, type IDataObject, type IExecuteFunctions } from 'n8n-workflow';
type ResponseOptimizerFn = (x: IDataObject | IDataObject[] | string) => IDataObject | IDataObject[] | string;
export declare const configureResponseOptimizer: (ctx: IExecuteFunctions, itemIndex: number) => ResponseOptimizerFn;
export declare const optimizeResponseProperties: INodeProperties[];
export {};
//# sourceMappingURL=optimizeResponse.d.ts.map