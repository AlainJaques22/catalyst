"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldEntries = getFieldEntries;
exports.getWorkflowInputValues = getWorkflowInputValues;
exports.getCurrentWorkflowInputData = getCurrentWorkflowInputData;
exports.loadWorkflowInputMappings = loadWorkflowInputMappings;
const generate_schema_1 = require("generate-schema");
const pickBy_1 = __importDefault(require("lodash/pickBy"));
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./constants");
const SUPPORTED_TYPES = constants_1.TYPE_OPTIONS.map((x) => x.value);
function parseJsonSchema(schema) {
    if (schema.type !== 'object') {
        if (schema.type === undefined) {
            return 'Invalid JSON schema. Missing key `type` in schema';
        }
        if (Array.isArray(schema.type)) {
            return `Invalid JSON schema type. Only object type is supported, but got an array of types: ${schema.type.join(', ')}`;
        }
        return `Invalid JSON schema type. Only object type is supported, but got ${schema.type}`;
    }
    if (!schema?.properties) {
        return 'Invalid JSON schema. Missing key `properties` in schema';
    }
    if (typeof schema.properties !== 'object') {
        return 'Invalid JSON schema. Key `properties` is not an object';
    }
    const result = [];
    for (const [name, v] of Object.entries(schema.properties)) {
        if (typeof v !== 'object') {
            return `Invalid JSON schema. Value for property '${name}' is not an object`;
        }
        const type = v?.type;
        if (type === 'null') {
            result.push({ name, type: 'any' });
        }
        else if (Array.isArray(type)) {
            // Schema allows an array of types, but we don't
            return `Invalid JSON schema. Array of types for property '${name}' is not supported by n8n. Either provide a single type or use type 'any' to allow any type`;
        }
        else if (typeof type !== 'string') {
            return `Invalid JSON schema. Unexpected non-string type ${type} for property '${name}'`;
        }
        else if (!SUPPORTED_TYPES.includes(type)) {
            return `Invalid JSON schema. Unsupported type ${type} for property '${name}'. Supported types are ${JSON.stringify(SUPPORTED_TYPES, null, 1)}`;
        }
        else {
            result.push({ name, type: type });
        }
    }
    return result;
}
function parseJsonExample(context) {
    const jsonString = context.getNodeParameter(constants_1.JSON_EXAMPLE, 0, '');
    const json = (0, n8n_workflow_1.jsonParse)(jsonString);
    return (0, generate_schema_1.json)(json);
}
function getFieldEntries(context) {
    const inputSource = context.getNodeParameter(constants_1.INPUT_SOURCE, 0, constants_1.PASSTHROUGH);
    let result = 'Internal Error: Invalid input source';
    try {
        if (inputSource === constants_1.WORKFLOW_INPUTS) {
            result = context.getNodeParameter(`${constants_1.WORKFLOW_INPUTS}.${constants_1.VALUES}`, 0, []);
        }
        else if (inputSource === constants_1.JSON_EXAMPLE) {
            const schema = parseJsonExample(context);
            result = parseJsonSchema(schema);
        }
        else if (inputSource === constants_1.PASSTHROUGH) {
            result = [];
        }
    }
    catch (e) {
        result =
            e && typeof e === 'object' && 'message' in e && typeof e.message === 'string'
                ? e.message
                : `Unknown error occurred: ${JSON.stringify(e)}`;
    }
    if (Array.isArray(result)) {
        const dataMode = String(inputSource);
        const workflow = context.getWorkflow();
        const node = context.getNode();
        return {
            fields: result,
            dataMode,
            subworkflowInfo: { workflowId: workflow.id, triggerId: node.id },
        };
    }
    throw new n8n_workflow_1.NodeOperationError(context.getNode(), result);
}
function getWorkflowInputValues() {
    const inputData = this.getInputData();
    return inputData.map(({ json, binary }, itemIndex) => {
        const itemFieldValues = this.getNodeParameter('workflowInputs.value', itemIndex, {});
        return {
            json: {
                ...json,
                ...itemFieldValues,
            },
            index: itemIndex,
            pairedItem: {
                item: itemIndex,
            },
            binary,
        };
    });
}
function getCurrentWorkflowInputData() {
    const inputData = getWorkflowInputValues.call(this);
    const schema = this.getNodeParameter('workflowInputs.schema', 0, []);
    if (schema.length === 0) {
        return inputData;
    }
    else {
        const removedKeys = new Set(schema.filter((x) => x.removed).map((x) => x.displayName));
        const filteredInputData = inputData.map(({ json, binary }, index) => ({
            index,
            pairedItem: { item: index },
            json: (0, pickBy_1.default)(json, (_v, key) => !removedKeys.has(key)),
            binary,
        }));
        return filteredInputData;
    }
}
async function loadWorkflowInputMappings() {
    const nodeLoadContext = await this.getWorkflowNodeContext(n8n_workflow_1.EXECUTE_WORKFLOW_TRIGGER_NODE_TYPE);
    let fields = [];
    let dataMode = constants_1.PASSTHROUGH;
    let subworkflowInfo;
    if (nodeLoadContext) {
        const fieldValues = getFieldEntries(nodeLoadContext);
        dataMode = fieldValues.dataMode;
        subworkflowInfo = fieldValues.subworkflowInfo;
        fields = fieldValues.fields.map((currentWorkflowInput) => {
            const field = {
                id: currentWorkflowInput.name,
                displayName: currentWorkflowInput.name,
                required: false,
                defaultMatch: false,
                display: true,
                canBeUsedToMatch: true,
            };
            if (currentWorkflowInput.type !== 'any') {
                field.type = currentWorkflowInput.type;
            }
            return field;
        });
    }
    return { fields, dataMode, subworkflowInfo };
}
//# sourceMappingURL=GenericFunctions.js.map