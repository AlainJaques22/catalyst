/**
 * Quick test script to verify n8n schema extraction works
 */

const { extractN8nNodeSchema } = require('./dist/extractors/n8n-schema-extractor');

async function testExtraction() {
  console.log('Testing Gmail node extraction...\n');

  try {
    const schema = await extractN8nNodeSchema('gmail');

    console.log('✓ Extraction successful!');
    console.log('\nExtracted Schema:');
    console.log('=================');
    console.log(`Node ID: ${schema.nodeId}`);
    console.log(`Display Name: ${schema.displayName}`);
    console.log(`Description: ${schema.description}`);
    console.log(`Icon: ${schema.icon}`);
    console.log(`Color: ${schema.color}`);
    console.log(`Credentials: ${schema.credentials.join(', ')}`);
    console.log(`Category: ${schema.category}`);
    console.log(`Tags: ${schema.tags.join(', ')}`);
    console.log(`\nResources (${schema.resources.length}):`);

    for (const resource of schema.resources) {
      console.log(`\n  ${resource.name} (${resource.value}):`);
      console.log(`    Operations: ${resource.operations.length}`);

      for (const operation of resource.operations) {
        console.log(`      - ${operation.name} (${operation.value})`);
        console.log(`        Description: ${operation.description}`);
        console.log(`        Tier: ${operation.tier}`);
        console.log(`        Parameters: ${operation.parameters.length}`);

        if (operation.parameters.length > 0 && operation.parameters.length <= 5) {
          for (const param of operation.parameters) {
            console.log(`          • ${param.displayName} (${param.name}): ${param.type}${param.required ? ' [required]' : ''}`);
          }
        }
      }
    }

    console.log('\n✓ Test completed successfully!');
    return schema;
  } catch (error) {
    console.error('✗ Extraction failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testExtraction();
