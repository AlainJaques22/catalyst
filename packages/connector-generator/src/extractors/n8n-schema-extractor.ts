/**
 * N8n Schema Extractor
 *
 * Dynamically extracts operation schemas from n8n node definitions
 * by loading compiled JavaScript modules at runtime.
 */

import * as path from 'path';
import * as fs from 'fs';
import { MultiOperationSchema, OperationParameter } from '../types';

/**
 * Extract complete multi-operation schema from n8n node
 *
 * @param nodeId - Node identifier (e.g., 'gmail', 'slack')
 * @returns Complete schema with all resources and operations
 */
export async function extractN8nNodeSchema(nodeId: string): Promise<MultiOperationSchema> {
  console.log(`Extracting schema for node: ${nodeId}`);

  // 1. Locate node directory
  const nodeBasePath = findNodeDirectory(nodeId);
  console.log(`Found node directory: ${nodeBasePath}`);

  // 2. Detect node version
  const version = detectNodeVersion(nodeBasePath);
  console.log(`Using node version: ${version}`);

  // 3. Load resource descriptions
  const resources = loadResourceDescriptions(nodeBasePath, version);
  console.log(`Extracted ${resources.length} resources with ${countTotalOperations(resources)} total operations`);

  // 4. Extract metadata
  const metadata = loadNodeMetadata(nodeBasePath, nodeId);
  const icon = loadNodeIcon(nodeBasePath);
  const color = extractColor(nodeId);

  return {
    nodeId,
    nodeName: capitalize(nodeId),
    displayName: metadata.displayName || `${capitalize(nodeId)} Connector`,
    description: metadata.description || `${capitalize(nodeId)} integration connector`,
    icon,
    color,
    credentials: metadata.credentials || ['oAuth2'],
    category: determineCategory(nodeId),
    tags: generateTags(nodeId),
    resources,
  };
}

/**
 * Find n8n node directory in node_modules
 */
function findNodeDirectory(nodeId: string): string {
  const basePath = path.join(process.cwd(), 'node_modules', 'n8n-nodes-base', 'dist', 'nodes');
  const capitalized = capitalize(nodeId);

  // Try direct path first
  let nodePath = path.join(basePath, capitalized);
  if (fs.existsSync(nodePath)) {
    return nodePath;
  }

  // Try Google services path
  nodePath = path.join(basePath, 'Google', capitalized);
  if (fs.existsSync(nodePath)) {
    return nodePath;
  }

  throw new Error(
    `Could not find node directory for: ${nodeId}. Tried:\n` +
    `- ${basePath}/${capitalized}\n` +
    `- ${basePath}/Google/${capitalized}`
  );
}

/**
 * Detect which version directory to use (v1, v2, etc.)
 */
function detectNodeVersion(nodeBasePath: string): string {
  // Check for version directories
  const versions = ['v2', 'v1'];
  for (const version of versions) {
    const versionPath = path.join(nodeBasePath, version);
    if (fs.existsSync(versionPath)) {
      return version;
    }
  }
  // No version subdirectory means files are in root
  return '';
}

/**
 * Load resource descriptions from node directory
 */
