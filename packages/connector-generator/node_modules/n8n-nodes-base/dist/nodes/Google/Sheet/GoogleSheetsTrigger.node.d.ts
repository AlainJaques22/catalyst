import type { INodeExecutionData, INodeType, INodeTypeDescription, INodeProperties, IPollFunctions } from 'n8n-workflow';
import { sheetsSearch, spreadSheetsSearch } from './v2/methods/listSearch';
import { getSheetHeaderRowAndSkipEmpty } from './v2/methods/loadOptions';
export declare const document: INodeProperties;
export declare const sheet: INodeProperties;
export declare class GoogleSheetsTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            spreadSheetsSearch: typeof spreadSheetsSearch;
            sheetsSearch: typeof sheetsSearch;
        };
        loadOptions: {
            getSheetHeaderRowAndSkipEmpty: typeof getSheetHeaderRowAndSkipEmpty;
        };
    };
    poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null>;
}
//# sourceMappingURL=GoogleSheetsTrigger.node.d.ts.map