import Link from "next/link";
import { Users, MapPin, Sparkles, Video, Play, Utensils, ChefHat, TrendingUp, Heart, Share2, Camera, Zap, Globe, Award, Star } from "lucide-react";
import RecentActivity from "@/components/RecentActivity";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50/80 to-orange-100/60" style={{ backgroundColor: '#FFE5D4' }}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <Video className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Discover Food Through Reels
          </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-slate-700 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            Experience the power of our AI-powered growth engine that transforms food discovery through intelligent creator recruitment, content gap analysis, and viral marketing automation.
          </p>
          <p className="text-sm sm:text-base text-slate-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Watch mouth-watering food reels, discover hidden gems, and connect with local food creators in your city.
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
        <div className="max-w-5xl mx-auto mb-12 sm:mb-20">
          <RecentActivity />
        </div>

        {/* Food Reels Showcase Section */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Video className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Trending Food Reels
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto">
              Watch the most engaging food content from creators across the globe
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="group relative bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-orange-400 transition-all duration-300"
              >
                <div className="aspect-[9/16] bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center relative">
                  <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Video className="w-3 h-3 text-white" />
                    <span className="text-xs text-white font-medium">Reel</span>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-sm">Food Creator {item}</div>
                      <div className="text-xs text-slate-600">2 hours ago</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-3 line-clamp-2">
                    Amazing street food experience in downtown! 🍜
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 5000) + 100}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>{Math.floor(Math.random() * 500) + 10}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Food Categories */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Explore Food Categories
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto">
              Discover diverse cuisines and food experiences
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {[
              { name: "Breakfast", icon: "🥐", color: "from-orange-400 to-orange-500" },
              { name: "Lunch", icon: "🍱", color: "from-orange-500 to-orange-600" },
              { name: "Dinner", icon: "🍽️", color: "from-orange-600 to-orange-700" },
              { name: "Desserts", icon: "🍰", color: "from-pink-400 to-pink-500" },
              { name: "Street Food", icon: "🌮", color: "from-yellow-400 to-yellow-500" },
              { name: "Beverages", icon: "☕", color: "from-amber-400 to-amber-500" },
            ].map((category, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 text-center hover:shadow-lg hover:border-orange-400 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{category.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{Math.floor(Math.random() * 500) + 50} reels</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                How It Works
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto">
              Discover amazing food experiences in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Watch Food Reels",
                description: "Browse through thousands of engaging food reels from creators worldwide",
                icon: Play,
                color: "from-orange-400 to-orange-500",
              },
              {
                step: "02",
                title: "Discover Restaurants",
                description: "Find hidden gems and popular spots based on real food experiences",
                icon: MapPin,
                color: "from-orange-500 to-orange-600",
              },
              {
                step: "03",
                title: "Share Your Experience",
                description: "Create your own food reels and connect with the community",
                icon: Camera,
                color: "from-orange-600 to-orange-700",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-6 sm:p-8 hover:shadow-lg hover:border-orange-400 transition-all duration-300"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {item.step}
                </div>
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 text-center leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Food Discovery Features */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Powerful Discovery Features
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                title: "AI-Powered Recommendations",
                description: "Get personalized food suggestions based on your preferences and location",
                icon: Sparkles,
              },
              {
                title: "Real-Time Updates",
                description: "Stay updated with the latest food trends and new restaurant openings",
                icon: TrendingUp,
              },
              {
                title: "Creator Network",
                description: "Connect with food creators and influencers in your area",
                icon: Users,
              },
              {
                title: "Social Sharing",
                description: "Share your favorite food discoveries with friends and family",
                icon: Share2,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-6 sm:p-8 hover:shadow-lg hover:border-orange-400 transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof / Testimonials */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                Loved by Food Enthusiasts
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto">
              See what our community is saying
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Food Blogger",
                content: "This platform has completely changed how I discover new restaurants. The food reels are so engaging!",
                rating: 5,
              },
              {
                name: "Mike Rodriguez",
                role: "Foodie",
                content: "I love how easy it is to find authentic food experiences. The AI recommendations are spot on!",
                rating: 5,
              },
              {
                name: "Emily Johnson",
                role: "Content Creator",
                content: "As a creator, this platform has helped me grow my audience and connect with amazing restaurants.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-6 sm:p-8 hover:shadow-lg hover:border-orange-400 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
          <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl border-4 border-white/20">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Discover Amazing Food?
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of food enthusiasts exploring the best culinary experiences through engaging food reels
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/creator-recruitment"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
              >
                Start Exploring
              </Link>
              <Link
                href="/viral-content"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-200 border-2 border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
              >
                Create Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
