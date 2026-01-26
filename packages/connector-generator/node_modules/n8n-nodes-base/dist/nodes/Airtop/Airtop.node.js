"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Airtop = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const agent = __importStar(require("./actions/agent/Agent.resource"));
const extraction = __importStar(require("./actions/extraction/Extraction.resource"));
const file = __importStar(require("./actions/file/File.resource"));
const interaction = __importStar(require("./actions/interaction/Interaction.resource"));
const router_1 = require("./actions/router");
const session = __importStar(require("./actions/session/Session.resource"));
const window = __importStar(require("./actions/window/Window.resource"));
class Airtop {
    description = {
        displayName: 'Airtop',
        name: 'airtop',
        icon: 'file:airtop.svg',
        group: ['transform'],
        defaultVersion: 1,
        version: [1, 1.1],
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Scrape and control any site with Airtop',
        usableAsTool: true,
        defaults: {
            name: 'Airtop',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'airtopApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Agent',
                        value: 'agent',
                    },
                    {
                        name: 'Extraction',
                        value: 'extraction',
                    },
                    {
                        name: 'File',
                        value: 'file',
                    },
                    {
                        name: 'Interaction',
                        value: 'interaction',
                    },
                    {
                        name: 'Session',
                        value: 'session',
                    },
                    {
                        name: 'Window',
                        value: 'window',
                    },
                ],
                default: 'session',
            },
            ...agent.description,
            ...session.description,
            ...window.description,
            ...file.description,
            ...extraction.description,
            ...interaction.description,
        ],
    };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.Airtop = Airtop;
//# sourceMappingURL=Airtop.node.js.map