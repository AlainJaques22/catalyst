/**
 * N8n Schema Extractor
 *
 * Dynamically extracts operation schemas from n8n node TypeScript definitions
 * using TypeScript AST parsing with ts-morph.
 */

import { Project, SyntaxKind, Node as TsNode } from 'ts-morph';
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

  // 1. Locate the .node.ts file
  const nodePath = findNodeFile(nodeId);
  console.log(`Found node file: ${nodePath}`);

  // 2. Parse TypeScript AST
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
  });
  const sourceFile = project.addSourceFileAtPath(nodePath);

  // 3. Find the INodeType class
  const nodeClass = sourceFile.getClass((cls) =>
    cls.getImplements().some((i) => i.getText().includes('INodeType'))
  );

  if (!nodeClass) {
    throw new Error(`Could not find INodeType class in ${nodePath}`);
  }

  // 4. Extract basic metadata
  const description = extractDescription(nodeClass);
  const displayName = extractPropertyValue(nodeClass, 'displayName') || capitalize(nodeId);
  const icon = extractPropertyValue(nodeClass, 'icon');
  const color = extractColor(nodeId);

  // 5. Extract properties array (contains resources, operations, parameters)
  const properties = extractProperties(nodeClass);

  // 6. Parse resource/operation hierarchy
  const resources = parseResourceOperationHierarchy(properties, nodeId);

  // 7. Extract credentials
  const credentials = extractCredentials(nodeClass);

  console.log(`Extracted ${resources.length} resources with ${countTotalOperations(resources)} total operations`);

  return {
    nodeId,
    nodeName: capitalize(nodeId),
    displayName: `${capitalize(nodeId)} Connector`,
    description: description || `${capitalize(nodeId)} integration connector`,
    icon,
    color,
    credentials,
    category: determineCategory(nodeId),
    tags: generateTags(nodeId),
    resources,
  };
}

/**
 * Find n8n node .node.ts file in node_modules
 */
function findNodeFile(nodeId: string): string {
  const basePath = path.join(process.cwd(), 'node_modules', 'n8n-nodes-base', 'dist', 'nodes');

  // Common patterns:
  // - Gmail: nodes/Google/Gmail/Gmail.node.js (in dist)
  // - Slack: nodes/Slack/Slack.node.js (in dist)
  const capitalized = capitalize(nodeId);

  // Try direct path first
  let nodePath = path.join(basePath, capitalized, `${capitalized}.node.js`);
  if (fs.existsSync(nodePath)) {
    return nodePath;
  }

  // Try Google services path
  nodePath = path.join(basePath, 'Google', capitalized, `${capitalized}.node.js`);
  if (fs.existsSync(nodePath)) {
    return nodePath;
  }

  throw new Error(`Could not find node file for: ${nodeId}. Tried:\n- ${basePath}/${capitalized}/${capitalized}.node.js\n- ${basePath}/Google/${capitalized}/${capitalized}.node.js`);
}

/**
 * Extract description from node class
 */
function extractDescription(nodeClass: any): string {
  const descProp = nodeClass.getProperty('description');
  if (descProp) {
    const initializer = descProp.getInitializer();
    if (initializer) {
      return initializer.getText().replace(/['"]/g, '');
    }
  }
  return '';
}

/**
 * Extract a simple property value from node class
 */
function extractPropertyValue(nodeClass: any, propertyName: string): string | undefined {
  const prop = nodeClass.getProperty(propertyName);
  if (prop) {
    const initializer = prop.getInitializer();
    if (initializer) {
      return initializer.getText().replace(/['"]/g, '');
    }
  }
  return undefined;
}

/**
 * Extract properties array from node class
 * This contains all resources, operations, and parameters
 */
function extractProperties(nodeClass: any): any[] {
  const propertiesProp = nodeClass.getProperty('properties');
  if (!propertiesProp) {
    return [];
  }

  const initializer = propertiesProp.getInitializer();
  if (!initializer) {
    return [];
  }

  // The properties initializer is an array
  try {
    // Since we're working with compiled JavaScript, we need to actually evaluate it
    // This is safe because it's n8n's own code
    const text = initializer.getText();
    // For now, return empty array - we'll need to enhance this with proper parsing
    console.warn('Property extraction from compiled code not yet implemented');
    return [];
  } catch (error) {
    console.error('Error parsing properties:', error);
    return [];
  }
}

/**
 * Parse resource/operation hierarchy from properties
 * Groups parameters by resource and operation
 */
function parseResourceOperationHierarchy(properties: any[], nodeId: string): any[] {
  // Placeholder implementation - needs to be enhanced
  // This would parse the displayOptions.show to determine resource/operation structure

  // For MVP, return a simple structure
  return [
    {
      value: 'message',
      name: 'Message',
      operations: [
        {
          value: 'send',
          name: 'Send',
          description: 'Send a message',
          parameters: [],
          tier: 1 as 1 | 2 | 3,
        },
      ],
    },
  ];
}

/**
 * Extract credentials from node class
 */
function extractCredentials(nodeClass: any): string[] {
  const credentialsProp = nodeClass.getProperty('credentials');
  if (!credentialsProp) {
    return [];
  }

  // Placeholder - would need to parse the credentials array
  return ['oAuth2'];
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
