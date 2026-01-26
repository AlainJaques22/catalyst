import { type IDisplayOptions, type IExecuteFunctions } from 'n8n-workflow';
export declare function makeAddRow(operation: string, displayOptions: IDisplayOptions): {
    displayName: string;
    name: string;
    type: "resourceMapper";
    default: {
        mappingMode: string;
        value: null;
    };
    noDataExpression: true;
    required: true;
    typeOptions: {
        loadOptionsDependsOn: string[];
        resourceMapper: {
            valuesLabel: string;
            resourceMapperMethod: string;
            mode: "add";
            fieldWords: {
                singular: string;
                plural: string;
            };
            addAllFields: true;
            multiKeyMatch: true;
            hideNoDataError: true;
        };
    };
    displayOptions: IDisplayOptions;
};
export declare function getAddRow(ctx: IExecuteFunctions, index: number): Record<string, import("n8n-workflow").DataTableColumnJsType>;
//# sourceMappingURL=addRow.d.ts.map