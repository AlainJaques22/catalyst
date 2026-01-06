import axios from 'axios';
import FormData from 'form-data';

const CAMUNDA_API_URL = process.env.CAMUNDA_API_URL || 'http://catalyst-camunda:8080/engine-rest';

export interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  deploymentName: string;
  deploymentTime: string;
  deployedProcessDefinitions: string[];
}

export class CamundaService {
  /**
   * Deploy BPMN XML to Camunda 7
   */
  async deploy(filename: string, xml: string): Promise<DeploymentResult> {
    const form = new FormData();

    // Add deployment metadata
    const deploymentName = `modeler-${Date.now()}`;
    form.append('deployment-name', deploymentName);
    form.append('deployment-source', 'catalyst-modeler');
    form.append('enable-duplicate-filtering', 'false');
    form.append('deploy-changed-only', 'false');

    // Add BPMN file
    form.append(filename, Buffer.from(xml, 'utf-8'), {
      filename,
      contentType: 'text/xml'
    });

    try {
      console.log(`Deploying BPMN to Camunda: ${CAMUNDA_API_URL}/deployment/create`);

      const response = await axios.post(
        `${CAMUNDA_API_URL}/deployment/create`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 30000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity
        }
      );

      console.log('Deployment successful:', response.data);

      return {
        success: true,
        deploymentId: response.data.id,
        deploymentName: response.data.name,
        deploymentTime: response.data.deploymentTime,
        deployedProcessDefinitions: Object.keys(response.data.deployedProcessDefinitions || {})
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const message = error.response.data?.message || 'Invalid BPMN XML';
          throw new Error(`Invalid BPMN: ${message}`);
        } else if (error.code === 'ECONNREFUSED') {
          throw new Error('Camunda service unavailable. Is the service running?');
        } else if (error.code === 'ETIMEDOUT') {
          throw new Error('Deployment timed out. Camunda may be slow or unavailable.');
        } else {
          const status = error.response?.status || 'unknown';
          const message = error.response?.data?.message || error.message;
          throw new Error(`Deployment failed (HTTP ${status}): ${message}`);
        }
      }
      throw new Error(`Deployment failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get list of deployments from Camunda
   */
  async getDeployments(limit: number = 10) {
    try {
      const response = await axios.get(`${CAMUNDA_API_URL}/deployment`, {
        params: {
          sortBy: 'deploymentTime',
          sortOrder: 'desc',
          maxResults: limit
        },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching deployments:', error);
      throw new Error('Failed to fetch deployments from Camunda');
    }
  }

  /**
   * Check if Camunda is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${CAMUNDA_API_URL}/version`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}
