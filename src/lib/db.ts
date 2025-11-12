import { sql } from "@vercel/postgres";

// Database Types
export interface CreatorRecord {
  id: string;
  city: string;
  name: string;
  instagram_handle: string;
  followers: string;
  engagement_rate: string;
  fit_reason: string;
  initial: string;
  created_at: Date;
}

export interface GapRecord {
  id: string;
  city: string;
  state: string;
  coverage: number;
  priority: "High" | "Medium" | "Low";
  missing_categories: string[];
  campaign_active: boolean;
  created_at: Date;
}

export interface ViralRecord {
  id: string;
  user_name: string;
  cities: string[];
  cuisine: string;
  caption: string;
  badges: string; // JSON string
  created_at: Date;
}

// Initialize database tables (run on first use)
export async function initializeDatabase(): Promise<void> {
  try {
    // Create creators table
    await sql`
      CREATE TABLE IF NOT EXISTS creators (
        id VARCHAR(255) PRIMARY KEY,
        city VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        instagram_handle VARCHAR(255) NOT NULL,
        followers VARCHAR(50) NOT NULL,
        engagement_rate VARCHAR(50) NOT NULL,
        fit_reason TEXT NOT NULL,
        initial VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create gaps table
    await sql`
      CREATE TABLE IF NOT EXISTS gaps (
        id VARCHAR(255) PRIMARY KEY,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(10) NOT NULL,
        coverage INTEGER NOT NULL,
        priority VARCHAR(20) NOT NULL,
        missing_categories TEXT NOT NULL,
        campaign_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create viral_content table
    await sql`
      CREATE TABLE IF NOT EXISTS viral_content (
        id VARCHAR(255) PRIMARY KEY,
        user_name VARCHAR(255) NOT NULL,
        cities TEXT NOT NULL,
        cuisine VARCHAR(100) NOT NULL,
        caption TEXT NOT NULL,
        badges TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_creators_city ON creators(city)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_creators_created ON creators(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_gaps_city ON gaps(city)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_gaps_created ON gaps(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_viral_created ON viral_content(created_at DESC)`;
  } catch (error) {
    console.error("Error initializing database:", error);
    // Don't throw - allow app to continue if DB isn't available
  }
}

// Creator operations
export async function saveCreators(
  city: string,
  creators: Array<{
    name: string;
    instagramHandle: string;
    followers: string;
    engagementRate: string;
    fitReason: string;
    initial: string;
  }>
): Promise<void> {
  try {
    await initializeDatabase();
    for (const creator of creators) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await sql`
        INSERT INTO creators (id, city, name, instagram_handle, followers, engagement_rate, fit_reason, initial)
        VALUES (${id}, ${city}, ${creator.name}, ${creator.instagramHandle}, ${creator.followers}, ${creator.engagementRate}, ${creator.fitReason}, ${creator.initial})
      `;
    }
  } catch (error) {
    console.error("Error saving creators:", error);
    throw error;
  }
}

