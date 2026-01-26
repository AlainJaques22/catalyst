"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOracleDBOperation = isOracleDBOperation;
function isOracleDBOperation(op) {
    return ['deleteTable', 'execute', 'insert', 'select', 'update', 'upsert'].includes(op);
}
//# sourceMappingURL=node.type.js.map