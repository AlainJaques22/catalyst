"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const merge_1 = __importDefault(require("lodash/merge"));
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const utils_1 = require("../../helpers/utils");
exports.properties = [
    descriptions_1.numberInputsProperty,
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                ...descriptions_1.clashHandlingProperties,
                default: { values: { resolveClash: 'addSuffix' } },
            },
            {
                displayName: 'Include Any Unpaired Items',
                name: 'includeUnpaired',
                type: 'boolean',
                default: false,
                description: 'Whether unpaired items should be included in the result when there are differing numbers of items among the inputs',
            },
        ],
    },
];
const displayOptions = {
    show: {
        mode: ['combine'],
        combineBy: ['combineByPosition'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(inputsData) {
    const returnData = [];
    const clashHandling = this.getNodeParameter('options.clashHandling.values', 0, {});
    const includeUnpaired = this.getNodeParameter('options.includeUnpaired', 0, false);
    let preferredInputIndex;
    if (clashHandling?.resolveClash?.includes('preferInput')) {
        preferredInputIndex = Number(clashHandling.resolveClash.replace('preferInput', '')) - 1;
    }
    else {
        preferredInputIndex = inputsData.length - 1;
    }
    const preferred = inputsData[preferredInputIndex];
    if (clashHandling.resolveClash === 'addSuffix') {
        for (const [inputIndex, input] of inputsData.entries()) {
            inputsData[inputIndex] = (0, utils_1.addSuffixToEntriesKeys)(input, String(inputIndex + 1));
        }
    }
    let numEntries;
    if (includeUnpaired) {
        numEntries = Math.max(...inputsData.map((input) => input.length), preferred.length);
    }
    else {
        numEntries = Math.min(...inputsData.map((input) => input.length), preferred.length);
        if (numEntries === 0) {
            this.addExecutionHints({
                message: 'Consider enabling "Include Any Unpaired Items" in options or check your inputs',
            });
            return [returnData];
        }
    }
    const mergeIntoSingleObject = (0, utils_1.selectMergeMethod)(clashHandling);
    for (let i = 0; i < numEntries; i++) {
        const preferredEntry = preferred[i] ?? {};
        const restEntries = inputsData.map((input) => input[i] ?? {});
        const json = {
            ...mergeIntoSingleObject({}, ...restEntries.map((entry) => entry.json ?? {}), preferredEntry.json ?? {}),
        };
        const binary = {
            ...(0, merge_1.default)({}, ...restEntries.map((entry) => entry.binary ?? {}), preferredEntry.binary ?? {}),
        };
        const pairedItem = [
            ...restEntries.map((entry) => entry.pairedItem).flat(),
            preferredEntry.pairedItem,
        ].filter((item) => item !== undefined);
        returnData.push({ json, binary, pairedItem });
    }
    return [returnData];
}
//# sourceMappingURL=combineByPosition.js.map