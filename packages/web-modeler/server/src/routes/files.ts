import { Router } from 'express';
import { FileService } from '../services/fileService';

const router = Router();
const fileService = new FileService();

/**
 * GET /api/files
 * List all BPMN files
 */
router.get('/files', async (req, res, next) => {
  try {
    const files = await fileService.listFiles();
    res.json({ files });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/files/:filename
 * Get BPMN file content
 */
router.get('/files/:filename', async (req, res, next) => {
  try {
    const xml = await fileService.readFile(req.params.filename);
    res.json({
      name: req.params.filename,
      xml
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/files
 * Create or update BPMN file
 * Body: { name: string, xml: string }
 */
router.post('/files', async (req, res, next) => {
  try {
    const { name, xml } = req.body;

    if (!name || !xml) {
      return res.status(400).json({
        error: 'Missing required fields: name and xml'
      });
    }

    await fileService.saveFile(name, xml);
    res.json({
      success: true,
      name,
      message: 'File saved successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/files/:filename
 * Delete BPMN file
 */
router.delete('/files/:filename', async (req, res, next) => {
  try {
    await fileService.deleteFile(req.params.filename);
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
