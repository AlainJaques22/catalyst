import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Misp implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getOrgs(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            getSharingGroups(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            getTags(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            getUsers(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Misp.node.d.ts.map