import type { IExecuteFunctions, ILoadOptionsFunctions, INodeListSearchItems } from 'n8n-workflow';
export declare function prepareMessage(this: IExecuteFunctions | ILoadOptionsFunctions, message: string, contentType: string, includeLinkToWorkflow: boolean, instanceId?: string): {
    body: {
        contentType: string;
        content: string;
    };
};
export declare function filterSortSearchListItems(items: INodeListSearchItems[], filter?: string): INodeListSearchItems[];
//# sourceMappingURL=utils.d.ts.map