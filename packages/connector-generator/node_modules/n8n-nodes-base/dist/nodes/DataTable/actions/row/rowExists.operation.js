"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.FIELD = void 0;
exports.execute = execute;
const selectMany_1 = require("../../common/selectMany");
const utils_1 = require("../../common/utils");
exports.FIELD = 'rowExists';
const displayOptions = {
    show: {
        resource: ['row'],
        operation: [exports.FIELD],
    },
};
exports.description = [...(0, selectMany_1.getSelectFields)(displayOptions, true, true)];
async function execute(index) {
    const dataTableProxy = await (0, utils_1.getDataTableProxyExecute)(this, index);
    const hits = await (0, selectMany_1.executeSelectMany)(this, index, dataTableProxy, undefined, 1);
    return hits.length > 0 ? [this.getInputData()[index]] : [];
}
//# sourceMappingURL=rowExists.operation.js.map