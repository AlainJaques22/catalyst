"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoistService = void 0;
const OperationHandler_1 = require("./OperationHandler");
class TodoistService {
    async execute(ctx, operation, itemIndex) {
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
        sync: new OperationHandler_1.SyncHandler(),
    };
}
exports.TodoistService = TodoistService;
//# sourceMappingURL=Service.js.map