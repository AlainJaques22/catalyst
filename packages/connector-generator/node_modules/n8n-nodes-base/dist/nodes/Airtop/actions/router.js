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
const agent = __importStar(require("./agent/Agent.resource"));
const output_utils_1 = require("./common/output.utils");
const extraction = __importStar(require("./extraction/Extraction.resource"));
const file = __importStar(require("./file/File.resource"));
const interaction = __importStar(require("./interaction/Interaction.resource"));
const session = __importStar(require("./session/Session.resource"));
const window = __importStar(require("./window/Window.resource"));
async function router() {
    const operationResult = [];
    let responseData = [];
    const nodeType = this.getNode().type;
    const isCalledAsTool = nodeType.includes('airtopTool');
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const airtopNodeData = {
        resource,
        operation,
    };
    for (let i = 0; i < items.length; i++) {
        try {
            switch (airtopNodeData.resource) {
                case 'agent':
                    responseData = await agent[airtopNodeData.operation].execute.call(this, i);
                    break;
                case 'session':
                    responseData = await session[airtopNodeData.operation].execute.call(this, i);
                    break;
                case 'window':
                    responseData = await window[airtopNodeData.operation].execute.call(this, i);
                    break;
                case 'interaction':
                    responseData = await interaction[airtopNodeData.operation].execute.call(this, i);
                    break;
                case 'extraction':
                    responseData = await extraction[airtopNodeData.operation].execute.call(this, i);
                    break;
                case 'file':
                    responseData = await file[airtopNodeData.operation].execute.call(this, i);
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not supported!`);
            }
            // Get cleaner output when called as tool
            if (isCalledAsTool) {
                responseData = (0, output_utils_1.cleanOutputForToolUse)(responseData);
            }
            const executionData = this.helpers.constructExecutionMetaData(responseData, {
                itemData: { item: i },
            });
            operationResult.push(...executionData);
        }
        catch (error) {
            if (this.continueOnFail()) {
                operationResult.push({
                    json: this.getInputData(i)[0].json,
                    error: error,
                });
            }
            else {
                throw error;
            }
        }
    }
    return [operationResult];
}
//# sourceMappingURL=router.js.map