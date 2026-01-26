import type { IExecuteFunctions } from 'n8n-workflow';
import type { Readable } from 'stream';
/**
 * Enhanced binary to string conversion for better handling of non-UTF-8 content
 */
export declare function binaryToStringWithEncodingDetection(body: Buffer | Readable, contentType: string, helpers: IExecuteFunctions['helpers']): Promise<string>;
//# sourceMappingURL=buffer-decoding.d.ts.map