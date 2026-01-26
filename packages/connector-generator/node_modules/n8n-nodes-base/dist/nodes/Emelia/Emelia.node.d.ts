import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { emeliaApiTest } from './GenericFunctions';
export declare class Emelia implements INodeType {
    description: INodeTypeDescription;
    methods: {
        credentialTest: {
            emeliaApiTest: typeof emeliaApiTest;
        };
        loadOptions: {
            getCampaigns(this: ILoadOptionsFunctions): Promise<import("n8n-workflow").INodePropertyOptions[]>;
            getContactLists(this: ILoadOptionsFunctions): Promise<import("n8n-workflow").INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Emelia.node.d.ts.map