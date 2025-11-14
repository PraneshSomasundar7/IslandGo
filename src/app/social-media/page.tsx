"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Instagram, Youtube, Facebook, Twitter, TrendingUp, Eye, Heart, Share2, MessageCircle, Filter } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartSkeleton, StatCardSkeleton } from "@/components/LoadingSkeleton";

interface SocialMedia {
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

const platformIcons: Record<string, any> = {
  Instagram: Instagram,
  YouTube: Youtube,
  Facebook: Facebook,
  Twitter: Twitter,
};

const platformColors: Record<string, string> = {
  Instagram: "#E4405F",
  YouTube: "#FF0000",
  Facebook: "#1877F2",
  Twitter: "#1DA1F2",
};

export default function SocialMediaPage() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    fetchSocialMedia();
  }, [platformFilter, dateRange]);

  const fetchSocialMedia = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      const url = platformFilter === "All" 
        ? `/api/social-media?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        : `/api/social-media?platform=${platformFilter}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSocialMedia(data.map((s: any) => ({ ...s, date: new Date(s.date), created_at: new Date(s.created_at) })));
      }
    } catch (error) {
      console.error("Error fetching social media:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalStats = socialMedia.reduce(
    (acc, s) => ({
      views: acc.views + s.views,
      likes: acc.likes + s.likes,
      shares: acc.shares + s.shares,
      comments: acc.comments + s.comments,
      reach: acc.reach + s.reach,
      impressions: acc.impressions + s.impressions,
    }),
    { views: 0, likes: 0, shares: 0, comments: 0, reach: 0, impressions: 0 }
  );

  const avgEngagementRate = socialMedia.length > 0
    ? socialMedia.reduce((sum, s) => sum + s.engagement_rate, 0) / socialMedia.length
    : 0;

  const platformStats = socialMedia.reduce((acc, s) => {
    if (!acc[s.platform]) {
      acc[s.platform] = { views: 0, likes: 0, shares: 0, comments: 0, reach: 0, impressions: 0, count: 0 };
    }
    acc[s.platform].views += s.views;
    acc[s.platform].likes += s.likes;
    acc[s.platform].shares += s.shares;
    acc[s.platform].comments += s.comments;
    acc[s.platform].reach += s.reach;
    acc[s.platform].impressions += s.impressions;
    acc[s.platform].count += 1;
    return acc;
  }, {} as Record<string, { views: number; likes: number; shares: number; comments: number; reach: number; impressions: number; count: number }>);

  const platformChartData = Object.entries(platformStats).map(([platform, stats]) => ({
    platform,
    posts: stats.count,
    engagement: stats.count > 0 ? ((stats.likes + stats.shares + stats.comments) / stats.impressions) * 100 : 0,
  }));

  const pieData = Object.entries(platformStats).map(([platform, stats]) => ({
    name: platform,
    value: stats.views,
  }));

  const COLORS = ["#E4405F", "#FF0000", "#1877F2", "#1DA1F2", "#25D366"];

  const timeSeriesData = socialMedia
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((acc, post) => {
      const date = post.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!acc[date]) {
        acc[date] = { date, views: 0, likes: 0, engagement: 0 };
      }
      acc[date].views += post.views;
      acc[date].likes += post.likes;
      acc[date].engagement += post.engagement_rate;
      return acc;
    }, {} as Record<string, { date: string; views: number; likes: number; engagement: number }>);

  const chartData = Object.values(timeSeriesData);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE5D4' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Social Media Analytics
              </h1>
              <p className="text-slate-700">Multi-platform performance tracking</p>
            </div>
            <div className="flex gap-2">
              {(["7", "30", "90"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    dateRange === range
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-white/90 text-slate-700 hover:bg-white border border-orange-200"
                  }`}
                >
                  {range} days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Platform:</span>
          </div>
          {["All", "Instagram", "YouTube", "Facebook", "Twitter"].map((platform) => {
            const Icon = platform === "All" ? null : platformIcons[platform];
            return (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center gap-2 ${
                  platformFilter === platform
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-white/90 text-slate-700 hover:bg-white border border-orange-200"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {platform}
              </button>
            );
          })}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Reach</span>
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {(totalStats.reach / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {(totalStats.impressions / 1000).toFixed(1)}K impressions
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Engagement</span>
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {((totalStats.likes + totalStats.shares + totalStats.comments) / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {avgEngagementRate.toFixed(2)}% avg rate
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Views</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {(totalStats.views / 1000).toFixed(1)}K
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Posts</span>
                  <Share2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {socialMedia.length}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {Object.entries(platformStats).map(([platform, stats]) => {
            const Icon = platformIcons[platform];
            const color = platformColors[platform] || "#FF6B35";
            const engagement = stats.impressions > 0 
              ? ((stats.likes + stats.shares + stats.comments) / stats.impressions) * 100 
              : 0;
            return (
              <div key={platform} className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  {Icon && <Icon className="w-6 h-6" style={{ color }} />}
                  <h3 className="text-lg font-bold text-slate-900">{platform}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Posts:</span>
                    <span className="font-semibold text-slate-900">{stats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reach:</span>
                    <span className="font-semibold text-slate-900">{(stats.reach / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Engagement:</span>
                    <span className="font-semibold text-orange-600">{engagement.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Likes:</span>
                    <span className="font-semibold text-slate-900">{(stats.likes / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#FF6B35" name="Views" />
                  <Line type="monotone" dataKey="likes" stroke="#E74C3C" name="Likes" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Platform Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </div>

        {/* Top Posts */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performing Posts</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : socialMedia.length === 0 ? (
            <div className="text-center py-12">
              <Instagram className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No social media data found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Platform</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Content Type</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Reach</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Likes</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Shares</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {socialMedia
                    .sort((a, b) => b.engagement_rate - a.engagement_rate)
                    .slice(0, 10)
                    .map((post) => {
                      const Icon = platformIcons[post.platform];
                      const color = platformColors[post.platform] || "#FF6B35";
                      return (
                        <tr key={post.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {Icon && <Icon className="w-4 h-4" style={{ color }} />}
                              <span className="font-semibold text-slate-900">{post.platform}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{post.content_type}</td>
                          <td className="py-3 px-4 text-right text-slate-700">{(post.reach / 1000).toFixed(1)}K</td>
                          <td className="py-3 px-4 text-right text-slate-700">{post.likes.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-slate-700">{post.shares.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-semibold text-orange-600">{post.engagement_rate.toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

