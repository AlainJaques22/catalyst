"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleApiRequest = googleApiRequest;
exports.googleApiRequestAllItems = googleApiRequestAllItems;
exports.jsonToDocument = jsonToDocument;
exports.documentToJson = documentToJson;
exports.fullDocumentToJson = fullDocumentToJson;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../../GenericFunctions");
async function googleApiRequest(method, resource, body = {}, qs = {}, uri = null) {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method,
        body,
        qs,
        qsStringifyOptions: {
            arrayFormat: 'repeat',
        },
        uri: uri || `https://firestore.googleapis.com/v1/projects${resource}`,
        json: true,
    };
    try {
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        let credentialType = 'googleFirebaseCloudFirestoreOAuth2Api';
        const authentication = this.getNodeParameter('authentication', 0);
        if (authentication === 'serviceAccount') {
            const credentials = await this.getCredentials('googleApi');
            credentialType = 'googleApi';
            const { access_token } = await GenericFunctions_1.getGoogleAccessToken.call(this, credentials, 'firestore');
            options.headers.Authorization = `Bearer ${access_token}`;
        }
        return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}, uri = null) {
    const returnData = [];
    let responseData;
    query.pageSize = 100;
    do {
        responseData = await googleApiRequest.call(this, method, endpoint, body, query, uri);
        query.pageToken = responseData.nextPageToken;
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData.nextPageToken !== undefined && responseData.nextPageToken !== '');
    return returnData;
}
const isValidDate = (str) => (0, moment_timezone_1.default)(str, ['YYYY-MM-DD HH:mm:ss Z', moment_timezone_1.default.ISO_8601], true).isValid();
// Both functions below were taken from Stack Overflow jsonToDocument was fixed as it was unable to handle null values correctly
// https://stackoverflow.com/questions/62246410/how-to-convert-a-firestore-document-to-plain-json-and-vice-versa
// Great thanks to https://stackoverflow.com/users/3915246/mahindar
function jsonToDocument(value) {
    if (value === 'true' || value === 'false' || typeof value === 'boolean') {
        return { booleanValue: value };
    }
    else if (value === null) {
        return { nullValue: null };
    }
    else if (value !== '' && !isNaN(value)) {
        if (value.toString().indexOf('.') !== -1) {
            return { doubleValue: value };
        }
        else {
            return { integerValue: value };
        }
    }
    else if (isValidDate(value)) {
        const date = new Date(Date.parse(value));
        return { timestampValue: date.toISOString() };
    }
    else if (typeof value === 'string') {
        return { stringValue: value };
    }
    else if (value && value.constructor === Array) {
        return { arrayValue: { values: value.map((v) => jsonToDocument(v)) } };
    }
    else if (typeof value === 'object') {
        const obj = {};
        for (const key of Object.keys(value)) {
            if (value.hasOwnProperty(key) && (0, n8n_workflow_1.isSafeObjectProperty)(key)) {
                obj[key] = jsonToDocument(value[key]);
            }
        }
        return { mapValue: { fields: obj } };
    }
    return {};
}
function documentToJson(fields) {
    if (fields === undefined)
        return {};
    const result = {};
    for (const f of Object.keys(fields)) {
        const key = f, value = fields[f], isDocumentType = [
            'stringValue',
            'booleanValue',
            'doubleValue',
            'integerValue',
            'timestampValue',
            'mapValue',
            'arrayValue',
            'nullValue',
            'geoPointValue',
        ].find((t) => t === key);
        if (isDocumentType) {
            const item = [
                'stringValue',
                'booleanValue',
                'doubleValue',
                'integerValue',
                'timestampValue',
                'nullValue',
                'geoPointValue',
            ].find((t) => t === key);
            if (item) {
                return value;
            }
            else if ('mapValue' === key) {
                //@ts-ignore
                return documentToJson(value.fields || {});
            }
            else if ('arrayValue' === key) {
                // @ts-ignore
                const list = value.values;
                // @ts-ignore
                return list ? list.map((l) => documentToJson(l)) : [];
            }
        }
        else {
            // @ts-ignore
            result[key] = documentToJson(value);
        }
    }
    return result;
}
function fullDocumentToJson(data) {
    if (data === undefined) {
        return data;
    }
    return {
        _name: data.name,
        _id: data.id,
        _createTime: data.createTime,
        _updateTime: data.updateTime,
        ...documentToJson(data.fields),
    };
}
//# sourceMappingURL=GenericFunctions.js.map