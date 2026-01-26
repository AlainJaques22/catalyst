"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUrlValidationRegexp = exports.blockUrlExtractionRegexp = exports.databasePageUrlValidationRegexp = exports.databasePageUrlExtractionRegexp = exports.databaseUrlValidationRegexp = exports.databaseUrlExtractionRegexp = exports.idValidationRegexp = exports.idExtractionRegexp = void 0;
const notionIdRegexp = '[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}';
exports.idExtractionRegexp = `^(${notionIdRegexp})`;
exports.idValidationRegexp = `${exports.idExtractionRegexp}.*`;
const baseUrlRegexp = '(?:https|http)://www\\.notion\\.so/(?:[a-z0-9-]{2,}/)?';
exports.databaseUrlExtractionRegexp = `${baseUrlRegexp}(${notionIdRegexp})`;
exports.databaseUrlValidationRegexp = `${exports.databaseUrlExtractionRegexp}.*`;
exports.databasePageUrlExtractionRegexp = `${baseUrlRegexp}(?:[a-zA-Z0-9-]{1,}-)?(${notionIdRegexp})`;
exports.databasePageUrlValidationRegexp = `${exports.databasePageUrlExtractionRegexp}.*`;
exports.blockUrlExtractionRegexp = `${baseUrlRegexp}(?:[a-zA-Z0-9-]{2,}-)?(${notionIdRegexp})`;
exports.blockUrlValidationRegexp = `${exports.blockUrlExtractionRegexp}.*`;
//# sourceMappingURL=constants.js.map