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
exports.ICalendar = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const createEvent = __importStar(require("./createEvent.operation"));
class ICalendar {
    description = {
        hidden: true,
        displayName: 'iCalendar',
        name: 'iCal',
        icon: 'fa:calendar',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Create iCalendar file',
        defaults: {
            name: 'iCalendar',
            color: '#408000',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Create Event File',
                        value: 'createEventFile',
                    },
                ],
                default: 'createEventFile',
            },
            ...createEvent.description,
        ],
    };
    async execute() {
        const items = this.getInputData();
        const operation = this.getNodeParameter('operation', 0);
        let returnData = [];
        if (operation === 'createEventFile') {
            returnData = await createEvent.execute.call(this, items);
        }
        return [returnData];
    }
}
exports.ICalendar = ICalendar;
//# sourceMappingURL=ICalendar.node.js.map