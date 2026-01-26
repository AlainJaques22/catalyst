import { type Resolver } from 'vm2';
import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import type { SandboxContext } from './Sandbox';
import { Sandbox } from './Sandbox';
export declare const vmResolver: Resolver;
export declare class JavaScriptSandbox extends Sandbox {
    private jsCode;
    private readonly vm;
    constructor(context: SandboxContext, jsCode: string, helpers: IExecuteFunctions['helpers'], options?: {
        resolver?: Resolver;
    });
    runCode<T = unknown>(): Promise<T>;
    runCodeAllItems(options?: {
        multiOutput?: boolean;
    }): Promise<INodeExecutionData[] | INodeExecutionData[][]>;
    runCodeEachItem(itemIndex: number): Promise<INodeExecutionData | undefined>;
}
//# sourceMappingURL=JavaScriptSandbox.d.ts.map