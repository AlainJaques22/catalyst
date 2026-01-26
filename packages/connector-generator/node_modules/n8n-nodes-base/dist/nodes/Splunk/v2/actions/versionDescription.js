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
const alert = __importStar(require("./alert"));
const report = __importStar(require("./report"));
const search = __importStar(require("./search"));
const user = __importStar(require("./user"));
exports.versionDescription = {
    displayName: 'Splunk',
    name: 'splunk',
    icon: 'file:splunk.svg',
    group: ['transform'],
    version: 2,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume the Splunk Enterprise API',
    defaults: {
        name: 'Splunk',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    credentials: [
        {
            name: 'splunkApi',
            required: true,
        },
    ],
    properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Alert',
                    value: 'alert',
                },
                {
                    name: 'Report',
                    value: 'report',
                },
                {
                    name: 'Search',
                    value: 'search',
                },
                {
                    name: 'User',
                    value: 'user',
                },
            ],
            default: 'search',
        },
        ...alert.description,
        ...report.description,
        ...search.description,
        ...user.description,
    ],
};
//# sourceMappingURL=versionDescription.js.map