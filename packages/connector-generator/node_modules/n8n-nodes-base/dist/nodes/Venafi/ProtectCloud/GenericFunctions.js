"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.venafiApiRequest = venafiApiRequest;
exports.venafiApiRequestAllItems = venafiApiRequestAllItems;
exports.encryptPassphrase = encryptPassphrase;
const nacl_factory = __importStar(require("js-nacl"));
const get_1 = __importDefault(require("lodash/get"));
const n8n_workflow_1 = require("n8n-workflow");
async function venafiApiRequest(method, resource, body = {}, qs = {}, option = {}) {
    const operation = this.getNodeParameter('operation', 0);
    const credentials = await this.getCredentials('venafiTlsProtectCloudApi');
    const region = credentials.region ?? 'cloud';
    const options = {
        headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
        },
        method,
        body,
        qs,
        uri: `https://api.venafi.${region}${resource}`,
        json: true,
    };
    if (Object.keys(option).length) {
        Object.assign(options, option);
    }
    // For cert download we don't need any headers
    // If we remove for everything the key fetch fails
    if (operation === 'download') {
        // We need content-type for keystore
        if (!resource.endsWith('keystore')) {
            delete options.headers.Accept;
            delete options.headers['content-type'];
        }
    }
    try {
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        return await this.helpers.requestWithAuthentication.call(this, 'venafiTlsProtectCloudApi', options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
async function venafiApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    const returnData = [];
    let responseData;
    do {
        responseData = await venafiApiRequest.call(this, method, endpoint, body, query);
        endpoint = (0, get_1.default)(responseData, '_links[0].Next');
        returnData.push.apply(returnData, responseData[propertyName]);
    } while (responseData._links?.[0].Next);
    return returnData;
}
async function encryptPassphrase(certificateId, passphrase, storePassphrase) {
    let dekHash = '';
    const dekResponse = await venafiApiRequest.call(this, 'GET', `/outagedetection/v1/certificates/${certificateId}`);
    if (dekResponse.dekHash) {
        dekHash = dekResponse.dekHash;
    }
    let pubKey = '';
    const pubKeyResponse = await venafiApiRequest.call(this, 'GET', `/v1/edgeencryptionkeys/${dekHash}`);
    if (pubKeyResponse.key) {
        pubKey = pubKeyResponse.key;
    }
    let encryptedKeyPass = '';
    let encryptedKeyStorePass = '';
    const promise = async () => {
        return await new Promise((resolve, reject) => {
            nacl_factory.instantiate((nacl) => {
                try {
                    const passphraseUTF8 = nacl.encode_utf8(passphrase);
                    const keyPassBuffer = nacl.crypto_box_seal(passphraseUTF8, Buffer.from(pubKey, 'base64'));
                    encryptedKeyPass = Buffer.from(keyPassBuffer).toString('base64');
                    const storePassphraseUTF8 = nacl.encode_utf8(storePassphrase);
                    const keyStorePassBuffer = nacl.crypto_box_seal(storePassphraseUTF8, Buffer.from(pubKey, 'base64'));
                    encryptedKeyStorePass = Buffer.from(keyStorePassBuffer).toString('base64');
                    return resolve([encryptedKeyPass, encryptedKeyStorePass]);
                }
                catch (error) {
                    return reject(error);
                }
            });
        });
    };
    return await promise();
}
//# sourceMappingURL=GenericFunctions.js.map