"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.baseRLC,
        description: 'The Airtable Base to retrieve the schema from',
    },
];
const displayOptions = {
    show: {
        resource: ['base'],
        operation: ['getSchema'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(items) {
    let returnData = [];
    for (let i = 0; i < items.length; i++) {
        try {
            const baseId = this.getNodeParameter('base', i, undefined, {
                extractValue: true,
            });
            const responseData = await transport_1.apiRequest.call(this, 'GET', `meta/bases/${baseId}/tables`);
            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData.tables), {
                itemData: { item: i },
            });
            returnData = returnData.concat(executionData);
        }
        catch (error) {
            error = (0, utils_1.processAirtableError)(error, undefined, i);
            if (this.continueOnFail()) {
                returnData.push({ json: { error: error.message } });
                continue;
            }
            throw error;
        }
    }
    return returnData;
}
//# sourceMappingURL=getSchema.operation.js.map