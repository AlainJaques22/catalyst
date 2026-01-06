import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

const CONNECTORS_DIR = process.env.CONNECTORS_DIR || '/app/connectors';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class TemplateService {
  private cache: any[] | null = null;
  private cacheTime: number = 0;

  /**
   * Discover all element templates from connectors directory
   */
  async discoverTemplates(): Promise<any[]> {
    // Return cached templates if still valid
    if (this.cache && Date.now() - this.cacheTime < CACHE_TTL) {
      console.log('Returning cached element templates');
      return this.cache;
    }

    console.log('Discovering element templates from:', CONNECTORS_DIR);

    try {
      // Find all *.element.json files
      const pattern = path.join(CONNECTORS_DIR, '**', '*.element.json').replace(/\\/g, '/');
      const files = await glob(pattern);

      console.log(`Found ${files.length} element template files`);

      // Read and parse each template
      const templates = await Promise.all(
        files.map(async (filePath) => {
          try {
            const content = await fs.readFile(filePath, 'utf-8');
            const template = JSON.parse(content);
            console.log(`Loaded template: ${template.name || template.id}`);
            return template;
          } catch (error) {
            console.error(`Failed to parse template: ${filePath}`, error);
            return null;
          }
        })
      );

      // Filter out null values (failed parses)
      this.cache = templates.filter(t => t !== null);
      this.cacheTime = Date.now();

      console.log(`Successfully loaded ${this.cache.length} element templates`);
      return this.cache;
    } catch (error) {
      console.error('Error discovering templates:', error);
      throw new Error(`Failed to discover element templates: ${(error as Error).message}`);
    }
  }

  /**
   * Clear the template cache (useful for development/testing)
   */
  clearCache(): void {
    this.cache = null;
    this.cacheTime = 0;
    console.log('Template cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cached: this.cache !== null,
      count: this.cache?.length || 0,
      age: this.cache ? Date.now() - this.cacheTime : 0,
      ttl: CACHE_TTL
    };
  }
}
