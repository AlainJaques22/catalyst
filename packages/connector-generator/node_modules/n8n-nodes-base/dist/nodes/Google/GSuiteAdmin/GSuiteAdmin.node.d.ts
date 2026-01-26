import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { searchDevices, searchGroups, searchUsers } from './SearchFunctions';
export declare class GSuiteAdmin implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getDomains(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getSchemas(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getOrgUnits(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
        listSearch: {
            searchDevices: typeof searchDevices;
            searchGroups: typeof searchGroups;
            searchUsers: typeof searchUsers;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=GSuiteAdmin.node.d.ts.map