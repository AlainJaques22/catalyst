"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = exports.properties = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
exports.properties = [descriptions_1.calendarRLC];
const displayOptions = {
    show: {
        resource: ['calendar'],
        operation: ['delete'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, exports.properties);
async function execute(index) {
    const calendarId = this.getNodeParameter('calendarId', index, undefined, {
        extractValue: true,
    });
    await transport_1.microsoftApiRequest.call(this, 'DELETE', `/calendars/${calendarId}`);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ success: true }), { itemData: { item: index } });
    return executionData;
}
//# sourceMappingURL=delete.operation.js.map