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
const base = __importStar(require("./base/Base.resource"));
const record = __importStar(require("./record/Record.resource"));
async function router() {
    let returnData = [];
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const airtableNodeData = {
        resource,
        operation,
    };
    try {
        switch (airtableNodeData.resource) {
            case 'record':
                const baseId = this.getNodeParameter('base', 0, undefined, {
                    extractValue: true,
                });
                const table = encodeURI(this.getNodeParameter('table', 0, undefined, {
                    extractValue: true,
                }));
                returnData = await record[airtableNodeData.operation].execute.call(this, items, baseId, table);
                break;
            case 'base':
                returnData = await base[airtableNodeData.operation].execute.call(this, items);
                break;
            default:
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
        }
    }
    catch (error) {
        if (error.description &&
            error.description.includes('cannot accept the provided value')) {
            error.description = `${error.description}. Consider using 'Typecast' option`;
        }
        throw error;
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map