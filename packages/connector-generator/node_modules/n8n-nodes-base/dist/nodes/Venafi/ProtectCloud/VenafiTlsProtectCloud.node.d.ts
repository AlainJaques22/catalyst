import { type IExecuteFunctions, type ILoadOptionsFunctions, type INodeExecutionData, type INodePropertyOptions, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
export declare class VenafiTlsProtectCloud implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getApplications(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getCertificateIssuingTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=VenafiTlsProtectCloud.node.d.ts.map