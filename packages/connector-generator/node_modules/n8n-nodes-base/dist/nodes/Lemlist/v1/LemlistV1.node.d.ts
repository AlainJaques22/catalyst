import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription, type INodeTypeBaseDescription } from 'n8n-workflow';
export declare class LemlistV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getCampaigns(this: ILoadOptionsFunctions): Promise<any>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=LemlistV1.node.d.ts.map