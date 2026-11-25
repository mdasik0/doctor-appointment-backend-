const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { pool } = require("../src/config/db");

async function setupDatabase() {
  try {
    const schemaPath = path.join(__dirname, "../sql/schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    await pool.query(sql);

    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Database setup failed:", error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();