const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const https = require('https');

const templatePath = path.join(__dirname, '../../connectors/generated/communication/gmail/gmail.element.json');

// Download and validate against official schema
const schemaUrl = 'https://unpkg.com/@camunda/element-templates-json-schema@0.15.0/resources/schema.json';

console.log('Downloading Camunda element template schema...');

https.get(schemaUrl, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const schema = JSON.parse(data);
      const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

      const ajv = new Ajv({ allErrors: true, strict: false });
      const validate = ajv.compile(schema);
      const valid = validate(template);

      if (valid) {
        console.log('✓ Template is valid according to Camunda schema');
      } else {
        console.log('✗ Template validation errors:');
        console.log(JSON.stringify(validate.errors, null, 2));
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  });
}).on('error', (err) => {
  console.error('Failed to download schema:', err.message);
  console.log('\nTrying local validation...');

  // Fallback to manual checks
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

  // Check for common issues
  console.log('\nManual validation checks:');

  // Check all properties have required fields
  template.properties.forEach((prop, i) => {
    if (!prop.binding || !prop.binding.type || !prop.binding.name) {
      console.log(`✗ Property ${i} (${prop.id || prop.label}) has invalid binding:`, prop.binding);
    }

    if (prop.choices && !Array.isArray(prop.choices)) {
      console.log(`✗ Property ${i} (${prop.id}) has invalid choices:`, typeof prop.choices);
    }

    if (prop.condition) {
      if (!prop.condition.property) {
        console.log(`✗ Property ${i} (${prop.id}) condition missing 'property' field`);
      }

      if (prop.condition.type === 'simple' && prop.condition.equals === undefined) {
        console.log(`✗ Property ${i} (${prop.id}) simple condition missing 'equals' field`);
      }

      if (prop.condition.type === 'oneOf' && (!Array.isArray(prop.condition.oneOf) || prop.condition.oneOf.length === 0)) {
        console.log(`✗ Property ${i} (${prop.id}) oneOf condition invalid`);
      }
    }
  });

  console.log('\nManual validation complete');
});
