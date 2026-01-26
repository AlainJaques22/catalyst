import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodePropertyOptions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { getCalendars, getTimezones } from './GenericFunctions';
export declare class GoogleCalendar implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            getCalendars: typeof getCalendars;
            getTimezones: typeof getTimezones;
        };
        loadOptions: {
            getConferenceSolutions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getColors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=GoogleCalendar.node.d.ts.map