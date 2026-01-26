import type { INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { getPipelineStages, getTimezones, getUsers } from './GenericFunctions';
export declare class HighLevelV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getPipelineStages: typeof getPipelineStages;
            getUsers: typeof getUsers;
            getTimezones: typeof getTimezones;
        };
    };
}
//# sourceMappingURL=HighLevelV1.node.d.ts.map