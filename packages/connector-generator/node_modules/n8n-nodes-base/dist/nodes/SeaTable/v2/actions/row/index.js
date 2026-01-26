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
exports.descriptions = exports.list = exports.unlock = exports.lock = exports.remove = exports.update = exports.search = exports.get = exports.create = void 0;
const create = __importStar(require("./create.operation"));
exports.create = create;
const get = __importStar(require("./get.operation"));
exports.get = get;
const list = __importStar(require("./list.operation"));
exports.list = list;
const lock = __importStar(require("./lock.operation"));
exports.lock = lock;
const remove = __importStar(require("./remove.operation"));
exports.remove = remove;
const search = __importStar(require("./search.operation"));
exports.search = search;
const sharedProperties_1 = require("./sharedProperties");
const unlock = __importStar(require("./unlock.operation"));
exports.unlock = unlock;
const update = __importStar(require("./update.operation"));
exports.update = update;
exports.descriptions = [
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
                name: 'Create',
                value: 'create',
                description: 'Create a new row',
                action: 'Create a row',
            },
            {
                name: 'Delete',
                value: 'remove',
                description: 'Delete a row',
                action: 'Delete a row',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get the content of a row',
                action: 'Get a row',
            },
            {
                name: 'Get Many',
                value: 'list',
                description: 'Get many rows from a table or a table view',
                action: 'Get many rows',
            },
            {
                name: 'Lock',
                value: 'lock',
                description: 'Lock a row to prevent further changes',
                action: 'Add a row lock',
            },
            {
                name: 'Search',
                value: 'search',
                description: 'Search one or multiple rows',
                action: 'Search a row by keyword',
            },
            {
                name: 'Unlock',
                value: 'unlock',
                description: 'Remove the lock from a row',
                action: 'Remove a row lock',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update the content of a row',
                action: 'Update a row',
            },
        ],
        default: 'create',
    },
    ...sharedProperties_1.sharedProperties,
    ...create.description,
    ...get.description,
    ...list.description,
    ...search.description,
    ...update.description,
];
//# sourceMappingURL=index.js.map