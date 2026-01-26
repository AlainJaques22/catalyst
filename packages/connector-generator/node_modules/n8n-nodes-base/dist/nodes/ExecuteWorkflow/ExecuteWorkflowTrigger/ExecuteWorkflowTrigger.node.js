"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteWorkflowTrigger = void 0;
const pickBy_1 = __importDefault(require("lodash/pickBy"));
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../../../utils/workflowInputsResourceMapping/constants");
const GenericFunctions_1 = require("../../../utils/workflowInputsResourceMapping/GenericFunctions");
class ExecuteWorkflowTrigger {
    description = {
        displayName: 'Execute Workflow Trigger',
        name: 'executeWorkflowTrigger',
        icon: 'fa:sign-out-alt',
        group: ['trigger'],
        version: [1, 1.1],
        description: 'Helpers for calling other n8n workflows. Used for designing modular, microservice-like workflows.',
        eventTriggerDescription: '',
        maxNodes: 1,
        defaults: {
            name: 'When Executed by Another Workflow',
            color: '#ff6d5a',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        hints: [
            {
                message: "This workflow isn't set to accept any input data. Fill out the workflow input schema or change the workflow to accept any data passed to it.",
                // This condition checks if we have no input fields, which gets a bit awkward:
                // For WORKFLOW_INPUTS: keys() only contains `VALUES` if at least one value is provided
                // For JSON_EXAMPLE: We remove all whitespace and check if we're left with an empty object. Note that we already error if the example is not valid JSON
                displayCondition: `={{$parameter['${constants_1.INPUT_SOURCE}'] === '${constants_1.WORKFLOW_INPUTS}' && !$parameter['${constants_1.WORKFLOW_INPUTS}'].keys().length ` +
                    `|| $parameter['${constants_1.INPUT_SOURCE}'] === '${constants_1.JSON_EXAMPLE}' && $parameter['${constants_1.JSON_EXAMPLE}'].toString().replaceAll(' ', '').replaceAll('\\n', '') === '{}' }}`,
                whenToDisplay: 'always',
                location: 'ndv',
            },
        ],
        properties: [
            {
                displayName: 'Events',
                name: 'events',
                type: 'hidden',
                noDataExpression: true,
                options: [
                    {
                        name: 'Workflow Call',
                        value: 'worklfow_call',
                        description: 'When executed by another workflow using Execute Workflow Trigger',
                        action: 'When executed by Another Workflow',
                    },
                ],
                default: 'worklfow_call',
            },
            {
                displayName: "When an ‘execute workflow’ node calls this workflow, the execution starts here. Any data passed into the 'execute workflow' node will be output by this node.",
                name: 'notice',
                type: 'notice',
                default: '',
                displayOptions: {
                    show: { '@version': [{ _cnd: { eq: 1 } }] },
                },
            },
            {
                displayName: 'This node is out of date. Please upgrade by removing it and adding a new one',
                name: 'outdatedVersionWarning',
                type: 'notice',
                displayOptions: { show: { '@version': [{ _cnd: { eq: 1 } }] } },
                default: '',
            },
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                displayName: 'Input data mode',
                name: constants_1.INPUT_SOURCE,
                type: 'options',
                options: [
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'Define using fields below',
                        value: constants_1.WORKFLOW_INPUTS,
                        description: 'Provide input fields via UI',
                    },
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'Define using JSON example',
                        value: constants_1.JSON_EXAMPLE,
                        description: 'Generate a schema from an example JSON object',
                    },
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
                        name: 'Accept all data',
                        value: constants_1.PASSTHROUGH,
                        description: 'Use all incoming data from the parent workflow',
                    },
                ],
                default: constants_1.WORKFLOW_INPUTS,
                noDataExpression: true,
                displayOptions: {
                    show: { '@version': [{ _cnd: { gte: 1.1 } }] },
                },
            },
            {
                displayName: 'Provide an example object to infer fields and their types.<br>To allow any type for a given field, set the value to null.',
                name: `${constants_1.JSON_EXAMPLE}_notice`,
                type: 'notice',
                default: '',
                displayOptions: {
                    show: { '@version': [{ _cnd: { gte: 1.1 } }], inputSource: [constants_1.JSON_EXAMPLE] },
                },
            },
            {
                displayName: 'JSON Example',
                name: constants_1.JSON_EXAMPLE,
                type: 'json',
                default: JSON.stringify({
                    aField: 'a string',
                    aNumber: 123,
                    thisFieldAcceptsAnyType: null,
                    anArray: [],
                }, null, 2),
                noDataExpression: true,
                displayOptions: {
                    show: { '@version': [{ _cnd: { gte: 1.1 } }], inputSource: [constants_1.JSON_EXAMPLE] },
                },
            },
            {
                displayName: 'Workflow Input Schema',
                name: constants_1.WORKFLOW_INPUTS,
                placeholder: 'Add field',
                type: 'fixedCollection',
                description: 'Define expected input fields. If no inputs are provided, all data from the calling workflow will be passed through.',
                typeOptions: {
                    multipleValues: true,
                    sortable: true,
                    minRequiredFields: 1,
                },
                displayOptions: {
                    show: { '@version': [{ _cnd: { gte: 1.1 } }], inputSource: [constants_1.WORKFLOW_INPUTS] },
                },
                default: {},
                options: [
                    {
                        name: constants_1.VALUES,
                        displayName: 'Values',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                placeholder: 'e.g. fieldName',
                                description: 'A unique name for this workflow input, used to reference it from another workflows',
                                required: true,
                                noDataExpression: true,
                            },
                            {
                                displayName: 'Type',
                                name: 'type',
                                type: 'options',
                                description: "Expected data type for this input value. Determines how this field's values are stored, validated, and displayed.",
                                options: constants_1.TYPE_OPTIONS,
                                required: true,
                                default: 'string',
                                noDataExpression: true,
                            },
                        ],
                    },
                ],
            },
        ],
    };
    async execute() {
        const inputData = this.getInputData();
        const inputSource = this.getNodeParameter(constants_1.INPUT_SOURCE, 0, constants_1.PASSTHROUGH);
        // Note on the data we receive from ExecuteWorkflow caller:
        //
        // The ExecuteWorkflow node typechecks all fields explicitly provided by the user here via the resourceMapper
        // and removes all fields that are in the schema, but `removed` in the resourceMapper.
        //
        // In passthrough and legacy node versions, inputData will line up since the resourceMapper is empty,
        // in which case all input is passed through.
        // In other cases we will already have matching types and fields provided by the resource mapper,
        // so we just need to be permissive on this end,
        // while ensuring we provide default values for fields in our schema, which are removed in the resourceMapper.
        if (inputSource === constants_1.PASSTHROUGH) {
            return [inputData];
        }
        else {
            const newParams = (0, GenericFunctions_1.getFieldEntries)(this);
            const newKeys = new Set(newParams.fields.map((x) => x.name));
            const itemsInSchema = inputData.map(({ json, binary }, index) => ({
                json: {
                    ...Object.fromEntries(newParams.fields.map((x) => [x.name, constants_1.FALLBACK_DEFAULT_VALUE])),
                    // Need to trim to the expected schema to support legacy Execute Workflow callers passing through all their data
                    // which we do not want to expose past this node.
                    ...(0, pickBy_1.default)(json, (_value, key) => newKeys.has(key)),
                },
                index,
                binary,
            }));
            return [itemsInSchema];
        }
    }
}
exports.ExecuteWorkflowTrigger = ExecuteWorkflowTrigger;
//# sourceMappingURL=ExecuteWorkflowTrigger.node.js.map