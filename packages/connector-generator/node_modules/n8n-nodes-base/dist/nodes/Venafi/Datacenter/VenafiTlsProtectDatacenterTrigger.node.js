"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenafiTlsProtectDatacenterTrigger = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class VenafiTlsProtectDatacenterTrigger {
    description = {
        displayName: 'Venafi TLS Protect Datacenter Trigger',
        name: 'venafiTlsProtectDatacenterTrigger',
        icon: 'file:../venafi.svg',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["triggerOn"]}}',
        description: 'Starts the workflow when Venafi events occur',
        defaults: {
            name: 'Venafi TLS Protect Datacenter​',
        },
        credentials: [
            {
                name: 'venafiTlsProtectDatacenterApi',
                required: true,
            },
        ],
        polling: true,
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Trigger On',
                name: 'triggerOn',
                type: 'options',
                options: [
                    {
                        name: 'Certificate Expired',
                        value: 'certificateExpired',
                    },
                ],
                required: true,
                default: 'certificateExpired',
            },
        ],
    };
    async poll() {
        const webhookData = this.getWorkflowStaticData('node');
        const qs = {};
        const now = (0, moment_timezone_1.default)().format();
        qs.ValidToGreater = webhookData.lastTimeChecked || now;
        qs.ValidToLess = now;
        const { Certificates: certificates } = await GenericFunctions_1.venafiApiRequest.call(this, 'GET', '/vedsdk/certificates', {}, qs);
        webhookData.lastTimeChecked = qs.ValidToLess;
        if (Array.isArray(certificates) && certificates.length !== 0) {
            return [this.helpers.returnJsonArray(certificates)];
        }
        return null;
    }
}
exports.VenafiTlsProtectDatacenterTrigger = VenafiTlsProtectDatacenterTrigger;
//# sourceMappingURL=VenafiTlsProtectDatacenterTrigger.node.js.map