import type { ITriggerFunctions, IDataObject, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import type { PgpDatabase } from './v2/helpers/interfaces';
export declare function prepareNames(id: string, mode: string, additionalFields: IDataObject): {
    functionName: string;
    triggerName: string;
    channelName: string;
};
export declare function pgTriggerFunction(this: ITriggerFunctions, db: PgpDatabase, additionalFields: IDataObject, functionName: string, triggerName: string, channelName: string): Promise<void>;
export declare function initDB(this: ITriggerFunctions | ILoadOptionsFunctions): Promise<import("./v2/helpers/interfaces").ConnectionsData>;
export declare function searchSchema(this: ILoadOptionsFunctions): Promise<INodeListSearchResult>;
export declare function searchTables(this: ILoadOptionsFunctions): Promise<INodeListSearchResult>;
//# sourceMappingURL=PostgresTrigger.functions.d.ts.map