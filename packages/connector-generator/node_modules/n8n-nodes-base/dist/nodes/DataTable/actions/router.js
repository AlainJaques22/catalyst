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
const row = __importStar(require("./row/Row.resource"));
const fields_1 = require("../common/fields");
const utils_1 = require("../common/utils");
const BULK_OPERATIONS = ['insert'];
function hasBulkExecute(operation) {
    return BULK_OPERATIONS.includes(operation);
}
function hasComplexId(ctx) {
    const dataTableIdExpr = ctx.getNodeParameter(`${fields_1.DATA_TABLE_ID_FIELD}.value`, 0, undefined, {
        rawExpressions: true,
    });
    return typeof dataTableIdExpr === 'string' && dataTableIdExpr.includes('{');
}
async function router() {
    let operationResult = [];
    let responseData = [];
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const dataTableNodeData = {
        resource,
        operation,
    };
    // If the operation supports
    if (hasBulkExecute(dataTableNodeData.operation) && !hasComplexId(this)) {
        try {
            const proxy = await (0, utils_1.getDataTableProxyExecute)(this);
            responseData = await row[dataTableNodeData.operation]['executeBulk'].call(this, proxy);
            operationResult = responseData;
        }
        catch (error) {
            if (this.continueOnFail()) {
                operationResult = this.getInputData().map((json) => ({
                    json,
                    error: error,
                }));
            }
            else {
                throw error;
            }
        }
    }
    else {
        for (let i = 0; i < items.length; i++) {
            try {
                responseData = await row[dataTableNodeData.operation].execute.call(this, i);
                const executionData = this.helpers.constructExecutionMetaData(responseData, {
                    itemData: { item: i },
                });
                // pushing here risks stack overflows for very high numbers (~100k) of results on filter-based queries (update, get, etc.)
                operationResult = operationResult.concat(executionData);
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
    }
    return [operationResult];
}
//# sourceMappingURL=router.js.map