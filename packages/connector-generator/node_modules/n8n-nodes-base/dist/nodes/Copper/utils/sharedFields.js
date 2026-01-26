"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailFixedCollection = exports.emailsFixedCollection = exports.phoneNumbersFixedCollection = exports.addressFixedCollection = void 0;
// for companies, leads, persons
exports.addressFixedCollection = {
    displayName: 'Address',
    name: 'address',
    placeholder: 'Add Address Fields',
    type: 'fixedCollection',
    default: {},
    options: [
        {
            displayName: 'Address Fields',
            name: 'addressFields',
            values: [
                {
                    displayName: 'Street',
                    name: 'street',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'City',
                    name: 'city',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'State',
                    name: 'state',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Postal Code',
                    name: 'postal_code',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Country',
                    name: 'country',
                    type: 'string',
                    default: '',
                    description: 'ISO 3166 alpha-2 country code',
                },
            ],
        },
    ],
};
// for companies, leads, persons
exports.phoneNumbersFixedCollection = {
    displayName: 'Phone Numbers',
    name: 'phone_numbers',
    placeholder: 'Add Phone Number',
    type: 'fixedCollection',
    typeOptions: {
        multipleValues: true,
    },
    default: {},
    options: [
        {
            displayName: 'Phone Fields',
            name: 'phoneFields',
            values: [
                {
                    displayName: 'Number',
                    name: 'number',
                    type: 'string',
                    default: '',
                },
                {
                    displayName: 'Category',
                    name: 'category',
                    type: 'string',
                    default: '',
                },
            ],
        },
    ],
};
// for persons, multiple emails
exports.emailsFixedCollection = {
    displayName: 'Emails',
    name: 'emails',
    placeholder: 'Add Email',
    type: 'fixedCollection',
    typeOptions: {
        multipleValues: true,
    },
    default: {},
    options: [
        {
            displayName: 'Email Fields',
            name: 'emailFields',
            values: [
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    default: '',
                },
                {
                    displayName: 'Category',
                    name: 'category',
                    type: 'string',
                    default: '',
                },
            ],
        },
    ],
};
// for leads, single email
exports.emailFixedCollection = {
    displayName: 'Email',
    name: 'email',
    placeholder: 'Add Email',
    type: 'fixedCollection',
    default: {},
    options: [
        {
            displayName: 'Email Fields',
            name: 'emailFields',
            values: [
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    placeholder: 'name@email.com',
                    default: '',
                },
                {
                    displayName: 'Category',
                    name: 'category',
                    type: 'string',
                    default: '',
                },
            ],
        },
    ],
};
//# sourceMappingURL=sharedFields.js.map