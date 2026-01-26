import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, INode, IPollFunctions } from 'n8n-workflow';
import type { ILookupValues, ISheetUpdateData, ResourceLocator, SheetRangeData, ValueInputOption, ValueRenderOption } from './GoogleSheets.types';
export declare class GoogleSheet {
    id: string;
    executeFunctions: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions;
    constructor(spreadsheetId: string, executeFunctions: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions);
    /**
     * Encodes the range that also none latin character work
     *
     * @param {string} range
     * @returns {string}
     * @memberof GoogleSheet
     */
    private encodeRange;
    /**
     * Clears values from a sheet
     *
     * @param {string} range
     * @returns {Promise<object>}
     * @memberof GoogleSheet
     */
    clearData(range: string): Promise<object>;
    /**
     * Returns the cell values
     */
    getData(range: string, valueRenderMode: ValueRenderOption, dateTimeRenderOption?: string): Promise<string[][] | undefined>;
    /**
     * Returns the sheets in a Spreadsheet
     */
    spreadsheetGetSheets(): Promise<any>;
    /**
     *  Returns the sheet within a spreadsheet based on name or ID
     */
    spreadsheetGetSheet(node: INode, mode: ResourceLocator, value: string): Promise<{
        title: string;
        sheetId: number;
    }>;
    /**
     *  Returns the grid properties of a sheet
     */
    getDataRange(sheetId: string): Promise<any>;
    /**
     * Sets values in one or more ranges of a spreadsheet.
     */
    spreadsheetBatchUpdate(requests: IDataObject[]): Promise<any>;
    /**
     * Sets the cell values
     */
    batchUpdate(updateData: ISheetUpdateData[], valueInputMode: ValueInputOption): Promise<any>;
    appendEmptyRowsOrColumns(sheetId: string, rowsToAdd?: number, columnsToAdd?: number): Promise<any>;
    /**
     * Appends the cell values
     */
    appendData(range: string, data: string[][], valueInputMode: ValueInputOption, lastRow?: number, useAppend?: boolean): Promise<any>;
    updateRows(sheetName: string, data: string[][], valueInputMode: ValueInputOption, row: number, rowsLength?: number, useAppend?: boolean): Promise<any>;
    /**
     * Returns the given sheet data in a structured way
     */
    convertSheetDataArrayToObjectArray(sheet: SheetRangeData, startRow: number, columnKeys: string[], addEmpty?: boolean, includeHeadersWithEmptyCells?: boolean): IDataObject[];
    /**
     * Returns the given sheet data in a structured way using
     * the startRow as the one with the name of the key
     */
    structureArrayDataByColumn(inputData: string[][], keyRow: number, dataStartRow: number, includeHeadersWithEmptyCells?: boolean): IDataObject[];
    testFilter(inputData: string[][], keyRow: number, dataStartRow: number): string[];
    appendSheetData({ inputData, range, keyRowIndex, valueInputMode, usePathForKeyRow, columnNamesList, lastRow, useAppend, }: {
        inputData: IDataObject[];
        range: string;
        keyRowIndex: number;
        valueInputMode: ValueInputOption;
        usePathForKeyRow?: boolean;
        columnNamesList?: string[][];
        lastRow?: number;
        useAppend?: boolean;
    }): Promise<string[][]>;
    getColumnWithOffset(startColumn: string, offset: number): string;
    getColumnValues({ range, keyIndex, dataStartRowIndex, valueRenderMode, sheetData, }: {
        range: string;
        keyIndex: number;
        dataStartRowIndex: number;
        valueRenderMode: ValueRenderOption;
        sheetData?: string[][];
    }): Promise<string[]>;
    /**
     * Updates data in a sheet
     *
     * @param {IDataObject[]} inputData Data to update Sheet with
     * @param {string} indexKey The name of the key which gets used to know which rows to update
     * @param {string} range The range to look for data
     * @param {number} keyRowIndex Index of the row which contains the keys
     * @param {number} dataStartRowIndex Index of the first row which contains data
     * @returns {Promise<string[][]>}
     * @memberof GoogleSheet
     */
    prepareDataForUpdateOrUpsert({ inputData, indexKey, range, keyRowIndex, dataStartRowIndex, valueRenderMode, upsert, columnNamesList, columnValuesList, }: {
        inputData: IDataObject[];
        indexKey: string;
        range: string;
        keyRowIndex: number;
        dataStartRowIndex: number;
        valueRenderMode: ValueRenderOption;
        upsert?: boolean;
        columnNamesList?: string[][];
        columnValuesList?: string[];
    }): Promise<{
        updateData: ISheetUpdateData[];
        appendData: IDataObject[];
    }>;
    /**
     * Updates data in a sheet
     *
     * @param {IDataObject[]} inputData Data to update Sheet with
     * @param {string} range The range to look for data
     * @param {number} dataStartRowIndex Index of the first row which contains data
     * @param {string[][]} columnNamesList The column names to use
     * @returns {Promise<string[][]>}
     * @memberof GoogleSheet
     */
    prepareDataForUpdatingByRowNumber(inputData: IDataObject[], range: string, columnNamesList: string[][]): {
        updateData: ISheetUpdateData[];
    };
    /**
     * Looks for a specific value in a column and if it gets found it returns the whole row
     *
     * @param {string[][]} inputData Data to check for lookup value in
     * @param {number} keyRowIndex Index of the row which contains the keys
     * @param {number} dataStartRowIndex Index of the first row which contains data
     * @param {ILookupValues[]} lookupValues The lookup values which decide what data to return
     * @param {boolean} [returnAllMatches] Returns all the found matches instead of only the first one
     * @returns {Promise<IDataObject[]>}
     * @memberof GoogleSheet
     */
    lookupValues({ inputData, keyRowIndex, dataStartRowIndex, lookupValues, returnAllMatches, nodeVersion, combineFilters, }: {
        inputData: string[][];
        keyRowIndex: number;
        dataStartRowIndex: number;
        lookupValues: ILookupValues[];
        nodeVersion: number;
        returnAllMatches?: boolean;
        combineFilters?: 'AND' | 'OR';
    }): Promise<IDataObject[]>;
    private convertObjectArrayToSheetDataArray;
    private getDecodedSheetRange;
    private splitCellRange;
}
//# sourceMappingURL=GoogleSheet.d.ts.map