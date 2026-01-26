import type { INodeExecutionData, IPairedItemData, IRunExecutionData, ITaskData } from 'n8n-workflow';
/**
 * This function retrieves the previous task data for a given task in the workflow run data.
 * Until there is no more source set
 */
export declare function previousTaskData(runData: IRunExecutionData['resultData']['runData'], currentRunData: ITaskData): ITaskData | undefined;
export declare function findPairedItemThroughWorkflowData(workflowRunData: IRunExecutionData, item: INodeExecutionData, itemIndex: number): IPairedItemData | IPairedItemData[] | number | undefined;
//# sourceMappingURL=workflow-backtracking.d.ts.map