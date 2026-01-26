"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataTableColumns = exports.getConditionsForColumn = void 0;
exports.getSheetHeaderRowWithGeneratedColumnNames = getSheetHeaderRowWithGeneratedColumnNames;
const loadOptions_1 = require("../../Google/Sheet/v2/methods/loadOptions");
var methods_1 = require("../../DataTable/common/methods");
Object.defineProperty(exports, "getConditionsForColumn", { enumerable: true, get: function () { return methods_1.getConditionsForColumn; } });
Object.defineProperty(exports, "getDataTableColumns", { enumerable: true, get: function () { return methods_1.getDataTableColumns; } });
async function getSheetHeaderRowWithGeneratedColumnNames() {
    const returnData = await loadOptions_1.getSheetHeaderRow.call(this);
    return returnData.map((column, i) => {
        if (column.value !== '')
            return column;
        const indexBasedValue = `col_${i + 1}`;
        return {
            name: indexBasedValue,
            value: indexBasedValue,
        };
    });
}
//# sourceMappingURL=loadOptions.js.map