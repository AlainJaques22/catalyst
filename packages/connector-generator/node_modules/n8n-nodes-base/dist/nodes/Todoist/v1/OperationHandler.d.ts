import type { IDataObject } from 'n8n-workflow';
import type { TodoistResponse } from './Service';
import type { Context } from '../GenericFunctions';
export interface OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
}
export interface CreateTaskRequest {
    content?: string;
    description?: string;
    project_id?: number;
    section_id?: number;
    parent_id?: string;
    order?: number;
    labels?: string[];
    priority?: number;
    due_string?: string;
    due_datetime?: string;
    due_date?: string;
    due_lang?: string;
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
        id?: number;
        section_id?: number;
        project_id?: number | string;
        section?: string;
        content?: string;
    };
}
export declare const CommandTypes: {
    readonly ITEM_MOVE: "item_move";
    readonly ITEM_ADD: "item_add";
    readonly ITEM_UPDATE: "item_update";
    readonly ITEM_REORDER: "item_reorder";
    readonly ITEM_DELETE: "item_delete";
    readonly ITEM_COMPLETE: "item_complete";
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
export declare class SyncHandler implements OperationHandler {
    handleOperation(ctx: Context, itemIndex: number): Promise<TodoistResponse>;
    private convertToObject;
    private enrichUUID;
    private enrichSection;
    private enrichProjectId;
    private requiresProjectId;
    private enrichTempId;
    private requiresTempId;
}
//# sourceMappingURL=OperationHandler.d.ts.map