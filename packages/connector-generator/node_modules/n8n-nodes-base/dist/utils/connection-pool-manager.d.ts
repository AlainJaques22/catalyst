import { type Logger } from 'n8n-workflow';
type RegistrationOptions = {
    credentials: unknown;
    nodeType: string;
    nodeVersion?: string;
};
type GetConnectionOption<Pool> = RegistrationOptions & {
    /**
     * When a node requests for a connection pool, but none is available, this
     * handler is called to create new instance of the pool, which is then cached
     * and re-used until it goes stale.
     */
    fallBackHandler: (abortController: AbortController) => Promise<Pool>;
    wasUsed: (pool: Pool) => void;
};
export declare class ConnectionPoolManager {
    private readonly logger;
    /**
     * Gets the singleton instance of the ConnectionPoolManager.
     * Creates a new instance if one doesn't exist.
     */
    static getInstance(logger: Logger): ConnectionPoolManager;
    private map;
    /**
     * Private constructor that initializes the connection pool manager.
     * Sets up cleanup handlers for process exit and stale connections.
     */
    private constructor();
    /**
     * Generates a unique key for connection pool identification.
     * Hashes the credentials and node information for security.
     */
    private makeKey;
    /**
     * Gets or creates a connection pool for the given options.
     * Updates the last used timestamp for existing connections.
     */
    getConnection<T>(options: GetConnectionOption<T>): Promise<T>;
    private cleanupConnection;
    /**
     * Removes and cleans up connection pools that haven't been used within the
     * TTL.
     */
    private cleanupStaleConnections;
    /**
     * Removes and cleans up all existing connection pools.
     * Connections are closed in the background.
     */
    purgeConnections(): void;
}
export {};
//# sourceMappingURL=connection-pool-manager.d.ts.map