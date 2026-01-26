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
const companyReport = __importStar(require("./companyReport"));
const employee = __importStar(require("./employee"));
const employeeDocument = __importStar(require("./employeeDocument"));
const file = __importStar(require("./file"));
exports.versionDescription = {
    credentials: [
        {
            name: 'bambooHrApi',
            required: true,
            testedBy: 'bambooHrApiCredentialTest',
        },
    ],
    defaults: {
        name: 'BambooHR',
    },
    description: 'Consume BambooHR API',
    displayName: 'BambooHR',
    group: ['transform'],
    // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
    icon: 'file:bambooHr.png',
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    name: 'bambooHr',
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Company Report',
                    value: 'companyReport',
                },
                {
                    name: 'Employee',
                    value: 'employee',
                },
                {
                    name: 'Employee Document',
                    value: 'employeeDocument',
                },
                {
                    name: 'File',
                    value: 'file',
                },
            ],
            default: 'employee',
        },
        ...employee.descriptions,
        ...employeeDocument.descriptions,
        ...file.descriptions,
        ...companyReport.descriptions,
    ],
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    version: 1,
};
//# sourceMappingURL=versionDescription.js.map