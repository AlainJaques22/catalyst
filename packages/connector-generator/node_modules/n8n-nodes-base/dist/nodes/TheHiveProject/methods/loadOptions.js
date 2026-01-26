"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadResponders = loadResponders;
exports.loadAnalyzers = loadAnalyzers;
exports.loadCustomFields = loadCustomFields;
exports.loadObservableTypes = loadObservableTypes;
exports.loadCaseAttachments = loadCaseAttachments;
exports.loadLogAttachments = loadLogAttachments;
exports.loadAlertStatus = loadAlertStatus;
exports.loadCaseStatus = loadCaseStatus;
exports.loadCaseTemplate = loadCaseTemplate;
exports.loadUsers = loadUsers;
exports.loadAlertFields = loadAlertFields;
exports.loadCaseFields = loadCaseFields;
exports.loadObservableFields = loadObservableFields;
exports.loadTaskFields = loadTaskFields;
const constants_1 = require("../helpers/constants");
const transport_1 = require("../transport");
async function loadResponders() {
    let resource = this.getNodeParameter('resource');
    let resourceId = '';
    if (['case', 'alert', 'observable', 'log', 'task'].includes(resource)) {
        resourceId = this.getNodeParameter('id', '', { extractValue: true });
    }
    else {
        resourceId = this.getNodeParameter('id');
    }
    switch (resource) {
        case 'observable':
            resource = 'case_artifact';
            break;
        case 'task':
            resource = 'case_task';
            break;
        case 'log':
            resource = 'case_task_log';
            break;
    }
    const responders = await transport_1.theHiveApiRequest.call(this, 'GET', `/connector/cortex/responder/${resource}/${resourceId}`);
    const returnData = [];
    for (const responder of responders) {
        returnData.push({
            name: responder.name,
            value: responder.id,
            description: responder.description,
        });
    }
    return returnData;
}
async function loadAnalyzers() {
    const returnData = [];
    const dataType = this.getNodeParameter('dataType');
    const requestResult = await transport_1.theHiveApiRequest.call(this, 'GET', `/connector/cortex/analyzer/type/${dataType}`);
    for (const analyzer of requestResult) {
        for (const cortexId of analyzer.cortexIds) {
            returnData.push({
                name: `[${cortexId}] ${analyzer.name}`,
                value: `${analyzer.id}::${cortexId}`,
                description: analyzer.description,
            });
        }
    }
    return returnData;
}
async function loadCustomFields() {
    const requestResult = await transport_1.theHiveApiRequest.call(this, 'GET', '/customField');
    const returnData = [];
    for (const field of requestResult) {
        returnData.push({
            name: `Custom Field: ${(field.displayName || field.name)}`,
            value: `customFields.${field.name}`,
            // description: `${field.type}: ${field.description}`,
        });
    }
    return returnData;
}
async function loadObservableTypes() {
    const returnData = [];
    const body = {
        query: [
            {
                _name: 'listObservableType',
            },
        ],
    };
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    for (const entry of response) {
        returnData.push({
            name: `${entry.name}${entry.isAttachment ? ' (attachment)' : ''}`,
            value: entry.name,
        });
    }
    return returnData;
}
async function loadCaseAttachments() {
    const returnData = [];
    const caseId = this.getNodeParameter('caseId', '', { extractValue: true });
    const body = {
        query: [
            {
                _name: 'getCase',
                idOrName: caseId,
            },
            {
                _name: 'attachments',
            },
        ],
    };
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    for (const entry of response) {
        returnData.push({
            name: entry.name,
            value: entry._id,
            description: `Content-Type: ${entry.contentType}`,
        });
    }
    return returnData;
}
async function loadLogAttachments() {
    const returnData = [];
    const logId = this.getNodeParameter('logId', '', { extractValue: true });
    const body = {
        query: [
            {
                _name: 'getLog',
                idOrName: logId,
            },
        ],
    };
    // extract log object from array
    const [response] = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    for (const entry of response.attachments || []) {
        returnData.push({
            name: entry.name,
            value: entry._id,
            description: `Content-Type: ${entry.contentType}`,
        });
    }
    return returnData;
}
async function loadAlertStatus() {
    const returnData = [];
    const body = {
        query: [
            {
                _name: 'listAlertStatus',
            },
        ],
    };
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    for (const entry of response) {
        returnData.push({
            name: entry.value,
            value: entry.value,
            description: `Stage: ${entry.stage}`,
        });
    }
    return returnData.sort((a, b) => a.name.localeCompare(b.name));
}
async function loadCaseStatus() {
    const returnData = [];
    const body = {
        query: [
            {
                _name: 'listCaseStatus',
            },
        ],
    };
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    for (const entry of response) {
        returnData.push({
            name: entry.value,
            value: entry.value,
            description: `Stage: ${entry.stage}`,
        });
    }
    return returnData.sort((a, b) => a.name.localeCompare(b.name));
}
async function loadCaseTemplate() {
    const returnData = [];
    const body = {
        query: [
            {
                _name: 'listCaseTemplate',
            },
        ],
    };
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    for (const entry of response) {
        returnData.push({
            name: entry.displayName || entry.name,
            value: entry.name,
        });
    }
    return returnData;
}
async function loadUsers() {
    const returnData = [];
    const body = {
        query: [
            {
                _name: 'listUser',
            },
        ],
    };
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', body);
    for (const entry of response) {
        returnData.push({
            name: entry.name,
            value: entry.login,
        });
    }
    return returnData;
}
async function loadAlertFields() {
    const returnData = [];
    const excludeFields = ['addTags', 'removeTags'];
    const fields = constants_1.alertCommonFields
        .filter((entry) => !excludeFields.includes(entry.id))
        .map((entry) => {
        const field = {
            name: entry.displayName || entry.id,
            value: entry.id,
        };
        return field;
    });
    const customFields = await loadCustomFields.call(this);
    returnData.push(...fields, ...customFields);
    return returnData;
}
async function loadCaseFields() {
    const returnData = [];
    const excludeFields = ['addTags', 'removeTags', 'taskRule', 'observableRule'];
    const fields = constants_1.caseCommonFields
        .filter((entry) => !excludeFields.includes(entry.id))
        .map((entry) => {
        const field = {
            name: entry.displayName || entry.id,
            value: entry.id,
        };
        return field;
    });
    const customFields = await loadCustomFields.call(this);
    returnData.push(...fields, ...customFields);
    return returnData;
}
async function loadObservableFields() {
    const returnData = [];
    const excludeFields = ['addTags', 'removeTags', 'zipPassword'];
    const fields = constants_1.observableCommonFields
        .filter((entry) => !excludeFields.includes(entry.id))
        .map((entry) => {
        const field = {
            name: entry.displayName || entry.id,
            value: entry.id,
        };
        return field;
    });
    returnData.push(...fields);
    return returnData;
}
async function loadTaskFields() {
    const fields = constants_1.taskCommonFields.map((entry) => {
        const field = {
            name: entry.displayName || entry.id,
            value: entry.id,
        };
        return field;
    });
    return fields;
}
//# sourceMappingURL=loadOptions.js.map