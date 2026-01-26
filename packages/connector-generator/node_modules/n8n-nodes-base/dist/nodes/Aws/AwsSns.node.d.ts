import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeListSearchResult, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class AwsSns implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            listTopics(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=AwsSns.node.d.ts.map