/**
 * BPMN Example Generator
 *
 * Generates example BPMN process XML from operation schema
 */
import { OperationSchema, MultiOperationSchema } from '../types';
/**
 * Generate BPMN XML from operation schema
 */
export declare function generateBpmnExample(schema: OperationSchema): string;
/**
 * Generate multi-operation example BPMN
 * Shows how to use the multi-operation connector in a process
 */
export declare function generateMultiOperationBpmnExample(schema: MultiOperationSchema): string;
