"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utils_1 = require("../../../../../utils/sendAndWait/utils");
const utils_2 = require("../../helpers/utils");
const common_description_1 = require("../common.description");
exports.description = (0, utils_1.getSendAndWaitProperties)(common_description_1.sendToProperties, 'message', undefined, {
    noButtonStyle: true,
    defaultApproveLabel: '✓ Approve',
    defaultDisapproveLabel: '✗ Decline',
}).filter((p) => p.name !== 'subject');
async function execute(guildId, userGuilds) {
    const items = this.getInputData();
    const isOAuth2 = this.getNodeParameter('authentication', 0) === 'oAuth2';
    try {
        await utils_2.sendDiscordMessage.call(this, {
            guildId,
            userGuilds,
            isOAuth2,
            body: (0, utils_2.createSendAndWaitMessageBody)(this),
            items,
        });
    }
    catch (error) {
        const err = utils_2.parseDiscordError.call(this, error, 0);
        if (this.continueOnFail()) {
            return utils_2.prepareErrorData.call(this, err, 0);
        }
        throw err;
    }
    return items;
}
//# sourceMappingURL=sendAndWait.operation.js.map