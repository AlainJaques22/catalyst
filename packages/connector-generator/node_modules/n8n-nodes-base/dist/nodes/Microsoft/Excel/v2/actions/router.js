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
exports.router = router;
const n8n_workflow_1 = require("n8n-workflow");
const table = __importStar(require("./table/Table.resource"));
const workbook = __importStar(require("./workbook/Workbook.resource"));
const worksheet = __importStar(require("./worksheet/Worksheet.resource"));
async function router() {
    const items = this.getInputData();
    let returnData = [];
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const microsoftExcel = {
        resource,
        operation,
    };
    switch (microsoftExcel.resource) {
        case 'table':
            returnData = await table[microsoftExcel.operation].execute.call(this, items);
            break;
        case 'workbook':
            returnData = await workbook[microsoftExcel.operation].execute.call(this, items);
            break;
        case 'worksheet':
            returnData = await worksheet[microsoftExcel.operation].execute.call(this, items);
            break;
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map