"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const email_templates_1 = require("../../../../../../utils/sendAndWait/email-templates");
const utils_1 = require("../../../../../../utils/sendAndWait/utils");
const utils_2 = require("../../helpers/utils");
const transport_1 = require("../../transport");
exports.description = (0, utils_1.getSendAndWaitProperties)([
    {
        displayName: 'To',
        name: 'toRecipients',
        description: 'Comma-separated list of email addresses of recipients',
        type: 'string',
        required: true,
        default: '',
    },
]);
async function execute(index, items) {
    const toRecipients = this.getNodeParameter('toRecipients', index);
    const config = (0, utils_1.getSendAndWaitConfig)(this);
    const buttons = [];
    for (const option of config.options) {
        buttons.push((0, utils_1.createButton)(option.url, option.label, option.style));
    }
    let bodyContent;
    if (config.appendAttribution !== false) {
        const instanceId = this.getInstanceId();
        bodyContent = (0, email_templates_1.createEmailBodyWithN8nAttribution)(config.message, buttons.join('\n'), instanceId);
    }
    else {
        bodyContent = (0, email_templates_1.createEmailBodyWithoutN8nAttribution)(config.message, buttons.join('\n'));
    }
    const fields = {
        subject: config.title,
        bodyContent,
        toRecipients,
        bodyContentType: 'html',
    };
    const message = (0, utils_2.createMessage)(fields);
    const body = { message };
    await transport_1.microsoftApiRequest.call(this, 'POST', '/sendMail', body);
    return items;
}
//# sourceMappingURL=sendAndWait.operation.js.map