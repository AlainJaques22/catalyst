import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class ElasticSecurity implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getConnectors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=ElasticSecurity.node.d.ts.map