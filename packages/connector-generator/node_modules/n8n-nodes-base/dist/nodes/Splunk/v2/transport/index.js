"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splunkApiRequest = splunkApiRequest;
exports.splunkApiJsonRequest = splunkApiJsonRequest;
const n8n_workflow_1 = require("n8n-workflow");
const utils_1 = require("../helpers/utils");
async function splunkApiRequest(method, endpoint, body = {}, qs = {}) {
    const { baseUrl, allowUnauthorizedCerts } = await this.getCredentials('splunkApi');
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method,
        form: body,
        qs,
        uri: `${baseUrl}${endpoint}`,
        json: true,
        rejectUnauthorized: !allowUnauthorizedCerts,
        useQuerystring: true, // serialize roles array as `roles=A&roles=B`
    };
    if (!Object.keys(body).length) {
        delete options.body;
    }
    if (!Object.keys(qs).length) {
        delete options.qs;
    }
    let result;
    try {
        let attempts = 0;
        do {
            try {
                const response = await this.helpers.requestWithAuthentication.call(this, 'splunkApi', options);
                result = await (0, utils_1.parseXml)(response);
                return result;
            }
            catch (error) {
                if (attempts >= 5) {
                    throw error;
                }
                await (0, n8n_workflow_1.sleep)(1000);
                attempts++;
            }
        } while (true);
    }
    catch (error) {
        if (error instanceof n8n_workflow_1.NodeApiError)
            throw error;
        if (result === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No response from API call', {
                description: "Try to use 'Retry On Fail' option from node's settings",
            });
        }
        if (error?.cause?.code === 'ECONNREFUSED') {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), { ...error, code: 401 });
        }
        const rawError = (await (0, utils_1.parseXml)(error.error));
        error = (0, utils_1.extractErrorDescription)(rawError);
        if ('fatal' in error) {
            error = { error: error.fatal };
        }
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function splunkApiJsonRequest(method, endpoint, body = {}, qs = {}) {
    const { baseUrl, allowUnauthorizedCerts } = await this.getCredentials('splunkApi');
    qs.output_mode = 'json';
    const options = {
        method,
        body,
        qs: qs ?? {},
        url: `${baseUrl}${endpoint}`,
        json: true,
        skipSslCertificateValidation: allowUnauthorizedCerts,
    };
    if (!Object.keys(body).length)
        delete options.body;
    let result;
    try {
        let attempts = 0;
        do {
            try {
                result = await this.helpers.httpRequestWithAuthentication.call(this, 'splunkApi', options);
                if (result.entry) {
                    const { entry } = result;
                    return entry.map((e) => (0, utils_1.formatEntry)(e, true));
                }
                return result;
            }
            catch (error) {
                if (attempts >= 5) {
                    throw error;
                }
                await (0, n8n_workflow_1.sleep)(1000);
                attempts++;
            }
        } while (true);
    }
    catch (error) {
        if (error instanceof n8n_workflow_1.NodeApiError)
            throw error;
        if (result === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No response from API call', {
                description: "Try to use 'Retry On Fail' option from node's settings",
            });
        }
        if (error?.cause?.code === 'ECONNREFUSED') {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), { ...error, code: 401 });
        }
        if ('fatal' in error)
            error = { error: error.fatal };
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=index.js.map