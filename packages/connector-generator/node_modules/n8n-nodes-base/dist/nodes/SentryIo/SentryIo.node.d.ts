import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class SentryIo implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getOrganizations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=SentryIo.node.d.ts.map