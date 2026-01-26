import { type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { searchWorkflows } from './WorkflowLocator';
/**
 * The n8n node provides access to the n8n API.
 *
 * See: https://docs.n8n.io/api/api-reference/
 */
export declare class N8n implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            searchWorkflows: typeof searchWorkflows;
        };
    };
}
//# sourceMappingURL=N8n.node.d.ts.map