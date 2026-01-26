"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonRunnerUnavailableError = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const REASONS = {
    python: 'Python 3 is missing from this system',
    venv: 'Virtual environment is missing from this system',
};
class PythonRunnerUnavailableError extends n8n_workflow_1.UserError {
    constructor(reason) {
        const message = reason
            ? `Python runner unavailable: ${REASONS[reason]}`
            : 'Python runner unavailable';
        super(message, {
            description: 'Internal mode is intended only for debugging. For production, deploy in external mode: https://docs.n8n.io/hosting/configuration/task-runners/#setting-up-external-mode',
        });
    }
}
exports.PythonRunnerUnavailableError = PythonRunnerUnavailableError;
//# sourceMappingURL=python-runner-unavailable.error.js.map