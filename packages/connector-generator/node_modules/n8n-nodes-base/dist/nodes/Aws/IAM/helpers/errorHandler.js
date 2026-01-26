"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const n8n_workflow_1 = require("n8n-workflow");
const constants_1 = require("./constants");
function mapErrorToResponse(errorCode, errorMessage) {
    const isUser = /user/i.test(errorMessage);
    const isGroup = /group/i.test(errorMessage);
    switch (errorCode) {
        case 'EntityAlreadyExists':
            if (isUser) {
                return {
                    message: errorMessage,
                    description: constants_1.ERROR_DESCRIPTIONS.EntityAlreadyExists.User,
                };
            }
            if (isGroup) {
                return {
                    message: errorMessage,
                    description: constants_1.ERROR_DESCRIPTIONS.EntityAlreadyExists.Group,
                };
            }
            break;
        case 'NoSuchEntity':
            if (isUser) {
                return {
                    message: errorMessage,
                    description: constants_1.ERROR_DESCRIPTIONS.NoSuchEntity.User,
                };
            }
            if (isGroup) {
                return {
                    message: errorMessage,
                    description: constants_1.ERROR_DESCRIPTIONS.NoSuchEntity.Group,
                };
            }
            break;
        case 'DeleteConflict':
            return {
                message: errorMessage,
                description: constants_1.ERROR_DESCRIPTIONS.DeleteConflict.Default,
            };
    }
    return undefined;
}
async function handleError(data, response) {
    const statusCode = String(response.statusCode);
    if (!statusCode.startsWith('4') && !statusCode.startsWith('5')) {
        return data;
    }
    const responseBody = response.body;
    const error = responseBody.Error;
    if (!error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response);
    }
    const specificError = mapErrorToResponse(error.Code, error.Message);
    if (specificError) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, specificError);
    }
    else {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), response, {
            message: error.Code,
            description: error.Message,
        });
    }
}
//# sourceMappingURL=errorHandler.js.map