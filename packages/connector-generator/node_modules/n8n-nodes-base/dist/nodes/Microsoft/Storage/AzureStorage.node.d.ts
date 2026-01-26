import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { getBlobs, getContainers } from './GenericFunctions';
export declare class AzureStorage implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {};
        listSearch: {
            getBlobs: typeof getBlobs;
            getContainers: typeof getContainers;
        };
    };
}
//# sourceMappingURL=AzureStorage.node.d.ts.map