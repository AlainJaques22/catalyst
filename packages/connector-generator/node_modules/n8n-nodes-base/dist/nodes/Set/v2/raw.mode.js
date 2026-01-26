"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("./helpers/utils");
const utilities_1 = require("../../../utils/utilities");
const properties = [
    {
        displayName: 'JSON',
        name: 'jsonOutput',
        type: 'json',
        typeOptions: {
            rows: 5,
        },
        default: '{\n  "my_field_1": "value",\n  "my_field_2": 1\n}\n',
        validateType: 'object',
        ignoreValidationDuringExecution: true,
    },
];
const displayOptions = {
    show: {
        mode: ['raw'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(item, i, options, rawData, node) {
    try {
        let newData;
        if (rawData.jsonOutput === undefined) {
            const json = this.getNodeParameter('jsonOutput', i);
            newData = (0, utils_1.parseJsonParameter)(json, node, i);
        }
        else {
            newData = (0, utils_1.parseJsonParameter)(utils_1.resolveRawData.call(this, rawData.jsonOutput, i), node, i);
        }
        return utils_1.composeReturnItem.call(this, i, item, newData, options, node.typeVersion);
    }
    catch (error) {
        if (this.continueOnFail()) {
            return { json: { error: error.message }, pairedItem: { item: i } };
        }
        throw new n8n_workflow_1.NodeOperationError(node, error, {
            itemIndex: i,
            description: error.description,
        });
    }
}
//# sourceMappingURL=raw.mode.js.map