import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, INodeTypeBaseDescription } from 'n8n-workflow';
import { getCustomFields } from '../GenericFunctions';
export declare class MailerLiteV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getCustomFields: typeof getCustomFields;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=MailerLiteV2.node.d.ts.map