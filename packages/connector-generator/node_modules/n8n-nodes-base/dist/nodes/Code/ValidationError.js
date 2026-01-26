"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const errors_1 = require("@n8n/errors");
class ValidationError extends errors_1.ApplicationError {
    description = '';
    itemIndex = undefined;
    context = undefined;
    lineNumber = undefined;
    constructor({ message, description, itemIndex, lineNumber, }) {
        super(message);
        this.lineNumber = lineNumber;
        this.itemIndex = itemIndex;
        if (this.lineNumber !== undefined && this.itemIndex !== undefined) {
            this.message = `${message} [line ${lineNumber}, for item ${itemIndex}]`;
        }
        else if (this.lineNumber !== undefined) {
            this.message = `${message} [line ${lineNumber}]`;
        }
        else if (this.itemIndex !== undefined) {
            this.message = `${message} [item ${itemIndex}]`;
        }
        else {
            this.message = message;
        }
        this.description = description;
        if (this.itemIndex !== undefined) {
            this.context = { itemIndex: this.itemIndex };
        }
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map