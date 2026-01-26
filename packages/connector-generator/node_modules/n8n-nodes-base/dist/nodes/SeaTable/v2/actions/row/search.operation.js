"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
exports.properties = [
    {
        displayName: 'Column Name or ID',
        name: 'searchColumn',
        type: 'options',
        typeOptions: {
            loadOptionsDependsOn: ['tableName'],
            loadOptionsMethod: 'getSearchableColumns',
        },
        required: true,
        default: '',
        // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-options
        description: 'Select the column to be searched. Not all column types are supported for search. Choose from the list, or specify a name using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
    },
    {
        displayName: 'Search Term',
        name: 'searchTerm',
        type: 'string',
        required: true,
        default: '',
        description: 'What to look for?',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
            {
                displayName: 'Case Insensitive Search',
                name: 'insensitive',
                type: 'boolean',
                default: false,
                description: 'Whether the search ignores case sensitivity (true). Otherwise, it distinguishes between uppercase and lowercase characters.',
            },
            {
                displayName: 'Activate Wildcard Search',
                name: 'wildcard',
                type: 'boolean',
                default: true,
                description: 'Whether the search only results perfect matches (true). Otherwise, it finds a row even if the search value is part of a string (false).',
            },
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
        operation: ['search'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    const tableName = this.getNodeParameter('tableName', index);
    const searchColumn = this.getNodeParameter('searchColumn', index);
    const searchTerm = this.getNodeParameter('searchTerm', index);
    let searchTermString = String(searchTerm);
    const options = this.getNodeParameter('options', index);
    // get collaborators
    const collaborators = await GenericFunctions_1.getBaseCollaborators.call(this);
    // this is the base query. The WHERE has to be finalized...
    let sqlQuery = `SELECT * FROM \`${tableName}\` WHERE \`${searchColumn}\``;
    if (options.insensitive) {
        searchTermString = searchTermString.toLowerCase();
        sqlQuery = `SELECT * FROM \`${tableName}\` WHERE lower(\`${searchColumn}\`)`;
    }
    const wildcard = options.wildcard ?? true;
    if (wildcard)
        sqlQuery = sqlQuery + ' LIKE "%' + searchTermString + '%"';
    else if (!wildcard)
        sqlQuery = sqlQuery + ' = "' + searchTermString + '"';
    const sqlResult = (await GenericFunctions_1.seaTableApiRequest.call(this, {}, 'POST', '/api-gateway/api/v2/dtables/{{dtable_uuid}}/sql', {
        sql: sqlQuery,
        convert_keys: options.convert ?? true,
    }));
    const metadata = sqlResult.metadata;
    const rows = sqlResult.results;
    // hide columns like button
    rows.map((row) => (0, GenericFunctions_1.enrichColumns)(row, metadata, collaborators));
    // remove columns starting with _;
    if (options.simple) {
        rows.map((row) => (0, GenericFunctions_1.simplify_new)(row));
    }
    return this.helpers.returnJsonArray(rows);
}
//# sourceMappingURL=search.operation.js.map