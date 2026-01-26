"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterV2 = void 0;
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../../../utils/constants");
const descriptions_1 = require("../../../utils/descriptions");
const utils_1 = require("../../If/V2/utils");
class FilterV2 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            version: [2, 2.1, 2.2, 2.3],
            defaults: {
                name: 'Filter',
                color: '#229eff',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputNames: ['Kept', 'Discarded'],
            parameterPane: 'wide',
            properties: [
                {
                    displayName: 'Conditions',
                    name: 'conditions',
                    placeholder: 'Add Condition',
                    type: 'filter',
                    default: {},
                    typeOptions: {
                        filter: {
                            caseSensitive: '={{!$parameter.options.ignoreCase}}',
                            typeValidation: (0, utils_1.getTypeValidationStrictness)(2.1),
                            version: '={{ $nodeVersion >= 2.3 ? 3 : $nodeVersion >= 2.2 ? 2 : 1 }}',
                        },
                    },
                },
                {
                    ...descriptions_1.looseTypeValidationProperty,
                    default: false,
                    displayOptions: {
                        show: {
                            '@version': [{ _cnd: { gte: 2.1 } }],
                        },
                    },
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add option',
                    default: {},
                    options: [
                        {
                            displayName: 'Ignore Case',
                            description: 'Whether to ignore letter case when evaluating conditions',
                            name: 'ignoreCase',
                            type: 'boolean',
                            default: true,
                        },
                        {
                            ...descriptions_1.looseTypeValidationProperty,
                            displayOptions: {
                                show: {
                                    '@version': [{ _cnd: { lt: 2.1 } }],
                                },
                            },
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        const keptItems = [];
        const discardedItems = [];
        this.getInputData().forEach((item, itemIndex) => {
            try {
                const options = this.getNodeParameter('options', itemIndex);
                let pass = false;
                try {
                    pass = this.getNodeParameter('conditions', itemIndex, false, {
                        extractValue: true,
                    });
                }
                catch (error) {
                    if (!(0, utils_1.getTypeValidationParameter)(2.1)(this, itemIndex, options.looseTypeValidation) &&
                        !error.description) {
                        (0, set_1.default)(error, 'description', constants_1.ENABLE_LESS_STRICT_TYPE_VALIDATION);
                    }
                    (0, set_1.default)(error, 'context.itemIndex', itemIndex);
                    (0, set_1.default)(error, 'node', this.getNode());
                    throw error;
                }
                if (item.pairedItem === undefined) {
                    item.pairedItem = { item: itemIndex };
                }
                if (pass) {
                    keptItems.push(item);
                }
                else {
                    discardedItems.push(item);
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    discardedItems.push(item);
                }
                else {
                    if (error instanceof n8n_workflow_1.NodeOperationError) {
                        throw error;
                    }
                    if (error instanceof n8n_workflow_1.ApplicationError) {
                        (0, set_1.default)(error, 'context.itemIndex', itemIndex);
                        throw error;
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex,
                    });
                }
            }
        });
        return [keptItems, discardedItems];
    }
}
exports.FilterV2 = FilterV2;
//# sourceMappingURL=FilterV2.node.js.map