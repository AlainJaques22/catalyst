"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Npm = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const DistTagDescription_1 = require("./DistTagDescription");
const PackageDescription_1 = require("./PackageDescription");
class Npm {
    description = {
        displayName: 'Npm',
        name: 'npm',
        icon: 'file:npm.svg',
        group: ['input'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Consume NPM registry API',
        defaults: {
            name: 'npm',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'npmApi',
                required: false,
            },
        ],
        requestDefaults: {
            baseURL: '={{ $credentials.registryUrl }}',
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Package',
                        value: 'package',
                    },
                    {
                        name: 'Distribution Tag',
                        value: 'distTag',
                    },
                ],
                default: 'package',
            },
            ...PackageDescription_1.packageOperations,
            ...PackageDescription_1.packageFields,
            ...DistTagDescription_1.distTagOperations,
            ...DistTagDescription_1.distTagFields,
        ],
    };
}
exports.Npm = Npm;
//# sourceMappingURL=Npm.node.js.map