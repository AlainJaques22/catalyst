import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import type pgPromise from 'pg-promise';
import type pg from 'pg-promise/typescript/pg-subset';
import type { PgpDatabase } from '../v2/helpers/interfaces';
/**
 * Returns of a shallow copy of the items which only contains the json data and
 * of that only the define properties
 *
 * @param {INodeExecutionData[]} items The items to copy
 * @param {string[]} properties The properties it should include
 */
export declare function getItemsCopy(items: INodeExecutionData[], properties: string[], guardedColumns?: {
    [key: string]: string;
}): IDataObject[];
/**
 * Returns of a shallow copy of the item which only contains the json data and
 * of that only the define properties
 *
 * @param {INodeExecutionData} item The item to copy
 * @param {string[]} properties The properties it should include
 */
export declare function getItemCopy(item: INodeExecutionData, properties: string[], guardedColumns?: {
    [key: string]: string;
}): IDataObject;
/**
 * Returns a returning clause from a comma separated string
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param string returning The comma separated string
 */
export declare function generateReturning(pgp: pgPromise.IMain<{}, pg.IClient>, returning: string): string;
export declare function wrapData(data: IDataObject[]): INodeExecutionData[];
/**
 * Executes the given SQL query on the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {PgpDatabase} db The pgPromise database connection
 * @param {input[]} input The Node's input data
 */
export declare function pgQuery(getNodeParam: Function, pgp: pgPromise.IMain<{}, pg.IClient>, db: PgpDatabase, items: INodeExecutionData[], continueOnFail: boolean, overrideMode?: string): Promise<IDataObject[]>;
export declare function pgQueryV2(this: IExecuteFunctions, pgp: pgPromise.IMain<{}, pg.IClient>, db: PgpDatabase, items: INodeExecutionData[], continueOnFail: boolean, options?: {
    overrideMode?: string;
    resolveExpression?: boolean;
}): Promise<IDataObject[]>;
/**
 * Inserts the given items into the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {PgpDatabase} db The pgPromise database connection
 * @param {INodeExecutionData[]} items The items to be inserted
 */
export declare function pgInsert(getNodeParam: Function, pgp: pgPromise.IMain<{}, pg.IClient>, db: PgpDatabase, items: INodeExecutionData[], continueOnFail: boolean, overrideMode?: string): Promise<IDataObject[]>;
/**
 * Inserts the given items into the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {PgpDatabase} db`` The pgPromise database connection
 * @param {INodeExecutionData[]} items The items to be inserted
 */
export declare function pgInsertV2(this: IExecuteFunctions, pgp: pgPromise.IMain<{}, pg.IClient>, db: PgpDatabase, items: INodeExecutionData[], continueOnFail: boolean, overrideMode?: string): Promise<IDataObject[]>;
/**
 * Updates the given items in the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {PgpDatabase} db The pgPromise database connection
 * @param {INodeExecutionData[]} items The items to be updated
 */
export declare function pgUpdate(getNodeParam: Function, pgp: pgPromise.IMain<{}, pg.IClient>, db: PgpDatabase, items: INodeExecutionData[], continueOnFail?: boolean): Promise<IDataObject[]>;
/**
 * Updates the given items in the database.
 *
 * @param {Function} getNodeParam The getter for the Node's parameters
 * @param {pgPromise.IMain<{}, pg.IClient>} pgp The pgPromise instance
 * @param {PgpDatabase} db The pgPromise database connection
 * @param {INodeExecutionData[]} items The items to be updated
 */
export declare function pgUpdateV2(this: IExecuteFunctions, pgp: pgPromise.IMain<{}, pg.IClient>, db: PgpDatabase, items: INodeExecutionData[], continueOnFail?: boolean): Promise<IDataObject[]>;
//# sourceMappingURL=genericFunctions.d.ts.map