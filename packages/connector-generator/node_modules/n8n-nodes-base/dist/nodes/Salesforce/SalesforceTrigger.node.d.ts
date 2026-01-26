import type { IPollFunctions, INodeExecutionData, INodeType, INodeTypeDescription, ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
export declare class SalesforceTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getCustomObjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=SalesforceTrigger.node.d.ts.map