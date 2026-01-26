import type { ILoadOptionsFunctions, INodeListSearchResult, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { getContacts, getPipelines, getPipelineStages, getUsers } from './GenericFunctions';
export declare class HighLevelV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getPipelines: typeof getPipelines;
            getContacts: typeof getContacts;
            getPipelineStages: typeof getPipelineStages;
            getUsers: typeof getUsers;
        };
        listSearch: {
            searchCustomFields(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
            searchTimezones(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
        };
    };
}
//# sourceMappingURL=HighLevelV2.node.d.ts.map