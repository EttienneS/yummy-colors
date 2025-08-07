# PostgreSQL Database Setup

This guide will help you set up an external PostgreSQL database for the Yummy Colors application.

## Prerequisites

- PostgreSQL database (local or cloud-hosted)
- Node.js and npm installed
- Database connection credentials

## Supported PostgreSQL Providers

### 1. Supabase (Recommended for beginners)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

### 2. Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

### 3. Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project and add PostgreSQL
3. Copy the connection string from the variables tab

### 4. Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create a database
createdb yummy_colors

# Connection string format:
# postgresql://username:password@localhost:5432/yummy_colors
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install pg @types/pg dotenv
```

### 2. Configure Environment Variables

1. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your database URL:
   ```env
   DATABASE_URL="your-postgresql-connection-string-here"
   ```

### 3. Initialize the Database

Run the database initialization script:

```bash
npm run db:init
```

This will:

- Create all necessary tables
- Set up indexes for performance
- Seed the 50 curated colors
- Create triggers for automatic timestamps

### 4. Alternative Manual Setup

If the script doesn't work, you can run the SQL files manually:

```bash
# Create schema
npm run db:schema

# Seed colors
npm run db:seed
```

Or use a PostgreSQL client:

```sql
-- Run the contents of database/schema.sql
-- Then run the contents of database/seed-colors.sql
```

## Database Schema Overview

The database contains these main tables:

- **`colors`**: The 50 curated colors with names, hex values, HSL/RGB values, and categories
- **`game_sessions`**: User game sessions with metadata
- **`round_results`**: Results from each round of color selection
- **`round_colors`**: Colors shown in each round
- **`session_colors`**: Colors selected by users with selection counts
- **`favorite_colors`**: Colors chosen in the favorites round
- **`final_rankings`**: Final top 3 color rankings

## Verification

After setup, you can verify the database is working:

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Play a complete game at `http://localhost:1508`

3. Check the admin dashboard at `http://localhost:1508/admin`

4. Verify data is being saved by checking your database directly

## Troubleshooting

### Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your database provider requires SSL (most cloud providers do)
- Ensure your IP is whitelisted (for cloud databases)

### Permission Issues

- Make sure your database user has CREATE, INSERT, UPDATE, SELECT permissions
- Some providers require explicit permission for creating databases/schemas

### Migration from JSON

If you have existing data in `data/game-results.json`, you'll need to:

1. Set up the new database
2. Run a migration script (not provided in this setup)
3. Keep the old system running during transition

## Performance Notes

- The database uses indexes for common queries
- Connection pooling is configured for optimal performance
- Queries are optimized for the analytics dashboard

## Security

- Always use environment variables for database credentials
- Never commit `.env.local` to version control
- Use SSL connections for production databases
- Consider using connection pooling in production
