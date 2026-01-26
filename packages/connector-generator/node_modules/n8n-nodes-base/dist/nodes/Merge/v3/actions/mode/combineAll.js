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
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [descriptions_1.clashHandlingProperties, descriptions_1.fuzzyCompareProperty],
    },
];
const displayOptions = {
    show: {
        mode: ['combine'],
        combineBy: ['combineAll'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(inputsData) {
    const returnData = [];
    const clashHandling = this.getNodeParameter('options.clashHandling.values', 0, {});
    let input1 = inputsData[0];
    let input2 = inputsData[1];
    if (clashHandling.resolveClash === 'preferInput1') {
        [input1, input2] = [input2, input1];
    }
    if (clashHandling.resolveClash === 'addSuffix') {
        input1 = (0, utils_1.addSuffixToEntriesKeys)(input1, '1');
        input2 = (0, utils_1.addSuffixToEntriesKeys)(input2, '2');
    }
    const mergeIntoSingleObject = (0, utils_1.selectMergeMethod)(clashHandling);
    if (!input1 || !input2) {
        return [returnData];
    }
    let entry1;
    let entry2;
    for (entry1 of input1) {
        for (entry2 of input2) {
            returnData.push({
                json: {
                    ...mergeIntoSingleObject(entry1.json, entry2.json),
                },
                binary: {
                    ...(0, merge_1.default)({}, entry1.binary, entry2.binary),
                },
                pairedItem: [entry1.pairedItem, entry2.pairedItem],
            });
        }
    }
    return [returnData];
}
//# sourceMappingURL=combineAll.js.map