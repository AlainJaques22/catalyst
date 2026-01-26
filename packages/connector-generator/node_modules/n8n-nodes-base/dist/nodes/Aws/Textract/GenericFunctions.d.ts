import type { ICredentialDataDecryptedObject, ICredentialTestFunctions, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, IHttpRequestMethods } from 'n8n-workflow';
export declare function awsApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, service: string, method: IHttpRequestMethods, path: string, body?: string, headers?: object): Promise<any>;
export declare function awsApiRequestREST(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, service: string, method: IHttpRequestMethods, path: string, body?: string, headers?: object): Promise<any>;
export declare function awsApiRequestSOAP(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, service: string, method: IHttpRequestMethods, path: string, body?: string, headers?: object): Promise<any>;
export declare function simplify(data: IExpenseDocument): {
    [key: string]: string;
};
export interface IExpenseDocument {
    ExpenseDocuments: [
        {
            SummaryFields: [
                {
                    LabelDetection: {
                        Text: string;
                    };
                    ValueDetection: {
                        Text: string;
                    };
                    Type: {
                        Text: string;
                    };
                }
            ];
        }
    ];
}
export declare function validateCredentials(this: ICredentialTestFunctions, decryptedCredentials: ICredentialDataDecryptedObject, service: string): Promise<any>;
//# sourceMappingURL=GenericFunctions.d.ts.map