"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, AlertCircle, TrendingUp } from "lucide-react";

interface CityGap {
  id: number;
  city: string;
  state: string;
  coverage: number;
  priority: "High" | "Medium" | "Low";
  missingCategories: string[];
  position: { x: number; y: number };
}

const cityGaps: CityGap[] = [
  {
    id: 1,
    city: "Portland",
    state: "OR",
    coverage: 23,
    priority: "High",
    missingCategories: ["Breakfast", "Coffee Shops", "Brunch"],
    position: { x: 15, y: 20 }
  },
  {
    id: 2,
    city: "Nashville",
    state: "TN",
    coverage: 31,
    priority: "High",
    missingCategories: ["BBQ", "Live Music Venues", "Southern Cuisine"],
    position: { x: 60, y: 50 }
  },
  {
    id: 3,
    city: "Denver",
    state: "CO",
    coverage: 45,
    priority: "Medium",
    missingCategories: ["Mountain Cuisine", "Craft Breweries"],
    position: { x: 40, y: 35 }
  },
  {
    id: 4,
    city: "Miami",
    state: "FL",
    coverage: 67,
    priority: "Medium",
    missingCategories: ["Latin Fusion", "Beachfront Dining"],
    position: { x: 70, y: 80 }
  },
  {
    id: 5,
    city: "Seattle",
    state: "WA",
    coverage: 78,
    priority: "Low",
    missingCategories: ["Seafood"],
    position: { x: 12, y: 12 }
  },
  {
    id: 6,
    city: "Phoenix",
    state: "AZ",
    coverage: 28,
    priority: "High",
    missingCategories: ["Mexican", "Southwestern", "Farm-to-Table"],
    position: { x: 25, y: 60 }
  },
  {
    id: 7,
    city: "Boston",
    state: "MA",
    coverage: 82,
    priority: "Low",
    missingCategories: ["Fine Dining"],
    position: { x: 85, y: 25 }
  },
  {
    id: 8,
    city: "Atlanta",
    state: "GA",
    coverage: 52,
    priority: "Medium",
    missingCategories: ["Soul Food", "Farmers Markets"],
    position: { x: 65, y: 55 }
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]/30";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    case "Low":
      return "bg-[#4ECB71]/20 text-[#4ECB71] border-[#4ECB71]/30";
    default:
      return "bg-slate-500/20 text-slate-600 border-slate-500/30";
  }
};

const getDotColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-[#FF6B35]";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-[#4ECB71]";
    default:
      return "bg-slate-500";
  }
};

export default function ContentGapsPage() {
  const handleLaunchCampaign = (cityId: number): void => {
    alert(`Campaign launch initiated for city ${cityId}`);
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
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-[#4ECB71]" />
            <span>Content Gap Intelligence</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#4ECB71] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECB71]" />
              <span className="text-slate-700 text-xs sm:text-sm">Cities Analyzed</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">25</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#4ECB71] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECB71]" />
              <span className="text-slate-700 text-xs sm:text-sm">Content Gaps</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">47</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#4ECB71] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECB71]" />
              <span className="text-slate-700 text-xs sm:text-sm">Campaigns Active</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">12</div>
          </div>
        </div>

        {/* Visual Map Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#4ECB71]" />
            Geographic Coverage Map
          </h2>
          <div className="relative bg-amber-50 rounded-lg border border-amber-200 p-4 sm:p-8 min-h-[300px] sm:min-h-[400px] overflow-hidden">
            {/* Simple US Map Outline */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full opacity-20"
              preserveAspectRatio="none"
            >
              <path
                d="M 10 20 L 20 15 L 30 18 L 40 20 L 50 25 L 60 30 L 70 35 L 80 40 L 85 50 L 80 60 L 75 70 L 70 75 L 60 80 L 50 85 L 40 80 L 30 75 L 20 70 L 15 60 L 12 50 L 10 40 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-400"
              />
            </svg>

            {/* City Dots */}
            {cityGaps.map((city) => (
              <div
                key={city.id}
                className="absolute group cursor-pointer"
                style={{
                  left: `${city.position.x}%`,
                  top: `${city.position.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <div
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${getDotColor(city.priority)} rounded-full shadow-lg hover:scale-150 transition-transform duration-200`}
                />
                <div className="absolute left-1/2 top-5 sm:top-6 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="bg-white text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap border border-amber-200 shadow-md">
                    {city.city}, {city.state}
                  </div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-amber-200 shadow-md">
              <div className="text-xs font-semibold text-slate-900 mb-1">Priority</div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="w-3 h-3 bg-[#FF6B35] rounded-full" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <div className="w-3 h-3 bg-[#4ECB71] rounded-full" />
                <span>Well Covered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Underserved Regions List */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ECB71]" />
            Underserved Regions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {cityGaps.map((city) => (
              <div
                key={city.id}
                className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#4ECB71] hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                      {city.city}, {city.state}
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2">
                      <span className="text-xs sm:text-sm text-slate-700">Coverage:</span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {city.coverage}%
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(city.priority)}`}
                  >
                    {city.priority}
                  </div>
                </div>

                {/* Coverage Bar */}
                <div className="mb-3 sm:mb-4">
                  <div className="w-full bg-amber-100 rounded-full h-2 sm:h-2.5 mb-2">
                    <div
                      className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ${
                        city.coverage < 40
                          ? "bg-[#FF6B35]"
                          : city.coverage < 70
                          ? "bg-yellow-500"
                          : "bg-[#4ECB71]"
                      }`}
                      style={{ width: `${city.coverage}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-700">
                    {city.coverage}% covered
                  </div>
                </div>

                {/* Missing Categories */}
                <div className="mb-3 sm:mb-4">
                  <div className="text-xs text-slate-700 mb-2">Missing Categories:</div>
                  <div className="flex flex-wrap gap-2">
                    {city.missingCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-50 text-slate-700 text-xs rounded-md border border-amber-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Launch Campaign Button */}
                <button
                  onClick={() => handleLaunchCampaign(city.id)}
                  className="w-full px-4 py-2 bg-[#4ECB71] hover:bg-[#4ECB71]/90 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <TrendingUp className="w-4 h-4" />
                  Launch Campaign
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
