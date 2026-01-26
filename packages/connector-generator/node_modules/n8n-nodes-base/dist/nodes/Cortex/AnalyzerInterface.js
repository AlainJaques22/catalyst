"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableDataTypes = exports.TLPs = exports.JobStatuses = void 0;
exports.JobStatuses = {
    WAITING: 'Waiting',
    INPROGRESS: 'InProgress',
    SUCCESS: 'Success',
    FAILURE: 'Failure',
    DELETED: 'Deleted',
};
exports.TLPs = {
    white: 0,
    green: 1,
    amber: 2,
    red: 3,
};
exports.ObservableDataTypes = {
    domain: 'domain',
    file: 'file',
    filename: 'filename',
    fqdn: 'fqdn',
    hash: 'hash',
    ip: 'ip',
    mail: 'mail',
    mail_subject: 'mail_subject',
    other: 'other',
    regexp: 'regexp',
    registry: 'registry',
    uri_path: 'uri_path',
    url: 'url',
    'user-agent': 'user-agent',
};
//# sourceMappingURL=AnalyzerInterface.js.map