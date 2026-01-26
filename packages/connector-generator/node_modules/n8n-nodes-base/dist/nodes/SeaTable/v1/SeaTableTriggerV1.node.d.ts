import { type IPollFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription, type INodeTypeBaseDescription } from 'n8n-workflow';
export declare class SeaTableTriggerV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getTableNames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=SeaTableTriggerV1.node.d.ts.map