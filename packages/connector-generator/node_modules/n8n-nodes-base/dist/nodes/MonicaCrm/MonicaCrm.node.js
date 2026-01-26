"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonicaCrm = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const descriptions_1 = require("./descriptions");
const GenericFunctions_1 = require("./GenericFunctions");
class MonicaCrm {
    description = {
        displayName: 'Monica CRM',
        name: 'monicaCrm',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:monicaCrm.png',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume the Monica CRM API',
        defaults: {
            name: 'Monica CRM',
        },
        usableAsTool: true,
        inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        credentials: [
            {
                name: 'monicaCrmApi',
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
                        name: 'Activity',
                        value: 'activity',
                    },
                    {
                        name: 'Call',
                        value: 'call',
                    },
                    {
                        name: 'Contact',
                        value: 'contact',
                    },
                    {
                        name: 'Contact Field',
                        value: 'contactField',
                    },
                    {
                        name: 'Contact Tag',
                        value: 'contactTag',
                    },
                    {
                        name: 'Conversation',
                        value: 'conversation',
                    },
                    {
                        name: 'Conversation Message',
                        value: 'conversationMessage',
                    },
                    {
                        name: 'Journal Entry',
                        value: 'journalEntry',
                    },
                    {
                        name: 'Note',
                        value: 'note',
                    },
                    {
                        name: 'Reminder',
                        value: 'reminder',
                    },
                    {
                        name: 'Tag',
                        value: 'tag',
                    },
                    {
                        name: 'Task',
                        value: 'task',
                    },
                ],
                default: 'contact',
            },
            ...descriptions_1.activityOperations,
            ...descriptions_1.activityFields,
            ...descriptions_1.callOperations,
            ...descriptions_1.callFields,
            ...descriptions_1.contactOperations,
            ...descriptions_1.contactFields,
            ...descriptions_1.contactFieldOperations,
            ...descriptions_1.contactFieldFields,
            ...descriptions_1.contactTagOperations,
            ...descriptions_1.contactTagFields,
            ...descriptions_1.conversationOperations,
            ...descriptions_1.conversationFields,
            ...descriptions_1.conversationMessageOperations,
            ...descriptions_1.conversationMessageFields,
            ...descriptions_1.journalEntryOperations,
            ...descriptions_1.journalEntryFields,
            ...descriptions_1.noteOperations,
            ...descriptions_1.noteFields,
            ...descriptions_1.reminderOperations,
            ...descriptions_1.reminderFields,
            ...descriptions_1.tagOperations,
            ...descriptions_1.tagFields,
            ...descriptions_1.taskOperations,
            ...descriptions_1.taskFields,
        ],
    };
    methods = {
        loadOptions: {
            async getActivityTypes() {
                const responseData = (await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', '/activitytypes'));
                return (0, GenericFunctions_1.toOptions)(responseData);
            },
            async getTagsToAdd() {
                const responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', '/tags', {}, {}, { forLoader: true });
                // intentional, name required when adding
                return responseData.map(({ name }) => ({ value: name, name }));
            },
            async getTagsToRemove() {
                const responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', '/tags', {}, {}, { forLoader: true });
                return responseData.map(({ id, name }) => ({ value: id, name }));
            },
            async getContactFieldTypes() {
                const responseData = (await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', '/contactfieldtypes'));
                return (0, GenericFunctions_1.toOptions)(responseData);
            },
            async getGenders() {
                const responseData = (await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', '/genders'));
                return (0, GenericFunctions_1.toOptions)(responseData);
            },
        },
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        let responseData;
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'activity') {
                    // **********************************************************************
                    //                                activity
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             activity: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/activities#create-an-activity
                        const contacts = this.getNodeParameter('contacts', i);
                        const happenedAt = this.getNodeParameter('happenedAt', i);
                        const body = {
                            activity_type_id: this.getNodeParameter('activityTypeId', i),
                            contacts: contacts.split(','),
                            happened_at: happenedAt.split('T')[0],
                            summary: this.getNodeParameter('summary', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/activities', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             activity: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/activities#delete-an-activity
                        const activityId = this.getNodeParameter('activityId', i);
                        const endpoint = `/activities/${activityId}`;
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //              activity: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/activities#get-a-specific-activity
                        const activityId = this.getNodeParameter('activityId', i);
                        const endpoint = `/activities/${activityId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             activity: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/activities#list-all-the-activities-in-your-account
                        const endpoint = '/activities';
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             activity: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/activities#update-an-activity
                        const activityId = this.getNodeParameter('activityId', i);
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/activities/${activityId}`);
                        const body = {
                            activity_type_id: data.activity_type.id,
                            contacts: data.attendees.contacts.map((contact) => contact.id),
                            happened_at: data.happened_at,
                            summary: data.summary,
                        };
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        body.happened_at = body.happened_at.split('T')[0];
                        if (typeof body.contacts === 'string') {
                            body.contacts = body.contacts.split(',');
                        }
                        const endpoint = `/activities/${activityId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', endpoint, body);
                    }
                }
                else if (resource === 'call') {
                    // **********************************************************************
                    //                                  call
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               call: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/calls#create-a-call
                        const body = {
                            called_at: this.getNodeParameter('calledAt', i),
                            contact_id: this.getNodeParameter('contactId', i),
                            content: this.getNodeParameter('content', i),
                        };
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/calls', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               call: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contactfields#delete-a-call
                        const callId = this.getNodeParameter('callId', i);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', `/calls/${callId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                call: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/calls#get-a-specific-call
                        const callId = this.getNodeParameter('callId', i);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/calls/${callId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               call: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/calls#list-all-the-calls-in-your-account
                        const endpoint = '/calls';
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               call: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/calls#update-a-call
                        const callId = this.getNodeParameter('callId', i);
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/calls/${callId}`);
                        const body = {
                            called_at: data.called_at,
                        };
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', `/calls/${callId}`, body);
                    }
                }
                else if (resource === 'contact') {
                    // **********************************************************************
                    //                                contact
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             contact: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contacts#create-a-contact
                        const body = {
                            first_name: this.getNodeParameter('firstName', i),
                            gender_id: this.getNodeParameter('genderId', i),
                        };
                        const { isDeceased = false, deceasedDate, birthdate, ...rest } = this.getNodeParameter('additionalFields', i);
                        body.is_birthdate_known = false;
                        body.is_deceased = isDeceased;
                        body.is_deceased_date_known = false;
                        if (birthdate) {
                            body.is_birthdate_known = true;
                            const [day, month, year] = (0, GenericFunctions_1.getDateParts)(birthdate);
                            body.birthdate_day = day;
                            body.birthdate_month = month;
                            body.birthdate_year = year;
                        }
                        if (deceasedDate) {
                            body.is_deceased = true;
                            body.is_deceased_date_known = true;
                            const [day, month, year] = (0, GenericFunctions_1.getDateParts)(deceasedDate);
                            body.deceased_date_day = day;
                            body.deceased_date_month = month;
                            body.deceased_date_year = year;
                        }
                        if (Object.keys(rest).length) {
                            Object.assign(body, rest);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/contacts', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             contact: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contacts#delete-a-contact
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contacts/${contactId}`;
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //               contact: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contacts#get-a-specific-contact
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contacts/${contactId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             contact: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contacts#list-all-your-contacts
                        const qs = {};
                        const filters = this.getNodeParameter('filters', i);
                        if (Object.keys(filters).length) {
                            Object.assign(qs, filters);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', '/contacts', {}, qs);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             contact: update
                        // ----------------------------------------
                        const contactId = this.getNodeParameter('contactId', i);
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/contacts/${contactId}`);
                        const body = {
                            first_name: data.first_name,
                        };
                        const { is_deaceased = false, deceased_date, birthdate, ...rest } = this.getNodeParameter('updateFields', i);
                        body.is_birthdate_known = false;
                        body.is_deceased = is_deaceased;
                        body.is_deceased_date_known = false;
                        if (birthdate) {
                            body.is_birthdate_known = true;
                            const [day, month, year] = (0, GenericFunctions_1.getDateParts)(birthdate);
                            body.birthdate_day = day;
                            body.birthdate_month = month;
                            body.birthdate_year = year;
                        }
                        if (deceased_date) {
                            body.is_deceased = true;
                            body.is_deceased_date_known = true;
                            const [day, month, year] = (0, GenericFunctions_1.getDateParts)(deceased_date);
                            body.deceased_date_day = day;
                            body.deceased_date_month = month;
                            body.deceased_date_year = year;
                        }
                        if (Object.keys(rest).length) {
                            Object.assign(body, rest);
                        }
                        const endpoint = `/contacts/${contactId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', endpoint, body);
                    }
                }
                else if (resource === 'contactField') {
                    // **********************************************************************
                    //                              contactField
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //           contactField: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contactfields#create-a-contact-field
                        const body = {
                            contact_field_type_id: this.getNodeParameter('contactFieldTypeId', i),
                            contact_id: this.getNodeParameter('contactId', i),
                            data: this.getNodeParameter('data', i),
                        };
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/contactfields', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //           contactField: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contactfields#delete-a-contact-field
                        const contactFieldId = this.getNodeParameter('contactFieldId', i);
                        const endpoint = `/contactfields/${contactFieldId}`;
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //            contactField: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contactfields#get-a-specific-contact-field
                        const contactFieldId = this.getNodeParameter('contactFieldId', i);
                        const endpoint = `/contactfields/${contactFieldId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //           contactField: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contactfields#list-all-the-contact-fields-of-a-specific-contact
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contact/${contactId}/contactfields`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //           contactField: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contactfields#update-a-contact-field
                        const body = {
                            contact_field_type_id: this.getNodeParameter('contactFieldTypeId', i),
                            contact_id: this.getNodeParameter('contactId', i),
                            data: this.getNodeParameter('data', i),
                        };
                        const contactFieldId = this.getNodeParameter('contactFieldId', i);
                        const endpoint = `/contactfields/${contactFieldId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', endpoint, body);
                    }
                }
                else if (resource === 'contactTag') {
                    // **********************************************************************
                    //                             contactTag
                    // **********************************************************************
                    if (operation === 'add') {
                        // ----------------------------------------
                        //            contactTag: add
                        // ----------------------------------------
                        // https://www.monicahq.com/api/tags#associate-a-tag-to-a-contact
                        const body = {
                            tags: this.getNodeParameter('tagsToAdd', i),
                        };
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contacts/${contactId}/setTags`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', endpoint, body);
                    }
                    else if (operation === 'remove') {
                        // ----------------------------------------
                        //              tag: remove
                        // ----------------------------------------
                        // https://www.monicahq.com/api/tags#remove-a-specific-tag-from-a-contact
                        const body = {
                            tags: this.getNodeParameter('tagsToRemove', i),
                        };
                        const contactId = this.getNodeParameter('contactId', i);
                        const endpoint = `/contacts/${contactId}/unsetTag`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', endpoint, body);
                    }
                }
                else if (resource === 'conversation') {
                    // **********************************************************************
                    //                              conversation
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //           conversation: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/conversations#create-a-conversation
                        const body = {
                            contact_field_type_id: this.getNodeParameter('contactFieldTypeId', i),
                            contact_id: this.getNodeParameter('contactId', i),
                            happened_at: this.getNodeParameter('happenedAt', i),
                        };
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/conversations', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //           conversation: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/contactfields#delete-a-contact-field
                        const conversationId = this.getNodeParameter('conversationId', i);
                        const endpoint = `/conversations/${conversationId}`;
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //            conversation: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/conversations#get-a-specific-conversation
                        const conversationId = this.getNodeParameter('conversationId', i);
                        const endpoint = `/conversations/${conversationId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //           conversation: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/conversations#update-a-conversation
                        const body = {
                            contact_field_type_id: this.getNodeParameter('contactFieldTypeId', i),
                            happened_at: this.getNodeParameter('happenedAt', i),
                        };
                        const conversationId = this.getNodeParameter('conversationId', i);
                        const endpoint = `/conversations/${conversationId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', endpoint, body);
                    }
                }
                else if (resource === 'conversationMessage') {
                    if (operation === 'add') {
                        // ----------------------------------------
                        //         conversationMessage: add
                        // ----------------------------------------
                        // https://www.monicahq.com/api/conversations#add-a-message-to-a-conversation
                        const conversationId = this.getNodeParameter('conversationId', i);
                        const endpoint = `/conversations/${conversationId}/messages`;
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/conversations/${conversationId}`);
                        const body = {
                            contact_id: data.contact.id,
                            content: this.getNodeParameter('content', i),
                            written_at: this.getNodeParameter('writtenAt', i),
                            written_by_me: this.getNodeParameter('writtenByMe', i),
                        };
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', endpoint, body);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //       conversationMessage: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/conversations#update-a-message-in-a-conversation
                        const conversationId = this.getNodeParameter('conversationId', i);
                        const messageId = this.getNodeParameter('messageId', i);
                        const endpoint = `/conversations/${conversationId}/messages/${messageId}`;
                        const updateFields = this.getNodeParameter('updateFields', i, {});
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/conversations/${conversationId}`);
                        const message = data.messages.filter((entry) => entry.id === parseInt(messageId, 10))[0];
                        const body = {
                            contact_id: data.contact.id,
                            content: message.content,
                            written_at: message.written_at,
                            written_by_me: message.written_by_me,
                        };
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', endpoint, body);
                    }
                }
                else if (resource === 'journalEntry') {
                    // **********************************************************************
                    //                              journalEntry
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //           journalEntry: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#create-a-journal-entry
                        const body = {
                            title: this.getNodeParameter('title', i),
                            post: this.getNodeParameter('post', i),
                        };
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/journal', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //           journalEntry: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/journal#delete-a-journal-entry
                        const journalId = this.getNodeParameter('journalId', i);
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', `/journal/${journalId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //            journalEntry: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/journal#get-a-specific-journal-entry
                        const journalId = this.getNodeParameter('journalId', i);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/journal/${journalId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //           journalEntry: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/journal#list-all-the-entries-in-your-journal
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', '/journal');
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //           journalEntry: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/journal#update-a-journal-entry
                        const journalId = this.getNodeParameter('journalId', i);
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/journal/${journalId}`);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const body = {
                            post: data.post,
                            title: data.title,
                        };
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', `/journal/${journalId}`, body);
                    }
                }
                else if (resource === 'note') {
                    // **********************************************************************
                    //                                  note
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               note: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#create-a-note
                        const body = {
                            body: this.getNodeParameter('body', i),
                            contact_id: this.getNodeParameter('contactId', i),
                        };
                        body.is_favorited = this.getNodeParameter('additionalFields.isFavorited', i, false);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/notes', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               note: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#delete-a-note
                        const noteId = this.getNodeParameter('noteId', i);
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', `/notes/${noteId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                note: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#get-a-specific-note
                        const noteId = this.getNodeParameter('noteId', i);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/notes/${noteId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               note: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#list-all-the-notes-in-your-account
                        const endpoint = '/notes';
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               note: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#update-a-note
                        const noteId = this.getNodeParameter('noteId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/notes/${noteId}`);
                        const body = {
                            body: data.body,
                            contact_id: data.contact.id,
                        };
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', `/notes/${noteId}`, body);
                    }
                }
                else if (resource === 'reminder') {
                    // **********************************************************************
                    //                                reminder
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //             reminder: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#create-a-reminder
                        const initialDate = this.getNodeParameter('initialDate', i);
                        const body = {
                            contact_id: this.getNodeParameter('contactId', i),
                            frequency_type: this.getNodeParameter('frequencyType', i),
                            frequency_number: this.getNodeParameter('frequencyNumber', i, 1),
                            initial_date: initialDate.split('T')[0],
                            title: this.getNodeParameter('title', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/reminders', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //             reminder: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/reminder#delete-a-reminder
                        const reminderId = this.getNodeParameter('reminderId', i);
                        const endpoint = `/reminders/${reminderId}`;
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', endpoint);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //              reminder: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/reminder#get-a-specific-reminder
                        const reminderId = this.getNodeParameter('reminderId', i);
                        const endpoint = `/reminders/${reminderId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //             reminder: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/reminders#list-all-the-reminders-in-your-account
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', '/reminders');
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //             reminder: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/reminders#update-a-reminder
                        const reminderId = this.getNodeParameter('reminderId', i);
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/reminders/${reminderId}`);
                        const body = {
                            contact_id: data.contact.id,
                            frequency_type: data.frequency_type,
                            frequency_number: data.frequency_number,
                            initial_date: data.initial_date,
                            title: data.title,
                        };
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        body.initial_date = body.initial_date.split('T')[0];
                        const endpoint = `/reminders/${reminderId}`;
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', endpoint, body);
                    }
                }
                else if (resource === 'tag') {
                    // **********************************************************************
                    //                                  tag
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               tag: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/tags#create-a-tag
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/tags', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               tag: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/tag#delete-a-tag
                        const tagId = this.getNodeParameter('tagId', i);
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', `/tags/${tagId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                 tag: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/task#get-a-specific-tag
                        const tagId = this.getNodeParameter('tagId', i);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/tags/${tagId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               tag: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/tags#list-all-your-tags
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', '/tags');
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               tag: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/tags#update-a-tag
                        const body = {
                            name: this.getNodeParameter('name', i),
                        };
                        const tagId = this.getNodeParameter('tagId', i);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', `/tags/${tagId}`, body);
                    }
                }
                else if (resource === 'task') {
                    // **********************************************************************
                    //                                  task
                    // **********************************************************************
                    if (operation === 'create') {
                        // ----------------------------------------
                        //               task: create
                        // ----------------------------------------
                        // https://www.monicahq.com/api/notes#create-a-task
                        const body = {
                            contact_id: this.getNodeParameter('contactId', i),
                            title: this.getNodeParameter('title', i),
                        };
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        if (Object.keys(additionalFields).length) {
                            Object.assign(body, additionalFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'POST', '/tasks', body);
                    }
                    else if (operation === 'delete') {
                        // ----------------------------------------
                        //               task: delete
                        // ----------------------------------------
                        // https://www.monicahq.com/api/task#delete-a-task
                        const taskId = this.getNodeParameter('taskId', i);
                        await GenericFunctions_1.monicaCrmApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
                        responseData = { success: true };
                    }
                    else if (operation === 'get') {
                        // ----------------------------------------
                        //                task: get
                        // ----------------------------------------
                        // https://www.monicahq.com/api/task#get-a-specific-task
                        const taskId = this.getNodeParameter('taskId', i);
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/tasks/${taskId}`);
                    }
                    else if (operation === 'getAll') {
                        // ----------------------------------------
                        //               task: getAll
                        // ----------------------------------------
                        // https://www.monicahq.com/api/tasks#list-all-the-tasks-of-a-specific-contact
                        const endpoint = '/tasks';
                        responseData = await GenericFunctions_1.monicaCrmApiRequestAllItems.call(this, 'GET', endpoint);
                    }
                    else if (operation === 'update') {
                        // ----------------------------------------
                        //               task: update
                        // ----------------------------------------
                        // https://www.monicahq.com/api/task#update-a-task
                        const taskId = this.getNodeParameter('taskId', i);
                        const { data } = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'GET', `/tasks/${taskId}`);
                        const body = {
                            contact_id: data.contact.id,
                            title: data.title,
                            completed: data.completed,
                        };
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (Object.keys(updateFields).length) {
                            Object.assign(body, updateFields);
                        }
                        responseData = await GenericFunctions_1.monicaCrmApiRequest.call(this, 'PUT', `/tasks/${taskId}`, body);
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionErrorData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionErrorData);
                    continue;
                }
                throw error;
            }
            if (['create', 'get', 'update', 'add'].includes(operation)) {
                responseData = responseData.data;
            }
            const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
            returnData.push(...executionData);
        }
        return [returnData];
    }
}
exports.MonicaCrm = MonicaCrm;
//# sourceMappingURL=MonicaCrm.node.js.map