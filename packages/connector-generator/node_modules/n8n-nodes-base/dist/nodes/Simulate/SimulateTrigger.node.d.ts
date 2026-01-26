import type { ITriggerFunctions, INodeType, INodeTypeDescription, ITriggerResponse } from 'n8n-workflow';
import { loadOptions } from './methods';
export declare class SimulateTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: typeof loadOptions;
    };
    trigger(this: ITriggerFunctions): Promise<ITriggerResponse>;
}
//# sourceMappingURL=SimulateTrigger.node.d.ts.map