export async function getCreators(
  city?: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ data: CreatorRecord[]; total: number }> {
  try {
    await initializeDatabase();
    const offset = (page - 1) * limit;

    // Build count query
    let countResult;
    if (city && search) {
      const searchPattern = `%${search}%`;
      countResult = await sql`SELECT COUNT(*) as total FROM creators WHERE city = ${city} AND (name ILIKE ${searchPattern} OR instagram_handle ILIKE ${searchPattern})`;
    } else if (city) {
      countResult = await sql`SELECT COUNT(*) as total FROM creators WHERE city = ${city}`;
    } else if (search) {
      const searchPattern = `%${search}%`;
      countResult = await sql`SELECT COUNT(*) as total FROM creators WHERE name ILIKE ${searchPattern} OR instagram_handle ILIKE ${searchPattern}`;
    } else {
      countResult = await sql`SELECT COUNT(*) as total FROM creators`;
    }
    const total = parseInt(countResult.rows[0].total as string, 10);

    // Build data query
    let result;
    if (city && search) {
      const searchPattern = `%${search}%`;
      result = await sql`SELECT * FROM creators WHERE city = ${city} AND (name ILIKE ${searchPattern} OR instagram_handle ILIKE ${searchPattern}) ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (city) {
      result = await sql`SELECT * FROM creators WHERE city = ${city} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (search) {
      const searchPattern = `%${search}%`;
      result = await sql`SELECT * FROM creators WHERE name ILIKE ${searchPattern} OR instagram_handle ILIKE ${searchPattern} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else {
      result = await sql`SELECT * FROM creators ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    }

    return {
      data: result.rows.map((row) => ({
        id: row.id,
        city: row.city,
        name: row.name,
        instagram_handle: row.instagram_handle,
        followers: row.followers,
        engagement_rate: row.engagement_rate,
        fit_reason: row.fit_reason,
        initial: row.initial,
        created_at: new Date(row.created_at as string),
      })) as CreatorRecord[],
      total,
    };
  } catch (error) {
    console.error("Error fetching creators:", error);
    return { data: [], total: 0 };
  }
}

// Gap operations
export async function saveGaps(gaps: Array<{
  city: string;
  state: string;
  coverage: number;
  priority: "High" | "Medium" | "Low";
  missingCategories: string[];
}>): Promise<void> {
  try {
    await initializeDatabase();
    for (const gap of gaps) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      await sql`
        INSERT INTO gaps (id, city, state, coverage, priority, missing_categories, campaign_active)
        VALUES (${id}, ${gap.city}, ${gap.state}, ${gap.coverage}, ${gap.priority}, ${JSON.stringify(gap.missingCategories)}, FALSE)
        ON CONFLICT (id) DO NOTHING
      `;
    }
  } catch (error) {
    console.error("Error saving gaps:", error);
    throw error;
  }
}

