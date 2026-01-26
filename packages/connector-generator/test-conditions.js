const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../../connectors/generated/communication/gmail/gmail.element.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

// Test what would be visible for "message:send"
const testOperation = 'message:send';

console.log(`Testing visibility for operation: ${testOperation}\n`);

// Properties that would be visible
const visibleProps = template.properties.filter(p => {
  if (!p.condition) return true; // No condition = always visible
  if (p.condition.equals === testOperation) return true;
  return false;
});

console.log(`Visible properties: ${visibleProps.length}`);

// Group by group
const byGroup = {};
visibleProps.forEach(p => {
  const group = p.group || 'no-group';
  if (!byGroup[group]) byGroup[group] = [];
  byGroup[group].push(p.label);
});

console.log('\nGrouped by group:');
for (const [group, props] of Object.entries(byGroup)) {
  const groupInfo = template.groups.find(g => g.id === group);
  console.log(`\n${groupInfo?.label || group}:`);
  props.forEach(label => console.log(`  - ${label}`));
}

// Check if any properties are missing conditions
const noCondition = template.properties.filter(p => !p.condition && p.group && p.group.startsWith('group-'));
if (noCondition.length > 0) {
  console.log('\n⚠ Properties without conditions in operation groups:');
  noCondition.forEach(p => console.log(`  - ${p.label} in ${p.group}`));
}

// Check for duplicate properties
const propsById = {};
template.properties.forEach(p => {
  if (p.id) {
    if (propsById[p.id]) {
      console.log(`\n⚠ Duplicate property ID: ${p.id}`);
    }
    propsById[p.id] = true;
  }
});
