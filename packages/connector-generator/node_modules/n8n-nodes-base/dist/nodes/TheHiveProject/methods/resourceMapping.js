"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlertFields = getAlertFields;
exports.getAlertUpdateFields = getAlertUpdateFields;
exports.getCaseFields = getCaseFields;
exports.getCaseUpdateFields = getCaseUpdateFields;
exports.getTaskFields = getTaskFields;
exports.getTaskUpdateFields = getTaskUpdateFields;
exports.getLogFields = getLogFields;
exports.getObservableFields = getObservableFields;
exports.getObservableUpdateFields = getObservableUpdateFields;
const loadOptions_1 = require("./loadOptions");
const constants_1 = require("../helpers/constants");
const transport_1 = require("../transport");
async function getCustomFields() {
    const customFields = (await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', {
        query: [
            {
                _name: 'listCustomField',
            },
        ],
    }));
    return customFields.map((field) => ({
        displayName: `Custom Field: ${(field.displayName || field.name)}`,
        id: `customFields.${field.name}`,
        required: false,
        display: true,
        type: field.options?.length ? 'options' : field.type,
        defaultMatch: false,
        options: field.options?.length
            ? field.options.map((option) => ({ name: option, value: option }))
            : undefined,
        removed: true,
    }));
}
async function getAlertFields() {
    const alertStatus = await loadOptions_1.loadAlertStatus.call(this);
    const caseTemplates = await loadOptions_1.loadCaseTemplate.call(this);
    const requiredFields = ['title', 'description', 'type', 'source', 'sourceRef'];
    const excludeFields = ['addTags', 'removeTags', 'lastSyncDate'];
    const fields = constants_1.alertCommonFields
        .filter((entry) => !excludeFields.includes(entry.id))
        .map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
        };
        if (requiredFields.includes(entry.id)) {
            field.required = true;
        }
        if (field.id === 'status') {
            field.options = alertStatus;
        }
        if (field.id === 'caseTemplate') {
            field.options = caseTemplates;
        }
        return field;
    });
    const customFields = (await getCustomFields.call(this)) || [];
    fields.push(...customFields);
    const columnData = {
        fields,
    };
    return columnData;
}
async function getAlertUpdateFields() {
    const alertStatus = await loadOptions_1.loadAlertStatus.call(this);
    const excludedFromMatching = ['addTags', 'removeTags'];
    const excludeFields = ['flag', 'caseTemplate'];
    const alertUpdateFields = constants_1.alertCommonFields
        .filter((entry) => !excludeFields.includes(entry.id))
        .map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
            canBeUsedToMatch: true,
        };
        if (excludedFromMatching.includes(field.id)) {
            field.canBeUsedToMatch = false;
        }
        if (field.id === 'status') {
            field.options = alertStatus;
        }
        return field;
    });
    const fields = [
        {
            displayName: 'ID',
            id: 'id',
            required: false,
            display: true,
            type: 'string',
            defaultMatch: true,
            canBeUsedToMatch: true,
        },
        ...alertUpdateFields,
    ];
    const customFields = (await getCustomFields.call(this)) || [];
    fields.push(...customFields);
    const columnData = {
        fields,
    };
    return columnData;
}
async function getCaseFields() {
    const caseStatus = await loadOptions_1.loadCaseStatus.call(this);
    const caseTemplates = await loadOptions_1.loadCaseTemplate.call(this);
    const users = await loadOptions_1.loadUsers.call(this);
    const requiredFields = ['title', 'description'];
    const excludeCreateFields = ['impactStatus', 'taskRule', 'addTags', 'removeTags'];
    const fields = constants_1.caseCommonFields
        .filter((entry) => !excludeCreateFields.includes(entry.id))
        .map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
        };
        if (requiredFields.includes(entry.id)) {
            field.required = true;
        }
        if (field.id === 'assignee') {
            field.options = users;
        }
        if (field.id === 'status') {
            field.options = caseStatus;
        }
        if (field.id === 'caseTemplate') {
            field.options = caseTemplates;
        }
        return field;
    });
    const customFields = (await getCustomFields.call(this)) || [];
    fields.push(...customFields);
    const columnData = {
        fields,
    };
    return columnData;
}
async function getCaseUpdateFields() {
    const caseStatus = await loadOptions_1.loadCaseStatus.call(this);
    const users = await loadOptions_1.loadUsers.call(this);
    const excludedFromMatching = ['addTags', 'removeTags', 'taskRule', 'observableRule'];
    const excludeUpdateFields = ['caseTemplate', 'tasks', 'sharingParameters'];
    const caseUpdateFields = constants_1.caseCommonFields
        .filter((entry) => !excludeUpdateFields.includes(entry.id))
        .map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
            canBeUsedToMatch: true,
        };
        if (excludedFromMatching.includes(field.id)) {
            field.canBeUsedToMatch = false;
        }
        if (field.id === 'assignee') {
            field.options = users;
        }
        if (field.id === 'status') {
            field.options = caseStatus;
        }
        return field;
    });
    const fields = [
        {
            displayName: 'ID',
            id: 'id',
            required: false,
            display: true,
            type: 'string',
            defaultMatch: true,
            canBeUsedToMatch: true,
        },
        ...caseUpdateFields,
    ];
    const customFields = (await getCustomFields.call(this)) || [];
    fields.push(...customFields);
    const columnData = {
        fields,
    };
    return columnData;
}
async function getTaskFields() {
    const users = await loadOptions_1.loadUsers.call(this);
    const requiredFields = ['title'];
    const fields = constants_1.taskCommonFields.map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
        };
        if (requiredFields.includes(entry.id)) {
            field.required = true;
        }
        if (field.id === 'assignee') {
            field.options = users;
        }
        return field;
    });
    const columnData = {
        fields,
    };
    return columnData;
}
async function getTaskUpdateFields() {
    const users = await loadOptions_1.loadUsers.call(this);
    const caseUpdateFields = constants_1.taskCommonFields.map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
            canBeUsedToMatch: true,
        };
        if (field.id === 'assignee') {
            field.options = users;
        }
        return field;
    });
    const fields = [
        {
            displayName: 'ID',
            id: 'id',
            required: false,
            display: true,
            type: 'string',
            defaultMatch: true,
            canBeUsedToMatch: true,
        },
        ...caseUpdateFields,
    ];
    const columnData = {
        fields,
    };
    return columnData;
}
async function getLogFields() {
    const fields = [
        {
            displayName: 'Message',
            id: 'message',
            required: true,
            display: true,
            type: 'string',
            defaultMatch: true,
        },
        {
            displayName: 'Start Date',
            id: 'startDate',
            required: false,
            display: true,
            type: 'dateTime',
            defaultMatch: false,
            removed: true,
        },
        {
            displayName: 'Include In Timeline',
            id: 'includeInTimeline',
            required: false,
            display: true,
            type: 'dateTime',
            defaultMatch: false,
            removed: true,
        },
    ];
    const columnData = {
        fields,
    };
    return columnData;
}
async function getObservableFields() {
    const excludeFields = ['addTags', 'removeTags', 'dataType'];
    const fields = constants_1.observableCommonFields
        .filter((entry) => !excludeFields.includes(entry.id))
        .map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
        };
        return field;
    });
    const columnData = {
        fields,
    };
    return columnData;
}
async function getObservableUpdateFields() {
    const dataTypes = await loadOptions_1.loadObservableTypes.call(this);
    const excludedFromMatching = ['addTags', 'removeTags'];
    const excludeFields = ['attachment', 'data', 'startDate', 'zipPassword', 'isZip'];
    const caseUpdateFields = constants_1.observableCommonFields
        .filter((entry) => !excludeFields.includes(entry.id))
        .map((entry) => {
        const type = entry.type;
        const field = {
            ...entry,
            type,
            required: false,
            display: true,
            defaultMatch: false,
            canBeUsedToMatch: true,
        };
        if (excludedFromMatching.includes(field.id)) {
            field.canBeUsedToMatch = false;
        }
        if (field.id === 'dataType') {
            field.options = dataTypes;
        }
        return field;
    });
    const fields = [
        {
            displayName: 'ID',
            id: 'id',
            required: false,
            display: true,
            type: 'string',
            defaultMatch: true,
            canBeUsedToMatch: true,
        },
        ...caseUpdateFields,
    ];
    const columnData = {
        fields,
    };
    return columnData;
}
//# sourceMappingURL=resourceMapping.js.map