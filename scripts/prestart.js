#!/usr/bin/env node

/* eslint-disable */

/**
 * Pre-start initialization script for Coolify deployment
 *
 * This script runs database initialization before the Next.js app starts
 * It's designed to be called from package.json scripts
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

async function initializeDatabase() {
  try {
    console.log("🚀 Running pre-start database initialization...");

    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL environment variable is not set");
      process.exit(1);
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    const client = await pool.connect();

    try {
      // Check if tables already exist
      const tablesExist = await client.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'colors'
      `);

      if (parseInt(tablesExist.rows[0].count) === 0) {
        console.log("📋 Creating database schema...");

        // Read and execute schema
        const schemaPath = path.join(__dirname, "..", "database", "schema.sql");
        const schemaSQL = fs.readFileSync(schemaPath, "utf8");
        await client.query(schemaSQL);
        console.log("✅ Schema created successfully");

        // Read and execute seed data
        console.log("🌱 Seeding colors...");
        const seedPath = path.join(
          __dirname,
          "..",
          "database",
          "seed-colors.sql"
        );
        const seedSQL = fs.readFileSync(seedPath, "utf8");
        await client.query(seedSQL);
        console.log("✅ Colors seeded successfully");

        // Verify the setup
        const colorCount = await client.query("SELECT COUNT(*) FROM colors");
        console.log(`🎨 Total colors in database: ${colorCount.rows[0].count}`);
      } else {
        console.log("📋 Database schema already exists, updating colors...");

        // Still run seed to ensure we have latest colors (uses ON CONFLICT)
        const seedPath = path.join(
          __dirname,
          "..",
          "database",
          "seed-colors.sql"
        );
        const seedSQL = fs.readFileSync(seedPath, "utf8");
        await client.query(seedSQL);
        console.log("✅ Colors updated successfully");
      }

      console.log("✅ Pre-start database initialization complete");
    } finally {
      client.release();
      await pool.end();
    }
  } catch (error) {
    console.error("❌ Pre-start database initialization failed:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
