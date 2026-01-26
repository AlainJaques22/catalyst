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
const member = __importStar(require("./member"));
const message = __importStar(require("./message"));
const webhook = __importStar(require("./webhook"));
const configureWaitTillDate_util_1 = require("../../../../utils/sendAndWait/configureWaitTillDate.util");
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function router() {
    let returnData = [];
    let resource = 'webhook';
    //resource parameter is hidden when authentication is set to webhook
    //prevent error when getting resource parameter
    try {
        resource = this.getNodeParameter('resource', 0);
    }
    catch (error) { }
    const operation = this.getNodeParameter('operation', 0);
    let guildId = '';
    let userGuilds = [];
    if (resource !== 'webhook') {
        guildId = this.getNodeParameter('guildId', 0, '', {
            extractValue: true,
        });
        const isOAuth2 = this.getNodeParameter('authentication', 0, '') === 'oAuth2';
        if (isOAuth2) {
            userGuilds = (await transport_1.discordApiRequest.call(this, 'GET', '/users/@me/guilds'));
            (0, utils_1.checkAccessToGuild)(this.getNode(), guildId, userGuilds);
        }
    }
    const discord = {
        resource,
        operation,
    };
    if (discord.resource === 'message' && discord.operation === n8n_workflow_1.SEND_AND_WAIT_OPERATION) {
        returnData = await message[discord.operation].execute.call(this, guildId, userGuilds);
        const waitTill = (0, configureWaitTillDate_util_1.configureWaitTillDate)(this);
        await this.putExecutionToWait(waitTill);
        return [returnData];
    }
    switch (discord.resource) {
        case 'channel':
            returnData = await channel[discord.operation].execute.call(this, guildId, userGuilds);
            break;
        case 'message':
            returnData = await message[discord.operation].execute.call(this, guildId, userGuilds);
            break;
        case 'member':
            returnData = await member[discord.operation].execute.call(this, guildId);
            break;
        case 'webhook':
            returnData = await webhook[discord.operation].execute.call(this);
            break;
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known`);
    }
    return [returnData];
}
//# sourceMappingURL=router.js.map