"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postgres = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const PostgresV1_node_1 = require("./v1/PostgresV1.node");
const PostgresV2_node_1 = require("./v2/PostgresV2.node");
class Postgres extends n8n_workflow_1.VersionedNodeType {
    constructor() {
        const baseDescription = {
            displayName: 'Postgres',
            name: 'postgres',
            icon: 'file:postgres.svg',
            group: ['input'],
            defaultVersion: 2.6,
            description: 'Get, add and update data in Postgres',
            parameterPane: 'wide',
        };
        const nodeVersions = {
            1: new PostgresV1_node_1.PostgresV1(baseDescription),
            2: new PostgresV2_node_1.PostgresV2(baseDescription),
            2.1: new PostgresV2_node_1.PostgresV2(baseDescription),
            2.2: new PostgresV2_node_1.PostgresV2(baseDescription),
            2.3: new PostgresV2_node_1.PostgresV2(baseDescription),
            2.4: new PostgresV2_node_1.PostgresV2(baseDescription),
            2.5: new PostgresV2_node_1.PostgresV2(baseDescription),
            2.6: new PostgresV2_node_1.PostgresV2(baseDescription),
        };
        super(nodeVersions, baseDescription);
    }
}
exports.Postgres = Postgres;
//# sourceMappingURL=Postgres.node.js.map