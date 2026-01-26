"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: '',
        placeholder: 'e.g. SELECT id, name FROM product WHERE quantity > $1 AND price <= $2',
        noDataExpression: true,
        required: true,
        description: "The SQL query to execute. You can use n8n expressions and $1, $2, $3, etc to refer to the 'Query Parameters' set in options below.",
        typeOptions: {
            editor: 'sqlEditor',
            sqlDialect: 'PostgreSQL',
        },
        hint: 'Consider using query parameters to prevent SQL injection attacks. Add them in the options below',
    },
    common_descriptions_1.optionsCollection,
];
const displayOptions = {
    show: {
        resource: ['database'],
        operation: ['executeQuery'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(runQueries, items, nodeOptions, _db) {
    const queries = (0, utils_1.replaceEmptyStringsByNulls)(items, nodeOptions.replaceEmptyStrings).map((_, index) => {
        let query = this.getNodeParameter('query', index);
        for (const resolvable of (0, utilities_1.getResolvables)(query)) {
            query = query.replace(resolvable, this.evaluateExpression(resolvable, index));
        }
        let values = [];
        let queryReplacement = this.getNodeParameter('options.queryReplacement', index, '');
        if (typeof queryReplacement === 'number') {
            queryReplacement = String(queryReplacement);
        }
        if (typeof queryReplacement === 'string') {
            const node = this.getNode();
            const rawReplacements = node.parameters.options?.queryReplacement;
            if (rawReplacements) {
                const nodeVersion = nodeOptions.nodeVersion;
                if (nodeVersion >= 2.5) {
                    const rawValues = rawReplacements.replace(/^=+/, '');
                    const resolvables = (0, utilities_1.getResolvables)(rawValues);
                    if (resolvables.length) {
                        for (const resolvable of resolvables) {
                            const evaluatedExpression = (0, utils_1.evaluateExpression)(this.evaluateExpression(`${resolvable}`, index));
                            const evaluatedValues = (0, utils_1.isJSON)(evaluatedExpression)
                                ? [evaluatedExpression]
                                : (0, utils_1.stringToArray)(evaluatedExpression);
                            if (evaluatedValues.length)
                                values.push(...evaluatedValues);
                        }
                    }
                    else {
                        values.push(...(0, utils_1.stringToArray)(rawValues));
                    }
                }
                else {
                    const rawValues = rawReplacements
                        .replace(/^=+/, '')
                        .split(',')
                        .filter((entry) => entry)
                        .map((entry) => entry.trim());
                    for (const rawValue of rawValues) {
                        const resolvables = (0, utilities_1.getResolvables)(rawValue);
                        if (resolvables.length) {
                            for (const resolvable of resolvables) {
                                values.push(this.evaluateExpression(`${resolvable}`, index));
                            }
                        }
                        else {
                            values.push(rawValue);
                        }
                    }
                }
            }
        }
        else {
            if (Array.isArray(queryReplacement)) {
                values = queryReplacement;
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Query Parameters must be a string of comma-separated values or an array of values', { itemIndex: index });
            }
        }
        if (!queryReplacement || nodeOptions.treatQueryParametersInSingleQuotesAsText) {
            let nextValueIndex = values.length + 1;
            const literals = query.match(/'\$[0-9]+'/g) ?? [];
            for (const literal of literals) {
                query = query.replace(literal, `$${nextValueIndex}`);
                values.push(literal.replace(/'/g, ''));
                nextValueIndex++;
            }
        }
        return { query, values, options: { partial: true } };
    });
    return await runQueries(queries, items, nodeOptions);
}
//# sourceMappingURL=executeQuery.operation.js.map