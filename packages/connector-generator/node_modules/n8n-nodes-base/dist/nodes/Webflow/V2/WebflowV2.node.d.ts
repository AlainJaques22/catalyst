import type { IExecuteFunctions, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { getSites, getCollections, getFields } from '../GenericFunctions';
export declare class WebflowV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getSites: typeof getSites;
            getCollections: typeof getCollections;
            getFields: typeof getFields;
        };
    };
    execute(this: IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
}
//# sourceMappingURL=WebflowV2.node.d.ts.map