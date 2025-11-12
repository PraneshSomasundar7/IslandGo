# Database Setup Guide

This application uses **Vercel Postgres** for data persistence.

## Setup Instructions

### 1. Create Vercel Postgres Database

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to the "Storage" tab
4. Click "Create Database" → Select "Postgres"
5. Follow the setup wizard

### 2. Environment Variables

After creating the database, Vercel will automatically add these environment variables:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

These are automatically available in your Vercel deployment. For local development:

1. Copy the connection string from Vercel dashboard
2. Add to your `.env.local` file:
   ```
   POSTGRES_URL=your_connection_string_here
   ```

### 3. Database Schema

The database schema is automatically created on first use via the `initializeDatabase()` function in `src/lib/db.ts`. It creates three tables:

- **creators**: Stores creator recruitment data
- **gaps**: Stores content gap analysis data
- **viral_content**: Stores viral content generation data

### 4. Features

- ✅ Automatic schema creation
- ✅ Pagination (10 items per page)
- ✅ Search functionality
- ✅ Filtering by city, priority, etc.
- ✅ Analytics aggregation
- ✅ Data export (CSV)
- ✅ Type-safe with TypeScript

### 5. API Endpoints

- `GET /api/data/creators` - Get creators with pagination/search
- `GET /api/data/gaps` - Get gaps with pagination/search
- `GET /api/data/viral` - Get viral content with pagination/search
- `GET /api/data/export` - Export data as JSON
- `GET /api/analytics` - Get analytics data

### 6. Local Development

For local development without Vercel Postgres, you can:

1. Use a local PostgreSQL instance
2. Set `POSTGRES_URL` in `.env.local` to your local connection string
3. Or use a service like Supabase, Neon, or Railway

### 7. Migration Notes

- Migrations are handled automatically via `initializeDatabase()`
- Tables are created with `IF NOT EXISTS` to prevent errors
- Indexes are created for performance optimization
- No manual migration scripts needed

### 8. Testing the Connection

After connecting your database, test the connection:

1. **Via API endpoint** (recommended):
   - Visit: `http://localhost:3000/api/db/test` (local) or `https://your-app.vercel.app/api/db/test` (production)
   - You should see a success message with table counts

2. **Via application**:
   - Use any feature that saves data (creator recruitment, content gaps, viral content)
   - Data will be automatically saved to the database
   - Check the analytics page to see data from the database

### 9. Troubleshooting

If you encounter database errors:

1. Check that `POSTGRES_URL` is set correctly
2. Verify database connection in Vercel dashboard
3. Check server logs for specific error messages
4. Ensure database is not paused (Vercel free tier pauses after inactivity)
5. Test the connection using `/api/db/test` endpoint
6. For local development, ensure `.env.local` has `POSTGRES_URL` set

