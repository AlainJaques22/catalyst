import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { listSearch, resourceMapping } from './methods';
export declare class MicrosoftSharePoint implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: typeof listSearch;
        resourceMapping: typeof resourceMapping;
    };
}
//# sourceMappingURL=MicrosoftSharePoint.node.d.ts.map