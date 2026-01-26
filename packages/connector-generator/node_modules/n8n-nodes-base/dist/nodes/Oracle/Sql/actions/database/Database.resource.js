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
exports.description = exports.upsert = exports.update = exports.select = exports.insert = exports.execute = exports.deleteTable = void 0;
const deleteTable = __importStar(require("./deleteTable.operation"));
exports.deleteTable = deleteTable;
const execute = __importStar(require("./executeQuery.operation"));
exports.execute = execute;
const insert = __importStar(require("./insert.operation"));
exports.insert = insert;
const select = __importStar(require("./select.operation"));
exports.select = select;
const update = __importStar(require("./update.operation"));
exports.update = update;
const upsert = __importStar(require("./upsert.operation"));
exports.upsert = upsert;
const common_descriptions_1 = require("../common.descriptions");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'Delete',
                value: 'deleteTable',
                description: 'Delete an entire table or rows in a table',
                action: 'Delete table or rows',
            },
            {
                name: 'Execute SQL',
                value: 'execute',
                description: 'Execute an SQL',
                action: 'Execute SQL',
            },
            {
                name: 'Insert',
                value: 'insert',
                description: 'Insert rows in a table',
                action: 'Insert rows in a table',
            },
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-option-name-wrong-for-upsert
                name: 'Insert or Update',
                value: 'upsert',
                // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-upsert
                description: 'Insert or update rows in a table',
                action: 'Insert or update rows in a table',
            },
            {
                name: 'Select',
                value: 'select',
                description: 'Select rows from a table',
                action: 'Select rows from a table',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update rows in a table',
                action: 'Update rows in a table',
            },
        ],
        displayOptions: {
            show: {
                resource: ['database'],
            },
        },
        default: 'insert',
    },
    { ...common_descriptions_1.schemaRLC, displayOptions: { hide: { operation: ['execute'] } } },
    { ...common_descriptions_1.tableRLC, displayOptions: { hide: { operation: ['execute'] } } },
    ...deleteTable.description,
    ...execute.description,
    ...insert.description,
    ...select.description,
    ...update.description,
    ...upsert.description,
];
//# sourceMappingURL=Database.resource.js.map