"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncroMspV1 = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
const transport_1 = require("./transport");
class SyncroMspV1 {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
            usableAsTool: true,
        };
    }
    methods = {
        loadOptions: methods_1.loadOptions,
        credentialTest: {
            async syncroMspApiCredentialTest(credential) {
                try {
                    await transport_1.validateCredentials.call(this, credential.data);
                }
                catch (error) {
                    if (error.statusCode === 401) {
                        return {
                            status: 'Error',
                            message: 'The API Key included in the request is invalid',
                        };
                    }
                }
                return {
                    status: 'OK',
                    message: 'Connection successful!',
                };
            },
        },
    };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.SyncroMspV1 = SyncroMspV1;
//# sourceMappingURL=SyncroMspV1.node.js.map