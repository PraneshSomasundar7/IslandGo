"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, Eye, MousePointerClick, Target, CheckCircle, Filter, BarChart3 } from "lucide-react";
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

interface Conversion {
  id: string;
  campaign_id: string;
  stage: string;
  user_id: string;
  value: number;
  date: Date;
  created_at: Date;
}

interface Campaign {
  id: string;
  name: string;
}

export default function ConversionsPage() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("All");
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    fetchCampaigns();
    fetchConversions();
  }, [selectedCampaign, dateRange]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchConversions = async () => {
    try {
      setLoading(true);
      const url = selectedCampaign === "All" ? "/api/conversions" : `/api/conversions?campaignId=${selectedCampaign}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(dateRange));
        const filtered = data
          .map((c: any) => ({ ...c, date: new Date(c.date), created_at: new Date(c.created_at) }))
          .filter((c: Conversion) => c.date >= startDate && c.date <= endDate);
        setConversions(filtered);
      }
    } catch (error) {
      console.error("Error fetching conversions:", error);
    } finally {
      setLoading(false);
    }
  };

  const stages = ["Awareness", "Interest", "Consideration", "Intent", "Purchase"];
  const stageData = stages.map((stage) => {
    const stageConversions = conversions.filter((c) => c.stage === stage);
    return {
      stage,
      count: stageConversions.length,
      value: stageConversions.reduce((sum, c) => sum + c.value, 0),
    };
  });

  const calculateDropOff = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((previous - current) / previous) * 100;
  };

  const funnelData = stageData.map((data, index) => {
    const previous = index > 0 ? stageData[index - 1].count : conversions.length;
    return {
      ...data,
      dropOff: calculateDropOff(data.count, previous),
    };
  });

  const totalConversions = conversions.length;
  const totalValue = conversions.reduce((sum, c) => sum + c.value, 0);
  const purchaseConversions = conversions.filter((c) => c.stage === "Purchase").length;
  const conversionRate = totalConversions > 0 ? (purchaseConversions / totalConversions) * 100 : 0;

  const timeSeriesData = conversions
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((acc, conversion) => {
      const date = conversion.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!acc[date]) {
        acc[date] = { date, count: 0, value: 0 };
      }
      acc[date].count += 1;
      acc[date].value += conversion.value;
      return acc;
    }, {} as Record<string, { date: string; count: number; value: number }>);

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
                Conversion Funnel
              </h1>
              <p className="text-slate-700">Track user journey from awareness to purchase</p>
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
            <span className="text-sm font-medium text-slate-700">Campaign:</span>
          </div>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-4 py-2 rounded-lg border border-orange-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Campaigns</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  <span className="text-sm text-slate-600">Total Conversions</span>
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalConversions}</div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Purchase Rate</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{conversionRate.toFixed(1)}%</div>
                <div className="text-xs text-slate-600 mt-1">{purchaseConversions} purchases</div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Value</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ${(totalValue / 1000).toFixed(1)}K
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Avg Value</span>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ${totalConversions > 0 ? (totalValue / totalConversions).toFixed(0) : 0}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Funnel Visualization */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            Conversion Funnel
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {funnelData.map((data, index) => {
                const maxCount = Math.max(...funnelData.map((d) => d.count));
                const widthPercent = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
                return (
                  <div key={data.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-slate-900">{data.stage}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-700">{data.count} users</span>
                        {index > 0 && (
                          <span className="text-red-600">
                            {data.dropOff.toFixed(1)}% drop-off
                          </span>
                        )}
                        <span className="text-green-600 font-semibold">${(data.value / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                    <div className="w-full bg-orange-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`h-6 rounded-full transition-all duration-500 ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                            ? "bg-purple-500"
                            : index === 2
                            ? "bg-yellow-500"
                            : index === 3
                            ? "bg-orange-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-900">
                        {data.count} users ({widthPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Conversions Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#FF6B35" name="Conversions" />
                  <Line type="monotone" dataKey="value" stroke="#4ECB71" name="Value ($)" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Stage Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={stageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#FF6B35" name="Users" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </div>

        {/* Conversions Table */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Conversions</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : conversions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No conversions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Stage</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Campaign</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">User</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 20)
                    .map((conversion) => {
                      const campaign = campaigns.find((c) => c.id === conversion.campaign_id);
                      return (
                        <tr key={conversion.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200">
                          <td className="py-3 px-4 text-slate-700">{conversion.date.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-300">
                              {conversion.stage}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{campaign?.name || "Unknown"}</td>
                          <td className="py-3 px-4 text-slate-700">{conversion.user_id.substring(0, 8)}...</td>
                          <td className="py-3 px-4 text-right font-semibold text-green-600">${conversion.value.toFixed(2)}</td>
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

