"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftOneDriveTrigger = void 0;
const luxon_1 = require("luxon");
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const TriggerDescription_1 = require("./TriggerDescription");
class MicrosoftOneDriveTrigger {
    description = {
        displayName: 'Microsoft OneDrive Trigger',
        name: 'microsoftOneDriveTrigger',
        icon: 'file:oneDrive.svg',
        group: ['trigger'],
        version: 1,
        description: 'Trigger for Microsoft OneDrive API.',
        subtitle: '={{($parameter["event"])}}',
        defaults: {
            name: 'Microsoft OneDrive Trigger',
        },
        credentials: [
            {
                name: 'microsoftOneDriveOAuth2Api',
                required: true,
            },
        ],
        polling: true,
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [...TriggerDescription_1.triggerDescription],
    };
    methods = {
        loadOptions: {},
    };
    async poll() {
        const workflowData = this.getWorkflowStaticData('node');
        let responseData;
        const lastLink = workflowData.LastLink ||
            'https://graph.microsoft.com/v1.0/me/drive/root/delta?token=latest';
        const now = luxon_1.DateTime.now().toUTC();
        const start = luxon_1.DateTime.fromISO(workflowData.lastTimeChecked) || now;
        const end = now;
        const event = this.getNodeParameter('event', 'fileCreated');
        const watch = this.getNodeParameter('watch', 'anyFile');
        const watchFolder = this.getNodeParameter('watchFolder', false) || false;
        const folderChild = this.getNodeParameter('options.folderChild', false) || false;
        let eventType = 'created';
        let eventResource = 'file';
        if (event.includes('Updated')) {
            eventType = 'updated';
        }
        if (event.includes('folder')) {
            eventResource = 'folder';
        }
        try {
            if (this.getMode() === 'manual') {
                responseData = (await GenericFunctions_1.microsoftApiRequest.call(this, 'GET', '', {}, {}, 'https://graph.microsoft.com/v1.0/me/drive/root/delta')).value;
            }
            else {
                const response = (await GenericFunctions_1.microsoftApiRequestAllItemsDelta.call(this, lastLink, start, eventType));
                responseData = response.returnData;
                workflowData.LastLink = response.deltaLink;
            }
            workflowData.lastTimeChecked = end.toISO();
            if (watch === 'selectedFile') {
                const fileId = this.getNodeParameter('fileId', '', {
                    extractValue: true,
                }).replace('%21', '!');
                if (fileId) {
                    responseData = responseData.filter((item) => item.id === fileId);
                }
            }
            if (!folderChild &&
                (watch === 'oneSelectedFolder' || watch === 'selectedFolder' || watchFolder)) {
                const folderId = this.getNodeParameter('folderId', '', {
                    extractValue: true,
                }).replace('%21', '!');
                if (folderId) {
                    if (watch === 'oneSelectedFolder') {
                        responseData = responseData.filter((item) => item.id === folderId);
                    }
                    else {
                        responseData = responseData.filter((item) => item.parentReference.id === folderId);
                    }
                }
            }
            if (folderChild && (watch === 'selectedFolder' || watchFolder)) {
                const folderId = this.getNodeParameter('folderId', '', {
                    extractValue: true,
                }).replace('%21', '!');
                const folderPath = await GenericFunctions_1.getPath.call(this, folderId);
                responseData = responseData.filter((item) => {
                    const path = item.parentReference?.path;
                    return typeof path === 'string' && path.startsWith(folderPath);
                });
            }
            responseData = responseData.filter((item) => item[eventResource]);
            if (!responseData?.length) {
                return null;
            }
            const simplify = this.getNodeParameter('simple');
            if (simplify) {
                responseData = responseData.map((x) => ({
                    id: x.id,
                    createdDateTime: x.fileSystemInfo?.createdDateTime,
                    lastModifiedDateTime: x.fileSystemInfo?.lastModifiedDateTime,
                    name: x.name,
                    webUrl: x.webUrl,
                    size: x.size,
                    path: x.parentReference?.path || '',
                    mimeType: x.file?.mimeType || '',
                }));
            }
            return [this.helpers.returnJsonArray(responseData)];
        }
        catch (error) {
            if (this.getMode() === 'manual' || !workflowData.lastTimeChecked) {
                throw error;
            }
            const workflow = this.getWorkflow();
            const node = this.getNode();
            this.logger.error(`There was a problem in '${node.name}' node in workflow '${workflow.id}': '${error.description}'`, {
                node: node.name,
                workflowId: workflow.id,
                error,
            });
            throw error;
        }
        return null;
    }
}
exports.MicrosoftOneDriveTrigger = MicrosoftOneDriveTrigger;
//# sourceMappingURL=MicrosoftOneDriveTrigger.node.js.map