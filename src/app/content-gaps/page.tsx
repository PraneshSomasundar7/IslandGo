"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, AlertCircle, TrendingUp, Loader2, RefreshCw, X, CheckCircle2, Download, Search, Filter } from "lucide-react";
import { addActivity } from "@/lib/activity";

// Type definitions
interface CityGap {
  id?: number;
  city: string;
  state: string;
  coverage: number;
  priority: "High" | "Medium" | "Low";
  missingCategories: string[];
  position?: { x: number; y: number };
  campaignActive?: boolean;
}

interface ApiResponse {
  gaps?: CityGap[];
  error?: string;
  message?: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

// Toast Component
function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md animate-in slide-in-from-bottom-4 ${
        toast.type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600" />
      )}
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="ml-2 text-slate-500 hover:text-slate-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Confirmation Modal Component
function ConfirmModal({
  city,
  onConfirm,
  onCancel,
}: {
  city: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-orange-200">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Launch Campaign</h3>
        <p className="text-slate-700 mb-6">
          Are you sure you want to launch a content campaign for <strong>{city}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-500/90 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton Component
function GapCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-amber-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-amber-200 rounded w-24"></div>
        </div>
        <div className="h-6 bg-amber-200 rounded w-16"></div>
      </div>
      <div className="h-2 bg-amber-200 rounded mb-2"></div>
      <div className="h-4 bg-amber-200 rounded w-20 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-amber-200 rounded w-20"></div>
        <div className="h-6 bg-amber-200 rounded w-24"></div>
      </div>
      <div className="h-10 bg-amber-200 rounded"></div>
    </div>
  );
}

// Helper function to generate map positions (random but consistent)
function generatePosition(city: string, index: number): { x: number; y: number } {
  // Simple hash function for consistent positioning
  let hash = 0;
  for (let i = 0; i < city.length; i++) {
    hash = city.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = Math.abs(hash % 80) + 10; // 10-90%
  const y = Math.abs((hash * 7) % 80) + 10; // 10-90%
  return { x, y };
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    case "Low":
      return "bg-orange-50 text-orange-600 border-orange-200";
    default:
      return "bg-slate-500/20 text-slate-600 border-slate-500/30";
  }
};

const getDotColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-orange-600";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-orange-500";
    default:
      return "bg-slate-500";
  }
};

