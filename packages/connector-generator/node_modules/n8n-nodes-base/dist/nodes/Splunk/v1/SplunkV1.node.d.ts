import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeType, INodeTypeDescription, INodeTypeBaseDescription } from 'n8n-workflow';
export declare class SplunkV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getRoles(this: ILoadOptionsFunctions): Promise<{
                name: any;
                value: any;
            }[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=SplunkV1.node.d.ts.map