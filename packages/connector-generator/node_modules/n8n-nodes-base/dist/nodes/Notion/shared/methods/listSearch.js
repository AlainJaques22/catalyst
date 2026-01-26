"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabases = getDatabases;
const GenericFunctions_1 = require("../GenericFunctions");
async function getDatabases(filter) {
    const returnData = [];
    const body = {
        page_size: 100,
        query: filter,
        filter: { property: 'object', value: 'database' },
    };
    const databases = await GenericFunctions_1.notionApiRequestAllItems.call(this, 'results', 'POST', '/search', body);
    for (const database of databases) {
        returnData.push({
            name: database.title[0]?.plain_text || database.id,
            value: database.id,
            url: database.url,
        });
    }
    returnData.sort((a, b) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
            return -1;
        }
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
            return 1;
        }
        return 0;
    });
    return { results: returnData };
}
//# sourceMappingURL=listSearch.js.map