function loadResourceDescriptions(nodeBasePath: string, version: string): any[] {
  const versionPath = version ? path.join(nodeBasePath, version) : nodeBasePath;

  // Find all *Description.js files
  const files = fs.readdirSync(versionPath);
  const descriptionFiles = files.filter(f => f.endsWith('Description.js'));

  if (descriptionFiles.length === 0) {
    console.warn(`No description files found in ${versionPath}`);
    return [];
  }

  const resources: any[] = [];

  for (const file of descriptionFiles) {
    const resourceName = file.replace('Description.js', '').toLowerCase();
    const descriptionPath = path.join(versionPath, file);

    try {
      // Dynamically require the compiled JavaScript module
      const description = require(descriptionPath);

      // Extract operations from exports like 'messageOperations', 'draftOperations', etc.
      const operationsKey = `${resourceName}Operations`;
      const fieldsKey = `${resourceName}Fields`;

      if (!description[operationsKey]) {
        console.warn(`No ${operationsKey} found in ${file}`);
        continue;
      }

      const operations = parseOperations(
        description[operationsKey],
        description[fieldsKey] || [],
        resourceName
      );

      resources.push({
        value: resourceName,
        name: capitalize(resourceName),
        operations,
      });
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  return resources;
}

/**
 * Parse operations from n8n operation definitions
 */
function parseOperations(
  operationsDef: any[],
  fieldsDef: any[],
  resourceName: string
): any[] {
  // The operationsDef is typically an array with one element containing the operations options
  const operationOptions = operationsDef[0]?.options || [];

  return operationOptions.map((op: any) => {
    // Extract parameters for this specific operation
    const parameters = extractOperationParameters(fieldsDef, resourceName, op.value);

    return {
      value: op.value,
      name: op.name,
      description: op.action || op.description || `${op.name} operation`,
      parameters,
      tier: classifyOperationTier(parameters),
    };
  });
}

/**
 * Extract parameters for a specific operation
 */
function extractOperationParameters(
  fieldsDef: any[],
  resourceName: string,
  operationValue: string
): OperationParameter[] {
  const params = fieldsDef
    .filter(field => {
      // Check if field is visible for this resource/operation combination
      const show = field.displayOptions?.show;
      if (!show) return false;

      const matchesResource = !show.resource || show.resource.includes(resourceName);
      const matchesOperation = !show.operation || show.operation.includes(operationValue);

      return matchesResource && matchesOperation;
    })
    .map(field => ({
      name: field.name,
      displayName: field.displayName,
      type: mapN8nTypeToGeneric(field.type),
      required: field.required ?? false,
      default: field.default,
      description: field.description,
      placeholder: field.placeholder,
      options: field.options?.map((opt: any) => ({
        name: opt.name,
        value: opt.value,
      })),
    }));

  // Deduplicate by parameter name (keep first occurrence)
  const seen = new Set<string>();
  return params.filter(param => {
    if (seen.has(param.name)) {
      return false;
    }
    seen.add(param.name);
    return true;
  });
}

/**
 * Map n8n field type to generic type string
 */
function mapN8nTypeToGeneric(n8nType: string): string {
  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'options': 'options',
    'multiOptions': 'multiOptions',
    'dateTime': 'dateTime',
    'json': 'json',
    'fixedCollection': 'fixedCollection',
    'collection': 'collection',
  };
  return typeMap[n8nType] || 'string';
}

/**
 * Load node metadata from .node.json file
 */
function loadNodeMetadata(nodeBasePath: string, nodeId: string): any {
  const capitalized = capitalize(nodeId);
  const jsonPath = path.join(nodeBasePath, `${capitalized}.node.json`);

  if (fs.existsSync(jsonPath)) {
    try {
      const content = fs.readFileSync(jsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Could not parse node metadata from ${jsonPath}`);
    }
  }

  return {};
}

/**
 * Load node icon from SVG file
 */
function loadNodeIcon(nodeBasePath: string): string | undefined {
  const files = fs.readdirSync(nodeBasePath);
  const svgFile = files.find(f => f.endsWith('.svg'));

  if (svgFile) {
    return `icons/${svgFile}`;
  }

  return undefined;
}

/**
 * Classify operation quality tier based on parameter complexity
 */
export function classifyOperationTier(parameters: OperationParameter[]): 1 | 2 | 3 {
  // Tier 3: Complex (skip initially)
  const hasComplexTypes = parameters.some((p) =>
    ['fixedCollection', 'collection'].includes(p.type)
  );
  const hasBinaryData = parameters.some((p) =>
    p.name.includes('binary') || p.type === 'binary'
  );

  if (hasComplexTypes || hasBinaryData) {
    return 3;
  }

  // Tier 2: Moderate complexity
  const hasOptions = parameters.some((p) => p.type === 'options');
  const hasConditionals = parameters.some((p) => p.description?.includes('display'));

  if (hasOptions || hasConditionals) {
    return 2;
  }

  // Tier 1: Simple
  return 1;
}

/**
 * Determine category based on node ID
 */
function determineCategory(nodeId: string): string {
  const categoryMap: Record<string, string> = {
    gmail: 'communication',
    slack: 'communication',
    discord: 'communication',
    'google-sheets': 'data-storage',
    github: 'developer-tools',
    jira: 'productivity',
  };

  return categoryMap[nodeId.toLowerCase()] || 'integration';
}

/**
 * Generate tags for node
 */
function generateTags(nodeId: string): string[] {
  return [nodeId.toLowerCase(), 'integration', 'automation'];
}

/**
 * Get service color
 */
function extractColor(nodeId: string): string {
  const colorMap: Record<string, string> = {
    gmail: '#EA4335',
    slack: '#4A154B',
    discord: '#5865F2',
    github: '#181717',
  };

  return colorMap[nodeId.toLowerCase()] || '#6B7280';
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Count total operations across all resources
 */
function countTotalOperations(resources: any[]): number {
  return resources.reduce((sum, r) => sum + r.operations.length, 0);
}
