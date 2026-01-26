"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePostgres = configurePostgres;
const node_net_1 = require("node:net");
const pg_promise_1 = __importDefault(require("pg-promise"));
const connection_pool_manager_1 = require("../../../utils/connection-pool-manager");
const constants_1 = require("../../../utils/constants");
const utilities_1 = require("../../../utils/utilities");
const getPostgresConfig = (credentials, options = {}) => {
    const dbConfig = {
        host: credentials.host,
        port: credentials.port,
        database: credentials.database,
        user: credentials.user,
        password: credentials.password,
        keepAlive: true,
        max: credentials.maxConnections,
    };
    if (options.connectionTimeout) {
        dbConfig.connectionTimeoutMillis = options.connectionTimeout * 1000;
    }
    if (options.delayClosingIdleConnection) {
        dbConfig.keepAliveInitialDelayMillis = options.delayClosingIdleConnection * 1000;
    }
    if (credentials.allowUnauthorizedCerts === true) {
        dbConfig.ssl = {
            rejectUnauthorized: false,
        };
    }
    else {
        dbConfig.ssl = !['disable', undefined].includes(credentials.ssl);
        // @ts-ignore these typings need to be updated
        dbConfig.sslmode = credentials.ssl || 'disable';
    }
    return dbConfig;
};
function withCleanupHandler(proxy, abortController, logger) {
    proxy.on('error', (error) => {
        logger.error('TCP Proxy: Got error, calling abort controller', { error });
        abortController.abort();
    });
    proxy.on('close', () => {
        logger.error('TCP Proxy: Was closed, calling abort controller');
        abortController.abort();
    });
    proxy.on('drop', (dropArgument) => {
        logger.error('TCP Proxy: Connection was dropped, calling abort controller', {
            dropArgument,
        });
        abortController.abort();
    });
    abortController.signal.addEventListener('abort', () => {
        logger.debug('Got abort signal. Closing TCP proxy server.');
        proxy.close();
    });
    return proxy;
}
async function configurePostgres(credentials, options = {}) {
    const poolManager = connection_pool_manager_1.ConnectionPoolManager.getInstance(this.logger);
    const fallBackHandler = async (abortController) => {
        const pgp = (0, pg_promise_1.default)({
            // prevent spam in console "WARNING: Creating a duplicate database object for the same connection."
            // duplicate connections created when auto loading parameters, they are closed immediately after, but several could be open at the same time
            noWarnings: true,
        });
        if (typeof options.nodeVersion === 'number' && options.nodeVersion >= 2.1) {
            // Always return dates as ISO strings
            [pgp.pg.types.builtins.TIMESTAMP, pgp.pg.types.builtins.TIMESTAMPTZ].forEach((type) => {
                pgp.pg.types.setTypeParser(type, (value) => {
                    const parsedDate = new Date(value);
                    if (isNaN(parsedDate.getTime())) {
                        return value;
                    }
                    return parsedDate.toISOString();
                });
            });
        }
        if (options.largeNumbersOutput === 'numbers') {
            pgp.pg.types.setTypeParser(20, (value) => {
                return parseInt(value, 10);
            });
            pgp.pg.types.setTypeParser(1700, (value) => {
                return parseFloat(value);
            });
        }
        const dbConfig = getPostgresConfig(credentials, options);
        if (!credentials.sshTunnel) {
            const db = pgp(dbConfig);
            return { db, pgp };
        }
        else {
            if (credentials.sshAuthenticateWith === 'privateKey' && credentials.privateKey) {
                credentials.privateKey = (0, utilities_1.formatPrivateKey)(credentials.privateKey);
            }
            const sshClient = await this.helpers.getSSHClient(credentials, abortController);
            // Create a TCP proxy listening on a random available port
            const proxy = withCleanupHandler((0, node_net_1.createServer)(), abortController, this.logger);
            const proxyPort = await new Promise((resolve) => {
                proxy.listen(0, constants_1.LOCALHOST, () => {
                    resolve(proxy.address().port);
                });
            });
            proxy.on('connection', (localSocket) => {
                sshClient.forwardOut(constants_1.LOCALHOST, localSocket.remotePort, credentials.host, credentials.port, (error, clientChannel) => {
                    if (error) {
                        this.logger.error('SSH Client: Port forwarding encountered an error', { error });
                        abortController.abort();
                    }
                    else {
                        localSocket.pipe(clientChannel);
                        clientChannel.pipe(localSocket);
                    }
                });
            });
            const db = pgp({
                ...dbConfig,
                port: proxyPort,
                host: constants_1.LOCALHOST,
            });
            abortController.signal.addEventListener('abort', async () => {
                this.logger.debug('configurePostgres: Got abort signal, closing pg connection.');
                try {
                    if (!db.$pool.ended)
                        await db.$pool.end();
                }
                catch (error) {
                    this.logger.error('configurePostgres: Encountered error while closing the pool.', {
                        error,
                    });
                    throw error;
                }
            });
            return { db, pgp, sshClient };
        }
    };
    return await poolManager.getConnection({
        credentials,
        nodeType: 'postgres',
        nodeVersion: options.nodeVersion,
        fallBackHandler,
        wasUsed: ({ sshClient }) => {
            if (sshClient) {
                this.helpers.updateLastUsed(sshClient);
            }
        },
    });
}
//# sourceMappingURL=index.js.map