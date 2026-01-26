import { type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';
import type { SandboxContext } from './Sandbox';
import { Sandbox } from './Sandbox';
export declare class PythonSandbox extends Sandbox {
    private pythonCode;
    private readonly context;
    constructor(context: SandboxContext, pythonCode: string, helpers: IExecuteFunctions['helpers']);
    runCode<T = unknown>(): Promise<T>;
    runCodeAllItems(): Promise<INodeExecutionData[]>;
    runCodeEachItem(itemIndex: number): Promise<INodeExecutionData>;
    private runCodeInPython;
    private getPrettyError;
}
//# sourceMappingURL=PythonSandbox.d.ts.map