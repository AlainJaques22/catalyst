import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Automizy implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Automizy.node.d.ts.map