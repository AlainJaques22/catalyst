import type { ICredentialTestFunctions, IDataObject, IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import type { Mysql2Pool, MysqlNodeCredentials } from '../helpers/interfaces';
export declare function createPool(this: IExecuteFunctions | ICredentialTestFunctions | ILoadOptionsFunctions, credentials: MysqlNodeCredentials, options?: IDataObject): Promise<Mysql2Pool>;
//# sourceMappingURL=index.d.ts.map