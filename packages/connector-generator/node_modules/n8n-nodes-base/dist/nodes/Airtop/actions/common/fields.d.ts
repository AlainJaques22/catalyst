import type { INodeProperties } from 'n8n-workflow';
export declare const SESSION_MODE: {
    readonly NEW: "new";
    readonly EXISTING: "existing";
};
/**
 * Session related fields
 */
export declare const sessionIdField: INodeProperties;
export declare const windowIdField: INodeProperties;
export declare const profileNameField: INodeProperties;
export declare const urlField: INodeProperties;
/**
 * Extraction related fields
 */
export declare const outputSchemaField: INodeProperties;
export declare const parseJsonOutputField: INodeProperties;
/**
 * Interaction related fields
 */
export declare const elementDescriptionField: INodeProperties;
export declare function getSessionModeFields(resource: string, operations: string[]): INodeProperties[];
export declare const includeHiddenElementsField: INodeProperties;
//# sourceMappingURL=fields.d.ts.map