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
        displayName: 'Columns',
        name: 'columns',
        type: 'resourceMapper',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        noDataExpression: true,
        required: true,
        typeOptions: {
            loadOptionsDependsOn: ['table.value', 'base.value'],
            resourceMapper: {
                resourceMapperMethod: 'getColumns',
                mode: 'add',
                fieldWords: {
                    singular: 'column',
                    plural: 'columns',
                },
                addAllFields: true,
                multiKeyMatch: true,
            },
        },
    },
    ...common_descriptions_1.insertUpdateOptions,
];
const displayOptions = {
    show: {
        resource: ['record'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(items, base, table) {
    const returnData = [];
    const endpoint = `${base}/${table}`;
    const dataMode = this.getNodeParameter('columns.mappingMode', 0);
    for (let i = 0; i < items.length; i++) {
        try {
            const options = this.getNodeParameter('options', i, {});
            const typecast = Boolean(options.typecast);
            const body = { typecast };
            if (dataMode === 'autoMapInputData') {
                body.fields = (0, utils_1.removeIgnored)(items[i].json, options.ignoreFields);
            }
            if (dataMode === 'defineBelow') {
                const fields = this.getNodeParameter('columns.value', i, [], {
                    skipValidation: typecast,
                });
                body.fields = fields;
            }
            const responseData = await transport_1.apiRequest.call(this, 'POST', endpoint, body);
            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), { itemData: { item: i } });
            returnData.push.apply(returnData, executionData);
        }
        catch (error) {
            error = (0, utils_1.processAirtableError)(error, undefined, i);
            if (this.continueOnFail()) {
                returnData.push({ json: { message: error.message, error } });
                continue;
            }
            throw error;
        }
    }
    return returnData;
}
//# sourceMappingURL=create.operation.js.map