import type { IDataObject, IExecuteFunctions, INode, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import oracledb from 'oracledb';
import type { ColumnInfo, ExecuteOpBindParam, QueryWithValues, QueryValue, WhereClause, SortRule, ColumnMap, OracleDBNodeOptions } from './interfaces';
interface DbTypeMapping {
    oracledbType: oracledb.DbType;
    n8nType: string;
}
export declare function mapDbType(dbType: string): DbTypeMapping;
export declare function getCompatibleValue(type: string, value: unknown): {} | null | undefined;
export declare function quoteSqlIdentifier(name: string): string;
export declare function addSortRules(query: string, rules: SortRule[]): string;
export declare function getColumnMetaData(node: INode, pool: oracledb.Pool, schema: string, table: string, index?: number): Promise<ColumnInfo[]>;
export declare function prepareErrorItem(items: INodeExecutionData[], error: IDataObject | NodeOperationError | Error, index: number): INodeExecutionData;
export declare function configureQueryRunner(this: IExecuteFunctions, node: INode, continueOnFail: boolean, pool: oracledb.Pool): (queries: QueryWithValues[], items: INodeExecutionData[], options: IDataObject) => Promise<INodeExecutionData[] | {
    json: {
        message: string;
        error: NodeOperationError;
    };
}[]>;
export declare const configureTableSchemaUpdater: (node: INode, initialSchema: string, initialTable: string) => (pool: oracledb.Pool, tableSchema: ColumnInfo[], schema: string, table: string, index?: number) => Promise<ColumnInfo[]>;
export declare function getColumnMap(tableSchema: ColumnInfo[]): ColumnMap;
export declare function addWhereClauses(query: string, clauses: WhereClause[], combineConditions: string, schema: ColumnMap, isExecuteMany?: boolean): [string, oracledb.BindParameter[] | oracledb.BindDefinition[]];
export declare function checkItemAgainstSchema(node: INode, columns: string[], schema: ColumnMap, item: IDataObject, index?: number): void;
export declare function getBindParameters(query: string, parameterList: ExecuteOpBindParam[]): {
    updatedQuery: string;
    bindParameters: QueryValue;
};
export declare function getInBindParametersForSourceSelect(inputColumns: string[], schema: ColumnMap, valData: IDataObject, bindParameters: oracledb.BindParameter[], bindDefs: oracledb.BindDefinition[] | null, posIndex?: number): [string, number];
export declare function getOnClauseFromColumns(columns: string[]): string;
export declare function getUpdateSetClause(updateCols: string[], schema: ColumnMap, valData: IDataObject, bindParameters: oracledb.BindParameter[], bindDefs: oracledb.BindDefinition[] | null, posIndex: number): [string, number];
export declare function getInsertClauseAndBinds(insertCols: string[], schema: ColumnMap, valData: IDataObject, bindParameters: oracledb.BindParameter[], bindDefs: oracledb.BindDefinition[] | null, posIndex: number): [string, string, number];
export declare function getInBindParametersForExecute(inputColumns: string[], schema: ColumnMap, valData: IDataObject, operation: string, bindParameters: oracledb.BindParameter[], posIndex?: number): [string[], string, number];
export declare function getOutBindDefsForExecute(query: string, columnMetaDataObject: ColumnMap, outputColumns: string[], bindInfo: oracledb.BindDefinition[] | oracledb.BindParameter[], bindIndex?: number): string;
export declare function getBindDefsForExecuteMany(node: INode, query: string, columnMetaDataObject: ColumnMap, inputColumns: string[], outputColumns: string[], item: IDataObject, options: OracleDBNodeOptions, operation?: string, columnsToMatchOn?: string[]): string;
export declare function formatItemValues(item: IDataObject, col: ColumnMap): unknown[];
export {};
//# sourceMappingURL=utils.d.ts.map