"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = getMessage;
const imap_1 = require("imap");
async function getMessage(message) {
    return await new Promise((resolve) => {
        let attributes;
        const parts = [];
        const messageOnBody = (stream, info) => {
            let body = '';
            const streamOnData = (chunk) => {
                body += chunk.toString('utf8');
            };
            stream.on('data', streamOnData);
            stream.once('end', () => {
                stream.removeListener('data', streamOnData);
                parts.push({
                    which: info.which,
                    size: info.size,
                    body: /^HEADER/g.test(info.which) ? (0, imap_1.parseHeader)(body) : body,
                });
            });
        };
        const messageOnAttributes = (attrs) => {
            attributes = attrs;
        };
        const messageOnEnd = () => {
            message.removeListener('body', messageOnBody);
            message.removeListener('attributes', messageOnAttributes);
            resolve({ attributes, parts });
        };
        message.on('body', messageOnBody);
        message.once('attributes', messageOnAttributes);
        message.once('end', messageOnEnd);
    });
}
//# sourceMappingURL=get-message.js.map