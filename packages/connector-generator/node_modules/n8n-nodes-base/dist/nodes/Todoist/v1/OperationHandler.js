"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncHandler = exports.MoveHandler = exports.UpdateHandler = exports.ReopenHandler = exports.GetAllHandler = exports.GetHandler = exports.DeleteHandler = exports.CloseHandler = exports.CreateHandler = exports.CommandTypes = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const uuid_1 = require("uuid");
const GenericFunctions_1 = require("../GenericFunctions");
exports.CommandTypes = {
    ITEM_MOVE: 'item_move',
    ITEM_ADD: 'item_add',
    ITEM_UPDATE: 'item_update',
    ITEM_REORDER: 'item_reorder',
    ITEM_DELETE: 'item_delete',
    ITEM_COMPLETE: 'item_complete',
};
async function getLabelNameFromId(ctx, labelIds) {
    const labelList = [];
    for (const label of labelIds) {
        const thisLabel = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/labels/${label}`);
        labelList.push(thisLabel.name);
    }
    return labelList;
}
class CreateHandler {
    async handleOperation(ctx, itemIndex) {
        //https://developer.todoist.com/rest/v2/#create-a-new-task
        const content = ctx.getNodeParameter('content', itemIndex);
        const projectId = ctx.getNodeParameter('project', itemIndex, undefined, {
            extractValue: true,
        });
        const labels = ctx.getNodeParameter('labels', itemIndex);
        const options = ctx.getNodeParameter('options', itemIndex);
        const body = {
            content,
            project_id: projectId,
            priority: options.priority ? parseInt(options.priority, 10) : 1,
        };
        if (options.description) {
            body.description = options.description;
        }
        if (options.dueDateTime) {
            body.due_datetime = (0, GenericFunctions_1.FormatDueDatetime)(options.dueDateTime);
        }
        if (options.dueString) {
            body.due_string = options.dueString;
        }
        if (labels !== undefined && labels.length !== 0) {
            body.labels = await getLabelNameFromId(ctx, labels);
        }
        if (options.section) {
            body.section_id = options.section;
        }
        if (options.dueLang) {
            body.due_lang = options.dueLang;
        }
        if (options.parentId) {
            body.parent_id = options.parentId;
        }
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', '/tasks', body);
        return {
            data,
        };
    }
}
exports.CreateHandler = CreateHandler;
class CloseHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('taskId', itemIndex);
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/tasks/${id}/close`);
        return {
            success: true,
        };
    }
}
exports.CloseHandler = CloseHandler;
class DeleteHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('taskId', itemIndex);
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'DELETE', `/tasks/${id}`);
        return {
            success: true,
        };
    }
}
exports.DeleteHandler = DeleteHandler;
class GetHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('taskId', itemIndex);
        const responseData = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/tasks/${id}`);
        return {
            data: responseData,
        };
    }
}
exports.GetHandler = GetHandler;
class GetAllHandler {
    async handleOperation(ctx, itemIndex) {
        //https://developer.todoist.com/rest/v2/#get-active-tasks
        const returnAll = ctx.getNodeParameter('returnAll', itemIndex);
        const filters = ctx.getNodeParameter('filters', itemIndex);
        const qs = {};
        if (filters.projectId) {
            qs.project_id = filters.projectId;
        }
        if (filters.labelId) {
            qs.label = filters.labelId;
        }
        if (filters.filter) {
            qs.filter = filters.filter;
        }
        if (filters.lang) {
            qs.lang = filters.lang;
        }
        if (filters.ids) {
            qs.ids = filters.ids;
        }
        let responseData = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/tasks', {}, qs);
        if (!returnAll) {
            const limit = ctx.getNodeParameter('limit', itemIndex);
            responseData = responseData.splice(0, limit);
        }
        return {
            data: responseData,
        };
    }
}
exports.GetAllHandler = GetAllHandler;
async function getSectionIds(ctx, projectId) {
    const sections = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/sections', {}, { project_id: projectId });
    return new Map(sections.map((s) => [s.name, s.id]));
}
class ReopenHandler {
    async handleOperation(ctx, itemIndex) {
        //https://developer.todoist.com/rest/v2/#get-an-active-task
        const id = ctx.getNodeParameter('taskId', itemIndex);
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/tasks/${id}/reopen`);
        return {
            success: true,
        };
    }
}
exports.ReopenHandler = ReopenHandler;
class UpdateHandler {
    async handleOperation(ctx, itemIndex) {
        //https://developer.todoist.com/rest/v2/#update-a-task
        const id = ctx.getNodeParameter('taskId', itemIndex);
        const updateFields = ctx.getNodeParameter('updateFields', itemIndex);
        const body = {};
        if (updateFields.content) {
            body.content = updateFields.content;
        }
        if (updateFields.priority) {
            body.priority = parseInt(updateFields.priority, 10);
        }
        if (updateFields.description) {
            body.description = updateFields.description;
        }
        if (updateFields.dueDateTime) {
            body.due_datetime = (0, GenericFunctions_1.FormatDueDatetime)(updateFields.dueDateTime);
        }
        if (updateFields.dueString) {
            body.due_string = updateFields.dueString;
        }
        if (updateFields.labels !== undefined &&
            Array.isArray(updateFields.labels) &&
            updateFields.labels.length !== 0) {
            body.labels = await getLabelNameFromId(ctx, updateFields.labels);
        }
        if (updateFields.dueLang) {
            body.due_lang = updateFields.dueLang;
        }
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/tasks/${id}`, body);
        return { success: true };
    }
}
exports.UpdateHandler = UpdateHandler;
class MoveHandler {
    async handleOperation(ctx, itemIndex) {
        //https://api.todoist.com/sync/v9/sync
        const taskId = ctx.getNodeParameter('taskId', itemIndex);
        const section = ctx.getNodeParameter('section', itemIndex);
        const body = {
            commands: [
                {
                    type: exports.CommandTypes.ITEM_MOVE,
                    uuid: (0, uuid_1.v4)(),
                    args: {
                        id: taskId,
                        section_id: section,
                    },
                },
            ],
        };
        await GenericFunctions_1.todoistSyncRequest.call(ctx, body);
        return { success: true };
    }
}
exports.MoveHandler = MoveHandler;
class SyncHandler {
    async handleOperation(ctx, itemIndex) {
        const commandsJson = ctx.getNodeParameter('commands', itemIndex);
        const projectId = ctx.getNodeParameter('project', itemIndex, undefined, {
            extractValue: true,
        });
        const sections = await getSectionIds(ctx, projectId);
        const commands = (0, n8n_workflow_1.jsonParse)(commandsJson);
        const tempIdMapping = new Map();
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            this.enrichUUID(command);
            this.enrichSection(command, sections);
            this.enrichProjectId(command, projectId);
            this.enrichTempId(command, tempIdMapping, projectId);
        }
        const body = {
            commands,
            temp_id_mapping: this.convertToObject(tempIdMapping),
        };
        await GenericFunctions_1.todoistSyncRequest.call(ctx, body);
        return { success: true };
    }
    convertToObject(map) {
        return Array.from(map.entries()).reduce((o, [key, value]) => {
            o[key] = value;
            return o;
        }, {});
    }
    enrichUUID(command) {
        command.uuid = (0, uuid_1.v4)();
    }
    enrichSection(command, sections) {
        if (command.args?.section !== undefined) {
            const sectionId = sections.get(command.args.section);
            if (sectionId) {
                command.args.section_id = sectionId;
            }
            else {
                throw new n8n_workflow_1.ApplicationError('Section ' + command.args.section + " doesn't exist on Todoist", { level: 'warning' });
            }
        }
    }
    enrichProjectId(command, projectId) {
        if (this.requiresProjectId(command)) {
            command.args.project_id = projectId;
        }
    }
    requiresProjectId(command) {
        return command.type === exports.CommandTypes.ITEM_ADD;
    }
    enrichTempId(command, tempIdMapping, projectId) {
        if (this.requiresTempId(command)) {
            command.temp_id = (0, uuid_1.v4)();
            tempIdMapping.set(command.temp_id, projectId);
        }
    }
    requiresTempId(command) {
        return command.type === exports.CommandTypes.ITEM_ADD;
    }
}
exports.SyncHandler = SyncHandler;
//# sourceMappingURL=OperationHandler.js.map