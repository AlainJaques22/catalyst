"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesNames = getCategoriesNames;
exports.getFolders = getFolders;
exports.getCalendarGroups = getCalendarGroups;
const transport_1 = require("../transport");
async function getCategoriesNames() {
    const returnData = [];
    const categories = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', '/outlook/masterCategories');
    for (const category of categories) {
        returnData.push({
            name: category.displayName,
            value: category.displayName,
        });
    }
    return returnData;
}
async function getFolders() {
    const returnData = [];
    const response = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', '/mailFolders', {});
    const folders = await transport_1.getSubfolders.call(this, response);
    for (const folder of folders) {
        returnData.push({
            name: folder.displayName,
            value: folder.id,
        });
    }
    return returnData;
}
async function getCalendarGroups() {
    const returnData = [];
    const calendars = await transport_1.microsoftApiRequestAllItems.call(this, 'value', 'GET', '/calendarGroups', {});
    for (const calendar of calendars) {
        returnData.push({
            name: calendar.name,
            value: calendar.id,
        });
    }
    return returnData;
}
//# sourceMappingURL=loadOptions.js.map