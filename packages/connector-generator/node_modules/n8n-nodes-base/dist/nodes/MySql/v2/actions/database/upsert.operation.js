"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const interfaces_1 = require("../../helpers/interfaces");
const utils_1 = require("../../helpers/utils");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        displayName: 'Data Mode',
        name: 'dataMode',
        type: 'options',
        options: [
            {
                name: 'Auto-Map Input Data to Columns',
                value: interfaces_1.DATA_MODE.AUTO_MAP,
                description: 'Use when node input properties names exactly match the table column names',
            },
            {
                name: 'Map Each Column Below',
                value: interfaces_1.DATA_MODE.MANUAL,
                description: 'Set the value for each destination column manually',
            },
        ],
        default: interfaces_1.AUTO_MAP,
        description: 'Whether to map node input properties and the table data automatically or manually',
    },
    {
        displayName: `
		In this mode, make sure incoming data fields are named the same as the columns in your table. If needed, use an 'Edit Fields' node before this node to change the field names.
		`,
        name: 'notice',
        type: 'notice',
        default: '',
        displayOptions: {
            show: {
                dataMode: [interfaces_1.DATA_MODE.AUTO_MAP],
            },
        },
    },
    {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
        displayName: 'Column to Match On',
        name: 'columnToMatchOn',
        type: 'options',
        required: true,
        // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
        description: 'The column to compare when finding the rows to update. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/" target="_blank">expression</a>.',
        typeOptions: {
            loadOptionsMethod: 'getColumns',
            loadOptionsDependsOn: ['schema.value', 'table.value'],
        },
        default: '',
        hint: "Used to find the correct row to update. Doesn't get changed. Has to be unique.",
    },
    {
        displayName: 'Value of Column to Match On',
        name: 'valueToMatchOn',
        type: 'string',
        default: '',
        description: 'Rows with a value in the specified "Column to Match On" that corresponds to the value in this field will be updated. New rows will be created for non-matching items.',
        displayOptions: {
            show: {
                dataMode: [interfaces_1.DATA_MODE.MANUAL],
            },
        },
    },
    {
        displayName: 'Values to Send',
        name: 'valuesToSend',
        placeholder: 'Add Value',
        type: 'fixedCollection',
        typeOptions: {
            multipleValueButtonText: 'Add Value',
            multipleValues: true,
        },
        displayOptions: {
            show: {
                dataMode: [interfaces_1.DATA_MODE.MANUAL],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Values',
                name: 'values',
                values: [
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
                        displayName: 'Column',
                        name: 'column',
                        type: 'options',
                        // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
                        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/" target="_blank">expression</a>',
                        typeOptions: {
                            loadOptionsMethod: 'getColumnsWithoutColumnToMatchOn',
                            loadOptionsDependsOn: ['schema.value', 'table.value'],
                        },
                        default: [],
                    },
                    {
                        displayName: 'Value',
                        name: 'value',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    common_descriptions_1.optionsCollection,
];
const displayOptions = {
    show: {
        resource: ['database'],
        operation: ['upsert'],
    },
    hide: {
        table: [''],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(inputItems, runQueries, nodeOptions) {
    let returnData = [];
    const items = (0, utils_1.replaceEmptyStringsByNulls)(inputItems, nodeOptions.replaceEmptyStrings);
    const queries = [];
    for (let i = 0; i < items.length; i++) {
        const table = this.getNodeParameter('table', i, undefined, {
            extractValue: true,
        });
        const columnToMatchOn = this.getNodeParameter('columnToMatchOn', i);
        const dataMode = this.getNodeParameter('dataMode', i);
        let item = {};
        if (dataMode === interfaces_1.DATA_MODE.AUTO_MAP) {
            item = items[i].json;
        }
        if (dataMode === interfaces_1.DATA_MODE.MANUAL) {
            const valuesToSend = this.getNodeParameter('valuesToSend', i, [])
                .values;
            item = valuesToSend.reduce((acc, { column, value }) => {
                acc[column] = value;
                return acc;
            }, {});
            item[columnToMatchOn] = this.getNodeParameter('valueToMatchOn', i);
        }
        const onConflict = 'ON DUPLICATE KEY UPDATE';
        const columns = Object.keys(item);
        const escapedColumns = columns.map(utils_1.escapeSqlIdentifier).join(', ');
        const placeholder = `${columns.map(() => '?').join(',')}`;
        const insertQuery = `INSERT INTO ${(0, utils_1.escapeSqlIdentifier)(table)}(${escapedColumns}) VALUES(${placeholder})`;
        const values = Object.values(item);
        const updateColumns = Object.keys(item).filter((column) => column !== columnToMatchOn);
        const updates = [];
        for (const column of updateColumns) {
            updates.push(`${(0, utils_1.escapeSqlIdentifier)(column)} = ?`);
            values.push(item[column]);
        }
        const query = `${insertQuery} ${onConflict} ${updates.join(', ')}`;
        queries.push({ query, values });
    }
    returnData = await runQueries(queries);
    return returnData;
}
//# sourceMappingURL=upsert.operation.js.map