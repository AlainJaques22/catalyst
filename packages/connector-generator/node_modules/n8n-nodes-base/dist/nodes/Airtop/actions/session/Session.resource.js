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
exports.description = exports.waitForDownload = exports.terminate = exports.save = exports.create = void 0;
const create = __importStar(require("./create.operation"));
exports.create = create;
const save = __importStar(require("./save.operation"));
exports.save = save;
const terminate = __importStar(require("./terminate.operation"));
exports.terminate = terminate;
const waitForDownload = __importStar(require("./waitForDownload.operation"));
exports.waitForDownload = waitForDownload;
exports.description = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['session'],
            },
        },
        options: [
            {
                name: 'Create Session',
                value: 'create',
                description: 'Create an Airtop browser session',
                action: 'Create a session',
            },
            {
                name: 'Save Profile on Termination',
                value: 'save',
                description: 'Save in a profile changes made in your browsing session such as cookies and local storage',
                action: 'Save a profile on session termination',
            },
            {
                name: 'Terminate Session',
                value: 'terminate',
                description: 'Terminate a session',
                action: 'Terminate a session',
            },
            {
                name: 'Wait for Download',
                value: 'waitForDownload',
                description: 'Wait for a file download to become available',
                action: 'Wait for a download',
            },
        ],
        default: 'create',
    },
    ...create.description,
    ...save.description,
    ...terminate.description,
    ...waitForDownload.description,
];
//# sourceMappingURL=Session.resource.js.map