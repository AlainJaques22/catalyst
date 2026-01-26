"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeValidationParameter = exports.getTypeValidationStrictness = void 0;
const getTypeValidationStrictness = (version) => {
    return `={{ ($nodeVersion < ${version} ? $parameter.options.looseTypeValidation :  $parameter.looseTypeValidation) ? "loose" : "strict" }}`;
};
exports.getTypeValidationStrictness = getTypeValidationStrictness;
const getTypeValidationParameter = (version) => {
    return (context, itemIndex, option) => {
        if (context.getNode().typeVersion < version) {
            return option;
        }
        else {
            return context.getNodeParameter('looseTypeValidation', itemIndex, false);
        }
    };
};
exports.getTypeValidationParameter = getTypeValidationParameter;
//# sourceMappingURL=utils.js.map