/**
 * Connector Generator
 *
 * Main class that orchestrates connector generation from n8n schemas
 */
import { OperationSchema, GeneratorOptions } from './types';
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
export declare function generateConnector(schema: OperationSchema, options: GeneratorOptions): GeneratedFiles;
/**
 * Generate multiple connectors from operation schemas
 */
export declare function generateConnectors(schemas: OperationSchema[], options: GeneratorOptions): GeneratedFiles[];
/**
 * Preview generated files without writing (dry run)
 */
export declare function previewConnector(schema: OperationSchema): {
    connectorId: string;
    elementTemplate: string;
    n8nWorkflow: string;
    bpmn: string;
    readme: string;
    metadata: string;
};
