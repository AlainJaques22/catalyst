import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { getUsers } from './UserFunctions';
export declare class Okta implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            getUsers: typeof getUsers;
        };
    };
}
//# sourceMappingURL=Okta.node.d.ts.map