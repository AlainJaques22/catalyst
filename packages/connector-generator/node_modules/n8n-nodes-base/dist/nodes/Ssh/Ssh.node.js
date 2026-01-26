"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ssh = void 0;
const promises_1 = require("fs/promises");
const n8n_workflow_1 = require("n8n-workflow");
const node_ssh_1 = require("node-ssh");
const tmp_promise_1 = require("tmp-promise");
const utilities_1 = require("../../utils/utilities");
async function resolveHomeDir(path, ssh, itemIndex) {
    if (path.startsWith('~/')) {
        let homeDir = (await ssh.execCommand('echo $HOME')).stdout;
        if (homeDir.charAt(homeDir.length - 1) !== '/') {
            homeDir += '/';
        }
        return path.replace('~/', homeDir);
    }
    if (path.startsWith('~')) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid path. Replace "~" with home directory or "~/"', {
            itemIndex,
        });
    }
    return path;
}
class Ssh {
    description = {
        displayName: 'SSH',
        name: 'ssh',
        icon: 'fa:terminal',
        iconColor: 'black',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Execute commands via SSH',
        defaults: {
            name: 'SSH',
            color: '#000000',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'sshPassword',
                required: true,
                testedBy: 'sshConnectionTest',
                displayOptions: {
                    show: {
                        authentication: ['password'],
                    },
                },
            },
            {
                name: 'sshPrivateKey',
                required: true,
                testedBy: 'sshConnectionTest',
                displayOptions: {
                    show: {
                        authentication: ['privateKey'],
                    },
                },
            },
        ],
        properties: [
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    {
                        name: 'Password',
                        value: 'password',
                    },
                    {
                        name: 'Private Key',
                        value: 'privateKey',
                    },
                ],
                default: 'password',
            },
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Command',
                        value: 'command',
                    },
                    {
                        name: 'File',
                        value: 'file',
                    },
                ],
                default: 'command',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['command'],
                    },
                },
                options: [
                    {
                        name: 'Execute',
                        value: 'execute',
                        description: 'Execute a command',
                        action: 'Execute a command',
                    },
                ],
                default: 'execute',
            },
            {
                displayName: 'Command',
                name: 'command',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['command'],
                        operation: ['execute'],
                    },
                },
                default: '',
                description: 'The command to be executed on a remote device',
            },
            {
                displayName: 'Working Directory',
                name: 'cwd',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['command'],
                        operation: ['execute'],
                    },
                },
                default: '/',
                required: true,
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['file'],
                    },
                },
                options: [
                    {
                        name: 'Download',
                        value: 'download',
                        description: 'Download a file',
                        action: 'Download a file',
                    },
                    {
                        name: 'Upload',
                        value: 'upload',
                        description: 'Upload a file',
                        action: 'Upload a file',
                    },
                ],
                default: 'upload',
            },
            {
                displayName: 'Input Binary Field',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['upload'],
                        resource: ['file'],
                    },
                },
                placeholder: '',
                hint: 'The name of the input binary field containing the file to be uploaded',
            },
            {
                displayName: 'Target Directory',
                name: 'path',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['file'],
                        operation: ['upload'],
                    },
                },
                default: '',
                required: true,
                placeholder: '/home/user',
                description: 'The directory to upload the file to. The name of the file does not need to be specified, it\'s taken from the binary data file name. To override this behavior, set the parameter "File Name" under options.',
            },
            {
                displayName: 'Path',
                displayOptions: {
                    show: {
                        resource: ['file'],
                        operation: ['download'],
                    },
                },
                name: 'path',
                type: 'string',
                default: '',
                placeholder: '/home/user/invoice.txt',
                description: 'The file path of the file to download. Has to contain the full path including file name.',
                required: true,
            },
            {
                displayName: 'File Property',
                displayOptions: {
                    show: {
                        resource: ['file'],
                        operation: ['download'],
                    },
                },
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                description: 'Object property name which holds binary data',
                required: true,
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add option',
                displayOptions: {
                    show: {
                        resource: ['file'],
                        operation: ['upload', 'download'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'File Name',
                        name: 'fileName',
                        type: 'string',
                        default: '',
                        description: 'Overrides the binary data file name',
                    },
                ],
            },
        ],
    };
    methods = {
        credentialTest: {
            async sshConnectionTest(credential) {
                const credentials = credential.data;
                const ssh = new node_ssh_1.NodeSSH();
                try {
                    if (!credentials.privateKey) {
                        await ssh.connect({
                            host: credentials.host,
                            username: credentials.username,
                            port: credentials.port,
                            password: credentials.password,
                        });
                    }
                    else {
                        const options = {
                            host: credentials.host,
                            username: credentials.username,
                            port: credentials.port,
                            privateKey: (0, utilities_1.formatPrivateKey)(credentials.privateKey),
                        };
                        if (credentials.passphrase) {
                            options.passphrase = credentials.passphrase;
                        }
                        await ssh.connect(options);
                    }
                }
                catch (error) {
                    const message = `SSH connection failed: ${error.message}`;
                    return {
                        status: 'Error',
                        message,
                    };
                }
                finally {
                    ssh.dispose();
                }
                return {
                    status: 'OK',
                    message: 'Connection successful!',
                };
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnItems = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const authentication = this.getNodeParameter('authentication', 0);
        const ssh = new node_ssh_1.NodeSSH();
        try {
            if (authentication === 'password') {
                const credentials = await this.getCredentials('sshPassword');
                await ssh.connect({
                    host: credentials.host,
                    username: credentials.username,
                    port: credentials.port,
                    password: credentials.password,
                });
            }
            else if (authentication === 'privateKey') {
                const credentials = await this.getCredentials('sshPrivateKey');
                const options = {
                    host: credentials.host,
                    username: credentials.username,
                    port: credentials.port,
                    privateKey: (0, utilities_1.formatPrivateKey)(credentials.privateKey),
                };
                if (credentials.passphrase) {
                    options.passphrase = credentials.passphrase;
                }
                await ssh.connect(options);
            }
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'command') {
                        if (operation === 'execute') {
                            const command = this.getNodeParameter('command', i);
                            const cwd = await resolveHomeDir.call(this, this.getNodeParameter('cwd', i), ssh, i);
                            returnItems.push({
                                json: (await ssh.execCommand(command, { cwd })),
                                pairedItem: {
                                    item: i,
                                },
                            });
                        }
                    }
                    if (resource === 'file') {
                        if (operation === 'download') {
                            const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                            const parameterPath = await resolveHomeDir.call(this, this.getNodeParameter('path', i), ssh, i);
                            const binaryFile = await (0, tmp_promise_1.file)({ prefix: 'n8n-ssh-' });
                            try {
                                await ssh.getFile(binaryFile.path, parameterPath);
                                const newItem = {
                                    json: items[i].json,
                                    binary: {},
                                    pairedItem: {
                                        item: i,
                                    },
                                };
                                if (items[i].binary !== undefined && newItem.binary) {
                                    // Create a shallow copy of the binary data so that the old
                                    // data references which do not get changed still stay behind
                                    // but the incoming data does not get changed.
                                    Object.assign(newItem.binary, items[i].binary);
                                }
                                items[i] = newItem;
                                const fileName = this.getNodeParameter('options.fileName', i, '');
                                items[i].binary[dataPropertyNameDownload] = await this.nodeHelpers.copyBinaryFile(binaryFile.path, fileName || parameterPath);
                            }
                            finally {
                                await binaryFile.cleanup();
                            }
                        }
                        if (operation === 'upload') {
                            const parameterPath = await resolveHomeDir.call(this, this.getNodeParameter('path', i), ssh, i);
                            const fileName = this.getNodeParameter('options.fileName', i, '');
                            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                            const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
                            let uploadData;
                            if (binaryData.id) {
                                uploadData = await this.helpers.getBinaryStream(binaryData.id);
                            }
                            else {
                                uploadData = Buffer.from(binaryData.data, n8n_workflow_1.BINARY_ENCODING);
                            }
                            const binaryFile = await (0, tmp_promise_1.file)({ prefix: 'n8n-ssh-' });
                            try {
                                await (0, promises_1.writeFile)(binaryFile.path, uploadData);
                                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                                const rawFileName = fileName || binaryData.fileName || '';
                                const sanitizedFileName = (0, n8n_workflow_1.sanitizeFilename)(rawFileName);
                                await ssh.putFile(binaryFile.path, `${parameterPath}${parameterPath.charAt(parameterPath.length - 1) === '/' ? '' : '/'}${sanitizedFileName}`);
                                returnItems.push({
                                    json: {
                                        success: true,
                                    },
                                    pairedItem: {
                                        item: i,
                                    },
                                });
                            }
                            finally {
                                await binaryFile.cleanup();
                            }
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        if (resource === 'file' && operation === 'download') {
                            items[i] = {
                                json: {
                                    error: error.message,
                                },
                            };
                        }
                        else {
                            returnItems.push({
                                json: {
                                    error: error.message,
                                },
                                pairedItem: {
                                    item: i,
                                },
                            });
                        }
                        continue;
                    }
                    throw error;
                }
            }
        }
        finally {
            ssh.dispose();
        }
        if (resource === 'file' && operation === 'download') {
            // For file downloads the files get attached to the existing items
            return [items];
        }
        else {
            return [returnItems];
        }
    }
}
exports.Ssh = Ssh;
//# sourceMappingURL=Ssh.node.js.map