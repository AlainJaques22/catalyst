"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWaitAmount = validateWaitAmount;
exports.validateWaitUnit = validateWaitUnit;
function validateWaitAmount(amount) {
    return typeof amount === 'number' && amount >= 0;
}
function validateWaitUnit(unit) {
    return typeof unit === 'string' && ['seconds', 'minutes', 'hours', 'days'].includes(unit);
}
//# sourceMappingURL=validation.js.map