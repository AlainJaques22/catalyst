import type { IDataObject } from 'n8n-workflow';
import type { TodoistResponse } from './Service';
import type { Context } from '../GenericFunctions';
export interface OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export interface CreateTaskRequest {
    content?: string;
    description?: string;
    project_id?: number | string;
    section_id?: number | string;
    parent_id?: number | string;
    order?: number;
    labels?: string[];
    priority?: number | string;
    due_string?: string;
    due_datetime?: string;
    due_date?: string;
    due_lang?: string;
    assignee_id?: string;
    duration?: number;
    duration_unit?: string;
    deadline_date?: string;
}
export interface SyncRequest {
    commands: Command[];
    temp_id_mapping?: IDataObject;
}
export interface Command {
    type: CommandType;
    uuid: string;
    temp_id?: string;
    args: {
        parent_id?: number | string;
        id?: number | string;
        section_id?: number | string;
        project_id?: number | string;
        section?: string;
        content?: string;
        item_id?: number | string;
        due?: Record<string, unknown>;
        type?: string;
        minute_offset?: number;
        notify_uid?: string;
    };
}
export declare const CommandTypes: {
    readonly ITEM_MOVE: "item_move";
    readonly ITEM_ADD: "item_add";
    readonly ITEM_UPDATE: "item_update";
    readonly ITEM_REORDER: "item_reorder";
    readonly ITEM_DELETE: "item_delete";
    readonly ITEM_COMPLETE: "item_complete";
    readonly ITEM_UNCOMPLETE: "item_uncomplete";
    readonly ITEM_CLOSE: "item_close";
    readonly PROJECT_ADD: "project_add";
    readonly PROJECT_UPDATE: "project_update";
    readonly PROJECT_DELETE: "project_delete";
    readonly PROJECT_ARCHIVE: "project_archive";
    readonly PROJECT_UNARCHIVE: "project_unarchive";
    readonly PROJECT_REORDER: "project_reorder";
    readonly SECTION_ADD: "section_add";
    readonly SECTION_UPDATE: "section_update";
    readonly SECTION_DELETE: "section_delete";
    readonly SECTION_ARCHIVE: "section_archive";
    readonly SECTION_UNARCHIVE: "section_unarchive";
    readonly SECTION_MOVE: "section_move";
    readonly SECTION_REORDER: "section_reorder";
    readonly LABEL_ADD: "label_add";
    readonly LABEL_UPDATE: "label_update";
    readonly LABEL_DELETE: "label_delete";
    readonly LABEL_UPDATE_ORDERS: "label_update_orders";
    readonly FILTER_ADD: "filter_add";
    readonly FILTER_UPDATE: "filter_update";
    readonly FILTER_DELETE: "filter_delete";
    readonly FILTER_UPDATE_ORDERS: "filter_update_orders";
    readonly REMINDER_ADD: "reminder_add";
    readonly REMINDER_UPDATE: "reminder_update";
    readonly REMINDER_DELETE: "reminder_delete";
    readonly NOTE_ADD: "note_add";
    readonly NOTE_UPDATE: "note_update";
    readonly NOTE_DELETE: "note_delete";
    readonly SHARE_PROJECT: "share_project";
    readonly DELETE_COLLABORATOR: "delete_collaborator";
    readonly ACCEPT_INVITATION: "accept_invitation";
    readonly REJECT_INVITATION: "reject_invitation";
    readonly DELETE_INVITATION: "delete_invitation";
    readonly USER_UPDATE: "user_update";
    readonly USER_UPDATE_GOALS: "user_update_goals";
};
export type CommandType = (typeof CommandTypes)[keyof typeof CommandTypes];
export declare class CreateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class CloseHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class DeleteHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class GetHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class GetAllHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ReopenHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class UpdateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class MoveHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectCreateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectDeleteHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectGetHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectGetAllHandler implements OperationHandler {
    handleOperation(ctx: Context, _itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectUpdateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectArchiveHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectUnarchiveHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ProjectGetCollaboratorsHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class SectionCreateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class SectionDeleteHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class SectionGetHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class SectionGetAllHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class SectionUpdateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class CommentCreateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class CommentDeleteHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class CommentGetHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class CommentGetAllHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class CommentUpdateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class LabelCreateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class LabelDeleteHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class LabelGetHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class LabelGetAllHandler implements OperationHandler {
    handleOperation(ctx: Context, _itemIndex: number): Promise<TodoistResponse>;
}
export declare class LabelUpdateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class QuickAddHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ReminderCreateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ReminderUpdateHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ReminderDeleteHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export declare class ReminderGetAllHandler implements OperationHandler {
    handleOperation(ctx: Context, _itemIndex: number): Promise<TodoistResponse>;
}
//# sourceMappingURL=OperationHandler.d.ts.map