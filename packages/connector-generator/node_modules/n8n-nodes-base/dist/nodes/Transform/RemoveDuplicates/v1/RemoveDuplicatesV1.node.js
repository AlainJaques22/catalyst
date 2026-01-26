"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveDuplicatesV1 = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../utils");
const versionDescription = {
    displayName: 'Remove Duplicates',
    name: 'removeDuplicates',
    icon: 'file:removeDuplicates.svg',
    group: ['transform'],
    subtitle: '',
    version: [1, 1.1],
    description: 'Delete items with matching field values',
    defaults: {
        name: 'Remove Duplicates',
    },
    inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
    properties: [
        {
            displayName: 'Compare',
            name: 'compare',
            type: 'options',
            options: [
                {
                    name: 'All Fields',
                    value: 'allFields',
                },
                {
                    name: 'All Fields Except',
                    value: 'allFieldsExcept',
                },
                {
                    name: 'Selected Fields',
                    value: 'selectedFields',
                },
            ],
            default: 'allFields',
            description: 'The fields of the input items to compare to see if they are the same',
        },
        {
            displayName: 'Fields To Exclude',
            name: 'fieldsToExclude',
            type: 'string',
            placeholder: 'e.g. email, name',
            requiresDataPath: 'multiple',
            description: 'Fields in the input to exclude from the comparison',
            default: '',
            displayOptions: {
                show: {
                    compare: ['allFieldsExcept'],
                },
            },
        },
        {
            displayName: 'Fields To Compare',
            name: 'fieldsToCompare',
            type: 'string',
            placeholder: 'e.g. email, name',
            requiresDataPath: 'multiple',
            description: 'Fields in the input to add to the comparison',
            default: '',
            displayOptions: {
                show: {
                    compare: ['selectedFields'],
                },
            },
        },
        {
            displayName: 'Options',
            name: 'options',
            type: 'collection',
            placeholder: 'Add Field',
            default: {},
            displayOptions: {
                show: {
                    compare: ['allFieldsExcept', 'selectedFields'],
                },
            },
            options: [
                {
                    displayName: 'Disable Dot Notation',
                    name: 'disableDotNotation',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to disallow referencing child fields using `parent.child` in the field name',
                },
                {
                    displayName: 'Remove Other Fields',
                    name: 'removeOtherFields',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to remove any fields that are not being compared. If disabled, will keep the values from the first of the duplicates.',
                },
            ],
        },
    ],
};
class RemoveDuplicatesV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription,
        };
    }
    async execute() {
        const items = this.getInputData();
        return (0, utils_1.removeDuplicateInputItems)(this, items);
    }
}
exports.RemoveDuplicatesV1 = RemoveDuplicatesV1;
//# sourceMappingURL=RemoveDuplicatesV1.node.js.map