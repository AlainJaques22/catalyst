const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../../connectors/generated/communication/gmail/gmail.element.json');
const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

const withCond = template.properties.filter(p => p.condition);
const withoutCond = template.properties.filter(p => !p.condition && p.group === 'input');

console.log('Properties with conditions:', withCond.length);
console.log('  -', withCond.map(p => p.id || p.label).join(', '));
console.log('\nProperties without conditions (always visible):', withoutCond.length);
console.log('  -', withoutCond.map(p => p.id || p.label).join(', '));
console.log('\nTotal properties:', template.properties.length);
