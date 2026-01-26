"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const interfaces_1 = require("../../helpers/interfaces");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const common_descriptions_1 = require("../common.descriptions");
const form_data_1 = __importDefault(require("form-data"));
const properties = [
    {
        displayName: 'File Content',
        name: 'content',
        type: 'string',
        default: '',
        typeOptions: {
            rows: 2,
        },
        description: 'The text to create the file with',
    },
    {
        displayName: 'File Name',
        name: 'name',
        type: 'string',
        default: '',
        placeholder: 'e.g. My New File',
        description: "The name of the file you want to create. If not specified, 'Untitled' will be used.",
    },
    {
        ...common_descriptions_1.driveRLC,
        displayName: 'Parent Drive',
        required: false,
        description: 'The drive where to create the new file',
    },
    {
        ...common_descriptions_1.folderRLC,
        displayName: 'Parent Folder',
        required: false,
        description: 'The folder where to create the new file',
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
                displayName: 'Convert to Google Document',
                name: 'convertToGoogleDocument',
                type: 'boolean',
                default: false,
                description: 'Whether to create a Google Document (instead of the .txt default format)',
                hint: 'Google Docs API has to be enabled in the <a href="https://console.developers.google.com/apis/library/docs.googleapis.com" target="_blank">Google API Console</a>.',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['createFromText'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const name = this.getNodeParameter('name', i) || 'Untitled';
    const options = this.getNodeParameter('options', i, {});
    const convertToGoogleDocument = options.convertToGoogleDocument || false;
    const mimeType = convertToGoogleDocument ? interfaces_1.DRIVE.DOCUMENT : 'text/plain';
    const driveId = this.getNodeParameter('driveId', i, undefined, {
        extractValue: true,
    });
    const folderId = this.getNodeParameter('folderId', i, undefined, {
        extractValue: true,
    });
    const metadata = {
        name,
        parents: [(0, utils_1.setParentFolder)(folderId, driveId)],
        mimeType,
    };
    const bodyParameters = (0, utils_1.setFileProperties)(metadata, options);
    const qs = (0, utils_1.setUpdateCommonParams)({
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        spaces: 'appDataFolder, drive',
        corpora: 'allDrives',
    }, options);
    let response;
    if (convertToGoogleDocument) {
        const document = await transport_1.googleApiRequest.call(this, 'POST', '/drive/v3/files', bodyParameters, qs);
        const text = this.getNodeParameter('content', i, '');
        const body = {
            requests: [
                {
                    insertText: {
                        text,
                        endOfSegmentLocation: {
                            segmentId: '', //empty segment ID signifies the document's body
                        },
                    },
                },
            ],
        };
        const updateResponse = await transport_1.googleApiRequest.call(this, 'POST', '', body, undefined, `https://docs.googleapis.com/v1/documents/${document.id}:batchUpdate`);
        response = { id: updateResponse.documentId };
    }
    else {
        const content = Buffer.from(this.getNodeParameter('content', i, ''), 'utf8');
        const contentLength = content.byteLength;
        const multiPartBody = new form_data_1.default();
        multiPartBody.append('metadata', JSON.stringify(metadata), {
            contentType: 'application/json',
        });
        multiPartBody.append('data', content, {
            contentType: mimeType,
            knownLength: contentLength,
        });
        const uploadData = await transport_1.googleApiRequest.call(this, 'POST', '/upload/drive/v3/files', multiPartBody.getBuffer(), {
            uploadType: 'multipart',
            supportsAllDrives: true,
        }, undefined, {
            headers: {
                'Content-Type': `multipart/related; boundary=${multiPartBody.getBoundary()}`,
                'Content-Length': multiPartBody.getLengthSync(),
            },
        });
        const uploadId = uploadData.id;
        qs.addParents = (0, utils_1.setParentFolder)(folderId, driveId);
        delete bodyParameters.parents;
        const responseData = await transport_1.googleApiRequest.call(this, 'PATCH', `/drive/v3/files/${uploadId}`, bodyParameters, qs);
        response = { id: responseData.id };
    }
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(response), { itemData: { item: i } });
    return executionData;
}
//# sourceMappingURL=createFromText.operation.js.map