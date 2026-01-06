import fs from 'fs/promises';
import path from 'path';

const BPMN_DIR = process.env.BPMN_DIR || '/app/bpmn-files';

export interface FileMetadata {
  name: string;
  size: number;
  modified: string;
}

export class FileService {
  /**
   * List all BPMN files in the directory
   */
  async listFiles(): Promise<FileMetadata[]> {
    await this.ensureDirectory();

    const files = await fs.readdir(BPMN_DIR);
    const bpmnFiles = files.filter(f => f.endsWith('.bpmn'));

    return Promise.all(bpmnFiles.map(async (name) => {
      const stat = await fs.stat(path.join(BPMN_DIR, name));
      return {
        name,
        size: stat.size,
        modified: stat.mtime.toISOString()
      };
    }));
  }

  /**
   * Read a BPMN file by name
   */
  async readFile(filename: string): Promise<string> {
    this.validateFilename(filename);
    const filePath = path.join(BPMN_DIR, filename);

    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * Save or update a BPMN file
   */
  async saveFile(filename: string, xml: string): Promise<void> {
    this.validateFilename(filename);
    this.validateXmlContent(xml);
    await this.ensureDirectory();

    const filePath = path.join(BPMN_DIR, filename);
    await fs.writeFile(filePath, xml, 'utf-8');
  }

  /**
   * Delete a BPMN file
   */
  async deleteFile(filename: string): Promise<void> {
    this.validateFilename(filename);
    const filePath = path.join(BPMN_DIR, filename);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * Validate filename for security (prevent path traversal)
   */
  private validateFilename(filename: string): void {
    // Check for required extension
    if (!filename.endsWith('.bpmn')) {
      throw new Error('Only .bpmn files are allowed');
    }

    // Check for path traversal attempts
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename: path traversal detected');
    }

    // Check for null bytes
    if (filename.includes('\0')) {
      throw new Error('Invalid filename: null byte detected');
    }

    // Check length
    if (filename.length > 255) {
      throw new Error('Filename too long (max 255 characters)');
    }

    // Check for empty filename
    if (filename.trim().length === 0) {
      throw new Error('Filename cannot be empty');
    }
  }

  /**
   * Validate XML content (basic checks)
   */
  private validateXmlContent(xml: string): void {
    if (!xml || xml.trim().length === 0) {
      throw new Error('XML content cannot be empty');
    }

    // Check file size (10MB limit)
    const sizeInBytes = Buffer.byteLength(xml, 'utf-8');
    if (sizeInBytes > 10 * 1024 * 1024) {
      throw new Error('File too large (max 10MB)');
    }

    // Basic XML validation
    if (!xml.includes('<?xml')) {
      throw new Error('Invalid XML: missing XML declaration');
    }

    if (!xml.includes('bpmn')) {
      throw new Error('Invalid BPMN: missing BPMN namespace');
    }
  }

  /**
   * Ensure the BPMN directory exists
   */
  private async ensureDirectory(): Promise<void> {
    try {
      await fs.access(BPMN_DIR);
    } catch {
      await fs.mkdir(BPMN_DIR, { recursive: true });
    }
  }
}
