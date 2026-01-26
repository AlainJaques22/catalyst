import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
import { getRefs, getRepositories, getUsers, getWorkflows } from './SearchFunctions';
export declare class Github implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            getRefs: typeof getRefs;
            getRepositories: typeof getRepositories;
            getUsers: typeof getUsers;
            getWorkflows: typeof getWorkflows;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Github.node.d.ts.map