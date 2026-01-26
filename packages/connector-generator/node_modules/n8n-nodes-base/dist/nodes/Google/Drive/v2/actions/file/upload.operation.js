"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const form_data_1 = __importDefault(require("form-data"));
const utilities_1 = require("../../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        displayName: 'Input Data Field Name',
        name: 'inputDataFieldName',
        type: 'string',
        placeholder: '“e.g. data',
        default: 'data',
        required: true,
        hint: 'The name of the input field containing the binary file data to update the file',
        description: 'Find the name of input field containing the binary data to update the file in the Input panel on the left, in the Binary tab',
    },
    {
        displayName: 'File Name',
        name: 'name',
        type: 'string',
        default: '',
        placeholder: 'e.g. My New File',
        description: 'If not specified, the original file name will be used',
    },
    {
        ...common_descriptions_1.driveRLC,
        displayName: 'Parent Drive',
        description: 'The drive where to upload the file',
    },
    {
        ...common_descriptions_1.folderRLC,
        displayName: 'Parent Folder',
        description: 'The folder where to upload the file',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            ...common_descriptions_1.updateCommonOptions,
            {
                displayName: 'Simplify Output',
                name: 'simplifyOutput',
                type: 'boolean',
                default: true,
                description: 'Whether to return a simplified version of the response instead of all fields',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['upload'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const returnData = [];
    const inputDataFieldName = this.getNodeParameter('inputDataFieldName', i);
    const { contentLength, fileContent, originalFilename, mimeType } = await utils_1.getItemBinaryData.call(this, inputDataFieldName, i);
    const name = this.getNodeParameter('name', i) || originalFilename;
    const driveId = this.getNodeParameter('driveId', i, undefined, {
        extractValue: true,
    });
    const folderId = this.getNodeParameter('folderId', i, undefined, {
        extractValue: true,
    });
    let uploadId;
    const metadata = {
        name,
        parents: [(0, utils_1.setParentFolder)(folderId, driveId)],
    };
    if (Buffer.isBuffer(fileContent)) {
        const multiPartBody = new form_data_1.default();
        multiPartBody.append('metadata', JSON.stringify(metadata), {
            contentType: 'application/json',
        });
        multiPartBody.append('data', fileContent, {
            contentType: mimeType,
            knownLength: contentLength,
        });
        const response = await transport_1.googleApiRequest.call(this, 'POST', '/upload/drive/v3/files', multiPartBody.getBuffer(), {
            uploadType: 'multipart',
            supportsAllDrives: true,
        }, undefined, {
            headers: {
                'Content-Type': `multipart/related; boundary=${multiPartBody.getBoundary()}`,
                'Content-Length': multiPartBody.getLengthSync(),
            },
        });
        uploadId = response.id;
    }
    else {
        const resumableUpload = await transport_1.googleApiRequest.call(this, 'POST', '/upload/drive/v3/files', metadata, {
            uploadType: 'resumable',
            supportsAllDrives: true,
        }, undefined, {
            returnFullResponse: true,
            headers: {
                'X-Upload-Content-Type': mimeType,
            },
        });
        const uploadUrl = resumableUpload.headers.location;
        // 2MB chunks, needs to be a multiple of 256kB for Google Drive API
        const chunkSizeBytes = 2048 * 1024;
        await (0, utils_1.processInChunks)(fileContent, chunkSizeBytes, async (chunk, offset) => {
            try {
                const response = await this.helpers.httpRequest({
                    method: 'PUT',
                    url: uploadUrl,
                    headers: {
                        'Content-Length': chunk.length,
                        'Content-Range': `bytes ${offset}-${offset + chunk.byteLength - 1}/${contentLength}`,
                    },
                    body: chunk,
                });
                uploadId = response?.id;
            }
            catch (error) {
                if (error.response?.status !== 308)
                    throw error;
            }
        });
    }
    const options = this.getNodeParameter('options', i, {});
    const qs = (0, utils_1.setUpdateCommonParams)({
        addParents: (0, utils_1.setParentFolder)(folderId, driveId),
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        spaces: 'appDataFolder, drive',
        corpora: 'allDrives',
    }, options);
    if (!options.simplifyOutput) {
        qs.fields = '*';
    }
    const body = (0, utils_1.setFileProperties)({
        mimeType,
        name,
        originalFilename,
    }, options);
    const response = await transport_1.googleApiRequest.call(this, 'PATCH', `/drive/v3/files/${uploadId}`, body, qs);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
//# sourceMappingURL=upload.operation.js.map