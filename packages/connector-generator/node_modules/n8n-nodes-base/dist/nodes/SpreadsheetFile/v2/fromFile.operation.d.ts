import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
export declare const description: INodeProperties[];
export interface FromFileOptions {
    failOnCsvBufferError?: boolean;
}
export declare function execute(this: IExecuteFunctions, items: INodeExecutionData[], fileFormatProperty?: string, { failOnCsvBufferError }?: FromFileOptions): Promise<INodeExecutionData[]>;
//# sourceMappingURL=fromFile.operation.d.ts.map