"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const csv_parse_1 = require("csv-parse");
const n8n_workflow_1 = require("n8n-workflow");
const xlsx_1 = require("xlsx");
const description_1 = require("../description");
exports.description = [
    description_1.binaryProperty,
    {
        displayName: 'File Format',
        name: 'fileFormat',
        type: 'options',
        options: [
            {
                name: 'Autodetect',
                value: 'autodetect',
            },
            {
                name: 'CSV',
                value: 'csv',
                description: 'Comma-separated values',
            },
            {
                name: 'HTML',
                value: 'html',
                description: 'HTML Table',
            },
            {
                name: 'ODS',
                value: 'ods',
                description: 'OpenDocument Spreadsheet',
            },
            {
                name: 'RTF',
                value: 'rtf',
                description: 'Rich Text Format',
            },
            {
                name: 'XLS',
                value: 'xls',
                description: 'Excel',
            },
            {
                name: 'XLSX',
                value: 'xlsx',
                description: 'Excel',
            },
        ],
        default: 'autodetect',
        description: 'The format of the binary data to read from',
        displayOptions: {
            show: {
                operation: ['fromFile'],
            },
        },
    },
    description_1.fromFileOptions,
];
async function execute(items, fileFormatProperty = 'fileFormat', { failOnCsvBufferError = false } = {}) {
    const returnData = [];
    let fileExtension;
    let fileFormat;
    for (let i = 0; i < items.length; i++) {
        try {
            const options = this.getNodeParameter('options', i, {});
            fileFormat = this.getNodeParameter(fileFormatProperty, i, '');
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
            const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
            fileExtension = binaryData.fileExtension;
            let rows = [];
            if (fileFormat === 'autodetect' &&
                (binaryData.mimeType === 'text/csv' ||
                    (binaryData.mimeType === 'text/plain' && binaryData.fileExtension === 'csv'))) {
                fileFormat = 'csv';
            }
            if (fileFormat === 'csv') {
                const maxRowCount = options.maxRowCount;
                const skipRecordsWithErrors = options.skipRecordsWithErrors?.value?.enabled;
                const csvOptions = {
                    delimiter: options.delimiter,
                    fromLine: options.fromLine,
                    encoding: options.encoding,
                    bom: options.enableBOM,
                    to: maxRowCount > -1 ? maxRowCount : undefined,
                    skip_records_with_error: skipRecordsWithErrors,
                    columns: options.headerRow !== false,
                    relax_quotes: options.relaxQuotes,
                    onRecord: (record) => {
                        if (!options.includeEmptyCells) {
                            record = Object.fromEntries(Object.entries(record).filter(([_key, value]) => value !== ''));
                        }
                        rows.push(record);
                    },
                };
                const parser = (0, csv_parse_1.parse)(csvOptions);
                let skippedRecords = 0;
                parser.on('skip', (_err) => {
                    skippedRecords += 1;
                });
                if (binaryData.id) {
                    const stream = await this.helpers.getBinaryStream(binaryData.id);
                    await new Promise((resolve, reject) => {
                        parser.on('error', reject);
                        parser.on('readable', () => {
                            stream.unpipe(parser);
                            stream.destroy();
                            resolve();
                        });
                        stream.pipe(parser);
                    });
                }
                else {
                    parser.write(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
                    if (failOnCsvBufferError) {
                        await new Promise((resolve, reject) => {
                            parser.on('error', reject);
                            parser.on('readable', () => {
                                resolve();
                            });
                            parser.end();
                        });
                    }
                    else {
                        // this ignores errors, but we keep it for backwards compatibility
                        parser.end();
                    }
                }
                const maxSkippedRecords = options.skipRecordsWithErrors?.value?.maxSkippedRecords ?? -1;
                if (skipRecordsWithErrors && maxSkippedRecords > 0 && skippedRecords > maxSkippedRecords) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Max number of skipped records exceeded', {
                        itemIndex: i,
                    });
                }
            }
            else {
                const xlsxOptions = { raw: options.rawData };
                let buffer;
                if (binaryData.id) {
                    const chunkSize = 256 * 1024;
                    const stream = await this.helpers.getBinaryStream(binaryData.id, chunkSize);
                    buffer = await this.helpers.binaryToBuffer(stream);
                }
                else {
                    buffer = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
                }
                let workbook;
                if (options.readAsString) {
                    xlsxOptions.type = 'binary';
                    const binaryString = buffer.toString('binary');
                    workbook = (0, xlsx_1.read)(binaryString, xlsxOptions);
                }
                else {
                    workbook = (0, xlsx_1.read)(buffer, xlsxOptions);
                }
                if (workbook.SheetNames.length === 0) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Spreadsheet does not have any sheets!', {
                        itemIndex: i,
                    });
                }
                let sheetName = workbook.SheetNames[0];
                if (options.sheetName) {
                    if (!workbook.SheetNames.includes(options.sheetName)) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Spreadsheet does not contain sheet called "${options.sheetName}"!`, { itemIndex: i });
                    }
                    sheetName = options.sheetName;
                }
                // Convert it to json
                const sheetToJsonOptions = {};
                if (options.range) {
                    if (isNaN(options.range)) {
                        sheetToJsonOptions.range = options.range;
                    }
                    else {
                        sheetToJsonOptions.range = parseInt(options.range, 10);
                    }
                }
                if (options.includeEmptyCells) {
                    sheetToJsonOptions.defval = '';
                }
                if (options.headerRow === false) {
                    sheetToJsonOptions.header = 1; // Consider the first row as a data row
                }
                rows = xlsx_1.utils.sheet_to_json(workbook.Sheets[sheetName], sheetToJsonOptions);
                // Check if data could be found in file
                if (rows.length === 0) {
                    continue;
                }
            }
            // Add all the found data columns to the workflow data
            if (options.headerRow === false) {
                // Data was returned as an array - https://github.com/SheetJS/sheetjs#json
                for (const rowData of rows) {
                    returnData.push({
                        json: {
                            row: rowData,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                }
            }
            else {
                for (const rowData of rows) {
                    returnData.push({
                        json: rowData,
                        pairedItem: {
                            item: i,
                        },
                    });
                }
            }
        }
        catch (error) {
            let errorDescription = error.description;
            if (fileExtension && fileExtension !== fileFormat) {
                error.message = `The file selected in 'Input Binary Field' is not in ${fileFormat} format`;
                errorDescription = `Try to change the operation or select a ${fileFormat} file in 'Input Binary Field'`;
            }
            if (this.continueOnFail()) {
                returnData.push({
                    json: {
                        error: error.message,
                    },
                    pairedItem: {
                        item: i,
                    },
                });
                continue;
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                itemIndex: i,
                description: errorDescription,
            });
        }
    }
    return returnData;
}
//# sourceMappingURL=fromFile.operation.js.map