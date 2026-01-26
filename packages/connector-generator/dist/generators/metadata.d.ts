/**
 * Connector Metadata Generator
 *
 * Generates connector.json metadata from operation schema
 */
import { OperationSchema, ConnectorMetadata } from '../types';
/**
 * Generate connector metadata from operation schema
 */
export declare function generateMetadata(schema: OperationSchema): ConnectorMetadata;
/**
 * Convert metadata to JSON string
 */
export declare function metadataToJson(metadata: ConnectorMetadata): string;
