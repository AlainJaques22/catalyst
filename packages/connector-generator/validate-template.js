const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../../connectors/generated/communication/gmail/gmail.element.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

console.log('=== Template Validation ===\n');

// Check required fields
console.log('Schema:', template.$schema);
console.log('Name:', template.name);
console.log('ID:', template.id);
console.log('Version:', template.version);
console.log('AppliesTo:', template.appliesTo);
console.log('Properties count:', template.properties.length);
console.log('Groups:', template.groups.length);

// Check for properties with missing required fields
const invalidProps = template.properties.filter(p => !p.label || !p.type || !p.binding);
console.log('\nInvalid properties (missing label/type/binding):', invalidProps.length);

if (invalidProps.length > 0) {
  console.log('\nProperties with missing fields:');
  invalidProps.forEach(p => {
    console.log(' -', p.id || 'NO_ID', {
      hasLabel: !!p.label,
      hasType: !!p.type,
      hasBinding: !!p.binding
    });
  });
}

// Check for invalid condition types
const propsWithConditions = template.properties.filter(p => p.condition);
console.log('\nProperties with conditions:', propsWithConditions.length);

const invalidConditions = propsWithConditions.filter(p => {
  const c = p.condition;
  if (!c.property) return true;

  if (c.type === 'simple') {
    return c.equals === undefined;
  } else if (c.type === 'oneOf') {
    return !Array.isArray(c.oneOf) || c.oneOf.length === 0;
  }

  return false;
});

console.log('Invalid conditions:', invalidConditions.length);
if (invalidConditions.length > 0) {
  console.log('\nProperties with invalid conditions:');
  invalidConditions.forEach(p => {
    console.log(' -', p.id, JSON.stringify(p.condition, null, 2));
  });
}

// Check for duplicate property IDs
const ids = template.properties.filter(p => p.id).map(p => p.id);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
console.log('\nDuplicate property IDs:', duplicateIds.length);
if (duplicateIds.length > 0) {
  console.log('Duplicates:', [...new Set(duplicateIds)]);
}

// Check condition references
const propIds = new Set(template.properties.filter(p => p.id).map(p => p.id));
const invalidRefs = propsWithConditions.filter(p => !propIds.has(p.condition.property));
console.log('\nConditions referencing non-existent properties:', invalidRefs.length);
if (invalidRefs.length > 0) {
  console.log('Invalid refs:');
  invalidRefs.forEach(p => {
    console.log(' -', p.id, 'references', p.condition.property);
  });
}

console.log('\n=== Summary ===');
if (invalidProps.length === 0 && invalidConditions.length === 0 && duplicateIds.length === 0 && invalidRefs.length === 0) {
  console.log('✓ Template appears valid');
} else {
  console.log('✗ Template has validation errors');
  process.exit(1);
}
