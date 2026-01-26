import type { IExecuteFunctions, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { loadOptions, listSearch } from './methods';
import { sendAndWaitWebhook } from '../../../../utils/sendAndWait/utils';
export declare class MicrosoftOutlookV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: typeof loadOptions;
        listSearch: typeof listSearch;
    };
    webhook: typeof sendAndWaitWebhook;
    execute(this: IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
}
//# sourceMappingURL=MicrosoftOutlookV2.node.d.ts.map