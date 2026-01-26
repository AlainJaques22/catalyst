import { type IExecuteFunctions, type INodeExecutionData, type INodeType, type INodeTypeBaseDescription, type INodeTypeDescription } from 'n8n-workflow';
import { getLabels } from './loadOptions';
export declare class GmailV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getLabels: typeof getLabels;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=GmailV1.node.d.ts.map