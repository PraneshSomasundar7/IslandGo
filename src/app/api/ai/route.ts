import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveCreators, saveGaps, saveViralContent } from "@/lib/db";

// Type definitions
interface CreatorProfile {
  name: string;
  instagramHandle: string;
  followers: string;
  engagementRate: string;
  fitReason: string;
  initial: string;
}

interface CityGap {
  city: string;
  state: string;
  coverage: number;
  priority: "High" | "Medium" | "Low";
  missingCategories: string[];
}

interface AchievementBadge {
  name: string;
  emoji: string;
  color: string;
}

interface ViralContentResponse {
  caption: string;
  badges: AchievementBadge[];
}

interface ApiRequest {
  type: "recruit-creators" | "analyze-gaps" | "generate-viral";
  data: {
    city?: string;
    userName?: string;
    cities?: string[];
    cuisine?: string;
  };
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// Helper function to extract JSON from Claude's response
function extractJSON(text: string): any {
  try {
    // Try to find JSON in code blocks
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    // Try to find JSON directly
    const directMatch = text.match(/\{[\s\S]*\}/);
    if (directMatch) {
      return JSON.parse(directMatch[0]);
    }
    // If no JSON found, try parsing the whole text
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    throw new Error("Failed to parse AI response as JSON");
  }
}

// Handle creator recruitment
async function handleRecruitCreators(city: string): Promise<CreatorProfile[]> {
  const prompt = `Generate a JSON array of 5-8 food content creator profiles for ${city}. 

Requirements:
- Include: name, instagramHandle (format: @username), followers (format like "12.4K" or "18.7K"), engagementRate (format like "8.2%"), fitReason (2-3 sentences explaining why they're good for a food discovery app), and initial (first letter of first and last name, e.g., "SM")
- Make them realistic and diverse
- Focus on local food content creators
- Ensure engagement rates are between 5-10%
- Followers should range from 8K to 25K

Return ONLY a valid JSON array, no additional text.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = content.text;
    const creators = extractJSON(responseText);

    // Validate and ensure all creators have required fields
    if (!Array.isArray(creators)) {
      throw new Error("Response is not an array");
    }

    return creators.map((creator: any) => ({
      name: creator.name || "Unknown",
      instagramHandle: creator.instagramHandle || creator.handle || "@unknown",
      followers: creator.followers || "0",
      engagementRate: creator.engagementRate || "0%",
      fitReason: creator.fitReason || creator.fitDescription || "Food content creator",
      initial: creator.initial || (creator.name ? creator.name.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "XX"),
    }));
  } catch (error) {
    console.error("Error in handleRecruitCreators:", error);
    throw error;
  }
}

// Handle content gap analysis
async function handleAnalyzeGaps(): Promise<CityGap[]> {
  const prompt = `Generate a JSON array of 8-10 US cities with content gap analysis for a food discovery platform.

Requirements:
- Include: city, state (2-letter code), coverage (number 20-85), priority ("High", "Medium", or "Low"), missingCategories (array of 1-3 food categories like "Breakfast", "Coffee Shops", "BBQ", etc.)
- High priority: coverage < 40%
- Medium priority: coverage 40-70%
- Low priority: coverage > 70%
- Include diverse cities across different regions
- Make missing categories realistic for each city

Return ONLY a valid JSON array, no additional text.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = content.text;
    const gaps = extractJSON(responseText);

    if (!Array.isArray(gaps)) {
      throw new Error("Response is not an array");
    }

    return gaps.map((gap: any) => ({
      city: gap.city || "Unknown",
      state: gap.state || "XX",
      coverage: typeof gap.coverage === "number" ? gap.coverage : parseInt(gap.coverage) || 50,
      priority: (gap.priority === "High" || gap.priority === "Medium" || gap.priority === "Low") 
        ? gap.priority 
        : "Medium",
      missingCategories: Array.isArray(gap.missingCategories) 
        ? gap.missingCategories 
        : [gap.missingCategories || "General"],
    }));
  } catch (error) {
    console.error("Error in handleAnalyzeGaps:", error);
    throw error;
  }
}

