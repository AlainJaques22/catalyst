"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderConstants = exports.CURRENT_VERSION = exports.RESOURCE_TYPES = void 0;
exports.RESOURCE_TYPES = [
    'dbs',
    'colls',
    'sprocs',
    'udfs',
    'triggers',
    'users',
    'permissions',
    'docs',
];
exports.CURRENT_VERSION = '2018-12-31';
exports.HeaderConstants = {
    AUTHORIZATION: 'authorization',
    X_MS_CONTINUATION: 'x-ms-continuation',
    X_MS_COSMOS_OFFER_AUTOPILOT_SETTING: 'x-ms-cosmos-offer-autopilot-setting',
    X_MS_DOCUMENTDB_IS_UPSERT: 'x-ms-documentdb-is-upsert',
    X_MS_DOCUMENTDB_PARTITIONKEY: 'x-ms-documentdb-partitionkey',
    X_MS_MAX_ITEM_COUNT: 'x-ms-max-item-count',
    X_MS_OFFER_THROUGHPUT: 'x-ms-offer-throughput',
};
//# sourceMappingURL=constants.js.map