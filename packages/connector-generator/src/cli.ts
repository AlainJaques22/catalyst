#!/usr/bin/env node
/**
 * Catalyst Connector Generator CLI
 *
 * Usage:
 *   npx ts-node src/cli.ts generate slack --operation send
 *   npx ts-node src/cli.ts list-nodes
 *   npx ts-node src/cli.ts list-operations slack
 *   npx ts-node src/cli.ts preview slack --operation send
 */

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

import { getNodeOperations, getNodeOperation, listAvailableNodes, listNodeOperations, nodeExists } from './extractors';
import { generateConnector, previewConnector } from './connector-generator';
import { GeneratorOptions } from './types';

const program = new Command();

program
  .name('catalyst-connector')
  .description('Generate Catalyst connectors from n8n node schemas')
  .version('1.0.0');

// Generate command
program
  .command('generate <node>')
  .description('Generate a connector from an n8n node schema')
  .option('-o, --operation <operation>', 'Specific operation to generate')
  .option('-d, --output-dir <dir>', 'Output directory', '../../connectors/generated')
  .option('--dry-run', 'Preview without writing files')
  .option('-v, --verbose', 'Verbose output')
  .action((node: string, options) => {
    try {
      if (!nodeExists(node)) {
        console.error(chalk.red(`Error: Node '${node}' not found.`));
        console.log(`Available nodes: ${listAvailableNodes().join(', ')}`);
        process.exit(1);
      }

      const outputDir = path.resolve(__dirname, options.outputDir);
      const genOptions: GeneratorOptions = {
        outputDir,
        dryRun: options.dryRun,
        verbose: options.verbose
      };

      let schemas;
      if (options.operation) {
        // Generate specific operation
        const schema = getNodeOperation(node, options.operation);
        schemas = [schema];
      } else {
        // Generate all operations for the node
        schemas = getNodeOperations(node);
      }

      console.log(chalk.blue(`\nGenerating ${schemas.length} connector(s) for ${node}...\n`));

      for (const schema of schemas) {
        if (options.dryRun) {
          const preview = previewConnector(schema);
          console.log(chalk.yellow(`Preview: ${preview.connectorId}`));
          console.log(chalk.gray('─'.repeat(50)));
          console.log(chalk.cyan('Element Template:'));
          console.log(preview.elementTemplate.substring(0, 500) + '...\n');
        } else {
          const result = generateConnector(schema, genOptions);
          console.log(chalk.green(`✓ Generated: ${result.connectorId}`));
          console.log(chalk.gray(`  Directory: ${result.directory}`));
          console.log(chalk.gray(`  Files: ${Object.values(result.files).join(', ')}`));
        }
      }

      console.log(chalk.blue(`\nDone! Generated ${schemas.length} connector(s).`));

    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// List nodes command
program
  .command('list-nodes')
  .description('List all available n8n nodes')
  .action(() => {
    const nodes = listAvailableNodes();
    console.log(chalk.blue('\nAvailable n8n nodes:\n'));
    for (const node of nodes) {
      console.log(chalk.cyan(`  • ${node}`));
    }
    console.log();
  });

// List operations command
program
  .command('list-operations <node>')
  .description('List all operations for a node')
  .action((node: string) => {
    try {
      if (!nodeExists(node)) {
        console.error(chalk.red(`Error: Node '${node}' not found.`));
        process.exit(1);
      }

      const operations = listNodeOperations(node);
      console.log(chalk.blue(`\nOperations for ${node}:\n`));
      for (const op of operations) {
        console.log(chalk.cyan(`  • ${op}`));
      }
      console.log();

    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Preview command
program
  .command('preview <node>')
  .description('Preview generated connector files')
  .option('-o, --operation <operation>', 'Specific operation to preview', 'send')
  .option('-f, --file <file>', 'Which file to preview (element, workflow, bpmn, readme, metadata)')
  .action((node: string, options) => {
    try {
      const schema = getNodeOperation(node, options.operation);
      const preview = previewConnector(schema);

      console.log(chalk.blue(`\nPreview: ${preview.connectorId}\n`));
      console.log(chalk.gray('═'.repeat(60)));

      if (!options.file || options.file === 'element') {
        console.log(chalk.cyan('\n📄 Element Template (.element.json):\n'));
        console.log(preview.elementTemplate);
      }

      if (!options.file || options.file === 'workflow') {
        console.log(chalk.cyan('\n📄 n8n Workflow (.n8n.json):\n'));
        console.log(preview.n8nWorkflow);
      }

      if (!options.file || options.file === 'bpmn') {
        console.log(chalk.cyan('\n📄 BPMN Example (.bpmn):\n'));
        console.log(preview.bpmn);
      }

      if (!options.file || options.file === 'readme') {
        console.log(chalk.cyan('\n📄 README.md:\n'));
        console.log(preview.readme);
      }

      if (!options.file || options.file === 'metadata') {
        console.log(chalk.cyan('\n📄 Connector Metadata (connector.json):\n'));
        console.log(preview.metadata);
      }

    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Compare command - compare generated with existing
program
  .command('compare <node>')
  .description('Compare generated connector with existing manual connector')
  .option('-o, --operation <operation>', 'Specific operation', 'send')
  .option('-e, --existing <path>', 'Path to existing connector')
  .action((node: string, options) => {
    try {
      const schema = getNodeOperation(node, options.operation);
      const preview = previewConnector(schema);

      console.log(chalk.blue(`\nComparing: ${preview.connectorId}\n`));

      // If existing path provided, read and compare
      if (options.existing) {
        const existingDir = path.resolve(options.existing);

        // Compare element template
        const existingElementPath = path.join(existingDir, `${node}-send-message.element.json`);
        if (fs.existsSync(existingElementPath)) {
          console.log(chalk.cyan('\n📊 Element Template Comparison:\n'));
          const existing = fs.readFileSync(existingElementPath, 'utf-8');
          console.log(chalk.yellow('Generated properties count:'), JSON.parse(preview.elementTemplate).properties.length);
          console.log(chalk.yellow('Existing properties count:'), JSON.parse(existing).properties.length);
        }

        // Compare n8n workflow
        const existingWorkflowPath = path.join(existingDir, `${node}-send-message.n8n.json`);
        if (fs.existsSync(existingWorkflowPath)) {
          console.log(chalk.cyan('\n📊 n8n Workflow Comparison:\n'));
          const existing = fs.readFileSync(existingWorkflowPath, 'utf-8');
          console.log(chalk.yellow('Generated nodes count:'), JSON.parse(preview.n8nWorkflow).nodes.length);
          console.log(chalk.yellow('Existing nodes count:'), JSON.parse(existing).nodes.length);
        }
      } else {
        console.log(chalk.gray('Tip: Use --existing <path> to compare with an existing connector'));
      }

    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
