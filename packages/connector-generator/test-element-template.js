/**
 * Test script for multi-operation element template generation
 */

const { extractN8nNodeSchema } = require('./dist/extractors/n8n-schema-extractor');
const { generateMultiOperationElementTemplate } = require('./dist/generators/element-template');
const fs = require('fs');
const path = require('path');

async function testElementTemplateGeneration() {
  console.log('Testing Multi-Operation Element Template Generation...\n');

  try {
    // 1. Extract Gmail schema
    console.log('Step 1: Extracting Gmail schema...');
    const schema = await extractN8nNodeSchema('gmail');
    console.log(`✓ Extracted: ${schema.resources.length} resources, ${countOperations(schema)} operations\n`);

    // 2. Generate element template
    console.log('Step 2: Generating multi-operation element template...');
    const template = generateMultiOperationElementTemplate(schema);
    console.log(`✓ Generated template: ${template.name}`);
    console.log(`  ID: ${template.id}`);
    console.log(`  Version: ${template.version}`);
    console.log(`  Properties: ${template.properties.length}`);
    console.log(`  Groups: ${template.groups.map(g => g.label).join(', ')}\n`);

    // 3. Analyze conditional properties
    console.log('Step 3: Analyzing conditional properties...');
    const conditionalProps = template.properties.filter(p => p.condition);
    console.log(`✓ Conditional properties: ${conditionalProps.length}`);

    // Count by type
    const resourceConditions = conditionalProps.filter(p => p.condition.property === 'resource');
    const operationConditions = conditionalProps.filter(p => p.condition.property?.startsWith('operation_'));
    console.log(`  - Resource-based conditions: ${resourceConditions.length}`);
    console.log(`  - Operation-based conditions: ${operationConditions.length}\n`);

    // 4. Verify structure
    console.log('Step 4: Verifying template structure...');
    const resourceProp = template.properties.find(p => p.id === 'resource');
    if (resourceProp) {
      console.log(`✓ Resource dropdown found: ${resourceProp.choices.length} choices`);
      console.log(`  Choices: ${resourceProp.choices.map(c => c.name).join(', ')}`);
    }

    const operationProps = template.properties.filter(p => p.id?.startsWith('operation_'));
    console.log(`✓ Operation dropdowns: ${operationProps.length}`);
    for (const op of operationProps) {
      console.log(`  - ${op.label} (${op.id}): ${op.choices?.length || 0} operations`);
    }
    console.log();

    // 5. Sample parameters for one operation
    console.log('Step 5: Sample parameters for "Message - Send" operation...');
    const sendParams = template.properties.filter(p =>
      p.condition?.property === 'operation_message' &&
      p.condition?.equals === 'send'
    );
    console.log(`✓ Send operation has ${sendParams.length} parameters:`);
    for (const param of sendParams.slice(0, 5)) {
      console.log(`  - ${param.label} (${param.type})${param.constraints?.notEmpty ? ' [required]' : ''}`);
    }
    if (sendParams.length > 5) {
      console.log(`  ... and ${sendParams.length - 5} more parameters`);
    }
    console.log();

    // 6. Save to file
    const outputPath = path.join(__dirname, 'test-output-gmail.element.json');
    fs.writeFileSync(outputPath, JSON.stringify(template, null, 2));
    console.log(`✓ Template saved to: ${outputPath}\n`);

    // 7. Verify payload structure
    console.log('Step 6: Verifying dynamic payload...');
    const payloadProp = template.properties.find(p => p.label === 'Payload');
    if (payloadProp) {
      const payload = JSON.parse(payloadProp.value);
      const payloadKeys = Object.keys(payload);
      console.log(`✓ Payload contains ${payloadKeys.length} keys`);
      console.log(`  Core keys: ${['resource', 'operation'].filter(k => payloadKeys.includes(k)).join(', ')}`);
      console.log(`  Parameter keys: ${payloadKeys.length - 2} parameters\n`);
    }

    console.log('✅ All tests passed successfully!\n');
    console.log('Next steps:');
    console.log('1. Import test-output-gmail.element.json into Camunda Modeler');
    console.log('2. Apply template to a Service Task');
    console.log('3. Verify resource dropdown shows: Draft, Label, Message, Thread');
    console.log('4. Verify operation dropdown changes based on resource selection');
    console.log('5. Verify parameter fields appear/disappear based on operation selection');

    return template;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function countOperations(schema) {
  return schema.resources.reduce((sum, r) => sum + r.operations.length, 0);
}

testElementTemplateGeneration();
