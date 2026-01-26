import type { FieldValueOption, IWorkflowNodeContext, INodeExecutionData, ILocalLoadOptionsFunctions, WorkflowInputsData, IExecuteFunctions, ISupplyDataFunctions } from 'n8n-workflow';
export declare function getFieldEntries(context: IWorkflowNodeContext): {
    dataMode: WorkflowInputsData['dataMode'];
    fields: FieldValueOption[];
    subworkflowInfo?: WorkflowInputsData['subworkflowInfo'];
};
export declare function getWorkflowInputValues(this: IExecuteFunctions | ISupplyDataFunctions): INodeExecutionData[];
export declare function getCurrentWorkflowInputData(this: IExecuteFunctions | ISupplyDataFunctions): INodeExecutionData[];
export declare function loadWorkflowInputMappings(this: ILocalLoadOptionsFunctions): Promise<WorkflowInputsData>;
//# sourceMappingURL=GenericFunctions.d.ts.map