import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'n8n-workflow';
export interface ISheetOptions {
    scope: string[];
}
export interface IGoogleAuthCredentials {
    email: string;
    privateKey: string;
}
export interface ISheetUpdateData {
    range: string;
    values: string[][];
}
export interface ILookupValues {
    lookupColumn: string;
    lookupValue: string;
}
export interface IToDeleteRange {
    amount: number;
    startIndex: number;
    sheetId: number;
}
export interface IToDelete {
    [key: string]: IToDeleteRange[] | undefined;
    columns?: IToDeleteRange[];
    rows?: IToDeleteRange[];
}
export type ValueInputOption = 'RAW' | 'USER_ENTERED';
export type ValueRenderOption = 'FORMATTED_VALUE' | 'FORMULA' | 'UNFORMATTED_VALUE';
export declare class GoogleSheet {
    id: string;
    executeFunctions: IExecuteFunctions | ILoadOptionsFunctions;
    constructor(spreadsheetId: string, executeFunctions: IExecuteFunctions | ILoadOptionsFunctions, options?: ISheetOptions);
    /**
     * Encodes the range that also none latin character work
     *
     */
    encodeRange(range: string): string;
    /**
     * Clears values from a sheet
     *
     */
    clearData(range: string): Promise<object>;
    /**
     * Returns the cell values
     */
    getData(range: string, valueRenderMode: ValueRenderOption): Promise<string[][] | undefined>;
    /**
     * Returns the sheets in a Spreadsheet
     */
    spreadsheetGetSheets(): Promise<any>;
    /**
     * Sets values in one or more ranges of a spreadsheet.
     */
    spreadsheetBatchUpdate(requests: IDataObject[]): Promise<any>;
    /**
     * Sets the cell values
     */
    batchUpdate(updateData: ISheetUpdateData[], valueInputMode: ValueInputOption): Promise<any>;
    /**
     * Sets the cell values
     */
    setData(range: string, data: string[][], valueInputMode: ValueInputOption): Promise<any>;
    /**
     * Appends the cell values
     */
    appendData(range: string, data: string[][], valueInputMode: ValueInputOption): Promise<any>;
    /**
     * Returns the given sheet data in a structured way
     */
    structureData(inputData: string[][], startRow: number, keys: string[], addEmpty?: boolean): IDataObject[];
    /**
     * Returns the given sheet data in a structured way using
     * the startRow as the one with the name of the key
     */
    structureArrayDataByColumn(inputData: string[][], keyRow: number, dataStartRow: number): IDataObject[];
    appendSheetData(inputData: IDataObject[], range: string, keyRowIndex: number, valueInputMode: ValueInputOption, usePathForKeyRow: boolean): Promise<string[][]>;
    getColumnWithOffset(startColumn: string, offset: number): string;
    /**
     * Updates data in a sheet
     *
     * @param {IDataObject[]} inputData Data to update Sheet with
     * @param {string} indexKey The name of the key which gets used to know which rows to update
     * @param {string} range The range to look for data
     * @param {number} keyRowIndex Index of the row which contains the keys
     * @param {number} dataStartRowIndex Index of the first row which contains data
     */
    updateSheetData(inputData: IDataObject[], indexKey: string, range: string, keyRowIndex: number, dataStartRowIndex: number, valueInputMode: ValueInputOption, valueRenderMode: ValueRenderOption, upsert?: boolean): Promise<string[][]>;
    /**
     * Looks for a specific value in a column and if it gets found it returns the whole row
     *
     * @param {string[][]} inputData Data to check for lookup value in
     * @param {number} keyRowIndex Index of the row which contains the keys
     * @param {number} dataStartRowIndex Index of the first row which contains data
     * @param {ILookupValues[]} lookupValues The lookup values which decide what data to return
     * @param {boolean} [returnAllMatches] Returns all the found matches instead of only the first one
     */
    lookupValues(inputData: string[][], keyRowIndex: number, dataStartRowIndex: number, lookupValues: ILookupValues[], returnAllMatches?: boolean): Promise<IDataObject[]>;
    convertStructuredDataToArray(inputData: IDataObject[], range: string, keyRowIndex: number, usePathForKeyRow: boolean): Promise<string[][]>;
}
//# sourceMappingURL=GoogleSheet.d.ts.map