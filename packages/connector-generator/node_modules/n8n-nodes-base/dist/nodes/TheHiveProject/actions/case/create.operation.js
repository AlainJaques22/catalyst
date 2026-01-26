"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const set_1 = __importDefault(require("lodash/set"));
const utilities_1 = require("../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const properties = [
    {
        displayName: 'Fields',
        name: 'caseFields',
        type: 'resourceMapper',
        default: {
            mappingMode: 'defineBelow',
            value: null,
        },
        noDataExpression: true,
        required: true,
        typeOptions: {
            resourceMapper: {
                resourceMapperMethod: 'getCaseFields',
                mode: 'add',
                valuesLabel: 'Fields',
            },
        },
    },
];
const displayOptions = {
    show: {
        resource: ['case'],
        operation: ['create'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i, item) {
    let responseData = [];
    let inputData = {};
    const dataMode = this.getNodeParameter('caseFields.mappingMode', i);
    if (dataMode === 'autoMapInputData') {
        const schema = this.getNodeParameter('caseFields.schema', i);
        inputData = (0, utils_1.prepareInputItem)(item.json, schema, i);
    }
    if (dataMode === 'defineBelow') {
        const caseFields = this.getNodeParameter('caseFields.value', i, []);
        inputData = caseFields;
    }
    inputData = (0, utils_1.fixFieldType)(inputData);
    const body = {};
    for (const field of Object.keys(inputData)) {
        // use set to construct the updateBody, as it allows to process customFields.fieldName
        // if customFields provided under customFields property, it will be send as is
        (0, set_1.default)(body, field, inputData[field]);
    }
    responseData = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/case', body);
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=create.operation.js.map