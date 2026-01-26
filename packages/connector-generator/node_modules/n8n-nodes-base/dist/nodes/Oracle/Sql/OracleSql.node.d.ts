import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeBaseDescription, INodeTypeDescription } from 'n8n-workflow';
import { credentialTest, listSearch, loadOptions, resourceMapping } from './methods';
export declare class OracleSql implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        credentialTest: typeof credentialTest;
        listSearch: typeof listSearch;
        loadOptions: typeof loadOptions;
        resourceMapping: typeof resourceMapping;
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=OracleSql.node.d.ts.map