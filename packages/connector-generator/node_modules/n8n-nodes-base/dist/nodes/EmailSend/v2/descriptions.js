"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEmailProperty = exports.fromEmailProperty = void 0;
exports.fromEmailProperty = {
    displayName: 'From Email',
    name: 'fromEmail',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'admin@example.com',
    description: 'Email address of the sender. You can also specify a name: Nathan Doe &lt;nate@n8n.io&gt;.',
};
exports.toEmailProperty = {
    displayName: 'To Email',
    name: 'toEmail',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'info@example.com',
    description: 'Email address of the recipient. You can also specify a name: Nathan Doe &lt;nate@n8n.io&gt;.',
};
//# sourceMappingURL=descriptions.js.map