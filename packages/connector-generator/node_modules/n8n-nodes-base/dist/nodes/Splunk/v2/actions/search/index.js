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
exports.description = exports.getResult = exports.getAll = exports.get = exports.deleteJob = exports.create = void 0;
const create = __importStar(require("./create.operation"));
exports.create = create;
const deleteJob = __importStar(require("./deleteJob.operation"));
exports.deleteJob = deleteJob;
const get = __importStar(require("./get.operation"));
exports.get = get;
const getAll = __importStar(require("./getAll.operation"));
exports.getAll = getAll;
const getResult = __importStar(require("./getResult.operation"));
exports.getResult = getResult;
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['search'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a search job',
                action: 'Create a search job',
            },
            {
                name: 'Delete',
                value: 'deleteJob',
                description: 'Delete a search job',
                action: 'Delete a search job',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve a search job',
                action: 'Get a search job',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve many search jobs',
                action: 'Get many search jobs',
            },
            {
                name: 'Get Result',
                value: 'getResult',
                description: 'Get the result of a search job',
                action: 'Get the result of a search job',
            },
        ],
        default: 'create',
    },
    ...create.description,
    ...deleteJob.description,
    ...get.description,
    ...getAll.description,
    ...getResult.description,
];
//# sourceMappingURL=index.js.map