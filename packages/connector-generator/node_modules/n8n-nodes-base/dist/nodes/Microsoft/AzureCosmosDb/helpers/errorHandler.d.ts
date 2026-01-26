import type { IExecuteSingleFunctions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';
export declare const ErrorMap: {
    Container: {
        Conflict: {
            getMessage: (id: string) => string;
            description: string;
        };
        NotFound: {
            getMessage: (id: string) => string;
            description: string;
        };
    };
    Item: {
        NotFound: {
            getMessage: (id: string) => string;
            description: string;
        };
    };
};
export declare function handleError(this: IExecuteSingleFunctions, data: INodeExecutionData[], response: IN8nHttpFullResponse): Promise<INodeExecutionData[]>;
//# sourceMappingURL=errorHandler.d.ts.map