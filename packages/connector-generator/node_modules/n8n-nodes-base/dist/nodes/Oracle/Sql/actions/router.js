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
const database = __importStar(require("./database/Database.resource"));
const node_type_1 = require("./node.type");
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function router() {
    let returnData = [];
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    if (!(0, node_type_1.isOracleDBOperation)(operation)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not a valid value!`);
    }
    const credentials = await this.getCredentials('oracleDBApi');
    const options = this.getNodeParameter('options', 0, {});
    const node = this.getNode();
    options.nodeVersion = node.typeVersion;
    options.operation = operation;
    options.autoCommit = options.autoCommit ?? true;
    const pool = await transport_1.configureOracleDB.call(this, credentials, options);
    const runQueries = utils_1.configureQueryRunner.call(this, this.getNode(), this.continueOnFail(), pool);
    const oracleDBNodeData = {
        resource,
        operation,
    };
    switch (oracleDBNodeData.resource) {
        case 'database':
            returnData = await database[oracleDBNodeData.operation].execute.call(this, runQueries, items, options, pool);
            break;
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
    }
    if (operation === 'select' && items.length > 1 && !node.executeOnce) {
        this.addExecutionHints({
            message: `This node ran ${items.length} times, once for each input item. To run for the first item only, enable 'execute once' in the node settings`,
            location: 'outputPane',
        });
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map