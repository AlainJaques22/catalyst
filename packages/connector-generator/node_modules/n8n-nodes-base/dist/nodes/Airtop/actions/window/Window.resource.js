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
exports.description = exports.getLiveView = exports.list = exports.load = exports.takeScreenshot = exports.close = exports.create = void 0;
const close = __importStar(require("./close.operation"));
exports.close = close;
const create = __importStar(require("./create.operation"));
exports.create = create;
const getLiveView = __importStar(require("./getLiveView.operation"));
exports.getLiveView = getLiveView;
const list = __importStar(require("./list.operation"));
exports.list = list;
const load = __importStar(require("./load.operation"));
exports.load = load;
const takeScreenshot = __importStar(require("./takeScreenshot.operation"));
exports.takeScreenshot = takeScreenshot;
const fields_1 = require("../common/fields");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        typeOptions: {
            sortable: false,
        },
        displayOptions: {
            show: {
                resource: ['window'],
            },
        },
        options: [
            {
                name: 'Close Window',
                value: 'close',
                description: 'Close a window inside a session',
                action: 'Close a window',
            },
            {
                name: 'Create a New Browser Window',
                value: 'create',
                description: 'Create a new browser window inside a session. Can load a URL when created.',
                action: 'Create a window',
            },
            {
                name: 'Get Live View',
                value: 'getLiveView',
                description: 'Get information about a browser window, including the live view URL',
                action: 'Get live view',
            },
            {
                name: 'List Windows',
                value: 'list',
                description: 'List all browser windows in a session',
                action: 'List windows',
            },
            {
                name: 'Load URL',
                value: 'load',
                description: 'Load a URL in an existing window',
                action: 'Load a page',
            },
            {
                name: 'Take Screenshot',
                value: 'takeScreenshot',
                description: 'Take a screenshot of the current window',
                action: 'Take screenshot',
            },
        ],
        default: 'create',
    },
    {
        ...fields_1.sessionIdField,
        displayOptions: {
            show: {
                resource: ['window'],
            },
        },
    },
    {
        ...fields_1.windowIdField,
        displayOptions: {
            show: {
                resource: ['window'],
                operation: ['close', 'takeScreenshot', 'load', 'getLiveView'],
            },
        },
    },
    ...create.description,
    ...list.description,
    ...getLiveView.description,
    ...load.description,
    ...takeScreenshot.description,
];
//# sourceMappingURL=Window.resource.js.map