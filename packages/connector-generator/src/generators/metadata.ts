/**
 * Connector Metadata Generator
 *
 * Generates connector.json metadata from operation schema
 */

import { OperationSchema, ConnectorMetadata } from '../types';
import { generateConnectorId } from '../utils/naming';
import { getServiceColor, determineCategory } from '../utils/type-mapper';

/**
 * Generate connector metadata from operation schema
 */
export function generateMetadata(schema: OperationSchema): ConnectorMetadata {
  const connectorId = generateConnectorId(schema.nodeId, schema.resource, schema.operation);
  const category = schema.category || determineCategory(schema.nodeName);
  const color = schema.color || getServiceColor(schema.nodeName);

  return {
    id: connectorId,
    name: schema.displayName,
    description: schema.description,
    version: '1.0.0',
    type: 'integration',
    category,
    subcategory: schema.subcategory,
    icon: `ph-${schema.nodeId}-logo`, // Phosphor icon pattern
    color,
    tags: schema.tags,
    source: {
      type: 'n8n',
      node: schema.nodeId,
      resource: schema.resource,
      operation: schema.operation,
      version: '1.0'
    },
    quality: {
      tier: classifyQualityTier(schema),
      generated: true,
      reviewed: false,
      tested: false
    },
    authentication: schema.credentials.length > 0 ? 'api-key' : undefined,
    featured: false,
    createdAt: new Date().toISOString(),
    files: {
      readme: 'README.md',
      n8nWorkflow: `${connectorId}.n8n.json`,
      elementTemplate: `${connectorId}.element.json`,
      exampleBpmn: `${connectorId}.bpmn`
    }
  };
}

/**
 * Classify quality tier based on schema complexity
 */
function classifyQualityTier(schema: OperationSchema): 1 | 2 | 3 {
  let complexityScore = 0;

  for (const param of schema.parameters) {
    // Simple types add no complexity
    if (['string', 'number', 'boolean'].includes(param.type)) {
      continue;
    }

    // Options add slight complexity
    if (param.type === 'options') {
      complexityScore += 1;
    }

    // Complex types add more complexity
    if (['fixedCollection', 'collection', 'json'].includes(param.type)) {
      complexityScore += 3;
    }
  }

  // Multiple credentials add complexity
  if (schema.credentials.length > 1) {
    complexityScore += 2;
  }

  // Classify based on score
  if (complexityScore <= 2) {
    return 1; // Tier 1: Fully automated
  } else if (complexityScore <= 5) {
    return 2; // Tier 2: Needs review
  } else {
    return 3; // Tier 3: Manual required
  }
}

/**
 * Convert metadata to JSON string
 */
export function metadataToJson(metadata: ConnectorMetadata): string {
  return JSON.stringify(metadata, null, 2);
}
