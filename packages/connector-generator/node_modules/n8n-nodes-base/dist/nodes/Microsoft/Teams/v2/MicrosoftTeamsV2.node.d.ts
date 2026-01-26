import type { IExecuteFunctions, INodeType, INodeTypeDescription, INodeTypeBaseDescription } from 'n8n-workflow';
import { listSearch } from './methods';
import { sendAndWaitWebhook } from '../../../../utils/sendAndWait/utils';
export declare class MicrosoftTeamsV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        listSearch: typeof listSearch;
    };
    webhook: typeof sendAndWaitWebhook;
    execute(this: IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
}
//# sourceMappingURL=MicrosoftTeamsV2.node.d.ts.map