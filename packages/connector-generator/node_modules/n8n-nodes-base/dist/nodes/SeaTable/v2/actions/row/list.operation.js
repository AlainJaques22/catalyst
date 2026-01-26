"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
exports.properties = [
    {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
        displayName: 'View Name',
        name: 'viewName',
        type: 'options',
        typeOptions: {
            loadOptionsDependsOn: ['tableName'],
            loadOptionsMethod: 'getTableViews',
        },
        default: '',
        // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
        description: 'The name of SeaTable view to access, or specify by using an expression. Provide it in the way "col.name:::col.type".',
    },
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
        operation: ['list'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    // get parameters
    const tableName = this.getNodeParameter('tableName', index);
    const viewName = this.getNodeParameter('viewName', index);
    const options = this.getNodeParameter('options', index);
    // get collaborators
    const collaborators = await GenericFunctions_1.getBaseCollaborators.call(this);
    // get rows
    const requestMeta = await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'GET', '/api-gateway/api/v2/dtables/{{dtable_uuid}}/metadata/');
    const requestRows = await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'GET', '/api-gateway/api/v2/dtables/{{dtable_uuid}}/rows/', {}, {
        table_name: tableName,
        view_name: viewName,
        limit: 1000,
        convert_keys: options.convert ?? true,
    });
    const metadata = requestMeta.metadata.tables.find((table) => table.name === tableName)
        ?.columns ?? [];
    const rows = requestRows.rows;
    // hide columns like button
    rows.map((row) => (0, GenericFunctions_1.enrichColumns)(row, metadata, collaborators));
    const simple = options.simple ?? true;
    // remove columns starting with _ if simple;
    if (simple) {
        rows.map((row) => (0, GenericFunctions_1.simplify_new)(row));
    }
    return this.helpers.returnJsonArray(rows);
}
//# sourceMappingURL=list.operation.js.map