/**
 * BPMN Example Generator
 *
 * Generates example BPMN process XML from operation schema
 */

import { OperationSchema, MultiOperationSchema } from '../types';
import {
  generateConnectorId,
  generateTemplateId,
  generateProcessId,
  generateWebhookUrl,
  toTitleCase
} from '../utils/naming';
import { generatePayloadTemplate, generateOutputMapping } from '../utils/type-mapper';

/**
 * Generate BPMN XML from operation schema
 */
export function generateBpmnExample(schema: OperationSchema): string {
  const connectorId = generateConnectorId(schema.nodeId, schema.resource, schema.operation);
  const templateId = generateTemplateId(connectorId);
  const processId = generateProcessId(connectorId);
  const webhookUrl = generateWebhookUrl(connectorId);
  const taskName = `${toTitleCase(schema.nodeName)} ${toTitleCase(schema.operation)} ${toTitleCase(schema.resource)}`;
  const processName = `${schema.displayName} Example`;

  // Generate form fields for user task
  const formFields = schema.parameters.map(param => {
    // Handle default value - convert objects to JSON string or empty string
    let defaultValue: string;
    if (param.default !== undefined && param.default !== null) {
      if (typeof param.default === 'object') {
        // For objects/arrays, use JSON string or empty string
        defaultValue = Object.keys(param.default).length > 0 ? JSON.stringify(param.default) : '';
      } else {
        defaultValue = String(param.default);
      }
    } else {
      defaultValue = param.placeholder || '';
    }

    const description = param.description || generateDefaultDescriptionForBpmn(param.name, param.displayName, param.type);
    const label = description ? `${param.displayName} - ${description}` : param.displayName;

    return `          <camunda:formField id="${param.name}" label="${escapeXml(label)}" type="string" defaultValue="${escapeXml(defaultValue)}">
            <camunda:properties>
              <camunda:property id="description" value="${escapeXml(description)}" />
            </camunda:properties>
          </camunda:formField>`;
  }).join('\n');

  // Generate input parameters for service task
  const inputParams = schema.parameters.map(param =>
    `          <camunda:inputParameter name="${param.name}">\${${param.name}}</camunda:inputParameter>`
  ).join('\n');

  // Generate payload JSON
  const payloadJson = generatePayloadTemplate(schema.parameters);
  const outputMappingJson = generateOutputMapping();

  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_${connectorId}" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Catalyst Connector Generator" exporterVersion="1.0.0">
  <bpmn:process id="${processId}" name="${escapeXml(processName)}" isExecutable="true" camunda:historyTimeToLive="P1D">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_Input" />
    <bpmn:userTask id="Activity_Input" name="Enter Input" camunda:assignee="demo">
      <bpmn:extensionElements>
        <camunda:formData>
${formFields}
        </camunda:formData>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_Input" targetRef="Activity_Service" />
    <bpmn:serviceTask id="Activity_Service" name="${escapeXml(taskName)}" camunda:modelerTemplate="${templateId}" camunda:modelerTemplateVersion="1" camunda:class="io.catalyst.bridge.CatalystBridge">
      <bpmn:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="timeout">30</camunda:inputParameter>
${inputParams}
          <camunda:inputParameter name="payload">${escapeXml(payloadJson)}</camunda:inputParameter>
          <camunda:inputParameter name="outputMapping">${escapeXml(outputMappingJson)}</camunda:inputParameter>
          <camunda:inputParameter name="webhookUrl">${webhookUrl}</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_Service" targetRef="Activity_ViewResults" />
    <bpmn:userTask id="Activity_ViewResults" name="View Results" camunda:assignee="demo">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Activity_ViewResults" targetRef="EndEvent_1" />
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_4</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="25" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Input_di" bpmnElement="Activity_Input">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Service_di" bpmnElement="Activity_Service">
        <dc:Bounds x="400" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_ViewResults_di" bpmnElement="Activity_ViewResults">
        <dc:Bounds x="540" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="682" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="690" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="500" y="120" />
        <di:waypoint x="540" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="640" y="120" />
        <di:waypoint x="682" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
}

/**
 * Generate multi-operation example BPMN
 * Shows how to use the multi-operation connector in a process
 */
