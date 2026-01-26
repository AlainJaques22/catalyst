import type { IBinaryData, IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
export type JsonToSpreadsheetBinaryFormat = 'csv' | 'html' | 'rtf' | 'ods' | 'xls' | 'xlsx';
export type JsonToSpreadsheetBinaryOptions = {
    headerRow?: boolean;
    compression?: boolean;
    fileName?: string;
    sheetName?: string;
    delimiter?: string;
};
export type JsonToBinaryOptions = {
    fileName?: string;
    sourceKey?: string;
    encoding?: string;
    addBOM?: boolean;
    mimeType?: string;
    dataIsBase64?: boolean;
    itemIndex?: number;
    format?: boolean;
};
export declare function convertJsonToSpreadsheetBinary(this: IExecuteFunctions, items: INodeExecutionData[], fileFormat: JsonToSpreadsheetBinaryFormat, options: JsonToSpreadsheetBinaryOptions, defaultFileName?: string): Promise<IBinaryData>;
export declare function createBinaryFromJson(this: IExecuteFunctions, data: IDataObject | IDataObject[], options: JsonToBinaryOptions): Promise<IBinaryData>;
export declare function extractDataFromPDF(this: IExecuteFunctions, binaryPropertyName: string, password?: string, maxPages?: number, joinPages?: boolean, itemIndex?: number): Promise<{
    numpages: number;
    numrender: number;
    info: Object | null;
    metadata: {
        [k: string]: any;
    } | undefined;
    text: string | string[];
    version: string;
}>;
//# sourceMappingURL=binary.d.ts.map