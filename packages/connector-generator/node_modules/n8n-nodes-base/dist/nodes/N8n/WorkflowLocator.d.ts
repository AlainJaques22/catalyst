import type { ILoadOptionsFunctions, INodeListSearchResult, INodeProperties } from 'n8n-workflow';
/**
 * A helper to populate workflow lists. It does a pseudo-search by
 * listing available workflows and matching with the specified query.
 */
export declare function searchWorkflows(this: ILoadOptionsFunctions, query?: string): Promise<INodeListSearchResult>;
/**
 * A resourceLocator to enable looking up workflows by their ID.
 * This object can be used as a base and then extended as needed.
 */
export declare const workflowIdLocator: INodeProperties;
//# sourceMappingURL=WorkflowLocator.d.ts.map