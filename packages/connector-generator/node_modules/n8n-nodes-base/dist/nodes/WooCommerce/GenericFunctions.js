"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.woocommerceApiRequest = woocommerceApiRequest;
exports.woocommerceApiRequestAllItems = woocommerceApiRequestAllItems;
exports.getAutomaticSecret = getAutomaticSecret;
exports.setMetadata = setMetadata;
exports.toSnakeCase = toSnakeCase;
exports.setFields = setFields;
exports.adjustMetadata = adjustMetadata;
const change_case_1 = require("change-case");
const crypto_1 = require("crypto");
const omit_1 = __importDefault(require("lodash/omit"));
async function woocommerceApiRequest(method, resource, body = {}, qs = {}, uri, option = {}) {
    const credentials = await this.getCredentials('wooCommerceApi');
    let options = {
        method,
        qs,
        body,
        uri: uri || `${credentials.url}/wp-json/wc/v3${resource}`,
        json: true,
    };
    if (!Object.keys(body).length) {
        delete options.form;
    }
    options = Object.assign({}, options, option);
    return await this.helpers.requestWithAuthentication.call(this, 'wooCommerceApi', options);
}
async function woocommerceApiRequestAllItems(method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    let uri;
    query.per_page = 100;
    do {
        responseData = await woocommerceApiRequest.call(this, method, endpoint, body, query, uri, {
            resolveWithFullResponse: true,
        });
        const links = responseData.headers.link.split(',');
        const nextLink = links.find((link) => link.indexOf('rel="next"') !== -1);
        if (nextLink) {
            uri = nextLink.split(';')[0].replace(/<(.*)>/, '$1');
        }
        returnData.push.apply(returnData, responseData.body);
    } while (responseData.headers.link?.includes('rel="next"'));
    return returnData;
}
/**
 * Creates a secret from the credentials
 *
 */
function getAutomaticSecret(credentials) {
    const data = `${credentials.consumerKey},${credentials.consumerSecret}`;
    return (0, crypto_1.createHash)('md5').update(data).digest('hex');
}
function setMetadata(data) {
    for (let i = 0; i < data.length; i++) {
        //@ts-ignore\
        if (data[i].metadataUi?.metadataValues) {
            //@ts-ignore
            data[i].meta_data = data[i].metadataUi.metadataValues;
            //@ts-ignore
            delete data[i].metadataUi;
        }
        else {
            //@ts-ignore
            delete data[i].metadataUi;
        }
    }
}
function toSnakeCase(data) {
    if (!Array.isArray(data)) {
        data = [data];
    }
    let remove = false;
    for (let i = 0; i < data.length; i++) {
        for (const key of Object.keys(data[i])) {
            //@ts-ignore
            if (data[i][(0, change_case_1.snakeCase)(key)] === undefined) {
                remove = true;
            }
            //@ts-ignore
            data[i][(0, change_case_1.snakeCase)(key)] = data[i][key];
            if (remove) {
                //@ts-ignore
                delete data[i][key];
                remove = false;
            }
        }
    }
}
function setFields(fieldsToSet, body) {
    for (const fields in fieldsToSet) {
        if (fields === 'tags') {
            body.tags = fieldsToSet[fields].map((tag) => ({ id: parseInt(tag, 10) }));
        }
        else {
            body[(0, change_case_1.snakeCase)(fields.toString())] = fieldsToSet[fields];
        }
    }
}
function adjustMetadata(fields) {
    if (!fields.meta_data)
        return fields;
    return {
        ...(0, omit_1.default)(fields, ['meta_data']),
        meta_data: fields.meta_data.meta_data_fields,
    };
}
//# sourceMappingURL=GenericFunctions.js.map