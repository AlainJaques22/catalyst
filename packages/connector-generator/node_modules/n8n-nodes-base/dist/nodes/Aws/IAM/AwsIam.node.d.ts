import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { searchGroups, searchUsers, searchGroupsForUser } from './methods/listSearch';
export declare class AwsIam implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            searchGroups: typeof searchGroups;
            searchUsers: typeof searchUsers;
            searchGroupsForUser: typeof searchGroupsForUser;
        };
    };
}
//# sourceMappingURL=AwsIam.node.d.ts.map