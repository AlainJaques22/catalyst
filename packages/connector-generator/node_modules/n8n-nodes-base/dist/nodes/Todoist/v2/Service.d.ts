import type { IDataObject } from 'n8n-workflow';
import type { Context } from '../GenericFunctions';
export declare class TodoistService implements Service {
    executeTask(ctx: Context, operation: TaskOperationType, itemIndex: number): Promise<TodoistResponse>;
    private handlers;
    private projectHandlers;
    private sectionHandlers;
    private commentHandlers;
    private labelHandlers;
    private reminderHandlers;
    executeProject(ctx: Context, operation: ProjectOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeSection(ctx: Context, operation: SectionOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeComment(ctx: Context, operation: CommentOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeLabel(ctx: Context, operation: LabelOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeReminder(ctx: Context, operation: ReminderOperationType, itemIndex: number): Promise<TodoistResponse>;
}
declare const TASK_OPERATIONS: readonly ["create", "close", "delete", "get", "getAll", "reopen", "update", "move", "quickAdd"];
declare const PROJECT_OPERATIONS: readonly ["create", "delete", "get", "getAll", "update", "archive", "unarchive", "getCollaborators"];
declare const SECTION_OPERATIONS: readonly ["create", "delete", "get", "getAll", "update"];
declare const COMMENT_OPERATIONS: readonly ["create", "delete", "get", "getAll", "update"];
declare const LABEL_OPERATIONS: readonly ["create", "delete", "get", "getAll", "update"];
declare const REMINDER_OPERATIONS: readonly ["create", "delete", "getAll", "update"];
export type TaskOperationType = (typeof TASK_OPERATIONS)[number];
export type ProjectOperationType = (typeof PROJECT_OPERATIONS)[number];
export type SectionOperationType = (typeof SECTION_OPERATIONS)[number];
export type CommentOperationType = (typeof COMMENT_OPERATIONS)[number];
export type LabelOperationType = (typeof LABEL_OPERATIONS)[number];
export type ReminderOperationType = (typeof REMINDER_OPERATIONS)[number];
export declare function isTaskOperationType(operation: string): operation is TaskOperationType;
export declare function isProjectOperationType(operation: string): operation is ProjectOperationType;
export declare function isSectionOperationType(operation: string): operation is SectionOperationType;
export declare function isCommentOperationType(operation: string): operation is CommentOperationType;
export declare function isLabelOperationType(operation: string): operation is LabelOperationType;
export declare function isReminderOperationType(operation: string): operation is ReminderOperationType;
export interface Section {
    name: string;
    id: string;
}
export interface Service {
    executeTask(ctx: Context, operation: TaskOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeProject(ctx: Context, operation: ProjectOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeSection(ctx: Context, operation: SectionOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeComment(ctx: Context, operation: CommentOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeLabel(ctx: Context, operation: LabelOperationType, itemIndex: number): Promise<TodoistResponse>;
    executeReminder(ctx: Context, operation: ReminderOperationType, itemIndex: number): Promise<TodoistResponse>;
}
export interface TodoistProjectType {
    id: number;
    name: string;
}
export interface TodoistResponse {
    success?: boolean;
    data?: IDataObject;
}
export {};
//# sourceMappingURL=Service.d.ts.map