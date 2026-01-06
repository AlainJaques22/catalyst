import axios from 'axios';

const api = axios.create({
  baseURL: '/modeler/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface FileMetadata {
  name: string;
  size: number;
  modified: string;
}

export interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  deploymentName: string;
  deploymentTime: string;
  deployedProcessDefinitions: string[];
}

// File operations
export const getFiles = () => api.get<{ files: FileMetadata[] }>('/files');

export const getFile = (name: string) =>
  api.get<{ name: string; xml: string }>(`/files/${name}`);

export const saveFile = (name: string, xml: string) =>
  api.post<{ success: boolean; name: string }>('/files', { name, xml });

export const deleteFile = (name: string) =>
  api.delete<{ success: boolean }>(`/files/${name}`);

// Template operations
export const getElementTemplates = () =>
  api.get<{ templates: any[] }>('/templates');

export const refreshTemplates = () =>
  api.post<{ success: boolean; templates: any[] }>('/templates/refresh');

// Deployment operations
export const deployToCamunda = (name: string, xml: string) =>
  api.post<DeploymentResult>('/deploy', { name, xml });

export const getDeployments = (limit: number = 10) =>
  api.get<{ deployments: any[] }>('/deployments', { params: { limit } });

export const checkCamundaHealth = () =>
  api.get<{ healthy: boolean }>('/health/camunda');
