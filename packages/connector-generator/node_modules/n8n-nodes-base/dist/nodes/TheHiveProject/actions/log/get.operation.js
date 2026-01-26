"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const utilities_1 = require("../../../../utils/utilities");
const descriptions_1 = require("../../descriptions");
const transport_1 = require("../../transport");
const properties = [descriptions_1.logRLC];
const displayOptions = {
    show: {
        resource: ['log'],
        operation: ['get'],
    },
};
exports.description = (0, utilities_1.updateDisplayOptions)(displayOptions, properties);
async function execute(i) {
    let responseData = [];
    const logId = this.getNodeParameter('logId', i, '', { extractValue: true });
    const body = {
        query: [
            {
                _name: 'getLog',
                idOrName: logId,
            },
        ],
    };
    responseData = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)(responseData), {
        itemData: { item: i },
    });
    return executionData;
}
//# sourceMappingURL=get.operation.js.map