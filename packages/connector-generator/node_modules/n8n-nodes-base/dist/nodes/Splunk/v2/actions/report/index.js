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
exports.description = exports.getAll = exports.get = exports.deleteReport = exports.create = void 0;
const create = __importStar(require("./create.operation"));
exports.create = create;
const deleteReport = __importStar(require("./deleteReport.operation"));
exports.deleteReport = deleteReport;
const get = __importStar(require("./get.operation"));
exports.get = get;
const getAll = __importStar(require("./getAll.operation"));
exports.getAll = getAll;
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['report'],
            },
        },
        options: [
            {
                name: 'Create From Search',
                value: 'create',
                description: 'Create a search report from a search job',
                action: 'Create a search report',
            },
            {
                name: 'Delete',
                value: 'deleteReport',
                description: 'Delete a search report',
                action: 'Delete a search report',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve a search report',
                action: 'Get a search report',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Retrieve many search reports',
                action: 'Get many search reports',
            },
        ],
        default: 'getAll',
    },
    ...create.description,
    ...deleteReport.description,
    ...get.description,
    ...getAll.description,
];
//# sourceMappingURL=index.js.map