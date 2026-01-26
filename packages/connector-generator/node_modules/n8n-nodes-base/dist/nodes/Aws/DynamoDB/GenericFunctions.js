"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
exports.awsApiRequestAllItems = awsApiRequestAllItems;
exports.copyInputItem = copyInputItem;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("../GenericFunctions");
async function awsApiRequest(service, method, path, body, headers) {
    const { credentials, credentialsType } = await (0, GenericFunctions_1.getAwsCredentials)(this);
    const requestOptions = {
        qs: {
            service,
            path,
        },
        method,
        body: JSON.stringify(body),
        url: '',
        headers,
        region: credentials?.region,
    };
    try {
        return JSON.parse((await this.helpers.requestWithAuthentication.call(this, credentialsType, requestOptions)));
    }
    catch (error) {
        const statusCode = (error.statusCode || error.cause?.statusCode);
        let errorMessage = error.response?.body?.message || error.response?.body?.Message || error.message;
        if (statusCode === 403) {
            if (errorMessage === 'The security token included in the request is invalid.') {
                throw new n8n_workflow_1.ApplicationError('The AWS credentials are not valid!', { level: 'warning' });
            }
            else if (errorMessage.startsWith('The request signature we calculated does not match the signature you provided')) {
                throw new n8n_workflow_1.ApplicationError('The AWS credentials are not valid!', { level: 'warning' });
            }
        }
        if (error.cause?.error) {
            try {
                errorMessage = JSON.parse(error.cause?.error).message;
            }
            catch (ex) { }
        }
        throw new n8n_workflow_1.ApplicationError(`AWS error response [${statusCode}]: ${errorMessage}`, {
            level: 'warning',
        });
    }
}
async function awsApiRequestAllItems(service, method, path, body, headers) {
    const returnData = [];
    let responseData;
    do {
        const originalHeaders = Object.assign({}, headers); //The awsapirequest function adds the hmac signature to the headers, if we pass the modified headers back in on the next call it will fail with invalid signature
        responseData = await awsApiRequest.call(this, service, method, path, body, originalHeaders);
        if (responseData.LastEvaluatedKey) {
            body.ExclusiveStartKey = responseData.LastEvaluatedKey;
        }
        returnData.push(...responseData.Items);
    } while (responseData.LastEvaluatedKey !== undefined);
    return returnData;
}
function copyInputItem(item, properties) {
    // Prepare the data to insert and copy it to be returned
    const newItem = {};
    for (const property of properties) {
        if (item.json[property] === undefined) {
            newItem[property] = null;
        }
        else {
            newItem[property] = (0, n8n_workflow_1.deepCopy)(item.json[property]);
        }
    }
    return newItem;
}
//# sourceMappingURL=GenericFunctions.js.map