export async function getGaps(
  priority?: "High" | "Medium" | "Low",
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ data: GapRecord[]; total: number }> {
  try {
    await initializeDatabase();
    const offset = (page - 1) * limit;

    // Build count query
    let countResult;
    if (priority && search) {
      const searchPattern = `%${search}%`;
      countResult = await sql`SELECT COUNT(*) as total FROM gaps WHERE priority = ${priority} AND (city ILIKE ${searchPattern} OR state ILIKE ${searchPattern})`;
    } else if (priority) {
      countResult = await sql`SELECT COUNT(*) as total FROM gaps WHERE priority = ${priority}`;
    } else if (search) {
      const searchPattern = `%${search}%`;
      countResult = await sql`SELECT COUNT(*) as total FROM gaps WHERE city ILIKE ${searchPattern} OR state ILIKE ${searchPattern}`;
    } else {
      countResult = await sql`SELECT COUNT(*) as total FROM gaps`;
    }
    const total = parseInt(countResult.rows[0].total as string, 10);

    // Build data query
    let result;
    if (priority && search) {
      const searchPattern = `%${search}%`;
      result = await sql`SELECT * FROM gaps WHERE priority = ${priority} AND (city ILIKE ${searchPattern} OR state ILIKE ${searchPattern}) ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (priority) {
      result = await sql`SELECT * FROM gaps WHERE priority = ${priority} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (search) {
      const searchPattern = `%${search}%`;
      result = await sql`SELECT * FROM gaps WHERE city ILIKE ${searchPattern} OR state ILIKE ${searchPattern} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else {
      result = await sql`SELECT * FROM gaps ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    }

    return {
      data: result.rows.map((row) => ({
        id: row.id,
        city: row.city,
        state: row.state,
        coverage: row.coverage as number,
        priority: row.priority as "High" | "Medium" | "Low",
        missing_categories: JSON.parse(row.missing_categories as string),
        campaign_active: row.campaign_active as boolean,
        created_at: new Date(row.created_at as string),
      })) as GapRecord[],
      total,
    };
  } catch (error) {
    console.error("Error fetching gaps:", error);
    return { data: [], total: 0 };
  }
}

export async function updateCampaignStatus(
  city: string,
  state: string,
  active: boolean
): Promise<void> {
  try {
    await sql`
      UPDATE gaps
      SET campaign_active = ${active}
      WHERE city = ${city} AND state = ${state}
    `;
  } catch (error) {
    console.error("Error updating campaign status:", error);
    throw error;
  }
}

// Viral content operations
export async function saveViralContent(
  userName: string,
  cities: string[],
  cuisine: string,
  caption: string,
  badges: Array<{ name: string; emoji: string; color: string }>
): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO viral_content (id, user_name, cities, cuisine, caption, badges)
      VALUES (${id}, ${userName}, ${JSON.stringify(cities)}, ${cuisine}, ${caption}, ${JSON.stringify(badges)})
    `;
    return id;
  } catch (error) {
    console.error("Error saving viral content:", error);
    throw error;
  }
}

export async function getViralContent(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<{ data: ViralRecord[]; total: number }> {
  try {
    await initializeDatabase();
    const offset = (page - 1) * limit;

    // Build count query
    let countResult;
    if (search) {
      const searchPattern = `%${search}%`;
      countResult = await sql`SELECT COUNT(*) as total FROM viral_content WHERE user_name ILIKE ${searchPattern} OR cuisine ILIKE ${searchPattern}`;
    } else {
      countResult = await sql`SELECT COUNT(*) as total FROM viral_content`;
    }
    const total = parseInt(countResult.rows[0].total as string, 10);

    // Build data query
    let result;
    if (search) {
      const searchPattern = `%${search}%`;
      result = await sql`SELECT * FROM viral_content WHERE user_name ILIKE ${searchPattern} OR cuisine ILIKE ${searchPattern} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else {
      result = await sql`SELECT * FROM viral_content ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    }

    return {
      data: result.rows.map((row) => ({
        id: row.id,
        user_name: row.user_name,
        cities: JSON.parse(row.cities as string),
        cuisine: row.cuisine,
        caption: row.caption,
        badges: row.badges,
        created_at: new Date(row.created_at as string),
      })) as ViralRecord[],
      total,
    };
  } catch (error) {
    console.error("Error fetching viral content:", error);
    return { data: [], total: 0 };
  }
}

// Analytics operations
export async function getAnalyticsData(
  startDate?: Date,
  endDate?: Date
): Promise<{
  creators: number;
  gaps: number;
  viral: number;
  creatorsByMonth: Array<{ month: string; count: number }>;
  gapsByCity: Array<{ city: string; count: number }>;
  viralByCategory: Array<{ category: string; count: number }>;
}> {
  try {
    await initializeDatabase();

    // Total counts
    let creatorsCount, gapsCount, viralCount;
    if (startDate && endDate) {
      creatorsCount = await sql`SELECT COUNT(*) as count FROM creators WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()}`;
      gapsCount = await sql`SELECT COUNT(*) as count FROM gaps WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()}`;
      viralCount = await sql`SELECT COUNT(*) as count FROM viral_content WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()}`;
    } else {
      creatorsCount = await sql`SELECT COUNT(*) as count FROM creators`;
      gapsCount = await sql`SELECT COUNT(*) as count FROM gaps`;
      viralCount = await sql`SELECT COUNT(*) as count FROM viral_content`;
    }

    // Creators by month
    let creatorsByMonth;
    if (startDate && endDate) {
      creatorsByMonth = await sql`
        SELECT 
          TO_CHAR(created_at, 'Mon YYYY') as month,
          COUNT(*) as count
        FROM creators
        WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()}
        GROUP BY TO_CHAR(created_at, 'Mon YYYY')
        ORDER BY MIN(created_at) DESC
        LIMIT 12
      `;
    } else {
      creatorsByMonth = await sql`
        SELECT 
          TO_CHAR(created_at, 'Mon YYYY') as month,
          COUNT(*) as count
        FROM creators
        GROUP BY TO_CHAR(created_at, 'Mon YYYY')
        ORDER BY MIN(created_at) DESC
        LIMIT 12
      `;
    }

    // Gaps by city
    let gapsByCity;
    if (startDate && endDate) {
      gapsByCity = await sql`
        SELECT 
          city,
          COUNT(*) as count
        FROM gaps
        WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()}
        GROUP BY city
        ORDER BY count DESC
        LIMIT 10
      `;
    } else {
      gapsByCity = await sql`
        SELECT 
          city,
          COUNT(*) as count
        FROM gaps
        GROUP BY city
        ORDER BY count DESC
        LIMIT 10
      `;
    }

    // Viral by category (cuisine)
    let viralByCategory;
    if (startDate && endDate) {
      viralByCategory = await sql`
        SELECT 
          cuisine as category,
          COUNT(*) as count
        FROM viral_content
        WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()}
        GROUP BY cuisine
        ORDER BY count DESC
      `;
    } else {
      viralByCategory = await sql`
        SELECT 
          cuisine as category,
          COUNT(*) as count
        FROM viral_content
        GROUP BY cuisine
        ORDER BY count DESC
      `;
    }

    return {
      creators: parseInt(creatorsCount.rows[0].count as string, 10),
      gaps: parseInt(gapsCount.rows[0].count as string, 10),
      viral: parseInt(viralCount.rows[0].count as string, 10),
      creatorsByMonth: creatorsByMonth.rows.map((r) => ({
        month: r.month as string,
        count: parseInt(r.count as string, 10),
      })),
      gapsByCity: gapsByCity.rows.map((r) => ({
        city: r.city as string,
        count: parseInt(r.count as string, 10),
      })),
      viralByCategory: viralByCategory.rows.map((r) => ({
        category: r.category as string,
        count: parseInt(r.count as string, 10),
      })),
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      creators: 0,
      gaps: 0,
      viral: 0,
      creatorsByMonth: [],
      gapsByCity: [],
      viralByCategory: [],
    };
  }
}

// Export data
export async function exportData(
  type: "creators" | "gaps" | "viral" | "all",
  startDate?: Date,
  endDate?: Date
): Promise<any> {
  try {
    await initializeDatabase();

    if (type === "creators") {
      if (startDate && endDate) {
        const creators = await sql`SELECT * FROM creators WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()} ORDER BY created_at DESC`;
        return creators.rows;
      } else {
        const creators = await sql`SELECT * FROM creators ORDER BY created_at DESC`;
        return creators.rows;
      }
    }

    if (type === "gaps") {
      if (startDate && endDate) {
        const gaps = await sql`SELECT * FROM gaps WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()} ORDER BY created_at DESC`;
        return gaps.rows;
      } else {
        const gaps = await sql`SELECT * FROM gaps ORDER BY created_at DESC`;
        return gaps.rows;
      }
    }

    if (type === "viral") {
      if (startDate && endDate) {
        const viral = await sql`SELECT * FROM viral_content WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()} ORDER BY created_at DESC`;
        return viral.rows;
      } else {
        const viral = await sql`SELECT * FROM viral_content ORDER BY created_at DESC`;
        return viral.rows;
      }
    }

    if (type === "all") {
      let creators, gaps, viral;
      if (startDate && endDate) {
        creators = await sql`SELECT * FROM creators WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()} ORDER BY created_at DESC`;
        gaps = await sql`SELECT * FROM gaps WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()} ORDER BY created_at DESC`;
        viral = await sql`SELECT * FROM viral_content WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()} ORDER BY created_at DESC`;
      } else {
        creators = await sql`SELECT * FROM creators ORDER BY created_at DESC`;
        gaps = await sql`SELECT * FROM gaps ORDER BY created_at DESC`;
        viral = await sql`SELECT * FROM viral_content ORDER BY created_at DESC`;
      }
      return {
        creators: creators.rows,
        gaps: gaps.rows,
        viral: viral.rows,
      };
    }

    return [];
  } catch (error) {
    console.error("Error exporting data:", error);
    return [];
  }
}

