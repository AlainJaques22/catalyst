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
const utilities_1 = require("../../../../utils/utilities");
const transport_1 = require("../../transport");
const utils_1 = require("../helpers/utils");
async function router() {
    let returnData = [];
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const credentials = await this.getCredentials('postgres');
    const options = this.getNodeParameter('options', 0, {});
    const node = this.getNode();
    options.nodeVersion = node.typeVersion;
    options.operation = operation;
    const { db, pgp } = await transport_1.configurePostgres.call(this, credentials, options);
    const runQueries = utils_1.configureQueryRunner.call(this, this.getNode(), this.continueOnFail(), pgp, db);
    const postgresNodeData = {
        resource,
        operation,
    };
    switch (postgresNodeData.resource) {
        case 'database':
            returnData = await database[postgresNodeData.operation].execute.call(this, runQueries, items, options, db, pgp);
            break;
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
    }
    (0, utilities_1.addExecutionHints)(this, node, items, operation, node.executeOnce);
    return [returnData];
}
//# sourceMappingURL=router.js.map