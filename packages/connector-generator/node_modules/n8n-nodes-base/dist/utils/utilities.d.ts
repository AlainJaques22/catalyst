import type { IDataObject, IDisplayOptions, IExecuteFunctions, INode, INodeExecutionData, INodeProperties, IPairedItemData } from 'n8n-workflow';
/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
export declare function chunk<T>(array: T[], size?: number): T[][];
/**
 * Shuffles an array in place using the Fisher-Yates shuffle algorithm
 * @param {Array} array The array to shuffle.
 */
export declare const shuffleArray: <T>(array: T[]) => void;
/**
 * Flattens an object with deep data
 * @param {IDataObject} data The object to flatten
 * @param {string[]} prefix The prefix to add to each key in the returned flat object
 */
export declare const flattenKeys: (obj: IDataObject, prefix?: string[]) => IDataObject;
/**
 * Takes a multidimensional array and converts it to a one-dimensional array.
 *
 * @param {Array} nestedArray The array to be flattened.
 * @example
 *
 * flatten([['a', 'b'], ['c', 'd']])
 * // => ['a', 'b', 'c', 'd']
 *
 */
export declare function flatten<T>(nestedArray: T[][]): any;
/**
 * Compares the values of specified keys in two objects.
 *
 * @param {T} obj1 - The first object to compare.
 * @param {T} obj2 - The second object to compare.
 * @param {string[]} keys - An array of keys to compare.
 * @param {boolean} disableDotNotation - Whether to use dot notation to access nested properties.
 * @returns {boolean} - Whether the values of the specified keys are equal in both objects.
 */
export declare const compareItems: <T extends {
    json: Record<string, unknown>;
}>(obj1: T, obj2: T, keys: string[], disableDotNotation?: boolean) => boolean;
export declare function updateDisplayOptions(displayOptions: IDisplayOptions, properties: INodeProperties[]): {
    displayOptions: IDisplayOptions;
    displayName: string;
    name: string;
    type: import("n8n-workflow").NodePropertyTypes;
    typeOptions?: import("n8n-workflow").INodePropertyTypeOptions;
    default: import("n8n-workflow").NodeParameterValueType;
    description?: string;
    hint?: string;
    disabledOptions?: IDisplayOptions;
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
export declare function processJsonInput<T>(jsonData: T, inputName?: string): unknown;
export declare const fuzzyCompare: (useFuzzyCompare: boolean, compareVersion?: number) => <T, U>(item1: T, item2: U) => boolean;
export declare function wrapData(data: IDataObject | IDataObject[]): INodeExecutionData[];
export declare const keysToLowercase: <T>(headers: T) => IDataObject | T;
/**
 * Formats a private key by removing unnecessary whitespace and adding line breaks.
 * @param privateKey - The private key to format.
 * @returns The formatted private key.
 */
export declare function formatPrivateKey(privateKey: string, keyIsPublic?: boolean): string;
/**
 * @TECH_DEBT Explore replacing with handlebars
 */
export declare function getResolvables(expression: string): string[];
/**
 * Flattens an object with deep data
 *
 * @param {IDataObject} data The object to flatten
 */
export declare function flattenObject(data: IDataObject): IDataObject;
/**
 * Capitalizes the first letter of a string
 *
 * @param {string} string The string to capitalize
 */
export declare function capitalize(str: string): string;
export declare function generatePairedItemData(length: number): IPairedItemData[];
/**
 * Output Paired Item Data Array
 *
 * @param {number | IPairedItemData | IPairedItemData[] | undefined} pairedItem
 */
export declare function preparePairedItemDataArray(pairedItem: number | IPairedItemData | IPairedItemData[] | undefined): IPairedItemData[];
export declare const sanitizeDataPathKey: (item: IDataObject, key: string) => string;
/**
 * Escape HTML
 *
 * @param {string} text The text to escape
 */
export declare function escapeHtml(text: string): string;
/**
 * Sorts each item json's keys by a priority list
 *
 * @param {INodeExecutionData[]} data The array of items which keys will be sorted
 * @param {string[]} priorityList The priority list, keys of item.json will be sorted in this order first then alphabetically
 */
export declare function sortItemKeysByPriorityList(data: INodeExecutionData[], priorityList: string[]): INodeExecutionData[];
export declare function createUtmCampaignLink(nodeType: string, instanceId?: string): string;
export declare const removeTrailingSlash: (url: string) => string;
export declare function addExecutionHints(context: IExecuteFunctions, node: INode, items: INodeExecutionData[], operation: string, executeOnce: boolean | undefined): void;
//# sourceMappingURL=utilities.d.ts.map