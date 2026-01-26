import type { INodeProperties, IExecuteFunctions, IWebhookFunctions, IDataObject } from 'n8n-workflow';
import type { IEmail } from './interfaces';
export type SendAndWaitConfig = {
    title: string;
    message: string;
    options: Array<{
        label: string;
        url: string;
        style: string;
    }>;
    appendAttribution?: boolean;
};
export declare function getSendAndWaitProperties(targetProperties: INodeProperties[], resource?: string, additionalProperties?: INodeProperties[], options?: {
    noButtonStyle?: boolean;
    defaultApproveLabel?: string;
    defaultDisapproveLabel?: string;
}): {
    displayOptions: import("n8n-workflow").IDisplayOptions;
    displayName: string;
    name: string;
    type: import("n8n-workflow").NodePropertyTypes;
    typeOptions?: import("n8n-workflow").INodePropertyTypeOptions;
    default: import("n8n-workflow").NodeParameterValueType;
    description?: string;
    hint?: string;
    disabledOptions?: import("n8n-workflow").IDisplayOptions;
    options?: Array<import("n8n-workflow").INodePropertyOptions | INodeProperties | import("n8n-workflow").INodePropertyCollection>;
    placeholder?: string;
    isNodeSetting?: boolean;
    noDataExpression?: boolean;
    required?: boolean;
    routing?: import("n8n-workflow").INodePropertyRouting;
    credentialTypes?: Array<"extends:oAuth2Api" | "extends:oAuth1Api" | "has:authenticate" | "has:genericAuth">;
    extractValue?: import("n8n-workflow").INodePropertyValueExtractor;
    modes?: import("n8n-workflow").INodePropertyMode[];
    requiresDataPath?: "single" | "multiple";
    doNotInherit?: boolean;
    validateType?: import("n8n-workflow").FieldType;
    ignoreValidationDuringExecution?: boolean;
    allowArbitraryValues?: boolean;
}[];
export declare function sendAndWaitWebhook(this: IWebhookFunctions): Promise<{
    noWebhookResponse: boolean;
    webhookResponse?: undefined;
    workflowData?: undefined;
} | {
    webhookResponse: string;
    workflowData: {
        json: {
            data: {
                text: IDataObject | import("n8n-workflow").GenericValue | import("n8n-workflow").GenericValue[] | IDataObject[];
            };
        };
    }[][];
    noWebhookResponse?: undefined;
} | {
    webhookResponse: string;
    workflowData: import("n8n-workflow").INodeExecutionData[][];
    noWebhookResponse?: undefined;
} | {
    webhookResponse: string;
    workflowData: {
        json: {
            data: {
                approved: boolean;
            };
        };
    }[][];
    noWebhookResponse?: undefined;
}>;
export declare function getSendAndWaitConfig(context: IExecuteFunctions): SendAndWaitConfig;
export declare function createButton(url: string, label: string, style: string): string;
export declare function createEmail(context: IExecuteFunctions): IEmail;
export declare const SEND_AND_WAIT_WAITING_TOOLTIP: string;
//# sourceMappingURL=utils.d.ts.map