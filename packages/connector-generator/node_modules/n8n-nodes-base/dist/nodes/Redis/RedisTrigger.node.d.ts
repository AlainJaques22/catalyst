import type { ITriggerFunctions, INodeType, INodeTypeDescription, ITriggerResponse } from 'n8n-workflow';
import { redisConnectionTest } from './utils';
export declare class RedisTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            redisConnectionTest: typeof redisConnectionTest;
        };
    };
    trigger(this: ITriggerFunctions): Promise<ITriggerResponse>;
}
//# sourceMappingURL=RedisTrigger.node.d.ts.map