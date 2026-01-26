import { EventEmitter } from 'events';
import type { IExecuteFunctions, INodeExecutionData, ISupplyDataFunctions, IWorkflowDataProxyData } from 'n8n-workflow';
interface SandboxTextKeys {
    object: {
        singular: string;
        plural: string;
    };
}
export interface SandboxContext extends IWorkflowDataProxyData {
    $getNodeParameter: IExecuteFunctions['getNodeParameter'];
    $getWorkflowStaticData: IExecuteFunctions['getWorkflowStaticData'];
    helpers: IExecuteFunctions['helpers'];
}
export declare function getSandboxContext(this: IExecuteFunctions | ISupplyDataFunctions, index: number): SandboxContext;
export declare abstract class Sandbox extends EventEmitter {
    private textKeys;
    protected helpers: IExecuteFunctions['helpers'];
    constructor(textKeys: SandboxTextKeys, helpers: IExecuteFunctions['helpers']);
    abstract runCode<T = unknown>(): Promise<T>;
    abstract runCodeAllItems(): Promise<INodeExecutionData[] | INodeExecutionData[][]>;
    abstract runCodeEachItem(itemIndex: number): Promise<INodeExecutionData | undefined>;
    validateRunCodeEachItem(executionResult: INodeExecutionData | undefined, itemIndex: number): INodeExecutionData;
    validateRunCodeAllItems(executionResult: INodeExecutionData | INodeExecutionData[] | undefined): INodeExecutionData[];
}
export {};
//# sourceMappingURL=Sandbox.d.ts.map