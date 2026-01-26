"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestREST = awsApiRequestREST;
exports.awsApiRequestSOAP = awsApiRequestSOAP;
exports.simplify = simplify;
exports.validateCredentials = validateCredentials;
const aws4_1 = require("aws4");
const n8n_workflow_1 = require("n8n-workflow");
const url_1 = require("url");
const xml2js_1 = require("xml2js");
const GenericFunctions_1 = require("../GenericFunctions");
function getEndpointForService(service, credentials) {
    let endpoint;
    if (service === 'lambda' && credentials.lambdaEndpoint) {
        endpoint = credentials.lambdaEndpoint;
    }
    else if (service === 'sns' && credentials.snsEndpoint) {
        endpoint = credentials.snsEndpoint;
    }
    else {
        endpoint = `https://${service}.${credentials.region}.amazonaws.com`;
    }
    return endpoint.replace('{region}', credentials.region);
}
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
    try {
        return await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions);
    }
    catch (error) {
        if (error?.response?.data || error?.response?.body) {
            const errorMessage = error?.response?.data || error?.response?.body;
            if (errorMessage.includes('AccessDeniedException')) {
                const user = JSON.parse(errorMessage).Message.split(' ')[1];
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
                    message: 'Unauthorized — please check your AWS policy configuration',
                    description: `Make sure an identity-based policy allows user ${user} to perform textract:AnalyzeExpense`,
                });
            }
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error); // no XML parsing needed
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
function simplify(data) {
    const result = {};
    for (const document of data.ExpenseDocuments) {
        for (const field of document.SummaryFields) {
            result[field?.Type?.Text || field?.LabelDetection?.Text] = field.ValueDetection.Text;
        }
    }
    return result;
}
async function validateCredentials(decryptedCredentials, service) {
    const credentials = decryptedCredentials;
    // Concatenate path and instantiate URL object so it parses correctly query strings
    const endpoint = new url_1.URL(getEndpointForService(service, credentials) + '?Action=GetCallerIdentity&Version=2011-06-15');
    // Sign AWS API request with the user credentials
    const signOpts = {
        host: endpoint.host,
        method: 'POST',
        path: '?Action=GetCallerIdentity&Version=2011-06-15',
    };
    const securityHeaders = {
        accessKeyId: `${credentials.accessKeyId}`.trim(),
        secretAccessKey: `${credentials.secretAccessKey}`.trim(),
        sessionToken: credentials.temporaryCredentials
            ? `${credentials.sessionToken}`.trim()
            : undefined,
    };
    (0, aws4_1.sign)(signOpts, securityHeaders);
    const options = {
        headers: signOpts.headers,
        method: 'POST',
        uri: endpoint.href,
        body: signOpts.body,
    };
    const response = await this.helpers.request(options);
    return await new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(response, { explicitArray: false }, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}
//# sourceMappingURL=GenericFunctions.js.map