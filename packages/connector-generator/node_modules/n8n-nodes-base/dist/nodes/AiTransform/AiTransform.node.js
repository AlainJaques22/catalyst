"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTransform = void 0;
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
const JavaScriptSandbox_1 = require("../Code/JavaScriptSandbox");
const Sandbox_1 = require("../Code/Sandbox");
const utils_1 = require("../Code/utils");
const { CODE_ENABLE_STDOUT } = process.env;
class AiTransform {
    description = {
        displayName: 'AI Transform',
        name: 'aiTransform',
        icon: 'file:aitransform.svg',
        group: ['transform'],
        version: 1,
        description: 'Modify data based on instructions written in plain english',
        defaults: {
            name: 'AI Transform',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        parameterPane: 'wide',
        hints: [
            {
                message: "This node doesn't have access to the contents of binary files. To use those contents here, use the 'Extract from File' node first.",
                displayCondition: '={{ $input.all().some(i => i.binary) }}',
                location: 'outputPane',
            },
        ],
        properties: [
            {
                displayName: 'Instructions',
                name: 'instructions',
                type: 'button',
                default: '',
                description: "Provide instructions on how you want to transform the data, then click 'Generate code'. Use dot notation to refer to nested fields (e.g. address.street).",
                placeholder: "Example: Merge 'firstname' and 'lastname' into a field 'details.name' and sort by 'email'",
                typeOptions: {
                    buttonConfig: {
                        label: 'Generate code',
                        hasInputField: true,
                        inputFieldMaxLength: 500,
                        action: {
                            type: 'askAiCodeGeneration',
                            target: n8n_workflow_1.AI_TRANSFORM_JS_CODE,
                        },
                    },
                },
            },
            {
                displayName: 'Code Generated For Prompt',
                name: n8n_workflow_1.AI_TRANSFORM_CODE_GENERATED_FOR_PROMPT,
                type: 'hidden',
                default: '',
            },
            {
                displayName: 'Generated JavaScript',
                name: n8n_workflow_1.AI_TRANSFORM_JS_CODE,
                type: 'string',
                typeOptions: {
                    editor: 'jsEditor',
                    editorIsReadOnly: true,
                },
                default: '',
                hint: 'Read-only. To edit this code, adjust the instructions or copy and paste it into a Code node.',
                noDataExpression: true,
            },
        ],
    };
    async execute() {
        const workflowMode = this.getMode();
        const node = this.getNode();
        const codeParameterName = 'jsCode';
        const getSandbox = (index = 0) => {
            let code = '';
            try {
                code = this.getNodeParameter(codeParameterName, index);
                if (!code) {
                    const instructions = this.getNodeParameter('instructions', index);
                    if (!instructions) {
                        throw new n8n_workflow_1.NodeOperationError(node, 'Missing instructions to generate code', {
                            description: "Enter your prompt in the 'Instructions' parameter and click 'Generate code'",
                        });
                    }
                    throw new n8n_workflow_1.NodeOperationError(node, 'Missing code for data transformation', {
                        description: "Click the 'Generate code' button to create the code",
                    });
                }
            }
            catch (error) {
                if (error instanceof n8n_workflow_1.NodeOperationError)
                    throw error;
                throw new n8n_workflow_1.NodeOperationError(node, error);
            }
            const context = Sandbox_1.getSandboxContext.call(this, index);
            context.items = context.$input.all();
            const Sandbox = JavaScriptSandbox_1.JavaScriptSandbox;
            const sandbox = new Sandbox(context, code, this.helpers);
            sandbox.on('output', workflowMode === 'manual'
                ? this.sendMessageToUI.bind(this)
                : CODE_ENABLE_STDOUT === 'true'
                    ? (...args) => console.log(`[Workflow "${this.getWorkflow().id}"][Node "${node.name}"]`, ...args)
                    : () => { });
            return sandbox;
        };
        const sandbox = getSandbox();
        let items;
        try {
            items = (await sandbox.runCodeAllItems());
        }
        catch (error) {
            if (!this.continueOnFail()) {
                (0, set_1.default)(error, 'node', node);
                throw error;
            }
            items = [{ json: { error: error.message } }];
        }
        for (const item of items) {
            (0, utils_1.standardizeOutput)(item.json);
        }
        return [items];
    }
}
exports.AiTransform = AiTransform;
//# sourceMappingURL=AiTransform.node.js.map