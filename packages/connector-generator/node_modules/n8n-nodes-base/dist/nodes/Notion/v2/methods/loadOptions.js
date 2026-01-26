"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseProperties = getDatabaseProperties;
exports.getFilterProperties = getFilterProperties;
exports.getBlockTypes = getBlockTypes;
exports.getPropertySelectValues = getPropertySelectValues;
exports.getUsers = getUsers;
exports.getDatabaseIdFromPage = getDatabaseIdFromPage;
exports.getDatabaseOptionsFromPage = getDatabaseOptionsFromPage;
exports.getTimezones = getTimezones;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const GenericFunctions_1 = require("../../shared/GenericFunctions");
async function getDatabaseProperties() {
    const returnData = [];
    const databaseId = this.getCurrentNodeParameter('databaseId', {
        extractValue: true,
    });
    const { properties } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
    for (const key of Object.keys(properties)) {
        //remove parameters that cannot be set from the API.
        if (![
            'created_time',
            'last_edited_time',
            'created_by',
            'last_edited_by',
            'formula',
            'rollup',
        ].includes(properties[key].type)) {
            returnData.push({
                name: `${key}`,
                value: `${key}|${properties[key].type}`,
            });
        }
    }
    returnData.sort((a, b) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
            return -1;
        }
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
async function getFilterProperties() {
    const returnData = [];
    const databaseId = this.getCurrentNodeParameter('databaseId', {
        extractValue: true,
    });
    const { properties } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
    for (const key of Object.keys(properties)) {
        returnData.push({
            name: `${key}`,
            value: `${key}|${properties[key].type}`,
        });
    }
    returnData.sort((a, b) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
            return -1;
        }
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
async function getBlockTypes() {
    return (0, GenericFunctions_1.getBlockTypesOptions)();
}
async function getPropertySelectValues() {
    const [name, type] = this.getCurrentNodeParameter('&key').split('|');
    const databaseId = this.getCurrentNodeParameter('databaseId', {
        extractValue: true,
    });
    const resource = this.getCurrentNodeParameter('resource');
    const operation = this.getCurrentNodeParameter('operation');
    const { properties } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
    if (resource === 'databasePage') {
        if (['multi_select', 'select', 'status'].includes(type) && operation === 'getAll') {
            return properties[name][type].options.map((option) => ({
                name: option.name,
                value: option.name,
            }));
        }
        else if (['multi_select', 'select', 'status'].includes(type) &&
            ['create', 'update'].includes(operation)) {
            return properties[name][type].options.map((option) => ({
                name: option.name,
                value: option.name,
            }));
        }
    }
    return properties[name][type].options.map((option) => ({
        name: option.name,
        value: option.id,
    }));
}
async function getUsers() {
    const returnData = [];
    const users = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'GET', '/users');
    for (const user of users) {
        if (user.type === 'person') {
            returnData.push({
                name: user.name,
                value: user.id,
            });
        }
    }
    return returnData;
}
async function getDatabaseIdFromPage() {
    const returnData = [];
    const pageId = (0, GenericFunctions_1.extractPageId)(this.getCurrentNodeParameter('pageId', { extractValue: true }));
    const { parent: { database_id: databaseId }, } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/pages/${pageId}`);
    const { properties } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
    for (const key of Object.keys(properties)) {
        //remove parameters that cannot be set from the API.
        if (![
            'created_time',
            'last_edited_time',
            'created_by',
            'last_edited_by',
            'formula',
            'rollup',
        ].includes(properties[key].type)) {
            returnData.push({
                name: `${key}`,
                value: `${key}|${properties[key].type}`,
            });
        }
    }
    returnData.sort((a, b) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
            return -1;
        }
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
            return 1;
        }
        return 0;
    });
    return returnData;
}
async function getDatabaseOptionsFromPage() {
    const pageId = (0, GenericFunctions_1.extractPageId)(this.getCurrentNodeParameter('pageId', { extractValue: true }));
    const [name, type] = this.getCurrentNodeParameter('&key').split('|');
    const { parent: { database_id: databaseId }, } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/pages/${pageId}`);
    const { properties } = await GenericFunctions_1.notionApiRequest.call(this, 'GET', `/databases/${databaseId}`);
    return properties[name][type].options.map((option) => ({
        name: option.name,
        value: option.name,
    }));
}
// Get all the timezones to display them to user so that they can
// select them easily
async function getTimezones() {
    const returnData = [];
    for (const timezone of moment_timezone_1.default.tz.names()) {
        const timezoneName = timezone;
        const timezoneId = timezone;
        returnData.push({
            name: timezoneName,
            value: timezoneId,
        });
    }
    returnData.unshift({
        name: 'Default',
        value: 'default',
        description: 'Timezone set in n8n',
    });
    return returnData;
}
//# sourceMappingURL=loadOptions.js.map