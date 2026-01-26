"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../../../utils/utilities");
const transport_1 = require("../../transport");
const common_descriptions_1 = require("../common.descriptions");
const properties = [
    {
        ...common_descriptions_1.sharedDriveRLC,
        description: 'The shared drive to delete',
    },
];
const displayOptions = {
    show: {
        resource: ['drive'],
        operation: ['deleteDrive'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    const returnData = [];
    const driveId = this.getNodeParameter('driveId', i, undefined, {
        extractValue: true,
    });
    await transport_1.googleApiRequest.call(this, 'DELETE', `/drive/v3/drives/${driveId}`);
    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ success: true }), { itemData: { item: i } });
    returnData.push(...executionData);
    return returnData;
}
//# sourceMappingURL=deleteDrive.operation.js.map