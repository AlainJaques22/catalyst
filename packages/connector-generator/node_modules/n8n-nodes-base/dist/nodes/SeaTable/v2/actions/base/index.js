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
exports.descriptions = exports.collaborator = exports.metadata = exports.snapshot = void 0;
const collaborator = __importStar(require("./collaborator.operation"));
exports.collaborator = collaborator;
const metadata = __importStar(require("./metadata.operation"));
exports.metadata = metadata;
const snapshot = __importStar(require("./snapshot.operation"));
exports.snapshot = snapshot;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['base'],
            },
        },
        options: [
            {
                name: 'Snapshot',
                value: 'snapshot',
                description: 'Create a snapshot of the base',
                action: 'Create a snapshot',
            },
            {
                name: 'Metadata',
                value: 'metadata',
                description: 'Get the complete metadata of the base',
                action: 'Get metadata of a base',
            },
            {
                name: 'Collaborator',
                value: 'collaborator',
                description: 'Get the username from the email or name of a collaborator',
                action: 'Get username from email or name',
            },
        ],
        default: 'snapshot',
    },
    ...snapshot.description,
    ...metadata.description,
    ...collaborator.description,
];
//# sourceMappingURL=index.js.map