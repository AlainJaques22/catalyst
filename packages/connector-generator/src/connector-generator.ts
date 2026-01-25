/**
 * Connector Generator
 *
 * Main class that orchestrates connector generation from n8n schemas
 */

import * as fs from 'fs';
import * as path from 'path';
import { OperationSchema, GeneratorOptions } from './types';
import { generateConnectorId } from './utils/naming';
import {
  generateElementTemplate,
  elementTemplateToJson,
  generateN8nWorkflow,
  n8nWorkflowToJson,
  generateBpmnExample,
  generateReadme,
  generateMetadata,
  metadataToJson
} from './generators';

export interface GeneratedFiles {
  connectorId: string;
  directory: string;
  files: {
    elementTemplate: string;
    n8nWorkflow: string;
    bpmn: string;
    readme: string;
    metadata: string;
  };
}

/**
 * Generate all connector files from an operation schema
 */
export function generateConnector(
  schema: OperationSchema,
  options: GeneratorOptions
): GeneratedFiles {
  const connectorId = generateConnectorId(schema.nodeId, schema.resource, schema.operation);
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
    } catch (error) {
      console.warn(`Could not read existing metadata, using default version ${version}`);
    }
  }

  // Generate all files with updated version
  const elementTemplate = elementTemplateToJson(generateElementTemplate(schema));
  const n8nWorkflow = n8nWorkflowToJson(generateN8nWorkflow(schema));
  const bpmn = generateBpmnExample(schema);
  const readme = generateReadme(schema);

  // Generate metadata with version
  const metadataObj = generateMetadata(schema);
  metadataObj.version = version;
  const metadata = metadataToJson(metadataObj);

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
export function generateConnectors(
  schemas: OperationSchema[],
  options: GeneratorOptions
): GeneratedFiles[] {
  const results: GeneratedFiles[] = [];

  for (const schema of schemas) {
    try {
      const result = generateConnector(schema, options);
      results.push(result);

      if (options.verbose) {
        console.log(`Generated: ${result.connectorId}`);
      }
    } catch (error) {
      console.error(`Failed to generate connector for ${schema.nodeId}/${schema.operation}:`, error);
    }
  }

  return results;
}

/**
 * Preview generated files without writing (dry run)
 */
export function previewConnector(schema: OperationSchema): {
  connectorId: string;
  elementTemplate: string;
  n8nWorkflow: string;
  bpmn: string;
  readme: string;
  metadata: string;
} {
  const connectorId = generateConnectorId(schema.nodeId, schema.resource, schema.operation);

  return {
    connectorId,
    elementTemplate: elementTemplateToJson(generateElementTemplate(schema)),
    n8nWorkflow: n8nWorkflowToJson(generateN8nWorkflow(schema)),
    bpmn: generateBpmnExample(schema),
    readme: generateReadme(schema),
    metadata: metadataToJson(generateMetadata(schema))
  };
}
