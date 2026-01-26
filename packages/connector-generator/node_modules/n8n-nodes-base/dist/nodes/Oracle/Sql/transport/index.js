"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureOracleDB = configureOracleDB;
const oracledb_1 = __importDefault(require("oracledb"));
const connection_pool_manager_1 = require("../../../../utils/connection-pool-manager");
// used for thick mode to call initOracleClient API only once.
let initializeDriverMode = false;
const getOracleDBConfig = (credentials) => {
    const { useThickMode, useSSL, ...dbConfig } = credentials;
    return dbConfig;
};
async function configureOracleDB(credentials, options = {}) {
    const poolManager = connection_pool_manager_1.ConnectionPoolManager.getInstance(this.logger);
    const fallBackHandler = async (abortController) => {
        const dbConfig = getOracleDBConfig(credentials);
        if (credentials.useThickMode) {
            if (!initializeDriverMode) {
                oracledb_1.default.initOracleClient();
                initializeDriverMode = true;
            }
        }
        else if (initializeDriverMode) {
            // Thick mode is initialized, cannot switch back to thin mode
            throw new Error('Thin mode can not be used after thick mode initialization');
        }
        const pool = await oracledb_1.default.createPool(dbConfig);
        abortController.signal.addEventListener('abort', async () => {
            try {
                await pool.close();
                this.logger.debug('pool closed on abort');
            }
            catch (error) {
                this.logger.error('Error closing pool on abort', { error });
            }
        });
        return pool;
    };
    return await poolManager.getConnection({
        credentials,
        nodeType: 'oracledb',
        nodeVersion: String(options.nodeVersion ?? '1'),
        fallBackHandler,
        wasUsed: (pool) => {
            if (pool) {
                this.logger.debug(`DB pool reused, open connections: ${pool.connectionsOpen}`);
            }
        },
    });
}
//# sourceMappingURL=index.js.map