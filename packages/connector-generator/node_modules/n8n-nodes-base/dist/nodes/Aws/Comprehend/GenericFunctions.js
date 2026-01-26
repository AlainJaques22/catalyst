"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestREST = awsApiRequestREST;
exports.awsApiRequestSOAP = awsApiRequestSOAP;
const xml2js_1 = require("xml2js");
const GenericFunctions_1 = require("../GenericFunctions");
async function awsApiRequest(service, method, path, body, headers) {
    const { credentials, credentialsType } = await (0, GenericFunctions_1.getAwsCredentials)(this);
    const requestOptions = {
        qs: {
            service,
            path,
        },
        method,
        body,
        url: '',
        headers,
        region: credentials?.region,
    };
    return await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions);
}
async function awsApiRequestREST(service, method, path, body, headers) {
    const response = await awsApiRequest.call(this, service, method, path, body, headers);
    try {
        return JSON.parse(response);
    }
    catch (error) {
        return response;
    }
}
async function awsApiRequestSOAP(service, method, path, body, headers) {
    const response = await awsApiRequest.call(this, service, method, path, body, headers);
    try {
        return await new Promise((resolve, reject) => {
            (0, xml2js_1.parseString)(response, { explicitArray: false }, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    catch (error) {
        return response;
    }
}
//# sourceMappingURL=GenericFunctions.js.map