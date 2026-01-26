"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAwsCredentials = getAwsCredentials;
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestREST = awsApiRequestREST;
exports.awsApiRequestSOAP = awsApiRequestSOAP;
const n8n_workflow_1 = require("n8n-workflow");
const xml2js_1 = require("xml2js");
async function getAwsCredentials(context) {
    let credentialsType = 'aws';
    try {
        const authentication = context.getNodeParameter('authentication', 0);
        if (authentication === 'assumeRole') {
            credentialsType = 'awsAssumeRole';
        }
    }
    catch (error) {
        context.logger.warn('Could not get authentication type');
    }
    const credentials = await context.getCredentials(credentialsType);
    return { credentials, credentialsType };
}
async function awsApiRequest(service, method, path, body, headers) {
    const { credentials, credentialsType } = await getAwsCredentials(this);
    const requestOptions = {
        qs: {
            service,
            path,
        },
        method,
        body: service === 'lambda' ? body : JSON.stringify(body),
        url: '',
        headers,
        region: credentials?.region,
    };
    try {
        return await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { parseXml: true });
    }
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