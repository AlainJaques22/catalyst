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
exports.description = exports.type = exports.scroll = exports.hover = exports.fill = exports.click = void 0;
const click = __importStar(require("./click.operation"));
exports.click = click;
const fill = __importStar(require("./fill.operation"));
exports.fill = fill;
const hover = __importStar(require("./hover.operation"));
exports.hover = hover;
const scroll = __importStar(require("./scroll.operation"));
exports.scroll = scroll;
const type = __importStar(require("./type.operation"));
exports.type = type;
const fields_1 = require("../common/fields");
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['interaction'],
            },
        },
        options: [
            {
                name: 'Click an Element',
                value: 'click',
                description: 'Execute a click on an element given a description',
                action: 'Click an element',
            },
            {
                name: 'Fill Form',
                value: 'fill',
                description: 'Fill a form with the provided information',
                action: 'Fill form',
            },
            {
                name: 'Hover on an Element',
                value: 'hover',
                description: 'Execute a hover action on an element given a description',
                action: 'Hover on an element',
            },
            {
                name: 'Scroll',
                value: 'scroll',
                description: 'Execute a scroll action on the page',
                action: 'Scroll on page',
            },
            {
                name: 'Type',
                value: 'type',
                description: 'Execute a Type action on an element given a description',
                action: 'Type text',
            },
        ],
        default: 'click',
    },
    {
        ...fields_1.sessionIdField,
        displayOptions: {
            show: {
                resource: ['interaction'],
            },
        },
    },
    {
        ...fields_1.windowIdField,
        displayOptions: {
            show: {
                resource: ['interaction'],
            },
        },
    },
    ...click.description,
    ...fill.description,
    ...hover.description,
    ...scroll.description,
    ...type.description,
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: ['interaction'],
                operation: ['click', 'hover', 'type', 'scroll'],
            },
        },
        options: [
            {
                displayName: 'Visual Scope',
                name: 'visualScope',
                type: 'options',
                default: 'auto',
                description: 'Defines the strategy for visual analysis of the current window',
                options: [
                    {
                        name: 'Auto',
                        description: 'Provides the simplest out-of-the-box experience for most web pages',
                        value: 'auto',
                    },
                    {
                        name: 'Viewport',
                        description: 'For analysis of the current browser view only',
                        value: 'viewport',
                    },
                    {
                        name: 'Page',
                        description: 'For analysis of the entire page',
                        value: 'page',
                    },
                    {
                        name: 'Scan',
                        description: "For a full page analysis on sites that have compatibility issues with 'Page' mode",
                        value: 'scan',
                    },
                ],
            },
            {
                displayName: 'Wait Until Event After Navigation',
                name: 'waitForNavigation',
                type: 'options',
                default: 'load',
                description: "The condition to wait for the navigation to complete after an interaction (click, type or hover). Defaults to 'Fully Loaded'.",
                options: [
                    {
                        name: 'Fully Loaded (Slower)',
                        value: 'load',
                    },
                    {
                        name: 'DOM Only Loaded (Faster)',
                        value: 'domcontentloaded',
                    },
                    {
                        name: 'All Network Activity Has Stopped',
                        value: 'networkidle0',
                    },
                    {
                        name: 'Most Network Activity Has Stopped',
                        value: 'networkidle2',
                    },
                ],
            },
        ],
    },
];
//# sourceMappingURL=Interaction.resource.js.map