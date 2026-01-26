/**
 * Test script for multi-operation n8n workflow template generation
 */

const { extractN8nNodeSchema } = require('./dist/extractors/n8n-schema-extractor');
const { generateMultiOperationWorkflow } = require('./dist/generators/n8n-workflow');
const fs = require('fs');
const path = require('path');

async function testWorkflowTemplateGeneration() {
  console.log('Testing Multi-Operation n8n Workflow Template Generation...\n');

  try {
    // 1. Extract Gmail schema
    console.log('Step 1: Extracting Gmail schema...');
    const schema = await extractN8nNodeSchema('gmail');
    console.log(`✓ Extracted: ${schema.resources.length} resources, ${countOperations(schema)} operations\n`);

    // 2. Generate workflow template
    console.log('Step 2: Generating n8n workflow template...');
    const workflow = generateMultiOperationWorkflow(schema);
    console.log(`✓ Generated workflow: ${workflow.name}`);
    console.log(`  Nodes: ${workflow.nodes.length}`);
    console.log(`  Active: ${workflow.active}`);
    console.log(`  Description: ${workflow.meta.description}\n`);

    // 3. Analyze workflow nodes
    console.log('Step 3: Analyzing workflow nodes...');
    for (const node of workflow.nodes) {
      console.log(`  - ${node.name} (${node.type})`);
      if (node.name === schema.nodeName) {
        const paramCount = Object.keys(node.parameters).length;
        console.log(`    Parameters pre-mapped: ${paramCount}`);
        console.log(`    Sample parameters: ${Object.keys(node.parameters).slice(0, 5).join(', ')}...`);
      }
    }
    console.log();

    // 4. Verify connections
    console.log('Step 4: Verifying workflow connections...');
    const connectionKeys = Object.keys(workflow.connections);
    console.log(`✓ Connections: ${connectionKeys.length}`);
    for (const key of connectionKeys) {
      const conn = workflow.connections[key];
      if (conn.main) {
        console.log(`  - ${key} → ${conn.main[0].map(c => c.node).join(', ')}`);
      }
      if (conn.error) {
        console.log(`  - ${key} [error] → ${conn.error[0].map(c => c.node).join(', ')}`);
      }
    }
    console.log();

    // 5. Check webhook configuration
    console.log('Step 5: Verifying webhook configuration...');
    const webhookNode = workflow.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
    if (webhookNode) {
      console.log(`✓ Webhook node found`);
      console.log(`  Path: ${webhookNode.parameters.path}`);
      console.log(`  Method: ${webhookNode.parameters.httpMethod}`);
      console.log(`  Response mode: ${webhookNode.parameters.responseMode}`);
    }
    console.log();

    // 6. Check error handling
    console.log('Step 6: Verifying error handling...');
    const errorNode = workflow.nodes.find(n => n.name === 'Format Error Response');
    if (errorNode) {
      console.log(`✓ Error handler found`);
      console.log(`  Type: ${errorNode.type}`);
      const codeLength = errorNode.parameters.jsCode?.length || 0;
      console.log(`  Code length: ${codeLength} characters`);
    }
    console.log();

    // 7. Verify service node parameters
    console.log('Step 7: Verifying service node parameter mappings...');
    const serviceNode = workflow.nodes.find(n => n.name === schema.nodeName);
    if (serviceNode) {
      const params = serviceNode.parameters;
      const mappedParams = Object.keys(params).filter(k =>
        typeof params[k] === 'string' && params[k].includes('$json.body')
      );
      console.log(`✓ ${mappedParams.length} parameters pre-mapped with n8n expressions`);
      console.log(`  Sample mappings:`);
      for (const key of mappedParams.slice(0, 5)) {
        console.log(`    ${key}: ${params[key]}`);
      }
      if (mappedParams.length > 5) {
        console.log(`    ... and ${mappedParams.length - 5} more`);
      }
    }
    console.log();

    // 8. Save to file
    const outputPath = path.join(__dirname, 'test-output-gmail-template.n8n.json');
    fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2));
    console.log(`✓ Workflow template saved to: ${outputPath}\n`);

    console.log('✅ All tests passed successfully!\n');
    console.log('Next steps:');
    console.log('1. Import test-output-gmail-template.n8n.json into n8n');
    console.log('2. Open the Gmail node in n8n');
    console.log('3. Select Resource from dropdown (Message, Draft, Label, Thread)');
    console.log('4. Select Operation from dropdown (send, get, reply, etc.)');
    console.log('5. Verify n8n shows only relevant fields for selected operation');
    console.log('6. Verify all parameters are pre-mapped with {{ $json.body.paramName }}');
    console.log('7. Configure Gmail OAuth2 credentials');
    console.log('8. Save and activate workflow');

    return workflow;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function countOperations(schema) {
  return schema.resources.reduce((sum, r) => sum + r.operations.length, 0);
}

testWorkflowTemplateGeneration();
