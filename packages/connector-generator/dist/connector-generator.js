"use strict";
/**
 * Connector Generator
 *
 * Main class that orchestrates connector generation from n8n schemas
 */
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
exports.generateConnector = generateConnector;
exports.generateConnectors = generateConnectors;
exports.previewConnector = previewConnector;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const naming_1 = require("./utils/naming");
const generators_1 = require("./generators");
/**
 * Generate all connector files from an operation schema
 */
function generateConnector(schema, options) {
    const connectorId = (0, naming_1.generateConnectorId)(schema.nodeId, schema.resource, schema.operation);
    const connectorDir = path.join(options.outputDir, schema.category, connectorId);
    // Check if connector already exists and handle versioning
    let version = '1.0.0';
    const metadataPath = path.join(connectorDir, 'connector.json');
    if (fs.existsSync(metadataPath)) {
        try {
            const existingMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
            const [major, minor, patch] = existingMetadata.version.split('.').map(Number);
            version = `${major}.${minor}.${patch + 1}`;
            if (options.verbose) {
                console.log(`Bumping version from ${existingMetadata.version} to ${version}`);
            }
        }
        catch (error) {
            console.warn(`Could not read existing metadata, using default version ${version}`);
        }
    }
    // Generate all files with updated version
    const elementTemplate = (0, generators_1.elementTemplateToJson)((0, generators_1.generateElementTemplate)(schema));
    const n8nWorkflow = (0, generators_1.n8nWorkflowToJson)((0, generators_1.generateN8nWorkflow)(schema));
    const bpmn = (0, generators_1.generateBpmnExample)(schema);
    const readme = (0, generators_1.generateReadme)(schema);
    // Generate metadata with version
    const metadataObj = (0, generators_1.generateMetadata)(schema);
    metadataObj.version = version;
    const metadata = (0, generators_1.metadataToJson)(metadataObj);
    if (!options.dryRun) {
        // Create directory
        fs.mkdirSync(connectorDir, { recursive: true });
        // Create backups before overwriting (unless force is enabled)
        if (fs.existsSync(metadataPath) && !options.force) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const bpmnPath = path.join(connectorDir, `${connectorId}.bpmn`);
            const n8nPath = path.join(connectorDir, `${connectorId}.n8n.json`);
            if (fs.existsSync(bpmnPath)) {
                const backupPath = `${bpmnPath}.backup-${timestamp}`;
                fs.copyFileSync(bpmnPath, backupPath);
                if (options.verbose) {
                    console.log(`Created backup: ${path.basename(backupPath)}`);
                }
            }
            if (fs.existsSync(n8nPath)) {
                const backupPath = `${n8nPath}.backup-${timestamp}`;
                fs.copyFileSync(n8nPath, backupPath);
                if (options.verbose) {
                    console.log(`Created backup: ${path.basename(backupPath)}`);
                }
            }
        }
        // Write files
        fs.writeFileSync(path.join(connectorDir, `${connectorId}.element.json`), elementTemplate);
        fs.writeFileSync(path.join(connectorDir, `${connectorId}.n8n.json`), n8nWorkflow);
        fs.writeFileSync(path.join(connectorDir, `${connectorId}.bpmn`), bpmn);
        fs.writeFileSync(path.join(connectorDir, 'README.md'), readme);
        fs.writeFileSync(path.join(connectorDir, 'connector.json'), metadata);
    }
    return {
        connectorId,
        directory: connectorDir,
        files: {
            elementTemplate: `${connectorId}.element.json`,
            n8nWorkflow: `${connectorId}.n8n.json`,
            bpmn: `${connectorId}.bpmn`,
            readme: 'README.md',
            metadata: 'connector.json'
        }
    };
}
/**
 * Generate multiple connectors from operation schemas
 */
function generateConnectors(schemas, options) {
    const results = [];
    for (const schema of schemas) {
        try {
            const result = generateConnector(schema, options);
            results.push(result);
            if (options.verbose) {
                console.log(`Generated: ${result.connectorId}`);
            }
        }
        catch (error) {
            console.error(`Failed to generate connector for ${schema.nodeId}/${schema.operation}:`, error);
        }
    }
    return results;
}
/**
 * Preview generated files without writing (dry run)
 */
function previewConnector(schema) {
    const connectorId = (0, naming_1.generateConnectorId)(schema.nodeId, schema.resource, schema.operation);
    return {
        connectorId,
        elementTemplate: (0, generators_1.elementTemplateToJson)((0, generators_1.generateElementTemplate)(schema)),
        n8nWorkflow: (0, generators_1.n8nWorkflowToJson)((0, generators_1.generateN8nWorkflow)(schema)),
        bpmn: (0, generators_1.generateBpmnExample)(schema),
        readme: (0, generators_1.generateReadme)(schema),
        metadata: (0, generators_1.metadataToJson)((0, generators_1.generateMetadata)(schema))
    };
}
