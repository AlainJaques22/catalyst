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
const base = __importStar(require("./base/Base.resource"));
const record = __importStar(require("./record/Record.resource"));
exports.versionDescription = {
    displayName: 'Airtable',
    name: 'airtable',
    icon: 'file:airtable.svg',
    group: ['input'],
    version: [2, 2.1],
    subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
    description: 'Read, update, write and delete data from Airtable',
    defaults: {
        name: 'Airtable',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'airtableTokenApi',
            required: true,
            displayOptions: {
                show: {
                    authentication: ['airtableTokenApi'],
                },
            },
        },
        {
            name: 'airtableOAuth2Api',
            required: true,
            displayOptions: {
                show: {
                    authentication: ['airtableOAuth2Api'],
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
                    name: 'Access Token',
                    value: 'airtableTokenApi',
                },
                {
                    name: 'OAuth2',
                    value: 'airtableOAuth2Api',
                },
            ],
            default: 'airtableTokenApi',
        },
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Base',
                    value: 'base',
                },
                {
                    name: 'Record',
                    value: 'record',
                },
                // {
                // 	name: 'Table',
                // 	value: 'table',
                // },
            ],
            default: 'record',
        },
        ...record.description,
        ...base.description,
    ],
};
//# sourceMappingURL=versionDescription.js.map