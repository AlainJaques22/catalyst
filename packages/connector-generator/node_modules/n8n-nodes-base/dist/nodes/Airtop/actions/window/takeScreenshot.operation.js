"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.execute = execute;
const GenericFunctions_1 = require("../../GenericFunctions");
const transport_1 = require("../../transport");
exports.description = [
    {
        displayName: 'Output Binary Image',
        description: 'Whether to output the image as a binary file instead of a base64 encoded string',
        name: 'outputImageAsBinary',
        type: 'boolean',
        default: false,
        displayOptions: {
            show: {
                resource: ['window'],
                operation: ['takeScreenshot'],
            },
        },
    },
];
async function execute(index) {
    const { sessionId, windowId } = GenericFunctions_1.validateSessionAndWindowId.call(this, index);
    const outputImageAsBinary = this.getNodeParameter('outputImageAsBinary', index, false);
    let data; // for storing the binary data
    let image = ''; // for storing the base64 encoded image
    const response = await transport_1.apiRequest.call(this, 'POST', `/sessions/${sessionId}/windows/${windowId}/screenshot`);
    // validate response
    (0, GenericFunctions_1.validateAirtopApiResponse)(this.getNode(), response);
    // process screenshot on success
    if (response.meta?.screenshots?.length) {
        if (outputImageAsBinary) {
            const buffer = (0, GenericFunctions_1.convertScreenshotToBinary)(response.meta.screenshots[0]);
            data = await this.helpers.prepareBinaryData(buffer, 'screenshot.jpg', 'image/jpeg');
        }
        else {
            image = response?.meta?.screenshots?.[0].dataUrl;
        }
    }
    return [
        {
            json: {
                sessionId,
                windowId,
                image,
            },
            ...(data ? { binary: { data } } : {}),
        },
    ];
}
//# sourceMappingURL=takeScreenshot.operation.js.map