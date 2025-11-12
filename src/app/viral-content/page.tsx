"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Download, Share2, Twitter, Facebook, Instagram, TrendingUp } from "lucide-react";

interface AchievementBadge {
  name: string;
  emoji: string;
  color: string;
}

type CuisineType = "Mexican" | "Asian" | "Italian" | "American" | "Fusion";

const cuisines: CuisineType[] = ["Mexican", "Asian", "Italian", "American", "Fusion"];

const achievementBadges: AchievementBadge[] = [
  { name: "Ramen Hunter", emoji: "🍜", color: "from-orange-400 to-red-500" },
  { name: "Taco Enthusiast", emoji: "🌮", color: "from-yellow-400 to-orange-500" },
  { name: "Pasta Master", emoji: "🍝", color: "from-blue-400 to-purple-500" },
  { name: "Sushi Explorer", emoji: "🍣", color: "from-green-400 to-teal-500" },
  { name: "Burger Connoisseur", emoji: "🍔", color: "from-red-400 to-pink-500" },
  { name: "Pizza Lover", emoji: "🍕", color: "from-yellow-400 to-orange-500" },
  { name: "BBQ Champion", emoji: "🥩", color: "from-orange-500 to-red-600" },
  { name: "Dessert Explorer", emoji: "🍰", color: "from-pink-400 to-purple-500" }
];

const generateCaption = (name: string, cities: string[], cuisine: string): string => {
  const cityCount = cities.length;
  const cityList = cities.length > 0 ? cities.join(", ") : "amazing places";
  
  return `🌍 Just unlocked my Food Explorer Passport! 🎉

I've been on an incredible culinary journey through ${cityList}, and I'm officially a ${cuisine} enthusiast! 

With ${cityCount} cities under my belt, I've discovered hidden gems, tried authentic flavors, and met incredible food communities along the way. 

Every meal tells a story, and I'm here for all of them! 🍽️✨

#FoodExplorer #${cuisine}Lover #FoodJourney #TravelEats #FoodieLife #${cities[0] || "Food"}Eats`;
};

const getRandomBadges = (count: number, cuisine: string): AchievementBadge[] => {
  const cuisineMap: Record<string, string[]> = {
    Mexican: ["Taco Enthusiast", "BBQ Champion"],
    Asian: ["Ramen Hunter", "Sushi Explorer"],
    Italian: ["Pasta Master", "Pizza Lover"],
    American: ["Burger Connoisseur", "BBQ Champion"],
    Fusion: ["Sushi Explorer", "Dessert Explorer"]
  };
  
  const preferred = cuisineMap[cuisine] || [];
  const available = achievementBadges.filter(b => 
    preferred.some(p => b.name.includes(p.split(" ")[0])) || 
    Math.random() > 0.5
  );
  
  return available.slice(0, count).map(badge => 
    achievementBadges.find(b => b.name === badge.name) || badge
  );
};

export default function ViralContentPage() {
  const [name, setName] = useState("");
  const [cities, setCities] = useState("");
  const [cuisine, setCuisine] = useState("Mexican");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [caption, setCaption] = useState<string>("");
  const [badges, setBadges] = useState<AchievementBadge[]>([]);

  const handleGenerate = async (): Promise<void> => {
    if (!name.trim()) return;

    setLoading(true);
    setGenerated(false);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const cityList = cities.split(",").map(c => c.trim()).filter(c => c);
    const cityCount = cityList.length;
    const badgeCount = Math.min(4, Math.max(3, Math.ceil(cityCount / 2)));

    const generatedBadges = getRandomBadges(badgeCount, cuisine);
    const generatedCaption = generateCaption(name, cityList, cuisine);

    setBadges(generatedBadges);
    setCaption(generatedCaption);
    setGenerated(true);
    setLoading(false);
  };

  const handleDownload = (): void => {
    alert("Download feature would generate a shareable image here!");
  };

  const handleShare = (platform: string): void => {
    alert(`Share to ${platform} functionality would open here!`);
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
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#00D4FF]" />
            <span>Viral Marketing Loops</span>
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#00D4FF] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D4FF]" />
              <span className="text-slate-700 text-xs sm:text-sm">CAC Reduction</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">60%</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#00D4FF] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D4FF]" />
              <span className="text-slate-700 text-xs sm:text-sm">Share Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">40%</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:border-[#00D4FF] hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D4FF]" />
              <span className="text-slate-700 text-xs sm:text-sm">Viral Coefficient</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">1.4x</div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Generate Your Food Explorer Passport</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-white border border-amber-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-[#00D4FF] transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cities Visited (comma-separated)
              </label>
              <input
                type="text"
                value={cities}
                onChange={(e) => setCities(e.target.value)}
                placeholder="e.g., Austin, TX, Portland, OR, Seattle, WA"
                className="w-full px-4 py-3 bg-white border border-amber-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-[#00D4FF] transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Favorite Cuisine
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-amber-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/50 focus:border-[#00D4FF] transition-all duration-200"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c} className="bg-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !name.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-blue-600 hover:from-[#00D4FF]/90 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? "Generating..." : "Generate Content"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-700 text-sm sm:text-base">Creating your Food Explorer Passport...</p>
          </div>
        )}

        {/* Generated Content */}
        {generated && !loading && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Food Explorer Passport Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#FF6B35] via-pink-500 to-[#00D4FF] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-white/20">
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
                    {cities.split(",").filter(c => c.trim()).length} Cities Explored
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
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D4FF]" />
                AI-Generated Social Media Caption
              </h3>
              <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
                <p className="text-slate-700 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {caption}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(caption)}
                className="mt-3 sm:mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                Copy Caption
              </button>
            </div>

            {/* Share Buttons */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-amber-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00D4FF]" />
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
