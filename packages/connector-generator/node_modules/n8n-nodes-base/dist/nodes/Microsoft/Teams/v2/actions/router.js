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
const channel = __importStar(require("./channel"));
const channelMessage = __importStar(require("./channelMessage"));
const chatMessage = __importStar(require("./chatMessage"));
const task = __importStar(require("./task"));
const configureWaitTillDate_util_1 = require("../../../../../utils/sendAndWait/configureWaitTillDate.util");
async function router() {
    const items = this.getInputData();
    const returnData = [];
    let responseData;
    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);
    const nodeVersion = this.getNode().typeVersion;
    const instanceId = this.getInstanceId();
    const microsoftTeamsTypeData = {
        resource,
        operation,
    };
    if (microsoftTeamsTypeData.resource === 'chatMessage' &&
        microsoftTeamsTypeData.operation === n8n_workflow_1.SEND_AND_WAIT_OPERATION) {
        await chatMessage[microsoftTeamsTypeData.operation].execute.call(this, 0, instanceId);
        const waitTill = (0, configureWaitTillDate_util_1.configureWaitTillDate)(this);
        await this.putExecutionToWait(waitTill);
        return [items];
    }
    for (let i = 0; i < items.length; i++) {
        try {
            switch (microsoftTeamsTypeData.resource) {
                case 'channel':
                    responseData = await channel[microsoftTeamsTypeData.operation].execute.call(this, i);
                    break;
                case 'channelMessage':
                    responseData = await channelMessage[microsoftTeamsTypeData.operation].execute.call(this, i, nodeVersion, instanceId);
                    break;
                case 'chatMessage':
                    responseData = await chatMessage[microsoftTeamsTypeData.operation].execute.call(this, i, instanceId);
                    break;
                case 'task':
                    responseData = await task[microsoftTeamsTypeData.operation].execute.call(this, i);
                    break;
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not supported!`);
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        catch (error) {
            if (this.continueOnFail()) {
                const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                returnData.push(...executionErrorData);
                continue;
            }
            throw error;
        }
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map