"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitForm = submitForm;
const GenericFunctions_1 = require("./GenericFunctions");
async function submitForm(resourceName, form) {
    const body = {
        form,
    };
    return await GenericFunctions_1.cockpitApiRequest.call(this, 'POST', `/forms/submit/${resourceName}`, body);
}
//# sourceMappingURL=FormFunctions.js.map