"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../utils/utilities");
const utils_1 = require("../../helpers/utils");
const transport_1 = require("../../transport");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        displayName: 'Filter By Formula',
        name: 'filterByFormula',
        type: 'string',
        default: '',
        placeholder: "e.g. NOT({Name} = 'Admin')",
        hint: 'If empty, all the records will be returned',
        description: 'The formula will be evaluated for each record, and if the result is not 0, false, "", NaN, [], or #Error! the record will be included in the response. <a href="https://support.airtable.com/docs/formula-field-reference" target="_blank">More info</a>.',
    },
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
        default: {},
        description: 'Additional options which decide which records should be returned',
        placeholder: 'Add option',
        options: [
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
                displayName: 'Download Attachments',
                name: 'downloadFields',
                type: 'multiOptions',
                typeOptions: {
                    loadOptionsMethod: 'getAttachmentColumns',
                    loadOptionsDependsOn: ['base.value', 'table.value'],
                },
                default: [],
                // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
                description: "The fields of type 'attachment' that should be downloaded",
            },
            {
                // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options
                displayName: 'Output Fields',
                name: 'fields',
                type: 'multiOptions',
                typeOptions: {
                    loadOptionsMethod: 'getColumns',
                    loadOptionsDependsOn: ['base.value', 'table.value'],
                },
                default: [],
                // eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-dynamic-multi-options
                description: 'The fields you want to include in the output',
            },
            common_descriptions_1.viewRLC,
        ],
    },
    {
        displayName: 'Sort',
        name: 'sort',
        placeholder: 'Add Sort Rule',
        description: 'Defines how the returned records should be ordered',
        type: 'fixedCollection',
        typeOptions: {
            multipleValues: true,
        },
        default: {},
        options: [
            {
                name: 'property',
                displayName: 'Property',
                values: [
                    {
                        // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
                        displayName: 'Field',
                        name: 'field',
                        type: 'options',
                        typeOptions: {
                            loadOptionsMethod: 'getColumns',
                            loadOptionsDependsOn: ['base.value', 'table.value'],
                        },
                        default: '',
                        description: 'Name of the field to sort on. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                    },
                    {
                        displayName: 'Direction',
                        name: 'direction',
                        type: 'options',
                        options: [
                            {
                                name: 'ASC',
                                value: 'asc',
                                description: 'Sort in ascending order (small -> large)',
                            },
                            {
                                name: 'DESC',
                                value: 'desc',
                                description: 'Sort in descending order (large -> small)',
                            },
                        ],
                        default: 'asc',
                        description: 'The sort direction',
                    },
                ],
            },
        ],
    },
];
const displayOptions = {
    show: {
        resource: ['record'],
        operation: ['search'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(items, base, table) {
    const returnData = [];
    const nodeVersion = this.getNode().typeVersion;
    const endpoint = `${base}/${table}`;
    let itemsLength = items.length ? 1 : 0;
    let fallbackPairedItems;
    if (nodeVersion >= 2.1) {
        itemsLength = items.length;
    }
    else {
        fallbackPairedItems = (0, utilities_1.generatePairedItemData)(items.length);
    }
    for (let i = 0; i < itemsLength; i++) {
        try {
            const returnAll = this.getNodeParameter('returnAll', i);
            const options = this.getNodeParameter('options', i, {});
            const sort = this.getNodeParameter('sort', i, {});
            const filterByFormula = this.getNodeParameter('filterByFormula', i);
            const body = {};
            const qs = {};
            if (filterByFormula) {
                qs.filterByFormula = filterByFormula;
            }
            if (options.fields) {
                if (typeof options.fields === 'string') {
                    qs.fields = options.fields.split(',').map((field) => field.trim());
                }
                else {
                    qs.fields = options.fields;
                }
            }
            if (sort.property) {
                qs.sort = sort.property;
            }
            if (options.view) {
                qs.view = options.view.value;
            }
            let responseData;
            if (returnAll) {
                responseData = await transport_1.apiRequestAllItems.call(this, 'GET', endpoint, body, qs);
            }
            else {
                qs.maxRecords = this.getNodeParameter('limit', i);
                responseData = await transport_1.apiRequest.call(this, 'GET', endpoint, body, qs);
            }
            if (options.downloadFields) {
                const itemWithAttachments = await transport_1.downloadRecordAttachments.call(this, responseData.records, options.downloadFields, fallbackPairedItems || [{ item: i }]);
                returnData.push(...itemWithAttachments);
                continue;
            }
            let records = responseData.records;
            records = records.map((record) => ({
                json: (0, utils_1.flattenOutput)(record),
            }));
            const itemData = fallbackPairedItems || [{ item: i }];
            const executionData = this.helpers.constructExecutionMetaData(records, {
                itemData,
            });
            returnData.push(...executionData);
        }
        catch (error) {
            if (this.continueOnFail()) {
                returnData.push({ json: { message: error.message, error }, pairedItem: { item: i } });
                continue;
            }
            else {
                throw error;
            }
        }
    }
    return returnData;
}
//# sourceMappingURL=search.operation.js.map