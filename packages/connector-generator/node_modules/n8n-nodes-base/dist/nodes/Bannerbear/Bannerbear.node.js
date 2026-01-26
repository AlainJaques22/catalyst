"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bannerbear = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const ImageDescription_1 = require("./ImageDescription");
const TemplateDescription_1 = require("./TemplateDescription");
class Bannerbear {
    description = {
        displayName: 'Bannerbear',
        name: 'bannerbear',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:bannerbear.png',
        group: ['output'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Bannerbear API',
        defaults: {
            name: 'Bannerbear',
        },
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'bannerbearApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Image',
                        value: 'image',
                    },
                    {
                        name: 'Template',
                        value: 'template',
                    },
                ],
                default: 'image',
            },
            // IMAGE
            ...ImageDescription_1.imageOperations,
            ...ImageDescription_1.imageFields,
            // TEMPLATE
            ...TemplateDescription_1.templateOperations,
            ...TemplateDescription_1.templateFields,
        ],
    };
    methods = {
        loadOptions: {
            // Get all the available templates to display them to user so that they can
            // select them easily
            async getTemplates() {
                const returnData = [];
                const templates = await GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', '/templates');
                for (const template of templates) {
                    const templateName = template.name;
                    const templateId = template.uid;
                    returnData.push({
                        name: templateName,
                        value: templateId,
                    });
                }
                return returnData;
            },
            // Get all the available modifications to display them to user so that they can
            // select them easily
            async getModificationNames() {
                const templateId = this.getCurrentNodeParameter('templateId');
                const returnData = [];
                const { available_modifications } = await GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/templates/${templateId}`);
                for (const modification of available_modifications) {
                    const modificationName = modification.name;
                    const modificationId = modification.name;
                    returnData.push({
                        name: modificationName,
                        value: modificationId,
                    });
                }
                return returnData;
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const length = items.length;
        let responseData;
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < length; i++) {
            if (resource === 'image') {
                //https://developers.bannerbear.com/#create-an-image
                if (operation === 'create') {
                    const templateId = this.getNodeParameter('templateId', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    const modifications = this.getNodeParameter('modificationsUi', i)
                        .modificationsValues;
                    const body = {
                        template: templateId,
                    };
                    if (additionalFields.webhookUrl) {
                        body.webhook_url = additionalFields.webhookUrl;
                    }
                    if (additionalFields.metadata) {
                        body.metadata = additionalFields.metadata;
                    }
                    if (modifications) {
                        body.modifications = (0, GenericFunctions_1.keysToSnakeCase)(modifications);
                        // delete all fields set to empty
                        for (const modification of body.modifications) {
                            for (const key of Object.keys(modification)) {
                                if (modification[key] === '') {
                                    delete modification[key];
                                }
                            }
                        }
                    }
                    responseData = await GenericFunctions_1.bannerbearApiRequest.call(this, 'POST', '/images', body);
                    if (additionalFields.waitForImage && responseData.status !== 'completed') {
                        let maxTries = additionalFields.waitForImageMaxTries || 3;
                        const promise = async (uid) => {
                            let data = {};
                            return await new Promise((resolve, reject) => {
                                const timeout = setInterval(async () => {
                                    data = await GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/images/${uid}`);
                                    if (data.status === 'completed') {
                                        clearInterval(timeout);
                                        resolve(data);
                                    }
                                    if (--maxTries === 0) {
                                        clearInterval(timeout);
                                        reject(new Error('Image did not finish processing after multiple tries.'));
                                    }
                                }, 2000);
                            });
                        };
                        responseData = await promise(responseData.uid);
                    }
                }
                //https://developers.bannerbear.com/#get-a-specific-image
                if (operation === 'get') {
                    const imageId = this.getNodeParameter('imageId', i);
                    responseData = await GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/images/${imageId}`);
                }
            }
            if (resource === 'template') {
                //https://developers.bannerbear.com/#get-a-specific-template
                if (operation === 'get') {
                    const templateId = this.getNodeParameter('templateId', i);
                    responseData = await GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', `/templates/${templateId}`);
                }
                //https://developers.bannerbear.com/#list-templates
                if (operation === 'getAll') {
                    responseData = await GenericFunctions_1.bannerbearApiRequest.call(this, 'GET', '/templates');
                }
            }
            if (Array.isArray(responseData)) {
                returnData.push.apply(returnData, responseData);
            }
            else {
                returnData.push(responseData);
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.Bannerbear = Bannerbear;
//# sourceMappingURL=Bannerbear.node.js.map