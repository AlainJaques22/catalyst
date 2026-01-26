import { UserError } from 'n8n-workflow';
type FailureReason = 'python' | 'venv';
export declare class PythonRunnerUnavailableError extends UserError {
    constructor(reason?: FailureReason);
}
export {};
//# sourceMappingURL=python-runner-unavailable.error.d.ts.map