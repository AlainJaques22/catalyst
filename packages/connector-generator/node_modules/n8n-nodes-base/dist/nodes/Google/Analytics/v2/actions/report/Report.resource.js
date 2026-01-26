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
exports.description = exports.getuniversal = exports.getga4 = void 0;
const getga4 = __importStar(require("./get.ga4.operation"));
exports.getga4 = getga4;
const getuniversal = __importStar(require("./get.universal.operation"));
exports.getuniversal = getuniversal;
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
                name: 'Get',
                value: 'get',
                description: 'Return the analytics data',
                action: 'Get a report',
            },
        ],
        default: 'get',
    },
    {
        displayName: 'Property Type',
        name: 'propertyType',
        type: 'options',
        noDataExpression: true,
        description: 'Google Analytics 4 is the latest version. Universal Analytics is an older version that is not fully functional after the end of June 2023.',
        options: [
            {
                name: 'Google Analytics 4',
                value: 'ga4',
            },
            {
                name: 'Universal Analytics',
                value: 'universal',
            },
        ],
        default: 'ga4',
        displayOptions: {
            show: {
                resource: ['report'],
                operation: ['get'],
            },
        },
    },
    ...getga4.description,
    ...getuniversal.description,
];
//# sourceMappingURL=Report.resource.js.map