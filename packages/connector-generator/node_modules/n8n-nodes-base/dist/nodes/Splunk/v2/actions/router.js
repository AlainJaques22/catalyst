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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
const alert = __importStar(require("./alert"));
const report = __importStar(require("./report"));
const search = __importStar(require("./search"));
const user = __importStar(require("./user"));
async function router() {
    const items = this.getInputData();
    let returnData = [];
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const splunkNodeData = {
        resource,
        operation,
    };
    let responseData;
    for (let i = 0; i < items.length; i++) {
        try {
            switch (splunkNodeData.resource) {
                case 'alert':
                    responseData = await alert[splunkNodeData.operation].execute.call(this, i);
                    break;
                case 'report':
                    responseData = await report[splunkNodeData.operation].execute.call(this, i);
                    break;
                case 'search':
                    responseData = await search[splunkNodeData.operation].execute.call(this, i);
                    break;
                case 'user':
                    responseData = await user[splunkNodeData.operation].execute.call(this, i);
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Resource not found', { itemIndex: i });
            }
        }
        catch (error) {
            if (this.continueOnFail()) {
                returnData.push({ json: { error: error.cause.error }, pairedItem: { item: i } });
                continue;
            }
            if (error instanceof n8n_workflow_1.NodeApiError) {
                (0, set_1.default)(error, 'context.itemIndex', i);
                throw error;
            }
            if (error instanceof n8n_workflow_1.NodeOperationError) {
                if (error?.context?.itemIndex === undefined) {
                    (0, set_1.default)(error, 'context.itemIndex', i);
                }
                throw error;
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, { itemIndex: i });
        }
        const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
        returnData = returnData.concat(executionData);
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map