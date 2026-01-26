/**
 * Audit all generated connectors for correctness
 */

import * as fs from 'fs';
import * as path from 'path';

interface AuditIssue {
  connector: string;
  file: string;
  severity: 'error' | 'warning';
  message: string;
}

const issues: AuditIssue[] = [];

function auditConnector(connectorPath: string, connectorName: string) {
  const elementTemplatePath = path.join(connectorPath, `${connectorName}.element.json`);

  if (!fs.existsSync(elementTemplatePath)) {
    issues.push({
      connector: connectorName,
      file: elementTemplatePath,
      severity: 'error',
      message: 'Element template file not found'
    });
    return;
  }

  const template = JSON.parse(fs.readFileSync(elementTemplatePath, 'utf-8'));
  const properties = template.properties || [];

  // Check for descriptions
  properties.forEach((prop: any) => {
    if (prop.group === 'input' && !prop.description && prop.label !== 'Implementation') {
      issues.push({
        connector: connectorName,
        file: elementTemplatePath,
        severity: 'warning',
        message: `Property "${prop.label}" missing description`
      });
    }
  });

  // Check for proper field names
  properties.forEach((prop: any) => {
    if (prop.binding?.name === 'messageId' && prop.label && !prop.label.includes('Message ID')) {
      issues.push({
        connector: connectorName,
        file: elementTemplatePath,
        severity: 'warning',
        message: `Property has binding "messageId" but label is "${prop.label}"`
      });
    }
  });
}

// Audit all connectors
const connectorsBasePath = path.join(__dirname, '../../../connectors/generated/communication/gmail');
const connectorDirs = fs.readdirSync(connectorsBasePath).filter(f => {
  const fullPath = path.join(connectorsBasePath, f);
  return fs.statSync(fullPath).isDirectory() && !f.startsWith('_');
});

console.log(`Auditing ${connectorDirs.length} connectors...\n`);

connectorDirs.forEach(dir => {
  const connectorPath = path.join(connectorsBasePath, dir);
  const files = fs.readdirSync(connectorPath);
  const elementFile = files.find(f => f.endsWith('.element.json'));

  if (elementFile) {
    const connectorName = elementFile.replace('.element.json', '');
    auditConnector(connectorPath, connectorName);
  }
});

// Report issues
if (issues.length === 0) {
  console.log('✅ No issues found!');
} else {
  console.log(`Found ${issues.length} issues:\n`);

  issues.forEach(issue => {
    const icon = issue.severity === 'error' ? '❌' : '⚠️';
    console.log(`${icon} [${issue.severity.toUpperCase()}] ${issue.connector}`);
    console.log(`   ${issue.message}\n`);
  });
}
