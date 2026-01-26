"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSearch = fileSearch;
exports.driveSearch = driveSearch;
exports.driveSearchWithDefault = driveSearchWithDefault;
exports.folderSearch = folderSearch;
exports.folderSearchWithDefault = folderSearchWithDefault;
const interfaces_1 = require("../helpers/interfaces");
const utils_1 = require("../helpers/utils");
const transport_1 = require("../transport");
async function fileSearch(filter, paginationToken) {
    const query = ['trashed = false'];
    if (filter) {
        query.push(`name contains '${filter.replace("'", "\\'")}'`);
    }
    query.push(`mimeType != '${interfaces_1.DRIVE.FOLDER}'`);
    const res = await transport_1.googleApiRequest.call(this, 'GET', '/drive/v3/files', undefined, {
        q: query.join(' and '),
        pageToken: paginationToken,
        fields: 'nextPageToken,files(id,name,mimeType,webViewLink)',
        orderBy: 'name_natural',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        spaces: 'appDataFolder, drive',
        corpora: 'allDrives',
    });
    return {
        results: res.files.map((file) => ({
            name: file.name,
            value: file.id,
            url: file.webViewLink,
        })),
        paginationToken: res.nextPageToken,
    };
}
async function driveSearch(filter, paginationToken) {
    let res = { drives: [], nextPageToken: undefined };
    res = await transport_1.googleApiRequest.call(this, 'GET', '/drive/v3/drives', undefined, {
        q: filter ? `name contains '${filter.replace("'", "\\'")}'` : undefined,
        pageToken: paginationToken,
    });
    const results = [];
    res.drives.forEach((drive) => {
        results.push({
            name: drive.name,
            value: drive.id,
            url: `https://drive.google.com/drive/folders/${drive.id}`,
        });
    });
    return {
        results,
        paginationToken: res.nextPageToken,
    };
}
async function driveSearchWithDefault(filter, paginationToken) {
    const drives = await driveSearch.call(this, filter, paginationToken);
    let results = [];
    if (filter && !interfaces_1.RLC_DRIVE_DEFAULT.toLowerCase().includes(filter.toLowerCase())) {
        results = drives.results;
    }
    else {
        results = [
            {
                name: interfaces_1.RLC_DRIVE_DEFAULT,
                value: interfaces_1.RLC_DRIVE_DEFAULT,
                url: 'https://drive.google.com/drive/my-drive',
            },
            ...drives.results,
        ];
    }
    return {
        results,
        paginationToken: drives.paginationToken,
    };
}
async function folderSearch(filter, paginationToken) {
    const query = [];
    if (filter) {
        query.push(`name contains '${filter.replace("'", "\\'")}'`);
    }
    query.push(`mimeType = '${interfaces_1.DRIVE.FOLDER}'`);
    const qs = {
        q: query.join(' and '),
        pageToken: paginationToken,
        fields: 'nextPageToken,files(id,name,mimeType,webViewLink,parents,driveId)',
        orderBy: 'name_natural',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        spaces: 'appDataFolder, drive',
        corpora: 'allDrives',
    };
    let driveId;
    driveId = this.getNodeParameter('driveId', '');
    if (!driveId) {
        const searchFilter = this.getNodeParameter('filter', {});
        if (searchFilter?.driveId?.mode === 'url') {
            searchFilter.driveId.value = this.getNodeParameter('filter.folderId', undefined, {
                extractValue: true,
            });
        }
        driveId = searchFilter.driveId;
    }
    (0, utils_1.updateDriveScopes)(qs, driveId?.value);
    const res = await transport_1.googleApiRequest.call(this, 'GET', '/drive/v3/files', undefined, qs);
    const results = [];
    res.files.forEach((i) => {
        results.push({
            name: i.name,
            value: i.id,
            url: i.webViewLink,
        });
    });
    return {
        results,
        paginationToken: res.nextPageToken,
    };
}
async function folderSearchWithDefault(filter, paginationToken) {
    const folders = await folderSearch.call(this, filter, paginationToken);
    let results = [];
    const rootDefaultDisplayName = '/ (Root folder)';
    if (filter &&
        !(interfaces_1.RLC_FOLDER_DEFAULT.toLowerCase().includes(filter.toLowerCase()) ||
            rootDefaultDisplayName.toLowerCase().includes(filter.toLowerCase()))) {
        results = folders.results;
    }
    else {
        results = [
            {
                name: rootDefaultDisplayName,
                value: interfaces_1.RLC_FOLDER_DEFAULT,
                url: 'https://drive.google.com/drive',
            },
            ...folders.results,
        ];
    }
    return {
        results,
        paginationToken: folders.paginationToken,
    };
}
//# sourceMappingURL=listSearch.js.map