"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoistService = void 0;
exports.isTaskOperationType = isTaskOperationType;
exports.isProjectOperationType = isProjectOperationType;
exports.isSectionOperationType = isSectionOperationType;
exports.isCommentOperationType = isCommentOperationType;
exports.isLabelOperationType = isLabelOperationType;
exports.isReminderOperationType = isReminderOperationType;
const OperationHandler_1 = require("./OperationHandler");
class TodoistService {
    async executeTask(ctx, operation, itemIndex) {
        return await this.handlers[operation].handleOperation(ctx, itemIndex);
    }
    handlers = {
        create: new OperationHandler_1.CreateHandler(),
        close: new OperationHandler_1.CloseHandler(),
        delete: new OperationHandler_1.DeleteHandler(),
        get: new OperationHandler_1.GetHandler(),
        getAll: new OperationHandler_1.GetAllHandler(),
        reopen: new OperationHandler_1.ReopenHandler(),
        update: new OperationHandler_1.UpdateHandler(),
        move: new OperationHandler_1.MoveHandler(),
        quickAdd: new OperationHandler_1.QuickAddHandler(),
    };
    projectHandlers = {
        create: new OperationHandler_1.ProjectCreateHandler(),
        delete: new OperationHandler_1.ProjectDeleteHandler(),
        get: new OperationHandler_1.ProjectGetHandler(),
        getAll: new OperationHandler_1.ProjectGetAllHandler(),
        update: new OperationHandler_1.ProjectUpdateHandler(),
        archive: new OperationHandler_1.ProjectArchiveHandler(),
        unarchive: new OperationHandler_1.ProjectUnarchiveHandler(),
        getCollaborators: new OperationHandler_1.ProjectGetCollaboratorsHandler(),
    };
    sectionHandlers = {
        create: new OperationHandler_1.SectionCreateHandler(),
        delete: new OperationHandler_1.SectionDeleteHandler(),
        get: new OperationHandler_1.SectionGetHandler(),
        getAll: new OperationHandler_1.SectionGetAllHandler(),
        update: new OperationHandler_1.SectionUpdateHandler(),
    };
    commentHandlers = {
        create: new OperationHandler_1.CommentCreateHandler(),
        delete: new OperationHandler_1.CommentDeleteHandler(),
        get: new OperationHandler_1.CommentGetHandler(),
        getAll: new OperationHandler_1.CommentGetAllHandler(),
        update: new OperationHandler_1.CommentUpdateHandler(),
    };
    labelHandlers = {
        create: new OperationHandler_1.LabelCreateHandler(),
        delete: new OperationHandler_1.LabelDeleteHandler(),
        get: new OperationHandler_1.LabelGetHandler(),
        getAll: new OperationHandler_1.LabelGetAllHandler(),
        update: new OperationHandler_1.LabelUpdateHandler(),
    };
    reminderHandlers = {
        create: new OperationHandler_1.ReminderCreateHandler(),
        delete: new OperationHandler_1.ReminderDeleteHandler(),
        getAll: new OperationHandler_1.ReminderGetAllHandler(),
        update: new OperationHandler_1.ReminderUpdateHandler(),
    };
    async executeProject(ctx, operation, itemIndex) {
        return await this.projectHandlers[operation].handleOperation(ctx, itemIndex);
    }
    async executeSection(ctx, operation, itemIndex) {
        return await this.sectionHandlers[operation].handleOperation(ctx, itemIndex);
    }
    async executeComment(ctx, operation, itemIndex) {
        return await this.commentHandlers[operation].handleOperation(ctx, itemIndex);
    }
    async executeLabel(ctx, operation, itemIndex) {
        return await this.labelHandlers[operation].handleOperation(ctx, itemIndex);
    }
    async executeReminder(ctx, operation, itemIndex) {
        return await this.reminderHandlers[operation].handleOperation(ctx, itemIndex);
    }
}
exports.TodoistService = TodoistService;
// Define operations as const arrays - source of truth
const TASK_OPERATIONS = [
    'create',
    'close',
    'delete',
    'get',
    'getAll',
    'reopen',
    'update',
    'move',
    'quickAdd',
];
const PROJECT_OPERATIONS = [
    'create',
    'delete',
    'get',
    'getAll',
    'update',
    'archive',
    'unarchive',
    'getCollaborators',
];
const SECTION_OPERATIONS = ['create', 'delete', 'get', 'getAll', 'update'];
const COMMENT_OPERATIONS = ['create', 'delete', 'get', 'getAll', 'update'];
const LABEL_OPERATIONS = ['create', 'delete', 'get', 'getAll', 'update'];
const REMINDER_OPERATIONS = ['create', 'delete', 'getAll', 'update'];
// Type guards using the same arrays
function isTaskOperationType(operation) {
    return TASK_OPERATIONS.includes(operation);
}
function isProjectOperationType(operation) {
    return PROJECT_OPERATIONS.includes(operation);
}
function isSectionOperationType(operation) {
    return SECTION_OPERATIONS.includes(operation);
}
function isCommentOperationType(operation) {
    return COMMENT_OPERATIONS.includes(operation);
}
function isLabelOperationType(operation) {
    return LABEL_OPERATIONS.includes(operation);
}
function isReminderOperationType(operation) {
    return REMINDER_OPERATIONS.includes(operation);
}
//# sourceMappingURL=Service.js.map