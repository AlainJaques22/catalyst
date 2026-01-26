import mssql from 'mssql';
import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import type { ITables, OperationInputData } from './interfaces';
/**
 * Returns a copy of the item which only contains the json data and
 * of that only the defined properties
 *
 * @param {INodeExecutionData} item The item to copy
 * @param {string[]} properties The properties it should include
 */
export declare function copyInputItem(item: INodeExecutionData, properties: string[]): IDataObject;
/**
 * Creates an ITables with the columns for the operations
 *
 * @param {INodeExecutionData[]} items The items to extract the tables/columns for
 * @param {function} getNodeParam getter for the Node's Parameters
 */
export declare function createTableStruct(getNodeParam: Function, items: INodeExecutionData[], additionalProperties?: string[], keyName?: string): ITables;
/**
 * Executes a queue of queries on given ITables.
 *
 * @param {ITables} tables The ITables to be processed.
 * @param {function} buildQueryQueue function that builds the queue of promises
 */
export declare function executeQueryQueue(tables: ITables, buildQueryQueue: (data: OperationInputData) => Array<Promise<object>>): Promise<any[]>;
export declare function formatColumns(columns: string): string;
export declare function configurePool(credentials: IDataObject): mssql.ConnectionPool;
export declare function mssqlChunk(rows: IDataObject[]): IDataObject[][];
export declare function insertOperation(tables: ITables, pool: mssql.ConnectionPool): Promise<any[]>;
export declare function updateOperation(tables: ITables, pool: mssql.ConnectionPool): Promise<any[]>;
export declare function deleteOperation(tables: ITables, pool: mssql.ConnectionPool): Promise<any>;
export declare function executeSqlQueryAndPrepareResults(pool: mssql.ConnectionPool, rawQuery: string, itemIndex: number): Promise<INodeExecutionData[]>;
//# sourceMappingURL=GenericFunctions.d.ts.map