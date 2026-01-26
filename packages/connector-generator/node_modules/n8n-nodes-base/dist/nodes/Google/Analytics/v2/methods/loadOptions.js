"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDimensions = getDimensions;
exports.getMetrics = getMetrics;
exports.getViews = getViews;
exports.getProperties = getProperties;
exports.getDimensionsGA4 = getDimensionsGA4;
exports.getMetricsGA4 = getMetricsGA4;
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function getDimensions() {
    const returnData = [];
    const { items: dimensions } = await transport_1.googleApiRequest.call(this, 'GET', '', {}, {}, 'https://www.googleapis.com/analytics/v3/metadata/ga/columns');
    for (const dimension of dimensions) {
        if (dimension.attributes.type === 'DIMENSION' && dimension.attributes.status !== 'DEPRECATED') {
            returnData.push({
                name: dimension.attributes.uiName,
                value: dimension.id,
                description: dimension.attributes.description,
            });
        }
    }
    return (0, utils_1.sortLoadOptions)(returnData);
}
async function getMetrics() {
    const returnData = [];
    const { items: metrics } = await transport_1.googleApiRequest.call(this, 'GET', '', {}, {}, 'https://www.googleapis.com/analytics/v3/metadata/ga/columns');
    for (const metric of metrics) {
        if (metric.attributes.type === 'METRIC' && metric.attributes.status !== 'DEPRECATED') {
            returnData.push({
                name: metric.attributes.uiName,
                value: metric.id,
                description: metric.attributes.description,
            });
        }
    }
    return (0, utils_1.sortLoadOptions)(returnData);
}
async function getViews() {
    const returnData = [];
    const { items } = await transport_1.googleApiRequest.call(this, 'GET', '', {}, {}, 'https://www.googleapis.com/analytics/v3/management/accounts/~all/webproperties/~all/profiles');
    for (const item of items) {
        returnData.push({
            name: item.name,
            value: item.id,
            description: item.websiteUrl,
        });
    }
    return (0, utils_1.sortLoadOptions)(returnData);
}
async function getProperties() {
    const returnData = [];
    const { accounts } = await transport_1.googleApiRequest.call(this, 'GET', '', {}, {}, 'https://analyticsadmin.googleapis.com/v1alpha/accounts');
    for (const acount of accounts || []) {
        const { properties } = await transport_1.googleApiRequest.call(this, 'GET', '', {}, { filter: `parent:${acount.name}` }, 'https://analyticsadmin.googleapis.com/v1alpha/properties');
        if (properties && properties.length > 0) {
            for (const property of properties) {
                const name = property.displayName;
                const value = property.name.split('/')[1] || property.name;
                returnData.push({ name, value });
            }
        }
    }
    return (0, utils_1.sortLoadOptions)(returnData);
}
async function getDimensionsGA4() {
    const returnData = [];
    const propertyId = this.getNodeParameter('propertyId', undefined, {
        extractValue: true,
    });
    const { dimensions } = await transport_1.googleApiRequest.call(this, 'GET', `/v1beta/properties/${propertyId}/metadata`, {}, { fields: 'dimensions' });
    for (const dimension of dimensions) {
        returnData.push({
            name: dimension.uiName,
            value: dimension.apiName,
            description: dimension.description,
        });
    }
    return (0, utils_1.sortLoadOptions)(returnData);
}
async function getMetricsGA4() {
    const returnData = [];
    const propertyId = this.getNodeParameter('propertyId', undefined, {
        extractValue: true,
    });
    const { metrics } = await transport_1.googleApiRequest.call(this, 'GET', `/v1beta/properties/${propertyId}/metadata`, {}, { fields: 'metrics' });
    for (const metric of metrics) {
        returnData.push({
            name: metric.uiName,
            value: metric.apiName,
            description: metric.description,
        });
    }
    return (0, utils_1.sortLoadOptions)(returnData);
}
//# sourceMappingURL=loadOptions.js.map