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
exports.description = exports.scrape = exports.query = exports.getPaginated = void 0;
const getPaginated = __importStar(require("./getPaginated.operation"));
exports.getPaginated = getPaginated;
const query = __importStar(require("./query.operation"));
exports.query = query;
const scrape = __importStar(require("./scrape.operation"));
exports.scrape = scrape;
const fields_1 = require("../common/fields");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['extraction'],
            },
        },
        options: [
            {
                name: 'Query Page',
                value: 'query',
                description: 'Query a page to extract data or ask a question given the data on the page',
                action: 'Query page',
            },
            {
                name: 'Query Page with Pagination',
                value: 'getPaginated',
                description: 'Extract content from paginated or dynamically loaded pages',
                action: 'Query page with pagination',
            },
            {
                name: 'Smart Scrape',
                value: 'scrape',
                description: 'Scrape a page and return the data as markdown',
                action: 'Smart scrape page',
            },
        ],
        default: 'getPaginated',
    },
    ...(0, fields_1.getSessionModeFields)('extraction', ['getPaginated', 'query', 'scrape']),
    ...getPaginated.description,
    ...query.description,
];
//# sourceMappingURL=Extraction.resource.js.map