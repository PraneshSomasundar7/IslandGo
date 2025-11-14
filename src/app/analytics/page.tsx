"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Download, RefreshCw, BarChart3, PieChart, LineChart } from "lucide-react";
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
import { getActivities, Activity } from "@/lib/activity";
import { ChartSkeleton, StatCardSkeleton } from "@/components/LoadingSkeleton";

// Type definitions
type DateRange = "7" | "30" | "90";

interface MonthlyData {
  month: string;
  creators: number;
  campaigns: number;
  viral: number;
}

interface CityData {
  city: string;
  creators: number;
  campaigns: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsStats {
  totalCreators: number;
  totalGaps: number;
  totalViral: number;
  creatorsTrend: number;
  gapsTrend: number;
  viralTrend: number;
}

// Mock data generators
const generateMonthlyData = (): MonthlyData[] => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let creators = 50;
  let campaigns = 10;
  let viral = 25;

  return months.map((month) => {
    creators += Math.floor(Math.random() * 20) + 5;
    campaigns += Math.floor(Math.random() * 5) + 1;
    viral += Math.floor(Math.random() * 10) + 2;
    return {
      month,
      creators,
      campaigns,
      viral,
    };
  });
};

const generateCityData = (): CityData[] => {
  const cities = ["Austin", "Portland", "Seattle", "Miami", "Denver", "Nashville"];
  return cities.map((city) => ({
    city,
    creators: Math.floor(Math.random() * 50) + 10,
    campaigns: Math.floor(Math.random() * 10) + 2,
  }));
};

const generateCategoryData = (): CategoryData[] => {
  return [
    { name: "Breakfast", value: 35, color: "#FF6B35" },
    { name: "Coffee", value: 28, color: "#4ECB71" },
    { name: "BBQ", value: 22, color: "#00D4FF" },
    { name: "Mexican", value: 18, color: "#FFD93D" },
    { name: "Asian", value: 15, color: "#9B59B6" },
    { name: "Desserts", value: 12, color: "#E74C3C" },
  ];
};

// Calculate stats from activities
const calculateStats = (activities: Activity[], dateRange: DateRange): AnalyticsStats => {
  const now = Date.now();
  const rangeMs = parseInt(dateRange) * 24 * 60 * 60 * 1000;
  const cutoff = now - rangeMs;

  const filtered = activities.filter((a) => a.timestamp >= cutoff);

  const creators = filtered.filter((a) => a.type === "creator-recruitment").length;
  const gaps = filtered.filter((a) => a.type === "campaign-launch").length;
  const viral = filtered.filter((a) => a.type === "viral-content").length;

  // Calculate trends (compare to previous period)
  const prevCutoff = cutoff - rangeMs;
  const prevFiltered = activities.filter((a) => a.timestamp >= prevCutoff && a.timestamp < cutoff);

  const prevCreators = prevFiltered.filter((a) => a.type === "creator-recruitment").length;
  const prevGaps = prevFiltered.filter((a) => a.type === "campaign-launch").length;
  const prevViral = prevFiltered.filter((a) => a.type === "viral-content").length;

  const creatorsTrend = prevCreators > 0 ? ((creators - prevCreators) / prevCreators) * 100 : 0;
  const gapsTrend = prevGaps > 0 ? ((gaps - prevGaps) / prevGaps) * 100 : 0;
  const viralTrend = prevViral > 0 ? ((viral - prevViral) / prevViral) * 100 : 0;

  return {
    totalCreators: creators,
    totalGaps: gaps,
    totalViral: viral,
    creatorsTrend,
    gapsTrend,
    viralTrend,
  };
};

