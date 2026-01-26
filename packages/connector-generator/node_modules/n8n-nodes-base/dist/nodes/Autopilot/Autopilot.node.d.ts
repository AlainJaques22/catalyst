import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class Autopilot implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTriggers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Autopilot.node.d.ts.map