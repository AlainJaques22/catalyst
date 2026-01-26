"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftTeamsV2 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
const utils_1 = require("../../../../utils/sendAndWait/utils");
class MicrosoftTeamsV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
            usableAsTool: true,
        };
    }
    methods = { listSearch: methods_1.listSearch };
    webhook = utils_1.sendAndWaitWebhook;
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.MicrosoftTeamsV2 = MicrosoftTeamsV2;
//# sourceMappingURL=MicrosoftTeamsV2.node.js.map