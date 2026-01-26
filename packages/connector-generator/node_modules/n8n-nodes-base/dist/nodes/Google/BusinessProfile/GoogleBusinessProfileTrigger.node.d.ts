import { type IPollFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { searchAccounts, searchLocations } from './GenericFunctions';
export declare class GoogleBusinessProfileTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            searchAccounts: typeof searchAccounts;
            searchLocations: typeof searchLocations;
        };
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=GoogleBusinessProfileTrigger.node.d.ts.map