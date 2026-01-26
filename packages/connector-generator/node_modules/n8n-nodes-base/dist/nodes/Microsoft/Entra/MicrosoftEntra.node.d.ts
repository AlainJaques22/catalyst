import type { ILoadOptionsFunctions, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { getGroupProperties, getGroups, getUserProperties, getUsers } from './GenericFunctions';
export declare class MicrosoftEntra implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getGroupProperties: typeof getGroupProperties;
            getGroupPropertiesGetAll(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getUserProperties: typeof getUserProperties;
            getUserPropertiesGetAll(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
        listSearch: {
            getGroups: typeof getGroups;
            getUsers: typeof getUsers;
        };
    };
}
//# sourceMappingURL=MicrosoftEntra.node.d.ts.map