import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
export declare class TwitterV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDecription: INodeTypeBaseDescription);
    methods: {
        loadOptions: {
            getLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=TwitterV1.node.d.ts.map