"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
exports.properties = [
    {
        displayName: 'Data to Send',
        name: 'fieldsToSend',
        type: 'options',
        options: [
            {
                name: 'Auto-Map Input Data to Columns',
                value: 'autoMapInputData',
                description: 'Use when node input properties match destination column names',
            },
            {
                name: 'Define Below for Each Column',
                value: 'defineBelow',
                description: 'Set the value for each destination column',
            },
        ],
        default: 'defineBelow',
        description: 'Whether to insert the input data this node receives in the new row',
    },
    {
        displayName: 'Inputs to Ignore',
        name: 'inputsToIgnore',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['row'],
                operation: ['update'],
                fieldsToSend: ['autoMapInputData'],
            },
        },
        default: '',
        description: 'List of input properties to avoid sending, separated by commas. Leave empty to send all properties.',
        placeholder: 'Enter properties...',
    },
    {
        displayName: 'Columns to Send',
        name: 'columnsUi',
        placeholder: 'Add Column',
        type: 'fixedCollection',
        typeOptions: {
            multipleValueButtonText: 'Add Column to Send',
            multipleValues: true,
        },
        options: [
            {
                displayName: 'Column',
                name: 'columnValues',
                values: [
                    {
                        displayName: 'Column Name or ID',
                        name: 'columnName',
                        type: 'options',
                        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                        typeOptions: {
                            loadOptionsDependsOn: ['tableName'],
                            loadOptionsMethod: 'getTableUpdateAbleColumns',
                        },
                        default: '',
                    },
                    {
                        displayName: 'Column Value',
                        name: 'columnValue',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
        displayOptions: {
            show: {
                resource: ['row'],
                operation: ['update'],
                fieldsToSend: ['defineBelow'],
            },
        },
        default: {},
        description: 'Add destination column with its value. Provide the value in this way:Date: YYYY-MM-DD or YYYY-MM-DD hh:mmDuration: time in secondsCheckbox: true, on or 1Multi-Select: comma-separated list.',
    },
    {
        displayName: 'Hint: Link, files, images or digital signatures have to be added separately.',
        name: 'notice',
        type: 'notice',
        default: '',
    },
];
const displayOptions = {
    show: {
        resource: ['row'],
        operation: ['update'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    const tableName = this.getNodeParameter('tableName', index);
    const tableColumns = await GenericFunctions_1.getTableColumns.call(this, tableName);
    const fieldsToSend = this.getNodeParameter('fieldsToSend', index);
    const rowId = this.getNodeParameter('rowId', index);
    let rowInput = {};
    // get rowInput, an object of key:value pairs like { Name: 'Promo Action 1', Status: "Draft" }.
    if (fieldsToSend === 'autoMapInputData') {
        const items = this.getInputData();
        const incomingKeys = Object.keys(items[index].json);
        const inputDataToIgnore = (0, GenericFunctions_1.split)(this.getNodeParameter('inputsToIgnore', index, ''));
        for (const key of incomingKeys) {
            if (inputDataToIgnore.includes(key))
                continue;
            rowInput[key] = items[index].json[key];
        }
    }
    else {
        const columns = this.getNodeParameter('columnsUi.columnValues', index, []);
        for (const column of columns) {
            rowInput[column.columnName] = column.columnValue;
        }
    }
    // only keep key:value pairs for columns that are allowed to update.
    rowInput = (0, GenericFunctions_1.rowExport)(rowInput, (0, GenericFunctions_1.updateAble)(tableColumns));
    // string to array: multi-select and collaborators
    rowInput = (0, GenericFunctions_1.splitStringColumnsToArrays)(rowInput, tableColumns);
    const body = {
        table_name: tableName,
        updates: [
            {
                row_id: rowId,
                row: rowInput,
            },
        ],
    };
    const responseData = await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'PUT', '/api-gateway/api/v2/dtables/{{dtable_uuid}}/rows/', body);
    return this.helpers.returnJsonArray(responseData);
}
//# sourceMappingURL=update.operation.js.map