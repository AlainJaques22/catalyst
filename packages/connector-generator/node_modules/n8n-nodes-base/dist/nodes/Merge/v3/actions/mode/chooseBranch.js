"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
exports.properties = [
    descriptions_1.numberInputsProperty,
    {
        displayName: 'Output Type',
        name: 'chooseBranchMode',
        type: 'options',
        options: [
            {
                name: 'Wait for All Inputs to Arrive',
                value: 'waitForAll',
            },
        ],
        default: 'waitForAll',
    },
    {
        displayName: 'Output',
        name: 'output',
        type: 'options',
        options: [
            {
                name: 'Data of Specified Input',
                value: 'specifiedInput',
            },
            {
                name: 'A Single, Empty Item',
                value: 'empty',
            },
        ],
        default: 'specifiedInput',
        displayOptions: {
            show: {
                chooseBranchMode: ['waitForAll'],
            },
        },
    },
    {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
        displayName: 'Use Data of Input',
        name: 'useDataOfInput',
        type: 'options',
        default: 1,
        displayOptions: {
            show: {
                output: ['specifiedInput'],
            },
        },
        typeOptions: {
            minValue: 1,
            loadOptionsMethod: 'getInputs',
            loadOptionsDependsOn: ['numberInputs'],
        },
        // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
        description: 'The number of the input to use data of',
        validateType: 'number',
    },
];
const displayOptions = {
    show: {
        mode: ['chooseBranch'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(inputsData) {
    const returnData = [];
    const chooseBranchMode = this.getNodeParameter('chooseBranchMode', 0);
    if (chooseBranchMode === 'waitForAll') {
        const output = this.getNodeParameter('output', 0);
        if (output === 'specifiedInput') {
            const useDataOfInput = this.getNodeParameter('useDataOfInput', 0);
            if (useDataOfInput > inputsData.length) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Input ${useDataOfInput} doesn't exist`, {
                    description: `The node has only ${inputsData.length} inputs, so selecting input ${useDataOfInput} is not possible.`,
                });
            }
            const inputData = inputsData[useDataOfInput - 1];
            returnData.push.apply(returnData, inputData);
        }
        if (output === 'empty') {
            const pairedItem = [
                ...this.getInputData(0).map((inputData) => inputData.pairedItem),
                ...this.getInputData(1).map((inputData) => inputData.pairedItem),
            ].flatMap(utilities_1.preparePairedItemDataArray);
            returnData.push({
                json: {},
                pairedItem,
            });
        }
    }
    return [returnData];
}
//# sourceMappingURL=chooseBranch.js.map