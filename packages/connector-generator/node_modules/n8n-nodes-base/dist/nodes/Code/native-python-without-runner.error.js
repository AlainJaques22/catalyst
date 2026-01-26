"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativePythonWithoutRunnerError = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class NativePythonWithoutRunnerError extends n8n_workflow_1.UserError {
    constructor() {
        super('To use native Python, please use runners by setting `N8N_RUNNERS_ENABLED=true`.');
    }
}
exports.NativePythonWithoutRunnerError = NativePythonWithoutRunnerError;
//# sourceMappingURL=native-python-without-runner.error.js.map