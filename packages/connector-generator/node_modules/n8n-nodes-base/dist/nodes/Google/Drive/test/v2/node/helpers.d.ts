import type { IDataObject, IExecuteFunctions, INode } from 'n8n-workflow';
import { Readable } from 'stream';
export declare const driveNode: INode;
export declare const createMockExecuteFunction: (nodeParameters: IDataObject, node: INode, continueOnFail?: boolean) => IExecuteFunctions;
export declare function createTestStream(byteSize: number): Readable;
//# sourceMappingURL=helpers.d.ts.map