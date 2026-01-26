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
exports.versionDescription = void 0;
/* eslint-disable n8n-nodes-base/node-filename-against-convention */
const n8n_workflow_1 = require("n8n-workflow");
const table = __importStar(require("./table/Table.resource"));
const workbook = __importStar(require("./workbook/Workbook.resource"));
const worksheet = __importStar(require("./worksheet/Worksheet.resource"));
exports.versionDescription = {
    displayName: 'Microsoft Excel 365',
    name: 'microsoftExcel',
    icon: 'file:excel.svg',
    group: ['input'],
    version: [2, 2.1, 2.2],
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume Microsoft Excel API',
    defaults: {
        name: 'Microsoft Excel 365',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'microsoftExcelOAuth2Api',
            required: true,
        },
    ],
    properties: [
        {
            displayName: 'This node connects to the Microsoft 365 cloud platform. Use the \'Extract from File\' and \'Convert to File\' nodes to directly manipulate spreadsheet files (.xls, .csv, etc). <a href="https://n8n.io/workflows/890-read-in-an-excel-spreadsheet-file/" target="_blank">More info</a>.',
            name: 'notice',
            type: 'notice',
            default: '',
        },
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Table',
                    value: 'table',
                    description: 'Represents an Excel table',
                },
                {
                    name: 'Workbook',
                    value: 'workbook',
                    description: 'A workbook is the top level object which contains one or more worksheets',
                },
                {
                    name: 'Sheet',
                    value: 'worksheet',
                    description: 'A sheet is a grid of cells which can contain data, tables, charts, etc',
                },
            ],
            default: 'workbook',
        },
        ...table.description,
        ...workbook.description,
        ...worksheet.description,
    ],
};
//# sourceMappingURL=versionDescription.js.map