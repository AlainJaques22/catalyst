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
exports.SpreadsheetFileV2 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const fromFile = __importStar(require("./fromFile.operation"));
const toFile = __importStar(require("./toFile.operation"));
const description_1 = require("../description");
class SpreadsheetFileV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            version: 2,
            defaults: {
                name: 'Spreadsheet File',
                color: '#2244FF',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            properties: [description_1.operationProperty, ...fromFile.description, ...toFile.description],
        };
    }
    async execute() {
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0);
        let returnData = [];
        if (operation === 'fromFile') {
            returnData = await fromFile.execute.call(this, items);
        }
        if (operation === 'toFile') {
            returnData = await toFile.execute.call(this, items);
        }
        return [returnData];
    }
}
exports.SpreadsheetFileV2 = SpreadsheetFileV2;
//# sourceMappingURL=SpreadsheetFileV2.node.js.map