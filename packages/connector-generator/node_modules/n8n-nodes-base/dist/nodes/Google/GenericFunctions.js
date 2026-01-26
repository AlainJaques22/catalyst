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
exports.getGoogleAccessToken = getGoogleAccessToken;
exports.validateAndSetDate = validateAndSetDate;
const jwt = __importStar(require("jsonwebtoken"));
const luxon_1 = require("luxon");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../utils/utilities");
const googleServiceAccountScopes = {
    bigquery: ['https://www.googleapis.com/auth/bigquery'],
    books: ['https://www.googleapis.com/auth/books'],
    chat: ['https://www.googleapis.com/auth/chat.bot'],
    docs: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
    ],
    drive: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.photos.readonly',
    ],
    gmail: [
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
        'https://www.googleapis.com/auth/gmail.addons.current.message.action',
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
    ],
    sheetV1: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
    ],
    sheetV2: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.metadata',
    ],
    slides: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/presentations',
    ],
    translate: [
        'https://www.googleapis.com/auth/cloud-translation',
        'https://www.googleapis.com/auth/cloud-platform',
    ],
    firestore: [
        'https://www.googleapis.com/auth/datastore',
        'https://www.googleapis.com/auth/firebase',
    ],
    vertex: ['https://www.googleapis.com/auth/cloud-platform'],
};
async function getGoogleAccessToken(credentials, service) {
    //https://developers.google.com/identity/protocols/oauth2/service-account#httprest
    const scopes = googleServiceAccountScopes[service];
    const privateKey = (0, utilities_1.formatPrivateKey)(credentials.privateKey);
    credentials.email = (credentials.email || '').trim();
    const now = (0, moment_timezone_1.default)().unix();
    const signature = jwt.sign({
        iss: credentials.email,
        sub: credentials.delegatedEmail || credentials.email,
        scope: scopes.join(' '),
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    }, privateKey, {
        algorithm: 'RS256',
        header: {
            kid: privateKey,
            typ: 'JWT',
            alg: 'RS256',
        },
    });
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: signature,
        },
        uri: 'https://oauth2.googleapis.com/token',
        json: true,
    };
    return await this.helpers.request(options);
}
function validateAndSetDate(filter, key, timezone, context) {
    const date = luxon_1.DateTime.fromISO(filter[key]);
    if (date.isValid) {
        filter[key] = date.setZone(timezone).toISO();
    }
    else {
        throw new n8n_workflow_1.NodeOperationError(context.getNode(), `The value "${filter[key]}" is not a valid DateTime.`);
    }
}
//# sourceMappingURL=GenericFunctions.js.map