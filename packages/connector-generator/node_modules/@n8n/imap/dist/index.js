"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
exports.getParts = getParts;
const imap_1 = __importDefault(require("imap"));
const errors_1 = require("./errors");
const imap_simple_1 = require("./imap-simple");
async function connect(options) {
    const authTimeout = options.imap.authTimeout ?? 2000;
    options.imap.authTimeout = authTimeout;
    const imap = new imap_1.default(options.imap);
    return await new Promise((resolve, reject) => {
        const cleanUp = () => {
            imap.removeListener('ready', imapOnReady);
            imap.removeListener('error', imapOnError);
            imap.removeListener('close', imapOnClose);
            imap.removeListener('end', imapOnEnd);
        };
        const imapOnReady = () => {
            cleanUp();
            resolve(new imap_simple_1.ImapSimple(imap));
        };
        const imapOnError = (e) => {
            if (e.source === 'timeout-auth') {
                e = new errors_1.ConnectionTimeoutError(authTimeout);
            }
            cleanUp();
            reject(e);
        };
        const imapOnEnd = () => {
            cleanUp();
            reject(new errors_1.ConnectionEndedError());
        };
        const imapOnClose = () => {
            cleanUp();
            reject(new errors_1.ConnectionClosedError());
        };
        imap.once('ready', imapOnReady);
        imap.once('error', imapOnError);
        imap.once('close', imapOnClose);
        imap.once('end', imapOnEnd);
        if (options.onMail) {
            imap.on('mail', options.onMail);
        }
        if (options.onExpunge) {
            imap.on('expunge', options.onExpunge);
        }
        if (options.onUpdate) {
            imap.on('update', options.onUpdate);
        }
        imap.connect();
    });
}
function getParts(struct, parts = []) {
    for (let i = 0; i < struct.length; i++) {
        if (Array.isArray(struct[i])) {
            getParts(struct[i], parts);
        }
        else if (struct[i].partID) {
            parts.push(struct[i]);
        }
    }
    return parts;
}
__exportStar(require("./imap-simple"), exports);
__exportStar(require("./errors"), exports);
//# sourceMappingURL=index.js.map