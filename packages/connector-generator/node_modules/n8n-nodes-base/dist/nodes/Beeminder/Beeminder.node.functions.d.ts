import type { IExecuteFunctions, ILoadOptionsFunctions, IHookFunctions, IWebhookFunctions } from 'n8n-workflow';
export interface Datapoint {
    timestamp: number;
    value: number;
    comment?: string;
    requestid?: string;
    daystamp?: string;
}
export declare function createDatapoint(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    value: number;
    timestamp?: number;
    comment?: string;
    requestid?: string;
}): Promise<any>;
export declare function getAllDatapoints(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    count?: number;
    sort?: string;
    page?: number;
    per?: number;
}): Promise<any>;
export declare function updateDatapoint(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    datapointId: string;
    value?: number;
    comment?: string;
    timestamp?: number;
}): Promise<any>;
export declare function deleteDatapoint(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    datapointId: string;
}): Promise<any>;
export declare function createCharge(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    amount: number;
    note?: string;
    dryrun?: boolean;
}): Promise<any>;
export declare function uncleGoal(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
}): Promise<any>;
export declare function createAllDatapoints(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    datapoints: Datapoint[];
}): Promise<any>;
export declare function getSingleDatapoint(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    datapointId: string;
}): Promise<any>;
export declare function getGoal(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    datapoints?: boolean;
    emaciated?: boolean;
}): Promise<any>;
export declare function getAllGoals(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, data?: {
    emaciated?: boolean;
}): Promise<any>;
export declare function getArchivedGoals(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, data?: {
    emaciated?: boolean;
}): Promise<any>;
export declare function createGoal(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    slug: string;
    title: string;
    goal_type: string;
    gunits: string;
    goaldate?: number;
    goalval?: number;
    rate?: number;
    initval?: number;
    secret?: boolean;
    datapublic?: boolean;
    datasource?: string;
    dryrun?: boolean;
    tags?: string[];
}): Promise<any>;
export declare function updateGoal(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
    title?: string;
    yaxis?: string;
    tmin?: string;
    tmax?: string;
    secret?: boolean;
    datapublic?: boolean;
    roadall?: object;
    datasource?: string;
    tags?: string[];
}): Promise<any>;
export declare function refreshGoal(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
}): Promise<any>;
export declare function shortCircuitGoal(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
}): Promise<any>;
export declare function stepDownGoal(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
}): Promise<any>;
export declare function cancelStepDownGoal(this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    goalName: string;
}): Promise<any>;
export declare function getUser(this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions, data: {
    associations?: boolean;
    diff_since?: number;
    skinny?: boolean;
    emaciated?: boolean;
    datapoints_count?: number;
}): Promise<any>;
//# sourceMappingURL=Beeminder.node.functions.d.ts.map