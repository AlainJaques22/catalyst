import type { IExecuteFunctions } from 'n8n-workflow';
import type { IAirtopFileInputRequest, IAirtopResponseWithFiles } from '../../transport/types';
/**
 * Fetches all files from the Airtop API using pagination
 * @param this - The execution context providing access to n8n functionality
 * @param sessionIds - Comma-separated string of session IDs to filter files by
 * @returns Promise resolving to a response object containing the complete array of files
 */
export declare function requestAllFiles(this: IExecuteFunctions, sessionIds: string): Promise<IAirtopResponseWithFiles>;
/**
 * Polls the Airtop API until a file reaches "available" status or times out
 * @param this - The execution context providing access to n8n functionality
 * @param fileId - The unique identifier of the file to poll
 * @param timeout - Maximum time in milliseconds to wait before failing (defaults to OPERATION_TIMEOUT)
 * @param intervalSeconds - Time in seconds to wait between polling attempts (defaults to 1)
 * @returns Promise resolving to the file ID when the file is available
 * @throws NodeApiError if the operation times out or API request fails
 */
export declare function pollFileUntilAvailable(this: IExecuteFunctions, fileId: string, timeout?: number, intervalSeconds?: number): Promise<string>;
/**
 * Creates a file entry in Airtop, uploads the file content, and waits until processing completes
 * @param this - The execution context providing access to n8n functionality
 * @param fileName - Name to assign to the uploaded file
 * @param fileBuffer - Buffer containing the binary file data to upload
 * @param fileType - Classification of the file in Airtop (e.g., 'customer_upload')
 * @param pollingFunction - Function to use for checking file availability (defaults to pollFileUntilAvailable)
 * @returns Promise resolving to the file ID once upload is complete and file is available
 * @throws NodeApiError if file creation, upload, or polling fails
 */
export declare function createAndUploadFile(this: IExecuteFunctions, fileName: string, fileBuffer: Buffer, fileType: string, pollingFunction?: typeof pollFileUntilAvailable): Promise<string>;
/**
 * Waits for a file to be ready in a session by polling file's information
 * @param this - The execution context providing access to n8n functionality
 * @param sessionId - ID of the session to check for file availability
 * @param fileId - ID of the file
 * @param timeout - Maximum time in milliseconds to wait before failing (defaults to OPERATION_TIMEOUT)
 * @returns Promise that resolves when a file in the session becomes available
 * @throws NodeApiError if the timeout is reached before a file becomes available
 */
export declare function waitForFileInSession(this: IExecuteFunctions, sessionId: string, fileId: string, timeout?: number): Promise<void>;
/**
 * Associates a file with a session and waits until the file is ready for use
 * @param this - The execution context providing access to n8n functionality
 * @param fileId - ID of the file to associate with the session
 * @param sessionId - ID of the session to add the file to
 * @param pollingFunction - Function to use for checking file availability in session (defaults to waitForFileInSession)
 * @returns Promise that resolves when the file is ready for use in the session
 */
export declare function pushFileToSession(this: IExecuteFunctions, fileId: string, sessionId: string, pollingFunction?: typeof waitForFileInSession): Promise<void>;
/**
 * Activates a file upload input in a specific window within a session
 * @param this - The execution context providing access to n8n functionality
 * @param fileId - ID of the file to use for the input
 * @param windowId - ID of the window where the file input will be triggered
 * @param sessionId - ID of the session containing the window
 * @returns Promise that resolves when the file input has been triggered
 */
export declare function triggerFileInput(this: IExecuteFunctions, request: IAirtopFileInputRequest): Promise<void>;
/**
 * Creates a file Buffer from either a URL or binary data
 * This function supports two source types:
 * - URL: Downloads the file from the specified URL and returns it as a Buffer
 * - Binary: Retrieves binary data from the workflow's binary data storage
 *
 * @param this - The execution context providing access to n8n functionality
 * @param source - Source type, either 'url' or 'binary'
 * @param value - Either a URL string or binary data property name depending on source type
 * @param itemIndex - Index of the workflow item to get binary data from (when source is 'binary')
 * @returns Promise resolving to a Buffer containing the file data
 * @throws NodeApiError if the source type is unsupported or retrieval fails
 */
export declare function createFileBuffer(this: IExecuteFunctions, source: string, value: string, itemIndex: number): Promise<Buffer>;
//# sourceMappingURL=helpers.d.ts.map