import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { redisConnectionTest } from './utils';
export declare class Redis implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            redisConnectionTest: typeof redisConnectionTest;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Redis.node.d.ts.map