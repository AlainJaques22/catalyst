import type { IExecuteFunctions, ICredentialTestFunctions, ILoadOptionsFunctions, ITriggerFunctions } from 'n8n-workflow';
import type { ConnectionsData, PostgresNodeCredentials, PostgresNodeOptions } from '../v2/helpers/interfaces';
export declare function configurePostgres(this: IExecuteFunctions | ICredentialTestFunctions | ILoadOptionsFunctions | ITriggerFunctions, credentials: PostgresNodeCredentials, options?: PostgresNodeOptions): Promise<ConnectionsData>;
//# sourceMappingURL=index.d.ts.map