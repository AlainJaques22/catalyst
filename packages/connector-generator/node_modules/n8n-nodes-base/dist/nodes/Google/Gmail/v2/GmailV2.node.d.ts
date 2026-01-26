import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { getGmailAliases, getLabels, getThreadMessages } from './loadOptions';
import { sendAndWaitWebhook } from '../../../../utils/sendAndWait/utils';
export declare class GmailV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getLabels: typeof getLabels;
            getThreadMessages: typeof getThreadMessages;
            getGmailAliases: typeof getGmailAliases;
        };
    };
    webhook: typeof sendAndWaitWebhook;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=GmailV2.node.d.ts.map