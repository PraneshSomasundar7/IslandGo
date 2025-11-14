"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Users, Eye, Target, BarChart3, Filter, AlertTriangle } from "lucide-react";
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

interface Competitor {
  id: string;
  competitor_name: string;
  metric: string;
  value: number;
  date: Date;
  created_at: Date;
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("All");
  const [selectedMetric, setSelectedMetric] = useState<string>("All");
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    fetchCompetitors();
  }, [selectedCompetitor, selectedMetric, dateRange]);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      const url = selectedCompetitor === "All" 
        ? "/api/competitors"
        : `/api/competitors?competitorName=${selectedCompetitor}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        let filtered = data
          .map((c: any) => ({ ...c, date: new Date(c.date), created_at: new Date(c.created_at) }))
          .filter((c: Competitor) => c.date >= startDate && c.date <= endDate);
        if (selectedMetric !== "All") {
          filtered = filtered.filter((c: Competitor) => c.metric === selectedMetric);
        }
        setCompetitors(filtered);
      }
    } catch (error) {
      console.error("Error fetching competitors:", error);
    } finally {
      setLoading(false);
    }
  };

  const competitorNames = Array.from(new Set(competitors.map((c) => c.competitor_name)));
  const metrics = Array.from(new Set(competitors.map((c) => c.metric)));

  const competitorStats = competitorNames.reduce((acc, name) => {
    const competitorData = competitors.filter((c) => c.competitor_name === name);
    acc[name] = {
      totalMetrics: competitorData.length,
      avgValue: competitorData.reduce((sum, c) => sum + c.value, 0) / competitorData.length || 0,
      latestValue: competitorData.sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.value || 0,
    };
    return acc;
  }, {} as Record<string, { totalMetrics: number; avgValue: number; latestValue: number }>);

  const metricComparison = metrics.map((metric) => {
    const metricData = competitors.filter((c) => c.metric === metric);
    const byCompetitor = competitorNames.reduce((acc, name) => {
      const latest = metricData
        .filter((c) => c.competitor_name === name)
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      if (latest) {
        acc[name] = latest.value;
      }
      return acc;
    }, {} as Record<string, number>);
    return {
      metric,
      ...byCompetitor,
    };
  });

  const timeSeriesData = competitors
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((acc, competitor) => {
      const date = competitor.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!acc[date]) {
        acc[date] = { date };
        competitorNames.forEach((name) => {
          acc[date][name] = 0;
        });
      }
      acc[date][competitor.competitor_name] = competitor.value;
      return acc;
    }, {} as Record<string, any>);

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
                Competitor Intelligence
              </h1>
              <p className="text-slate-700">Monitor competitor performance and market positioning</p>
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
            <span className="text-sm font-medium text-slate-700">Competitor:</span>
          </div>
          <select
            value={selectedCompetitor}
            onChange={(e) => setSelectedCompetitor(e.target.value)}
            className="px-4 py-2 rounded-lg border border-orange-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Competitors</option>
            {competitorNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-medium text-slate-700">Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 rounded-lg border border-orange-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Metrics</option>
              {metrics.map((metric) => (
                <option key={metric} value={metric}>
                  {metric}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Competitor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            competitorNames.slice(0, 3).map((name) => {
              const stats = competitorStats[name];
              return (
                <div key={name} className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{name}</h3>
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Latest Value:</span>
                      <span className="font-semibold text-slate-900">{stats.latestValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Value:</span>
                      <span className="font-semibold text-slate-900">{stats.avgValue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Metrics Tracked:</span>
                      <span className="font-semibold text-slate-900">{stats.totalMetrics}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Competitor Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {competitorNames.slice(0, 4).map((name, index) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={["#FF6B35", "#4ECB71", "#00D4FF", "#FFD93D"][index]}
                      name={name}
                    />
                  ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Metric Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={metricComparison.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {competitorNames.slice(0, 3).map((name, index) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      fill={["#FF6B35", "#4ECB71", "#00D4FF"][index]}
                      name={name}
                    />
                  ))}
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </div>

        {/* Competitor Data Table */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Competitor Data</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : competitors.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No competitor data found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Competitor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Metric</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Value</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, 20)
                    .map((competitor) => (
                      <tr key={competitor.id} className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200">
                        <td className="py-3 px-4 font-semibold text-slate-900">{competitor.competitor_name}</td>
                        <td className="py-3 px-4 text-slate-700">{competitor.metric}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">{competitor.value.toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-700">{competitor.date.toLocaleDateString()}</td>
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

