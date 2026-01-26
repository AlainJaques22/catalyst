#!/usr/bin/env node
"use strict";
/**
 * Catalyst Connector Generator CLI
 *
 * Usage:
 *   npx ts-node src/cli.ts generate slack --operation send
 *   npx ts-node src/cli.ts list-nodes
 *   npx ts-node src/cli.ts list-operations slack
 *   npx ts-node src/cli.ts preview slack --operation send
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const extractors_1 = require("./extractors");
const connector_generator_1 = require("./connector-generator");
const program = new commander_1.Command();
program
    .name('catalyst-connector')
    .description('Generate Catalyst connectors from n8n node schemas')
    .version('1.0.0');
// Generate command
program
    .command('generate <node>')
    .description('Generate a connector from an n8n node schema')
    .option('-o, --operation <operation>', 'Specific operation to generate')
    .option('-d, --output-dir <dir>', 'Output directory', '../../../connectors/generated')
    .option('--dry-run', 'Preview without writing files')
    .option('--force', 'Skip backup and overwrite existing files')
    .option('-v, --verbose', 'Verbose output')
    .action((node, options) => {
    try {
        if (!(0, extractors_1.nodeExists)(node)) {
            console.error(chalk_1.default.red(`Error: Node '${node}' not found.`));
            console.log(`Available nodes: ${(0, extractors_1.listAvailableNodes)().join(', ')}`);
            process.exit(1);
        }
        const outputDir = path.resolve(__dirname, options.outputDir);
        const genOptions = {
            outputDir,
            dryRun: options.dryRun,
            verbose: options.verbose,
            force: options.force
        };
        let schemas;
        if (options.operation) {
            // Generate specific operation
            const schema = (0, extractors_1.getNodeOperation)(node, options.operation);
            schemas = [schema];
        }
        else {
            // Generate all operations for the node
            schemas = (0, extractors_1.getNodeOperations)(node);
        }
        console.log(chalk_1.default.blue(`\nGenerating ${schemas.length} connector(s) for ${node}...\n`));
        for (const schema of schemas) {
            if (options.dryRun) {
                const preview = (0, connector_generator_1.previewConnector)(schema);
                console.log(chalk_1.default.yellow(`Preview: ${preview.connectorId}`));
                console.log(chalk_1.default.gray('─'.repeat(50)));
                console.log(chalk_1.default.cyan('Element Template:'));
                console.log(preview.elementTemplate.substring(0, 500) + '...\n');
            }
            else {
                const result = (0, connector_generator_1.generateConnector)(schema, genOptions);
                console.log(chalk_1.default.green(`✓ Generated: ${result.connectorId}`));
                console.log(chalk_1.default.gray(`  Directory: ${result.directory}`));
                console.log(chalk_1.default.gray(`  Files: ${Object.values(result.files).join(', ')}`));
            }
        }
        console.log(chalk_1.default.blue(`\nDone! Generated ${schemas.length} connector(s).`));
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
// List nodes command
program
    .command('list-nodes')
    .description('List all available n8n nodes')
    .action(() => {
    const nodes = (0, extractors_1.listAvailableNodes)();
    console.log(chalk_1.default.blue('\nAvailable n8n nodes:\n'));
    for (const node of nodes) {
        console.log(chalk_1.default.cyan(`  • ${node}`));
    }
    console.log();
});
// List operations command
program
    .command('list-operations <node>')
    .description('List all operations for a node')
    .action((node) => {
    try {
        if (!(0, extractors_1.nodeExists)(node)) {
            console.error(chalk_1.default.red(`Error: Node '${node}' not found.`));
            process.exit(1);
        }
        const operations = (0, extractors_1.listNodeOperations)(node);
        console.log(chalk_1.default.blue(`\nOperations for ${node}:\n`));
        for (const op of operations) {
            console.log(chalk_1.default.cyan(`  • ${op}`));
        }
        console.log();
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
// Preview command
program
    .command('preview <node>')
    .description('Preview generated connector files')
    .option('-o, --operation <operation>', 'Specific operation to preview', 'send')
    .option('-f, --file <file>', 'Which file to preview (element, workflow, bpmn, readme, metadata)')
    .action((node, options) => {
    try {
        const schema = (0, extractors_1.getNodeOperation)(node, options.operation);
        const preview = (0, connector_generator_1.previewConnector)(schema);
        console.log(chalk_1.default.blue(`\nPreview: ${preview.connectorId}\n`));
        console.log(chalk_1.default.gray('═'.repeat(60)));
        if (!options.file || options.file === 'element') {
            console.log(chalk_1.default.cyan('\n📄 Element Template (.element.json):\n'));
            console.log(preview.elementTemplate);
        }
        if (!options.file || options.file === 'workflow') {
            console.log(chalk_1.default.cyan('\n📄 n8n Workflow (.n8n.json):\n'));
            console.log(preview.n8nWorkflow);
        }
        if (!options.file || options.file === 'bpmn') {
            console.log(chalk_1.default.cyan('\n📄 BPMN Example (.bpmn):\n'));
            console.log(preview.bpmn);
        }
        if (!options.file || options.file === 'readme') {
            console.log(chalk_1.default.cyan('\n📄 README.md:\n'));
            console.log(preview.readme);
        }
        if (!options.file || options.file === 'metadata') {
            console.log(chalk_1.default.cyan('\n📄 Connector Metadata (connector.json):\n'));
            console.log(preview.metadata);
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
// Compare command - compare generated with existing
program
    .command('compare <node>')
    .description('Compare generated connector with existing manual connector')
    .option('-o, --operation <operation>', 'Specific operation', 'send')
    .option('-e, --existing <path>', 'Path to existing connector')
    .action((node, options) => {
    try {
        const schema = (0, extractors_1.getNodeOperation)(node, options.operation);
        const preview = (0, connector_generator_1.previewConnector)(schema);
        console.log(chalk_1.default.blue(`\nComparing: ${preview.connectorId}\n`));
        // If existing path provided, read and compare
        if (options.existing) {
            const existingDir = path.resolve(options.existing);
            // Compare element template
            const existingElementPath = path.join(existingDir, `${node}-send-message.element.json`);
            if (fs.existsSync(existingElementPath)) {
                console.log(chalk_1.default.cyan('\n📊 Element Template Comparison:\n'));
                const existing = fs.readFileSync(existingElementPath, 'utf-8');
                console.log(chalk_1.default.yellow('Generated properties count:'), JSON.parse(preview.elementTemplate).properties.length);
                console.log(chalk_1.default.yellow('Existing properties count:'), JSON.parse(existing).properties.length);
            }
            // Compare n8n workflow
            const existingWorkflowPath = path.join(existingDir, `${node}-send-message.n8n.json`);
            if (fs.existsSync(existingWorkflowPath)) {
                console.log(chalk_1.default.cyan('\n📊 n8n Workflow Comparison:\n'));
                const existing = fs.readFileSync(existingWorkflowPath, 'utf-8');
                console.log(chalk_1.default.yellow('Generated nodes count:'), JSON.parse(preview.n8nWorkflow).nodes.length);
                console.log(chalk_1.default.yellow('Existing nodes count:'), JSON.parse(existing).nodes.length);
            }
        }
        else {
            console.log(chalk_1.default.gray('Tip: Use --existing <path> to compare with an existing connector'));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error.message}`));
        process.exit(1);
    }
});
program.parse();
