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

// Marketing Monitoring Types
export interface CampaignRecord {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed" | "Draft";
  budget: number;
  spent: number;
  start_date: Date;
  end_date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  platform: string;
  created_at: Date;
}

export interface BudgetRecord {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  month: string;
  year: number;
  created_at: Date;
}

export interface EngagementRecord {
  id: string;
  content_id: string;
  content_type: string;
  platform: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement_rate: number;
  date: Date;
  created_at: Date;
}

export interface AlertRecord {
  id: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  message: string;
  threshold: number;
  current_value: number;
  status: "Active" | "Resolved" | "Dismissed";
  created_at: Date;
  resolved_at?: Date;
}

export interface ConversionRecord {
  id: string;
  campaign_id: string;
  stage: string;
  user_id: string;
  value: number;
  date: Date;
  created_at: Date;
}

export interface SocialMediaRecord {
  id: string;
  platform: string;
  post_id: string;
  content_type: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  date: Date;
  created_at: Date;
}

export interface CompetitorRecord {
  id: string;
  competitor_name: string;
  metric: string;
  value: number;
  date: Date;
  created_at: Date;
}

export interface ContentCalendarRecord {
  id: string;
  title: string;
  content_type: string;
  platform: string;
  scheduled_date: Date;
  status: "Scheduled" | "Published" | "Draft" | "Cancelled";
  creator_id?: string;
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

