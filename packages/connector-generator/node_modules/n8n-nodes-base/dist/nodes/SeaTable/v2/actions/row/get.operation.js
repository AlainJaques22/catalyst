"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
exports.properties = [
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
            {
                displayName: 'Simplify',
                name: 'simple',
                type: 'boolean',
                default: true,
                description: 'Whether to return a simplified version of the response instead of the raw data',
            },
            {
                displayName: 'Return Column Names',
                name: 'convert',
                type: 'boolean',
                default: true,
                description: 'Whether to return the column keys (false) or the column names (true)',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['row'],
        operation: ['get'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    // get parameters
    const tableName = this.getNodeParameter('tableName', index);
    const rowId = this.getNodeParameter('rowId', index);
    const options = this.getNodeParameter('options', index);
    // get collaborators
    const collaborators = await GenericFunctions_1.getBaseCollaborators.call(this);
    // get rows
    const sqlResult = (await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'POST', '/api-gateway/api/v2/dtables/{{dtable_uuid}}/sql/', {
        sql: `SELECT * FROM \`${tableName}\` WHERE _id = '${rowId}'`,
        convert_keys: options.convert ?? true,
    }));
    const metadata = sqlResult.metadata;
    const rows = sqlResult.results;
    // hide columns like button
    rows.map((row) => (0, GenericFunctions_1.enrichColumns)(row, metadata, collaborators));
    const simple = options.simple ?? true;
    // remove columns starting with _ if simple;
    if (simple) {
        rows.map((row) => (0, GenericFunctions_1.simplify_new)(row));
    }
    return this.helpers.returnJsonArray(rows);
}
//# sourceMappingURL=get.operation.js.map