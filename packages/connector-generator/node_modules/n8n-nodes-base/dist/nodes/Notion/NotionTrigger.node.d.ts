import { type IPollFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { listSearch } from './shared/methods';
export declare class NotionTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: typeof listSearch;
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=NotionTrigger.node.d.ts.map