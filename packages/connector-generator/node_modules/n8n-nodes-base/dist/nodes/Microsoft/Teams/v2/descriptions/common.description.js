"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupSourceOptions = void 0;
exports.groupSourceOptions = {
    displayName: 'Group Source',
    name: 'groupSource',
    required: true,
    type: 'options',
    default: 'all',
    description: 'From where to select groups and teams',
    options: [
        {
            name: 'All Groups',
            value: 'all',
            description: 'From all groups',
        },
        {
            name: 'My Groups',
            value: 'mine',
            description: 'Only load groups that account is member of',
        },
    ],
};
//# sourceMappingURL=common.description.js.map