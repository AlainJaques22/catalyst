import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Xero implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getItemCodes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getAccountCodes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTenants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getBrandingThemes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getCurrencies(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTrakingCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Xero.node.d.ts.map