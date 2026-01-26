"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordV2 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
const utils_1 = require("../../../utils/sendAndWait/utils");
class DiscordV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
            usableAsTool: true,
        };
    }
    methods = {
        listSearch: methods_1.listSearch,
        loadOptions: methods_1.loadOptions,
    };
    webhook = utils_1.sendAndWaitWebhook;
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.DiscordV2 = DiscordV2;
//# sourceMappingURL=DiscordV2.node.js.map