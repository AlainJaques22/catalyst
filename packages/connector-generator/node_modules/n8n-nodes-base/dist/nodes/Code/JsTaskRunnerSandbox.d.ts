import { type CodeExecutionMode, type IExecuteFunctions, type INodeExecutionData, type WorkflowExecuteMode } from 'n8n-workflow';
/**
 * JS Code execution sandbox that executes the JS code using task runner.
 */
export declare class JsTaskRunnerSandbox {
    private readonly jsCode;
    private readonly nodeMode;
    private readonly workflowMode;
    private readonly executeFunctions;
    private readonly chunkSize;
    private readonly additionalProperties;
    constructor(jsCode: string, nodeMode: CodeExecutionMode, workflowMode: WorkflowExecuteMode, executeFunctions: Pick<IExecuteFunctions, 'startJob' | 'continueOnFail' | 'helpers'>, chunkSize?: number, additionalProperties?: Record<string, unknown>);
    runCodeAllItems(): Promise<INodeExecutionData[]>;
    runCodeForTool(): Promise<unknown>;
    runCodeForEachItem(numInputItems: number): Promise<INodeExecutionData[]>;
    /** Chunks the input items into chunks of 1000 items each */
    private chunkInputItems;
}
//# sourceMappingURL=JsTaskRunnerSandbox.d.ts.map