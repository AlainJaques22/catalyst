import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, INodeTypeBaseDescription } from 'n8n-workflow';
import { getCustomFields } from '../GenericFunctions';
export declare class MailerLiteV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getCustomFields: typeof getCustomFields;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=MailerLiteV1.node.d.ts.map