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
import { extractN8nNodeSchema } from './extractors/n8n-schema-extractor';
import { generateMultiOperationElementTemplate } from './generators/element-template';
import { generateMultiOperationWorkflow } from './generators/n8n-workflow';
import { generateMultiOperationBpmnExample } from './generators/bpmn-example';
import { generateSetupBpmn } from './generators/setup-bpmn';
import { generateConnectorId } from './utils/naming';
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
  .option('-d, --output-dir <dir>', 'Output directory', '../../../connectors/generated')
  .option('--dry-run', 'Preview without writing files')
  .option('--force', 'Skip backup and overwrite existing files')
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
        verbose: options.verbose,
        force: options.force
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

// Generate multi-operation command
program
  .command('generate-multi <node>')
  .description('Generate individual connectors for all resources and operations')
  .option('-d, --output-dir <dir>', 'Output directory', '../../../connectors/generated')
  .option('--tier <tier>', 'Max quality tier to include (1-3)', '3')
  .option('--dry-run', 'Preview without writing files')
  .option('--force', 'Skip backup and overwrite existing files')
  .option('-v, --verbose', 'Verbose output')
  .action(async (node: string, options) => {
    try {
      console.log(chalk.blue(`\nExtracting schema for ${node}...\n`));

      // 1. Extract multi-operation schema
      const schema = await extractN8nNodeSchema(node);

      console.log(chalk.green(`✓ Extracted: ${schema.resources.length} resources`));
      const totalOps = schema.resources.reduce((sum, r) => sum + r.operations.length, 0);
      console.log(chalk.green(`✓ Total operations: ${totalOps}\n`));

      // 2. Filter by tier
      const maxTier = parseInt(options.tier);
      const filteredSchema = {
        ...schema,
        resources: schema.resources.map(r => ({
          ...r,
          operations: r.operations.filter(op => op.tier <= maxTier)
        })).filter(r => r.operations.length > 0)
      };

      const filteredOps = filteredSchema.resources.reduce((sum, r) => sum + r.operations.length, 0);
      if (filteredOps < totalOps) {
        console.log(chalk.yellow(`⚠ Filtered to tier ${maxTier}: ${filteredOps} operations (excluded ${totalOps - filteredOps})\n`));
      }

      // 3. Generate individual connector for each operation
      console.log(chalk.blue('Generating individual connectors...\n'));

      const outputDir = path.resolve(__dirname, options.outputDir);
      let generatedCount = 0;

      for (const resource of filteredSchema.resources) {
        for (const operation of resource.operations) {
          // Convert to OperationSchema format
          const operationSchema: any = {
            nodeId: schema.nodeId,
            nodeName: schema.nodeName,
            resourceName: resource.name,
            operationName: operation.name,
            displayName: `${schema.displayName} - ${resource.name} - ${operation.name}`,
            description: operation.description || `${operation.name} operation for ${resource.name}`,
            resource: resource.value,
            operation: operation.value,
            parameters: operation.parameters,
            category: schema.category,
            credentials: schema.credentials,
            icon: schema.icon,
            color: schema.color,
            tags: schema.tags || [schema.nodeId, resource.value, operation.value],
            // Add hierarchy metadata
            hierarchy: {
              node: schema.nodeId,
              nodeName: schema.displayName,
              resource: resource.value,
              resourceName: resource.name,
              operation: operation.value,
              operationName: operation.name
            }
          };

          const connectorId = generateConnectorId(schema.nodeId, resource.value, operation.value);

          if (options.dryRun) {
            console.log(chalk.yellow(`Preview: ${connectorId}`));
          } else {
            const result = generateConnector(operationSchema, {
              outputDir: outputDir,
              dryRun: false,
              verbose: options.verbose,
              force: options.force
            });

            console.log(chalk.green(`✓ Generated: ${result.connectorId}`));
            if (options.verbose) {
              console.log(chalk.gray(`  Directory: ${result.directory}`));
            }
            generatedCount++;
          }
        }
      }

      // 4. Summary
      if (options.dryRun) {
        console.log(chalk.yellow(`\nDry run - ${filteredOps} connectors not written\n`));
      } else {
        console.log(chalk.blue(`\n✅ Generated ${generatedCount} individual connectors\n`));
        console.log(chalk.gray('Directory structure:'));
        console.log(chalk.gray(`  ${outputDir}/${schema.category}/${schema.nodeId}/`));
        console.log(chalk.gray(`    ├── draft-create/`));
        console.log(chalk.gray(`    ├── draft-delete/`));
        console.log(chalk.gray(`    ├── message-send/`));
        console.log(chalk.gray(`    └── ... (${generatedCount} total)\n`));
        console.log(chalk.gray('Each connector includes:'));
        console.log(chalk.gray('  - Element template (.element.json)'));
        console.log(chalk.gray('  - n8n workflow (.n8n.json)'));
        console.log(chalk.gray('  - Example BPMN (.bpmn)'));
        console.log(chalk.gray('  - README.md'));
        console.log(chalk.gray('  - Metadata (connector.json)\n'));
        console.log(chalk.gray('Next steps:'));
        console.log(chalk.gray('1. Import element templates into Camunda Modeler'));
        console.log(chalk.gray('2. Import workflow templates into n8n'));
        console.log(chalk.gray('3. Configure credentials in n8n'));
        console.log(chalk.gray('4. Test connectors\n'));
      }

    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

// Helper function to generate multi-operation README
function generateMultiOperationReadme(schema: any): string {
  return `# ${schema.displayName}

${schema.description}

## Overview

This is a multi-operation connector that supports:
- **Resources**: ${schema.resources.map((r: any) => r.name).join(', ')}
- **Total Operations**: ${schema.resources.reduce((sum: number, r: any) => sum + r.operations.length, 0)}

## Setup Instructions

### 1. Import Element Template (Camunda Modeler)

1. Open Camunda Modeler
2. Go to File → Import Element Template
3. Select \`${schema.nodeId}.element.json\`
4. Template "Catalyst - ${schema.displayName}" is now available

### 2. Import n8n Workflow Template

1. Open n8n (http://localhost:5678)
2. Go to Workflows → Import from File
3. Select \`${schema.nodeId}-template.n8n.json\`
4. Opens a template workflow with Webhook → ${schema.nodeName} → Response

### 3. Configure ${schema.nodeName} Node in n8n

1. Click on the ${schema.nodeName} node
2. **Select Resource**: Choose from dropdown
${schema.resources.map((r: any) => `   - ${r.name}: ${r.operations.length} operations`).join('\n')}
3. **Select Operation**: Dropdown shows operations for selected resource
4. **Configure fields**: n8n shows only relevant fields for your operation
   - Variables already mapped: \`{{ $json.body.paramName }}\`
5. **Add Credentials**: Configure OAuth/API credentials
6. **Save workflow** and **Activate**

### 4. Use in Camunda BPMN

1. Create/open a BPMN diagram
2. Add a Service Task
3. Click "Apply Template" → Select "Catalyst - ${schema.displayName}"
4. Configure in properties panel:
   - **Resource**: Select resource type
   - **Operation**: Select operation (fields change based on selection)
   - **Parameters**: Configure operation-specific parameters
5. Deploy and execute process

## Supported Operations

${schema.resources.map((r: any) => {
  return `### ${r.name} (${r.operations.length} operations)\n${r.operations.map((op: any) => `- **${op.name}**: ${op.description}`).join('\n')}`;
}).join('\n\n')}

## Need Multiple Operations?

If you need both "send" and "get" operations:
1. Duplicate the n8n workflow
2. Configure first copy for "send"
3. Configure second copy for "get"
4. Save with descriptive names

The element template supports all operations - you just need to set up n8n workflows for the operations you need.

---

🤖 Generated with Catalyst Connector Generator v2.0
`;
}

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
