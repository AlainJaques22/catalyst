"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameKeys = void 0;
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const unset_1 = __importDefault(require("lodash/unset"));
const n8n_workflow_1 = require("n8n-workflow");
class RenameKeys {
    description = {
        displayName: 'Rename Keys',
        name: 'renameKeys',
        icon: 'fa:edit',
        iconColor: 'crimson',
        group: ['transform'],
        version: 1,
        description: 'Update item field names',
        defaults: {
            name: 'Rename Keys',
            color: '#772244',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Keys',
                name: 'keys',
                placeholder: 'Add new key',
                description: 'Adds a key which should be renamed',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                    sortable: true,
                },
                default: {},
                options: [
                    {
                        displayName: 'Key',
                        name: 'key',
                        values: [
                            {
                                displayName: 'Current Key Name',
                                name: 'currentKey',
                                type: 'string',
                                default: '',
                                placeholder: 'currentKey',
                                requiresDataPath: 'single',
                                description: 'The current name of the key. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.currentKey".',
                            },
                            {
                                displayName: 'New Key Name',
                                name: 'newKey',
                                type: 'string',
                                default: '',
                                placeholder: 'newKey',
                                description: 'The name the key should be renamed to. It is also possible to define deep keys by using dot-notation like for example: "level1.level2.newKey".',
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Additional Options',
                name: 'additionalOptions',
                type: 'collection',
                default: {},
                placeholder: 'Add option',
                options: [
                    {
                        displayName: 'Regex',
                        name: 'regexReplacement',
                        placeholder: 'Add new regular expression',
                        description: 'Adds a regular expression',
                        type: 'fixedCollection',
                        typeOptions: {
                            multipleValues: true,
                            sortable: true,
                        },
                        default: {},
                        options: [
                            {
                                displayName: 'Replacement',
                                name: 'replacements',
                                values: [
                                    {
                                        displayName: 'Be aware that by using regular expression previously renamed keys can be affected',
                                        name: 'regExNotice',
                                        type: 'notice',
                                        default: '',
                                    },
                                    {
                                        displayName: 'Regular Expression',
                                        name: 'searchRegex',
                                        type: 'string',
                                        default: '',
                                        placeholder: 'e.g. [N-n]ame',
                                        description: 'Regex to match the key name',
                                        hint: 'Learn more and test RegEx <a href="https://regex101.com/">here</a>',
                                    },
                                    {
                                        displayName: 'Replace With',
                                        name: 'replaceRegex',
                                        type: 'string',
                                        default: '',
                                        placeholder: 'replacedName',
                                        description: "The name the key/s should be renamed to. It's possible to use regex captures e.g. $1, $2, ...",
                                    },
                                    {
                                        displayName: 'Options',
                                        name: 'options',
                                        type: 'collection',
                                        default: {},
                                        placeholder: 'Add Regex Option',
                                        options: [
                                            {
                                                displayName: 'Case Insensitive',
                                                name: 'caseInsensitive',
                                                type: 'boolean',
                                                description: 'Whether to use case insensitive match',
                                                default: false,
                                            },
                                            {
                                                displayName: 'Max Depth',
                                                name: 'depth',
                                                type: 'number',
                                                default: -1,
                                                description: 'Maximum depth to replace keys',
                                                hint: 'Specify number for depth level (-1 for unlimited, 0 for top level only)',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
        hints: [
            {
                type: 'warning',
                message: 'Complex regex patterns like nested quantifiers .*+, ()*+, or multiple wildcards may cause performance issues. Consider using simpler patterns like [a-z]+ or \\w+ for better performance.',
                displayCondition: '={{ $parameter.additionalOptions.regexReplacement.replacements && $parameter.additionalOptions.regexReplacement.replacements.some(r => r.searchRegex && /(\\.\\*\\+|\\)\\*\\+|\\+\\*|\\*.*\\*|\\+.*\\+|\\?.*\\?|\\{[0-9]+,\\}|\\*{2,}|\\+{2,}|\\?{2,}|[a-zA-Z0-9]{4,}[\\*\\+]|\\([^)]*\\|[^)]*\\)[\\*\\+])/.test(r.searchRegex)) }}',
                whenToDisplay: 'always',
                location: 'outputPane',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        let item;
        let newItem;
        let renameKeys;
        let value;
        const renameKey = (key) => {
            if (key.currentKey === '' || key.newKey === '' || key.currentKey === key.newKey) {
                // Ignore all which do not have all the values set or if the new key is equal to the current key
                return;
            }
            value = (0, get_1.default)(item.json, key.currentKey);
            if (value === undefined) {
                return;
            }
            (0, set_1.default)(newItem.json, key.newKey, value);
            (0, unset_1.default)(newItem.json, key.currentKey);
        };
        const regexReplaceKey = (replacement) => {
            const { searchRegex, replaceRegex, options } = replacement;
            const { depth, caseInsensitive } = options;
            const flags = caseInsensitive ? 'i' : undefined;
            const regex = new RegExp(searchRegex, flags);
            const renameObjectKeys = (obj, objDepth) => {
                for (const key in obj) {
                    if (Array.isArray(obj)) {
                        // Don't rename array object references
                        if (objDepth !== 0) {
                            renameObjectKeys(obj[key], objDepth - 1);
                        }
                    }
                    else if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object' && objDepth !== 0) {
                            renameObjectKeys(obj[key], objDepth - 1);
                        }
                        if (key.match(regex)) {
                            const newKey = key.replace(regex, replaceRegex);
                            if (newKey !== key) {
                                obj[newKey] = obj[key];
                                delete obj[key];
                            }
                        }
                    }
                }
                return obj;
            };
            newItem.json = renameObjectKeys(newItem.json, depth);
        };
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                renameKeys = this.getNodeParameter('keys.key', itemIndex, []);
                const regexReplacements = this.getNodeParameter('additionalOptions.regexReplacement.replacements', itemIndex, []);
                item = items[itemIndex];
                // Copy the whole JSON data as data on any level can be renamed
                newItem = {
                    json: (0, n8n_workflow_1.deepCopy)(item.json),
                    pairedItem: {
                        item: itemIndex,
                    },
                };
                if (item.binary !== undefined) {
                    // Reference binary data if any exists. We can reference it
                    // as this nodes does not change it
                    newItem.binary = item.binary;
                }
                renameKeys.forEach(renameKey);
                regexReplacements.forEach(regexReplaceKey);
                returnData.push(newItem);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: itemIndex } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.RenameKeys = RenameKeys;
//# sourceMappingURL=RenameKeys.node.js.map