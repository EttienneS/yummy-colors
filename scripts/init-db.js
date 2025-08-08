#!/usr/bin/env node

/**
 * Database initialization script for Yummy Colors
 *
 * This script will:
 * 1. Create the database schema
 * 2. Seed the curated colors
 *
 * Usage:
 *   node scripts/init-db.js
 *
 * Make sure your DATABASE_URL is set in .env.local
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    console.log("🚀 Initializing Yummy Colors database...");

    // Read and execute schema
    console.log("📋 Creating schema...");
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "..", "database", "schema.sql"),
      "utf8"
    );
    await client.query(schemaSQL);
    console.log("✅ Schema created successfully");

    // Read and execute seed data
    console.log("🌱 Seeding colors...");
    const seedSQL = fs.readFileSync(
      path.join(__dirname, "..", "database", "seed-colors.sql"),
      "utf8"
    );
    await client.query(seedSQL);
    console.log("✅ Colors seeded successfully");

    // Run location migration
    console.log("🗺️  Running location migration...");
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, "..", "database", "migration-add-location.sql"),
      "utf8"
    );
    await client.query(migrationSQL);
    console.log("✅ Location migration completed");

    // Verify the setup
    const colorCount = await client.query("SELECT COUNT(*) FROM colors");
    console.log(`🎨 Total colors in database: ${colorCount.rows[0].count}`);

    console.log("🎉 Database initialization complete!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
