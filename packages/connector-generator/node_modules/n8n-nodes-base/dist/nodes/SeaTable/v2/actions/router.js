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
const asset = __importStar(require("./asset"));
const base = __importStar(require("./base"));
const link = __importStar(require("./link"));
const row = __importStar(require("./row"));
async function router() {
    const items = this.getInputData();
    const operationResult = [];
    let responseData = [];
    for (let i = 0; i < items.length; i++) {
        const resource = this.getNodeParameter('resource', i);
        const operation = this.getNodeParameter('operation', i);
        const seatable = {
            resource,
            operation,
        };
        try {
            if (seatable.resource === 'row') {
                responseData = await row[seatable.operation].execute.call(this, i);
            }
            else if (seatable.resource === 'base') {
                responseData = await base[seatable.operation].execute.call(this, i);
            }
            else if (seatable.resource === 'link') {
                responseData = await link[seatable.operation].execute.call(this, i);
            }
            else if (seatable.resource === 'asset') {
                responseData = await asset[seatable.operation].execute.call(this, i);
            }
            const executionData = this.helpers.constructExecutionMetaData(responseData, {
                itemData: { item: i },
            });
            operationResult.push(...executionData);
        }
        catch (error) {
            if (this.continueOnFail()) {
                operationResult.push({ json: this.getInputData(i)[0].json, error });
            }
            else {
                if (error.context)
                    error.context.itemIndex = i;
                throw error;
            }
        }
    }
    return [operationResult];
}
//# sourceMappingURL=router.js.map