// Handle viral content generation
async function handleGenerateViral(
  userName: string,
  cities: string[],
  cuisine: string
): Promise<ViralContentResponse> {
  const cityList = cities.length > 0 ? cities.join(", ") : "amazing places";
  const cityCount = cities.length;

  const prompt = `Generate viral social media content for a food explorer.

User: ${userName}
Cities visited: ${cityList} (${cityCount} cities)
Favorite cuisine: ${cuisine}

Requirements:
1. Create an engaging social media caption (3-4 paragraphs) with emojis and hashtags about their food journey
2. Generate 3-4 achievement badges with: name (like "Ramen Hunter", "Taco Enthusiast"), emoji (food-related), and color (Tailwind gradient class like "from-orange-400 to-red-500")

Return a JSON object with:
{
  "caption": "the full caption text",
  "badges": [array of badge objects with name, emoji, color]
}

Return ONLY valid JSON, no additional text.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = content.text;
    const response = extractJSON(responseText);

    return {
      caption: response.caption || `🌍 Just unlocked my Food Explorer Passport! 🎉\n\nI've been on an incredible culinary journey through ${cityList}!`,
      badges: Array.isArray(response.badges) 
        ? response.badges.map((badge: any) => ({
            name: badge.name || "Food Explorer",
            emoji: badge.emoji || "🍽️",
            color: badge.color || "from-orange-400 to-red-500",
          }))
        : [],
    };
  } catch (error) {
    console.error("Error in handleGenerateViral:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS request for CORS
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers });
  }

  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error: API key not set" },
        { status: 500, headers }
      );
    }

    // Parse request body
    const body: ApiRequest = await request.json();
    const { type, data } = body;

    // Log request
    console.log(`[API] ${type} request received`, {
      type,
      data: type === "recruit-creators" ? { city: data.city } : 
            type === "generate-viral" ? { userName: data.userName, cities: data.cities?.length } : 
            "analyze-gaps",
      timestamp: new Date().toISOString(),
    });

    // Validate request
    if (!type || !data) {
      return NextResponse.json(
        { error: "Invalid request: type and data are required" },
        { status: 400, headers }
      );
    }

    let response;

    // Handle different request types
    switch (type) {
      case "recruit-creators": {
        if (!data.city) {
          return NextResponse.json(
            { error: "City is required for recruit-creators" },
            { status: 400, headers }
          );
        }
        const creators = await handleRecruitCreators(data.city);
        // Save to database
        try {
          await saveCreators(data.city, creators);
        } catch (dbError) {
          console.error("Error saving creators to database:", dbError);
          // Continue even if DB save fails
        }
        response = { creators };
        break;
      }

      case "analyze-gaps": {
        const gaps = await handleAnalyzeGaps();
        // Save to database
        try {
          await saveGaps(gaps);
        } catch (dbError) {
          console.error("Error saving gaps to database:", dbError);
          // Continue even if DB save fails
        }
        response = { gaps };
        break;
      }

      case "generate-viral": {
        if (!data.userName || !data.cities || !data.cuisine) {
          return NextResponse.json(
            { error: "userName, cities, and cuisine are required for generate-viral" },
            { status: 400, headers }
          );
        }
        const viralContent = await handleGenerateViral(
          data.userName,
          data.cities,
          data.cuisine
        );
        // Save to database
        try {
          await saveViralContent(
            data.userName,
            data.cities,
            data.cuisine,
            viralContent.caption,
            viralContent.badges
          );
        } catch (dbError) {
          console.error("Error saving viral content to database:", dbError);
          // Continue even if DB save fails
        }
        response = viralContent;
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown request type: ${type}` },
          { status: 400, headers }
        );
    }

    // Log successful response
    const duration = Date.now() - startTime;
    console.log(`[API] ${type} completed successfully`, {
      type,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response, { status: 200, headers });
  } catch (error) {
    // Log error
    const duration = Date.now() - startTime;
    console.error(`[API] Error processing request:`, {
      error: error instanceof Error ? error.message : String(error),
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
