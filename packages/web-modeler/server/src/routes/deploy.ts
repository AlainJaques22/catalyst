import { Router } from 'express';
import { CamundaService } from '../services/camundaService';

const router = Router();
const camundaService = new CamundaService();

/**
 * POST /api/deploy
 * Deploy BPMN XML to Camunda
 * Body: { name: string, xml: string }
 */
router.post('/deploy', async (req, res, next) => {
  try {
    const { name, xml } = req.body;

    if (!name || !xml) {
      return res.status(400).json({
        error: 'Missing required fields: name and xml'
      });
    }

    const result = await camundaService.deploy(name, xml);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/deployments
 * Get list of recent deployments from Camunda
 */
router.get('/deployments', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const deployments = await camundaService.getDeployments(limit);
    res.json({ deployments });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/health/camunda
 * Check if Camunda is available
 */
router.get('/health/camunda', async (req, res) => {
  const isHealthy = await camundaService.healthCheck();
  res.status(isHealthy ? 200 : 503).json({
    healthy: isHealthy,
    service: 'camunda'
  });
});

export default router;
