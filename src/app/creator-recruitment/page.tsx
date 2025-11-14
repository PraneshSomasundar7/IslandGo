"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Instagram, TrendingUp, Loader2, AlertCircle, RefreshCw, X, CheckCircle2 } from "lucide-react";
import { addActivity } from "@/lib/activity";
import { TableSkeleton } from "@/components/LoadingSkeleton";

interface Creator {
  id?: number;
  name: string;
  handle: string;
  instagramHandle?: string;
  followers: string;
  engagementRate: string;
  fitDescription?: string;
  fitReason?: string;
  initial: string;
}

interface ApiResponse {
  creators?: Creator[];
  error?: string;
  message?: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

const loadingMessages = [
  "Analyzing Instagram profiles...",
  "Evaluating engagement metrics...",
  "Matching creators to IslandGo...",
  "Scanning local food content...",
  "Calculating fit scores...",
];

// Simple Toast Component
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
      <button
        onClick={onClose}
        className="ml-2 text-slate-500 hover:text-slate-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function CreatorRecruitmentPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Rotate loading messages every 2 seconds
  useEffect(() => {
    if (!loading) return;

    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleSearch = async (): Promise<void> => {
    if (!city.trim()) return;

    setLoading(true);
    setHasSearched(false);
    setCreators([]);
    setError(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "recruit-creators",
          data: { city: city.trim() },
        }),
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to fetch creators");
      }

      const data: ApiResponse = await response.json();

      if (data.creators && Array.isArray(data.creators)) {
        // Map API response to our Creator interface
        const mappedCreators: Creator[] = data.creators.map((creator, index) => ({
          id: index + 1,
          name: creator.name,
          handle: creator.instagramHandle || creator.handle || "@unknown",
          followers: creator.followers,
          engagementRate: creator.engagementRate,
          fitDescription: creator.fitReason || creator.fitDescription || "Food content creator",
          initial: creator.initial || (creator.name ? creator.name.split(" ").map((n: string) => n[0]).join("").toUpperCase() : "XX"),
        }));

        setCreators(mappedCreators);
        setHasSearched(true);
        showToast(`Found ${mappedCreators.length} creators in ${city}!`, "success");
        
        // Log activity
        addActivity({
          type: "creator-recruitment",
          title: `Found ${mappedCreators.length} creators in ${city}`,
          description: `AI identified ${mappedCreators.length} food content creators ready for recruitment`,
          metadata: { city, count: mappedCreators.length },
        });
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setHasSearched(true);
      showToast(errorMessage, "error");
      console.error("Error fetching creators:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = (): void => {
    handleSearch();
  };

  const handleRecruit = (creatorId: number): void => {
    const creator = creators.find((c) => c.id === creatorId);
    if (creator) {
      // Log activity
      addActivity({
        type: "creator-recruitment",
        title: `Recruited ${creator.name}`,
        description: `Recruitment initiated for ${creator.handle} in ${city}`,
        metadata: { creatorId, creatorName: creator.name, city },
      });
    }
    // In a real app, this would trigger a recruitment workflow
    alert(`Recruitment initiated for creator ${creatorId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE5D4' }}>
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

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
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            <span>Automated Creator Recruitment</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Creators per City</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">100+</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Time Reduction</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">90%</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Response Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">25%</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && city.trim() && handleSearch()}
              placeholder="Enter city name (e.g., Austin, TX)"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white border border-orange-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !city.trim()}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-600/90 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px] hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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
          <Suspense fallback={<TableSkeleton />}>
            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 animate-spin mb-4" />
              <p className="text-slate-700 text-sm sm:text-base">{loadingMessage}</p>
            </div>
          </Suspense>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Creators</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Creators List */}
        {!loading && !error && hasSearched && creators.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Found {creators.length} Creators in {city}
            </h2>
            {creators.map((creator) => (
              <div
                key={creator.id || creator.name}
                className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300"
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
                    <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border border-orange-200">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="font-semibold text-orange-600">AI Analysis: </span>
                        {creator.fitDescription || creator.fitReason}
                      </p>
                    </div>

                    {/* Recruit Button */}
                    <button
                      onClick={() => handleRecruit(creator.id || 0)}
                      className="px-5 sm:px-6 py-2 bg-orange-600 hover:bg-orange-600/90 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
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
        {!loading && !error && hasSearched && creators.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 text-sm sm:text-base mb-4">No creators found for {city}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-600/90 text-white font-semibold rounded-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Initial State */}
        {!loading && !hasSearched && !error && (
          <div className="text-center py-12 sm:py-20">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 text-sm sm:text-base">Enter a city name to find creators</p>
          </div>
        )}
      </div>
    </div>
  );
}
