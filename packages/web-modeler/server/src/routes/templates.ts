import { Router } from 'express';
import { TemplateService } from '../services/templateService';

const router = Router();
const templateService = new TemplateService();

/**
 * GET /api/templates
 * Get all discovered element templates
 */
router.get('/templates', async (req, res, next) => {
  try {
    const templates = await templateService.discoverTemplates();
    res.json({ templates });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/templates/refresh
 * Clear cache and force re-discovery of templates
 */
router.post('/templates/refresh', async (req, res, next) => {
  try {
    templateService.clearCache();
    const templates = await templateService.discoverTemplates();
    res.json({
      success: true,
      templates,
      message: 'Templates refreshed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/templates/stats
 * Get template cache statistics
 */
router.get('/templates/stats', (req, res) => {
  const stats = templateService.getCacheStats();
  res.json(stats);
});

export default router;
