"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Helper for easier query execution
const query = (text, params) => pool.query(text, params);
exports.query = query;
exports.default = pool;
//# sourceMappingURL=db.js.map