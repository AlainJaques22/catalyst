import { type IExecuteFunctions, type INode, type IDataObject } from 'n8n-workflow';
import { type TScrollingMode } from './constants';
import type { IAirtopResponse, IAirtopServerEvent, IAirtopSessionResponse } from './transport/types';
/**
 * Validate a required string field
 * @param this - The execution context
 * @param index - The index of the node
 * @param field - The field to validate
 * @param fieldName - The name of the field
 */
export declare function validateRequiredStringField(this: IExecuteFunctions, index: number, field: string, fieldName: string): string;
/**
 * Validate the session ID parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The validated session ID
 */
export declare function validateSessionId(this: IExecuteFunctions, index: number): string;
/**
 * Validate the session ID and window ID parameters
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The validated session ID and window ID parameters
 */
export declare function validateSessionAndWindowId(this: IExecuteFunctions, index: number): {
    sessionId: string;
    windowId: string;
};
/**
 * Validate the profile name parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The validated profile name
 */
export declare function validateProfileName(this: IExecuteFunctions, index: number): string;
/**
 * Validate the timeout minutes parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The validated timeout minutes
 */
export declare function validateTimeoutMinutes(this: IExecuteFunctions, index: number): number;
/**
 * Validate the URL parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The validated URL
 */
export declare function validateUrl(this: IExecuteFunctions, index: number): string;
/**
 * Validate the Proxy configuration
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The validated proxy configuration
 */
export declare function validateProxy(this: IExecuteFunctions, index: number): {
    proxy: boolean | {
        country: string;
        sticky: boolean;
    };
} | {
    proxy: string;
};
/**
 * Validate the scrollBy amount parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @param parameterName - The name of the parameter
 * @returns The validated scrollBy amount
 */
export declare function validateScrollByAmount(this: IExecuteFunctions, index: number, parameterName: string): {
    xAxis?: string;
    yAxis?: string;
};
/**
 * Validate the scroll mode parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @returns Scroll mode
 * @throws Error if the scroll mode or scroll parameters are invalid
 */
export declare function validateScrollingMode(this: IExecuteFunctions, index: number): TScrollingMode;
/**
 * Validate the screen resolution parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The validated screen resolution
 */
export declare function validateScreenResolution(this: IExecuteFunctions, index: number): string;
/**
 * Validate the save profile on termination parameter
 * @param this - The execution context
 * @param index - The index of the node
 * @param profileName - The profile name
 * @returns The validated save profile on termination
 */
export declare function validateSaveProfileOnTermination(this: IExecuteFunctions, index: number, profileName: string): boolean;
/**
 * Check if there is an error in the API response and throw NodeApiError
 * @param node - The node instance
 * @param response - The response from the API
 */
export declare function validateAirtopApiResponse(node: INode, response: IAirtopResponse): void;
/**
 * Convert a screenshot from the API response to a binary buffer
 * @param screenshot - The screenshot from the API response
 * @returns The processed screenshot
 */
export declare function convertScreenshotToBinary(screenshot: {
    dataUrl: string;
}): Buffer;
/**
 * Check if a new session should be created
 * @param this - The execution context
 * @param index - The index of the node
 * @returns True if a new session should be created, false otherwise
 */
export declare function shouldCreateNewSession(this: IExecuteFunctions, index: number): boolean;
/**
 * Create a new session and wait until the session is ready
 * @param this - The execution context
 * @param parameters - The parameters for the session
 * @returns The session ID
 */
export declare function createSession(this: IExecuteFunctions, parameters: IDataObject, timeout?: number): Promise<{
    sessionId: string;
    data: IAirtopSessionResponse;
}>;
/**
 * Create a new session and window
 * @param this - The execution context
 * @param index - The index of the node
 * @returns The session ID and window ID
 */
export declare function createSessionAndWindow(this: IExecuteFunctions, index: number): Promise<{
    sessionId: string;
    windowId: string;
}>;
/**
 * Waits for a session event to occur
 * @param this - The execution context providing access to n8n functionality
 * @param sessionId - ID of the session to check for events
 * @param condition - Function to check if the event meets the condition
 * @param timeoutInSeconds - Maximum time in seconds to wait before failing (defaults to DEFAULT_DOWNLOAD_TIMEOUT_SECONDS)
 * @returns Promise resolving to the event when the condition is met
 */
export declare function waitForSessionEvent(this: IExecuteFunctions, sessionId: string, condition: (event: IAirtopServerEvent) => boolean, timeoutInSeconds?: number): Promise<IAirtopServerEvent>;
//# sourceMappingURL=GenericFunctions.d.ts.map