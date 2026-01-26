"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updadeQueryParameterConfig = exports.setAgentOptions = exports.prepareRequestBody = exports.binaryContentTypes = exports.getOAuth2AdditionalParameters = exports.REDACTED = exports.replaceNullValues = void 0;
exports.sanitizeUiMessage = sanitizeUiMessage;
exports.getSecrets = getSecrets;
exports.reduceAsync = reduceAsync;
const form_data_1 = __importDefault(require("form-data"));
const get_1 = __importDefault(require("lodash/get"));
const isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
const set_1 = __importDefault(require("lodash/set"));
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../utils/utilities");
const replaceNullValues = (item) => {
    if (item.json === null) {
        item.json = {};
    }
    return item;
};
exports.replaceNullValues = replaceNullValues;
exports.REDACTED = '**hidden**';
function isObject(obj) {
    return (0, isPlainObject_1.default)(obj);
}
function redact(obj, secrets) {
    if (typeof obj === 'string') {
        return secrets.reduce((safe, secret) => safe.replace(secret, exports.REDACTED), obj);
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => redact(item, secrets));
    }
    else if (isObject(obj)) {
        for (const [key, value] of Object.entries(obj)) {
            (0, n8n_workflow_1.setSafeObjectProperty)(obj, key, redact(value, secrets));
        }
    }
    return obj;
}
function sanitizeUiMessage(request, authDataKeys, secrets) {
    const { body, ...rest } = request;
    let sendRequest = { body };
    for (const [key, value] of Object.entries(rest)) {
        sendRequest[key] = (0, n8n_workflow_1.deepCopy)(value);
    }
    // Protect browser from sending large binary data
    if (Buffer.isBuffer(sendRequest.body) && sendRequest.body.length > 250000) {
        sendRequest = {
            ...request,
            body: `Binary data got replaced with this text. Original was a Buffer with a size of ${request.body.length} bytes.`,
        };
    }
    // Remove credential information
    for (const requestProperty of Object.keys(authDataKeys)) {
        sendRequest = {
            ...sendRequest,
            [requestProperty]: Object.keys(sendRequest[requestProperty]).reduce((acc, curr) => {
                acc[curr] = authDataKeys[requestProperty].includes(curr)
                    ? exports.REDACTED
                    : sendRequest[requestProperty][curr];
                return acc;
            }, {}),
        };
    }
    const HEADER_BLOCKLIST = new Set([
        'authorization',
        'x-api-key',
        'x-auth-token',
        'cookie',
        'proxy-authorization',
        'sslclientcert',
    ]);
    const headers = sendRequest.headers;
    if (headers) {
        for (const headerName of Object.keys(headers)) {
            if (HEADER_BLOCKLIST.has(headerName.toLowerCase())) {
                headers[headerName] = exports.REDACTED;
            }
        }
    }
    if (secrets && secrets.length > 0) {
        return redact(sendRequest, secrets);
    }
    return sendRequest;
}
function getSecrets(properties, credentials) {
    const sensitivePropNames = new Set(properties.filter((prop) => prop.typeOptions?.password).map((prop) => prop.name));
    const secrets = Object.entries(credentials)
        .filter(([propName]) => sensitivePropNames.has(propName))
        .map(([_, value]) => value)
        .filter((value) => typeof value === 'string');
    const oauthAccessToken = (0, get_1.default)(credentials, 'oauthTokenData.access_token');
    if (typeof oauthAccessToken === 'string') {
        secrets.push(oauthAccessToken);
    }
    return secrets;
}
const getOAuth2AdditionalParameters = (nodeCredentialType) => {
    const oAuth2Options = {
        bitlyOAuth2Api: {
            tokenType: 'Bearer',
        },
        boxOAuth2Api: {
            includeCredentialsOnRefreshOnBody: true,
        },
        ciscoWebexOAuth2Api: {
            tokenType: 'Bearer',
        },
        clickUpOAuth2Api: {
            keepBearer: false,
            tokenType: 'Bearer',
        },
        goToWebinarOAuth2Api: {
            tokenExpiredStatusCode: 403,
        },
        hubspotDeveloperApi: {
            tokenType: 'Bearer',
            includeCredentialsOnRefreshOnBody: true,
        },
        hubspotOAuth2Api: {
            tokenType: 'Bearer',
            includeCredentialsOnRefreshOnBody: true,
        },
        lineNotifyOAuth2Api: {
            tokenType: 'Bearer',
        },
        linkedInOAuth2Api: {
            tokenType: 'Bearer',
        },
        mailchimpOAuth2Api: {
            tokenType: 'Bearer',
        },
        mauticOAuth2Api: {
            includeCredentialsOnRefreshOnBody: true,
        },
        microsoftAzureMonitorOAuth2Api: {
            tokenExpiredStatusCode: 403,
        },
        microsoftDynamicsOAuth2Api: {
            property: 'id_token',
        },
        philipsHueOAuth2Api: {
            tokenType: 'Bearer',
        },
        raindropOAuth2Api: {
            includeCredentialsOnRefreshOnBody: true,
        },
        shopifyOAuth2Api: {
            tokenType: 'Bearer',
            keyToIncludeInAccessTokenHeader: 'X-Shopify-Access-Token',
        },
        slackOAuth2Api: {
            tokenType: 'Bearer',
            property: 'authed_user.access_token',
        },
        stravaOAuth2Api: {
            includeCredentialsOnRefreshOnBody: true,
        },
    };
    return oAuth2Options[nodeCredentialType];
};
exports.getOAuth2AdditionalParameters = getOAuth2AdditionalParameters;
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
exports.binaryContentTypes = [
    'image/',
    'audio/',
    'video/',
    'application/octet-stream',
    'application/gzip',
    'application/zip',
    'application/vnd.rar',
    'application/epub+zip',
    'application/x-bzip',
    'application/x-bzip2',
    'application/x-cdf',
    'application/vnd.amazon.ebook',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-fontobject',
    'application/vnd.oasis.opendocument.presentation',
    'application/pdf',
    'application/x-tar',
    'application/vnd.visio',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/x-7z-compressed',
];
async function reduceAsync(arr, reducer, init = Promise.resolve({})) {
    return await arr.reduce(async (promiseAcc, item) => {
        return await reducer(await promiseAcc, item);
    }, init);
}
const prepareRequestBody = async (parameters, bodyType, version, defaultReducer) => {
    if (bodyType === 'json' && version >= 4) {
        return await parameters.reduce(async (acc, entry) => {
            const result = await acc;
            (0, set_1.default)(result, entry.name, entry.value);
            return result;
        }, Promise.resolve({}));
    }
    else if (bodyType === 'multipart-form-data' && version >= 4.2) {
        const formData = new form_data_1.default();
        for (const parameter of parameters) {
            if (parameter.parameterType === 'formBinaryData') {
                const entry = await defaultReducer({}, parameter);
                const key = Object.keys(entry)[0];
                const data = entry[key];
                formData.append(key, data.value, data.options);
                continue;
            }
            formData.append(parameter.name, parameter.value);
        }
        return formData;
    }
    else {
        return await reduceAsync(parameters, defaultReducer);
    }
};
exports.prepareRequestBody = prepareRequestBody;
const setAgentOptions = (requestOptions, sslCertificates) => {
    if (sslCertificates) {
        const agentOptions = {};
        if (sslCertificates.ca)
            agentOptions.ca = (0, utilities_1.formatPrivateKey)(sslCertificates.ca);
        if (sslCertificates.cert)
            agentOptions.cert = (0, utilities_1.formatPrivateKey)(sslCertificates.cert);
        if (sslCertificates.key)
            agentOptions.key = (0, utilities_1.formatPrivateKey)(sslCertificates.key);
        if (sslCertificates.passphrase)
            agentOptions.passphrase = (0, utilities_1.formatPrivateKey)(sslCertificates.passphrase);
        requestOptions.agentOptions = agentOptions;
    }
};
exports.setAgentOptions = setAgentOptions;
const updadeQueryParameterConfig = (version) => {
    if (version < 4.3) {
        return (qs, name, value) => (qs[name] = value);
    }
    else {
        return (qs, name, value) => {
            if (qs[name] === undefined) {
                qs[name] = value;
            }
            else if (Array.isArray(qs[name])) {
                qs[name].push(value);
            }
            else {
                qs[name] = [qs[name], value];
            }
        };
    }
};
exports.updadeQueryParameterConfig = updadeQueryParameterConfig;
//# sourceMappingURL=GenericFunctions.js.map