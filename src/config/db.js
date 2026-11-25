const { Pool } = require("pg");

const pool = new Pool();

pool.on("error", (error) => {
  console.error("Unexpected database error:", error);
});

module.exports = { pool };