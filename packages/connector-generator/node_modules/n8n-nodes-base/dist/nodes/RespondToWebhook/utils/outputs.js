"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuredOutputs = void 0;
const configuredOutputs = (version, parameters) => {
    const multipleOutputs = version === 1.3 || (version >= 1.4 && parameters.enableResponseOutput);
    if (multipleOutputs) {
        return [
            {
                type: 'main',
                displayName: 'Input Data',
            },
            {
                type: 'main',
                displayName: 'Response',
            },
        ];
    }
    return ['main'];
};
exports.configuredOutputs = configuredOutputs;
//# sourceMappingURL=outputs.js.map