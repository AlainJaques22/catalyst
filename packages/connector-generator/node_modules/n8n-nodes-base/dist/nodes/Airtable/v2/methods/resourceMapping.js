"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumns = getColumns;
exports.getColumnsWithRecordId = getColumnsWithRecordId;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
const airtableReadOnlyFields = [
    'autoNumber',
    'button',
    'count',
    'createdBy',
    'createdTime',
    'formula',
    'lastModifiedBy',
    'lastModifiedTime',
    'lookup',
    'rollup',
    'externalSyncSource',
    'multipleLookupValues',
];
const airtableTypesMap = {
    string: ['singleLineText', 'multilineText', 'richText', 'email', 'phoneNumber', 'url'],
    number: ['rating', 'percent', 'number', 'duration', 'currency'],
    boolean: ['checkbox'],
    dateTime: ['dateTime', 'date'],
    time: [],
    object: [],
    options: ['singleSelect'],
    array: ['multipleSelects', 'multipleRecordLinks', 'multipleAttachments'],
};
function mapForeignType(foreignType, typesMap) {
    let type = 'string';
    for (const nativeType of Object.keys(typesMap)) {
        const mappedForeignTypes = typesMap[nativeType];
        if (mappedForeignTypes?.includes(foreignType)) {
            type = nativeType;
            break;
        }
    }
    return type;
}
async function getColumns() {
    const base = this.getNodeParameter('base', undefined, {
        extractValue: true,
    });
    const tableId = encodeURI(this.getNodeParameter('table', undefined, {
        extractValue: true,
    }));
    const response = await transport_1.apiRequest.call(this, 'GET', `meta/bases/${base}/tables`);
    const tableData = (response.tables || []).find((table) => {
        return table.id === tableId;
    });
    if (!tableData) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Table information could not be found!', {
            level: 'warning',
        });
    }
    const fields = [];
    const constructOptions = (field) => {
        if (field?.options?.choices) {
            return field.options.choices.map((choice) => ({
                name: choice.name,
                value: choice.name,
            }));
        }
        return undefined;
    };
    for (const field of tableData.fields) {
        const type = mapForeignType(field.type, airtableTypesMap);
        const isReadOnly = airtableReadOnlyFields.includes(field.type);
        const options = constructOptions(field);
        fields.push({
            id: field.name,
            displayName: field.name,
            required: false,
            defaultMatch: false,
            canBeUsedToMatch: true,
            display: true,
            type,
            options,
            readOnly: isReadOnly,
            removed: isReadOnly,
        });
    }
    return { fields };
}
async function getColumnsWithRecordId() {
    const returnData = await getColumns.call(this);
    return {
        fields: [
            {
                id: 'id',
                displayName: 'id',
                required: false,
                defaultMatch: true,
                display: true,
                type: 'string',
                readOnly: true,
            },
            ...returnData.fields,
        ],
    };
}
//# sourceMappingURL=resourceMapping.js.map