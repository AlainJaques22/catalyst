import type { IExecuteFunctions, ICredentialTestFunctions, ILoadOptionsFunctions, ITriggerFunctions } from 'n8n-workflow';
import oracledb from 'oracledb';
import type { OracleDBNodeOptions, OracleDBNodeCredentials } from '../helpers/interfaces';
export declare function configureOracleDB(this: IExecuteFunctions | ICredentialTestFunctions | ILoadOptionsFunctions | ITriggerFunctions, credentials: OracleDBNodeCredentials, options?: OracleDBNodeOptions): Promise<oracledb.Pool>;
//# sourceMappingURL=index.d.ts.map