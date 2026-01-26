import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class WooCommerce implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=WooCommerce.node.d.ts.map