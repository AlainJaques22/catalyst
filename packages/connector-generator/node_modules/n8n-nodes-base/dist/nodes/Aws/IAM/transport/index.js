"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsApiRequest = awsApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("../helpers/constants");
const errorMapping = {
    403: 'The AWS credentials are not valid!',
};
async function awsApiRequest(opts) {
    const requestOptions = {
        baseURL: constants_1.BASE_URL,
        json: true,
        ...opts,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...(opts.headers ?? {}),
        },
    };
    if (opts.body) {
        requestOptions.body = new URLSearchParams(opts.body).toString();
    }
    try {
        const response = (await this.helpers.requestWithAuthentication.call(this, 'aws', requestOptions));
        return response;
    }
    catch (error) {
        const statusCode = (error?.statusCode || error?.cause?.statusCode);
        if (statusCode && errorMapping[statusCode]) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), {
                message: `AWS error response [${statusCode}]: ${errorMapping[statusCode]}`,
            });
        }
        else {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    }
}
//# sourceMappingURL=index.js.map