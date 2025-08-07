/**
 * Application startup initialization
 *
 * This module handles database initialization when the app starts
 * Designed for containerized deployments like Coolify
 */

import { Pool } from "pg";
import fs from "fs";
import path from "path";

let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize database schema and seed data
 * This runs once when the application starts
 */
export async function initializeOnStartup(): Promise<void> {
  // Prevent multiple initializations
  if (isInitialized) {
    return;
  }

  // If initialization is already in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  initPromise = performInitialization();
  return initPromise;
}

async function performInitialization(): Promise<void> {
  try {
    console.log("🚀 Starting database initialization...");

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      // Connection settings for containerized environments
      max: 10,
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
        const schemaPath = path.join(process.cwd(), "database", "schema.sql");
        const schemaSQL = fs.readFileSync(schemaPath, "utf8");
        await client.query(schemaSQL);
        console.log("✅ Schema created successfully");

        // Read and execute seed data
        console.log("🌱 Seeding colors...");
        const seedPath = path.join(
          process.cwd(),
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
        console.log(
          "📋 Database schema already exists, skipping initialization"
        );

        // Still run seed to ensure we have latest colors (uses ON CONFLICT)
        console.log("🌱 Updating colors...");
        const seedPath = path.join(
          process.cwd(),
          "database",
          "seed-colors.sql"
        );
        const seedSQL = fs.readFileSync(seedPath, "utf8");
        await client.query(seedSQL);
        console.log("✅ Colors updated successfully");
      }

      console.log("🎉 Database initialization complete!");
      isInitialized = true;
    } finally {
      client.release();
      await pool.end();
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    console.error(
      "Make sure DATABASE_URL is set and the database is accessible"
    );

    // In production, we might want to retry or fail gracefully
    if (process.env.NODE_ENV === "production") {
      // Log the error but don't crash the app
      console.error(
        "Database initialization failed, some features may not work properly"
      );
      isInitialized = true; // Mark as done to prevent infinite retries
    } else {
      throw error;
    }
  }
}

/**
 * Middleware to ensure database is initialized before handling requests
 */
export async function ensureDbInitialized(): Promise<void> {
  if (!isInitialized && !initPromise) {
    await initializeOnStartup();
  } else if (initPromise) {
    await initPromise;
  }
}
