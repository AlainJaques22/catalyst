import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import type { Readable } from 'stream';
export declare function prepareQueryString(fields: string[] | undefined): string;
export declare function getItemBinaryData(this: IExecuteFunctions, inputDataFieldName: string, i: number, chunkSize?: number): Promise<{
    contentLength: number;
    fileContent: Readable | Buffer<ArrayBufferLike>;
    originalFilename: string | undefined;
    mimeType: string | undefined;
}>;
export declare function setFileProperties(body: IDataObject, options: IDataObject): IDataObject;
export declare function setUpdateCommonParams(qs: IDataObject, options: IDataObject): IDataObject;
export declare function updateDriveScopes(qs: IDataObject, driveId: string, defaultDrive?: string): void;
export declare function setParentFolder(folderId: string, driveId: string, folderIdDefault?: string, driveIdDefault?: string): string;
export declare function processInChunks(stream: Readable, chunkSize: number, process: (chunk: Buffer, offset: number) => void | Promise<void>): Promise<void>;
//# sourceMappingURL=utils.d.ts.map