/**
 * Catalyst Connector Generator Types
 */

// n8n Schema Types (extracted from node definitions)
export interface N8nParameter {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'boolean' | 'options' | 'fixedCollection' | 'collection' | 'dateTime' | 'json';
  required?: boolean;
  default?: any;
  description?: string;
  placeholder?: string;
  options?: Array<{ name: string; value: string; description?: string }>;
  displayOptions?: {
    show?: Record<string, string[]>;
    hide?: Record<string, string[]>;
  };
}

export interface N8nOperation {
  name: string;
  value: string;
  description?: string;
  action?: string;
}

export interface N8nResource {
  name: string;
  value: string;
  description?: string;
}

export interface N8nNodeSchema {
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  group?: string[];
  version: number;
  credentials?: Array<{ name: string; required?: boolean }>;
  resources: N8nResource[];
  operations: Record<string, N8nOperation[]>; // keyed by resource value
  parameters: N8nParameter[];
}

// Extracted Operation Schema (one per connector)
export interface OperationSchema {
  nodeId: string;           // e.g., "slack"
  nodeName: string;         // e.g., "Slack"
  resource: string;         // e.g., "message"
  resourceName: string;     // e.g., "Message"
  operation: string;        // e.g., "send"
  operationName: string;    // e.g., "Send"
  displayName: string;      // e.g., "Slack - Send Message"
  description: string;
  icon?: string;
  iconSvg?: string;
  color?: string;
  credentials: string[];
  parameters: OperationParameter[];
  category: string;
  subcategory?: string;
  tags: string[];
}

export interface OperationParameter {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  default?: any;
  description?: string;
  placeholder?: string;
  options?: Array<{ name: string; value: string }>;
}

// Catalyst Connector Output Types
export interface ConnectorMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'integration' | 'template';
  category: string;
  subcategory?: string;
  icon: string;
  color: string;
  tags: string[];
  source: {
    type: 'n8n';
    node: string;
    resource: string;
    operation: string;
    version: string;
  };
  quality: {
    tier: 1 | 2 | 3;
    generated: boolean;
    reviewed: boolean;
    tested: boolean;
  };
  authentication?: string;
  featured: boolean;
  createdAt: string;
  files: {
    readme: string;
    n8nWorkflow: string;
    elementTemplate: string;
    exampleBpmn: string;
  };
}

export interface ElementTemplateProperty {
  label: string;
  type: 'String' | 'Text' | 'Dropdown' | 'Boolean' | 'Hidden';
  value?: string;
  description?: string;
  binding: {
    type: 'property' | 'camunda:inputParameter' | 'camunda:outputParameter';
    name: string;
  };
  group?: string;
  constraints?: {
    notEmpty?: boolean;
  };
  choices?: Array<{ name: string; value: string }>;
}

export interface ElementTemplate {
  $schema: string;
  name: string;
  id: string;
  description: string;
  version: number;
  appliesTo: string[];
  icon?: { contents: string };
  groups: Array<{ id: string; label: string }>;
  properties: ElementTemplateProperty[];
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nWorkflowNode[];
  connections: Record<string, { main: Array<Array<{ node: string; type: string; index: number }>> }>;
  active: boolean;
  settings: { executionOrder: string };
  meta?: { description: string };
}

export interface N8nWorkflowNode {
  parameters: Record<string, any>;
  type: string;
  typeVersion: number;
  position: [number, number];
  id: string;
  name: string;
  webhookId?: string;
}

// Quality Classification
export interface QualityClassification {
  connectorId: string;
  tier: 1 | 2 | 3;
  confidence: number;
  issues: string[];
  warnings: string[];
}

// Generator Options
export interface GeneratorOptions {
  outputDir: string;
  overwrite?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
}
