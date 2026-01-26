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
exports.descriptions = exports.update = exports.delete = exports.get = exports.create = exports.getAll = void 0;
const create = __importStar(require("./create"));
exports.create = create;
const del = __importStar(require("./del"));
exports.delete = del;
const get = __importStar(require("./get"));
exports.get = get;
const getAll = __importStar(require("./getAll"));
exports.getAll = getAll;
const update = __importStar(require("./update"));
exports.update = update;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['ticket'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create new ticket',
                action: 'Create a ticket',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete ticket',
                action: 'Delete a ticket',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve ticket',
                action: 'Get a ticket',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve many tickets',
                action: 'Get many tickets',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update ticket',
                action: 'Update a ticket',
            },
        ],
        default: 'getAll',
    },
    ...getAll.description,
    ...create.description,
    ...get.description,
    ...del.description,
    ...update.description,
];
//# sourceMappingURL=index.js.map