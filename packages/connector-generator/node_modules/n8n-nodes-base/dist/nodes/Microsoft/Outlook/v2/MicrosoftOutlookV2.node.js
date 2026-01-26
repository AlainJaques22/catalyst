"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOutlookV2 = void 0;
const node_description_1 = require("./actions/node.description");
const router_1 = require("./actions/router");
const methods_1 = require("./methods");
const utils_1 = require("../../../../utils/sendAndWait/utils");
class MicrosoftOutlookV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...node_description_1.description,
        };
    }
    methods = { loadOptions: methods_1.loadOptions, listSearch: methods_1.listSearch };
    webhook = utils_1.sendAndWaitWebhook;
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.MicrosoftOutlookV2 = MicrosoftOutlookV2;
//# sourceMappingURL=MicrosoftOutlookV2.node.js.map