"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
exports.properties = [descriptions_1.numberInputsProperty];
const displayOptions = {
    show: {
        mode: ['append'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(inputsData) {
    const returnData = [];
    for (let i = 0; i < inputsData.length; i++) {
        returnData.push.apply(returnData, inputsData[i]);
    }
    return [returnData];
}
//# sourceMappingURL=append.js.map