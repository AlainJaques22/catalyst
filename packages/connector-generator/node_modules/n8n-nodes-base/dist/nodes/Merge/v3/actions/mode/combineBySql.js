"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const di_1 = require("@n8n/di");
const alasql_1 = __importDefault(require("alasql"));
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../utils/utilities");
const descriptions_1 = require("../../helpers/descriptions");
const utils_1 = require("../../helpers/utils");
const alasql = alasql_1.default;
function disableAlasqlFileAccess() {
    const disabledFunction = () => {
        throw new Error('File access operations are disabled for security reasons');
    };
    // Disable file reading functions that could be used to access the file system
    if (alasql.fn) {
        alasql.fn.FILE = disabledFunction;
        alasql.fn.JSON = disabledFunction;
        alasql.fn.TXT = disabledFunction;
        alasql.fn.CSV = disabledFunction;
        alasql.fn.XLSX = disabledFunction;
        alasql.fn.XLS = disabledFunction;
        alasql.fn.LOAD = disabledFunction;
        alasql.fn.SAVE = disabledFunction;
    }
    // Also disable the FROM handlers which are used for file operations
    if (alasql.from) {
        alasql.from.FILE = disabledFunction;
        alasql.from.JSON = disabledFunction;
        alasql.from.TXT = disabledFunction;
        alasql.from.CSV = disabledFunction;
        alasql.from.XLSX = disabledFunction;
        alasql.from.XLS = disabledFunction;
    }
    // Override the engines that handle file operations
    if (alasql.engines) {
        alasql.engines.FILE = disabledFunction;
        alasql.engines.JSON = disabledFunction;
        alasql.engines.TXT = disabledFunction;
        alasql.engines.CSV = disabledFunction;
        alasql.engines.XLSX = disabledFunction;
        alasql.engines.XLS = disabledFunction;
    }
}
exports.properties = [
    descriptions_1.numberInputsProperty,
    {
        displayName: 'Query',
        name: 'query',
        type: 'string',
        default: 'SELECT * FROM input1 LEFT JOIN input2 ON input1.name = input2.id',
        noDataExpression: true,
        description: 'Input data available as tables with corresponding number, e.g. input1, input2',
        hint: 'Supports <a href="https://github.com/alasql/alasql/wiki/Supported-SQL-statements" target="_blank">most</a> of the SQL-99 language',
        required: true,
        typeOptions: {
            rows: 5,
            editor: 'sqlEditor',
        },
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Empty Query Result',
                name: 'emptyQueryResult',
                type: 'options',
                description: 'What to return if the query executed successfully but returned no results',
                options: [
                    {
                        name: 'Success',
                        value: 'success',
                    },
                    {
                        name: 'Empty Result',
                        value: 'empty',
                    },
                ],
                default: 'empty',
            },
        ],
        displayOptions: {
            show: {
                '@version': [3.2],
            },
        },
    },
];
const displayOptions = {
    show: {
        mode: ['combineBySql'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
const prepareError = (node, error) => {
    let message = '';
    if (typeof error === 'string') {
        message = error;
    }
    else {
        message = error.message;
    }
    throw new n8n_workflow_1.NodeOperationError(node, error, {
        message: 'Issue while executing query',
        description: message,
        itemIndex: 0,
    });
};
async function executeSelectWithMappedPairedItems(node, inputsData, query, returnSuccessItemIfEmpty) {
    const returnData = [];
    const db = new alasql.Database(node.id);
    try {
        for (let i = 0; i < inputsData.length; i++) {
            const inputData = inputsData[i];
            db.exec(`CREATE TABLE input${i + 1}`);
            db.tables[`input${i + 1}`].data = inputData.map((entry) => ({
                ...entry.json,
                pairedItem: entry.pairedItem,
            }));
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(node, error, {
            message: 'Issue while creating table from',
            description: error.message,
            itemIndex: 0,
        });
    }
    try {
        const result = db.exec((0, utils_1.modifySelectQuery)(query, inputsData.length));
        for (const item of result) {
            if (Array.isArray(item)) {
                returnData.push.apply(returnData, item.map(utils_1.rowToExecutionData));
            }
            else if (typeof item === 'object') {
                returnData.push((0, utils_1.rowToExecutionData)(item));
            }
        }
        if (!returnData.length && returnSuccessItemIfEmpty) {
            returnData.push({ json: { success: true } });
        }
    }
    catch (error) {
        prepareError(node, error);
    }
    finally {
        delete alasql.databases[node.id];
    }
    return [returnData];
}
async function execute(inputsData) {
    disableAlasqlFileAccess();
    const node = this.getNode();
    const returnData = [];
    const pairedItem = [];
    const options = this.getNodeParameter('options', 0, {});
    let query = this.getNodeParameter('query', 0);
    for (const resolvable of (0, utilities_1.getResolvables)(query)) {
        query = query.replace(resolvable, this.evaluateExpression(resolvable, 0));
    }
    const isSelectQuery = node.typeVersion >= 3.1 ? query.toLowerCase().startsWith('select') : false;
    const returnSuccessItemIfEmpty = node.typeVersion <= 3.1 ? true : options.emptyQueryResult === 'success';
    if (isSelectQuery) {
        try {
            return await executeSelectWithMappedPairedItems(node, inputsData, query, returnSuccessItemIfEmpty);
        }
        catch (error) {
            di_1.Container.get(n8n_core_1.ErrorReporter).error(error, {
                extra: {
                    nodeName: node.name,
                    nodeType: node.type,
                    nodeVersion: node.typeVersion,
                    workflowId: this.getWorkflow().id,
                },
            });
        }
    }
    const db = new alasql.Database(node.id);
    try {
        for (let i = 0; i < inputsData.length; i++) {
            const inputData = inputsData[i];
            inputData.forEach((item, index) => {
                if (item.pairedItem === undefined) {
                    item.pairedItem = index;
                }
                if (typeof item.pairedItem === 'number') {
                    pairedItem.push({
                        item: item.pairedItem,
                        input: i,
                    });
                    return;
                }
                if (Array.isArray(item.pairedItem)) {
                    const pairedItems = item.pairedItem
                        .filter((p) => p !== undefined)
                        .map((p) => (typeof p === 'number' ? { item: p } : p))
                        .map((p) => {
                        return {
                            item: p.item,
                            input: i,
                        };
                    });
                    pairedItem.push.apply(pairedItem, pairedItems);
                    return;
                }
                pairedItem.push({
                    item: item.pairedItem.item,
                    input: i,
                });
            });
            db.exec(`CREATE TABLE input${i + 1}`);
            db.tables[`input${i + 1}`].data = inputData.map((entry) => entry.json);
        }
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(node, error, {
            message: 'Issue while creating table from',
            description: error.message,
            itemIndex: 0,
        });
    }
    try {
        const result = db.exec(query);
        for (const item of result) {
            if (Array.isArray(item)) {
                returnData.push.apply(returnData, item.map((json) => ({ json, pairedItem })));
            }
            else if (typeof item === 'object') {
                returnData.push({ json: item, pairedItem });
            }
        }
        if (!returnData.length && returnSuccessItemIfEmpty) {
            returnData.push({ json: { success: true }, pairedItem });
        }
    }
    catch (error) {
        prepareError(node, error);
    }
    finally {
        delete alasql.databases[node.id];
    }
    return [returnData];
}
//# sourceMappingURL=combineBySql.js.map