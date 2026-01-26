"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservedKeyFoundError = void 0;
const ValidationError_1 = require("./ValidationError");
class ReservedKeyFoundError extends ValidationError_1.ValidationError {
    constructor(reservedKey, itemIndex) {
        super({
            message: 'Invalid output format',
            description: `An output item contains the reserved key <code>${reservedKey}</code>. To get around this, please wrap each item in an object, under a key called <code>json</code>. <a href="https://docs.n8n.io/data/data-structure/#data-structure" target="_blank">Example</a>`,
            itemIndex,
        });
    }
}
exports.ReservedKeyFoundError = ReservedKeyFoundError;
//# sourceMappingURL=reserved-key-found-error.js.map