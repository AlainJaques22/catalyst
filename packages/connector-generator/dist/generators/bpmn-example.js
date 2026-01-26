"use strict";
/**
 * BPMN Example Generator
 *
 * Generates example BPMN process XML from operation schema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBpmnExample = generateBpmnExample;
const naming_1 = require("../utils/naming");
const type_mapper_1 = require("../utils/type-mapper");
/**
 * Generate BPMN XML from operation schema
 */
function generateBpmnExample(schema) {
    const connectorId = (0, naming_1.generateConnectorId)(schema.nodeId, schema.resource, schema.operation);
    const templateId = (0, naming_1.generateTemplateId)(connectorId);
    const processId = (0, naming_1.generateProcessId)(connectorId);
    const webhookUrl = (0, naming_1.generateWebhookUrl)(connectorId);
    const taskName = `${(0, naming_1.toTitleCase)(schema.nodeName)} ${(0, naming_1.toTitleCase)(schema.operation)} ${(0, naming_1.toTitleCase)(schema.resource)}`;
    const processName = `${schema.displayName} Example`;
    // Generate form fields for user task
    const formFields = schema.parameters.map(param => {
        const defaultValue = param.default ?? (param.placeholder || `Enter ${param.displayName.toLowerCase()}`);
        return `          <camunda:formField id="${param.name}" label="${param.displayName}" type="string" defaultValue="${escapeXml(String(defaultValue))}">
            <camunda:properties>
              <camunda:property id="description" value="${escapeXml(param.description || '')}" />
            </camunda:properties>
          </camunda:formField>`;
    }).join('\n');
    // Generate input parameters for service task
    const inputParams = schema.parameters.map(param => `          <camunda:inputParameter name="${param.name}">\${${param.name}}</camunda:inputParameter>`).join('\n');
    // Generate payload JSON
    const payloadJson = (0, type_mapper_1.generatePayloadTemplate)(schema.parameters);
    const outputMappingJson = (0, type_mapper_1.generateOutputMapping)();
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
 * Escape XML special characters
 */
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
