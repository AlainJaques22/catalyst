"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageList = pageList;
exports.formList = formList;
const GenericFunctions_1 = require("../GenericFunctions");
const filterMatches = (name, filter) => !filter || name?.toLowerCase().includes(filter.toLowerCase());
async function pageList(filter, paginationToken) {
    const { data: pages, paging } = await GenericFunctions_1.facebookPageList.call(this, paginationToken);
    return {
        results: pages
            .filter((page) => filterMatches(page.name, filter))
            .map((page) => ({
            name: page.name,
            value: page.id,
            url: `https://facebook.com/${page.id}`,
        })),
        paginationToken: paging?.next ? paging?.cursors?.after : undefined,
    };
}
async function formList(filter, paginationToken) {
    const pageId = this.getNodeParameter('page', '', { extractValue: true });
    const { data: forms, paging } = await GenericFunctions_1.facebookFormList.call(this, pageId, paginationToken);
    return {
        results: forms
            .filter((form) => filterMatches(form.name, filter))
            .map((form) => ({
            name: form.name,
            value: form.id,
        })),
        paginationToken: paging?.next ? paging?.cursors?.after : undefined,
    };
}
//# sourceMappingURL=listSearch.js.map