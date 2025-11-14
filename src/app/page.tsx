import Link from "next/link";
import { Users, MapPin, Sparkles } from "lucide-react";
import RecentActivity from "@/components/RecentActivity";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/80 to-orange-100/60" style={{ backgroundColor: '#FFE5D4' }}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            IslandGo AI Growth Strategy Demo Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-700 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the power of our AI-powered growth engine that transforms food discovery through intelligent creator recruitment, content gap analysis, and viral marketing automation.
          </p>
          
          {/* Stat Badges */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-md rounded-full border border-orange-200 shadow-sm hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">$1.55M</span>
              <span className="text-slate-700 ml-2 text-sm sm:text-base">ARR</span>
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-md rounded-full border border-orange-200 shadow-sm hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">60%</span>
              <span className="text-slate-700 ml-2 text-sm sm:text-base">CAC Reduction</span>
            </div>
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/90 backdrop-blur-md rounded-full border border-orange-200 shadow-sm hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">10x</span>
              <span className="text-slate-700 ml-2 text-sm sm:text-base">Efficiency</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-20">
          {/* Card 1: Automated Creator Recruitment */}
          <Link 
            href="/creator-recruitment"
            className="group relative overflow-hidden bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-orange-200 shadow-sm p-6 sm:p-8 hover:bg-white hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                Automated Creator Recruitment
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                AI-powered system that identifies, recruits, and onboards content creators at scale, reducing manual effort by 90%.
              </p>
            </div>
          </Link>

          {/* Card 2: Content Gap Intelligence */}
          <Link 
            href="/content-gaps"
            className="group relative overflow-hidden bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-orange-200 shadow-sm p-6 sm:p-8 hover:bg-white hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                Content Gap Intelligence
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Advanced analytics that pinpoint geographic and content gaps, enabling strategic expansion and optimization.
              </p>
            </div>
          </Link>

          {/* Card 3: Viral Marketing Loops */}
          <Link 
            href="/viral-content"
            className="group relative overflow-hidden bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-orange-200 shadow-sm p-6 sm:p-8 hover:bg-white hover:border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                Viral Marketing Loops
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Engineered content strategies that create self-perpetuating viral loops, maximizing organic reach and engagement.
              </p>
            </div>
          </Link>
        </div>

        {/* Bottom Stats Section */}
        <div className="max-w-5xl mx-auto mb-8 sm:mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 text-center hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">125K</div>
              <div className="text-slate-700 text-xs sm:text-sm md:text-base">Users</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 text-center hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">2,500</div>
              <div className="text-slate-700 text-xs sm:text-sm md:text-base">Creators</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 text-center hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">25</div>
              <div className="text-slate-700 text-xs sm:text-sm md:text-base">Cities</div>
            </div>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 text-center hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">$925K</div>
              <div className="text-slate-700 text-xs sm:text-sm md:text-base">Profit</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="max-w-5xl mx-auto">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
