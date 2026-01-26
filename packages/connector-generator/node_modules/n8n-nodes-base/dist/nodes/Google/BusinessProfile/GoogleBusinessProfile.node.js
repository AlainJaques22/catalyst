"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleBusinessProfile = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const PostDescription_1 = require("./PostDescription");
const ReviewDescription_1 = require("./ReviewDescription");
class GoogleBusinessProfile {
    description = {
        displayName: 'Google Business Profile',
        name: 'googleBusinessProfile',
        icon: 'file:googleBusinessProfile.svg',
        group: ['input'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Google Business Profile API',
        defaults: {
            name: 'Google Business Profile',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        hints: [
            {
                message: 'Please select a parameter in the options to modify the post',
                displayCondition: '={{$parameter["resource"] === "post" && $parameter["operation"] === "update" && Object.keys($parameter["additionalOptions"]).length === 0}}',
                whenToDisplay: 'always',
                location: 'outputPane',
                type: 'warning',
            },
        ],
        credentials: [
            {
                name: 'googleBusinessProfileOAuth2Api',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://mybusiness.googleapis.com/v4',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Post',
                        value: 'post',
                    },
                    {
                        name: 'Review',
                        value: 'review',
                    },
                ],
                default: 'post',
            },
            ...PostDescription_1.postOperations,
            ...PostDescription_1.postFields,
            ...ReviewDescription_1.reviewOperations,
            ...ReviewDescription_1.reviewFields,
        ],
    };
    methods = {
        listSearch: {
            searchAccounts: GenericFunctions_1.searchAccounts,
            searchLocations: GenericFunctions_1.searchLocations,
            searchReviews: GenericFunctions_1.searchReviews,
            searchPosts: GenericFunctions_1.searchPosts,
        },
    };
}
exports.GoogleBusinessProfile = GoogleBusinessProfile;
//# sourceMappingURL=GoogleBusinessProfile.node.js.map