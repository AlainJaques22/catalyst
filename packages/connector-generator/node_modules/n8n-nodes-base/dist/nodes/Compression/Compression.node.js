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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compression = void 0;
const fflate = __importStar(require("fflate"));
const mime = __importStar(require("mime-types"));
const n8n_workflow_1 = require("n8n-workflow");
const util_1 = require("util");
const gunzip = (0, util_1.promisify)(fflate.gunzip);
const gzip = (0, util_1.promisify)(fflate.gzip);
const unzip = (0, util_1.promisify)(fflate.unzip);
const zip = (0, util_1.promisify)(fflate.zip);
const ALREADY_COMPRESSED = [
    '7z',
    'aifc',
    'bz2',
    'doc',
    'docx',
    'gif',
    'gz',
    'heic',
    'heif',
    'jpg',
    'jpeg',
    'mov',
    'mp3',
    'mp4',
    'pdf',
    'png',
    'ppt',
    'pptx',
    'rar',
    'webm',
    'webp',
    'xls',
    'xlsx',
    'zip',
];
class Compression {
    description = {
        displayName: 'Compression',
        name: 'compression',
        icon: 'fa:file-archive',
        iconColor: 'green',
        group: ['transform'],
        subtitle: '={{$parameter["operation"]}}',
        version: [1, 1.1],
        description: 'Compress and decompress files',
        defaults: {
            name: 'Compression',
            color: '#408000',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Compress',
                        value: 'compress',
                        action: 'Compress file(s)',
                        description: 'Compress files into a zip or gzip archive',
                    },
                    {
                        name: 'Decompress',
                        value: 'decompress',
                        action: 'Decompress file(s)',
                        description: 'Decompress zip or gzip archives',
                    },
                ],
                default: 'decompress',
            },
            {
                displayName: 'Input Binary Field(s)',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['compress'],
                    },
                },
                placeholder: 'e.g. data,data2,data3',
                hint: 'The name of the input binary field(s) containing the file(s) to be compressed',
                description: 'To process more than one file, use a comma-separated list of the binary fields names',
            },
            {
                displayName: 'Input Binary Field(s)',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['decompress'],
                    },
                },
                placeholder: 'e.g. data',
                hint: 'The name of the input binary field(s) containing the file(s) to decompress',
                description: 'To process more than one file, use a comma-separated list of the binary fields names',
            },
            {
                displayName: 'Output Format',
                name: 'outputFormat',
                type: 'options',
                default: '',
                options: [
                    {
                        name: 'Gzip',
                        value: 'gzip',
                    },
                    {
                        name: 'Zip',
                        value: 'zip',
                    },
                ],
                displayOptions: {
                    show: {
                        operation: ['compress'],
                        '@version': [1],
                    },
                },
                description: 'Format of the output',
            },
            {
                displayName: 'Output Format',
                name: 'outputFormat',
                type: 'options',
                default: 'zip',
                options: [
                    {
                        name: 'Gzip',
                        value: 'gzip',
                    },
                    {
                        name: 'Zip',
                        value: 'zip',
                    },
                ],
                displayOptions: {
                    show: {
                        operation: ['compress'],
                    },
                    hide: {
                        '@version': [1],
                    },
                },
                description: 'Format of the output',
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                placeholder: 'e.g. data.zip',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['compress'],
                        outputFormat: ['zip'],
                    },
                },
                description: 'Name of the output file',
            },
            {
                displayName: 'Put Output File in Field',
                name: 'binaryPropertyOutput',
                type: 'string',
                default: 'data',
                displayOptions: {
                    show: {
                        outputFormat: ['zip'],
                        operation: ['compress'],
                    },
                },
                hint: 'The name of the output binary field to put the file in',
            },
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                placeholder: 'e.g. data.txt',
                displayOptions: {
                    show: {
                        operation: ['compress'],
                        outputFormat: ['gzip'],
                    },
                    hide: {
                        '@version': [1],
                    },
                },
                description: 'Name of the output file',
            },
            {
                displayName: 'Put Output File in Field',
                name: 'binaryPropertyOutput',
                type: 'string',
                default: 'data',
                displayOptions: {
                    show: {
                        outputFormat: ['gzip'],
                        operation: ['compress'],
                    },
                    hide: {
                        '@version': [1],
                    },
                },
                hint: 'The name of the output binary field to put the file in',
            },
            {
                displayName: 'Output File Prefix',
                name: 'outputPrefix',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['compress'],
                        outputFormat: ['gzip'],
                        '@version': [1],
                    },
                },
                description: 'Prefix to add to the gzip file',
            },
            {
                displayName: 'Output Prefix',
                name: 'outputPrefix',
                type: 'string',
                default: 'file_',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['decompress'],
                    },
                },
                description: 'Prefix to add to the decompressed files',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const length = items.length;
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        const nodeVersion = this.getNode().typeVersion;
        for (let i = 0; i < length; i++) {
            try {
                if (operation === 'decompress') {
                    const binaryPropertyNames = this.getNodeParameter('binaryPropertyName', 0)
                        .split(',')
                        .map((key) => key.trim());
                    const outputPrefix = this.getNodeParameter('outputPrefix', 0);
                    const binaryObject = {};
                    let zipIndex = 0;
                    for (const [index, binaryPropertyName] of binaryPropertyNames.entries()) {
                        const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
                        const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                        const fileExtension = binaryData.fileExtension?.toLowerCase();
                        if (!fileExtension) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `File extension not found for binary data ${binaryPropertyName}`);
                        }
                        if (fileExtension === 'zip') {
                            const files = await unzip(binaryDataBuffer);
                            for (const key of Object.keys(files)) {
                                // when files are compressed using MACOSX for some reason they are duplicated under __MACOSX
                                if (key.includes('__MACOSX')) {
                                    continue;
                                }
                                const data = await this.helpers.prepareBinaryData(Buffer.from(files[key].buffer), key);
                                binaryObject[`${outputPrefix}${zipIndex++}`] = data;
                            }
                        }
                        else if (['gz', 'gzip'].includes(fileExtension)) {
                            const file = await gunzip(binaryDataBuffer);
                            const fileName = binaryData.fileName?.split('.')[0];
                            let fileExtension;
                            let mimeType;
                            if (binaryData.fileName?.endsWith('.gz')) {
                                const extractedFileExtension = binaryData.fileName.replace('.gz', '').split('.');
                                if (extractedFileExtension.length > 1) {
                                    fileExtension = extractedFileExtension[extractedFileExtension.length - 1];
                                    mimeType = mime.lookup(fileExtension);
                                }
                            }
                            const propertyName = `${outputPrefix}${index}`;
                            binaryObject[propertyName] = await this.helpers.prepareBinaryData(Buffer.from(file.buffer), fileName, mimeType);
                            if (!fileExtension) {
                                mimeType = binaryObject[propertyName].mimeType;
                                fileExtension = mime.extension(mimeType);
                            }
                            binaryObject[propertyName].fileName = `${fileName}.${fileExtension}`;
                            binaryObject[propertyName].fileExtension = fileExtension;
                            binaryObject[propertyName].mimeType = mimeType;
                        }
                    }
                    returnData.push({
                        json: items[i].json,
                        binary: binaryObject,
                        pairedItem: {
                            item: i,
                        },
                    });
                }
                if (operation === 'compress') {
                    let binaryPropertyNameIndex = 0;
                    if (nodeVersion > 1) {
                        binaryPropertyNameIndex = i;
                    }
                    const binaryPropertyNames = this.getNodeParameter('binaryPropertyName', binaryPropertyNameIndex)
                        .split(',')
                        .map((key) => key.trim());
                    const outputFormat = this.getNodeParameter('outputFormat', 0);
                    const zipData = {};
                    const binaryObject = {};
                    for (const [index, binaryPropertyName] of binaryPropertyNames.entries()) {
                        const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
                        const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                        if (outputFormat === 'zip') {
                            zipData[binaryData.fileName] = [
                                binaryDataBuffer,
                                {
                                    level: ALREADY_COMPRESSED.includes(binaryData.fileExtension) ? 0 : 6,
                                },
                            ];
                        }
                        else if (outputFormat === 'gzip') {
                            let outputPrefix;
                            let fileName;
                            let binaryProperty;
                            let filePath;
                            if (nodeVersion > 1) {
                                outputPrefix = this.getNodeParameter('binaryPropertyOutput', i, 'data');
                                binaryProperty = `${outputPrefix}${index ? index : ''}`;
                                fileName = this.getNodeParameter('fileName', i, '');
                                if (!fileName) {
                                    fileName = binaryData.fileName?.split('.')[0];
                                }
                                else {
                                    fileName = fileName.replace('.gz', '').replace('.gzip', '');
                                }
                                const fileExtension = binaryData.fileExtension
                                    ? `.${binaryData.fileExtension.toLowerCase()}`
                                    : '';
                                filePath = `${fileName}${fileExtension}.gz`;
                            }
                            else {
                                outputPrefix = this.getNodeParameter('outputPrefix', 0);
                                binaryProperty = `${outputPrefix}${index}`;
                                fileName = binaryData.fileName?.split('.')[0];
                                filePath = `${fileName}.gzip`;
                            }
                            const data = await gzip(binaryDataBuffer);
                            binaryObject[binaryProperty] = await this.helpers.prepareBinaryData(Buffer.from(data), filePath);
                        }
                    }
                    if (outputFormat === 'zip') {
                        let zipOptionsIndex = 0;
                        if (nodeVersion > 1) {
                            zipOptionsIndex = i;
                        }
                        const fileName = this.getNodeParameter('fileName', zipOptionsIndex);
                        const binaryPropertyOutput = this.getNodeParameter('binaryPropertyOutput', zipOptionsIndex);
                        const buffer = await zip(zipData);
                        const data = await this.helpers.prepareBinaryData(Buffer.from(buffer), fileName);
                        returnData.push({
                            json: items[i].json,
                            binary: {
                                [binaryPropertyOutput]: data,
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                    }
                    if (outputFormat === 'gzip') {
                        returnData.push({
                            json: items[i].json,
                            binary: binaryObject,
                            pairedItem: {
                                item: i,
                            },
                        });
                    }
                }
            }
            catch (error) {
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
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Compression = Compression;
//# sourceMappingURL=Compression.node.js.map