"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertJsonToSpreadsheetBinary = convertJsonToSpreadsheetBinary;
exports.createBinaryFromJson = createBinaryFromJson;
exports.extractDataFromPDF = extractDataFromPDF;
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
const xlsx_1 = require("xlsx");
const utilities_1 = require("./utilities");
async function convertJsonToSpreadsheetBinary(items, fileFormat, options, defaultFileName = 'spreadsheet') {
    const itemData = [];
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        itemData.push((0, utilities_1.flattenObject)(items[itemIndex].json));
    }
    let sheetToJsonOptions;
    if (options.headerRow === false) {
        sheetToJsonOptions = { skipHeader: true };
    }
    const sheet = xlsx_1.utils.json_to_sheet(itemData, sheetToJsonOptions);
    const writingOptions = {
        bookType: fileFormat,
        bookSST: false,
        type: 'buffer',
    };
    if (fileFormat === 'csv' && options.delimiter?.length) {
        writingOptions.FS = options.delimiter ?? ',';
    }
    if (['xlsx', 'ods'].includes(fileFormat) && options.compression) {
        writingOptions.compression = true;
    }
    // Convert the data in the correct format
    const sheetName = options.sheetName || 'Sheet';
    const workbook = {
        SheetNames: [sheetName],
        Sheets: {
            [sheetName]: sheet,
        },
    };
    const buffer = (0, xlsx_1.write)(workbook, writingOptions);
    const fileName = options.fileName !== undefined ? options.fileName : `${defaultFileName}.${fileFormat}`;
    const binaryData = await this.helpers.prepareBinaryData(buffer, fileName);
    return binaryData;
}
async function createBinaryFromJson(data, options) {
    let value;
    if (options.sourceKey) {
        value = (0, get_1.default)(data, options.sourceKey);
    }
    else {
        value = data;
    }
    if (value === undefined) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The value in "${options.sourceKey}" is not set`, {
            itemIndex: options.itemIndex || 0,
        });
    }
    let buffer;
    if (!options.dataIsBase64) {
        let valueAsString = value;
        if (typeof value === 'object') {
            options.mimeType = 'application/json';
            if (options.format) {
                valueAsString = JSON.stringify(value, null, 2);
            }
            else {
                valueAsString = JSON.stringify(value);
            }
        }
        buffer = iconv_lite_1.default.encode(valueAsString, options.encoding || 'utf8', {
            addBOM: options.addBOM,
        });
    }
    else {
        buffer = Buffer.from(value, n8n_workflow_1.BINARY_ENCODING);
    }
    const binaryData = await this.helpers.prepareBinaryData(buffer, options.fileName, options.mimeType);
    if (!binaryData.fileName) {
        const fileExtension = binaryData.fileExtension ? `.${binaryData.fileExtension}` : '';
        binaryData.fileName = `file${fileExtension}`;
    }
    return binaryData;
}
const parseText = (textContent) => {
    let lastY = undefined;
    const text = [];
    for (const item of textContent.items) {
        if ('str' in item) {
            if (lastY == item.transform[5] || !lastY) {
                text.push(item.str);
            }
            else {
                text.push(`\n${item.str}`);
            }
            lastY = item.transform[5];
        }
    }
    return text.join('');
};
async function extractDataFromPDF(binaryPropertyName, password, maxPages, joinPages = true, itemIndex = 0) {
    const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
    let buffer;
    if (binaryData.id) {
        const stream = await this.helpers.getBinaryStream(binaryData.id);
        buffer = await this.helpers.binaryToBuffer(stream);
    }
    else {
        buffer = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
    }
    const { getDocument: readPDF, version: pdfJsVersion } = await Promise.resolve().then(() => __importStar(require('pdfjs-dist/legacy/build/pdf.mjs')));
    const document = await readPDF({
        password,
        isEvalSupported: false,
        data: new Uint8Array(buffer),
    }).promise;
    const { info, metadata } = await document
        .getMetadata()
        .catch(() => ({ info: null, metadata: null }));
    const pages = [];
    if (maxPages !== 0) {
        let pagesToRead = document.numPages;
        if (maxPages && maxPages < document.numPages) {
            pagesToRead = maxPages;
        }
        for (let i = 1; i <= pagesToRead; i++) {
            const page = await document.getPage(i);
            const text = await page.getTextContent().then(parseText);
            pages.push(text);
        }
    }
    const text = joinPages ? pages.join('\n\n') : pages;
    const returnData = {
        numpages: document.numPages,
        numrender: document.numPages,
        info,
        metadata: (metadata && Object.fromEntries([...metadata])) ?? undefined,
        text,
        version: pdfJsVersion,
    };
    return returnData;
}
//# sourceMappingURL=binary.js.map