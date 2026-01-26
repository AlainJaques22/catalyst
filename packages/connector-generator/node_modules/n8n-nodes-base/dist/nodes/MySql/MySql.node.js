"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySql = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MySqlV1_node_1 = require("./v1/MySqlV1.node");
const MySqlV2_node_1 = require("./v2/MySqlV2.node");
class MySql extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'MySQL',
            name: 'mySql',
            icon: { light: 'file:mysql.svg', dark: 'file:mysql.dark.svg' },
            group: ['input'],
            defaultVersion: 2.5,
            description: 'Get, add and update data in MySQL',
            parameterPane: 'wide',
        };
        const nodeVersions = {
            1: new MySqlV1_node_1.MySqlV1(baseDescription),
            2: new MySqlV2_node_1.MySqlV2(baseDescription),
            2.1: new MySqlV2_node_1.MySqlV2(baseDescription),
            2.2: new MySqlV2_node_1.MySqlV2(baseDescription),
            2.3: new MySqlV2_node_1.MySqlV2(baseDescription),
            2.4: new MySqlV2_node_1.MySqlV2(baseDescription),
            2.5: new MySqlV2_node_1.MySqlV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.MySql = MySql;
//# sourceMappingURL=MySql.node.js.map