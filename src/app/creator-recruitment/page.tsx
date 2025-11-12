"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Instagram, TrendingUp, Loader2 } from "lucide-react";

interface Creator {
  id: number;
  name: string;
  handle: string;
  followers: string;
  engagementRate: string;
  fitDescription: string;
  initial: string;
}

const mockCreators: Creator[] = [
  {
    id: 1,
    name: "Sarah Martinez",
    handle: "@sarahfoodie",
    followers: "12.4K",
    engagementRate: "8.2%",
    fitDescription: "High engagement with local food content. Posts 3x weekly about Austin restaurants. Audience matches target demographics (25-35, food enthusiasts).",
    initial: "SM"
  },
  {
    id: 2,
    name: "James Chen",
    handle: "@james_eats_atx",
    followers: "18.7K",
    engagementRate: "7.5%",
    fitDescription: "Strong local following in Austin. Specializes in hidden gem discoveries. High comment-to-like ratio indicates engaged community.",
    initial: "JC"
  },
  {
    id: 3,
    name: "Maya Patel",
    handle: "@mayasfoodjourney",
    followers: "9.8K",
    engagementRate: "9.1%",
    fitDescription: "Excellent engagement rate. Focuses on diverse cuisines in Austin. Active collaboration history with food brands.",
    initial: "MP"
  },
  {
    id: 4,
    name: "David Rodriguez",
    handle: "@davidfoodadventures",
    followers: "15.2K",
    engagementRate: "6.8%",
    fitDescription: "Consistent content creator with strong local presence. Regular posts about new restaurant openings. Good brand fit.",
    initial: "DR"
  },
  {
    id: 5,
    name: "Emma Thompson",
    handle: "@emmaeatsaustin",
    followers: "21.3K",
    engagementRate: "8.9%",
    fitDescription: "Top-tier engagement and follower count. Known for authentic reviews. Previous successful partnerships with food platforms.",
    initial: "ET"
  }
];

export default function CreatorRecruitmentPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (): Promise<void> => {
    if (!city.trim()) return;

    setLoading(true);
    setHasSearched(false);
    setCreators([]);

    // Simulate API call with 2 second delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setCreators(mockCreators);
    setLoading(false);
    setHasSearched(true);
  };

  const handleRecruit = (creatorId: number): void => {
    // In a real app, this would trigger a recruitment workflow
    alert(`Recruitment initiated for creator ${creatorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 mb-3 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF6B35]" />
            <span>Automated Creator Recruitment</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#FF6B35] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
              <span className="text-slate-700 text-xs sm:text-sm">Creators per City</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">100+</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#FF6B35] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
              <span className="text-slate-700 text-xs sm:text-sm">Time Reduction</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">90%</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#FF6B35] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B35]" />
              <span className="text-slate-700 text-xs sm:text-sm">Response Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">25%</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter city name (e.g., Austin, TX)"
              className="flex-1 px-4 py-3 bg-white border border-amber-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35] transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !city.trim()}
              className="px-6 py-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px] hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                "Find Creators"
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF6B35] animate-spin mb-4" />
            <p className="text-slate-700 text-sm sm:text-base">Analyzing creators in {city}...</p>
          </div>
        )}

        {/* Creators List */}
        {!loading && hasSearched && creators.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Found {creators.length} Creators in {city}
            </h2>
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#FF6B35] hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF6B35]/80 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                      {creator.initial}
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                          {creator.name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Instagram className="w-4 h-4" />
                          <span className="text-sm">{creator.handle}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">{creator.followers} followers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">{creator.engagementRate} engagement</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Fit Description */}
                    <div className="bg-amber-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-amber-200">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="font-semibold text-[#FF6B35]">AI Analysis: </span>
                        {creator.fitDescription}
                      </p>
                    </div>

                    {/* Recruit Button */}
                    <button
                      onClick={() => handleRecruit(creator.id)}
                      className="px-5 sm:px-6 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                      Recruit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && hasSearched && creators.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 text-sm sm:text-base">No creators found for {city}</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !hasSearched && (
          <div className="text-center py-12 sm:py-20">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 text-sm sm:text-base">Enter a city name to find creators</p>
          </div>
        )}
      </div>
    </div>
  );
}
