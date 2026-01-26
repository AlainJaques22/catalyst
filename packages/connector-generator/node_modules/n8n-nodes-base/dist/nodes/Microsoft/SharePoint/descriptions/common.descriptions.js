"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteRLC = exports.listRLC = exports.itemRLC = exports.folderRLC = exports.fileRLC = exports.untilSiteSelected = exports.untilListSelected = exports.untilItemSelected = exports.untilFolderSelected = void 0;
exports.untilFolderSelected = { folder: [''] };
exports.untilItemSelected = { item: [''] };
exports.untilListSelected = { list: [''] };
exports.untilSiteSelected = { site: [''] };
exports.fileRLC = {
    displayName: 'File',
    name: 'file',
    default: {
        mode: 'list',
        value: '',
    },
    description: 'Select the file to download',
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'getFiles',
                searchable: true,
            },
        },
        {
            displayName: 'By ID',
            name: 'id',
            placeholder: 'e.g. mysite',
            type: 'string',
        },
    ],
    placeholder: 'eg. my-file.pdf',
    required: true,
    type: 'resourceLocator',
};
exports.folderRLC = {
    displayName: 'Parent Folder',
    name: 'folder',
    default: {
        mode: 'list',
        value: '',
    },
    description: 'Select the folder to update the file in',
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'getFolders',
                searchable: true,
            },
        },
        {
            displayName: 'By ID',
            name: 'id',
            placeholder: 'e.g. myfolder',
            type: 'string',
        },
    ],
    placeholder: '/ (Library root)',
    required: true,
    type: 'resourceLocator',
};
exports.itemRLC = {
    displayName: 'Item',
    name: 'item',
    default: {
        mode: 'list',
        value: '',
    },
    description: 'Select the item you want to delete',
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'getItems',
                searchable: true,
            },
        },
        {
            displayName: 'By ID',
            name: 'id',
            placeholder: 'e.g. 1',
            type: 'string',
        },
    ],
    required: true,
    type: 'resourceLocator',
};
exports.listRLC = {
    displayName: 'List',
    name: 'list',
    default: {
        mode: 'list',
        value: '',
    },
    description: 'Select the list you want to retrieve',
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'getLists',
                searchable: true,
            },
        },
        {
            displayName: 'By ID',
            name: 'id',
            placeholder: 'e.g. mylist',
            type: 'string',
        },
    ],
    required: true,
    type: 'resourceLocator',
};
exports.siteRLC = {
    displayName: 'Site',
    name: 'site',
    default: {
        mode: 'list',
        value: '',
    },
    description: 'Select the site to retrieve folders from',
    modes: [
        {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            typeOptions: {
                searchListMethod: 'getSites',
                searchable: true,
            },
        },
        {
            displayName: 'By ID',
            name: 'id',
            placeholder: 'e.g. mysite',
            type: 'string',
        },
    ],
    required: true,
    type: 'resourceLocator',
};
//# sourceMappingURL=common.descriptions.js.map