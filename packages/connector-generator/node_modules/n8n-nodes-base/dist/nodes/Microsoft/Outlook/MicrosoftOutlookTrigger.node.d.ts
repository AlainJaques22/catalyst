import { type IPollFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { loadOptions } from './v2/methods';
export declare class MicrosoftOutlookTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: typeof loadOptions;
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=MicrosoftOutlookTrigger.node.d.ts.map