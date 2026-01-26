import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class AwsDynamoDB implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getTables(this: ILoadOptionsFunctions): Promise<any>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=AwsDynamoDB.node.d.ts.map