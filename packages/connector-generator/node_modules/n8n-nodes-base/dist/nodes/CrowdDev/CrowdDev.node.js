"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrowdDev = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
class CrowdDev {
    description = {
        displayName: 'crowd.dev',
        name: 'crowdDev',
        icon: { light: 'file:crowdDev.svg', dark: 'file:crowdDev.dark.svg' },
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'crowd.dev is an open-source suite of community and data tools built to unlock community-led growth for your organization.',
        defaults: {
            name: 'crowd.dev',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'crowdDevApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: '={{$credentials.url}}/api/tenant/{{$credentials.tenantId}}',
            json: true,
            skipSslCertificateValidation: '={{ $credentials.allowUnauthorizedCerts }}',
        },
        properties: descriptions_1.allProperties,
    };
}
exports.CrowdDev = CrowdDev;
//# sourceMappingURL=CrowdDev.node.js.map