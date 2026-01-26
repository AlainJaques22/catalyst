export declare abstract class ImapError extends Error {
}
export declare class ConnectionTimeoutError extends ImapError {
    readonly timeout?: number | undefined;
    constructor(timeout?: number | undefined);
}
export declare class ConnectionClosedError extends ImapError {
    constructor();
}
export declare class ConnectionEndedError extends ImapError {
    constructor();
}
