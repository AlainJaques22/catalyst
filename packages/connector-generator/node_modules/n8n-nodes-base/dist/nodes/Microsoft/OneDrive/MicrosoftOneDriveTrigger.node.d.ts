import { type IPollFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class MicrosoftOneDriveTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {};
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=MicrosoftOneDriveTrigger.node.d.ts.map