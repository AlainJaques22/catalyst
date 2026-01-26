"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectFields = exports.objectOperations = void 0;
const common_descriptions_1 = require("./common.descriptions");
const utilities_1 = require("../../../utils/utilities");
const searchDisplayOptions = {
    show: {
        resource: ['object'],
        operation: ['search'],
    },
};
const searchDescription = (0, utilities_1.updateDisplayOptions)(searchDisplayOptions, common_descriptions_1.searchProperties);
exports.objectOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['object'],
            },
        },
        noDataExpression: true,
        options: [
            {
                name: 'Search',
                value: 'search',
                action: 'Get a filtered list of objects',
            },
        ],
        default: 'search',
    },
];
exports.objectFields = [
    // ----------------------------------------
    //              event: search
    // ----------------------------------------
    ...searchDescription,
];
//# sourceMappingURL=ObjectDescription.js.map