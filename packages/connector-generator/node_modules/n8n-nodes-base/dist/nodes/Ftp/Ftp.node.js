"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ftp = void 0;
const fs_1 = require("fs");
const n8n_workflow_1 = require("n8n-workflow");
const path_1 = require("path");
const promise_ftp_1 = __importDefault(require("promise-ftp"));
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const promises_1 = require("stream/promises");
const tmp_promise_1 = require("tmp-promise");
const utilities_1 = require("../../utils/utilities");
async function callRecursiveList(path, client, normalizeFunction) {
    const pathArray = [path];
    let currentPath = path;
    const directoryItems = [];
    let index = 0;
    const prepareAndNormalize = (item) => {
        if (pathArray[index].endsWith('/')) {
            currentPath = `${pathArray[index]}${item.name}`;
        }
        else {
            currentPath = `${pathArray[index]}/${item.name}`;
        }
        // Is directory
        if (item.type === 'd') {
            // ignore . and .. to prevent infinite loop
            if (item.name === '.' || item.name === '..') {
                return;
            }
            pathArray.push(currentPath);
        }
        normalizeFunction(item, currentPath, true);
        directoryItems.push(item);
    };
    do {
        const returnData = await client.list(pathArray[index]);
        // @ts-ignore
        returnData.map(prepareAndNormalize);
        index++;
    } while (index <= pathArray.length - 1);
    return directoryItems;
}
async function recursivelyCreateSftpDirs(sftp, path) {
    const dirPath = (0, path_1.dirname)(path);
    const dirExists = await sftp.exists(dirPath);
    if (!dirExists) {
        await sftp.mkdir(dirPath, true);
    }
}
function normalizeSFtpItem(input, path, recursive = false) {
    const item = input;
    item.accessTime = new Date(input.accessTime);
    item.modifyTime = new Date(input.modifyTime);
    item.path = !recursive ? `${path}${path.endsWith('/') ? '' : '/'}${item.name}` : path;
}
function normalizeFtpItem(input, path, recursive = false) {
    const item = input;
    item.modifyTime = input.date;
    item.path = !recursive ? `${path}${path.endsWith('/') ? '' : '/'}${item.name}` : path;
    //@ts-ignore
    item.date = undefined;
}
class Ftp {
    description = {
        displayName: 'FTP',
        name: 'ftp',
        icon: 'fa:server',
        iconColor: 'dark-blue',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["protocol"] + ": " + $parameter["operation"]}}',
        description: 'Transfer files via FTP or SFTP',
        defaults: {
            name: 'FTP',
            color: '#303050',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                // nodelinter-ignore-next-line
                name: 'ftp',
                required: true,
                displayOptions: {
                    show: {
                        protocol: ['ftp'],
                    },
                },
                testedBy: 'ftpConnectionTest',
            },
            {
                // nodelinter-ignore-next-line
                name: 'sftp',
                required: true,
                displayOptions: {
                    show: {
                        protocol: ['sftp'],
                    },
                },
                testedBy: 'sftpConnectionTest',
            },
        ],
        properties: [
            {
                displayName: 'Protocol',
                name: 'protocol',
                type: 'options',
                options: [
                    {
                        name: 'FTP',
                        value: 'ftp',
                    },
                    {
                        name: 'SFTP',
                        value: 'sftp',
                    },
                ],
                default: 'ftp',
                description: 'File transfer protocol',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete a file/folder',
                        action: 'Delete a file or folder',
                    },
                    {
                        name: 'Download',
                        value: 'download',
                        description: 'Download a file',
                        action: 'Download a file',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'List folder content',
                        action: 'List folder content',
                    },
                    {
                        name: 'Rename',
                        value: 'rename',
                        description: 'Rename/move oldPath to newPath',
                        action: 'Rename / move a file or folder',
                    },
                    {
                        name: 'Upload',
                        value: 'upload',
                        description: 'Upload a file',
                        action: 'Upload a file',
                    },
                ],
                default: 'download',
                noDataExpression: true,
            },
            // ----------------------------------
            //         delete
            // ----------------------------------
            {
                displayName: 'Path',
                displayOptions: {
                    show: {
                        operation: ['delete'],
                    },
                },
                name: 'path',
                type: 'string',
                default: '',
                description: 'The file path of the file to delete. Has to contain the full path.',
                placeholder: 'e.g. /public/documents/file-to-delete.txt',
                required: true,
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add option',
                displayOptions: {
                    show: {
                        operation: ['delete'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'Folder',
                        name: 'folder',
                        type: 'boolean',
                        default: false,
                        description: 'Whether folders can be deleted',
                    },
                    {
                        displayName: 'Recursive',
                        displayOptions: {
                            show: {
                                folder: [true],
                            },
                        },
                        name: 'recursive',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to remove all files and directories in target directory',
                    },
                ],
            },
            // ----------------------------------
            //         download
            // ----------------------------------
            {
                displayName: 'Path',
                displayOptions: {
                    show: {
                        operation: ['download'],
                    },
                },
                name: 'path',
                type: 'string',
                default: '',
                description: 'The file path of the file to download. Has to contain the full path.',
                placeholder: 'e.g. /public/documents/file-to-download.txt',
                required: true,
            },
            {
                displayName: 'Put Output File in Field',
                displayOptions: {
                    show: {
                        operation: ['download'],
                    },
                },
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                hint: 'The name of the output binary field to put the file in',
                required: true,
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        operation: ['download'],
                    },
                },
                options: [
                    {
                        displayName: 'Enable Concurrent Reads',
                        name: 'enableConcurrentReads',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to enable concurrent reads for downloading files',
                    },
                    {
                        displayName: 'Max Concurrent Reads',
                        name: 'maxConcurrentReads',
                        type: 'number',
                        default: 5,
                        displayOptions: {
                            show: {
                                enableConcurrentReads: [true],
                            },
                        },
                    },
                    {
                        displayName: 'Chunk Size',
                        name: 'chunkSize',
                        type: 'number',
                        default: 64,
                        description: 'Size of each chunk in KB to download, Not all servers support this',
                        displayOptions: {
                            show: {
                                enableConcurrentReads: [true],
                            },
                        },
                    },
                ],
            },
            // ----------------------------------
            //         rename
            // ----------------------------------
            {
                displayName: 'Old Path',
                displayOptions: {
                    show: {
                        operation: ['rename'],
                    },
                },
                name: 'oldPath',
                type: 'string',
                default: '',
                placeholder: 'e.g. /public/documents/old-file.txt',
                required: true,
            },
            {
                displayName: 'New Path',
                displayOptions: {
                    show: {
                        operation: ['rename'],
                    },
                },
                name: 'newPath',
                type: 'string',
                default: '',
                placeholder: 'e.g. /public/documents/new-file.txt',
                required: true,
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        operation: ['rename'],
                    },
                },
                options: [
                    {
                        displayName: 'Create Directories',
                        name: 'createDirectories',
                        type: 'boolean',
                        default: false,
                        description: 'Whether to recursively create destination directory when renaming an existing file or folder',
                    },
                ],
            },
            // ----------------------------------
            //         upload
            // ----------------------------------
            {
                displayName: 'Path',
                displayOptions: {
                    show: {
                        operation: ['upload'],
                    },
                },
                name: 'path',
                type: 'string',
                default: '',
                description: 'The file path of the file to upload. Has to contain the full path.',
                placeholder: 'e.g. /public/documents/file-to-upload.txt',
                required: true,
            },
            {
                displayName: 'Binary File',
                displayOptions: {
                    show: {
                        operation: ['upload'],
                    },
                },
                name: 'binaryData',
                type: 'boolean',
                default: true,
                // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                description: 'The text content of the file to upload',
            },
            {
                displayName: 'Input Binary Field',
                displayOptions: {
                    show: {
                        operation: ['upload'],
                        binaryData: [true],
                    },
                },
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                hint: 'The name of the input binary field containing the file to be written',
                required: true,
            },
            {
                displayName: 'File Content',
                displayOptions: {
                    show: {
                        operation: ['upload'],
                        binaryData: [false],
                    },
                },
                name: 'fileContent',
                type: 'string',
                default: '',
                description: 'The text content of the file to upload',
            },
            // ----------------------------------
            //         list
            // ----------------------------------
            {
                displayName: 'Path',
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                name: 'path',
                type: 'string',
                default: '/',
                placeholder: 'e.g. /public/folder',
                description: 'Path of directory to list contents of',
                required: true,
            },
            {
                displayName: 'Recursive',
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                name: 'recursive',
                type: 'boolean',
                default: false,
                description: 'Whether to return object representing all directories / objects recursively found within SFTP server',
                required: true,
            },
        ],
    };
    methods = {
        credentialTest: {
            async ftpConnectionTest(credential) {
                const credentials = credential.data;
                const ftp = new promise_ftp_1.default();
                try {
                    await ftp.connect({
                        host: credentials.host,
                        port: credentials.port,
                        user: credentials.username,
                        password: credentials.password,
                    });
                }
                catch (error) {
                    await ftp.end();
                    return {
                        status: 'Error',
                        message: error.message,
                    };
                }
                await ftp.end();
                return {
                    status: 'OK',
                    message: 'Connection successful!',
                };
            },
            async sftpConnectionTest(credential) {
                const credentials = credential.data;
                const sftp = new ssh2_sftp_client_1.default();
                try {
                    if (credentials.privateKey) {
                        await sftp.connect({
                            host: credentials.host,
                            port: credentials.port,
                            username: credentials.username,
                            password: credentials.password || undefined,
                            privateKey: (0, utilities_1.formatPrivateKey)(credentials.privateKey),
                            passphrase: credentials.passphrase,
                        });
                    }
                    else {
                        await sftp.connect({
                            host: credentials.host,
                            port: credentials.port,
                            username: credentials.username,
                            password: credentials.password,
                        });
                    }
                }
                catch (error) {
                    await sftp.end();
                    return {
                        status: 'Error',
                        message: error.message,
                    };
                }
                await sftp.end();
                return {
                    status: 'OK',
                    message: 'Connection successful!',
                };
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        let returnItems = [];
        const operation = this.getNodeParameter('operation', 0);
        let credentials = undefined;
        const protocol = this.getNodeParameter('protocol', 0);
        if (protocol === 'sftp') {
            credentials = await this.getCredentials('sftp');
        }
        else {
            credentials = await this.getCredentials('ftp');
        }
        let ftp;
        let sftp;
        try {
            try {
                if (protocol === 'sftp') {
                    sftp = new ssh2_sftp_client_1.default();
                    if (credentials.privateKey) {
                        await sftp.connect({
                            host: credentials.host,
                            port: credentials.port,
                            username: credentials.username,
                            password: credentials.password || undefined,
                            privateKey: (0, utilities_1.formatPrivateKey)(credentials.privateKey),
                            passphrase: credentials.passphrase,
                            readyTimeout: 10000,
                            algorithms: {
                                compress: ['zlib@openssh.com', 'zlib', 'none'],
                            },
                        });
                    }
                    else {
                        await sftp.connect({
                            host: credentials.host,
                            port: credentials.port,
                            username: credentials.username,
                            password: credentials.password,
                            readyTimeout: 10000,
                            algorithms: {
                                compress: ['zlib@openssh.com', 'zlib', 'none'],
                            },
                        });
                    }
                }
                else {
                    ftp = new promise_ftp_1.default();
                    await ftp.connect({
                        host: credentials.host,
                        port: credentials.port,
                        user: credentials.username,
                        password: credentials.password,
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const pairedItem = (0, utilities_1.generatePairedItemData)(items.length);
                    return [[{ json: { error: error.message }, pairedItem }]];
                }
                throw error;
            }
            for (let i = 0; i < items.length; i++) {
                try {
                    const newItem = {
                        json: items[i].json,
                        binary: {},
                        pairedItem: items[i].pairedItem,
                    };
                    if (items[i].binary !== undefined && newItem.binary) {
                        // Create a shallow copy of the binary data so that the old
                        // data references which do not get changed still stay behind
                        // but the incoming data does not get changed.
                        Object.assign(newItem.binary, items[i].binary);
                    }
                    items[i] = newItem;
                    if (protocol === 'sftp') {
                        if (operation === 'list') {
                            const path = this.getNodeParameter('path', i);
                            const recursive = this.getNodeParameter('recursive', i);
                            let responseData;
                            if (recursive) {
                                responseData = await callRecursiveList(path, sftp, normalizeSFtpItem);
                            }
                            else {
                                responseData = await sftp.list(path);
                                responseData.forEach((item) => normalizeSFtpItem(item, path));
                            }
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                        if (operation === 'delete') {
                            const path = this.getNodeParameter('path', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.folder === true) {
                                await sftp.rmdir(path, !!options.recursive);
                            }
                            else {
                                await sftp.delete(path);
                            }
                            const executionData = this.helpers.constructExecutionMetaData([{ json: { success: true } }], { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                        if (operation === 'rename') {
                            const oldPath = this.getNodeParameter('oldPath', i);
                            const { createDirectories = false } = this.getNodeParameter('options', i);
                            const newPath = this.getNodeParameter('newPath', i);
                            if (createDirectories) {
                                await recursivelyCreateSftpDirs(sftp, newPath);
                            }
                            await sftp.rename(oldPath, newPath);
                            const executionData = this.helpers.constructExecutionMetaData([{ json: { success: true } }], { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                        if (operation === 'download') {
                            const path = this.getNodeParameter('path', i);
                            const options = this.getNodeParameter('options', i);
                            const binaryFile = await (0, tmp_promise_1.file)({ prefix: 'n8n-sftp-' });
                            try {
                                if (!options.enableConcurrentReads) {
                                    await sftp.get(path, (0, fs_1.createWriteStream)(binaryFile.path));
                                }
                                else {
                                    await sftp.fastGet(path, binaryFile.path, {
                                        concurrency: options.maxConcurrentReads === undefined
                                            ? 5
                                            : Number(options.maxConcurrentReads),
                                        chunkSize: (options.chunkSize === undefined ? 64 : Number(options.chunkSize)) * 1024,
                                    });
                                }
                                const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                                const remoteFilePath = this.getNodeParameter('path', i);
                                items[i].binary[dataPropertyNameDownload] = await this.nodeHelpers.copyBinaryFile(binaryFile.path, (0, path_1.basename)(remoteFilePath));
                                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(items[i]), { itemData: { item: i } });
                                returnItems = returnItems.concat(executionData);
                            }
                            finally {
                                await binaryFile.cleanup();
                            }
                        }
                        if (operation === 'upload') {
                            const remotePath = this.getNodeParameter('path', i);
                            await recursivelyCreateSftpDirs(sftp, remotePath);
                            if (this.getNodeParameter('binaryData', i)) {
                                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                                const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
                                let uploadData;
                                if (binaryData.id) {
                                    uploadData = await this.helpers.getBinaryStream(binaryData.id);
                                }
                                else {
                                    uploadData = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
                                }
                                await sftp.put(uploadData, remotePath);
                            }
                            else {
                                // Is text file
                                const buffer = Buffer.from(this.getNodeParameter('fileContent', i), 'utf8');
                                await sftp.put(buffer, remotePath);
                            }
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(items[i]), { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                    }
                    if (protocol === 'ftp') {
                        if (operation === 'list') {
                            const path = this.getNodeParameter('path', i);
                            const recursive = this.getNodeParameter('recursive', i);
                            let responseData;
                            if (recursive) {
                                responseData = await callRecursiveList(path, ftp, normalizeFtpItem);
                            }
                            else {
                                responseData = await ftp.list(path);
                                responseData.forEach((item) => normalizeFtpItem(item, path));
                            }
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                        if (operation === 'delete') {
                            const path = this.getNodeParameter('path', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.folder === true) {
                                await ftp.rmdir(path, !!options.recursive);
                            }
                            else {
                                await ftp.delete(path);
                            }
                            const executionData = this.helpers.constructExecutionMetaData([{ json: { success: true } }], { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                        if (operation === 'download') {
                            const path = this.getNodeParameter('path', i);
                            const binaryFile = await (0, tmp_promise_1.file)({ prefix: 'n8n-sftp-' });
                            try {
                                const stream = await ftp.get(path);
                                await (0, promises_1.pipeline)(stream, (0, fs_1.createWriteStream)(binaryFile.path));
                                const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                                const remoteFilePath = this.getNodeParameter('path', i);
                                items[i].binary[dataPropertyNameDownload] = await this.nodeHelpers.copyBinaryFile(binaryFile.path, (0, path_1.basename)(remoteFilePath));
                                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(items[i]), { itemData: { item: i } });
                                returnItems = returnItems.concat(executionData);
                            }
                            finally {
                                await binaryFile.cleanup();
                            }
                        }
                        if (operation === 'rename') {
                            const oldPath = this.getNodeParameter('oldPath', i);
                            const newPath = this.getNodeParameter('newPath', i);
                            const options = this.getNodeParameter('options', i);
                            try {
                                await ftp.rename(oldPath, newPath);
                            }
                            catch (error) {
                                if ([451, 550].includes(error.code) && options.createDirectories) {
                                    const dirPath = newPath.replace((0, path_1.basename)(newPath), '');
                                    await ftp.mkdir(dirPath, true);
                                    await ftp.rename(oldPath, newPath);
                                }
                                else {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                }
                            }
                            const executionData = this.helpers.constructExecutionMetaData([{ json: { success: true } }], { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                        if (operation === 'upload') {
                            const remotePath = this.getNodeParameter('path', i);
                            const fileName = (0, path_1.basename)(remotePath);
                            const dirPath = remotePath.replace(fileName, '');
                            if (this.getNodeParameter('binaryData', i)) {
                                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                                const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
                                let uploadData;
                                if (binaryData.id) {
                                    uploadData = await this.helpers.getBinaryStream(binaryData.id);
                                }
                                else {
                                    uploadData = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
                                }
                                try {
                                    await ftp.put(uploadData, remotePath);
                                }
                                catch (error) {
                                    if (error.code === 553) {
                                        // Create directory
                                        await ftp.mkdir(dirPath, true);
                                        await ftp.put(uploadData, remotePath);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                    }
                                }
                            }
                            else {
                                // Is text file
                                const buffer = Buffer.from(this.getNodeParameter('fileContent', i), 'utf8');
                                try {
                                    await ftp.put(buffer, remotePath);
                                }
                                catch (error) {
                                    if (error.code === 553) {
                                        // Create directory
                                        await ftp.mkdir(dirPath, true);
                                        await ftp.put(buffer, remotePath);
                                    }
                                    else {
                                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                                    }
                                }
                            }
                            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(items[i]), { itemData: { item: i } });
                            returnItems = returnItems.concat(executionData);
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems.push({ json: { error: error.message }, pairedItem: { item: i } });
                        continue;
                    }
                    throw error;
                }
            }
            if (protocol === 'sftp') {
                await sftp.end();
            }
            else {
                await ftp.end();
            }
        }
        catch (error) {
            if (protocol === 'sftp') {
                await sftp.end();
            }
            else {
                await ftp.end();
            }
            throw error;
        }
        return [returnItems];
    }
}
exports.Ftp = Ftp;
//# sourceMappingURL=Ftp.node.js.map