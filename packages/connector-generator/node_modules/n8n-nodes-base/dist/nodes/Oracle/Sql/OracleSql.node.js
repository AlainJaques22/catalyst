"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleSql = void 0;
const router_1 = require("./actions/router");
const versionDescription_1 = require("./actions/versionDescription");
const methods_1 = require("./methods");
//oracleDBTypes.fetchAsString = [oracleDBTypes.CLOB]; TBD
class OracleSql {
    description;
    constructor(baseDescription) {
        this.description = {
            ...baseDescription,
            ...versionDescription_1.versionDescription,
        };
    }
    methods = { credentialTest: methods_1.credentialTest, listSearch: methods_1.listSearch, loadOptions: methods_1.loadOptions, resourceMapping: methods_1.resourceMapping };
    async execute() {
        return await router_1.router.call(this);
    }
}
exports.OracleSql = OracleSql;
//# sourceMappingURL=OracleSql.node.js.map