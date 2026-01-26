"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.AGENT_MIN_TIMEOUT_SECONDS = exports.OPERATION_TIMEOUT = exports.SESSION_STATUS = exports.DEFAULT_DOWNLOAD_TIMEOUT_SECONDS = exports.MAX_TIMEOUT_MINUTES = exports.MIN_TIMEOUT_MINUTES = exports.DEFAULT_TIMEOUT_MINUTES = exports.BASE_URL = exports.N8N_VERSION = exports.getN8NVersion = void 0;
const fs_1 = require("fs");
const n8n_workflow_1 = require("n8n-workflow");
const path_1 = require("path");
// Helper function to get n8n version that can be mocked in tests
const getN8NVersion = () => {
    if (process.env.N8N_VERSION) {
        return process.env.N8N_VERSION;
    }
    try {
        const PACKAGE_DIR = (0, path_1.resolve)(__dirname, '../../../');
        const packageJsonPath = (0, path_1.join)(PACKAGE_DIR, 'package.json');
        const n8nPackageJson = (0, n8n_workflow_1.jsonParse)((0, fs_1.readFileSync)(packageJsonPath, 'utf8'));
        return n8nPackageJson.version;
    }
    catch (error) {
        // Fallback version
        return '0.0.0';
    }
};
exports.getN8NVersion = getN8NVersion;
exports.N8N_VERSION = (0, exports.getN8NVersion)();
exports.BASE_URL = process.env.AIRTOP_BASE_URL ?? 'https://api.airtop.ai/api/v1';
// Session operations
exports.DEFAULT_TIMEOUT_MINUTES = 10;
exports.MIN_TIMEOUT_MINUTES = 1;
exports.MAX_TIMEOUT_MINUTES = 10080;
exports.DEFAULT_DOWNLOAD_TIMEOUT_SECONDS = 30;
exports.SESSION_STATUS = {
    INITIALIZING: 'initializing',
    RUNNING: 'running',
};
// Operations
exports.OPERATION_TIMEOUT = 5 * 60 * 1000; // 5 mins
exports.AGENT_MIN_TIMEOUT_SECONDS = 10;
// Error messages
exports.ERROR_MESSAGES = {
    SESSION_ID_REQUIRED: "Please fill the 'Session ID' parameter",
    WINDOW_ID_REQUIRED: "Please fill the 'Window ID' parameter",
    URL_REQUIRED: "Please fill the 'URL' parameter",
    PROFILE_NAME_INVALID: "'Profile Name' should only contain letters, numbers and dashes",
    TIMEOUT_MINUTES_INVALID: `Timeout must be between ${exports.MIN_TIMEOUT_MINUTES} and ${exports.MAX_TIMEOUT_MINUTES} minutes`,
    TIMEOUT_REACHED: 'Timeout reached while waiting for the operation to complete',
    AGENT_TIMEOUT_INVALID: `Timeout must be at least ${exports.AGENT_MIN_TIMEOUT_SECONDS} seconds`,
    AGENT_INVALID_WEBHOOK_URL: 'Invalid agent webhook URL. Expected format: https://api.airtop.ai/api/hooks/agents/<agentId>/webhooks/...',
    URL_INVALID: "'URL' must start with 'http' or 'https'",
    PROFILE_NAME_REQUIRED: "'Profile Name' is required when 'Save Profile' is enabled",
    REQUIRED_PARAMETER: "Please fill the '{{field}}' parameter",
    PROXY_URL_REQUIRED: "Please fill the 'Proxy URL' parameter",
    PROXY_URL_INVALID: "'Proxy URL' must start with 'http' or 'https'",
    SCREEN_RESOLUTION_INVALID: "'Screen Resolution' must be in the format 'width x height' (e.g. '1280x720')",
    SCROLL_BY_AMOUNT_INVALID: "'Scroll By' amount must be a number and either a percentage or pixels (e.g. '100px' or '100%')",
    SCROLL_MODE_INVALID: "Please fill any of the 'Scroll To Edge' or 'Scroll By' parameters",
};
//# sourceMappingURL=constants.js.map