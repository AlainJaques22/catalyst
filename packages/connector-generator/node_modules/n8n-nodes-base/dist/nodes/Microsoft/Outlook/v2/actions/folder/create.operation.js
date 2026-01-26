"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
exports.properties = [
    {
        displayName: 'Name',
        name: 'displayName',
        description: 'Name of the folder',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'e.g. My Folder',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [{ ...descriptions_1.folderRLC, displayName: 'Parent Folder', required: false }],
    },
];
const displayOptions = {
    show: {
        resource: ['folder'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    const displayName = this.getNodeParameter('displayName', index);
    const folderId = (0, utils_1.decodeOutlookId)(this.getNodeParameter('options.folderId', index, '', {
        extractValue: true,
    }));
    const body = {
        displayName,
    };
    let endpoint;
    if (folderId) {
        endpoint = `/mailFolders/${folderId}/childFolders`;
    }
    else {
        endpoint = '/mailFolders';
    }
    const responseData = await transport_1.microsoftApiRequest.call(this, 'POST', endpoint, body);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: index } });
    return executionData;
}
//# sourceMappingURL=create.operation.js.map