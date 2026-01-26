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
exports.ReadWriteFile = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const read = __importStar(require("./actions/read.operation"));
const write = __importStar(require("./actions/write.operation"));
class ReadWriteFile {
    description = {
        displayName: 'Read/Write Files from Disk',
        name: 'readWriteFile',
        icon: 'file:readWriteFile.svg',
        group: ['input'],
        version: 1,
        description: 'Read or write files from the computer that runs n8n',
        defaults: {
            name: 'Read/Write Files from Disk',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Use this node to read and write files on the same computer running n8n. To handle files between different computers please use other nodes (e.g. FTP, HTTP Request, AWS).',
                name: 'info',
                type: 'notice',
                default: '',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Read File(s) From Disk',
                        value: 'read',
                        description: 'Retrieve one or more files from the computer that runs n8n',
                        action: 'Read File(s) From Disk',
                    },
                    {
                        name: 'Write File to Disk',
                        value: 'write',
                        description: 'Create a binary file on the computer that runs n8n',
                        action: 'Write File to Disk',
                    },
                ],
                default: 'read',
            },
            ...read.description,
            ...write.description,
        ],
    };
    async execute() {
        const operation = this.getNodeParameter('operation', 0, 'read');
        const items = this.getInputData();
        let returnData = [];
        if (operation === 'read') {
            returnData = await read.execute.call(this, items);
        }
        if (operation === 'write') {
            returnData = await write.execute.call(this, items);
        }
        return [returnData];
    }
}
exports.ReadWriteFile = ReadWriteFile;
//# sourceMappingURL=ReadWriteFile.node.js.map