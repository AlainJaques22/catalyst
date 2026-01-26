import type { DateTime } from 'luxon';
import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import type * as oracleDBTypes from 'oracledb';
export type QueryMode = 'single' | 'transaction' | 'independently';
export type ObjectQueryValue = Extract<oracleDBTypes.BindParameters, Record<string, unknown>>;
export type QueryValue = ObjectQueryValue | oracleDBTypes.BindParameters;
export type QueryWithValues = {
    query: string;
    values?: QueryValue;
    executeManyValues?: QueryValue[];
    outputColumns?: string[];
};
export type WhereClause = {
    column: string;
    condition: string;
    value: any;
};
export type SortRule = {
    column: string;
    direction: string;
};
export type ColumnInfo = {
    columnName: string;
    dataType: string;
    isNullable: boolean;
    udtName?: string;
    columnDefault?: string | null;
    isGenerated?: 'ALWAYS' | 'NEVER';
    identityGeneration?: 'ALWAYS' | 'NEVER';
    maxSize: number;
};
export type QueriesRunner = (queries: QueryWithValues[], items: INodeExecutionData[], options: IDataObject) => Promise<INodeExecutionData[]>;
export type OracleDBNodeOptions = {
    nodeVersion?: number;
    operation?: string;
    poolPingInterval?: number;
    poolPingTimeout?: number;
    stmtCacheSize?: number;
    poolMax?: number;
    poolMin?: number;
    poolIncrement?: number;
    autoCommit?: boolean;
    bindDefs?: oracleDBTypes.BindDefinition[];
    batchErrors?: boolean;
    fetchArraySize?: number;
    keepInStmtCache?: boolean;
    maxRows?: number;
    prefetchRows?: number;
    largeNumbersOutputAsString?: boolean;
    outputColumns?: string[];
    stmtBatching?: QueryMode;
    executeManyOptions?: oracleDBTypes.ExecuteManyOptions;
};
export type OracleDBNodeCredentials = {
    connectionString: string | undefined;
    connectionClass?: string;
    connectTimeout?: number;
    useThickMode: boolean;
    useSSL: boolean;
    expireTime?: number;
    maxLifetimeSession: number;
    password: string | undefined;
    poolTimeout: number;
    poolMin: number;
    poolMax: number;
    poolIncrement: number;
    sslServerCertDN?: string;
    sslServerDNMatch?: boolean;
    sslAllowWeakDNMatch?: boolean;
    transportConnectTimeout?: number;
    user: string | undefined;
    walletPassword?: string | undefined;
    walletContent?: string | undefined;
};
export type ColumnDefinition = {
    type: string;
    nullable: boolean;
    maxSize: number;
};
export type ColumnMap = {
    [key: string]: ColumnDefinition;
};
type BaseBindFields = {
    name: string;
    parseInStatement: boolean;
    bindDirection: 'in' | 'out' | 'inout';
};
export type ExecuteOpBindParam = (BaseBindFields & {
    datatype: 'string';
    valueString: string;
}) | (BaseBindFields & {
    datatype: 'number';
    valueNumber: number;
}) | (BaseBindFields & {
    datatype: 'boolean';
    valueBoolean: boolean;
}) | (BaseBindFields & {
    datatype: 'date';
    valueDate: string | Date | DateTime | null;
}) | (BaseBindFields & {
    datatype: 'json';
    valueJson: Record<string, unknown> | null;
}) | (BaseBindFields & {
    datatype: 'vector';
    valueVector: number[] | null;
}) | (BaseBindFields & {
    datatype: 'blob';
    valueBlob: Buffer | null;
}) | (BaseBindFields & {
    datatype: 'sparse';
    valueSparse: {
        dimensions: number;
        indices: number[];
        values: number[];
    };
});
export {};
//# sourceMappingURL=interfaces.d.ts.map