// CSV Export function
function exportToCSV(gaps: CityGap[]) {
  const headers = ["City", "State", "Coverage %", "Priority", "Missing Categories", "Campaign Status"];
  const rows = gaps.map((gap) => [
    gap.city,
    gap.state,
    gap.coverage.toString(),
    gap.priority,
    gap.missingCategories.join("; "),
    gap.campaignActive ? "Active" : "Inactive",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `content-gaps-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ContentGapsPage() {
  const [gaps, setGaps] = useState<CityGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityGap | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [campaignCity, setCampaignCity] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Load data on mount
  useEffect(() => {
    fetchGaps();
  }, []);

  const fetchGaps = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "analyze-gaps",
          data: {},
        }),
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to fetch gap analysis");
      }

      const data: ApiResponse = await response.json();

      if (data.gaps && Array.isArray(data.gaps)) {
        // Add positions and IDs to gaps
        const gapsWithPositions: CityGap[] = data.gaps.map((gap, index) => ({
          ...gap,
          id: index + 1,
          position: gap.position || generatePosition(gap.city, index),
          campaignActive: false,
        }));
        setGaps(gapsWithPositions);
        showToast(`Loaded ${gapsWithPositions.length} cities with gap analysis`, "success");
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      showToast(errorMessage, "error");
      console.error("Error fetching gaps:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleLaunchCampaign = (city: CityGap): void => {
    setCampaignCity(`${city.city}, ${city.state}`);
    setShowModal(true);
  };

  const confirmLaunchCampaign = (): void => {
    if (campaignCity) {
      const cityGap = gaps.find((g) => `${g.city}, ${g.state}` === campaignCity);
      setGaps((prev) =>
        prev.map((gap) =>
          `${gap.city}, ${gap.state}` === campaignCity
            ? { ...gap, campaignActive: true }
            : gap
        )
      );
      showToast(`Campaign launched for ${campaignCity}!`, "success");
      
      // Log activity
      addActivity({
        type: "campaign-launch",
        title: `Campaign launched for ${campaignCity}`,
        description: `Content campaign activated to address ${cityGap?.missingCategories.length || 0} missing categories`,
        metadata: { city: campaignCity, coverage: cityGap?.coverage, priority: cityGap?.priority },
      });
      
      setShowModal(false);
      setCampaignCity(null);
    }
  };

  const cancelLaunchCampaign = (): void => {
    setShowModal(false);
    setCampaignCity(null);
  };

  const handleCityClick = (city: CityGap): void => {
    setSelectedCity(city);
    // Scroll to the city card
    const element = document.getElementById(`city-${city.id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Filter gaps
  const filteredGaps = gaps.filter((gap) => {
    const matchesPriority = priorityFilter === "All" || gap.priority === priorityFilter;
    const matchesSearch =
      searchQuery === "" ||
      gap.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gap.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  // Calculate stats
  const totalCities = gaps.length;
  const totalGaps = gaps.length;
  const activeCampaigns = gaps.filter((g) => g.campaignActive).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE5D4' }}>
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && campaignCity && (
        <ConfirmModal
          city={campaignCity}
          onConfirm={confirmLaunchCampaign}
          onCancel={cancelLaunchCampaign}
        />
      )}

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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <span>Content Gap Intelligence</span>
            </h1>
            {!loading && gaps.length > 0 && (
              <button
                onClick={() => exportToCSV(gaps)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-500/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Cities Analyzed</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalCities}</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Content Gaps</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalGaps}</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Campaigns Active</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{activeCampaigns}</div>
          </div>
        </div>

        {/* Filters */}
        {!loading && gaps.length > 0 && (
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city or state..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-orange-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4ECB71]/50 focus:border-orange-500 transition-all duration-200"
                />
              </div>
              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
                  className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4ECB71]/50 focus:border-orange-500 transition-all duration-200"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={fetchGaps}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visual Map Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            Geographic Coverage Map
          </h2>
          <div className="relative bg-orange-50 rounded-lg border border-orange-200 p-4 sm:p-8 min-h-[300px] sm:min-h-[400px] overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              </div>
            ) : (
              <>
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
                {filteredGaps.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => handleCityClick(city)}
                    className={`absolute group cursor-pointer transition-all duration-200 ${
                      selectedCity?.id === city.id ? "z-20" : "z-10"
                    }`}
                    style={{
                      left: `${city.position?.x || 50}%`,
                      top: `${city.position?.y || 50}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${getDotColor(city.priority)} rounded-full shadow-lg hover:scale-150 transition-transform duration-200 ${
                        selectedCity?.id === city.id ? "ring-4 ring-[#4ECB71] ring-offset-2" : ""
                      }`}
                    />
                    <div className="absolute left-1/2 top-6 sm:top-7 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                      <div className="bg-white text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap border border-orange-200 shadow-md">
                        {city.city}, {city.state}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-orange-200 shadow-md">
                  <div className="text-xs font-semibold text-slate-900 mb-1">Priority</div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-3 h-3 bg-orange-600 rounded-full" />
                    <span>High</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span>Well Covered</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Underserved Regions List */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            Underserved Regions {filteredGaps.length !== gaps.length && `(${filteredGaps.length} of ${gaps.length})`}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <GapCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredGaps.length === 0 ? (
            <div className="text-center py-12 bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 p-8">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700">No cities match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredGaps.map((city) => (
                <div
                  id={`city-${city.id}`}
                  key={city.id}
                  className={`bg-white/90 backdrop-blur-lg rounded-xl border shadow-sm p-4 sm:p-6 hover:bg-white hover:shadow-md transition-all duration-300 ${
                    selectedCity?.id === city.id
                      ? "border-orange-500 ring-2 ring-[#4ECB71]/20"
                      : "border-orange-200 hover:border-orange-500"
                  }`}
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
                        {city.campaignActive && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                            Campaign Active
                          </span>
                        )}
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
                            ? "bg-orange-600"
                            : city.coverage < 70
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                        }`}
                        style={{ width: `${city.coverage}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-700">{city.coverage}% covered</div>
                  </div>

                  {/* Missing Categories */}
                  <div className="mb-3 sm:mb-4">
                    <div className="text-xs text-slate-700 mb-2">Missing Categories:</div>
                    <div className="flex flex-wrap gap-2">
                      {city.missingCategories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-50 text-slate-700 text-xs rounded-md border border-orange-200"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Launch Campaign Button */}
                  <button
                    onClick={() => handleLaunchCampaign(city)}
                    disabled={city.campaignActive}
                    className={`w-full px-4 py-2 font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                      city.campaignActive
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-500/90 text-white"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    {city.campaignActive ? "Campaign Active" : "Launch Campaign"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
