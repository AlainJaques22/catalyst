"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToTimestamp = parseToTimestamp;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function parseToTimestamp(dateString) {
    if (typeof dateString !== 'string') {
        throw new Error('Invalid date string');
    }
    const timestamp = (0, moment_timezone_1.default)(dateString).valueOf();
    if (isNaN(timestamp)) {
        throw new Error('Invalid date string');
    }
    return timestamp;
}
//# sourceMappingURL=parseToTimestamp.js.map