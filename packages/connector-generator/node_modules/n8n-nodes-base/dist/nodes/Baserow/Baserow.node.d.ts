import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Baserow implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getDatabaseIds(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: number;
            }[]>;
            getTableIds(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: number;
            }[]>;
            getTableFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: number;
            }[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Baserow.node.d.ts.map