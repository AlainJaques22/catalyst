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
const alert = __importStar(require("./alert"));
const case_ = __importStar(require("./case"));
const comment = __importStar(require("./comment"));
const log = __importStar(require("./log"));
const observable = __importStar(require("./observable"));
const page = __importStar(require("./page"));
const query = __importStar(require("./query"));
const task = __importStar(require("./task"));
async function router() {
    const items = this.getInputData();
    const returnData = [];
    const length = items.length;
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    let executionData = [];
    const theHiveNodeData = {
        resource,
        operation,
    };
    for (let i = 0; i < length; i++) {
        try {
            switch (theHiveNodeData.resource) {
                case 'alert':
                    executionData = await alert[theHiveNodeData.operation].execute.call(this, i, items[i]);
                    break;
                case 'case':
                    executionData = await case_[theHiveNodeData.operation].execute.call(this, i, items[i]);
                    break;
                case 'comment':
                    executionData = await comment[theHiveNodeData.operation].execute.call(this, i);
                    break;
                case 'log':
                    executionData = await log[theHiveNodeData.operation].execute.call(this, i, items[i]);
                    break;
                case 'observable':
                    executionData = await observable[theHiveNodeData.operation].execute.call(this, i, items[i]);
                    break;
                case 'page':
                    executionData = await page[theHiveNodeData.operation].execute.call(this, i);
                    break;
                case 'query':
                    executionData = await query[theHiveNodeData.operation].execute.call(this, i);
                    break;
                case 'task':
                    executionData = await task[theHiveNodeData.operation].execute.call(this, i, items[i]);
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
            }
            returnData.push(...executionData);
        }
        catch (error) {
            if (this.continueOnFail()) {
                executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                returnData.push(...executionData);
                continue;
            }
            throw error;
        }
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map