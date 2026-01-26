import { type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { searchAccounts, searchLocations, searchPosts, searchReviews } from './GenericFunctions';
export declare class GoogleBusinessProfile implements INodeType {
    description: INodeTypeDescription;
    methods: {
        listSearch: {
            searchAccounts: typeof searchAccounts;
            searchLocations: typeof searchLocations;
            searchReviews: typeof searchReviews;
            searchPosts: typeof searchPosts;
        };
    };
}
//# sourceMappingURL=GoogleBusinessProfile.node.d.ts.map