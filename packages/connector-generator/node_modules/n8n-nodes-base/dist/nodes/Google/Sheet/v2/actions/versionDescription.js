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
exports.versionDescription = exports.authentication = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const sheet = __importStar(require("./sheet/Sheet.resource"));
const spreadsheet = __importStar(require("./spreadsheet/SpreadSheet.resource"));
exports.authentication = {
    displayName: 'Authentication',
    name: 'authentication',
    type: 'options',
    options: [
        {
            name: 'Service Account',
            value: 'serviceAccount',
        },
        {
            // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
            name: 'OAuth2 (recommended)',
            value: 'oAuth2',
        },
    ],
    default: 'oAuth2',
};
const preBuiltAgentsCallout = {
    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
    displayName: 'Manage tasks in Google Sheets using our pre-built',
    name: 'preBuiltAgentsCalloutGoogleSheets',
    type: 'callout',
    typeOptions: {
        calloutAction: {
            label: 'Task management agent',
            icon: 'bot',
            type: 'openSampleWorkflowTemplate',
            templateId: 'task_management_agent_with_google_sheets',
        },
    },
    default: '',
};
exports.versionDescription = {
    displayName: 'Google Sheets',
    name: 'googleSheets',
    icon: 'file:googleSheets.svg',
    group: ['input', 'output'],
    version: [3, 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7],
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Read, update and write data to Google Sheets',
    defaults: {
        name: 'Google Sheets',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    usableAsTool: true,
    hints: [
        {
            message: "Use the 'Minimise API Calls' option for greater efficiency if your sheet is uniformly formatted without gaps between columns or rows",
            displayCondition: '={{$parameter["operation"] === "append" && !$parameter["options"]["useAppend"]}}',
            whenToDisplay: 'beforeExecution',
            location: 'outputPane',
        },
        {
            message: 'No columns found in Google Sheet. All rows will be appended',
            displayCondition: '={{ ["appendOrUpdate", "append"].includes($parameter["operation"]) && $parameter?.columns?.mappingMode === "defineBelow" && !$parameter?.columns?.schema?.length }}',
            whenToDisplay: 'beforeExecution',
            location: 'outputPane',
        },
        {
            type: 'info',
            message: 'Note on using an expression for Sheet: It will be evaluated only once, so all items will use the <em>same</em> sheet. It will be calculated by evaluating the expression for the <strong>first input item</strong>.',
            displayCondition: '={{ $rawParameter.sheetName?.startsWith("=") && $input.all().length > 1 }}',
            whenToDisplay: 'always',
            location: 'outputPane',
        },
        {
            type: 'info',
            message: 'Note on using an expression for Document: It will be evaluated only once, so all items will use the <em>same</em> document. It will be calculated by evaluating the expression for the <strong>first input item</strong>.',
            displayCondition: '={{ $rawParameter.documentId?.startsWith("=") && $input.all().length > 1 }}',
            whenToDisplay: 'always',
            location: 'outputPane',
        },
    ],
    credentials: [
        {
            name: 'googleApi',
            required: true,
            displayOptions: {
                show: {
                    authentication: ['serviceAccount'],
                },
            },
            testedBy: 'googleApiCredentialTest',
        },
        {
            name: 'googleSheetsOAuth2Api',
            required: true,
            displayOptions: {
                show: {
                    authentication: ['oAuth2'],
                },
            },
        },
    ],
    properties: [
        preBuiltAgentsCallout,
        exports.authentication,
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Document',
                    value: 'spreadsheet',
                },
                {
                    name: 'Sheet Within Document',
                    value: 'sheet',
                },
            ],
            default: 'sheet',
        },
        ...sheet.descriptions,
        ...spreadsheet.descriptions,
    ],
};
//# sourceMappingURL=versionDescription.js.map