"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeHiddenElementsField = exports.elementDescriptionField = exports.parseJsonOutputField = exports.outputSchemaField = exports.urlField = exports.profileNameField = exports.windowIdField = exports.sessionIdField = exports.SESSION_MODE = void 0;
exports.getSessionModeFields = getSessionModeFields;
exports.SESSION_MODE = {
    NEW: 'new',
    EXISTING: 'existing',
};
/**
 * Session related fields
 */
exports.sessionIdField = {
    displayName: 'Session ID',
    name: 'sessionId',
    type: 'string',
    required: true,
    default: '={{ $json["sessionId"] }}',
    description: 'The ID of the <a href="https://docs.airtop.ai/guides/how-to/creating-a-session" target="_blank">Session</a> to use',
};
exports.windowIdField = {
    displayName: 'Window ID',
    name: 'windowId',
    type: 'string',
    required: true,
    default: '={{ $json["windowId"] }}',
    description: 'The ID of the <a href="https://docs.airtop.ai/guides/how-to/creating-a-session#windows" target="_blank">Window</a> to use',
};
exports.profileNameField = {
    displayName: 'Profile Name',
    name: 'profileName',
    type: 'string',
    default: '',
    description: 'The name of the Airtop profile to load or create',
    hint: '<a href="https://docs.airtop.ai/guides/how-to/saving-a-profile" target="_blank">Learn more</a> about Airtop profiles',
    placeholder: 'e.g. my-x-profile',
};
exports.urlField = {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    default: '',
    placeholder: 'e.g. https://google.com',
    description: 'URL to load in the window',
};
/**
 * Extraction related fields
 */
exports.outputSchemaField = {
    displayName: 'JSON Output Schema',
    name: 'outputSchema',
    description: 'JSON schema defining the structure of the output',
    hint: 'If you want to force your output to be JSON, provide a valid JSON schema describing the output. You can generate one automatically in the <a href="https://portal.airtop.ai/" target="_blank">Airtop API Playground</a>.',
    type: 'json',
    default: '',
};
exports.parseJsonOutputField = {
    displayName: 'Parse JSON Output',
    name: 'parseJsonOutput',
    type: 'boolean',
    default: true,
    description: "Whether to parse the model's response to JSON in the output. Requires the 'JSON Output Schema' parameter to be set.",
};
/**
 * Interaction related fields
 */
exports.elementDescriptionField = {
    displayName: 'Element Description',
    name: 'elementDescription',
    type: 'string',
    default: '',
    description: 'A specific description of the element to execute the interaction on',
    placeholder: 'e.g. the search box at the top of the page',
};
function getSessionModeFields(resource, operations) {
    return [
        {
            displayName: 'Session Mode',
            name: 'sessionMode',
            type: 'options',
            default: 'existing',
            description: 'Choose between creating a new session or using an existing one',
            options: [
                {
                    name: 'Automatically Create Session',
                    description: 'Automatically create a new session and window for this operation',
                    value: exports.SESSION_MODE.NEW,
                },
                {
                    name: 'Use Existing Session',
                    description: 'Use an existing session and window for this operation',
                    value: exports.SESSION_MODE.EXISTING,
                },
            ],
            displayOptions: {
                show: {
                    resource: [resource],
                    operation: operations,
                },
            },
        },
        {
            ...exports.sessionIdField,
            displayOptions: {
                show: {
                    resource: [resource],
                    sessionMode: [exports.SESSION_MODE.EXISTING],
                },
            },
        },
        {
            ...exports.windowIdField,
            displayOptions: {
                show: {
                    resource: [resource],
                    sessionMode: [exports.SESSION_MODE.EXISTING],
                },
            },
        },
        {
            ...exports.urlField,
            required: true,
            displayOptions: {
                show: {
                    resource: [resource],
                    sessionMode: [exports.SESSION_MODE.NEW],
                },
            },
        },
        {
            ...exports.profileNameField,
            displayOptions: {
                show: {
                    resource: [resource],
                    sessionMode: [exports.SESSION_MODE.NEW],
                },
            },
        },
        {
            displayName: 'Auto-Terminate Session',
            name: 'autoTerminateSession',
            type: 'boolean',
            default: true,
            description: 'Whether to terminate the session after the operation is complete. When disabled, you must manually terminate the session. By default, idle sessions timeout after 10 minutes',
            displayOptions: {
                show: {
                    resource: [resource],
                    sessionMode: [exports.SESSION_MODE.NEW],
                },
            },
        },
    ];
}
exports.includeHiddenElementsField = {
    displayName: 'Include Hidden Elements',
    name: 'includeHiddenElements',
    type: 'boolean',
    default: true,
    description: 'Whether to include hidden elements in the interaction',
};
//# sourceMappingURL=fields.js.map