export function generateMultiOperationBpmnExample(schema: MultiOperationSchema): string {
  const processId = `Process_${schema.nodeId}_example`;
  const processName = `${schema.displayName} - Example Usage`;
  const templateId = `io.catalyst.template.${schema.nodeId}`;

  // Pick the first operation from first resource as example
  const firstResource = schema.resources[0];
  const firstOperation = firstResource.operations[0];

  // Generate form fields for user task (first 5 parameters)
  const sampleParams = firstOperation.parameters.slice(0, 5);
  const formFields = sampleParams.map(param => {
    // Handle default value - convert objects to JSON string or empty string
    let defaultValue: string;
    if (param.default !== undefined && param.default !== null) {
      if (typeof param.default === 'object') {
        // For objects/arrays, use JSON string or empty string
        defaultValue = Object.keys(param.default).length > 0 ? JSON.stringify(param.default) : '';
      } else {
        defaultValue = String(param.default);
      }
    } else {
      defaultValue = param.placeholder || '';
    }

    const description = param.description || generateDefaultDescriptionForBpmn(param.name, param.displayName, param.type);
    const label = description ? `${param.displayName} - ${description}` : param.displayName;

    return `          <camunda:formField id="${param.name}" label="${escapeXml(label)}" type="string" defaultValue="${escapeXml(defaultValue)}">
            <camunda:properties>
              <camunda:property id="description" value="${escapeXml(description)}" />
            </camunda:properties>
          </camunda:formField>`;
  }).join('\n');

  // Generate input parameters
  const inputParams = sampleParams.map(param =>
    `          <camunda:inputParameter name="${param.name}">\${${param.name}}</camunda:inputParameter>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_${schema.nodeId}" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Catalyst Connector Generator" exporterVersion="2.0.0">
  <bpmn:process id="${processId}" name="${escapeXml(processName)}" isExecutable="true" camunda:historyTimeToLive="P1D">
    <bpmn:documentation>Example process showing how to use the ${schema.displayName}.

This example demonstrates the "${firstResource.name} - ${firstOperation.name}" operation.
The connector supports ${schema.resources.length} resources with ${countTotalOperations(schema)} total operations.

To use a different operation:
1. Select the Service Task
2. In Properties Panel, choose different Resource and Operation
3. Configure the parameters that appear

Resources available: ${schema.resources.map(r => r.name).join(', ')}
    </bpmn:documentation>

    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_Input" />

    <bpmn:userTask id="Activity_Input" name="Enter Input" camunda:assignee="demo">
      <bpmn:documentation>Enter the parameters for ${firstResource.name} - ${firstOperation.name}</bpmn:documentation>
      <bpmn:extensionElements>
        <camunda:formData>
${formFields}
        </camunda:formData>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_Input" targetRef="Activity_Service" />

    <bpmn:serviceTask id="Activity_Service" name="${escapeXml(schema.displayName)}" camunda:modelerTemplate="${templateId}" camunda:modelerTemplateVersion="2" camunda:class="io.catalyst.bridge.CatalystBridge">
      <bpmn:documentation>Executes ${firstResource.name} - ${firstOperation.name} operation.

To change the operation:
1. Select this task
2. In Properties Panel → Operation section
3. Choose Resource: ${firstResource.name}
4. Choose Operation: ${firstOperation.name}
5. Configure parameters (fields change based on operation)</bpmn:documentation>
      <bpmn:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="timeout">30</camunda:inputParameter>
          <camunda:inputParameter name="resource">${firstResource.value}</camunda:inputParameter>
          <camunda:inputParameter name="operation">${firstOperation.value}</camunda:inputParameter>
${inputParams}
          <camunda:inputParameter name="webhookUrl">http://catalyst-n8n:5678/webhook/catalyst-${schema.nodeId}</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_Service" targetRef="Activity_ViewResults" />

    <bpmn:userTask id="Activity_ViewResults" name="View Results" camunda:assignee="demo">
      <bpmn:documentation>Review the results from ${schema.displayName}.</bpmn:documentation>
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Activity_ViewResults" targetRef="EndEvent_1" />

    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_4</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="25" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Input_di" bpmnElement="Activity_Input">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_Service_di" bpmnElement="Activity_Service">
        <dc:Bounds x="400" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_ViewResults_di" bpmnElement="Activity_ViewResults">
        <dc:Bounds x="560" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="712" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="720" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="500" y="120" />
        <di:waypoint x="560" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="660" y="120" />
        <di:waypoint x="712" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
}

/**
 * Count total operations
 */
function countTotalOperations(schema: MultiOperationSchema): number {
  return schema.resources.reduce((sum, r) => sum + r.operations.length, 0);
}

/**
 * Generate default description for BPMN form fields
 */
function generateDefaultDescriptionForBpmn(name: string, displayName: string, type: string): string {
  const lower = name.toLowerCase();

  // Common ID fields
  if (lower.includes('messageid')) {
    return 'The unique identifier of the message';
  }
  if (lower.includes('draftid')) {
    return 'The unique identifier of the draft';
  }
  if (lower.includes('threadid')) {
    return 'The unique identifier of the thread';
  }
  if (lower.includes('labelid')) {
    return 'The unique identifier of the label';
  }

  // Email fields
  if (lower.includes('subject')) {
    return 'The subject line of the email';
  }
  if (lower.includes('message') && !lower.includes('id')) {
    return 'The content/body of the email message';
  }
  if (lower.includes('emailtype') || lower.includes('email_type')) {
    return 'Whether to send as plain text or HTML formatted email';
  }

  // Collection/Options fields
  if (type === 'collection' && lower.includes('option')) {
    return 'Additional options for this operation';
  }
  if (type === 'collection' && lower.includes('filter')) {
    return 'Filters to narrow down results';
  }

  // Notice/info fields (static text)
  if (lower.includes('notice') || displayName.length > 50) {
    return 'Informational text to guide the user';
  }

  // Generic fallbacks based on type
  if (type === 'options' || type === 'multiOptions') {
    return `Select ${displayName.toLowerCase()} from available options`;
  }
  if (type === 'boolean') {
    return `Enable or disable ${displayName.toLowerCase()}`;
  }
  if (type === 'number') {
    return `Numeric value for ${displayName.toLowerCase()}`;
  }

  // Default: use display name
  return `Specify ${displayName.toLowerCase()} for this operation`;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
