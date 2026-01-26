"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionEndedError = exports.ConnectionClosedError = exports.ConnectionTimeoutError = exports.ImapError = void 0;
class ImapError extends Error {
}
exports.ImapError = ImapError;
class ConnectionTimeoutError extends ImapError {
    constructor(timeout) {
        let message = 'connection timed out';
        if (timeout) {
            message += `. timeout = ${timeout} ms`;
        }
        super(message);
        this.timeout = timeout;
    }
}
exports.ConnectionTimeoutError = ConnectionTimeoutError;
class ConnectionClosedError extends ImapError {
    constructor() {
        super('Connection closed unexpectedly');
    }
}
exports.ConnectionClosedError = ConnectionClosedError;
class ConnectionEndedError extends ImapError {
    constructor() {
        super('Connection ended unexpectedly');
    }
}
exports.ConnectionEndedError = ConnectionEndedError;
//# sourceMappingURL=errors.js.map