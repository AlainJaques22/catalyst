"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.siteRLC,
        description: 'Select the site to retrieve folders from',
    },
    {
        ...common_descriptions_1.folderRLC,
        description: 'Select the folder to download the file from',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
            },
        },
    },
    {
        ...common_descriptions_1.fileRLC,
        description: 'Select the file to download',
        displayOptions: {
            hide: {
                ...common_descriptions_1.untilSiteSelected,
                ...common_descriptions_1.untilFolderSelected,
            },
        },
    },
];
const displayOptions = {
    show: {
        resource: ['file'],
        operation: ['download'],
    },
};
exports.description = (0, n8n_workflow_1.updateDisplayOptions)(displayOptions, properties);
//# sourceMappingURL=download.operation.js.map