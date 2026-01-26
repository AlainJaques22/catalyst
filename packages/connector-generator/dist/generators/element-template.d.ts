/**
 * Element Template Generator
 *
 * Generates Camunda element template JSON from operation schema
 */
import { OperationSchema, ElementTemplate, MultiOperationSchema } from '../types';
/**
 * Generate element template from operation schema
 */
export declare function generateElementTemplate(schema: OperationSchema): ElementTemplate;
/**
 * Generate multi-operation element template from multi-operation schema
 * Supports conditional properties based on resource/operation selection
 */
export declare function generateMultiOperationElementTemplate(schema: MultiOperationSchema): ElementTemplate;
/**
 * Convert element template to JSON string
 */
export declare function elementTemplateToJson(template: ElementTemplate): string;
