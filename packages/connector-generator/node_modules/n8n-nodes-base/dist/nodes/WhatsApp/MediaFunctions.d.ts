import FormData from 'form-data';
import type { IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
export declare function getUploadFormData(this: IExecuteSingleFunctions): Promise<{
    fileName: string;
    formData: FormData;
}>;
export declare function setupUpload(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions>;
//# sourceMappingURL=MediaFunctions.d.ts.map