# Coolify Deployment Guide for Yummy Colors

This guide will help you deploy Yummy Colors to Coolify with automatic database initialization.

## Prerequisites

1. **Coolify instance** - Running and accessible
2. **PostgreSQL database** - Available through Coolify or external provider
3. **Git repository** - Your code pushed to a Git provider (GitHub, GitLab, etc.)

## Database Setup

### Option 1: Using Coolify's PostgreSQL Service

1. In your Coolify dashboard, create a new PostgreSQL service
2. Note the connection details (host, port, database name, username, password)
3. Construct your DATABASE_URL in this format:
   ```
   postgresql://username:password@host:port/database_name
   ```

### Option 2: Using External PostgreSQL Provider

You can use any PostgreSQL provider like:

- **Supabase** (supabase.com)
- **Neon** (neon.tech)
- **Railway** (railway.app)
- **Aiven** (aiven.io)

Each provider will give you a connection string that looks like:

```
postgresql://username:password@host:port/database_name?sslmode=require
```

## Coolify Application Setup

### Step 1: Create New Application

1. Go to your Coolify dashboard
2. Click "New Resource" → "Application"
3. Choose your Git provider and repository
4. Select the branch you want to deploy (usually `main`)

### Step 2: Configure Build Settings

In the application settings:

1. **Build Pack**: Choose "Docker"
2. **Dockerfile Location**: `./Dockerfile` (should be auto-detected)
3. **Build Command**: Leave empty (handled by Dockerfile)
4. **Port**: `3000`

### Step 3: Environment Variables

Add these environment variables:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://your_connection_string_here
NEXT_TELEMETRY_DISABLED=1
```

**Important**: Replace `your_connection_string_here` with your actual PostgreSQL connection string.

### Step 4: Advanced Settings

1. **Health Check Path**: `/` (optional)
2. **Restart Policy**: `unless-stopped`
3. **Memory Limit**: `512MB` (adjust as needed)
4. **CPU Limit**: `0.5` (adjust as needed)

## How It Works

The deployment process includes automatic database initialization:

1. **Build Phase**: Next.js app is built with all dependencies
2. **Startup Phase**: Before the app starts, the prestart script runs:
   - Checks if DATABASE_URL is available
   - Connects to PostgreSQL database
   - Creates schema if it doesn't exist
   - Seeds the 50 curated colors
   - Verifies everything is working
3. **Runtime Phase**: Next.js app starts and serves requests

## Key Files for Coolify Deployment

### Dockerfile

- Multi-stage build for optimal image size
- Includes database files for initialization
- Runs prestart script before starting the app

### scripts/prestart.js

- Handles database initialization on startup
- Safe to run multiple times (idempotent)
- Fails fast if DATABASE_URL is missing

### package.json

- Modified `start` script runs prestart before Next.js
- All necessary dependencies included

## Deployment Steps

1. **Push your code** to your Git repository
2. **Create the application** in Coolify following the setup above
3. **Set the DATABASE_URL** environment variable
4. **Deploy** - Coolify will:
   - Clone your repository
   - Build the Docker image
   - Run the container
   - Execute database initialization
   - Start the Next.js application

## Monitoring Deployment

### Successful Deployment Logs

You should see logs like:

```
🚀 Running pre-start database initialization...
📋 Creating database schema... (or "Database schema already exists")
✅ Schema created successfully
🌱 Seeding colors...
✅ Colors seeded successfully
🎨 Total colors in database: 50
✅ Pre-start database initialization complete
```

### Troubleshooting

**Database Connection Failed**:

- Verify DATABASE_URL is correct
- Check if database server is accessible
- Ensure SSL settings match your provider requirements

**Build Failed**:

- Check if all dependencies are in package.json
- Verify Dockerfile syntax
- Review build logs in Coolify

**App Won't Start**:

- Check environment variables are set
- Review application logs
- Verify port 3000 is exposed

## Environment Variables Reference

| Variable                  | Required | Description                  | Example                               |
| ------------------------- | -------- | ---------------------------- | ------------------------------------- |
| `DATABASE_URL`            | Yes      | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV`                | Yes      | Runtime environment          | `production`                          |
| `NEXT_TELEMETRY_DISABLED` | No       | Disable Next.js telemetry    | `1`                                   |

## Post-Deployment

After successful deployment:

1. **Test the application** - Visit your app URL
2. **Check the admin panel** - Go to `/admin` to see analytics
3. **Verify colors** - Play the game to ensure colors are working
4. **Monitor logs** - Watch for any runtime errors

## Scaling Considerations

For production use:

1. **Database Connection Pooling**: Already configured in the app
2. **Memory Limits**: Adjust based on usage patterns
3. **Horizontal Scaling**: Database initialization is safe for multiple instances
4. **Backup Strategy**: Set up regular database backups
5. **Monitoring**: Consider adding application monitoring

## Support

If you encounter issues:

1. Check Coolify application logs
2. Verify database connectivity
3. Review environment variables
4. Test locally with same DATABASE_URL

The application is designed to be resilient and will gracefully handle most deployment scenarios while ensuring your database is always properly initialized with the curated colors.