    // Marketing Monitoring Tables
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL,
        budget DECIMAL(10, 2) NOT NULL,
        spent DECIMAL(10, 2) DEFAULT 0,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        revenue DECIMAL(10, 2) DEFAULT 0,
        platform VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS budgets (
        id VARCHAR(255) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        allocated DECIMAL(10, 2) NOT NULL,
        spent DECIMAL(10, 2) DEFAULT 0,
        month VARCHAR(20) NOT NULL,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS engagement_metrics (
        id VARCHAR(255) PRIMARY KEY,
        content_id VARCHAR(255) NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        engagement_rate DECIMAL(5, 2) DEFAULT 0,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS alerts (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        threshold DECIMAL(10, 2),
        current_value DECIMAL(10, 2),
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS conversions (
        id VARCHAR(255) PRIMARY KEY,
        campaign_id VARCHAR(255) NOT NULL,
        stage VARCHAR(50) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        value DECIMAL(10, 2) DEFAULT 0,
        date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS social_media (
        id VARCHAR(255) PRIMARY KEY,
        platform VARCHAR(50) NOT NULL,
        post_id VARCHAR(255) NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        reach INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        engagement_rate DECIMAL(5, 2) DEFAULT 0,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS competitors (
        id VARCHAR(255) PRIMARY KEY,
        competitor_name VARCHAR(255) NOT NULL,
        metric VARCHAR(100) NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS content_calendar (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        scheduled_date TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'Scheduled',
        creator_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Additional indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON budgets(month, year)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_engagement_date ON engagement_metrics(date DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_conversions_campaign ON conversions(campaign_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_social_platform_date ON social_media(platform, date DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_content_calendar_date ON content_calendar(scheduled_date)`;
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

// Campaign operations
export async function saveCampaign(campaign: Omit<CampaignRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO campaigns (id, name, status, budget, spent, start_date, end_date, impressions, clicks, conversions, revenue, platform)
      VALUES (${id}, ${campaign.name}, ${campaign.status}, ${campaign.budget}, ${campaign.spent}, ${campaign.start_date.toISOString()}, ${campaign.end_date.toISOString()}, ${campaign.impressions}, ${campaign.clicks}, ${campaign.conversions}, ${campaign.revenue}, ${campaign.platform})
    `;
    return id;
  } catch (error) {
    console.error("Error saving campaign:", error);
    throw error;
  }
}

export async function getCampaigns(status?: string): Promise<CampaignRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (status) {
      result = await sql`SELECT * FROM campaigns WHERE status = ${status} ORDER BY created_at DESC`;
    } else {
      result = await sql`SELECT * FROM campaigns ORDER BY created_at DESC`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status as CampaignRecord["status"],
      budget: parseFloat(row.budget as string),
      spent: parseFloat(row.spent as string),
      start_date: new Date(row.start_date as string),
      end_date: new Date(row.end_date as string),
      impressions: parseInt(row.impressions as string, 10),
      clicks: parseInt(row.clicks as string, 10),
      conversions: parseInt(row.conversions as string, 10),
      revenue: parseFloat(row.revenue as string),
      platform: row.platform,
      created_at: new Date(row.created_at as string),
    }));
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

// Budget operations
export async function saveBudget(budget: Omit<BudgetRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO budgets (id, category, allocated, spent, month, year)
      VALUES (${id}, ${budget.category}, ${budget.allocated}, ${budget.spent}, ${budget.month}, ${budget.year})
    `;
    return id;
  } catch (error) {
    console.error("Error saving budget:", error);
    throw error;
  }
}

export async function getBudgets(month?: string, year?: number): Promise<BudgetRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (month && year) {
      result = await sql`SELECT * FROM budgets WHERE month = ${month} AND year = ${year} ORDER BY created_at DESC`;
    } else {
      result = await sql`SELECT * FROM budgets ORDER BY year DESC, month DESC`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      category: row.category,
      allocated: parseFloat(row.allocated as string),
      spent: parseFloat(row.spent as string),
      month: row.month,
      year: parseInt(row.year as string, 10),
      created_at: new Date(row.created_at as string),
    }));
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }
}

// Engagement operations
export async function saveEngagement(engagement: Omit<EngagementRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO engagement_metrics (id, content_id, content_type, platform, views, likes, shares, comments, engagement_rate, date)
      VALUES (${id}, ${engagement.content_id}, ${engagement.content_type}, ${engagement.platform}, ${engagement.views}, ${engagement.likes}, ${engagement.shares}, ${engagement.comments}, ${engagement.engagement_rate}, ${engagement.date.toISOString().split('T')[0]})
    `;
    return id;
  } catch (error) {
    console.error("Error saving engagement:", error);
    throw error;
  }
}

export async function getEngagementMetrics(startDate?: Date, endDate?: Date): Promise<EngagementRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (startDate && endDate) {
      result = await sql`SELECT * FROM engagement_metrics WHERE date >= ${startDate.toISOString().split('T')[0]} AND date <= ${endDate.toISOString().split('T')[0]} ORDER BY date DESC`;
    } else {
      result = await sql`SELECT * FROM engagement_metrics ORDER BY date DESC LIMIT 100`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      content_id: row.content_id,
      content_type: row.content_type,
      platform: row.platform,
      views: parseInt(row.views as string, 10),
      likes: parseInt(row.likes as string, 10),
      shares: parseInt(row.shares as string, 10),
      comments: parseInt(row.comments as string, 10),
      engagement_rate: parseFloat(row.engagement_rate as string),
      date: new Date(row.date as string),
      created_at: new Date(row.created_at as string),
    }));
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    return [];
  }
}

// Alert operations
export async function saveAlert(alert: Omit<AlertRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO alerts (id, type, severity, message, threshold, current_value, status, resolved_at)
      VALUES (${id}, ${alert.type}, ${alert.severity}, ${alert.message}, ${alert.threshold}, ${alert.current_value}, ${alert.status}, ${alert.resolved_at ? alert.resolved_at.toISOString() : null})
    `;
    return id;
  } catch (error) {
    console.error("Error saving alert:", error);
    throw error;
  }
}

export async function getAlerts(status?: string): Promise<AlertRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (status) {
      result = await sql`SELECT * FROM alerts WHERE status = ${status} ORDER BY created_at DESC`;
    } else {
      result = await sql`SELECT * FROM alerts ORDER BY created_at DESC LIMIT 50`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      severity: row.severity as AlertRecord["severity"],
      message: row.message,
      threshold: parseFloat(row.threshold as string),
      current_value: parseFloat(row.current_value as string),
      status: row.status as AlertRecord["status"],
      created_at: new Date(row.created_at as string),
      resolved_at: row.resolved_at ? new Date(row.resolved_at as string) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }
}

// Conversion operations
export async function saveConversion(conversion: Omit<ConversionRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO conversions (id, campaign_id, stage, user_id, value, date)
      VALUES (${id}, ${conversion.campaign_id}, ${conversion.stage}, ${conversion.user_id}, ${conversion.value}, ${conversion.date.toISOString()})
    `;
    return id;
  } catch (error) {
    console.error("Error saving conversion:", error);
    throw error;
  }
}

export async function getConversions(campaignId?: string): Promise<ConversionRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (campaignId) {
      result = await sql`SELECT * FROM conversions WHERE campaign_id = ${campaignId} ORDER BY date DESC`;
    } else {
      result = await sql`SELECT * FROM conversions ORDER BY date DESC LIMIT 100`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      campaign_id: row.campaign_id,
      stage: row.stage,
      user_id: row.user_id,
      value: parseFloat(row.value as string),
      date: new Date(row.date as string),
      created_at: new Date(row.created_at as string),
    }));
  } catch (error) {
    console.error("Error fetching conversions:", error);
    return [];
  }
}

