"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMapper = errorMapper;
exports.escapeSpecialCharacters = escapeSpecialCharacters;
const n8n_workflow_1 = require("n8n-workflow");
function errorMapper(error, itemIndex, context) {
    let message;
    let description;
    if (typeof error.message === 'string') {
        if (error.message.includes('Cannot create a string longer than')) {
            message = 'The file is too large';
            description =
                'The binary file you are attempting to read exceeds 512MB, which is limit when using default binary data mode, try using the filesystem binary mode. More information <a href="https://docs.n8n.io/hosting/scaling/binary-data/" target="_blank">here</a>.';
        }
        else if (error.message.includes('EACCES') && context?.operation === 'read') {
            const path = error.path || context?.filePath;
            message = `You don't have the permissions to access ${path}`;
            description =
                "Verify that the path specified in 'File(s) Selector' is correct, or change the file(s) permissions if needed";
        }
        else if (error.message.includes('EACCES') && context?.operation === 'write') {
            const path = error.path || context?.filePath;
            message = `You don't have the permissions to write the file ${path}`;
            description =
                "Specify another destination folder in 'File Path and Name', or change the permissions of the parent folder";
        }
    }
    return new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex, message, description });
}
function escapeSpecialCharacters(str) {
    // Escape parentheses
    str = str.replace(/[()]/g, '\\$&');
    return str;
}
//# sourceMappingURL=utils.js.map