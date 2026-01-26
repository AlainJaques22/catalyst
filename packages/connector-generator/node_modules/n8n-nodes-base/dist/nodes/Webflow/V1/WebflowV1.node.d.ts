import { type IExecuteFunctions, type INodeTypeBaseDescription, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { getSites, getCollections, getFields } from '../GenericFunctions';
export declare class WebflowV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getSites: typeof getSites;
            getCollections: typeof getCollections;
            getFields: typeof getFields;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=WebflowV1.node.d.ts.map