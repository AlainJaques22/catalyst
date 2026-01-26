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
exports.description = exports.combineByPosition = exports.combineBySql = exports.combineByFields = exports.combineAll = exports.chooseBranch = exports.append = void 0;
const append = __importStar(require("./append"));
exports.append = append;
const chooseBranch = __importStar(require("./chooseBranch"));
exports.chooseBranch = chooseBranch;
const combineAll = __importStar(require("./combineAll"));
exports.combineAll = combineAll;
const combineByFields = __importStar(require("./combineByFields"));
exports.combineByFields = combineByFields;
const combineByPosition = __importStar(require("./combineByPosition"));
exports.combineByPosition = combineByPosition;
const combineBySql = __importStar(require("./combineBySql"));
exports.combineBySql = combineBySql;
exports.description = [
    {
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'Append',
                value: 'append',
                description: 'Output items of each input, one after the other',
            },
            {
                name: 'Combine',
                value: 'combine',
                description: 'Merge matching items together',
            },
            {
                name: 'SQL Query',
                value: 'combineBySql',
                description: 'Write a query to do the merge',
            },
            {
                name: 'Choose Branch',
                value: 'chooseBranch',
                description: 'Output data from a specific branch, without modifying it',
            },
        ],
        default: 'append',
        description: 'How input data should be merged',
    },
    {
        displayName: 'Combine By',
        name: 'combineBy',
        type: 'options',
        noDataExpression: true,
        options: [
            {
                name: 'Matching Fields',
                value: 'combineByFields',
                description: 'Combine items with the same field values',
            },
            {
                name: 'Position',
                value: 'combineByPosition',
                description: 'Combine items based on their order',
            },
            {
                name: 'All Possible Combinations',
                value: 'combineAll',
                description: 'Every pairing of every two items (cross join)',
            },
        ],
        default: 'combineByFields',
        description: 'How input data should be merged',
        displayOptions: {
            show: { mode: ['combine'] },
        },
    },
    ...append.description,
    ...combineAll.description,
    ...combineByFields.description,
    ...combineBySql.description,
    ...combineByPosition.description,
    ...chooseBranch.description,
];
//# sourceMappingURL=index.js.map