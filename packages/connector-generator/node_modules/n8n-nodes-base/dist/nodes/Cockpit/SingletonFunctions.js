"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleton = getSingleton;
exports.getAllSingletonNames = getAllSingletonNames;
const GenericFunctions_1 = require("./GenericFunctions");
async function getSingleton(resourceName) {
    return await GenericFunctions_1.cockpitApiRequest.call(this, 'GET', `/singletons/get/${resourceName}`);
}
async function getAllSingletonNames() {
    return await GenericFunctions_1.cockpitApiRequest.call(this, 'GET', '/singletons/listSingletons', {});
}
//# sourceMappingURL=SingletonFunctions.js.map