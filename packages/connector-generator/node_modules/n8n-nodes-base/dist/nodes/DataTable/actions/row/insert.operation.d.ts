import type { IDataTableProjectService, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
export declare const FIELD: string;
export declare const description: INodeProperties[];
export declare function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]>;
export declare function executeBulk(this: IExecuteFunctions, proxy: IDataTableProjectService): Promise<INodeExecutionData[]>;
//# sourceMappingURL=insert.operation.d.ts.map