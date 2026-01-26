"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaSearch = schemaSearch;
exports.tableSearch = tableSearch;
const n8n_workflow_1 = require("n8n-workflow");
const oracleDBTypes = __importStar(require("oracledb"));
const transport_1 = require("../transport");
async function schemaSearch() {
    const credentials = await this.getCredentials('oracleDBApi');
    const options = { nodeVersion: this.getNode().typeVersion };
    const pool = await transport_1.configureOracleDB.call(this, credentials, options);
    let conn;
    try {
        conn = await pool.getConnection();
        const response = await conn.execute('SELECT username FROM all_users', [], {
            outFormat: oracleDBTypes.OUT_FORMAT_OBJECT,
        });
        const results = response.rows?.map((schema) => ({
            name: schema.USERNAME,
            value: schema.USERNAME,
        })) ?? [];
        return { results };
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to fetch schemas: ${error.message}`);
    }
    finally {
        if (conn) {
            await conn.close(); // Ensure connection is closed
        }
    }
}
async function tableSearch() {
    const credentials = await this.getCredentials('oracleDBApi');
    const options = { nodeVersion: this.getNode().typeVersion };
    const pool = await transport_1.configureOracleDB.call(this, credentials, options);
    let conn;
    try {
        // Get the connection from the pool
        conn = await pool.getConnection();
        // Retrieve the schema parameter
        const schema = this.getNodeParameter('schema', 0, {
            extractValue: true,
        });
        // Execute the SQL query to fetch table names for the given schema
        const response = await conn.execute('SELECT table_name FROM all_tables WHERE owner = (:1)', [schema], {
            outFormat: oracleDBTypes.OUT_FORMAT_OBJECT, // Ensure that the response is in object format
        });
        // Map through the response.rows and format them
        const results = response.rows?.map((table) => ({
            name: table.TABLE_NAME,
            value: table.TABLE_NAME,
        })) ?? []; // Handle the case where rows might be undefined or empty
        // Return the results in the required format
        return { results };
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to fetch tables: ${error.message}`);
    }
    finally {
        // Ensure the connection is always closed
        if (conn) {
            await conn.close();
        }
    }
}
//# sourceMappingURL=listSearch.js.map