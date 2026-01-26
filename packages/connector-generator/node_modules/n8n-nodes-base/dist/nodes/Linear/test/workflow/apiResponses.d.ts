export declare const commentCreateResponse: {
    data: {
        commentCreate: {
            success: boolean;
            comment: {
                id: string;
            };
        };
    };
};
export declare const commentCreateWithParentResponse: {
    data: {
        commentCreate: {
            success: boolean;
            comment: {
                id: string;
            };
        };
    };
};
export declare const attachmentLinkURLResponse: {
    data: {
        attachmentLinkURL: {
            success: boolean;
        };
    };
};
export declare const issueCreateResponse: {
    data: {
        issueCreate: {
            success: boolean;
            issue: {
                id: string;
                identifier: string;
                title: string;
                priority: number;
                archivedAt: null;
                assignee: {
                    id: string;
                    displayName: string;
                };
                state: {
                    id: string;
                    name: string;
                };
                createdAt: string;
                creator: {
                    id: string;
                    displayName: string;
                };
                description: string;
                dueDate: null;
                cycle: null;
            };
        };
    };
};
export declare const getIssueResponse: {
    data: {
        issue: {
            id: string;
            identifier: string;
            title: string;
            priority: number;
            archivedAt: null;
            assignee: {
                id: string;
                displayName: string;
            };
            state: {
                id: string;
                name: string;
            };
            createdAt: string;
            creator: {
                id: string;
                displayName: string;
            };
            description: string;
            dueDate: null;
            cycle: null;
        };
    };
};
export declare const getManyIssueResponse: {
    data: {
        issues: {
            nodes: {
                id: string;
                identifier: string;
                title: string;
                priority: number;
                archivedAt: null;
                assignee: {
                    id: string;
                    displayName: string;
                };
                state: {
                    id: string;
                    name: string;
                };
                createdAt: string;
                creator: {
                    id: string;
                    displayName: string;
                };
                description: string;
                dueDate: null;
                cycle: null;
            }[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string;
            };
        };
    };
};
export declare const issueUpdateResponse: {
    data: {
        issueUpdate: {
            success: boolean;
            issue: {
                id: string;
                identifier: string;
                title: string;
                priority: number;
                archivedAt: null;
                assignee: {
                    id: string;
                    displayName: string;
                };
                state: {
                    id: string;
                    name: string;
                };
                createdAt: string;
                creator: {
                    id: string;
                    displayName: string;
                };
                description: string;
                dueDate: null;
                cycle: null;
            };
        };
    };
};
export declare const deleteIssueResponse: {
    data: {
        issueDelete: {
            success: boolean;
        };
    };
};
//# sourceMappingURL=apiResponses.d.ts.map