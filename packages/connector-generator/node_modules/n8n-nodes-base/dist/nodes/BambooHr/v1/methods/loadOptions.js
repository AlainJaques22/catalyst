"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeOffTypeID = getTimeOffTypeID;
exports.getCompanyFileCategories = getCompanyFileCategories;
exports.getEmployeeDocumentCategories = getEmployeeDocumentCategories;
exports.getEmployeeLocations = getEmployeeLocations;
exports.getDepartments = getDepartments;
exports.getDivisions = getDivisions;
exports.getEmployeeFields = getEmployeeFields;
const transport_1 = require("../transport");
// Get all the available channels
async function getTimeOffTypeID() {
    const returnData = [];
    const body = {};
    const requestMethod = 'GET';
    const endPoint = 'meta/time_off/types';
    const response = await transport_1.apiRequest.call(this, requestMethod, endPoint, body);
    const timeOffTypeIds = response.body.timeOffTypes;
    for (const item of timeOffTypeIds) {
        returnData.push({
            name: item.name,
            value: item.id,
        });
    }
    return returnData;
}
//@ts-ignore
const sort = (a, b) => {
    if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        return -1;
    }
    if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        return 1;
    }
    return 0;
};
async function getCompanyFileCategories() {
    const returnData = [];
    const body = {};
    const requestMethod = 'GET';
    const endPoint = 'files/view/';
    const response = await transport_1.apiRequest.call(this, requestMethod, endPoint, body);
    const categories = response.categories;
    for (const category of categories) {
        returnData.push({
            name: category.name,
            value: category.id,
        });
    }
    returnData.sort(sort);
    return returnData;
}
async function getEmployeeDocumentCategories() {
    const returnData = [];
    const body = {};
    const requestMethod = 'GET';
    const id = this.getCurrentNodeParameter('employeeId');
    const endPoint = `employees/${id}/files/view/`;
    const response = await transport_1.apiRequest.call(this, requestMethod, endPoint, body);
    const categories = response.categories;
    for (const category of categories) {
        returnData.push({
            name: category.name,
            value: category.id,
        });
    }
    returnData.sort(sort);
    return returnData;
}
async function getEmployeeLocations() {
    const returnData = [];
    const body = {};
    const requestMethod = 'GET';
    const endPoint = 'meta/lists/';
    //do not request all data?
    const fields = (await transport_1.apiRequest.call(this, requestMethod, endPoint, body, {}));
    const options = fields.filter((field) => field.fieldId === 18)[0].options;
    for (const option of options) {
        returnData.push({
            name: option.name,
            value: option.id,
        });
    }
    returnData.sort(sort);
    return returnData;
}
async function getDepartments() {
    const returnData = [];
    const body = {};
    const requestMethod = 'GET';
    const endPoint = 'meta/lists/';
    //do not request all data?
    const fields = (await transport_1.apiRequest.call(this, requestMethod, endPoint, body, {}));
    const options = fields.filter((field) => field.fieldId === 4)[0].options;
    for (const option of options) {
        returnData.push({
            name: option.name,
            value: option.id,
        });
    }
    returnData.sort(sort);
    return returnData;
}
async function getDivisions() {
    const returnData = [];
    const body = {};
    const requestMethod = 'GET';
    const endPoint = 'meta/lists/';
    //do not request all data?
    const fields = (await transport_1.apiRequest.call(this, requestMethod, endPoint, body, {}));
    const options = fields.filter((field) => field.fieldId === 1355)[0].options;
    for (const option of options) {
        returnData.push({
            name: option.name,
            value: option.id,
        });
    }
    returnData.sort(sort);
    return returnData;
}
async function getEmployeeFields() {
    const returnData = [];
    const body = {};
    const requestMethod = 'GET';
    const endPoint = 'employees/directory';
    const { fields } = await transport_1.apiRequest.call(this, requestMethod, endPoint, body);
    for (const field of fields) {
        returnData.push({
            name: field.name || field.id,
            value: field.id,
        });
    }
    returnData.sort(sort);
    returnData.unshift({
        name: '[All]',
        value: 'all',
    });
    return returnData;
}
//# sourceMappingURL=loadOptions.js.map