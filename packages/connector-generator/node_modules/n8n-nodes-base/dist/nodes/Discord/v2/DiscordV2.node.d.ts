import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { listSearch, loadOptions } from './methods';
import { sendAndWaitWebhook } from '../../../utils/sendAndWait/utils';
export declare class DiscordV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        listSearch: typeof listSearch;
        loadOptions: typeof loadOptions;
    };
    webhook: typeof sendAndWaitWebhook;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=DiscordV2.node.d.ts.map