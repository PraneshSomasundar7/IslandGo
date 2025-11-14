"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Eye, MousePointerClick, Target, BarChart3, Filter, Plus, Play, Pause, CheckCircle, X, Loader2 } from "lucide-react";
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

interface Campaign {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed" | "Draft";
  budget: number;
  spent: number;
  start_date: Date;
  end_date: Date;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  platform: string;
  created_at: Date;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "Draft" as "Active" | "Paused" | "Completed" | "Draft",
    budget: "",
    start_date: "",
    end_date: "",
    platform: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "All" ? "/api/campaigns" : `/api/campaigns?status=${statusFilter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.map((c: any) => ({
          ...c,
          start_date: new Date(c.start_date),
          end_date: new Date(c.end_date),
          created_at: new Date(c.created_at),
        })));
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = (campaign: Campaign) => {
    if (campaign.spent === 0) return 0;
    return ((campaign.revenue - campaign.spent) / campaign.spent) * 100;
  };

  const calculateCTR = (campaign: Campaign) => {
    if (campaign.impressions === 0) return 0;
    return (campaign.clicks / campaign.impressions) * 100;
  };

  const calculateConversionRate = (campaign: Campaign) => {
    if (campaign.clicks === 0) return 0;
    return (campaign.conversions / campaign.clicks) * 100;
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.budget || !formData.start_date || !formData.end_date || !formData.platform) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          budget: parseFloat(formData.budget),
          spent: 0,
          start_date: formData.start_date,
          end_date: formData.end_date,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          platform: formData.platform,
        }),
      });

      if (response.ok) {
        setShowNewCampaignModal(false);
        setFormData({
          name: "",
          status: "Draft",
          budget: "",
          start_date: "",
          end_date: "",
          platform: "",
        });
        fetchCampaigns();
      } else {
        alert("Failed to create campaign. Please try again.");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-300";
      case "Paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Draft":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const totalStats = campaigns.reduce(
    (acc, campaign) => ({
      budget: acc.budget + campaign.budget,
      spent: acc.spent + campaign.spent,
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      conversions: acc.conversions + campaign.conversions,
      revenue: acc.revenue + campaign.revenue,
    }),
    { budget: 0, spent: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

  const performanceData = campaigns.map((campaign) => ({
    name: campaign.name.substring(0, 15),
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    conversions: campaign.conversions,
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
                Campaign Performance
              </h1>
              <p className="text-slate-700">Monitor and manage all your marketing campaigns</p>
            </div>
            <button
              onClick={() => setShowNewCampaignModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
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
                  <span className="text-sm text-slate-600">Total Budget</span>
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ${(totalStats.budget / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  ${(totalStats.spent / 1000).toFixed(1)}K spent
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Revenue</span>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ${(totalStats.revenue / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-green-600 mt-1">
                  ROI: {totalStats.spent > 0 ? (((totalStats.revenue - totalStats.spent) / totalStats.spent) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Conversions</span>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {totalStats.conversions.toLocaleString()}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {totalStats.clicks > 0 ? ((totalStats.conversions / totalStats.clicks) * 100).toFixed(2) : 0}% conversion rate
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Total Impressions</span>
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {(totalStats.impressions / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {totalStats.impressions > 0 ? ((totalStats.clicks / totalStats.impressions) * 100).toFixed(2) : 0}% CTR
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filter:</span>
          </div>
          {["All", "Active", "Paused", "Completed", "Draft"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                statusFilter === status
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white/90 text-slate-700 hover:bg-white border border-orange-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Campaign Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="impressions" fill="#FF6B35" name="Impressions" />
                  <Bar dataKey="clicks" fill="#4ECB71" name="Clicks" />
                  <Bar dataKey="conversions" fill="#00D4FF" name="Conversions" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Revenue vs Spend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={campaigns.map((c) => ({ name: c.name.substring(0, 10), revenue: c.revenue, spent: c.spent }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4ECB71" name="Revenue" />
                  <Line type="monotone" dataKey="spent" stroke="#FF6B35" name="Spent" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-orange-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">All Campaigns</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-orange-200 rounded animate-pulse" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No campaigns found. Create your first campaign to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Campaign</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Platform</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Budget</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Spent</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Revenue</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">ROI</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{campaign.name}</div>
                        <div className="text-xs text-slate-600">
                          {campaign.start_date.toLocaleDateString()} - {campaign.end_date.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                          {campaign.status === "Active" && <Play className="w-3 h-3 mr-1" />}
                          {campaign.status === "Paused" && <Pause className="w-3 h-3 mr-1" />}
                          {campaign.status === "Completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{campaign.platform}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">${(campaign.budget / 1000).toFixed(1)}K</td>
                      <td className="py-3 px-4 text-right text-slate-700">${(campaign.spent / 1000).toFixed(1)}K</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">${(campaign.revenue / 1000).toFixed(1)}K</td>
                      <td className="py-3 px-4 text-right">
                        <span className={calculateROI(campaign) >= 0 ? "text-green-600" : "text-red-600"}>
                          {calculateROI(campaign).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-700">{calculateCTR(campaign).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* New Campaign Modal */}
        {showNewCampaignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Create New Campaign</h3>
                <button
                  onClick={() => setShowNewCampaignModal(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter campaign name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Platform <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., Instagram, TikTok"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                    required
                    min="0"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-orange-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewCampaignModal(false)}
                    className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Campaign
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

