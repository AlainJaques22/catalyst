"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamFields = exports.teamOperations = void 0;
exports.teamOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        default: 'get',
        options: [
            {
                name: 'Get',
                value: 'get',
                action: 'Get a team',
            },
            {
                name: 'Get Credits',
                value: 'getCredits',
                action: 'Get team credits',
            },
        ],
        displayOptions: {
            show: {
                resource: ['team'],
            },
        },
    },
];
exports.teamFields = [
// ----------------------------------
//        team: get
// ----------------------------------
];
//# sourceMappingURL=TeamDescription.js.map