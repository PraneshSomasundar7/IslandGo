"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Download, Share2, Twitter, Facebook, Instagram, TrendingUp, Loader2, AlertCircle, RefreshCw, CheckCircle2, X, Eye } from "lucide-react";
import html2canvas from "html2canvas";
import { addActivity } from "@/lib/activity";

// Type definitions
interface AchievementBadge {
  name: string;
  emoji: string;
  color: string;
}

interface ViralContentResponse {
  caption: string;
  badges: AchievementBadge[];
}

interface ApiResponse {
  caption?: string;
  badges?: AchievementBadge[];
  error?: string;
  message?: string;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

type CuisineType = "Mexican" | "Asian" | "Italian" | "American" | "Fusion";

const cuisines: CuisineType[] = ["Mexican", "Asian", "Italian", "American", "Fusion"];

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
          : toast.type === "error"
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-blue-50 border-blue-200 text-blue-800"
      }`}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-green-600" />
      ) : toast.type === "error" ? (
        <AlertCircle className="w-5 h-5 text-red-600" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-blue-600" />
      )}
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="ml-2 text-slate-500 hover:text-slate-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Preview Modal Component
function PreviewModal({
  name,
  cities,
  cuisine,
  onConfirm,
  onCancel,
}: {
  name: string;
  cities: string[];
  cuisine: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cityCount = cities.length;
  const cityList = cities.length > 0 ? cities.join(", ") : "amazing places";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-orange-200">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-orange-600" />
          <h3 className="text-xl font-bold text-slate-900">Preview Your Passport</h3>
        </div>
        <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 rounded-lg p-4 mb-4 text-white">
          <div className="text-center">
            <div className="text-xs font-semibold mb-2">🎫 FOOD EXPLORER PASSPORT</div>
            <div className="text-2xl font-bold mb-1">{name}</div>
            <div className="text-sm">{cityCount} Cities Explored</div>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-700 mb-6">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Cities:</strong> {cityList}</p>
          <p><strong>Cuisine:</strong> {cuisine}</p>
          <p className="text-xs text-slate-500 mt-2">AI will generate unique badges and a viral caption based on your preferences.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-600/90 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Generate
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

export default function ViralContentPage() {
  const [name, setName] = useState("");
  const [cities, setCities] = useState("");
  const [cuisine, setCuisine] = useState<CuisineType>("Mexican");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [caption, setCaption] = useState<string>("");
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const passportRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      showToast("Please enter your name", "error");
      return false;
    }
    const cityList = cities.split(",").map((c) => c.trim()).filter((c) => c);
    if (cityList.length === 0) {
      showToast("Please enter at least one city", "error");
      return false;
    }
    return true;
  };

  const handleGenerate = async (): Promise<void> => {
    if (!validateForm()) return;

    const cityList = cities.split(",").map((c) => c.trim()).filter((c) => c);

    setLoading(true);
    setGenerated(false);
    setCaption("");
    setBadges([]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "generate-viral",
          data: {
            userName: name.trim(),
            cities: cityList,
            cuisine: cuisine,
          },
        }),
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to generate content");
      }

      const data: ApiResponse = await response.json();

      if (data.caption && data.badges && Array.isArray(data.badges)) {
        setCaption(data.caption);
        setBadges(data.badges);
        setGenerated(true);
        showToast("Content generated successfully!", "success");
        
        // Log activity
        addActivity({
          type: "viral-content",
          title: `Viral content generated for ${name.trim()}`,
          description: `Created passport with ${data.badges.length} badges for ${cityList.length} cities (${cuisine} cuisine)`,
          metadata: { userName: name.trim(), cities: cityList, cuisine, badgeCount: data.badges.length },
        });
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      showToast(errorMessage, "error");
      console.error("Error generating content:", err);
    } finally {
      setLoading(false);
      setShowPreview(false);
    }
  };

  const handlePreview = (): void => {
    if (!validateForm()) return;
    setShowPreview(true);
  };

  const handleDownload = async (): Promise<void> => {
    if (!passportRef.current) {
      showToast("Passport card not found", "error");
      return;
    }

    try {
      showToast("Generating image...", "info");
      
      const canvas = await html2canvas(passportRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `food-explorer-passport-${name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      
      showToast("Image downloaded successfully!", "success");
    } catch (error) {
      console.error("Error downloading image:", error);
      showToast("Failed to download image. Please try again.", "error");
    }
  };

  const handleShare = async (platform: string): Promise<void> => {
    if (!caption) {
      showToast("No caption to share", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      showToast(`Caption copied to clipboard!`, "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      showToast("Failed to copy to clipboard", "error");
    }
  };

  const handleRegenerate = (): void => {
    handleGenerate();
  };

  const cityCount = cities.split(",").map((c) => c.trim()).filter((c) => c).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE5D4' }}>
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          name={name.trim()}
          cities={cities.split(",").map((c) => c.trim()).filter((c) => c)}
          cuisine={cuisine}
          onConfirm={handleGenerate}
          onCancel={() => setShowPreview(false)}
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            <span>Viral Marketing Loops</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">CAC Reduction</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">60%</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Share Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">40%</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-slate-700 text-xs sm:text-sm">Viral Coefficient</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">1.4x</div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Generate Your Food Explorer Passport</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cities Visited (comma-separated) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cities}
                onChange={(e) => setCities(e.target.value)}
                placeholder="e.g., Austin, TX, Portland, OR, Seattle, WA"
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Favorite Cuisine <span className="text-red-500">*</span>
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value as CuisineType)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-orange-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c} className="bg-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                disabled={loading || !name.trim() || cityCount === 0}
                className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !name.trim() || cityCount === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-blue-600 hover:from-[#00D4FF]/90 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Content</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-700 text-sm sm:text-base">Creating your Food Explorer Passport...</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">AI is crafting unique badges and a viral caption...</p>
          </div>
        )}

        {/* Generated Content */}
        {generated && !loading && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Food Explorer Passport Card */}
            <div
              ref={passportRef}
              className="relative overflow-hidden bg-gradient-to-br from-[#FF6B35] via-pink-500 to-[#00D4FF] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative z-10">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-block px-3 sm:px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                    🎫 FOOD EXPLORER PASSPORT
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    {name}
                  </h2>
                  <div className="text-lg sm:text-xl text-white/90">
                    {cityCount} Cities Explored
                  </div>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-white/20 backdrop-blur-md rounded-xl p-3 sm:p-4 border-2 border-white/30 hover:scale-105 transition-transform duration-200 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-3xl sm:text-4xl mb-2 text-center">{badge.emoji}</div>
                      <div className="text-white text-xs sm:text-sm font-semibold text-center">
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI-Generated Caption */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  AI-Generated Social Media Caption
                </h3>
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
                <p className="text-slate-700 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {caption}
                </p>
              </div>
              <button
                onClick={() => handleShare("clipboard")}
                className="mt-3 sm:mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copy Caption</span>
                  </>
                )}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                Share Your Passport
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => handleShare("Twitter")}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare("Facebook")}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Share on Facebook</span>
                </button>
                <button
                  onClick={() => handleShare("Instagram")}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Share on Instagram</span>
                </button>
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#4ECB71] to-teal-600 hover:from-[#4ECB71]/90 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Download Image</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
