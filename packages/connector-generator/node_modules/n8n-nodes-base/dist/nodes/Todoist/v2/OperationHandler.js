"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderGetAllHandler = exports.ReminderDeleteHandler = exports.ReminderUpdateHandler = exports.ReminderCreateHandler = exports.QuickAddHandler = exports.LabelUpdateHandler = exports.LabelGetAllHandler = exports.LabelGetHandler = exports.LabelDeleteHandler = exports.LabelCreateHandler = exports.CommentUpdateHandler = exports.CommentGetAllHandler = exports.CommentGetHandler = exports.CommentDeleteHandler = exports.CommentCreateHandler = exports.SectionUpdateHandler = exports.SectionGetAllHandler = exports.SectionGetHandler = exports.SectionDeleteHandler = exports.SectionCreateHandler = exports.ProjectGetCollaboratorsHandler = exports.ProjectUnarchiveHandler = exports.ProjectArchiveHandler = exports.ProjectUpdateHandler = exports.ProjectGetAllHandler = exports.ProjectGetHandler = exports.ProjectDeleteHandler = exports.ProjectCreateHandler = exports.MoveHandler = exports.UpdateHandler = exports.ReopenHandler = exports.GetAllHandler = exports.GetHandler = exports.DeleteHandler = exports.CloseHandler = exports.CreateHandler = exports.CommandTypes = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const uuid_1 = require("uuid");
const GenericFunctions_1 = require("../GenericFunctions");
// Helper function for string or number validation
function assertValidTodoistId(parameterName, value, node) {
    (0, n8n_workflow_1.assertParamIsOfAnyTypes)(parameterName, value, ['string', 'number'], node);
}
exports.CommandTypes = {
    // Item/Task commands
    ITEM_MOVE: 'item_move',
    ITEM_ADD: 'item_add',
    ITEM_UPDATE: 'item_update',
    ITEM_REORDER: 'item_reorder',
    ITEM_DELETE: 'item_delete',
    ITEM_COMPLETE: 'item_complete',
    ITEM_UNCOMPLETE: 'item_uncomplete',
    ITEM_CLOSE: 'item_close',
    // Project commands
    PROJECT_ADD: 'project_add',
    PROJECT_UPDATE: 'project_update',
    PROJECT_DELETE: 'project_delete',
    PROJECT_ARCHIVE: 'project_archive',
    PROJECT_UNARCHIVE: 'project_unarchive',
    PROJECT_REORDER: 'project_reorder',
    // Section commands
    SECTION_ADD: 'section_add',
    SECTION_UPDATE: 'section_update',
    SECTION_DELETE: 'section_delete',
    SECTION_ARCHIVE: 'section_archive',
    SECTION_UNARCHIVE: 'section_unarchive',
    SECTION_MOVE: 'section_move',
    SECTION_REORDER: 'section_reorder',
    // Label commands
    LABEL_ADD: 'label_add',
    LABEL_UPDATE: 'label_update',
    LABEL_DELETE: 'label_delete',
    LABEL_UPDATE_ORDERS: 'label_update_orders',
    // Filter commands
    FILTER_ADD: 'filter_add',
    FILTER_UPDATE: 'filter_update',
    FILTER_DELETE: 'filter_delete',
    FILTER_UPDATE_ORDERS: 'filter_update_orders',
    // Reminder commands
    REMINDER_ADD: 'reminder_add',
    REMINDER_UPDATE: 'reminder_update',
    REMINDER_DELETE: 'reminder_delete',
    // Note commands
    NOTE_ADD: 'note_add',
    NOTE_UPDATE: 'note_update',
    NOTE_DELETE: 'note_delete',
    // Sharing commands
    SHARE_PROJECT: 'share_project',
    DELETE_COLLABORATOR: 'delete_collaborator',
    ACCEPT_INVITATION: 'accept_invitation',
    REJECT_INVITATION: 'reject_invitation',
    DELETE_INVITATION: 'delete_invitation',
    // User settings
    USER_UPDATE: 'user_update',
    USER_UPDATE_GOALS: 'user_update_goals',
};
class CreateHandler {
    async handleOperation(ctx, itemIndex) {
        //https://developer.todoist.com/rest/v2/#create-a-new-task
        const content = ctx.getNodeParameter('content', itemIndex);
        (0, n8n_workflow_1.assertParamIsString)('content', content, ctx.getNode());
        const projectId = ctx.getNodeParameter('project', itemIndex, undefined, {
            extractValue: true,
        });
        assertValidTodoistId('project', projectId, ctx.getNode());
        const labels = ctx.getNodeParameter('labels', itemIndex);
        const options = ctx.getNodeParameter('options', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(options, {
            description: { type: 'string' },
            dueDateTime: { type: 'string' },
            dueString: { type: 'string' },
            section: { type: ['string', 'number'] },
            dueLang: { type: 'string' },
            parentId: { type: ['string', 'number'] },
            priority: { type: ['string', 'number'] },
            order: { type: 'number' },
            dueDate: { type: 'string' },
            assigneeId: { type: 'string' },
            duration: { type: 'number' },
            durationUnit: { type: 'string' },
            deadlineDate: { type: 'string' },
        }, ctx.getNode());
        const body = {
            content,
            project_id: projectId,
            priority: typeof options.priority === 'string'
                ? parseInt(options.priority, 10)
                : (options.priority ?? 1),
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
            body.labels = labels;
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
        if (options.order) {
            body.order = options.order;
        }
        if (options.dueDate) {
            body.due_date = options.dueDate;
        }
        if (options.assigneeId) {
            body.assignee_id = options.assigneeId;
        }
        if (options.duration) {
            body.duration = options.duration;
        }
        if (options.durationUnit) {
            body.duration_unit = options.durationUnit;
        }
        if (options.deadlineDate) {
            body.deadline_date = options.deadlineDate;
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
        assertValidTodoistId('taskId', id, ctx.getNode());
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
        assertValidTodoistId('taskId', id, ctx.getNode());
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
        assertValidTodoistId('taskId', id, ctx.getNode());
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
        (0, n8n_workflow_1.validateNodeParameters)(filters, {
            projectId: { type: ['string', 'number'] },
            sectionId: { type: ['string', 'number'] },
            labelId: { type: ['string', 'number'] },
            filter: { type: 'string' },
            lang: { type: 'string' },
            ids: { type: 'string' },
        }, ctx.getNode());
        const qs = {};
        if (filters.projectId) {
            qs.project_id = filters.projectId;
        }
        if (filters.sectionId) {
            qs.section_id = filters.sectionId;
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
            (0, n8n_workflow_1.assertParamIsNumber)('limit', limit, ctx.getNode());
            responseData = responseData.splice(0, limit);
        }
        return {
            data: responseData,
        };
    }
}
exports.GetAllHandler = GetAllHandler;
class ReopenHandler {
    async handleOperation(ctx, itemIndex) {
        //https://developer.todoist.com/rest/v2/#get-an-active-task
        const id = ctx.getNodeParameter('taskId', itemIndex);
        assertValidTodoistId('taskId', id, ctx.getNode());
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
        assertValidTodoistId('taskId', id, ctx.getNode());
        const updateFields = ctx.getNodeParameter('updateFields', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(updateFields, {
            content: { type: 'string' },
            priority: { type: ['number', 'string'] },
            description: { type: 'string' },
            dueDateTime: { type: 'string' },
            dueString: { type: 'string' },
            labels: { type: 'string[]' },
            dueLang: { type: 'string' },
            order: { type: 'number' },
            dueDate: { type: 'string' },
            assigneeId: { type: 'string' },
            duration: { type: 'number' },
            durationUnit: { type: 'string' },
            deadlineDate: { type: 'string' },
        }, ctx.getNode());
        const body = {};
        if (updateFields.content) {
            body.content = updateFields.content;
        }
        if (updateFields.priority) {
            body.priority = updateFields.priority;
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
            body.labels = updateFields.labels;
        }
        if (updateFields.dueLang) {
            body.due_lang = updateFields.dueLang;
        }
        if (updateFields.order) {
            body.order = updateFields.order;
        }
        if (updateFields.dueDate) {
            body.due_date = updateFields.dueDate;
        }
        if (updateFields.assigneeId) {
            body.assignee_id = updateFields.assigneeId;
        }
        if (updateFields.duration) {
            body.duration = updateFields.duration;
        }
        if (updateFields.durationUnit) {
            body.duration_unit = updateFields.durationUnit;
        }
        if (updateFields.deadlineDate) {
            body.deadline_date = updateFields.deadlineDate;
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
        assertValidTodoistId('taskId', taskId, ctx.getNode());
        const projectId = ctx.getNodeParameter('project', itemIndex, undefined, {
            extractValue: true,
        });
        assertValidTodoistId('project', projectId, ctx.getNode());
        const nodeVersion = ctx.getNode().typeVersion;
        const body = {
            commands: [
                {
                    type: exports.CommandTypes.ITEM_MOVE,
                    uuid: (0, uuid_1.v4)(),
                    args: {
                        id: taskId,
                        // Set section_id only if node version is below 2.1
                        ...(nodeVersion < 2.1
                            ? {
                                section_id: (() => {
                                    const section = ctx.getNodeParameter('section', itemIndex);
                                    assertValidTodoistId('section', section, ctx.getNode());
                                    return section;
                                })(),
                            }
                            : {}),
                    },
                },
            ],
        };
        if (nodeVersion >= 2.1) {
            const options = ctx.getNodeParameter('options', itemIndex, {});
            (0, n8n_workflow_1.validateNodeParameters)(options, {
                parent: { type: ['string', 'number'] },
                section: { type: ['string', 'number'] },
            }, ctx.getNode());
            // Only one of parent_id, section_id, or project_id must be set to move the task
            if (options.parent) {
                body.commands[0].args.parent_id = options.parent;
            }
            else if (options.section) {
                body.commands[0].args.section_id = options.section;
            }
            else {
                body.commands[0].args.project_id = projectId;
            }
        }
        await GenericFunctions_1.todoistSyncRequest.call(ctx, body);
        return { success: true };
    }
}
exports.MoveHandler = MoveHandler;
// Project Handlers
class ProjectCreateHandler {
    async handleOperation(ctx, itemIndex) {
        const name = ctx.getNodeParameter('name', itemIndex);
        (0, n8n_workflow_1.assertParamIsString)('name', name, ctx.getNode());
        const options = ctx.getNodeParameter('projectOptions', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(options, {
            color: { type: 'string' },
            is_favorite: { type: 'boolean' },
            parent_id: { type: 'string' },
            view_style: { type: 'string' },
        }, ctx.getNode());
        const body = {
            name,
            ...options,
        };
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', '/projects', body);
        return { data };
    }
}
exports.ProjectCreateHandler = ProjectCreateHandler;
class ProjectDeleteHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('projectId', itemIndex);
        assertValidTodoistId('projectId', id, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'DELETE', `/projects/${id}`);
        return { success: true };
    }
}
exports.ProjectDeleteHandler = ProjectDeleteHandler;
class ProjectGetHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('projectId', itemIndex);
        assertValidTodoistId('projectId', id, ctx.getNode());
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/projects/${id}`);
        return { data };
    }
}
exports.ProjectGetHandler = ProjectGetHandler;
class ProjectGetAllHandler {
    async handleOperation(ctx, _itemIndex) {
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/projects');
        return { data };
    }
}
exports.ProjectGetAllHandler = ProjectGetAllHandler;
class ProjectUpdateHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('projectId', itemIndex);
        assertValidTodoistId('projectId', id, ctx.getNode());
        const updateFields = ctx.getNodeParameter('projectUpdateFields', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(updateFields, {
            name: { type: 'string' },
            color: { type: 'string' },
            is_favorite: { type: 'boolean' },
            view_style: { type: 'string' },
        }, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/projects/${id}`, updateFields);
        return { success: true };
    }
}
exports.ProjectUpdateHandler = ProjectUpdateHandler;
class ProjectArchiveHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('projectId', itemIndex);
        assertValidTodoistId('projectId', id, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/projects/${id}/archive`);
        return { success: true };
    }
}
exports.ProjectArchiveHandler = ProjectArchiveHandler;
class ProjectUnarchiveHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('projectId', itemIndex);
        assertValidTodoistId('projectId', id, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/projects/${id}/unarchive`);
        return { success: true };
    }
}
exports.ProjectUnarchiveHandler = ProjectUnarchiveHandler;
class ProjectGetCollaboratorsHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('projectId', itemIndex);
        assertValidTodoistId('projectId', id, ctx.getNode());
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/projects/${id}/collaborators`);
        return { data };
    }
}
exports.ProjectGetCollaboratorsHandler = ProjectGetCollaboratorsHandler;
// Section Handlers
class SectionCreateHandler {
    async handleOperation(ctx, itemIndex) {
        const name = ctx.getNodeParameter('sectionName', itemIndex);
        (0, n8n_workflow_1.assertParamIsString)('sectionName', name, ctx.getNode());
        const projectId = ctx.getNodeParameter('sectionProject', itemIndex, undefined, {
            extractValue: true,
        });
        assertValidTodoistId('sectionProject', projectId, ctx.getNode());
        const options = ctx.getNodeParameter('sectionOptions', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(options, {
            order: { type: 'number' },
        }, ctx.getNode());
        const body = {
            name,
            project_id: projectId,
            ...options,
        };
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', '/sections', body);
        return { data };
    }
}
exports.SectionCreateHandler = SectionCreateHandler;
class SectionDeleteHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('sectionId', itemIndex);
        assertValidTodoistId('sectionId', id, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'DELETE', `/sections/${id}`);
        return { success: true };
    }
}
exports.SectionDeleteHandler = SectionDeleteHandler;
class SectionGetHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('sectionId', itemIndex);
        assertValidTodoistId('sectionId', id, ctx.getNode());
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/sections/${id}`);
        return { data };
    }
}
exports.SectionGetHandler = SectionGetHandler;
class SectionGetAllHandler {
    async handleOperation(ctx, itemIndex) {
        const filters = ctx.getNodeParameter('sectionFilters', itemIndex);
        const qs = {};
        if (filters.project_id) {
            assertValidTodoistId('project_id', filters.project_id, ctx.getNode());
            qs.project_id = filters.project_id;
        }
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/sections', {}, qs);
        return { data };
    }
}
exports.SectionGetAllHandler = SectionGetAllHandler;
class SectionUpdateHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('sectionId', itemIndex);
        assertValidTodoistId('sectionId', id, ctx.getNode());
        const updateFields = ctx.getNodeParameter('sectionUpdateFields', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(updateFields, {
            name: { type: 'string' },
        }, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/sections/${id}`, updateFields);
        return { success: true };
    }
}
exports.SectionUpdateHandler = SectionUpdateHandler;
// Comment Handlers
class CommentCreateHandler {
    async handleOperation(ctx, itemIndex) {
        const taskId = ctx.getNodeParameter('commentTaskId', itemIndex);
        assertValidTodoistId('commentTaskId', taskId, ctx.getNode());
        const content = ctx.getNodeParameter('commentContent', itemIndex);
        (0, n8n_workflow_1.assertParamIsString)('commentContent', content, ctx.getNode());
        const body = {
            task_id: taskId,
            content,
        };
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', '/comments', body);
        return { data };
    }
}
exports.CommentCreateHandler = CommentCreateHandler;
class CommentDeleteHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('commentId', itemIndex);
        assertValidTodoistId('commentId', id, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'DELETE', `/comments/${id}`);
        return { success: true };
    }
}
exports.CommentDeleteHandler = CommentDeleteHandler;
class CommentGetHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('commentId', itemIndex);
        assertValidTodoistId('commentId', id, ctx.getNode());
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/comments/${id}`);
        return { data };
    }
}
exports.CommentGetHandler = CommentGetHandler;
class CommentGetAllHandler {
    async handleOperation(ctx, itemIndex) {
        const filters = ctx.getNodeParameter('commentFilters', itemIndex);
        const qs = {};
        if (filters.task_id) {
            assertValidTodoistId('task_id', filters.task_id, ctx.getNode());
            qs.task_id = filters.task_id;
        }
        if (filters.project_id) {
            assertValidTodoistId('project_id', filters.project_id, ctx.getNode());
            qs.project_id = filters.project_id;
        }
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/comments', {}, qs);
        return { data };
    }
}
exports.CommentGetAllHandler = CommentGetAllHandler;
class CommentUpdateHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('commentId', itemIndex);
        assertValidTodoistId('commentId', id, ctx.getNode());
        const updateFields = ctx.getNodeParameter('commentUpdateFields', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(updateFields, {
            content: { type: 'string' },
        }, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/comments/${id}`, updateFields);
        return { success: true };
    }
}
exports.CommentUpdateHandler = CommentUpdateHandler;
// Label Handlers
class LabelCreateHandler {
    async handleOperation(ctx, itemIndex) {
        const name = ctx.getNodeParameter('labelName', itemIndex);
        (0, n8n_workflow_1.assertParamIsString)('labelName', name, ctx.getNode());
        const options = ctx.getNodeParameter('labelOptions', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(options, {
            color: { type: 'string' },
            order: { type: 'number' },
            is_favorite: { type: 'boolean' },
        }, ctx.getNode());
        const body = {
            name,
            ...options,
        };
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', '/labels', body);
        return { data };
    }
}
exports.LabelCreateHandler = LabelCreateHandler;
class LabelDeleteHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('labelId', itemIndex);
        assertValidTodoistId('labelId', id, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'DELETE', `/labels/${id}`);
        return { success: true };
    }
}
exports.LabelDeleteHandler = LabelDeleteHandler;
class LabelGetHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('labelId', itemIndex);
        assertValidTodoistId('labelId', id, ctx.getNode());
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', `/labels/${id}`);
        return { data };
    }
}
exports.LabelGetHandler = LabelGetHandler;
class LabelGetAllHandler {
    async handleOperation(ctx, _itemIndex) {
        const data = await GenericFunctions_1.todoistApiRequest.call(ctx, 'GET', '/labels');
        return { data };
    }
}
exports.LabelGetAllHandler = LabelGetAllHandler;
class LabelUpdateHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('labelId', itemIndex);
        assertValidTodoistId('labelId', id, ctx.getNode());
        const updateFields = ctx.getNodeParameter('labelUpdateFields', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(updateFields, {
            name: { type: 'string' },
            color: { type: 'string' },
            order: { type: 'number' },
            is_favorite: { type: 'boolean' },
        }, ctx.getNode());
        await GenericFunctions_1.todoistApiRequest.call(ctx, 'POST', `/labels/${id}`, updateFields);
        return { success: true };
    }
}
exports.LabelUpdateHandler = LabelUpdateHandler;
class QuickAddHandler {
    async handleOperation(ctx, itemIndex) {
        const text = ctx.getNodeParameter('text', itemIndex);
        (0, n8n_workflow_1.assertParamIsString)('text', text, ctx.getNode());
        const options = ctx.getNodeParameter('options', itemIndex, {});
        (0, n8n_workflow_1.validateNodeParameters)(options, {
            note: { type: 'string' },
            reminder: { type: 'string' },
            auto_reminder: { type: 'boolean' },
        }, ctx.getNode());
        const body = { text };
        if (options.note) {
            body.note = options.note;
        }
        if (options.reminder) {
            body.reminder = options.reminder;
        }
        if (options.auto_reminder) {
            body.auto_reminder = options.auto_reminder;
        }
        const data = await GenericFunctions_1.todoistSyncRequest.call(ctx, body, {}, '/quick/add');
        return {
            data,
        };
    }
}
exports.QuickAddHandler = QuickAddHandler;
// Reminder Handlers
class ReminderCreateHandler {
    async handleOperation(ctx, itemIndex) {
        const itemId = ctx.getNodeParameter('itemId', itemIndex);
        assertValidTodoistId('itemId', itemId, ctx.getNode());
        const dueDateType = ctx.getNodeParameter('dueDateType', itemIndex);
        (0, n8n_workflow_1.assertParamIsString)('dueDateType', dueDateType, ctx.getNode());
        const due = {};
        if (dueDateType === 'natural_language') {
            const naturalLanguageRep = ctx.getNodeParameter('natural_language_representation', itemIndex);
            (0, n8n_workflow_1.assertParamIsString)('natural_language_representation', naturalLanguageRep, ctx.getNode());
            due.string = naturalLanguageRep;
        }
        else if (dueDateType === 'full_day') {
            const date = ctx.getNodeParameter('date', itemIndex);
            (0, n8n_workflow_1.assertParamIsString)('date', date, ctx.getNode());
            due.date = date;
        }
        else if (dueDateType === 'floating_time') {
            const datetime = ctx.getNodeParameter('datetime', itemIndex);
            (0, n8n_workflow_1.assertParamIsString)('datetime', datetime, ctx.getNode());
            due.datetime = datetime;
        }
        else if (dueDateType === 'fixed_timezone') {
            const datetime = ctx.getNodeParameter('datetime', itemIndex);
            const timezone = ctx.getNodeParameter('timezone', itemIndex);
            (0, n8n_workflow_1.assertParamIsString)('datetime', datetime, ctx.getNode());
            (0, n8n_workflow_1.assertParamIsString)('timezone', timezone, ctx.getNode());
            due.datetime = datetime;
            due.timezone = timezone;
        }
        const options = ctx.getNodeParameter('reminderOptions', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(options, {
            type: { type: 'string' },
            minute_offset: { type: 'number' },
            notify_uid: { type: 'string' },
        }, ctx.getNode());
        const body = {
            commands: [
                {
                    type: exports.CommandTypes.REMINDER_ADD,
                    uuid: (0, uuid_1.v4)(),
                    temp_id: (0, uuid_1.v4)(),
                    args: {
                        item_id: itemId,
                        due,
                        ...options,
                    },
                },
            ],
        };
        await GenericFunctions_1.todoistSyncRequest.call(ctx, body);
        return { success: true };
    }
}
exports.ReminderCreateHandler = ReminderCreateHandler;
class ReminderUpdateHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('reminderId', itemIndex);
        assertValidTodoistId('reminderId', id, ctx.getNode());
        const updateFields = ctx.getNodeParameter('reminderUpdateFields', itemIndex);
        (0, n8n_workflow_1.validateNodeParameters)(updateFields, {
            due: { type: 'object' },
            type: { type: 'string' },
            minute_offset: { type: 'number' },
            notify_uid: { type: 'string' },
        }, ctx.getNode());
        const body = {
            commands: [
                {
                    type: exports.CommandTypes.REMINDER_UPDATE,
                    uuid: (0, uuid_1.v4)(),
                    args: {
                        id,
                        ...updateFields,
                    },
                },
            ],
        };
        await GenericFunctions_1.todoistSyncRequest.call(ctx, body);
        return { success: true };
    }
}
exports.ReminderUpdateHandler = ReminderUpdateHandler;
class ReminderDeleteHandler {
    async handleOperation(ctx, itemIndex) {
        const id = ctx.getNodeParameter('reminderId', itemIndex);
        assertValidTodoistId('reminderId', id, ctx.getNode());
        const body = {
            commands: [
                {
                    type: exports.CommandTypes.REMINDER_DELETE,
                    uuid: (0, uuid_1.v4)(),
                    args: {
                        id,
                    },
                },
            ],
        };
        await GenericFunctions_1.todoistSyncRequest.call(ctx, body);
        return { success: true };
    }
}
exports.ReminderDeleteHandler = ReminderDeleteHandler;
class ReminderGetAllHandler {
    async handleOperation(ctx, _itemIndex) {
        const syncData = await GenericFunctions_1.todoistSyncRequest.call(ctx, {
            sync_token: '*',
            resource_types: ['reminders'],
        });
        return {
            data: syncData.reminders || [],
        };
    }
}
exports.ReminderGetAllHandler = ReminderGetAllHandler;
//# sourceMappingURL=OperationHandler.js.map