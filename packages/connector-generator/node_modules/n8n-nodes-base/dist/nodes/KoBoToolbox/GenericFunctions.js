"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.koBoToolboxApiRequest = koBoToolboxApiRequest;
exports.koBoToolboxRawRequest = koBoToolboxRawRequest;
exports.parseStringList = parseStringList;
exports.formatSubmission = formatSubmission;
exports.downloadAttachments = downloadAttachments;
exports.loadForms = loadForms;
const clone_1 = __importDefault(require("lodash/clone"));
const compact_1 = __importDefault(require("lodash/compact"));
const concat_1 = __importDefault(require("lodash/concat"));
const escapeRegExp_1 = __importDefault(require("lodash/escapeRegExp"));
const every_1 = __importDefault(require("lodash/every"));
const first_1 = __importDefault(require("lodash/first"));
const isArray_1 = __importDefault(require("lodash/isArray"));
const isString_1 = __importDefault(require("lodash/isString"));
const last_1 = __importDefault(require("lodash/last"));
const set_1 = __importDefault(require("lodash/set"));
const some_1 = __importDefault(require("lodash/some"));
const split_1 = __importDefault(require("lodash/split"));
const toNumber_1 = __importDefault(require("lodash/toNumber"));
const toString_1 = __importDefault(require("lodash/toString"));
const trim_1 = __importDefault(require("lodash/trim"));
async function koBoToolboxApiRequest(option = {}) {
    const credentials = await this.getCredentials('koBoToolboxApi');
    // Set up pagination / scrolling
    const returnAll = !!option.returnAll;
    if (returnAll) {
        // Override manual pagination options
        (0, set_1.default)(option, 'qs.limit', 3000);
        // Don't pass this custom param to helpers.httpRequest
        delete option.returnAll;
    }
    const options = {
        url: '',
        headers: {
            Accept: 'application/json',
        },
        json: true,
    };
    if (Object.keys(option)) {
        Object.assign(options, option);
    }
    if (options.url && !/^http(s)?:/.test(options.url)) {
        options.url = credentials.URL + options.url;
    }
    let results = null;
    let keepLooking = true;
    while (keepLooking) {
        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'koBoToolboxApi', options);
        // Append or set results
        results = response.results ? (0, concat_1.default)(results || [], response.results) : response;
        if (returnAll && response.next) {
            options.url = response.next;
        }
        else {
            keepLooking = false;
        }
    }
    return results;
}
async function koBoToolboxRawRequest(option) {
    const credentials = await this.getCredentials('koBoToolboxApi');
    if (option.url && !/^http(s)?:/.test(option.url)) {
        option.url = credentials.URL + option.url;
    }
    return await this.helpers.httpRequestWithAuthentication.call(this, 'koBoToolboxApi', option);
}
function parseGeoPoint(geoPoint) {
    // Check if it looks like a "lat lon z precision" flat string e.g. "-1.931161 30.079811 0 0" (lat, lon, elevation, precision)
    // NOTE: we are discarding the elevation and precision values since they're not (well) supported in GeoJSON
    const coordinates = (0, split_1.default)(geoPoint, ' ');
    if (coordinates.length >= 2 &&
        (0, every_1.default)(coordinates, (coord) => coord && /^-?\d+(?:\.\d+)?$/.test((0, toString_1.default)(coord)))) {
        // NOTE: GeoJSON uses lon, lat, while most common systems use lat, lon order!
        return [(0, toNumber_1.default)(coordinates[1]), (0, toNumber_1.default)(coordinates[0])];
    }
    return null;
}
function parseStringList(value) {
    return (0, split_1.default)((0, toString_1.default)(value), /[\s,]+/);
}
const matchWildcard = (value, pattern) => {
    const regex = new RegExp(`^${(0, escapeRegExp_1.default)(pattern).replace('\\*', '.*')}$`);
    return regex.test(value);
};
const formatValue = (value, format) => {
    if ((0, isString_1.default)(value)) {
        // Sanitize value
        value = (0, toString_1.default)(value);
        // Parse geoPoints
        const geoPoint = parseGeoPoint(value);
        if (geoPoint) {
            return {
                type: 'Point',
                coordinates: geoPoint,
            };
        }
        // Check if it's a closed polygon geo-shape: -1.954117 30.085159 0 0;-1.955005 30.084622 0 0;-1.956057 30.08506 0 0;-1.956393 30.086229 0 0;-1.955853 30.087143 0 0;-1.954609 30.08725 0 0;-1.953966 30.086735 0 0;-1.953805 30.085897 0 0;-1.954117 30.085159 0 0
        const points = value.split(';');
        if (points.length >= 2 && /^[-\d\.\s;]+$/.test(value)) {
            // Using the GeoJSON format as per https://geojson.org/
            const coordinates = (0, compact_1.default)(points.map(parseGeoPoint));
            // Only return if all values are properly parsed
            if (coordinates.length === points.length) {
                // If the shape is closed, declare it as Polygon, otherwise as LineString
                if ((0, first_1.default)(points) === (0, last_1.default)(points)) {
                    return {
                        type: 'Polygon',
                        coordinates: [coordinates],
                    };
                }
                return { type: 'LineString', coordinates };
            }
        }
        // Parse numbers
        if ('number' === format) {
            return (0, toNumber_1.default)(value);
        }
        // Split multi-select
        if ('multiSelect' === format) {
            return (0, split_1.default)((0, toString_1.default)(value), ' ');
        }
    }
    return value;
};
function formatSubmission(submission, selectMasks = [], numberMasks = []) {
    // Create a shallow copy of the submission
    const response = {};
    for (const key of Object.keys(submission)) {
        let value = (0, clone_1.default)(submission[key]);
        // Sanitize key names: split by group, trim _
        const sanitizedKey = key
            .split('/')
            .map((k) => (0, trim_1.default)(k, ' _'))
            .join('.');
        const leafKey = sanitizedKey.split('.').pop() || '';
        let format = 'string';
        if ((0, some_1.default)(numberMasks, (mask) => matchWildcard(leafKey, mask))) {
            format = 'number';
        }
        if ((0, some_1.default)(selectMasks, (mask) => matchWildcard(leafKey, mask))) {
            format = 'multiSelect';
        }
        value = formatValue(value, format);
        (0, set_1.default)(response, sanitizedKey, value);
    }
    // Reformat _geolocation
    if ((0, isArray_1.default)(response.geolocation) &&
        response.geolocation.length === 2 &&
        response.geolocation[0] &&
        response.geolocation[1]) {
        response.geolocation = {
            type: 'Point',
            coordinates: [response.geolocation[1], response.geolocation[0]],
        };
    }
    return response;
}
async function downloadAttachments(submission, options) {
    // Initialize return object with the original submission JSON content
    const binaryItem = {
        json: {
            ...submission,
        },
        binary: {},
    };
    const credentials = await this.getCredentials('koBoToolboxApi');
    // Look for attachment links - there can be more than one
    const attachmentList = (submission._attachments || submission.attachments);
    if (attachmentList?.length) {
        for (const [index, attachment] of attachmentList.entries()) {
            // look for the question name linked to this attachment
            const fileName = attachment.filename;
            const sanitizedFileName = (0, toString_1.default)(fileName).replace(/_[^_]+(?=\.\w+)/, ''); // strip suffix
            let relatedQuestion = null;
            if ('question' === options.binaryNamingScheme) {
                for (const question of Object.keys(submission)) {
                    // The logic to map attachments to question is sometimes ambiguous:
                    // - If the attachment is linked to a question, the question's value is the same as the attachment's filename (with spaces replaced by underscores)
                    // - BUT sometimes the attachment's filename has an extra suffix, e.g. "My_Picture_0OdlaKJ.jpg", would map to the question "picture": "My Picture.jpg"
                    const sanitizedQuestionValue = (0, toString_1.default)(submission[question]).replace(/\s/g, '_'); // replace spaces with underscores
                    if (sanitizedFileName === sanitizedQuestionValue) {
                        relatedQuestion = question;
                        // Just use the first match...
                        break;
                    }
                }
            }
            // Download attachment
            // NOTE: this needs to follow redirects (possibly across domains), while keeping Authorization headers
            // The Axios client will not propagate the Authorization header on redirects (see https://github.com/axios/axios/issues/3607), so we need to follow ourselves...
            let response = null;
            const attachmentUrl = attachment[options.version] || attachment.download_url;
            let final = false, redir = 0;
            const axiosOptions = {
                url: attachmentUrl,
                method: 'GET',
                headers: {
                    Authorization: `Token ${credentials.token}`,
                },
                ignoreHttpStatusErrors: true,
                returnFullResponse: true,
                disableFollowRedirect: true,
                encoding: 'arraybuffer',
            };
            while (!final && redir < 5) {
                response = await this.helpers.httpRequest(axiosOptions);
                if (response?.headers.location) {
                    // Follow redirect
                    axiosOptions.url = response.headers.location;
                    redir++;
                }
                else {
                    final = true;
                }
            }
            if (response?.body) {
                // Use the provided prefix if any, otherwise try to use the original question name
                let binaryName;
                if ('question' === options.binaryNamingScheme && relatedQuestion) {
                    binaryName = relatedQuestion;
                }
                else {
                    binaryName = `${options.dataPropertyAttachmentsPrefixName || 'attachment_'}${index}`;
                }
                binaryItem.binary[binaryName] = await this.helpers.prepareBinaryData(response.body, fileName);
            }
        }
    }
    else {
        delete binaryItem.binary;
    }
    // Add item to final output - even if there's no attachment retrieved
    return binaryItem;
}
async function loadForms() {
    const responseData = await koBoToolboxApiRequest.call(this, {
        url: '/api/v2/assets/',
        qs: {
            q: 'asset_type:survey',
            ordering: 'name',
        },
        scroll: true,
    });
    return responseData?.map((survey) => ({ name: survey.name, value: survey.uid })) || [];
}
//# sourceMappingURL=GenericFunctions.js.map