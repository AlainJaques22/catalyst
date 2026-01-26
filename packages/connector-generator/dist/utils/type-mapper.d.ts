/**
 * Type mapping utilities: n8n types -> Catalyst element template types
 */
import { N8nParameter, OperationParameter, ElementTemplateProperty } from '../types';
/**
 * Map n8n parameter type to element template type
 */
export declare function mapN8nTypeToElementType(n8nType: string): 'String' | 'Text' | 'Dropdown' | 'Boolean' | 'Hidden';
/**
 * Convert n8n parameter to operation parameter
 */
export declare function convertN8nParameter(param: N8nParameter): OperationParameter;
/**
 * Convert operation parameter to element template property
 */
export declare function convertToElementProperty(param: OperationParameter, group?: string): ElementTemplateProperty;
/**
 * Generate payload JSON template from parameters
 */
export declare function generatePayloadTemplate(parameters: OperationParameter[]): string;
/**
 * Generate output mapping JSON
 */
export declare function generateOutputMapping(): string;
/**
 * Determine category from n8n node metadata
 */
export declare function determineCategory(nodeName: string, tags?: string[]): string;
/**
 * Generate default color based on service
 */
export declare function getServiceColor(nodeName: string): string;
/**
 * Generate tags from node metadata
 */
export declare function generateTags(nodeName: string, resource: string, operation: string): string[];
