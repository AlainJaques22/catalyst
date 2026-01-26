import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
export declare const metricHandlers: {
    customMetrics(this: IExecuteFunctions, i: number): Promise<IDataObject>;
    toolsUsed(this: IExecuteFunctions, i: number): Promise<IDataObject>;
    categorization(this: IExecuteFunctions, i: number): Promise<IDataObject>;
    stringSimilarity(this: IExecuteFunctions, i: number): Promise<IDataObject>;
    helpfulness(this: IExecuteFunctions, i: number): Promise<IDataObject>;
    correctness(this: IExecuteFunctions, i: number): Promise<IDataObject>;
};
//# sourceMappingURL=metricHandlers.d.ts.map