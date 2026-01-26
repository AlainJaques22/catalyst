"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_SHEETS_SHEET_URL_REGEX = exports.GOOGLE_DRIVE_FOLDER_URL_REGEX = exports.GOOGLE_DRIVE_FILE_URL_REGEX = void 0;
exports.GOOGLE_DRIVE_FILE_URL_REGEX = 'https:\\/\\/(?:drive|docs)\\.google\\.com(?:\\/.*|)\\/d\\/([0-9a-zA-Z\\-_]+)(?:\\/.*|)';
exports.GOOGLE_DRIVE_FOLDER_URL_REGEX = 'https:\\/\\/drive\\.google\\.com(?:\\/.*|)\\/folders\\/([0-9a-zA-Z\\-_]+)(?:\\/.*|)';
exports.GOOGLE_SHEETS_SHEET_URL_REGEX = 'https:\\/\\/docs\\.google\\.com\\/spreadsheets\\/d\\/[0-9a-zA-Z\\-_]+.*\\#gid=([0-9]+)';
//# sourceMappingURL=constants.js.map