import type { INodeParameters, IExecuteFunctions, INodeExecutionData, JsonValue, DataTableColumnJsType } from 'n8n-workflow';
export declare function toDataTableValue(value: JsonValue): DataTableColumnJsType;
export declare function setOutputs(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
export declare function setInputs(this: IExecuteFunctions): INodeExecutionData[][];
export declare function setMetrics(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
export declare function checkIfEvaluating(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
export declare function getOutputConnectionTypes(parameters: INodeParameters): {
    type: string;
    displayName: string;
}[] | {
    type: string;
}[];
export declare function getInputConnectionTypes(parameters: INodeParameters, metricRequiresModelConnectionFn: (metric: string) => boolean): ({
    type: string;
    displayName?: undefined;
    maxConnections?: undefined;
} | {
    type: string;
    displayName: string;
    maxConnections: number;
})[];
//# sourceMappingURL=evaluationUtils.d.ts.map