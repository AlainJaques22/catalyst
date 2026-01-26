import type { IExecuteFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { getConditionsForColumn, getDataTableColumns, getDataTables, tableSearch } from './common/methods';
export declare class DataTable implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            tableSearch: typeof tableSearch;
        };
        loadOptions: {
            getDataTableColumns: typeof getDataTableColumns;
            getConditionsForColumn: typeof getConditionsForColumn;
        };
        resourceMapping: {
            getDataTables: typeof getDataTables;
        };
    };
    execute(this: IExecuteFunctions): Promise<import("n8n-workflow").INodeExecutionData[][]>;
}
//# sourceMappingURL=DataTable.node.d.ts.map