// Social Media operations
export async function saveSocialMedia(social: Omit<SocialMediaRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO social_media (id, platform, post_id, content_type, views, likes, shares, comments, reach, impressions, engagement_rate, date)
      VALUES (${id}, ${social.platform}, ${social.post_id}, ${social.content_type}, ${social.views}, ${social.likes}, ${social.shares}, ${social.comments}, ${social.reach}, ${social.impressions}, ${social.engagement_rate}, ${social.date.toISOString().split('T')[0]})
    `;
    return id;
  } catch (error) {
    console.error("Error saving social media:", error);
    throw error;
  }
}

export async function getSocialMedia(platform?: string, startDate?: Date, endDate?: Date): Promise<SocialMediaRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (platform && startDate && endDate) {
      result = await sql`SELECT * FROM social_media WHERE platform = ${platform} AND date >= ${startDate.toISOString().split('T')[0]} AND date <= ${endDate.toISOString().split('T')[0]} ORDER BY date DESC`;
    } else if (platform) {
      result = await sql`SELECT * FROM social_media WHERE platform = ${platform} ORDER BY date DESC LIMIT 100`;
    } else {
      result = await sql`SELECT * FROM social_media ORDER BY date DESC LIMIT 100`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      platform: row.platform,
      post_id: row.post_id,
      content_type: row.content_type,
      views: parseInt(row.views as string, 10),
      likes: parseInt(row.likes as string, 10),
      shares: parseInt(row.shares as string, 10),
      comments: parseInt(row.comments as string, 10),
      reach: parseInt(row.reach as string, 10),
      impressions: parseInt(row.impressions as string, 10),
      engagement_rate: parseFloat(row.engagement_rate as string),
      date: new Date(row.date as string),
      created_at: new Date(row.created_at as string),
    }));
  } catch (error) {
    console.error("Error fetching social media:", error);
    return [];
  }
}

// Competitor operations
export async function saveCompetitor(competitor: Omit<CompetitorRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO competitors (id, competitor_name, metric, value, date)
      VALUES (${id}, ${competitor.competitor_name}, ${competitor.metric}, ${competitor.value}, ${competitor.date.toISOString().split('T')[0]})
    `;
    return id;
  } catch (error) {
    console.error("Error saving competitor:", error);
    throw error;
  }
}

export async function getCompetitors(competitorName?: string): Promise<CompetitorRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (competitorName) {
      result = await sql`SELECT * FROM competitors WHERE competitor_name = ${competitorName} ORDER BY date DESC`;
    } else {
      result = await sql`SELECT * FROM competitors ORDER BY date DESC LIMIT 100`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      competitor_name: row.competitor_name,
      metric: row.metric,
      value: parseFloat(row.value as string),
      date: new Date(row.date as string),
      created_at: new Date(row.created_at as string),
    }));
  } catch (error) {
    console.error("Error fetching competitors:", error);
    return [];
  }
}

// Content Calendar operations
export async function saveContentCalendar(content: Omit<ContentCalendarRecord, "id" | "created_at">): Promise<string> {
  try {
    await initializeDatabase();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await sql`
      INSERT INTO content_calendar (id, title, content_type, platform, scheduled_date, status, creator_id)
      VALUES (${id}, ${content.title}, ${content.content_type}, ${content.platform}, ${content.scheduled_date.toISOString()}, ${content.status}, ${content.creator_id || null})
    `;
    return id;
  } catch (error) {
    console.error("Error saving content calendar:", error);
    throw error;
  }
}

export async function getContentCalendar(startDate?: Date, endDate?: Date): Promise<ContentCalendarRecord[]> {
  try {
    await initializeDatabase();
    let result;
    if (startDate && endDate) {
      result = await sql`SELECT * FROM content_calendar WHERE scheduled_date >= ${startDate.toISOString()} AND scheduled_date <= ${endDate.toISOString()} ORDER BY scheduled_date ASC`;
    } else {
      result = await sql`SELECT * FROM content_calendar ORDER BY scheduled_date ASC LIMIT 100`;
    }
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      content_type: row.content_type,
      platform: row.platform,
      scheduled_date: new Date(row.scheduled_date as string),
      status: row.status as ContentCalendarRecord["status"],
      creator_id: row.creator_id,
      created_at: new Date(row.created_at as string),
    }));
  } catch (error) {
    console.error("Error fetching content calendar:", error);
    return [];
  }
}

