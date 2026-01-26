"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTable = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const router_1 = require("./actions/router");
const row = __importStar(require("./actions/row/Row.resource"));
const methods_1 = require("./common/methods");
class DataTable {
    description = {
        displayName: 'Data table',
        name: 'dataTable',
        icon: 'fa:table',
        iconColor: 'orange-red',
        group: ['input', 'transform'],
        version: 1,
        subtitle: '={{$parameter["action"]}}',
        description: 'Permanently save data across workflow executions in a table',
        defaults: {
            name: 'Data table',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        hints: [
            {
                message: 'The selected data table has no columns.',
                displayCondition: '={{ $parameter.dataTableId !== "" && $parameter?.columns?.mappingMode === "defineBelow" && !$parameter?.columns?.schema?.length }}',
                whenToDisplay: 'beforeExecution',
                location: 'ndv',
                type: 'info',
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Row',
                        value: 'row',
                    },
                ],
                default: 'row',
            },
            ...row.description,
        ],
    };
    methods = {
        listSearch: {
            tableSearch: methods_1.tableSearch,
        },
        loadOptions: {
            getDataTableColumns: methods_1.getDataTableColumns,
            getConditionsForColumn: methods_1.getConditionsForColumn,
        },
        resourceMapping: {
            getDataTables: methods_1.getDataTables,
        },
    };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.DataTable = DataTable;
//# sourceMappingURL=DataTable.node.js.map