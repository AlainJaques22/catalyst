"use strict";
/**
 * Connector Metadata Generator
 *
 * Generates connector.json metadata from operation schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.metadataToJson = metadataToJson;
const naming_1 = require("../utils/naming");
const type_mapper_1 = require("../utils/type-mapper");
const icon_mapper_1 = require("../utils/icon-mapper");
/**
 * Generate connector metadata from operation schema
 */
function generateMetadata(schema) {
    const connectorId = (0, naming_1.generateConnectorId)(schema.nodeId, schema.resource, schema.operation);
    const category = schema.category || (0, type_mapper_1.determineCategory)(schema.nodeName);
    const color = schema.color || (0, type_mapper_1.getServiceColor)(schema.nodeName);
    const icon = (0, icon_mapper_1.getServiceIcon)(schema.nodeId);
    return {
        id: connectorId,
        name: schema.displayName,
        description: schema.description,
        version: '1.0.0',
        type: 'integration',
        category,
        subcategory: schema.subcategory,
        icon,
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
function classifyQualityTier(schema) {
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
    }
    else if (complexityScore <= 5) {
        return 2; // Tier 2: Needs review
    }
    else {
        return 3; // Tier 3: Manual required
    }
}
/**
 * Convert metadata to JSON string
 */
function metadataToJson(metadata) {
    return JSON.stringify(metadata, null, 2);
}
