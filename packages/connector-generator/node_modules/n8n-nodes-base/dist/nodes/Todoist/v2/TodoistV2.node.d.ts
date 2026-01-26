import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeListSearchResult, type INodePropertyOptions, type INodeType, type INodeTypeBaseDescription, type INodeTypeDescription } from 'n8n-workflow';
export declare class TodoistV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        listSearch: {
            searchProjects(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
        };
        loadOptions: {
            getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getSections(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getItems(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getLabels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=TodoistV2.node.d.ts.map