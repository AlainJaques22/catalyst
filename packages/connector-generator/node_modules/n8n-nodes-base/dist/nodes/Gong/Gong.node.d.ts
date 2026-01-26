import { type ILoadOptionsFunctions, type INodeListSearchResult, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Gong implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            getCalls(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
            getUsers(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
        };
    };
}
//# sourceMappingURL=Gong.node.d.ts.map