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
const contact = __importStar(require("./contact"));
const customer = __importStar(require("./customer"));
const rmm = __importStar(require("./rmm"));
const ticket = __importStar(require("./ticket"));
async function router() {
    const items = this.getInputData();
    const operationResult = [];
    for (let i = 0; i < items.length; i++) {
        const resource = this.getNodeParameter('resource', i);
        let operation = this.getNodeParameter('operation', i);
        let responseData = [];
        if (operation === 'del') {
            operation = 'delete';
        }
        const syncroMsp = {
            resource,
            operation,
        };
        try {
            if (syncroMsp.resource === 'customer') {
                responseData = await customer[syncroMsp.operation].execute.call(this, i);
            }
            else if (syncroMsp.resource === 'ticket') {
                responseData = await ticket[syncroMsp.operation].execute.call(this, i);
            }
            else if (syncroMsp.resource === 'contact') {
                responseData = await contact[syncroMsp.operation].execute.call(this, i);
            }
            else if (syncroMsp.resource === 'rmm') {
                responseData = await rmm[syncroMsp.operation].execute.call(this, i);
            }
            const executionData = this.helpers.constructExecutionMetaData(responseData, {
                itemData: { item: i },
            });
            operationResult.push(...executionData);
        }
        catch (err) {
            if (this.continueOnFail()) {
                const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: err.message }), { itemData: { item: i } });
                operationResult.push(...executionErrorData);
            }
            else {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), err, { itemIndex: i });
            }
        }
    }
    return [operationResult];
}
//# sourceMappingURL=router.js.map