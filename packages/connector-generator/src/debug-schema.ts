/**
 * Debug script to see extracted Gmail schema
 */

import { extractN8nNodeSchema } from './extractors/n8n-schema-extractor';

async function main() {
  try {
    const schema = await extractN8nNodeSchema('gmail');

    console.log('=== GMAIL SCHEMA ===\n');
    console.log(`Node: ${schema.nodeId}`);
    console.log(`Resources: ${schema.resources.length}\n`);

    schema.resources.forEach(resource => {
      console.log(`\n=== ${resource.name.toUpperCase()} ===`);
      console.log(`Operations: ${resource.operations.length}\n`);

      resource.operations.forEach(op => {
        console.log(`\n--- ${op.name} (${op.value}) ---`);
        console.log(`Description: ${op.description || '(none)'}`);
        console.log(`Parameters: ${op.parameters.length}`);

        op.parameters.forEach((param: any) => {
          console.log(`  - ${param.name} (${param.displayName})`);
          console.log(`    Type: ${param.type}`);
          console.log(`    Required: ${param.required}`);
          console.log(`    Description: ${param.description || '(MISSING)'}`);
          if (param.options) {
            console.log(`    Options: ${param.options.length} choices`);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
