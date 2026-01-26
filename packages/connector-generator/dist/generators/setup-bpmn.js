"use strict";
/**
 * Setup BPMN Generator
 *
 * Generates interactive setup guide as BPMN process with User Tasks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSetupBpmn = generateSetupBpmn;
/**
 * Generate interactive setup BPMN process
 * User deploys this BPMN and completes tasks to set up the connector
 */
function generateSetupBpmn(schema) {
    const processId = `Process_${schema.nodeId}_setup`;
    const processName = `${schema.displayName} - Setup Guide`;
    const resourceList = schema.resources.map(r => `${r.name}: ${r.operations.length} operations`).join('\n   - ');
    const totalOps = schema.resources.reduce((sum, r) => sum + r.operations.length, 0);
    return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_setup_${schema.nodeId}" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Catalyst Connector Generator" exporterVersion="2.0.0">
  <bpmn:process id="${processId}" name="${escapeXml(processName)}" isExecutable="true" camunda:historyTimeToLive="P1D">
    <bpmn:documentation>Interactive setup guide for ${schema.displayName}.

Follow the user tasks to configure this connector step-by-step.
Each task provides instructions for one setup milestone.

Total resources: ${schema.resources.length}
Total operations: ${totalOps}
    </bpmn:documentation>

    <!-- Start Event -->
    <bpmn:startEvent id="StartEvent_1" name="Start Setup">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_Import_Template" />

    <!-- Task 1: Import Element Template -->
    <bpmn:userTask id="Task_Import_Template" name="1. Import Element Template" camunda:assignee="demo">
      <bpmn:documentation># Step 1: Import Element Template into Camunda Modeler

## Instructions:
1. Open Camunda Modeler
2. Go to: **File** → **Import Element Template**
3. Navigate to: \`${schema.nodeId}.element.json\`
4. Click **Open**

## Verification:
- Template "${schema.displayName}" appears in Modeler's template catalog
- When you add a Service Task, you can apply this template

## What This Does:
The element template provides a user-friendly interface for configuring ${schema.displayName} operations in your BPMN diagrams. It includes:
- ${schema.resources.length} resources (${schema.resources.map(r => r.name).join(', ')})
- ${totalOps} operations
- Dynamic fields that appear based on your selection

Click **Complete** when done.
      </bpmn:documentation>
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_Import_Template" targetRef="Task_Import_Workflow" />

    <!-- Task 2: Import n8n Workflow Template -->
    <bpmn:userTask id="Task_Import_Workflow" name="2. Import n8n Workflow" camunda:assignee="demo">
      <bpmn:documentation># Step 2: Import Workflow Template into n8n

## Instructions:
1. Open n8n at: **http://localhost:5678**
2. Go to: **Workflows** tab
3. Click: **Import from File**
4. Select: \`${schema.nodeId}-template.n8n.json\`
5. Workflow opens in editor

## What You'll See:
- **Webhook node**: Receives requests from Camunda
- **${schema.nodeName} node**: Executes operations (unconfigured)
- **Error Handler**: Catches configuration errors
- **Response node**: Returns results to Camunda

## Next Steps:
You'll configure the ${schema.nodeName} node in the next step.

Click **Complete** when workflow is imported.
      </bpmn:documentation>
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_Import_Workflow" targetRef="Task_Configure_Node" />

    <!-- Task 3: Configure Service Node -->
    <bpmn:userTask id="Task_Configure_Node" name="3. Configure ${escapeXml(schema.nodeName)} Node" camunda:assignee="demo">
      <bpmn:documentation># Step 3: Configure ${schema.nodeName} Node in n8n

## Instructions:
1. In n8n workflow editor, click on the **${schema.nodeName}** node
2. **Select Resource**: Choose from dropdown
   ${resourceList}

3. **Select Operation**: Dropdown shows operations for selected resource
4. **Review Field Mappings**: Variables are already mapped
   - Example: \`{{ $json.body.paramName }}\`
   - n8n shows only relevant fields for your operation
5. **Configure Credentials**:
   - Click credential dropdown
   - Select "Create New"
   - Choose appropriate credential type
   - Follow OAuth/API key setup wizard

## OAuth Setup (if required):
- Visit the service's developer console
- Create OAuth application
- Configure authorized redirect URI: \`http://localhost:5678/rest/oauth2-credential/callback\`
- Copy Client ID and Client Secret to n8n

## Save & Activate:
- Click **Save** in n8n
- Toggle **Active** switch (top-right)

Click **Complete** when node is configured and workflow is active.
      </bpmn:documentation>
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_Configure_Node" targetRef="Task_Test_Connection" />

    <!-- Task 4: Test Connection -->
    <bpmn:userTask id="Task_Test_Connection" name="4. Test Connector" camunda:assignee="demo">
      <bpmn:documentation># Step 4: Test Your ${schema.displayName}

## Create Test BPMN Process:
1. In Camunda Modeler, create new BPMN diagram
2. Add a **Service Task**
3. Click **Apply Template** → "${schema.displayName}"
4. Configure task:
   - Resource: ${schema.resources[0].name}
   - Operation: ${schema.resources[0].operations[0].name}
   - Configure required parameters

## Deploy & Execute:
1. Save BPMN file
2. Deploy to Camunda
3. Start process instance from Tasklist
4. Complete any user tasks
5. Verify operation executes successfully

## Troubleshooting:
- **Connection error?** Check n8n workflow is active
- **OAuth error?** Verify credentials in n8n
- **Webhook timeout?** Ensure webhook URL is correct
- **Operation failed?** Check n8n execution log for details

## Success Criteria:
- Process completes without errors
- Operation executes as expected
- Results returned to Camunda

Click **Complete** when test succeeds.
      </bpmn:documentation>
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_Test_Connection" targetRef="Task_Setup_Complete" />

    <!-- Task 5: Setup Complete -->
    <bpmn:userTask id="Task_Setup_Complete" name="5. Setup Complete!" camunda:assignee="demo">
      <bpmn:documentation># 🎉 Setup Complete!

Your ${schema.displayName} is now ready to use.

## What You Can Do Now:

### Available Resources:
${schema.resources.map(r => `
**${r.name}** (${r.operations.length} operations):
${r.operations.slice(0, 5).map(op => `  - ${op.name}: ${op.description}`).join('\n')}${r.operations.length > 5 ? `\n  ... and ${r.operations.length - 5} more` : ''}
`).join('\n')}

## Tips:

**Need Multiple Operations?**
1. In n8n, duplicate the workflow
2. Configure for different resource/operation
3. Save with descriptive name (e.g., "catalyst-${schema.nodeId}-send", "catalyst-${schema.nodeId}-get")

**Element Template Usage**:
- Add Service Task to BPMN
- Apply "${schema.displayName}" template
- Select resource + operation
- Configure parameters (fields appear/disappear dynamically)

**Documentation**:
- README.md: Detailed setup guide
- connector.json: Metadata and version info

Click **Complete** to finish setup wizard.
      </bpmn:documentation>
      <bpmn:incoming>Flow_5</bpmn:incoming>
      <bpmn:outgoing>Flow_6</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_6" sourceRef="Task_Setup_Complete" targetRef="EndEvent_1" />

    <!-- End Event -->
    <bpmn:endEvent id="EndEvent_1" name="Setup Complete">
      <bpmn:incoming>Flow_6</bpmn:incoming>
    </bpmn:endEvent>
  </bpmn:process>

  <!-- BPMN Diagram (visual layout) -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="137" y="145" width="67" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Import_Template_di" bpmnElement="Task_Import_Template">
        <dc:Bounds x="250" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Import_Workflow_di" bpmnElement="Task_Import_Workflow">
        <dc:Bounds x="410" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Configure_Node_di" bpmnElement="Task_Configure_Node">
        <dc:Bounds x="570" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Test_Connection_di" bpmnElement="Task_Test_Connection">
        <dc:Bounds x="730" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Setup_Complete_di" bpmnElement="Task_Setup_Complete">
        <dc:Bounds x="890" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="1052" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1027" y="145" width="86" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="250" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="350" y="120" />
        <di:waypoint x="410" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="510" y="120" />
        <di:waypoint x="570" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="670" y="120" />
        <di:waypoint x="730" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="830" y="120" />
        <di:waypoint x="890" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_6_di" bpmnElement="Flow_6">
        <di:waypoint x="990" y="120" />
        <di:waypoint x="1052" y="120" />
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