// Export to CSV
const exportToCSV = (stats: AnalyticsStats, monthlyData: MonthlyData[], cityData: CityData[], categoryData: CategoryData[]): void => {
  const rows = [
    ["Analytics Report", new Date().toLocaleDateString()],
    [""],
    ["Summary"],
    ["Metric", "Value", "Trend"],
    ["Creators Recruited", stats.totalCreators.toString(), `${stats.creatorsTrend.toFixed(1)}%`],
    ["Content Gaps", stats.totalGaps.toString(), `${stats.gapsTrend.toFixed(1)}%`],
    ["Viral Content", stats.totalViral.toString(), `${stats.viralTrend.toFixed(1)}%`],
    [""],
    ["Monthly Growth"],
    ["Month", "Creators", "Campaigns", "Viral Content"],
    ...monthlyData.map((d) => [d.month, d.creators.toString(), d.campaigns.toString(), d.viral.toString()]),
    [""],
    ["City Breakdown"],
    ["City", "Creators", "Campaigns"],
    ...cityData.map((d) => [d.city, d.creators.toString(), d.campaigns.toString()]),
    [""],
    ["Content Categories"],
    ["Category", "Count"],
    ...categoryData.map((d) => [d.name, d.value.toString()]),
  ];

  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `analytics-report-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30");
  const [stats, setStats] = useState<AnalyticsStats>({
    totalCreators: 0,
    totalGaps: 0,
    totalViral: 0,
    creatorsTrend: 0,
    gapsTrend: 0,
    viralTrend: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const refreshData = async (): Promise<void> => {
    try {
      // Calculate date range
      const now = Date.now();
      const rangeMs = parseInt(dateRange) * 24 * 60 * 60 * 1000;
      const startDate = new Date(now - rangeMs);
      const endDate = new Date(now);

      // Fetch analytics from API
      const response = await fetch(
        `/api/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const analytics = await response.json();

      // Update stats
      const prevRangeMs = rangeMs;
      const prevStartDate = new Date(now - prevRangeMs * 2);
      const prevEndDate = new Date(now - prevRangeMs);

      const prevResponse = await fetch(
        `/api/analytics?startDate=${prevStartDate.toISOString()}&endDate=${prevEndDate.toISOString()}`
      );

      let prevAnalytics = { creators: 0, gaps: 0, viral: 0 };
      if (prevResponse.ok) {
        prevAnalytics = await prevResponse.json();
      }

      const creatorsTrend = prevAnalytics.creators > 0
        ? ((analytics.creators - prevAnalytics.creators) / prevAnalytics.creators) * 100
        : 0;
      const gapsTrend = prevAnalytics.gaps > 0
        ? ((analytics.gaps - prevAnalytics.gaps) / prevAnalytics.gaps) * 100
        : 0;
      const viralTrend = prevAnalytics.viral > 0
        ? ((analytics.viral - prevAnalytics.viral) / prevAnalytics.viral) * 100
        : 0;

      setStats({
        totalCreators: analytics.creators,
        totalGaps: analytics.gaps,
        totalViral: analytics.viral,
        creatorsTrend,
        gapsTrend,
        viralTrend,
      });

      // Transform monthly data
      const monthly = analytics.creatorsByMonth.map((item: { month: string; count: number }) => ({
        month: item.month,
        creators: item.count,
        campaigns: 0, // Will be filled from gaps data if available
        viral: 0,
      }));
      setMonthlyData(monthly.length > 0 ? monthly : generateMonthlyData());

      // Transform city data
      const cities = analytics.gapsByCity.map((item: { city: string; count: number }) => ({
        city: item.city,
        creators: 0,
        campaigns: item.count,
      }));
      setCityData(cities.length > 0 ? cities : generateCityData());

      // Transform category data
      const categories = analytics.viralByCategory.map((item: { category: string; count: number }, index: number) => {
        const colors = ["#FF6B35", "#4ECB71", "#00D4FF", "#FFD93D", "#9B59B6", "#E74C3C"];
        return {
          name: item.category,
          value: item.count,
          color: colors[index % colors.length],
        };
      });
      setCategoryData(categories.length > 0 ? categories : generateCategoryData());

      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing analytics:", error);
      // Fallback to localStorage data
      const activities = getActivities();
      const newStats = calculateStats(activities, dateRange);
      setStats(newStats);
      setMonthlyData(generateMonthlyData());
      setCityData(generateCityData());
      setCategoryData(generateCategoryData());
      setLastRefresh(new Date());
    }
  };

  useEffect(() => {
    refreshData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [dateRange]);

  const handleExport = async (): Promise<void> => {
    try {
      // Calculate date range
      const now = Date.now();
      const rangeMs = parseInt(dateRange) * 24 * 60 * 60 * 1000;
      const startDate = new Date(now - rangeMs);
      const endDate = new Date(now);

      // Fetch export data from API
      const response = await fetch(
        `/api/data/export?type=all&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const exportData = await response.json();

      // Convert to CSV
      const rows = [
        ["Analytics Report", new Date().toLocaleDateString()],
        [""],
        ["Summary"],
        ["Metric", "Value", "Trend"],
        ["Creators Recruited", stats.totalCreators.toString(), `${stats.creatorsTrend.toFixed(1)}%`],
        ["Content Gaps", stats.totalGaps.toString(), `${stats.gapsTrend.toFixed(1)}%`],
        ["Viral Content", stats.totalViral.toString(), `${stats.viralTrend.toFixed(1)}%`],
        [""],
        ["Monthly Growth"],
        ["Month", "Creators", "Campaigns", "Viral Content"],
        ...monthlyData.map((d) => [d.month, d.creators.toString(), d.campaigns.toString(), d.viral.toString()]),
        [""],
        ["City Breakdown"],
        ["City", "Creators", "Campaigns"],
        ...cityData.map((d) => [d.city, d.creators.toString(), d.campaigns.toString()]),
        [""],
        ["Content Categories"],
        ["Category", "Count"],
        ...categoryData.map((d) => [d.name, d.value.toString()]),
      ];

      const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics-report-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
      // Fallback to local export
      exportToCSV(stats, monthlyData, cityData, categoryData);
    }
  };

  const TrendIndicator = ({ trend }: { trend: number }) => {
    if (trend > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">+{trend.toFixed(1)}%</span>
        </div>
      );
    } else if (trend < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-semibold">{trend.toFixed(1)}%</span>
        </div>
      );
    }
    return <span className="text-sm text-slate-500">No change</span>;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE5D4' }}>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              <span>Analytics Dashboard</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <button
                onClick={refreshData}
                className="px-3 py-2 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Date Range</h2>
              <div className="flex gap-2">
                {(["7", "30", "90"] as DateRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      dateRange === range
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-white border border-orange-200 text-slate-700 hover:bg-orange-50"
                    }`}
                  >
                    Last {range} days
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-600/90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        }>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 text-xs sm:text-sm">Creators Recruited</span>
              <TrendIndicator trend={stats.creatorsTrend} />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">{stats.totalCreators}</div>
            <div className="text-xs text-slate-500">Cumulative count</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 text-xs sm:text-sm">Content Gaps</span>
              <TrendIndicator trend={stats.gapsTrend} />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">{stats.totalGaps}</div>
            <div className="text-xs text-slate-500">Identified</div>
          </div>
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6 hover:bg-white hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 text-xs sm:text-sm">Viral Content</span>
              <TrendIndicator trend={stats.viralTrend} />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">{stats.totalViral}</div>
            <div className="text-xs text-slate-500">Generated</div>
          </div>
        </div>
        </Suspense>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Line Chart - Growth Over Time */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-orange-600" />
              Growth Over Time
            </h3>
            <Suspense fallback={<ChartSkeleton />}>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="creators"
                    stroke="#FF6B35"
                    strokeWidth={2}
                    name="Creators"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="campaigns"
                    stroke="#4ECB71"
                    strokeWidth={2}
                    name="Campaigns"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="viral"
                    stroke="#00D4FF"
                    strokeWidth={2}
                    name="Viral Content"
                    dot={{ r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </Suspense>
          </div>

          {/* Bar Chart - Cities Comparison */}
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Cities Comparison
            </h3>
            <Suspense fallback={<ChartSkeleton />}>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={cityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="city" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="creators" fill="#FF6B35" name="Creators" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="campaigns" fill="#4ECB71" name="Campaigns" radius={[8, 8, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
        </div>

        {/* Pie Chart - Content Categories */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-orange-600" />
            Content Categories Distribution
          </h3>
          <Suspense fallback={<ChartSkeleton />}>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
