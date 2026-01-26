"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const descriptions_1 = require("./descriptions");
const utils_1 = require("./utils");
const configureWaitTillDate_util_1 = require("../../../utils/sendAndWait/configureWaitTillDate.util");
const email_templates_1 = require("../../../utils/sendAndWait/email-templates");
const utils_2 = require("../../../utils/sendAndWait/utils");
exports.description = (0, utils_2.getSendAndWaitProperties)([descriptions_1.fromEmailProperty, descriptions_1.toEmailProperty], 'email');
async function execute() {
    const fromEmail = this.getNodeParameter('fromEmail', 0);
    const toEmail = this.getNodeParameter('toEmail', 0);
    const config = (0, utils_2.getSendAndWaitConfig)(this);
    const buttons = [];
    for (const option of config.options) {
        buttons.push((0, utils_2.createButton)(option.url, option.label, option.style));
    }
    let htmlBody;
    if (config.appendAttribution !== false) {
        const instanceId = this.getInstanceId();
        htmlBody = (0, email_templates_1.createEmailBodyWithN8nAttribution)(config.message, buttons.join('\n'), instanceId);
    }
    else {
        htmlBody = (0, email_templates_1.createEmailBodyWithoutN8nAttribution)(config.message, buttons.join('\n'));
    }
    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: config.title,
        html: htmlBody,
    };
    const credentials = await this.getCredentials('smtp');
    const transporter = (0, utils_1.configureTransport)(credentials, {});
    await transporter.sendMail(mailOptions);
    const waitTill = (0, configureWaitTillDate_util_1.configureWaitTillDate)(this);
    await this.putExecutionToWait(waitTill);
    return [this.getInputData()];
}
//# sourceMappingURL=sendAndWait.operation.js.map