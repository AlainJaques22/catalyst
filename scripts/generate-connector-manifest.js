const fs = require('fs');
const path = require('path');

const CONNECTORS_DIR = path.join(__dirname, '../connectors');
const OUTPUT_FILE = path.join(__dirname, '../packages/control-panel/connectors-manifest.json');

function scanDirectory(baseDir, type) {
  const connectors = [];
  const categoriesPath = path.join(CONNECTORS_DIR, baseDir);

  if (!fs.existsSync(categoriesPath)) {
    console.warn(`Directory not found: ${categoriesPath}`);
    return connectors;
  }

  // Get all category folders
  const categories = fs.readdirSync(categoriesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  categories.forEach(category => {
    const categoryPath = path.join(categoriesPath, category);

    // Get all connector folders in this category
    const connectorFolders = fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    connectorFolders.forEach(connectorFolder => {
      const connectorPath = path.join(categoryPath, connectorFolder);
      const metadataPath = path.join(connectorPath, 'connector.json');

      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

          // Validate required fields
          if (!metadata.id || !metadata.name || !metadata.description) {
            console.warn(`⚠ Skipping invalid connector (missing required fields): ${connectorFolder}`);
            return;
          }

          // Add path information
          metadata.path = `connectors/${baseDir}/${category}/${connectorFolder}`;
          metadata.type = type;
          metadata.category = category; // Ensure category matches folder

          connectors.push(metadata);
          console.log(`  ✓ ${metadata.name} (${category})`);
        } catch (error) {
          console.error(`⚠ Error parsing connector.json in ${connectorFolder}:`, error.message);
        }
      } else {
        console.warn(`⚠ No connector.json found in ${connectorFolder}`);
      }
    });
  });

  return connectors;
}

function generateManifest() {
  console.log('🔨 Generating connector manifest...\n');

  console.log('Scanning integrations:');
  const integrations = scanDirectory('integrations', 'integration');

  console.log('\nScanning templates:');
  const templates = scanDirectory('templates', 'template');

  console.log('\nScanning generated connectors:');
  const generated = scanDirectory('generated', 'integration');

  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    stats: {
      totalConnectors: integrations.length + templates.length + generated.length,
      integrations: integrations.length,
      templates: templates.length,
      generated: generated.length
    },
    connectors: {
      integrations,
      templates,
      generated
    }
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

  console.log(`\n✅ Generated manifest with ${manifest.stats.totalConnectors} connectors`);
  console.log(`   - ${integrations.length} integrations`);
  console.log(`   - ${templates.length} templates`);
  console.log(`   - ${generated.length} generated`);
  console.log(`   → ${OUTPUT_FILE}`);
}

// Run the generator
try {
  generateManifest();
} catch (error) {
  console.error('❌ Error generating manifest:', error);
  process.exit(1);
}
