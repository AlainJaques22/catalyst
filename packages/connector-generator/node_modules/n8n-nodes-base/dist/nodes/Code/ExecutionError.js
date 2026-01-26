"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionError = void 0;
const errors_1 = require("@n8n/errors");
class ExecutionError extends errors_1.ApplicationError {
    description = null;
    itemIndex = undefined;
    context = undefined;
    stack = '';
    lineNumber = undefined;
    constructor(error, itemIndex) {
        super(error.message);
        this.itemIndex = itemIndex;
        if (this.itemIndex !== undefined) {
            this.context = { itemIndex: this.itemIndex };
        }
        this.stack = error.stack ?? '';
        this.populateFromStack();
    }
    /**
     * Populate error `message` and `description` from error `stack`.
     */
    populateFromStack() {
        const stackRows = this.stack && typeof this.stack === 'string' ? this.stack.split('\n') : [];
        if (stackRows.length === 0) {
            this.message = 'Unknown error';
            return;
        }
        const messageRow = stackRows.find((line) => line.includes('Error:'));
        const lineNumberRow = stackRows.find((line) => line.includes('Code:'));
        const lineNumberDisplay = this.toLineNumberDisplay(lineNumberRow) || '';
        if (!messageRow) {
            this.message = `Unknown error ${lineNumberDisplay}`;
            return;
        }
        const [errorDetails, errorType] = this.toErrorDetailsAndType(messageRow);
        if (errorType)
            this.description = errorType;
        if (!errorDetails) {
            this.message = `Unknown error ${lineNumberDisplay}`;
            return;
        }
        this.message = `${errorDetails} ${lineNumberDisplay}`.trim();
    }
    toLineNumberDisplay(lineNumberRow) {
        const errorLineNumberMatch = lineNumberRow?.match(/Code:(?<lineNumber>\d+)/);
        if (!errorLineNumberMatch?.groups?.lineNumber)
            return null;
        const lineNumber = errorLineNumberMatch.groups.lineNumber;
        this.lineNumber = Number(lineNumber);
        if (!lineNumber)
            return '';
        return this.itemIndex === undefined
            ? `[line ${lineNumber}]`
            : `[line ${lineNumber}, for item ${this.itemIndex}]`;
    }
    toErrorDetailsAndType(messageRow) {
        if (!messageRow)
            return [null, null];
        // Remove "Error: " prefix added by stacktrace formatting
        messageRow = messageRow.replace(/^Error: /, '');
        const colonIndex = messageRow.indexOf(': ');
        if (colonIndex === -1) {
            return [messageRow.trim(), null];
        }
        const errorType = messageRow.substring(0, colonIndex).trim();
        const errorDetails = messageRow.substring(colonIndex + 2).trim();
        return [errorDetails, errorType === 'Error' ? null : errorType];
    }
}
exports.ExecutionError = ExecutionError;
//# sourceMappingURL=ExecutionError.js.map