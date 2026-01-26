"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const transport_1 = require("../../transport");
const properties = [
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: true,
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
            show: {
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 100,
        },
        default: 100,
        description: 'Max number of results to return',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
            {
                displayName: 'Permission Level',
                name: 'permissionLevel',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Comment',
                        value: 'comment',
                    },
                    {
                        name: 'Create',
                        value: 'create',
                    },
                    {
                        name: 'Edit',
                        value: 'edit',
                    },
                    {
                        name: 'None',
                        value: 'none',
                    },
                    {
                        name: 'Read',
                        value: 'read',
                    },
                ],
                default: [],
                description: 'Filter the returned bases by one or more permission levels',
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['base'],
        operation: ['getMany'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute() {
    const returnAll = this.getNodeParameter('returnAll', 0);
    const endpoint = 'meta/bases';
    let bases = [];
    if (returnAll) {
        let offset = undefined;
        do {
            const responseData = await transport_1.apiRequest.call(this, 'GET', endpoint);
            bases.push(...responseData.bases);
            offset = responseData.offset;
        } while (offset);
    }
    else {
        const responseData = await transport_1.apiRequest.call(this, 'GET', endpoint);
        const limit = this.getNodeParameter('limit', 0);
        if (limit && responseData.bases?.length) {
            bases = responseData.bases.slice(0, limit);
        }
    }
    const permissionLevel = this.getNodeParameter('options.permissionLevel', 0, []);
    if (permissionLevel.length) {
        bases = bases.filter((base) => permissionLevel.includes(base.permissionLevel));
    }
    const itemData = (0, utilities_1.generatePairedItemData)(this.getInputData().length);
    const returnData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(bases), {
        itemData,
    });
    return returnData;
}
//# sourceMappingURL=getMany.operation.js.map