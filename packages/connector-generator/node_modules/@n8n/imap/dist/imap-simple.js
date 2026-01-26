"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImapSimple = void 0;
const events_1 = require("events");
const get_message_1 = require("./helpers/get-message");
const part_data_1 = require("./part-data");
const IMAP_EVENTS = ['alert', 'mail', 'expunge', 'uidvalidity', 'update', 'close', 'end'];
class ImapSimple extends events_1.EventEmitter {
    constructor(imap) {
        super();
        this.imap = imap;
        this.ending = false;
        IMAP_EVENTS.forEach((event) => {
            this.imap.on(event, this.emit.bind(this, event));
        });
        this.imap.on('error', (e) => {
            if (e && this.ending && e.code?.toUpperCase() === 'ECONNRESET') {
                return;
            }
            this.emit('error', e);
        });
    }
    end() {
        this.ending = true;
        this.imap.once('close', () => {
            this.ending = false;
        });
        this.imap.end();
    }
    async search(searchCriteria, fetchOptions, limit) {
        return await new Promise((resolve, reject) => {
            this.imap.search(searchCriteria, (e, uids) => {
                if (e) {
                    reject(e);
                    return;
                }
                if (uids.length === 0) {
                    resolve([]);
                    return;
                }
                let uidsToFetch = uids;
                if (limit && limit > 0 && uids.length > limit) {
                    uidsToFetch = uids.slice(0, limit);
                }
                const fetch = this.imap.fetch(uidsToFetch, fetchOptions);
                let messagesRetrieved = 0;
                const messages = [];
                const fetchOnMessage = async (message, seqNo) => {
                    const msg = await (0, get_message_1.getMessage)(message);
                    msg.seqNo = seqNo;
                    messages.push(msg);
                    messagesRetrieved++;
                    if (messagesRetrieved === uidsToFetch.length) {
                        resolve(messages.filter((m) => !!m));
                    }
                };
                const fetchOnError = (error) => {
                    fetch.removeListener('message', fetchOnMessage);
                    fetch.removeListener('end', fetchOnEnd);
                    reject(error);
                };
                const fetchOnEnd = () => {
                    fetch.removeListener('message', fetchOnMessage);
                    fetch.removeListener('error', fetchOnError);
                };
                fetch.on('message', fetchOnMessage);
                fetch.once('error', fetchOnError);
                fetch.once('end', fetchOnEnd);
            });
        });
    }
    async getPartData(message, part) {
        return await new Promise((resolve, reject) => {
            const fetch = this.imap.fetch(message.attributes.uid, {
                bodies: [part.partID],
                struct: true,
            });
            const fetchOnMessage = async (msg) => {
                const result = await (0, get_message_1.getMessage)(msg);
                if (result.parts.length !== 1) {
                    reject(new Error('Got ' + result.parts.length + ' parts, should get 1'));
                    return;
                }
                const data = result.parts[0].body;
                const encoding = part.encoding.toUpperCase();
                resolve(part_data_1.PartData.fromData(data, encoding));
            };
            const fetchOnError = (error) => {
                fetch.removeListener('message', fetchOnMessage);
                fetch.removeListener('end', fetchOnEnd);
                reject(error);
            };
            const fetchOnEnd = () => {
                fetch.removeListener('message', fetchOnMessage);
                fetch.removeListener('error', fetchOnError);
            };
            fetch.once('message', fetchOnMessage);
            fetch.once('error', fetchOnError);
            fetch.once('end', fetchOnEnd);
        });
    }
    async addFlags(uid, flags) {
        return await new Promise((resolve, reject) => {
            this.imap.addFlags(uid, flags, (e) => (e ? reject(e) : resolve()));
        });
    }
    async getBoxes() {
        return await new Promise((resolve, reject) => {
            this.imap.getBoxes((e, boxes) => (e ? reject(e) : resolve(boxes)));
        });
    }
    async openBox(boxName) {
        return await new Promise((resolve, reject) => {
            this.imap.openBox(boxName, (e, result) => (e ? reject(e) : resolve(result)));
        });
    }
    async closeBox(autoExpunge = true) {
        return await new Promise((resolve, reject) => {
            this.imap.closeBox(autoExpunge, (e) => (e ? reject(e) : resolve()));
        });
    }
}
exports.ImapSimple = ImapSimple;
//# sourceMappingURL=imap-simple.js.map