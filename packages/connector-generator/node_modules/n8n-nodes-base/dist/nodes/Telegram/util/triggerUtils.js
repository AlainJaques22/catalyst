"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = void 0;
const GenericFunctions_1 = require("../GenericFunctions");
const downloadFile = async (webhookFunctions, credentials, bodyData, additionalFields) => {
    let imageSize = 'large';
    let key = 'message';
    if (bodyData.channel_post) {
        key = 'channel_post';
    }
    if ((bodyData[key]?.photo && Array.isArray(bodyData[key]?.photo)) ||
        bodyData[key]?.document ||
        bodyData[key]?.video) {
        if (additionalFields.imageSize) {
            imageSize = additionalFields.imageSize;
        }
        let fileId;
        if (bodyData[key]?.photo) {
            let image = (0, GenericFunctions_1.getImageBySize)(bodyData[key]?.photo, imageSize);
            // When the image is sent from the desktop app telegram does not resize the image
            // So return the only image available
            // Basically the Image Size parameter would work just when the images comes from the mobile app
            if (image === undefined) {
                image = bodyData[key].photo[0];
            }
            fileId = image.file_id;
        }
        else if (bodyData[key]?.video) {
            fileId = bodyData[key]?.video?.file_id;
        }
        else {
            fileId = bodyData[key]?.document?.file_id;
        }
        const { result: { file_path }, } = await GenericFunctions_1.apiRequest.call(webhookFunctions, 'GET', `getFile?file_id=${fileId}`, {});
        const file = await GenericFunctions_1.apiRequest.call(webhookFunctions, 'GET', '', {}, {}, {
            json: false,
            encoding: null,
            uri: `${credentials.baseUrl}/file/bot${credentials.accessToken}/${file_path}`,
            resolveWithFullResponse: true,
        });
        const data = Buffer.from(file.body);
        const fileName = file_path.split('/').pop();
        const binaryData = await webhookFunctions.helpers.prepareBinaryData(data, fileName);
        return {
            workflowData: [
                [
                    {
                        json: bodyData,
                        binary: {
                            data: binaryData,
                        },
                    },
                ],
            ],
        };
    }
    return {};
};
exports.downloadFile = downloadFile;
//# sourceMappingURL=triggerUtils.js.map