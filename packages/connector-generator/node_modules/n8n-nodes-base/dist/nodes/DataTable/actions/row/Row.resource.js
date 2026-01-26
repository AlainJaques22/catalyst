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
exports.description = exports.upsert = exports.update = exports.deleteRows = exports.rowNotExists = exports.rowExists = exports.get = exports.insert = void 0;
const deleteRows = __importStar(require("./delete.operation"));
exports.deleteRows = deleteRows;
const rowExists = __importStar(require("./rowExists.operation"));
exports.rowExists = rowExists;
const rowNotExists = __importStar(require("./rowNotExists.operation"));
exports.rowNotExists = rowNotExists;
const get = __importStar(require("./get.operation"));
exports.get = get;
const insert = __importStar(require("./insert.operation"));
exports.insert = insert;
const update = __importStar(require("./update.operation"));
exports.update = update;
const upsert = __importStar(require("./upsert.operation"));
exports.upsert = upsert;
const fields_1 = require("../../common/fields");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['row'],
            },
        },
        options: [
            {
                name: 'Delete',
                value: deleteRows.FIELD,
                description: 'Delete row(s)',
                action: 'Delete row(s)',
            },
            {
                name: 'Get',
                value: get.FIELD,
                description: 'Get row(s)',
                action: 'Get row(s)',
            },
            {
                name: 'If Row Exists',
                value: rowExists.FIELD,
                description: 'Match input items that are in the data table',
                action: 'If row exists',
            },
            {
                name: 'If Row Does Not Exist',
                value: rowNotExists.FIELD,
                description: 'Match input items that are not in the data table',
                action: 'If row does not exist',
            },
            {
                name: 'Insert',
                value: insert.FIELD,
                description: 'Insert a new row',
                action: 'Insert row',
            },
            {
                name: 'Update',
                value: update.FIELD,
                description: 'Update row(s) matching certain fields',
                action: 'Update row(s)',
            },
            {
                name: 'Upsert',
                value: upsert.FIELD,
                description: 'Update row(s), or insert if there is no match',
                action: 'Upsert row(s)',
            },
        ],
        default: 'insert',
    },
    {
        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-miscased
        displayName: 'Data table',
        name: fields_1.DATA_TABLE_ID_FIELD,
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        required: true,
        modes: [
            {
                displayName: 'From List',
                name: 'list',
                type: 'list',
                typeOptions: {
                    searchListMethod: 'tableSearch',
                    searchable: true,
                    allowNewResource: {
                        label: 'resourceLocator.dataTable.createNew',
                        url: '/projects/{{$projectId}}/datatables/new',
                    },
                },
            },
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
            },
        ],
        displayOptions: { show: { resource: ['row'] } },
    },
    ...deleteRows.description,
    ...insert.description,
    ...get.description,
    ...rowExists.description,
    ...rowNotExists.description,
    ...update.description,
    ...upsert.description,
];
//# sourceMappingURL=Row.resource.js.map