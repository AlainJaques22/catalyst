import type snowflake from 'snowflake-sdk';
declare const commonConnectionFields: readonly ["account", "database", "schema", "warehouse", "role", "clientSessionKeepAlive"];
export type SnowflakeCredential = Pick<snowflake.ConnectionOptions, (typeof commonConnectionFields)[number]> & ({
    authentication: 'password';
    username?: string;
    password?: string;
} | {
    authentication: 'keyPair';
    username: string;
    privateKey: string;
    passphrase?: string;
});
export declare const getConnectionOptions: (credential: SnowflakeCredential) => snowflake.ConnectionOptions;
export declare function connect(conn: snowflake.Connection): Promise<void>;
export declare function destroy(conn: snowflake.Connection): Promise<void>;
export declare function execute(conn: snowflake.Connection, sqlText: string, binds: snowflake.InsertBinds): Promise<any[] | undefined>;
export {};
//# sourceMappingURL=GenericFunctions.d.ts.map