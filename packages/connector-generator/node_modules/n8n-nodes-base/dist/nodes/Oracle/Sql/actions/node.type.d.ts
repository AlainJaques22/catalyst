import type { AllEntities, Entity } from 'n8n-workflow';
type OracleDBMap = {
    database: 'deleteTable' | 'execute' | 'insert' | 'select' | 'update' | 'upsert';
};
export type OracleDBType = AllEntities<OracleDBMap>;
export type OracleDatabaseType = Entity<OracleDBMap, 'database'>;
export declare function isOracleDBOperation(op: string): op is OracleDBMap['database'];
export {};
//# sourceMappingURL=node.type.d.ts.map