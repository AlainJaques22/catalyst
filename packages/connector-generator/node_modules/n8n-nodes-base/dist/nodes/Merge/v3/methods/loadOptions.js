"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolveClashOptions = getResolveClashOptions;
exports.getInputs = getInputs;
async function getResolveClashOptions() {
    const numberOfInputs = this.getNodeParameter('numberInputs', 2);
    if (numberOfInputs <= 2) {
        return [
            {
                name: 'Always Add Input Number to Field Names',
                value: 'addSuffix',
            },
            {
                name: 'Prefer Input 1 Version',
                value: 'preferInput1',
            },
            {
                name: 'Prefer Input 2 Version',
                value: 'preferLast',
            },
        ];
    }
    else {
        return [
            {
                name: 'Always Add Input Number to Field Names',
                value: 'addSuffix',
            },
            {
                name: 'Use Earliest Version',
                value: 'preferInput1',
            },
        ];
    }
}
async function getInputs() {
    const numberOfInputs = this.getNodeParameter('numberInputs', 2);
    const returnData = [];
    for (let i = 0; i < numberOfInputs; i++) {
        returnData.push({
            name: `${i + 1}`,
            value: i + 1,
        });
    }
    return returnData;
}
//# sourceMappingURL=loadOptions.js.map