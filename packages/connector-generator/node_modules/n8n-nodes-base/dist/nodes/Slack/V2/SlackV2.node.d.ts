import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeListSearchResult, INodePropertyOptions, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { sendAndWaitWebhook } from '../../../utils/sendAndWait/utils';
export declare class SlackV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        listSearch: {
            getChannels(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult>;
            getUsers(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult>;
        };
        loadOptions: {
            getUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getChannels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getChannelsName(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTeamFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    webhook: typeof sendAndWaitWebhook;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=SlackV2.node.d.ts.map