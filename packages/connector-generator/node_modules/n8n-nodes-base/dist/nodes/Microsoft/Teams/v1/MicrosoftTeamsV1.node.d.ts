import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type INodeTypeBaseDescription } from 'n8n-workflow';
export declare class MicrosoftTeamsV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getChannels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getPlans(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getBuckets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getMembers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getChats(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=MicrosoftTeamsV1.node.d.ts.map