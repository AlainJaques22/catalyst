import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class TheHive implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            loadResponders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadAnalyzers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadObservableOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadObservableTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadTaskOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadAlertOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            loadCaseOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=TheHive.node.d.ts.map