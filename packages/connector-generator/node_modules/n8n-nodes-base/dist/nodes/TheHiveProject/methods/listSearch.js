"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseSearch = caseSearch;
exports.commentSearch = commentSearch;
exports.alertSearch = alertSearch;
exports.taskSearch = taskSearch;
exports.pageSearch = pageSearch;
exports.logSearch = logSearch;
exports.observableSearch = observableSearch;
const transport_1 = require("../transport");
async function listResource(resource, filterField, nameField, urlPlaceholder, filter, paginationToken) {
    const query = [
        {
            _name: resource,
        },
    ];
    if (filter) {
        query.push({
            _name: 'filter',
            _like: {
                _field: filterField,
                _value: filter,
            },
        });
    }
    const from = paginationToken !== undefined ? parseInt(paginationToken, 10) : 0;
    const to = from + 100;
    query.push({
        _name: 'page',
        from,
        to,
    });
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', { query });
    if (response.length === 0) {
        return {
            results: [],
            paginationToken: undefined,
        };
    }
    const credentials = await this.getCredentials('theHiveProjectApi');
    const url = credentials?.url;
    return {
        results: response.map((entry) => ({
            name: entry[nameField],
            value: entry._id,
            url: urlPlaceholder !== undefined ? `${url}/${urlPlaceholder}/${entry._id}/details` : undefined,
        })),
        paginationToken: to,
    };
}
async function caseSearch(filter, paginationToken) {
    return await listResource.call(this, 'listCase', 'title', 'title', 'cases', filter, paginationToken);
}
async function commentSearch(filter, paginationToken) {
    return await listResource.call(this, 'listComment', 'message', 'message', undefined, filter, paginationToken);
}
async function alertSearch(filter, paginationToken) {
    return await listResource.call(this, 'listAlert', 'title', 'title', 'alerts', filter, paginationToken);
}
async function taskSearch(filter, paginationToken) {
    return await listResource.call(this, 'listTask', 'title', 'title', undefined, filter, paginationToken);
}
async function pageSearch(filter, paginationToken) {
    let caseId;
    try {
        caseId = this.getNodeParameter('caseId', '', { extractValue: true });
    }
    catch (error) {
        caseId = undefined;
    }
    let query;
    if (caseId) {
        query = [
            {
                _name: 'getCase',
                idOrName: caseId,
            },
            {
                _name: 'pages',
            },
        ];
    }
    else {
        query = [
            {
                _name: 'listOrganisationPage',
            },
        ];
    }
    if (filter) {
        query.push({
            _name: 'filter',
            _like: {
                _field: 'title',
                _value: filter,
            },
        });
    }
    const from = paginationToken !== undefined ? parseInt(paginationToken, 10) : 0;
    const to = from + 100;
    query.push({
        _name: 'page',
        from,
        to,
    });
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', { query });
    if (response.length === 0) {
        return {
            results: [],
            paginationToken: undefined,
        };
    }
    return {
        results: response.map((entry) => ({
            name: entry.title,
            value: entry._id,
        })),
        paginationToken: to,
    };
}
async function logSearch(filter, paginationToken) {
    return await listResource.call(this, 'listLog', 'message', 'message', undefined, filter, paginationToken);
}
async function observableSearch(filter, paginationToken) {
    const query = [
        {
            _name: 'listObservable',
        },
    ];
    if (filter) {
        query.push({
            _name: 'filter',
            _or: [
                {
                    _like: {
                        _field: 'data',
                        _value: filter,
                    },
                },
                {
                    _like: {
                        _field: 'message',
                        _value: filter,
                    },
                },
                {
                    _like: {
                        _field: 'attachment.name',
                        _value: filter,
                    },
                },
            ],
        });
    }
    const from = paginationToken !== undefined ? parseInt(paginationToken, 10) : 0;
    const to = from + 100;
    query.push({
        _name: 'page',
        from,
        to,
    });
    const response = await transport_1.theHiveApiRequest.call(this, 'POST', '/v1/query', { query });
    if (response.length === 0) {
        return {
            results: [],
            paginationToken: undefined,
        };
    }
    return {
        results: response.map((entry) => ({
            name: entry.data || entry.attachment?.name || entry.message || entry._id,
            value: entry._id,
        })),
        paginationToken: to,
    };
}
//# sourceMappingURL=listSearch.js.map