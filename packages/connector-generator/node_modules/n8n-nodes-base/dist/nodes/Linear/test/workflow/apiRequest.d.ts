export declare const addCommentRequest: {
    query: string;
    variables: {
        issueId: string;
        body: string;
    };
};
export declare const addCommentWithParentRequest: {
    query: string;
    variables: {
        issueId: string;
        body: string;
        parentId: string;
    };
};
export declare const addCommentLink: {
    query: string;
    variables: {
        issueId: string;
        url: string;
    };
};
export declare const issueCreateRequest: {
    query: string;
    variables: {
        teamId: string;
        title: string;
        assigneeId: string;
        description: string;
        priorityId: number;
        stateId: string;
    };
};
export declare const getIssueRequest: {
    query: string;
    variables: {
        issueId: string;
    };
};
export declare const getManyIssuesRequest: {
    query: string;
    variables: {
        first: number;
        after: null;
    };
};
export declare const updateIssueRequest: {
    query: string;
    variables: {
        issueId: string;
        assigneeId: string;
        description: string;
        priorityId: number;
        stateId: string;
        teamId: string;
        title: string;
    };
};
export declare const deleteIssueRequest: {
    query: string;
    variables: {
        issueId: string;
    };
};
//# sourceMappingURL=apiRequest.d.ts.map