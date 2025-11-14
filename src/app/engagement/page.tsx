"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, MessageCircle, Eye, TrendingUp, BarChart3 } from "lucide-react";
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartSkeleton, StatCardSkeleton } from "@/components/LoadingSkeleton";

interface Engagement {
  id: string;
  content_id: string;
  content_type: string;
  platform: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement_rate: number;
  date: Date;
  created_at: Date;
}

export default function EngagementPage() {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    fetchEngagements();
  }, [dateRange]);

  const fetchEngagements = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      const response = await fetch(`/api/engagement?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      if (response.ok) {
        const data = await response.json();
        setEngagements(data.map((e: any) => ({ ...e, date: new Date(e.date), created_at: new Date(e.created_at) })));
      }
    } catch (error) {
      console.error("Error fetching engagements:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalStats = engagements.reduce(
    (acc, e) => ({
      views: acc.views + e.views,
      likes: acc.likes + e.likes,
      shares: acc.shares + e.shares,
      comments: acc.comments + e.comments,
    }),
    { views: 0, likes: 0, shares: 0, comments: 0 }
  );

  const avgEngagementRate = engagements.length > 0
    ? engagements.reduce((sum, e) => sum + e.engagement_rate, 0) / engagements.length
    : 0;

  const chartData = engagements
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((e) => ({
      date: e.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: e.views,
      likes: e.likes,
      shares: e.shares,
      comments: e.comments,
      engagement_rate: e.engagement_rate,
    }));

  const platformData = engagements.reduce((acc, e) => {
    if (!acc[e.platform]) {
      acc[e.platform] = { views: 0, likes: 0, shares: 0, comments: 0 };
    }
    acc[e.platform].views += e.views;
    acc[e.platform].likes += e.likes;
    acc[e.platform].shares += e.shares;
    acc[e.platform].comments += e.comments;
    return acc;
  }, {} as Record<string, { views: number; likes: number; shares: number; comments: number }>);

  const platformChartData = Object.entries(platformData).map(([platform, data]) => ({
    platform,
    ...data,
  }));

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
                Engagement Metrics
              </h1>
              <p className="text-slate-700">Track content performance and audience engagement</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Views</span>
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {(totalStats.views / 1000).toFixed(1)}K
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Likes</span>
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {(totalStats.likes / 1000).toFixed(1)}K
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Shares</span>
                  <Share2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {(totalStats.shares / 1000).toFixed(1)}K
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Comments</span>
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {totalStats.comments.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Avg Engagement</span>
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {avgEngagementRate.toFixed(2)}%
                </div>
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Engagement Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke="#E74C3C" name="Likes" />
                  <Line type="monotone" dataKey="shares" stroke="#4ECB71" name="Shares" />
                  <Line type="monotone" dataKey="comments" stroke="#9B59B6" name="Comments" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Platform Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={platformChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#E74C3C" name="Likes" />
                  <Bar dataKey="shares" fill="#4ECB71" name="Shares" />
                  <Bar dataKey="comments" fill="#9B59B6" name="Comments" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Performing Content</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : engagements.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No engagement data found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Content</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Platform</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Views</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Likes</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Shares</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Comments</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {engagements
                    .sort((a, b) => b.engagement_rate - a.engagement_rate)
                    .slice(0, 10)
                    .map((engagement) => (
                      <tr key={engagement.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{engagement.content_type}</div>
                          <div className="text-xs text-slate-600">{engagement.content_id.substring(0, 20)}...</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{engagement.platform}</td>
                        <td className="py-3 px-4 text-right text-slate-700">{engagement.views.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-slate-700">{engagement.likes.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-slate-700">{engagement.shares.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-slate-700">{engagement.comments.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-orange-600">{engagement.engagement_rate.toFixed(2)}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

