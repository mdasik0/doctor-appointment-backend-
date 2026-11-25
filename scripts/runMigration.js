const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { pool } = require("../src/config/db");

const runMigration = async () => {
  try {
    const filePath = path.join(
      __dirname,
      "../sql/migrations/002_create_doctor_profiles.sql"
    );

    const sql = fs.readFileSync(filePath, "utf8");

    await pool.query(sql);

    console.log("Doctor profiles migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await pool.end();
  }
};

runMigration();