/**
 * Element Template Generator
 *
 * Generates Camunda element template JSON from operation schema
 */
import { OperationSchema, ElementTemplate } from '../types';
/**
 * Generate element template from operation schema
 */
export declare function generateElementTemplate(schema: OperationSchema): ElementTemplate;
/**
 * Convert element template to JSON string
 */
export declare function elementTemplateToJson(template: ElementTemplate): string;
