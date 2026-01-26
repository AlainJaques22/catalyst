import { type IPollFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription, type INodeTypeBaseDescription } from 'n8n-workflow';
import { loadOptions } from './methods';
export declare class SeaTableTriggerV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: typeof loadOptions;
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=SeaTableTriggerV2.node.d.ts.map