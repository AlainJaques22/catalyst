/**
 * Setup BPMN Generator
 *
 * Generates interactive setup guide as BPMN process with User Tasks
 */
import { MultiOperationSchema } from '../types';
/**
 * Generate interactive setup BPMN process
 * User deploys this BPMN and completes tasks to set up the connector
 */
export declare function generateSetupBpmn(schema: MultiOperationSchema): string;
